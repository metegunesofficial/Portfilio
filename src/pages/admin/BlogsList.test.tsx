import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BlogsList } from './BlogsList'

// Mock services
vi.mock('../../services/blogs', () => ({
    getBlogs: vi.fn(),
    deleteBlog: vi.fn(),
    restoreBlog: vi.fn(),
    toggleBlogPublish: vi.fn()
}))

// Mock realtime hook
vi.mock('../../hooks/useRealtimeSubscription', () => ({
    useRealtimeBlogs: vi.fn()
}))

import { getBlogs, deleteBlog, restoreBlog, toggleBlogPublish } from '../../services/blogs'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

// Mock confirm
vi.stubGlobal('confirm', vi.fn(() => true))

const mockBlogs = [
    {
        id: '1',
        title_tr: 'Test Blog 1',
        title_en: 'Test Blog 1 EN',
        slug: 'test-blog-1',
        category: 'Technology',
        emoji: '🚀',
        published: true,
        created_at: '2024-01-15T10:00:00Z',
        deleted_at: null
    },
    {
        id: '2',
        title_tr: 'Test Blog 2',
        title_en: 'Test Blog 2 EN',
        slug: 'test-blog-2',
        category: 'Design',
        emoji: '🎨',
        published: false,
        created_at: '2024-01-10T10:00:00Z',
        deleted_at: null
    }
]

const mockDeletedBlogs = [
    {
        id: '3',
        title_tr: 'Deleted Blog',
        title_en: 'Deleted Blog EN',
        slug: 'deleted-blog',
        category: 'Other',
        emoji: '❌',
        published: false,
        created_at: '2024-01-05T10:00:00Z',
        deleted_at: '2024-01-08T10:00:00Z'
    }
]

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

describe('BlogsList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
        vi.mocked(getBlogs).mockResolvedValue(mockBlogs as any)
    })

    describe('authentication', () => {
        it('redirects to login when not authenticated', () => {
            renderWithRouter(<BlogsList />)
            expect(mockNavigate).toHaveBeenCalledWith('/admin')
        })

        it('stays on page when authenticated', async () => {
            sessionStorage.setItem('admin_auth', 'true')
            renderWithRouter(<BlogsList />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(mockNavigate).not.toHaveBeenCalledWith('/admin')
        })
    })

    describe('rendering', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('renders page title', async () => {
            renderWithRouter(<BlogsList />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText('Bloglar')).toBeInTheDocument()
        })

        it('renders description', async () => {
            renderWithRouter(<BlogsList />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText('Tüm blog yazılarını yönetin')).toBeInTheDocument()
        })

        it('renders Yeni Blog button', async () => {
            renderWithRouter(<BlogsList />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText('Yeni Blog')).toBeInTheDocument()
        })

        it('renders realtime indicator', async () => {
            renderWithRouter(<BlogsList />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText('Canlı güncelleme aktif')).toBeInTheDocument()
        })

        it('shows loading state initially', async () => {
            renderWithRouter(<BlogsList />)
            expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()

            // Wait for content to load to avoid act warnings
            await waitFor(() => screen.getByText('Test Blog 1'))
        })
    })

    describe('blogs list', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('displays blogs after loading', async () => {
            renderWithRouter(<BlogsList />)

            await waitFor(() => {
                expect(screen.getByText('Test Blog 1')).toBeInTheDocument()
            })
        })

        it('displays blog category', async () => {
            renderWithRouter(<BlogsList />)

            await waitFor(() => {
                expect(screen.getByText('Technology')).toBeInTheDocument()
            })
        })

        it('shows empty state when no blogs', async () => {
            vi.mocked(getBlogs).mockResolvedValue([] as any)

            renderWithRouter(<BlogsList />)

            await waitFor(() => {
                expect(screen.getByText('Henüz blog yok')).toBeInTheDocument()
            })
        })
    })

    describe('toggle deleted view', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('shows deleted blogs toggle button', async () => {
            renderWithRouter(<BlogsList />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText(/Silinmişler/)).toBeInTheDocument()
        })

        it('toggles to deleted view', async () => {
            const user = userEvent.setup()
            vi.mocked(getBlogs).mockResolvedValue([...mockBlogs, ...mockDeletedBlogs] as any)

            renderWithRouter(<BlogsList />)

            await waitFor(() => {
                expect(screen.getByText('Test Blog 1')).toBeInTheDocument()
            })

            const toggleBtn = screen.getByText(/Silinmişler/)
            await user.click(toggleBtn)

            expect(getBlogs).toHaveBeenCalledWith({ includeDeleted: true })
        })
    })

    describe('actions', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('toggles publish status', async () => {
            const user = userEvent.setup()
            vi.mocked(toggleBlogPublish).mockResolvedValue({ id: '1', published: false } as any)

            renderWithRouter(<BlogsList />)

            await waitFor(() => {
                expect(screen.getByText('Yayında')).toBeInTheDocument()
            })

            const publishBtn = screen.getByText('Yayında')
            await user.click(publishBtn)

            expect(toggleBlogPublish).toHaveBeenCalledWith('1', false)
        })

        it('deletes blog with confirmation', async () => {
            const user = userEvent.setup()
            vi.mocked(deleteBlog).mockResolvedValue(true)

            renderWithRouter(<BlogsList />)

            await waitFor(() => {
                expect(screen.getByText('Test Blog 1')).toBeInTheDocument()
            })

            const deleteButtons = screen.getAllByTitle('Sil')
            await user.click(deleteButtons[0])

            expect(deleteBlog).toHaveBeenCalledWith('1')
        })

        it('restores deleted blog', async () => {
            const user = userEvent.setup()
            vi.mocked(getBlogs).mockResolvedValue(mockDeletedBlogs as any)
            vi.mocked(restoreBlog).mockResolvedValue(true)

            renderWithRouter(<BlogsList />)

            // Toggle to show deleted
            const toggleBtn = screen.getByText(/Silinmişler/)
            await user.click(toggleBtn)

            await waitFor(() => {
                const restoreBtn = screen.getByTitle('Geri Yükle')
                expect(restoreBtn).toBeInTheDocument()
            })

            const restoreBtn = screen.getByTitle('Geri Yükle')
            await user.click(restoreBtn)

            expect(restoreBlog).toHaveBeenCalledWith('3')
        })
    })

    describe('links', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('Yeni Blog links to /admin/blogs/new', async () => {
            renderWithRouter(<BlogsList />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            const link = screen.getByText('Yeni Blog').closest('a')
            expect(link).toHaveAttribute('href', '/admin/blogs/new')
        })

        it('edit links exist for blogs', async () => {
            renderWithRouter(<BlogsList />)

            await waitFor(() => {
                const editLinks = screen.getAllByTitle('Düzenle')
                expect(editLinks.length).toBeGreaterThan(0)
            })
        })
    })
})
