// Contact Service Unit Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Create a proper chainable mock with all methods resolving to the mock
const createMockClient = () => {
    const mock: any = {}

    mock.from = vi.fn().mockReturnValue(mock)
    mock.select = vi.fn().mockReturnValue(mock)
    mock.insert = vi.fn().mockReturnValue(mock)
    mock.update = vi.fn().mockReturnValue(mock)
    mock.delete = vi.fn().mockReturnValue(mock)
    mock.eq = vi.fn().mockReturnValue(mock)
    mock.is = vi.fn().mockReturnValue(mock)
    mock.order = vi.fn().mockReturnValue(mock)
    mock.single = vi.fn().mockReturnValue(mock)
    mock.channel = vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn()
    }))

    mock.then = undefined

    return mock
}

let mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

import {
    getContactMessages,
    sendContactMessage,
    updateMessageStatus,
    markMessageAsRead,
    markMessageAsReplied,
    archiveMessage,
    deleteContactMessage,
    restoreContactMessage,
    getNewMessagesCount,
    subscribeToMessagesChanges
} from './contact'

describe('Contact Service', () => {
    beforeEach(() => {
        mockClient = createMockClient()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('getContactMessages', () => {
        it('fetches all active messages', async () => {
            const mockMessages = [
                { id: '1', name: 'John', status: 'new', deleted_at: null },
                { id: '2', name: 'Jane', status: 'read', deleted_at: null }
            ]

            mockClient.is.mockResolvedValueOnce({ data: mockMessages, error: null })

            const result = await getContactMessages()

            expect(mockClient.from).toHaveBeenCalledWith('contact_messages')
            expect(mockClient.is).toHaveBeenCalledWith('deleted_at', null)
            expect(result).toEqual(mockMessages)
        })

        it('filters by status', async () => {
            mockClient.eq.mockResolvedValueOnce({ data: [], error: null })

            await getContactMessages({ status: 'new' })

            expect(mockClient.eq).toHaveBeenCalledWith('status', 'new')
        })
    })

    describe('sendContactMessage', () => {
        it('sends a contact message', async () => {
            const message = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello!',
                kvkk_consent: true
            }
            const createdMessage = { id: '123', ...message, status: 'new' }

            mockClient.single.mockResolvedValueOnce({ data: createdMessage, error: null })

            const result = await sendContactMessage(message)

            expect(mockClient.insert).toHaveBeenCalled()
            expect(result).toEqual(createdMessage)
        })

        it('includes optional fields', async () => {
            const message = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello!',
                phone: '+90123456789',
                subject: 'Test Subject',
                kvkk_consent: true
            }

            mockClient.single.mockResolvedValueOnce({ data: { id: '123', ...message }, error: null })

            await sendContactMessage(message)

            expect(mockClient.insert).toHaveBeenCalled()
        })
    })

    describe('updateMessageStatus', () => {
        it('updates message status', async () => {
            const updatedMessage = { id: '123', status: 'read' }

            mockClient.single.mockResolvedValueOnce({ data: updatedMessage, error: null })

            const result = await updateMessageStatus('123', 'read')

            expect(mockClient.update).toHaveBeenCalledWith({ status: 'read' })
            expect(result).toEqual(updatedMessage)
        })
    })

    describe('markMessageAsRead', () => {
        it('marks message as read', async () => {
            const message = { id: '123', status: 'read' }

            mockClient.single.mockResolvedValueOnce({ data: message, error: null })

            const result = await markMessageAsRead('123')

            expect(result.status).toBe('read')
        })
    })

    describe('markMessageAsReplied', () => {
        it('marks message as replied', async () => {
            const message = { id: '123', status: 'replied' }

            mockClient.single.mockResolvedValueOnce({ data: message, error: null })

            const result = await markMessageAsReplied('123')

            expect(result.status).toBe('replied')
        })
    })

    describe('archiveMessage', () => {
        it('archives a message', async () => {
            const message = { id: '123', status: 'archived' }

            mockClient.single.mockResolvedValueOnce({ data: message, error: null })

            const result = await archiveMessage('123')

            expect(result.status).toBe('archived')
        })
    })

    describe('deleteContactMessage', () => {
        it('soft deletes a message', async () => {
            mockClient.eq.mockResolvedValueOnce({ error: null })

            const result = await deleteContactMessage('123')

            expect(mockClient.update).toHaveBeenCalled()
            expect(result).toBe(true)
        })
    })

    describe('restoreContactMessage', () => {
        it('restores a soft-deleted message', async () => {
            mockClient.eq.mockResolvedValueOnce({ error: null })

            const result = await restoreContactMessage('123')

            expect(mockClient.update).toHaveBeenCalledWith({
                deleted_at: null,
                deleted_by: null
            })
            expect(result).toBe(true)
        })
    })

    describe('getNewMessagesCount', () => {
        it('returns count of new messages', async () => {
            mockClient.is.mockResolvedValueOnce({ count: 5, error: null })

            const result = await getNewMessagesCount()

            expect(mockClient.eq).toHaveBeenCalledWith('status', 'new')
            expect(result).toBe(5)
        })

        it('returns 0 when no new messages', async () => {
            mockClient.is.mockResolvedValueOnce({ count: null, error: null })

            const result = await getNewMessagesCount()

            expect(result).toBe(0)
        })
    })

    describe('subscribeToMessagesChanges', () => {
        it('creates a realtime subscription', () => {
            const callback = vi.fn()

            subscribeToMessagesChanges(callback)

            expect(mockClient.channel).toHaveBeenCalledWith('contact_messages_changes')
        })
    })
})
