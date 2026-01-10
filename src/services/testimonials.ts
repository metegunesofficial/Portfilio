// Testimonials CRUD servisi - Real-time destekli, soft delete ile
import { getSupabaseClient } from '../lib/supabase-client'
import type { Testimonial, InsertTables, UpdateTables } from '../types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type TestimonialInsert = InsertTables<'testimonials'>
export type TestimonialUpdate = UpdateTables<'testimonials'>

// Tüm aktif referansları getir
export async function getTestimonials(options?: {
    publishedOnly?: boolean
    featuredOnly?: boolean
    includeDeleted?: boolean
}): Promise<Testimonial[]> {
    const supabase = getSupabaseClient()
    let query = supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true })

    if (!options?.includeDeleted) {
        query = query.is('deleted_at', null)
    }

    if (options?.publishedOnly) {
        query = query.eq('published', true)
    }

    if (options?.featuredOnly) {
        query = query.eq('featured', true)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data || []
}

// Tek referans getir (id ile)
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
}

// Yeni referans oluştur
export async function createTestimonial(testimonial: TestimonialInsert): Promise<Testimonial> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Referans güncelle
export async function updateTestimonial(id: string, updates: TestimonialUpdate): Promise<Testimonial> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Referans soft delete
export async function deleteTestimonial(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('testimonials')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Referans geri yükle
export async function restoreTestimonial(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('testimonials')
        .update({ deleted_at: null, deleted_by: null })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Referans yayın durumunu değiştir
export async function toggleTestimonialPublish(id: string, published: boolean): Promise<Testimonial> {
    return updateTestimonial(id, { published })
}

// Referans öne çıkarma durumunu değiştir
export async function toggleTestimonialFeatured(id: string, featured: boolean): Promise<Testimonial> {
    return updateTestimonial(id, { featured })
}

// Real-time subscription
export function subscribeToTestimonialsChanges(
    callback: (payload: { eventType: string; new: Testimonial | null; old: Testimonial | null }) => void
): RealtimeChannel {
    const supabase = getSupabaseClient()
    return supabase
        .channel('testimonials_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'testimonials' },
            (payload) => {
                callback({
                    eventType: payload.eventType,
                    new: payload.new as Testimonial | null,
                    old: payload.old as Testimonial | null
                })
            }
        )
        .subscribe()
}
