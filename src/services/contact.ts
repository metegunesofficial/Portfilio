// Contact Messages servisi - Mesaj gönderme ve yönetim
import { getSupabaseClient } from '../lib/supabase-client'
import type { ContactMessage, InsertTables, UpdateTables } from '../types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type ContactMessageInsert = InsertTables<'contact_messages'>
export type ContactMessageUpdate = UpdateTables<'contact_messages'>

// Tüm mesajları getir (admin için)
export async function getContactMessages(options?: {
    status?: 'new' | 'read' | 'replied' | 'archived'
    includeDeleted?: boolean
}): Promise<ContactMessage[]> {
    const supabase = getSupabaseClient()
    let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    if (!options?.includeDeleted) {
        query = query.is('deleted_at', null)
    }

    if (options?.status) {
        query = query.eq('status', options.status)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data || []
}

// Tek mesaj getir
export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
}

// Yeni mesaj gönder (public - iletişim formu)
export async function sendContactMessage(message: {
    name: string
    email: string
    message: string
    phone?: string
    subject?: string
    kvkk_consent: boolean
}): Promise<ContactMessage> {
    const supabase = getSupabaseClient()

    const messageData: ContactMessageInsert = {
        name: message.name,
        email: message.email,
        message: message.message,
        phone: message.phone || null,
        subject: message.subject || null,
        kvkk_consent: message.kvkk_consent,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        status: 'new'
    }

    const { data, error } = await supabase
        .from('contact_messages')
        .insert(messageData)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Mesaj durumunu güncelle
export async function updateMessageStatus(
    id: string,
    status: 'new' | 'read' | 'replied' | 'archived'
): Promise<ContactMessage> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Mesajı okundu işaretle
export async function markMessageAsRead(id: string): Promise<ContactMessage> {
    return updateMessageStatus(id, 'read')
}

// Mesajı yanıtlandı işaretle
export async function markMessageAsReplied(id: string): Promise<ContactMessage> {
    return updateMessageStatus(id, 'replied')
}

// Mesajı arşivle
export async function archiveMessage(id: string): Promise<ContactMessage> {
    return updateMessageStatus(id, 'archived')
}

// Mesaj soft delete
export async function deleteContactMessage(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('contact_messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Mesaj geri yükle
export async function restoreContactMessage(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('contact_messages')
        .update({ deleted_at: null, deleted_by: null })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Yeni mesaj sayısını getir
export async function getNewMessagesCount(): Promise<number> {
    const supabase = getSupabaseClient()
    const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')
        .is('deleted_at', null)

    if (error) throw new Error(error.message)
    return count || 0
}

// Real-time subscription
export function subscribeToMessagesChanges(
    callback: (payload: { eventType: string; new: ContactMessage | null; old: ContactMessage | null }) => void
): RealtimeChannel {
    const supabase = getSupabaseClient()
    return supabase
        .channel('contact_messages_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'contact_messages' },
            (payload) => {
                callback({
                    eventType: payload.eventType,
                    new: payload.new as ContactMessage | null,
                    old: payload.old as ContactMessage | null
                })
            }
        )
        .subscribe()
}
