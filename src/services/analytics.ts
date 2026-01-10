// Analytics servisi - Sayfa görüntüleme takibi
import { getSupabaseClient } from '../lib/supabase-client'
import type { PageView, InsertTables } from '../types/supabase'

export type PageViewInsert = InsertTables<'page_views'>

// Sayfa görüntüleme kaydet
export async function trackPageView(pageData: {
    path: string
    referrer?: string
}): Promise<void> {
    const supabase = getSupabaseClient()

    // Session ID oluştur veya mevcut olanı kullan
    let sessionId = sessionStorage.getItem('analytics_session')
    if (!sessionId) {
        sessionId = crypto.randomUUID()
        sessionStorage.setItem('analytics_session', sessionId)
    }

    // Device type belirle
    const userAgent = navigator.userAgent
    let deviceType = 'desktop'
    if (/mobile/i.test(userAgent)) {
        deviceType = 'mobile'
    } else if (/tablet|ipad/i.test(userAgent)) {
        deviceType = 'tablet'
    }

    const viewData: PageViewInsert = {
        path: pageData.path,
        referrer: pageData.referrer || document.referrer || null,
        user_agent: userAgent,
        device_type: deviceType,
        session_id: sessionId
    }

        // Fire and forget - hata olsa bile UI'ı etkilemesin
        ; (async () => {
            try {
                await supabase.from('page_views').insert(viewData)
            } catch (err) {
                console.warn('Analytics error:', err)
            }
        })()
}

// Sayfa görüntüleme istatistikleri (admin için)
export async function getPageViewStats(options?: {
    startDate?: Date
    endDate?: Date
    path?: string
}): Promise<{
    totalViews: number
    uniqueSessions: number
    topPages: Array<{ path: string; count: number }>
    deviceBreakdown: Array<{ device_type: string; count: number }>
}> {
    const supabase = getSupabaseClient()

    let query = supabase
        .from('page_views')
        .select('*')

    if (options?.startDate) {
        query = query.gte('created_at', options.startDate.toISOString())
    }

    if (options?.endDate) {
        query = query.lte('created_at', options.endDate.toISOString())
    }

    if (options?.path) {
        query = query.eq('path', options.path)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)

    const views = data || []

    // Total views
    const totalViews = views.length

    // Unique sessions
    const uniqueSessions = new Set(views.map(v => v.session_id)).size

    // Top pages
    const pageCounts: Record<string, number> = {}
    views.forEach(v => {
        pageCounts[v.path] = (pageCounts[v.path] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

    // Device breakdown
    const deviceCounts: Record<string, number> = {}
    views.forEach(v => {
        const device = v.device_type || 'unknown'
        deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })
    const deviceBreakdown = Object.entries(deviceCounts)
        .map(([device_type, count]) => ({ device_type, count }))

    return {
        totalViews,
        uniqueSessions,
        topPages,
        deviceBreakdown
    }
}

// Son 24 saat görüntülemeler
export async function getRecentPageViews(limit = 100): Promise<PageView[]> {
    const supabase = getSupabaseClient()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
}

// Günlük görüntüleme sayısı (son X gün)
export async function getDailyViewCounts(days = 30): Promise<Array<{ date: string; count: number }>> {
    const supabase = getSupabaseClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('page_views')
        .select('created_at')
        .gte('created_at', startDate.toISOString())

    if (error) throw new Error(error.message)

    const views = data || []
    const dailyCounts: Record<string, number> = {}

    views.forEach(v => {
        const date = v.created_at.split('T')[0]
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    return Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
}
