import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminHome } from './AdminHome'

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

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

describe('AdminHome', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()

        // Setup default mock return
        mockFrom.mockReturnValue({
            select: vi.fn().mockResolvedValue({ count: 5, error: null })
        })
    })

    describe('authentication', () => {
        it('redirects to admin login when not authenticated', () => {
            renderWithRouter(<AdminHome />)
            expect(mockNavigate).toHaveBeenCalledWith('/admin')
        })

        it('does not redirect when authenticated', async () => {
            sessionStorage.setItem('admin_auth', 'true')
            renderWithRouter(<AdminHome />)
            expect(mockNavigate).not.toHaveBeenCalledWith('/admin')
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
        })
    })

    describe('rendering', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('renders Dashboard heading', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('Dashboard')).toBeInTheDocument()
        })

        it('renders welcome message', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('İçerik yönetim paneline hoş geldiniz')).toBeInTheDocument()
        })

        it('renders Bloglar card', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('Bloglar')).toBeInTheDocument()
        })

        it('renders Projeler card', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('Projeler')).toBeInTheDocument()
        })

        it('renders Ayarlar card', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('Ayarlar')).toBeInTheDocument()
        })

        it('renders quick actions section', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('Hızlı İşlemler')).toBeInTheDocument()
        })

        it('renders Yeni Blog button', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('Yeni Blog')).toBeInTheDocument()
        })

        it('renders Yeni Proje button', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            expect(screen.getByText('Yeni Proje')).toBeInTheDocument()
        })
    })

    describe('stats loading', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('shows loading state initially', async () => {
            renderWithRouter(<AdminHome />)
            expect(screen.getAllByText('...').length).toBeGreaterThan(0)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
        })

        it('displays stats after loading', async () => {
            mockFrom
                .mockReturnValueOnce({ select: vi.fn().mockResolvedValue({ count: 10, error: null }) })
                .mockReturnValueOnce({ select: vi.fn().mockResolvedValue({ count: 5, error: null }) })

            renderWithRouter(<AdminHome />)

            await waitFor(() => {
                expect(screen.getByText('10')).toBeInTheDocument()
            })
        })

        it('handles fetch error gracefully', async () => {
            mockFrom.mockReturnValue({
                select: vi.fn().mockRejectedValue(new Error('Network error'))
            })

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            renderWithRouter(<AdminHome />)

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalled()
            })
            // Wait for loading to finish (error sets loading false)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())

            consoleSpy.mockRestore()
        })
    })

    describe('links', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('Yeni Blog links to /admin/blogs/new', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            const link = screen.getByText('Yeni Blog').closest('a')
            expect(link).toHaveAttribute('href', '/admin/blogs/new')
        })

        it('Yeni Proje links to /admin/projects/new', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            const link = screen.getByText('Yeni Proje').closest('a')
            expect(link).toHaveAttribute('href', '/admin/projects/new')
        })

        it('Görüntüle links exist for cards', async () => {
            renderWithRouter(<AdminHome />)
            await waitFor(() => expect(screen.queryByText('...')).not.toBeInTheDocument())
            const viewLinks = screen.getAllByText(/Görüntüle|Düzenle/)
            expect(viewLinks.length).toBeGreaterThanOrEqual(3)
        })
    })
})
