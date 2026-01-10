import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProjectsPage } from './ProjectsPage'
import { LangProvider } from '../context/LangContext'

// Hoist mocks to make them available in vi.mock factory
const mocks = vi.hoisted(() => {
    const select = vi.fn()
    const order = vi.fn()
    const from = vi.fn()
    const eq = vi.fn()

    return { select, order, from, eq }
})

// Configure mock chain behavior
mocks.from.mockReturnValue({
    select: mocks.select
})
mocks.select.mockReturnValue({
    eq: mocks.eq
})
mocks.eq.mockReturnValue({
    order: mocks.order
})
mocks.order.mockResolvedValue({ data: [], error: null }) // Default return

// Mock using absolute path
vi.mock('../../src/lib/supabase-client', () => ({
    getSupabaseClient: () => ({
        from: mocks.from
    })
}))
vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => ({
        from: mocks.from
    })
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

describe('ProjectsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Restore default chain
        mocks.from.mockReturnValue({ select: mocks.select })
        mocks.select.mockReturnValue({ eq: mocks.eq })
        mocks.eq.mockReturnValue({ order: mocks.order })
        mocks.order.mockResolvedValue({ data: [], error: null })
    })

    it('renders page title', async () => {
        renderWithProviders(<ProjectsPage />)

        await waitFor(() => {
            // Use exact heading match to avoid ambiguity with description text
            expect(screen.getByRole('heading', { name: "Projects" })).toBeInTheDocument()
            expect(screen.getByText(/Projects and case studies/i)).toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('renders project list from supabase', async () => {
        const mockData = [
            { id: '1', title_en: 'Project A', category: 'Web', image_url: 'img1.jpg', slug: 'proj-a' },
            { id: '2', title_en: 'Project B', category: 'Mobile', image_url: 'img2.jpg', slug: 'proj-b' }
        ]
        mocks.order.mockResolvedValue({ data: mockData, error: null })

        renderWithProviders(<ProjectsPage />)

        await waitFor(() => {
            expect(screen.getByText('Project A')).toBeInTheDocument()
            expect(screen.getByText('Project B')).toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('filters projects', async () => {
        const mockData = [
            { id: '1', title_en: 'Web App', category: 'Web', image_url: 'img.jpg', slug: 'web' },
            { id: '2', title_en: 'Mobile App', category: 'App', image_url: 'img.jpg', slug: 'mob' }
        ]
        mocks.order.mockResolvedValue({ data: mockData, error: null })

        renderWithProviders(<ProjectsPage />)

        // Wait for initial render
        await waitFor(() => expect(screen.getByText('Web App')).toBeInTheDocument(), { timeout: 3000 })

        // Click filter
        const filterBtn = screen.getByRole('button', { name: /Web Apps/i })
        fireEvent.click(filterBtn)

        await waitFor(() => {
            expect(screen.getByText('Web App')).toBeInTheDocument()
            // Mobile App should be filtered out
            expect(screen.queryByText('Mobile App')).not.toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('renders project links correcty', async () => {
        const mockData = [{ id: '1', title_en: 'P1', category: 'Web', image_url: 'i.jpg', slug: 'p1' }]
        mocks.order.mockResolvedValue({ data: mockData, error: null })

        renderWithProviders(<ProjectsPage />)

        await waitFor(() => {
            const link = screen.getByText('P1').closest('a')
            expect(link).toHaveAttribute('href', '/projects/p1')
        }, { timeout: 3000 })
    })
})
