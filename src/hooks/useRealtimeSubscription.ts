// Real-time subscription hook
import { useEffect, useRef, useCallback } from 'react'
import { getSupabaseClient } from '../lib/supabase-client'
import type { RealtimeChannel } from '@supabase/supabase-js'

type TableName = 'blogs' | 'projects' | 'settings' | 'testimonials' | 'contact_messages'

interface RealtimePayload<T> {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
    new: T | null
    old: T | null
}

interface UseRealtimeOptions<T> {
    table: TableName
    onInsert?: (record: T) => void
    onUpdate?: (newRecord: T, oldRecord: T | null) => void
    onDelete?: (record: T) => void
    onChange?: (payload: RealtimePayload<T>) => void
    enabled?: boolean
}

export function useRealtimeSubscription<T>(options: UseRealtimeOptions<T>) {
    const { table, onInsert, onUpdate, onDelete, onChange, enabled = true } = options
    const channelRef = useRef<RealtimeChannel | null>(null)

    const handleChange = useCallback((payload: RealtimePayload<T>) => {
        // Call general onChange handler
        onChange?.(payload)

        // Call specific handlers
        switch (payload.eventType) {
            case 'INSERT':
                if (payload.new) onInsert?.(payload.new)
                break
            case 'UPDATE':
                if (payload.new) onUpdate?.(payload.new, payload.old)
                break
            case 'DELETE':
                if (payload.old) onDelete?.(payload.old)
                break
        }
    }, [onChange, onInsert, onUpdate, onDelete])

    useEffect(() => {
        if (!enabled) return

        const supabase = getSupabaseClient()

        channelRef.current = supabase
            .channel(`realtime_${table}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                (payload) => {
                    handleChange({
                        eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
                        new: payload.new as T | null,
                        old: payload.old as T | null
                    })
                }
            )
            .subscribe()

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
        }
    }, [table, enabled, handleChange])

    // Manual unsubscribe function
    const unsubscribe = useCallback(() => {
        if (channelRef.current) {
            const supabase = getSupabaseClient()
            supabase.removeChannel(channelRef.current)
            channelRef.current = null
        }
    }, [])

    return { unsubscribe }
}

// Convenience hooks for specific tables
export function useRealtimeBlogs(handlers: Omit<UseRealtimeOptions<unknown>, 'table'>) {
    return useRealtimeSubscription({ ...handlers, table: 'blogs' })
}

export function useRealtimeProjects(handlers: Omit<UseRealtimeOptions<unknown>, 'table'>) {
    return useRealtimeSubscription({ ...handlers, table: 'projects' })
}

export function useRealtimeSettings(handlers: Omit<UseRealtimeOptions<unknown>, 'table'>) {
    return useRealtimeSubscription({ ...handlers, table: 'settings' })
}

export function useRealtimeTestimonials(handlers: Omit<UseRealtimeOptions<unknown>, 'table'>) {
    return useRealtimeSubscription({ ...handlers, table: 'testimonials' })
}

export function useRealtimeMessages(handlers: Omit<UseRealtimeOptions<unknown>, 'table'>) {
    return useRealtimeSubscription({ ...handlers, table: 'contact_messages' })
}
