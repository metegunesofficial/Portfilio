// Settings CRUD servisi - Real-time destekli
import { getSupabaseClient } from '../lib/supabase-client'
import type { Setting, InsertTables, UpdateTables } from '../types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type SettingInsert = InsertTables<'settings'>
export type SettingUpdate = UpdateTables<'settings'>

// Tüm ayarları getir
export async function getSettings(): Promise<Setting[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .is('deleted_at', null)
        .order('key', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
}

// Tek ayar getir (key ile)
export async function getSettingByKey(key: string): Promise<Setting | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .is('deleted_at', null)
        .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
}

// Ayarları key-value map olarak getir
export async function getSettingsMap(lang: 'tr' | 'en' = 'tr'): Promise<Record<string, string>> {
    const settings = await getSettings()
    const map: Record<string, string> = {}

    for (const setting of settings) {
        const value = lang === 'tr' ? setting.value_tr : setting.value_en
        if (value !== null) {
            // JSON tipinde ise parse et
            if (setting.type === 'json') {
                try {
                    map[setting.key] = JSON.parse(value)
                } catch {
                    map[setting.key] = value
                }
            } else {
                map[setting.key] = value
            }
        }
    }

    return map
}

// Yeni ayar oluştur
export async function createSetting(setting: SettingInsert): Promise<Setting> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('settings')
        .insert(setting)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Ayar güncelle (key ile)
export async function updateSettingByKey(key: string, updates: SettingUpdate): Promise<Setting> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('key', key)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Ayar güncelle (id ile)
export async function updateSetting(id: string, updates: SettingUpdate): Promise<Setting> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// Birden fazla ayarı güncelle
export async function updateMultipleSettings(
    settings: Array<{ key: string; value_tr?: string; value_en?: string }>
): Promise<void> {
    const supabase = getSupabaseClient()

    for (const setting of settings) {
        const { error } = await supabase
            .from('settings')
            .update({ value_tr: setting.value_tr, value_en: setting.value_en })
            .eq('key', setting.key)

        if (error) throw new Error(error.message)
    }
}

// Ayar soft delete
export async function deleteSetting(key: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
        .from('settings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('key', key)

    if (error) throw new Error(error.message)
    return true
}

// Real-time subscription
export function subscribeToSettingsChanges(
    callback: (payload: { eventType: string; new: Setting | null; old: Setting | null }) => void
): RealtimeChannel {
    const supabase = getSupabaseClient()
    return supabase
        .channel('settings_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'settings' },
            (payload) => {
                callback({
                    eventType: payload.eventType,
                    new: payload.new as Setting | null,
                    old: payload.old as Setting | null
                })
            }
        )
        .subscribe()
}
