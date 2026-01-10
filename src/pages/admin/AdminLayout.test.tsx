import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

// Mock Supabase client
const mockLogout = vi.fn()

// Mock AuthContext
vi.mock('../../context/AuthContext', async () => {
    return {
        AuthProvider: ({ children }: any) => <>{children}</>,
        useAuth: () => ({
            user: { email: 'test@example.com' },
            loading: false,
            isConfigured: true,
            logout: mockLogout
        })
    }
})

describe('AdminLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
    })

    const renderWithMockedAuth = (component: React.ReactNode) => {
        return render(
            <MemoryRouter initialEntries={['/admin/dashboard']}>
                {component}
            </MemoryRouter>
        )
    }

    describe('rendering', () => {
        it('renders the layout', () => {
            const { container } = renderWithMockedAuth(<AdminLayout />)
            expect(container).toBeDefined()
        })

        it('renders sidebar', () => {
            const { container } = renderWithMockedAuth(<AdminLayout />)
            expect(container.querySelector('.admin-sidebar')).toBeInTheDocument()
        })

        it('renders main content area', () => {
            const { container } = renderWithMockedAuth(<AdminLayout />)
            expect(container.querySelector('.admin-main')).toBeInTheDocument()
        })

        it('renders return to site link', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Siteye Dön')).toBeInTheDocument()
        })
    })

    describe('navigation', () => {
        it('renders Dashboard link', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Dashboard')).toBeInTheDocument()
        })

        it('renders Bloglar link', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Bloglar')).toBeInTheDocument()
        })

        it('renders Projeler link', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Projeler')).toBeInTheDocument()
        })

        it('renders Aboneler link', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Aboneler')).toBeInTheDocument()
        })

        it('renders Kampanyalar link', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Kampanyalar')).toBeInTheDocument()
        })

        it('renders Ayarlar link', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Ayarlar')).toBeInTheDocument()
        })

        it('has correct number of navigation links', () => {
            renderWithMockedAuth(<AdminLayout />)
            // 6 menu items + 1 site return link
            const links = screen.getAllByRole('link')
            expect(links.length).toBeGreaterThanOrEqual(7)
        })
    })

    describe('logout', () => {
        it('renders logout button', () => {
            renderWithMockedAuth(<AdminLayout />)
            expect(screen.getByText('Çıkış')).toBeInTheDocument()
        })

        it('removes session and navigates on logout', async () => {
            const user = userEvent.setup()
            sessionStorage.setItem('admin_auth', 'true')
            mockLogout.mockResolvedValue(undefined)

            renderWithMockedAuth(<AdminLayout />)

            const logoutBtn = screen.getByText('Çıkış')
            await user.click(logoutBtn)

            await waitFor(() => {
                expect(mockLogout).toHaveBeenCalled()
                expect(sessionStorage.getItem('admin_auth')).toBeNull()
                expect(mockNavigate).toHaveBeenCalledWith('/admin')
            })
        })
    })

    describe('link destinations', () => {
        it('Dashboard links to /admin/dashboard', () => {
            renderWithMockedAuth(<AdminLayout />)
            const link = screen.getByText('Dashboard').closest('a')
            expect(link).toHaveAttribute('href', '/admin/dashboard')
        })

        it('Bloglar links to /admin/blogs', () => {
            renderWithMockedAuth(<AdminLayout />)
            const link = screen.getByText('Bloglar').closest('a')
            expect(link).toHaveAttribute('href', '/admin/blogs')
        })

        it('Projeler links to /admin/projects', () => {
            renderWithMockedAuth(<AdminLayout />)
            const link = screen.getByText('Projeler').closest('a')
            expect(link).toHaveAttribute('href', '/admin/projects')
        })

        it('Ayarlar links to /admin/settings', () => {
            renderWithMockedAuth(<AdminLayout />)
            const link = screen.getByText('Ayarlar').closest('a')
            expect(link).toHaveAttribute('href', '/admin/settings')
        })

        it('Siteye Dön links to homepage', () => {
            renderWithMockedAuth(<AdminLayout />)
            const link = screen.getByText('Siteye Dön').closest('a')
            expect(link).toHaveAttribute('href', '/')
        })
    })
})
