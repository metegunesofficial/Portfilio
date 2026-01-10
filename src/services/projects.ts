// Project CRUD servisi - Real-time destekli, soft delete ile
import { getSupabaseClient } from '../lib/supabase-client'
import type { Project, InsertTables, UpdateTables } from '../types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type ProjectInsert = InsertTables<'projects'>
export type ProjectUpdate = UpdateTables<'projects'>

// Tüm aktif projeleri getir
export async function getProjects(options?: {
    publishedOnly?: boolean
    featuredOnly?: boolean
    includeDeleted?: boolean
}): Promise<Project[]> {
    const supabase = getSupabaseClient()
    let query = supabase
        .from('projects')
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

// Tek proje getir (slug ile)
export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
}

// Tek proje getir (id ile)
export async function getProjectById(id: string): Promise<Project | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
}

// Yeni proje oluştur
export async function createProject(project: ProjectInsert): Promise<Project> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Proje güncelle
export async function updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Proje soft delete
export async function deleteProject(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('projects')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Proje geri yükle
export async function restoreProject(id: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('projects')
        .update({ deleted_at: null, deleted_by: null })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// Proje yayın durumunu değiştir
export async function toggleProjectPublish(id: string, published: boolean): Promise<Project> {
    return updateProject(id, { published })
}

// Proje öne çıkarma durumunu değiştir
export async function toggleProjectFeatured(id: string, featured: boolean): Promise<Project> {
    return updateProject(id, { featured })
}

// Proje sırasını güncelle
export async function updateProjectOrder(id: string, order_index: number): Promise<Project> {
    return updateProject(id, { order_index })
}

// Real-time subscription
export function subscribeToProjectsChanges(
    callback: (payload: { eventType: string; new: Project | null; old: Project | null }) => void
): RealtimeChannel {
    const supabase = getSupabaseClient()
    return supabase
        .channel('projects_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'projects' },
            (payload) => {
                callback({
                    eventType: payload.eventType,
                    new: payload.new as Project | null,
                    old: payload.old as Project | null
                })
            }
        )
        .subscribe()
}
