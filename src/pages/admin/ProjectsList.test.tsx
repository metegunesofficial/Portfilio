import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProjectsList } from './ProjectsList'

// Mock services
vi.mock('../../services/projects', () => ({
    getProjects: vi.fn(),
    deleteProject: vi.fn(),
    restoreProject: vi.fn(),
    toggleProjectPublish: vi.fn(),
    toggleProjectFeatured: vi.fn()
}))

// Mock realtime hook
vi.mock('../../hooks/useRealtimeSubscription', () => ({
    useRealtimeProjects: vi.fn()
}))

import { getProjects, deleteProject, toggleProjectPublish, toggleProjectFeatured } from '../../services/projects'

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

const mockProjects = [
    {
        id: '1',
        title_tr: 'Test Proje 1',
        title_en: 'Test Project 1',
        slug: 'test-project-1',
        category: 'Web',
        tech: ['React', 'TypeScript', 'Node.js'],
        published: true,
        featured: true,
        created_at: '2024-01-15T10:00:00Z',
        deleted_at: null
    },
    {
        id: '2',
        title_tr: 'Test Proje 2',
        title_en: 'Test Project 2',
        slug: 'test-project-2',
        category: 'Mobile',
        tech: ['React Native', 'Expo'],
        published: false,
        featured: false,
        created_at: '2024-01-10T10:00:00Z',
        deleted_at: null
    }
]

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

describe('ProjectsList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
        vi.mocked(getProjects).mockResolvedValue(mockProjects as any)
    })

    describe('authentication', () => {
        it('redirects to login when not authenticated', () => {
            renderWithRouter(<ProjectsList />)
            expect(mockNavigate).toHaveBeenCalledWith('/admin')
        })

        it('stays on page when authenticated', async () => {
            sessionStorage.setItem('admin_auth', 'true')
            renderWithRouter(<ProjectsList />)
            await waitFor(() => screen.getByText('Test Proje 1'))
            expect(mockNavigate).not.toHaveBeenCalledWith('/admin')
        })
    })

    describe('rendering', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('renders page title', async () => {
            renderWithRouter(<ProjectsList />)
            await waitFor(() => screen.getByText('Test Proje 1'))
            expect(screen.getByText('Projeler')).toBeInTheDocument()
        })

        it('renders description', async () => {
            renderWithRouter(<ProjectsList />)
            await waitFor(() => screen.getByText('Test Proje 1'))
            expect(screen.getByText('Tüm projeleri yönetin')).toBeInTheDocument()
        })

        it('renders Yeni Proje button', async () => {
            renderWithRouter(<ProjectsList />)
            await waitFor(() => screen.getByText('Test Proje 1'))
            expect(screen.getByText('Yeni Proje')).toBeInTheDocument()
        })

        it('renders realtime indicator', async () => {
            renderWithRouter(<ProjectsList />)
            await waitFor(() => screen.getByText('Test Proje 1'))
            expect(screen.getByText('Canlı güncelleme aktif')).toBeInTheDocument()
        })

        it('shows loading state initially', async () => {
            renderWithRouter(<ProjectsList />)
            expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()

            // Wait for loading to complete to avoid act warnings
            await waitFor(() => screen.getByText('Test Proje 1'))
        })
    })

    describe('projects list', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('displays projects after loading', async () => {
            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Test Proje 1')).toBeInTheDocument()
            })
        })

        it('displays project category', async () => {
            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Web')).toBeInTheDocument()
            })
        })

        it('displays tech tags', async () => {
            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('React')).toBeInTheDocument()
            })
        })

        it('shows empty state when no projects', async () => {
            vi.mocked(getProjects).mockResolvedValue([] as any)

            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Henüz proje yok')).toBeInTheDocument()
            })
        })
    })

    describe('table headers', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('renders Proje header', async () => {
            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Proje')).toBeInTheDocument()
            })
        })

        it('renders Kategori header', async () => {
            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Kategori')).toBeInTheDocument()
            })
        })

        it('renders Teknolojiler header', async () => {
            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Teknolojiler')).toBeInTheDocument()
            })
        })
    })

    describe('actions', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('toggles publish status', async () => {
            const user = userEvent.setup()
            vi.mocked(toggleProjectPublish).mockResolvedValue({ id: '1', published: false } as any)

            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Yayında')).toBeInTheDocument()
            })

            const publishBtn = screen.getByText('Yayında')
            await user.click(publishBtn)

            expect(toggleProjectPublish).toHaveBeenCalledWith('1', false)
        })

        it('toggles featured status', async () => {
            const user = userEvent.setup()
            vi.mocked(toggleProjectFeatured).mockResolvedValue({ id: '1', featured: false } as any)

            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                const starButtons = screen.getAllByTitle(/Öne çıkar/)
                expect(starButtons.length).toBeGreaterThan(0)
            })

            const starButton = screen.getAllByTitle(/Öne çıkar/)[0]
            await user.click(starButton)

            expect(toggleProjectFeatured).toHaveBeenCalled()
        })

        it('deletes project with confirmation', async () => {
            const user = userEvent.setup()
            vi.mocked(deleteProject).mockResolvedValue(true)

            renderWithRouter(<ProjectsList />)

            await waitFor(() => {
                expect(screen.getByText('Test Proje 1')).toBeInTheDocument()
            })

            const deleteButtons = screen.getAllByTitle('Sil')
            await user.click(deleteButtons[0])

            expect(deleteProject).toHaveBeenCalledWith('1')
        })
    })

    describe('links', () => {
        beforeEach(() => {
            sessionStorage.setItem('admin_auth', 'true')
        })

        it('Yeni Proje links to /admin/projects/new', async () => {
            renderWithRouter(<ProjectsList />)
            await waitFor(() => screen.getByText('Test Proje 1'))
            const link = screen.getByText('Yeni Proje').closest('a')
            expect(link).toHaveAttribute('href', '/admin/projects/new')
        })
    })
})
