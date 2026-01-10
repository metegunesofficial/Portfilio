import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AdminDashboard } from './AdminDashboard'

// Mock supabase client
const mockFrom = vi.fn()
vi.mock('../../lib/supabase-client', () => ({
    getSupabaseClient: () => ({
        from: mockFrom
    })
}))

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
        created_at: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        title_tr: 'Test Blog 2',
        title_en: 'Test Blog 2 EN',
        slug: 'test-blog-2',
        category: 'Design',
        emoji: '🎨',
        published: false,
        created_at: '2024-01-10T10:00:00Z'
    }
]

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

describe('AdminDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()

        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: mockBlogs, error: null })
            }),
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null })
            }),
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null })
            })
        })
    })

    describe('authentication', () => {
        it('redirects to login when not authenticated', () => {
            renderWithRouter(<AdminDashboard />)
            expect(mockNavigate).toHaveBeenCalledWith('/admin')
        })

        it('stays on page when authenticated', async () => {
            sessionStorage.setItem('admin_auth', 'true')
            renderWithRouter(<AdminDashboard />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(mockNavigate).not.toHaveBeenCalledWith('/admin')
        })
    })

    describe('rendering', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('renders page title', async () => {
            renderWithRouter(<AdminDashboard />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText('Blog Yönetimi')).toBeInTheDocument()
        })

        it('renders Yeni Blog button', async () => {
            renderWithRouter(<AdminDashboard />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText('Yeni Blog')).toBeInTheDocument()
        })

        it('renders Çıkış button', async () => {
            renderWithRouter(<AdminDashboard />)
            await waitFor(() => screen.getByText('Test Blog 1'))
            expect(screen.getByText('Çıkış')).toBeInTheDocument()
        })

        it('shows loading state initially', async () => {
            renderWithRouter(<AdminDashboard />)
            expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()
            await waitFor(() => screen.getByText('Test Blog 1'))
        })
    })

    describe('blogs list', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('displays blogs after loading', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Test Blog 1')).toBeInTheDocument()
            })
        })

        it('displays blog emoji', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('🚀')).toBeInTheDocument()
            })
        })

        it('displays blog category', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Technology')).toBeInTheDocument()
            })
        })

        it('displays published status', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Yayında')).toBeInTheDocument()
            })
        })

        it('displays draft status', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Taslak')).toBeInTheDocument()
            })
        })

        it('shows empty state when no blogs', async () => {
            mockFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: [], error: null })
                })
            })

            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Henüz blog yok')).toBeInTheDocument()
            })
        })
    })

    describe('table headers', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('renders Blog header', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Blog')).toBeInTheDocument()
            })
        })

        it('renders Kategori header', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Kategori')).toBeInTheDocument()
            })
        })

        it('renders Tarih header', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Tarih')).toBeInTheDocument()
            })
        })

        it('renders Durum header', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Durum')).toBeInTheDocument()
            })
        })

        it('renders İşlemler header', async () => {
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('İşlemler')).toBeInTheDocument()
            })
        })
    })

    describe('logout', () => {
        it('clears session and navigates on logout', async () => {
            const user = userEvent.setup()
            sessionStorage.setItem('admin_auth', 'true')

            renderWithRouter(<AdminDashboard />)

            const logoutBtn = screen.getByText('Çıkış')
            await user.click(logoutBtn)

            expect(sessionStorage.getItem('admin_auth')).toBeNull()
            expect(mockNavigate).toHaveBeenCalledWith('/admin')
        })
    })

    describe('actions', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('toggles publish status on click', async () => {
            const user = userEvent.setup()
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Yayında')).toBeInTheDocument()
            })

            const publishBtn = screen.getByText('Yayında')
            await user.click(publishBtn)

            expect(mockFrom).toHaveBeenCalledWith('blogs')
        })

        it('deletes blog after confirmation', async () => {
            const user = userEvent.setup()
            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(screen.getByText('Test Blog 1')).toBeInTheDocument()
            })

            const deleteButtons = screen.getAllByTitle('Sil')
            await user.click(deleteButtons[0])

            expect(mockFrom).toHaveBeenCalledWith('blogs')
        })
    })

    describe('error handling', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('handles fetch error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            mockFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockRejectedValue(new Error('Network error'))
                })
            })

            renderWithRouter(<AdminDashboard />)

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalled()
            })

            consoleSpy.mockRestore()
        })
    })
})
