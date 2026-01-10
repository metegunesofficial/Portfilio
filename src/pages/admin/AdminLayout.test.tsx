import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AdminLayout } from './AdminLayout'

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
        <MemoryRouter initialEntries={['/admin/dashboard']}>
            {component}
        </MemoryRouter>
    )
}

describe('AdminLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
    })

    describe('rendering', () => {
        it('renders the layout', () => {
            const { container } = renderWithRouter(<AdminLayout />)
            expect(container).toBeDefined()
        })

        it('renders sidebar', () => {
            const { container } = renderWithRouter(<AdminLayout />)
            expect(container.querySelector('.admin-sidebar')).toBeInTheDocument()
        })

        it('renders main content area', () => {
            const { container } = renderWithRouter(<AdminLayout />)
            expect(container.querySelector('.admin-main')).toBeInTheDocument()
        })

        it('renders return to site link', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Siteye Dön')).toBeInTheDocument()
        })
    })

    describe('navigation', () => {
        it('renders Dashboard link', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Dashboard')).toBeInTheDocument()
        })

        it('renders Bloglar link', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Bloglar')).toBeInTheDocument()
        })

        it('renders Projeler link', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Projeler')).toBeInTheDocument()
        })

        it('renders Aboneler link', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Aboneler')).toBeInTheDocument()
        })

        it('renders Kampanyalar link', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Kampanyalar')).toBeInTheDocument()
        })

        it('renders Ayarlar link', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Ayarlar')).toBeInTheDocument()
        })

        it('has correct number of navigation links', () => {
            renderWithRouter(<AdminLayout />)
            const navLinks = screen.getAllByRole('link')
            // 6 nav items + 1 site link
            expect(navLinks.length).toBeGreaterThanOrEqual(7)
        })
    })

    describe('logout', () => {
        it('renders logout button', () => {
            renderWithRouter(<AdminLayout />)
            expect(screen.getByText('Çıkış')).toBeInTheDocument()
        })

        it('removes session and navigates on logout', async () => {
            const user = userEvent.setup()
            sessionStorage.setItem('admin_auth', 'true')

            renderWithRouter(<AdminLayout />)

            const logoutBtn = screen.getByText('Çıkış')
            await user.click(logoutBtn)

            expect(sessionStorage.getItem('admin_auth')).toBeNull()
            expect(mockNavigate).toHaveBeenCalledWith('/admin')
        })
    })

    describe('link destinations', () => {
        it('Dashboard links to /admin/dashboard', () => {
            renderWithRouter(<AdminLayout />)
            const link = screen.getByText('Dashboard').closest('a')
            expect(link).toHaveAttribute('href', '/admin/dashboard')
        })

        it('Bloglar links to /admin/blogs', () => {
            renderWithRouter(<AdminLayout />)
            const link = screen.getByText('Bloglar').closest('a')
            expect(link).toHaveAttribute('href', '/admin/blogs')
        })

        it('Projeler links to /admin/projects', () => {
            renderWithRouter(<AdminLayout />)
            const link = screen.getByText('Projeler').closest('a')
            expect(link).toHaveAttribute('href', '/admin/projects')
        })

        it('Ayarlar links to /admin/settings', () => {
            renderWithRouter(<AdminLayout />)
            const link = screen.getByText('Ayarlar').closest('a')
            expect(link).toHaveAttribute('href', '/admin/settings')
        })

        it('Siteye Dön links to homepage', () => {
            renderWithRouter(<AdminLayout />)
            const link = screen.getByText('Siteye Dön').closest('a')
            expect(link).toHaveAttribute('href', '/')
        })
    })
})
