// Blog CRUD servisi - Real-time destekli, soft delete ile
import { getSupabaseClient } from '../lib/supabase-client'
import type { Blog, InsertTables, UpdateTables } from '../types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type BlogInsert = InsertTables<'blogs'>
export type BlogUpdate = UpdateTables<'blogs'>

// Tüm aktif blogları getir
export async function getBlogs(options?: {
    publishedOnly?: boolean
    includeDeleted?: boolean
}): Promise<Blog[]> {
    const supabase = getSupabaseClient()
    let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

    if (!options?.includeDeleted) {
        query = query.is('deleted_at', null)
    }

    if (options?.publishedOnly) {
        query = query.eq('published', true)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data || []
}

// Tek blog getir (slug ile)
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
}

// Tek blog getir (id ile)
export async function getBlogById(id: string): Promise<Blog | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
}

// Yeni blog oluştur
export async function createBlog(blog: BlogInsert): Promise<Blog> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('blogs')
        .insert(blog)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Blog güncelle
export async function updateBlog(id: string, updates: BlogUpdate): Promise<Blog> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Blog soft delete (gerçekten silmez, sadece işaretler)
export async function deleteBlog(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('blogs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Blog geri yükle
export async function restoreBlog(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('blogs')
        .update({ deleted_at: null, deleted_by: null })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Blog yayın durumunu değiştir
export async function toggleBlogPublish(id: string, published: boolean): Promise<Blog> {
    return updateBlog(id, { published })
}

// Real-time subscription
export function subscribeToBlogsChanges(
    callback: (payload: { eventType: string; new: Blog | null; old: Blog | null }) => void
): RealtimeChannel {
    const supabase = getSupabaseClient()
    return supabase
        .channel('blogs_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'blogs' },
            (payload) => {
                callback({
                    eventType: payload.eventType,
                    new: payload.new as Blog | null,
                    old: payload.old as Blog | null
                })
            }
        )
        .subscribe()
}
