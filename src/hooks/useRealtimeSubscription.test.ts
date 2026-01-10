// useRealtimeSubscription Hook Unit Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'

// Mock channel object
const mockChannel = {
    on: vi.fn(function (this: typeof mockChannel) { return this }),
    subscribe: vi.fn(function (this: typeof mockChannel) { return this })
}

// Mock Supabase client
const mockSupabaseClient = {
    channel: vi.fn(() => mockChannel),
    removeChannel: vi.fn()
}

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockSupabaseClient
}))

import {
    useRealtimeSubscription,
    useRealtimeBlogs,
    useRealtimeProjects,
    useRealtimeSettings,
    useRealtimeTestimonials,
    useRealtimeMessages
} from './useRealtimeSubscription'

describe('useRealtimeSubscription', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset mock implementations
        mockChannel.on.mockImplementation(function (this: typeof mockChannel) { return this })
        mockChannel.subscribe.mockImplementation(function (this: typeof mockChannel) { return this })
        mockSupabaseClient.channel.mockReturnValue(mockChannel)
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    describe('useRealtimeSubscription hook', () => {
        it('creates a subscription for the specified table', () => {
            const onChange = vi.fn()

            renderHook(() => useRealtimeSubscription({
                table: 'blogs',
                onChange
            }))

            expect(mockSupabaseClient.channel).toHaveBeenCalledWith('realtime_blogs')
            expect(mockChannel.on).toHaveBeenCalledWith(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'blogs' },
                expect.any(Function)
            )
            expect(mockChannel.subscribe).toHaveBeenCalled()
        })

        it('does not create subscription when disabled', () => {
            renderHook(() => useRealtimeSubscription({
                table: 'blogs',
                enabled: false
            }))

            expect(mockSupabaseClient.channel).not.toHaveBeenCalled()
        })

        it('cleans up subscription on unmount', () => {
            const { unmount } = renderHook(() => useRealtimeSubscription({
                table: 'blogs'
            }))

            unmount()

            expect(mockSupabaseClient.removeChannel).toHaveBeenCalled()
        })

        it('provides unsubscribe function', () => {
            const { result } = renderHook(() => useRealtimeSubscription({
                table: 'blogs'
            }))

            expect(result.current.unsubscribe).toBeInstanceOf(Function)
        })
    })

    describe('convenience hooks', () => {
        it('useRealtimeBlogs subscribes to blogs table', () => {
            renderHook(() => useRealtimeBlogs({}))

            expect(mockSupabaseClient.channel).toHaveBeenCalledWith('realtime_blogs')
        })

        it('useRealtimeProjects subscribes to projects table', () => {
            renderHook(() => useRealtimeProjects({}))

            expect(mockSupabaseClient.channel).toHaveBeenCalledWith('realtime_projects')
        })

        it('useRealtimeSettings subscribes to settings table', () => {
            renderHook(() => useRealtimeSettings({}))

            expect(mockSupabaseClient.channel).toHaveBeenCalledWith('realtime_settings')
        })

        it('useRealtimeTestimonials subscribes to testimonials table', () => {
            renderHook(() => useRealtimeTestimonials({}))

            expect(mockSupabaseClient.channel).toHaveBeenCalledWith('realtime_testimonials')
        })

        it('useRealtimeMessages subscribes to contact_messages table', () => {
            renderHook(() => useRealtimeMessages({}))

            expect(mockSupabaseClient.channel).toHaveBeenCalledWith('realtime_contact_messages')
        })
    })
})
