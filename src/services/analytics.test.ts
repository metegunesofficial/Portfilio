// Analytics Service Unit Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const createMockClient = () => {
    const mock: any = {
        from: vi.fn(),
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        eq: vi.fn(),
        gte: vi.fn(),
        lte: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        single: vi.fn()
    }

    mock.from.mockReturnValue(mock)
    mock.select.mockReturnValue(mock)
    mock.insert.mockReturnValue(mock)
    mock.update.mockReturnValue(mock)
    mock.delete.mockReturnValue(mock)
    mock.eq.mockReturnValue(mock)
    mock.gte.mockReturnValue(mock)
    mock.lte.mockReturnValue(mock)
    mock.order.mockReturnValue(mock)
    mock.limit.mockReturnValue(mock)
    mock.single.mockReturnValue(mock)

    mock.then = (resolve: any) => resolve({ data: [], error: null })

    return mock
}

let mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

import {
    trackPageView,
    getPageViewStats,
    getRecentPageViews,
    getDailyViewCounts
} from './analytics'

describe('Analytics Service', () => {
    const originalUserAgent = navigator.userAgent
    const mockSessionStorage = (() => {
        let store: Record<string, string> = {}
        return {
            getItem: vi.fn((key: string) => store[key] || null),
            setItem: vi.fn((key: string, value: string) => {
                store[key] = value.toString()
            }),
            clear: () => {
                store = {}
            }
        }
    })()

    beforeEach(() => {
        mockClient = createMockClient()
        Object.defineProperty(window, 'sessionStorage', {
            value: mockSessionStorage
        })
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            writable: true
        })
        mockSessionStorage.clear()
        vi.unstubAllGlobals()
    })

    afterEach(() => {
        vi.clearAllMocks()
        Object.defineProperty(window.navigator, 'userAgent', {
            value: originalUserAgent,
            writable: true
        })
    })

    describe('trackPageView', () => {
        it('tracks a page view and creates session id if not exists', async () => {
            const pageData = { path: '/home', referrer: 'google.com' }

            await trackPageView(pageData)

            // Since it's fire-and-forget, we assume it runs
            expect(mockSessionStorage.getItem).toHaveBeenCalledWith('analytics_session')
            expect(mockSessionStorage.setItem).toHaveBeenCalled()

            // Wait for async IIFE to potential execute
            await new Promise(resolve => setTimeout(resolve, 0))

            expect(mockClient.insert).toHaveBeenCalledWith(expect.objectContaining({
                path: '/home',
                referrer: 'google.com',
                device_type: 'desktop'
            }))
        })

        it('detects mobile device', async () => {
            Object.defineProperty(window.navigator, 'userAgent', {
                value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
                writable: true
            })

            await trackPageView({ path: '/mobile' })
            await new Promise(resolve => setTimeout(resolve, 0))

            expect(mockClient.insert).toHaveBeenCalledWith(expect.objectContaining({
                device_type: 'mobile'
            }))
        })
    })

    describe('getPageViewStats', () => {
        it('calculates stats correctly', async () => {
            const mockViews = [
                { session_id: 's1', path: '/home', device_type: 'desktop', created_at: '2023-01-01T10:00:00Z' },
                { session_id: 's1', path: '/about', device_type: 'desktop', created_at: '2023-01-01T10:05:00Z' },
                { session_id: 's2', path: '/home', device_type: 'mobile', created_at: '2023-01-01T11:00:00Z' }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockViews, error: null })

            const stats = await getPageViewStats()

            expect(stats.totalViews).toBe(3)
            expect(stats.uniqueSessions).toBe(2)

            // Checks top pages
            expect(stats.topPages).toEqual([
                { path: '/home', count: 2 },
                { path: '/about', count: 1 }
            ])

            // Checks device breakdown
            // Note: Implementation doesn't sort device breakdown explicitly in array order, so order might vary.
            // But with Object.entries it usually follows insertion order or alphabetical key order in JS engines.
            // Let's just check containing items.
            expect(stats.deviceBreakdown).toEqual(expect.arrayContaining([
                { device_type: 'desktop', count: 2 },
                { device_type: 'mobile', count: 1 }
            ]))
        })

        it('filters by date range', async () => {
            const startDate = new Date('2023-01-01')
            const endDate = new Date('2023-01-31')

            mockClient.then = (resolve: any) => resolve({ data: [], error: null })

            await getPageViewStats({ startDate, endDate })

            expect(mockClient.gte).toHaveBeenCalledWith('created_at', startDate.toISOString())
            expect(mockClient.lte).toHaveBeenCalledWith('created_at', endDate.toISOString())
        })
    })

    describe('getRecentPageViews', () => {
        it('fetches recent page views', async () => {
            const mockViews = [{ id: '1', path: '/test' }]

            mockClient.then = (resolve: any) => resolve({ data: mockViews, error: null })

            const result = await getRecentPageViews(50)

            expect(mockClient.gte).toHaveBeenCalled() // checks for yesterday logic
            expect(mockClient.order).toHaveBeenCalledWith('created_at', { ascending: false })
            expect(mockClient.limit).toHaveBeenCalledWith(50)
            expect(result).toEqual(mockViews)
        })
    })

    describe('getDailyViewCounts', () => {
        it('aggregates daily counts', async () => {
            const mockViews = [
                { created_at: '2023-01-01T10:00:00Z' },
                { created_at: '2023-01-01T15:00:00Z' },
                { created_at: '2023-01-02T09:00:00Z' }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockViews, error: null })

            const result = await getDailyViewCounts(7)

            expect(result).toEqual([
                { date: '2023-01-01', count: 2 },
                { date: '2023-01-02', count: 1 }
            ])
            expect(mockClient.gte).toHaveBeenCalled()
        })
    })
})
