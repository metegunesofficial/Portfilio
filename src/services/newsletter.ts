// Newsletter Subscription Service - Supabase bağlantılı
import { getSupabaseClient } from '../lib/supabase-client'
import type { NewsletterSubscriber, InsertTables, UpdateTables } from '../types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type NewsletterSubscriberInsert = InsertTables<'newsletter_subscribers'>
export type NewsletterSubscriberUpdate = UpdateTables<'newsletter_subscribers'>

export interface SubscribeResult {
    success: boolean
    error?: string
    subscriber?: NewsletterSubscriber
}

// Bültene abone ol
export async function subscribeToNewsletter(
    email: string,
    name?: string,
    source: string = 'website'
): Promise<SubscribeResult> {
    const supabase = getSupabaseClient()

    // Email zaten kayıtlı mı kontrol et
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single()

    if (existing) {
        // Eğer unsubscribed ise tekrar aktif yap
        if (existing.status === 'unsubscribed') {
            const { data, error } = await supabase
                .from('newsletter_subscribers')
                .update({
                    status: 'active',
                    unsubscribed_at: null,
                    subscribed_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single()

            if (error) {
                return { success: false, error: error.message }
            }
            return { success: true, subscriber: data }
        }

        // Zaten aktif abone
        return {
            success: false,
            error: 'Bu e-posta adresi zaten bültenimize kayıtlı.'
        }
    }

    // Yeni abone ekle
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
            email: email.toLowerCase().trim(),
            name: name || null,
            source,
            status: 'active',
            subscribed_at: new Date().toISOString()
        })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' }
        }
        return { success: false, error: error.message }
    }

    // Unsubscribe token oluştur
    await createUnsubscribeToken(data.id)

    return { success: true, subscriber: data }
}

// Unsubscribe token oluştur
async function createUnsubscribeToken(subscriberId: string): Promise<string | null> {
    const supabase = getSupabaseClient()
    const token = generateSecureToken()

    const { error } = await supabase
        .from('unsubscribe_tokens')
        .insert({
            subscriber_id: subscriberId,
            token
        })

    if (error) {
        console.error('Failed to create unsubscribe token:', error)
        return null
    }

    return token
}

// Güvenli token oluştur
function generateSecureToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Token ile abonelikten çık
export async function unsubscribeByToken(token: string): Promise<SubscribeResult> {
    const supabase = getSupabaseClient()

    // Token'ı bul
    const { data: tokenData, error: tokenError } = await supabase
        .from('unsubscribe_tokens')
        .select('*, newsletter_subscribers(*)')
        .eq('token', token)
        .is('used_at', null)
        .single()

    if (tokenError || !tokenData) {
        return { success: false, error: 'Geçersiz veya kullanılmış bağlantı.' }
    }

    // Aboneliği iptal et
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({
            status: 'unsubscribed',
            unsubscribed_at: new Date().toISOString()
        })
        .eq('id', tokenData.subscriber_id)
        .select()
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    // Token'ı kullanıldı olarak işaretle
    await supabase
        .from('unsubscribe_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenData.id)

    return { success: true, subscriber: data }
}

// Abone ID ile abonelikten çık (admin için)
export async function unsubscribeById(subscriberId: string): Promise<boolean> {
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
            status: 'unsubscribed',
            unsubscribed_at: new Date().toISOString()
        })
        .eq('id', subscriberId)

    if (error) throw new Error(error.message)
    return true
}

// Aktif aboneleri getir
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('status', 'active')
        .is('deleted_at', null)
        .order('subscribed_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
}

// Tüm aboneleri getir (admin için)
export async function getAllSubscribers(options?: {
    status?: 'active' | 'unsubscribed' | 'bounced'
    includeDeleted?: boolean
}): Promise<NewsletterSubscriber[]> {
    const supabase = getSupabaseClient()

    let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })

    if (options?.status) {
        query = query.eq('status', options.status)
    }

    if (!options?.includeDeleted) {
        query = query.is('deleted_at', null)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data || []
}

// Abone istatistikleri
export interface SubscriberStats {
    total: number
    active: number
    unsubscribed: number
    bounced: number
    thisMonth: number
    lastMonth: number
    growthRate: number
}

export async function getSubscriberStats(): Promise<SubscriberStats> {
    const supabase = getSupabaseClient()

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

    // Tüm aboneler
    const { data: all } = await supabase
        .from('newsletter_subscribers')
        .select('status, subscribed_at')
        .is('deleted_at', null)

    const subscribers = all || []

    const active = subscribers.filter(s => s.status === 'active').length
    const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length
    const bounced = subscribers.filter(s => s.status === 'bounced').length

    const thisMonth = subscribers.filter(s =>
        s.subscribed_at && s.subscribed_at >= startOfMonth
    ).length

    const lastMonth = subscribers.filter(s =>
        s.subscribed_at &&
        s.subscribed_at >= startOfLastMonth &&
        s.subscribed_at <= endOfLastMonth
    ).length

    const growthRate = lastMonth > 0
        ? ((thisMonth - lastMonth) / lastMonth) * 100
        : thisMonth > 0 ? 100 : 0

    return {
        total: subscribers.length,
        active,
        unsubscribed,
        bounced,
        thisMonth,
        lastMonth,
        growthRate: Math.round(growthRate * 10) / 10
    }
}

// Abone sil (soft delete)
export async function deleteSubscriber(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Abone geri yükle
export async function restoreSubscriber(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ deleted_at: null, deleted_by: null })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Abone için unsubscribe token getir
export async function getUnsubscribeToken(subscriberId: string): Promise<string | null> {
    const supabase = getSupabaseClient()

    // Mevcut kullanılmamış token var mı?
    const { data: existing } = await supabase
        .from('unsubscribe_tokens')
        .select('token')
        .eq('subscriber_id', subscriberId)
        .is('used_at', null)
        .single()

    if (existing) {
        return existing.token
    }

    // Yoksa yeni oluştur
    return createUnsubscribeToken(subscriberId)
}

// Real-time subscription
export function subscribeToSubscribersChanges(
    callback: (payload: { eventType: string; new: NewsletterSubscriber | null; old: NewsletterSubscriber | null }) => void
): RealtimeChannel {
    const supabase = getSupabaseClient()
    return supabase
        .channel('newsletter_subscribers_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'newsletter_subscribers' },
            (payload) => {
                callback({
                    eventType: payload.eventType,
                    new: payload.new as NewsletterSubscriber | null,
                    old: payload.old as NewsletterSubscriber | null
                })
            }
        )
        .subscribe()
}
