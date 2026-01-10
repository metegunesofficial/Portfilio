// Email Campaigns Service Unit Tests
import { describe, it, expect, vi, beforeEach } from 'vitest'

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
        single: vi.fn(),
        in: vi.fn(),
        range: vi.fn(),
        channel: vi.fn()
    }

    mock.from.mockReturnThis()
    mock.select.mockReturnThis()
    mock.insert.mockReturnThis()
    mock.update.mockReturnThis()
    mock.delete.mockReturnThis()
    mock.eq.mockReturnThis()
    mock.gte.mockReturnThis()
    mock.lte.mockReturnThis()
    mock.order.mockReturnThis()
    mock.limit.mockReturnThis()
    mock.single.mockReturnThis()
    mock.in.mockReturnThis()
    mock.range.mockReturnThis()
    mock.channel.mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })

    mock.then = (resolve: any) => resolve({ data: [], error: null })

    return mock
}

const mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

import {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaigns,
    getCampaignById,
    getCampaignStats,
    createCampaignFromBlog,
    generateBlogEmailHtml,
    subscribeToCampaignsChanges
} from './email-campaigns'

describe('Email Campaigns Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockClient.then = (resolve: any) => resolve({ data: [], error: null })
    })

    describe('createCampaign', () => {
        it('creates a campaign with default values', async () => {
            const newCampaign = { subject: 'Test', content_html: '<p>Test</p>' }
            const createdCampaign = { id: '1', ...newCampaign }

            mockClient.then = (resolve: any) => resolve({ data: createdCampaign, error: null })

            const result = await createCampaign(newCampaign)

            expect(mockClient.from).toHaveBeenCalledWith('email_campaigns')
            expect(mockClient.insert).toHaveBeenCalledWith({
                ...newCampaign,
                blog_id: null,
                content_text: null,
                scheduled_at: null,
                status: 'draft'
            })
            expect(mockClient.single).toHaveBeenCalled()
            expect(result).toEqual(createdCampaign)
        })
    })

    describe('updateCampaign', () => {
        it('updates a campaign', async () => {
            const updates = { subject: 'Updated' }
            const updatedCampaign = { id: '1', ...updates }

            mockClient.then = (resolve: any) => resolve({ data: updatedCampaign, error: null })

            const result = await updateCampaign('1', updates)

            expect(mockClient.update).toHaveBeenCalledWith(updates)
            expect(mockClient.eq).toHaveBeenCalledWith('id', '1')
            expect(result).toEqual(updatedCampaign)
        })
    })

    describe('deleteCampaign', () => {
        it('deletes a campaign', async () => {
            mockClient.then = (resolve: any) => resolve({ error: null })

            const result = await deleteCampaign('1')

            expect(mockClient.delete).toHaveBeenCalled()
            expect(mockClient.eq).toHaveBeenCalledWith('id', '1')
            expect(result).toBe(true)
        })
    })

    describe('getCampaigns', () => {
        it('fetches all campaigns with pagination', async () => {
            const mockData = [{ id: '1' }]

            let callCount = 0
            mockClient.then = (resolve: any) => {
                callCount++
                if (callCount === 1) return resolve({ count: 10, error: null }) // Only count? No, usually supabase returns data and count together.
                // But tests flow might be different. Let's assume single call.
                return resolve({ data: mockData, count: 10, error: null })
            }

            // If getCampaigns implementation uses a single await query, then we need just one resolution.
            mockClient.then = (resolve: any) => resolve({ data: mockData, count: 10, error: null })

            const result = await getCampaigns({ limit: 10, offset: 0 })

            expect(mockClient.select).toHaveBeenCalledWith(expect.stringContaining('*'), expect.objectContaining({ count: 'exact' }))
            // With offset 0 not undefined, range should be called.
            expect(mockClient.range).toHaveBeenCalledWith(0, 9)
            expect(result).toEqual({ campaigns: mockData, total: 10 })
        })
    })

    describe('getCampaignById', () => {
        it('fetches campaign by id', async () => {
            const mockCampaign = { id: '1' }
            mockClient.then = (resolve: any) => resolve({ data: mockCampaign, error: null })

            const result = await getCampaignById('1')

            expect(mockClient.eq).toHaveBeenCalledWith('id', '1')
            expect(result).toEqual(mockCampaign)
        })
    })

    describe('getCampaignStats', () => {
        it('calculates campaign stats', async () => {
            const mockCampaigns = [
                { status: 'sent', total_recipients: 100, delivered: 90, opened: 45, clicked: 10 },
                { status: 'failed', total_recipients: 0, delivered: 0, opened: 0, clicked: 0 }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockCampaigns, error: null })

            const stats = await getCampaignStats()

            expect(stats.totalCampaigns).toBe(2)
            expect(stats.totalSent).toBe(100)
            expect(stats.avgOpenRate).toBe(50) // 45 / 90 * 100
        })
    })

    describe('createCampaignFromBlog', () => {
        it('creates campaign from blog data', async () => {
            const mockBlog = {
                id: 'blog1',
                title_tr: 'Blog Başlık',
                title_en: 'Blog Title',
                slug: 'blog-slug',
                excerpt_tr: 'Özet',
                emoji: '🎨',
                category: 'Tech'
            }

            let callCount = 0
            mockClient.then = (resolve: any) => {
                callCount++
                if (callCount === 1) return resolve({ data: mockBlog, error: null }) // Blog fetch
                return resolve({ data: { id: '2', subject: `🎨 Blog Başlık` }, error: null }) // Campaign insert
            }

            await createCampaignFromBlog('blog1', 'tr')

            expect(mockClient.from).toHaveBeenCalledWith('blogs')
            expect(mockClient.eq).toHaveBeenCalledWith('id', 'blog1') // First call for blog

            expect(mockClient.insert).toHaveBeenCalledWith(expect.objectContaining({
                subject: '🎨 Blog Başlık',
                blog_id: 'blog1',
                status: 'draft'
            }))
        })
    })

    describe('generateBlogEmailHtml', () => {
        it('generates HTML string', () => {
            const html = generateBlogEmailHtml({
                title: 'Test',
                excerpt: 'Excerpt',
                blogUrl: 'http://test.com',
                emoji: '😀',
                category: 'Test'
            })
            expect(html).toContain('Test')
            expect(html).toContain('Excerpt')
            expect(html).toContain('http://test.com')
        })
    })

    describe('subscribeToCampaignsChanges', () => {
        it('subscribes to changes', () => {
            const callback = vi.fn()
            subscribeToCampaignsChanges(callback)
            expect(mockClient.channel).toHaveBeenCalledWith('email_campaigns_changes')
        })
    })
})
