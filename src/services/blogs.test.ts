// Blog Service Unit Tests
// These tests verify the blog service functions work correctly
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Create a proper chainable mock with all methods resolving to the mock
const createMockClient = () => {
    // Circular reference trick for chainable calls
    const mock: any = {}

    // Each method returns the mock itself for chaining
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

    // Add then/catch for promise resolution in tests
    mock.then = undefined

    return mock
}

let mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

// Import after mock
import {
    getBlogs,
    getBlogBySlug,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    restoreBlog,
    toggleBlogPublish,
    subscribeToBlogsChanges
} from './blogs'

describe('Blog Service', () => {
    beforeEach(() => {
        // Recreate mock for each test to ensure clean state
        mockClient = createMockClient()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('getBlogs', () => {
        it('fetches all active blogs by default', async () => {
            const mockBlogs = [
                { id: '1', title_tr: 'Test Blog 1', deleted_at: null },
                { id: '2', title_tr: 'Test Blog 2', deleted_at: null }
            ]

            // Setup the final method in chain to resolve with data
            mockClient.is.mockResolvedValueOnce({ data: mockBlogs, error: null })

            const result = await getBlogs()

            expect(mockClient.from).toHaveBeenCalledWith('blogs')
            expect(mockClient.select).toHaveBeenCalledWith('*')
            expect(mockClient.is).toHaveBeenCalledWith('deleted_at', null)
            expect(result).toEqual(mockBlogs)
        })

        it('includes deleted blogs when includeDeleted is true', async () => {
            const mockBlogs = [
                { id: '1', title_tr: 'Test Blog 1', deleted_at: null },
                { id: '2', title_tr: 'Test Blog 2', deleted_at: '2026-01-01' }
            ]

            // When includeDeleted, order is the final method
            mockClient.order.mockResolvedValueOnce({ data: mockBlogs, error: null })

            const result = await getBlogs({ includeDeleted: true })

            expect(result).toEqual(mockBlogs)
        })

        it('filters by published status when publishedOnly is true', async () => {
            const mockBlogs = [{ id: '1', title_tr: 'Published Blog', published: true }]

            // When publishedOnly and not includeDeleted: order -> is -> eq
            mockClient.eq.mockResolvedValueOnce({ data: mockBlogs, error: null })

            await getBlogs({ publishedOnly: true })

            expect(mockClient.eq).toHaveBeenCalledWith('published', true)
        })

        it('throws error on database failure', async () => {
            mockClient.is.mockResolvedValueOnce({
                data: null,
                error: { message: 'Database error' }
            })

            await expect(getBlogs()).rejects.toThrow('Database error')
        })

        it('returns empty array when no blogs exist', async () => {
            mockClient.is.mockResolvedValueOnce({ data: null, error: null })

            const result = await getBlogs()

            expect(result).toEqual([])
        })
    })

    describe('getBlogBySlug', () => {
        it('fetches a blog by slug', async () => {
            const mockBlog = { id: '1', slug: 'test-blog', title_tr: 'Test Blog' }

            mockClient.single.mockResolvedValueOnce({ data: mockBlog, error: null })

            const result = await getBlogBySlug('test-blog')

            expect(mockClient.from).toHaveBeenCalledWith('blogs')
            expect(mockClient.eq).toHaveBeenCalledWith('slug', 'test-blog')
            expect(mockClient.is).toHaveBeenCalledWith('deleted_at', null)
            expect(result).toEqual(mockBlog)
        })

        it('returns null when blog not found', async () => {
            mockClient.single.mockResolvedValueOnce({
                data: null,
                error: { code: 'PGRST116', message: 'Not found' }
            })

            const result = await getBlogBySlug('non-existent')

            expect(result).toBeNull()
        })
    })

    describe('getBlogById', () => {
        it('fetches a blog by id', async () => {
            const mockBlog = { id: '123', title_tr: 'Test Blog' }

            mockClient.single.mockResolvedValueOnce({ data: mockBlog, error: null })

            const result = await getBlogById('123')

            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
            expect(result).toEqual(mockBlog)
        })
    })

    describe('createBlog', () => {
        it('creates a new blog', async () => {
            const newBlog = {
                title_tr: 'New Blog',
                title_en: 'New Blog EN',
                slug: 'new-blog'
            }
            const createdBlog = { id: '123', ...newBlog }

            mockClient.single.mockResolvedValueOnce({ data: createdBlog, error: null })

            const result = await createBlog(newBlog)

            expect(mockClient.insert).toHaveBeenCalledWith(newBlog)
            expect(result).toEqual(createdBlog)
        })

        it('throws error on creation failure', async () => {
            mockClient.single.mockResolvedValueOnce({
                data: null,
                error: { message: 'Duplicate slug' }
            })

            await expect(createBlog({
                title_tr: 'Test',
                title_en: 'Test EN',
                slug: 'duplicate'
            })).rejects.toThrow('Duplicate slug')
        })
    })

    describe('updateBlog', () => {
        it('updates an existing blog', async () => {
            const updates = { title_tr: 'Updated Title' }
            const updatedBlog = { id: '123', title_tr: 'Updated Title' }

            mockClient.single.mockResolvedValueOnce({ data: updatedBlog, error: null })

            const result = await updateBlog('123', updates)

            expect(mockClient.update).toHaveBeenCalledWith(updates)
            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
            expect(result).toEqual(updatedBlog)
        })
    })

    describe('deleteBlog', () => {
        it('soft deletes a blog by setting deleted_at', async () => {
            mockClient.eq.mockResolvedValueOnce({ error: null })

            const result = await deleteBlog('123')

            expect(mockClient.update).toHaveBeenCalled()
            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
            expect(result).toBe(true)
        })

        it('throws error on deletion failure', async () => {
            mockClient.eq.mockResolvedValueOnce({
                error: { message: 'Deletion failed' }
            })

            await expect(deleteBlog('123')).rejects.toThrow('Deletion failed')
        })
    })

    describe('restoreBlog', () => {
        it('restores a soft-deleted blog', async () => {
            mockClient.eq.mockResolvedValueOnce({ error: null })

            const result = await restoreBlog('123')

            expect(mockClient.update).toHaveBeenCalledWith({
                deleted_at: null,
                deleted_by: null
            })
            expect(result).toBe(true)
        })
    })

    describe('toggleBlogPublish', () => {
        it('toggles blog publish status', async () => {
            const updatedBlog = { id: '123', published: true }

            mockClient.single.mockResolvedValueOnce({ data: updatedBlog, error: null })

            const result = await toggleBlogPublish('123', true)

            expect(result).toEqual(updatedBlog)
        })
    })

    describe('subscribeToBlogsChanges', () => {
        it('creates a realtime subscription', () => {
            const callback = vi.fn()

            subscribeToBlogsChanges(callback)

            expect(mockClient.channel).toHaveBeenCalledWith('blogs_changes')
        })
    })
})
