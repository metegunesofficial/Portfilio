// Testimonials Service Unit Tests
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
    getTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    restoreTestimonial,
    toggleTestimonialPublish,
    toggleTestimonialFeatured,
    subscribeToTestimonialsChanges
} from './testimonials'

describe('Testimonials Service', () => {
    beforeEach(() => {
        mockClient = createMockClient()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('getTestimonials', () => {
        it('fetches all testimonials', async () => {
            const mockTestimonials = [
                { id: '1', author_name: 'Test User 1', published: true },
                { id: '2', author_name: 'Test User 2', published: false }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockTestimonials, error: null })

            const result = await getTestimonials({ includeDeleted: true })

            expect(mockClient.from).toHaveBeenCalledWith('testimonials')
            expect(result).toEqual(mockTestimonials)
        })

        it('filters by published status', async () => {
            mockClient.then = (resolve: any) => resolve({ data: [], error: null })

            await getTestimonials({ publishedOnly: true, includeDeleted: true })

            expect(mockClient.eq).toHaveBeenCalledWith('published', true)
        })

        it('filters by featured status', async () => {
            mockClient.then = (resolve: any) => resolve({ data: [], error: null })

            await getTestimonials({ featuredOnly: true, includeDeleted: true })

            expect(mockClient.eq).toHaveBeenCalledWith('featured', true)
        })
    })

    describe('getTestimonialById', () => {
        it('fetches testimonial by id', async () => {
            const mockTestimonial = { id: '123', author_name: 'Test User' }

            mockClient.then = (resolve: any) => resolve({ data: mockTestimonial, error: null })

            const result = await getTestimonialById('123')

            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
            expect(result).toEqual(mockTestimonial)
        })

        it('returns null for non-existent id', async () => {
            mockClient.then = (resolve: any) => resolve({ data: null, error: null })

            const result = await getTestimonialById('non-existent')

            expect(result).toBeNull()
        })
    })

    describe('createTestimonial', () => {
        it('creates a new testimonial', async () => {
            const newTestimonial = {
                name: 'New Author',
                quote_tr: 'Harika bir deneyim',
                quote_en: 'Great experience',
                rating: 5
            }
            const createdTestimonial = { id: '123', ...newTestimonial }

            mockClient.then = (resolve: any) => resolve({ data: createdTestimonial, error: null })

            const result = await createTestimonial(newTestimonial as any)

            expect(mockClient.insert).toHaveBeenCalled()
            expect(result).toEqual(createdTestimonial)
        })
    })

    describe('updateTestimonial', () => {
        it('updates an existing testimonial', async () => {
            const updates = { name: 'Updated Name' }
            const updatedTestimonial = { id: '123', ...updates }

            mockClient.then = (resolve: any) => resolve({ data: updatedTestimonial, error: null })

            const result = await updateTestimonial('123', updates)

            expect(mockClient.update).toHaveBeenCalled()
            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
            expect(result).toEqual(updatedTestimonial)
        })
    })

    describe('deleteTestimonial', () => {
        it('soft deletes a testimonial', async () => {
            mockClient.then = (resolve: any) => resolve({ error: null })

            const result = await deleteTestimonial('123')

            expect(mockClient.update).toHaveBeenCalled()
            expect(result).toBe(true)
        })
    })

    describe('restoreTestimonial', () => {
        it('restores a soft-deleted testimonial', async () => {
            mockClient.then = (resolve: any) => resolve({ error: null })

            const result = await restoreTestimonial('123')

            expect(mockClient.update).toHaveBeenCalledWith({
                deleted_at: null,
                deleted_by: null
            })
            expect(result).toBe(true)
        })
    })

    describe('toggleTestimonialPublish', () => {
        it('toggles testimonial published status', async () => {
            const publishedTestimonial = { id: '123', published: true }

            mockClient.then = (resolve: any) => resolve({ data: publishedTestimonial, error: null })

            const result = await toggleTestimonialPublish('123', true)

            expect(mockClient.update).toHaveBeenCalledWith({ published: true })
            expect(result).toEqual(publishedTestimonial)
        })
    })

    describe('toggleTestimonialFeatured', () => {
        it('toggles testimonial featured status', async () => {
            const featuredTestimonial = { id: '123', featured: true }

            mockClient.then = (resolve: any) => resolve({ data: featuredTestimonial, error: null })

            const result = await toggleTestimonialFeatured('123', true)

            expect(mockClient.update).toHaveBeenCalledWith({ featured: true })
            expect(result).toEqual(featuredTestimonial)
        })
    })

    describe('subscribeToTestimonialsChanges', () => {
        it('creates a realtime subscription', () => {
            const callback = vi.fn()

            subscribeToTestimonialsChanges(callback)

            expect(mockClient.channel).toHaveBeenCalledWith('testimonials_changes')
        })
    })
})
