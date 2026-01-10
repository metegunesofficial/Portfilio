import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BlogsPage } from './BlogsPage'
import { LangProvider } from '../context/LangContext'

// Mock Supabase client
const mockSupabase = {
    from: vi.fn(() => ({
        select: vi.fn(() => ({
            eq: vi.fn(() => ({
                order: vi.fn().mockResolvedValue({
                    data: [
                        {
                            id: '1',
                            slug: 'test-blog',
                            title_tr: 'Test Blog TR',
                            title_en: 'Test Blog EN',
                            excerpt_tr: 'Özet TR',
                            excerpt_en: 'Excerpt EN',
                            category: 'Tech',
                            emoji: '🚀',
                            published: true,
                            created_at: '2024-01-01'
                        }
                    ],
                    error: null
                })
            })),
            order: vi.fn().mockResolvedValue({
                data: [],
                error: null
            })
        }))
    }))
}

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockSupabase
}))

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <LangProvider>
                {component}
            </LangProvider>
        </BrowserRouter>
    )
}

describe('BlogsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders page title', async () => {
        renderWithProviders(<BlogsPage />)

        // Wait for content to load to handle async state updates
        await waitFor(() => {
            expect(screen.getByText('Test Blog EN')).toBeInTheDocument()
        })

        expect(screen.getAllByText(/Blog/i).length).toBeGreaterThan(0)
    })

    it('renders blog list', async () => {
        renderWithProviders(<BlogsPage />)

        // Wait for data loading
        await waitFor(() => {
            expect(screen.getByText('Test Blog EN')).toBeInTheDocument()
        })

        expect(screen.getByText('Excerpt EN')).toBeInTheDocument()
        expect(screen.getByText('Tech')).toBeInTheDocument()
    })

    it('renders read more links', async () => {
        renderWithProviders(<BlogsPage />)

        await waitFor(() => {
            const links = screen.getAllByRole('link')
            // Correct route is /blogs/:slug (plural)
            const hasBlogLink = links.some(link => {
                const href = link.getAttribute('href')
                return href && (href.startsWith('/blogs/') || href.includes('/blogs/'))
            })
            expect(hasBlogLink).toBe(true)
        })
    })
})
