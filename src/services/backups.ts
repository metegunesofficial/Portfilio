// Data Backup servisi - Veri yedekleme ve geri yükleme
import { getSupabaseClient } from '../lib/supabase-client'
import type { DataBackup, Json } from '../types/supabase'

// Backup geçmişini getir
export async function getBackupHistory(options?: {
    tableName?: string
    recordId?: string
    operation?: 'INSERT' | 'UPDATE' | 'DELETE' | 'RESTORE'
    limit?: number
}): Promise<DataBackup[]> {
    const supabase = getSupabaseClient()
    let query = supabase
        .from('data_backups')
        .select('*')
        .order('changed_at', { ascending: false })

    if (options?.tableName) {
        query = query.eq('table_name', options.tableName)
    }

    if (options?.recordId) {
        query = query.eq('record_id', options.recordId)
    }

    if (options?.operation) {
        query = query.eq('operation', options.operation)
    }

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data || []
}

// Tek kaydın backup geçmişini getir
export async function getRecordHistory(
    tableName: string,
    recordId: string
): Promise<DataBackup[]> {
    return getBackupHistory({ tableName, recordId })
}

// Belirli bir versiyona geri dön
export async function restoreToVersion(
    tableName: string,
    recordId: string,
    backupId: string
): Promise<boolean> {
    const supabase = getSupabaseClient()

    // Backup'ı getir
    const { data: backup, error: backupError } = await supabase
        .from('data_backups')
        .select('*')
        .eq('id', backupId)
        .single()

    if (backupError) throw new Error(backupError.message)
    if (!backup) throw new Error('Backup bulunamadı')

    // Eski veriyi al (UPDATE veya DELETE ise old_data, INSERT ise new_data)
    const restoreData = backup.operation === 'INSERT'
        ? backup.new_data
        : backup.old_data

    if (!restoreData) throw new Error('Geri yüklenecek veri bulunamadı')

    // ID'yi ve timestamp'leri çıkar
    const { id, created_at, updated_at, deleted_at, deleted_by, ...cleanData } = restoreData as Record<string, unknown>

    // Kaydı güncelle - tableName is dynamically passed so we need to cast it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
        .from(tableName)
        .update({ ...cleanData, deleted_at: null, deleted_by: null })
        .eq('id', recordId)

    if (error) throw new Error(error.message)
    return true
}

// Silinmiş kayıtları listele
export async function getDeletedRecords(tableName: string): Promise<Array<{
    id: string
    deleted_at: string
    data: Json
}>> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
        .from('data_backups')
        .select('record_id, changed_at, old_data')
        .eq('table_name', tableName)
        .eq('operation', 'DELETE')
        .order('changed_at', { ascending: false })

    if (error) throw new Error(error.message)

    return (data || []).map(d => ({
        id: d.record_id,
        deleted_at: d.changed_at,
        data: d.old_data
    }))
}

// Backup istatistikleri
export async function getBackupStats(): Promise<{
    totalBackups: number
    byTable: Array<{ table_name: string; count: number }>
    byOperation: Array<{ operation: string; count: number }>
    last24Hours: number
}> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
        .from('data_backups')
        .select('table_name, operation, changed_at')

    if (error) throw new Error(error.message)

    const backups = data || []
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    // By table
    const tableCounts: Record<string, number> = {}
    backups.forEach(b => {
        tableCounts[b.table_name] = (tableCounts[b.table_name] || 0) + 1
    })

    // By operation
    const opCounts: Record<string, number> = {}
    backups.forEach(b => {
        opCounts[b.operation] = (opCounts[b.operation] || 0) + 1
    })

    // Last 24 hours
    const last24Hours = backups.filter(b =>
        new Date(b.changed_at) > yesterday
    ).length

    return {
        totalBackups: backups.length,
        byTable: Object.entries(tableCounts).map(([table_name, count]) => ({ table_name, count })),
        byOperation: Object.entries(opCounts).map(([operation, count]) => ({ operation, count })),
        last24Hours
    }
}
