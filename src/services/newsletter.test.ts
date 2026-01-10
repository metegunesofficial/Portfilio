// Newsletter Service Unit Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Create a proper chainable mock that returns itself for all query methods
const createMockClient = () => {
    const mock: any = {
        from: vi.fn(),
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        eq: vi.fn(),
        is: vi.fn(),
        or: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
        channel: vi.fn()
    }

    // Make each method return mock for chaining
    mock.from.mockReturnValue(mock)
    mock.select.mockReturnValue(mock)
    mock.insert.mockReturnValue(mock)
    mock.update.mockReturnValue(mock)
    mock.delete.mockReturnValue(mock)
    mock.eq.mockReturnValue(mock)
    mock.is.mockReturnValue(mock)
    mock.or.mockReturnValue(mock)
    mock.order.mockReturnValue(mock)
    mock.limit.mockReturnValue(mock)
    mock.single.mockReturnValue(mock)
    mock.maybeSingle.mockReturnValue(mock)
    mock.channel.mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })

    // Default then for promise resolution
    mock.then = (resolve: any) => resolve({ data: [], error: null })

    return mock
}

let mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

import {
    subscribeToNewsletter,
    unsubscribeByToken,
    getAllSubscribers,
    getActiveSubscribers,
    subscribeToSubscribersChanges
} from './newsletter'

describe('Newsletter Service', () => {
    beforeEach(() => {
        mockClient = createMockClient()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('subscribeToNewsletter', () => {
        it('subscribes a new email', async () => {
            const newSubscriber = { id: '123', email: 'test@example.com', status: 'active' }

            // Mock maybeSingle() to return null first (not found), then insert succeeds
            mockClient.maybeSingle
                .mockImplementationOnce(() => Promise.resolve({ data: null, error: null }))

            mockClient.single
                .mockImplementationOnce(() => Promise.resolve({ data: newSubscriber, error: null }))
                .mockImplementationOnce(() => Promise.resolve({ data: { id: 'token123' }, error: null }))

            const result = await subscribeToNewsletter('test@example.com', 'Test User')

            expect(mockClient.from).toHaveBeenCalledWith('newsletter_subscribers')
            expect(result.success).toBe(true)
        })

        it('returns error for already subscribed email', async () => {
            const existingSubscriber = { id: '123', email: 'test@example.com', status: 'active' }

            mockClient.maybeSingle.mockImplementationOnce(() => Promise.resolve({ data: existingSubscriber, error: null }))

            const result = await subscribeToNewsletter('test@example.com')

            expect(result.success).toBe(false)
            expect(result.error).toContain('zaten')
        })

        it('reactivates unsubscribed email', async () => {
            const existingSubscriber = { id: '123', email: 'test@example.com', status: 'unsubscribed' }
            const reactivatedSubscriber = { ...existingSubscriber, status: 'active' }

            mockClient.maybeSingle
                .mockImplementationOnce(() => Promise.resolve({ data: existingSubscriber, error: null }))

            mockClient.single
                .mockImplementationOnce(() => Promise.resolve({ data: reactivatedSubscriber, error: null }))

            const result = await subscribeToNewsletter('test@example.com')

            expect(result.success).toBe(true)
        })
    })

    describe('unsubscribeByToken', () => {
        it('unsubscribes via token', async () => {
            const token = { subscriber_id: '123', used: false }
            const subscriber = { id: '123', email: 'test@example.com', status: 'unsubscribed' }

            mockClient.single
                .mockImplementationOnce(() => Promise.resolve({ data: token, error: null }))
                .mockImplementationOnce(() => Promise.resolve({ data: {}, error: null }))
                .mockImplementationOnce(() => Promise.resolve({ data: subscriber, error: null }))

            const result = await unsubscribeByToken('valid-token')

            expect(result.success).toBe(true)
        })

        it('returns error for invalid token', async () => {
            mockClient.single.mockImplementationOnce(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }))

            const result = await unsubscribeByToken('invalid-token')

            expect(result.success).toBe(false)
        })
    })

    describe('getAllSubscribers', () => {
        it('fetches all subscribers with includeDeleted', async () => {
            const mockSubscribers = [
                { id: '1', email: 'test1@example.com', status: 'active' },
                { id: '2', email: 'test2@example.com', status: 'active' }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockSubscribers, error: null })

            const result = await getAllSubscribers({ includeDeleted: true })

            expect(mockClient.from).toHaveBeenCalledWith('newsletter_subscribers')
            expect(result).toEqual(mockSubscribers)
        })
    })

    describe('getActiveSubscribers', () => {
        it('fetches only active subscribers', async () => {
            const mockSubscribers = [
                { id: '1', email: 'test1@example.com', status: 'active' }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockSubscribers, error: null })

            const result = await getActiveSubscribers()

            expect(mockClient.eq).toHaveBeenCalledWith('status', 'active')
            expect(result).toEqual(mockSubscribers)
        })
    })

    describe('subscribeToSubscribersChanges', () => {
        it('creates a realtime subscription', () => {
            const callback = vi.fn()

            subscribeToSubscribersChanges(callback)

            expect(mockClient.channel).toHaveBeenCalledWith('newsletter_subscribers_changes')
        })
    })
})
