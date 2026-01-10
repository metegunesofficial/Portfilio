import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TestimonialsList } from './TestimonialsList'
import * as testimonialsService from '../../services/testimonials'

// Mock styles/icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual as any,
        Plus: () => <span>IconPlus</span>,
        Edit: () => <span>IconEdit</span>,
        Trash2: () => <span>IconTrash</span>,
        Eye: () => <span>IconEye</span>,
        EyeOff: () => <span>IconEyeOff</span>,
        MessageSquare: () => <span>IconMessageSquare</span>,
        Star: () => <span>IconStar</span>,
        RotateCcw: () => <span>IconRotateCcw</span>,
        Archive: () => <span>IconArchive</span>,
        Save: () => <span>IconSave</span>,
        X: () => <span>IconX</span>,
    }
})

// Mock generic services
vi.mock('../../services/testimonials', () => ({
    getTestimonials: vi.fn(),
    createTestimonial: vi.fn(),
    updateTestimonial: vi.fn(),
    deleteTestimonial: vi.fn(),
    restoreTestimonial: vi.fn(),
    toggleTestimonialPublish: vi.fn(),
    toggleTestimonialFeatured: vi.fn()
}))

// Mock realtime hook
vi.mock('../../hooks/useRealtimeSubscription', () => ({
    useRealtimeTestimonials: vi.fn()
}))

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

const mockTestimonials: any[] = [
    {
        id: '1',
        name: 'John Doe',
        role_tr: 'CEO',
        role_en: 'CEO',
        company: 'Acme Corp',
        quote_tr: 'Harika bir iş.',
        quote_en: 'Great job.',
        rating: 5,
        published: true,
        featured: false,
        created_at: '2023-01-01',
        deleted_at: null
    },
    {
        id: '2',
        name: 'Jane Smith',
        role_tr: 'CTO',
        role_en: 'CTO',
        company: 'Tech Solutions',
        quote_tr: 'Çok memnun kaldık.',
        quote_en: 'We are very satisfied.',
        rating: 4,
        published: false,
        featured: true,
        created_at: '2023-01-02',
        deleted_at: null
    }
]

describe('TestimonialsList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.setItem('admin_auth', 'true')
        vi.mocked(testimonialsService.getTestimonials).mockResolvedValue(mockTestimonials)
    })

    it('renders testimonials list correctly', async () => {
        render(<TestimonialsList />)

        expect(screen.getByText('Referanslar')).toBeInTheDocument()
        expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument()
        })

        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByText('"Harika bir iş."')).toBeInTheDocument()
    })

    it('redirects to login if not authenticated', () => {
        sessionStorage.removeItem('admin_auth')
        render(<TestimonialsList />)
        expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })

    it('toggles deleted testimonials view', async () => {
        render(<TestimonialsList />)
        await waitFor(() => screen.queryByText('Yükleniyor...'))

        const toggleBtn = screen.getByText(/Silinmişler/i)
        fireEvent.click(toggleBtn)

        await waitFor(() => {
            expect(testimonialsService.getTestimonials).toHaveBeenCalledWith(
                expect.objectContaining({ includeDeleted: true })
            )
        })
        expect(screen.getByText('Aktif Referanslar')).toBeInTheDocument()
    })

    it('opens create modal and creates a testimonial', async () => {
        render(<TestimonialsList />)
        await waitFor(() => screen.queryByText('Yükleniyor...'))

        fireEvent.click(screen.getByText('Yeni Referans'))

        const modalTitle = screen.getByText('Yeni Referans', { selector: 'h2' })
        expect(modalTitle).toBeInTheDocument()

        fireEvent.change(screen.getByPlaceholderText('Müşteri adı'), { target: { value: 'New Client' } })
        fireEvent.change(screen.getByPlaceholderText('Türkçe yorum...'), { target: { value: 'Güzel.' } })
        fireEvent.change(screen.getByPlaceholderText('English comment...'), { target: { value: 'Nice.' } })

        const saveBtn = screen.getByText('Oluştur')
        fireEvent.click(saveBtn)

        await waitFor(() => {
            expect(testimonialsService.createTestimonial).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Client',
                quote_tr: 'Güzel.',
                quote_en: 'Nice.'
            }))
        })
    })

    it('opens edit modal and updates a testimonial', async () => {
        render(<TestimonialsList />)
        await waitFor(() => screen.queryByText('Yükleniyor...'))

        const editBtns = screen.getAllByTitle('Düzenle')
        fireEvent.click(editBtns[0])

        expect(screen.getByText('Referansı Düzenle')).toBeInTheDocument()
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()

        fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'John Updated' } })

        const saveBtn = screen.getByText('Kaydet')
        fireEvent.click(saveBtn)

        await waitFor(() => {
            expect(testimonialsService.updateTestimonial).toHaveBeenCalledWith('1', expect.objectContaining({
                name: 'John Updated'
            }))
        })
    })

    it('handles delete action', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        render(<TestimonialsList />)
        await waitFor(() => screen.queryByText('Yükleniyor...'))

        const deleteBtns = screen.getAllByTitle('Sil')
        fireEvent.click(deleteBtns[0])

        await waitFor(() => {
            expect(testimonialsService.deleteTestimonial).toHaveBeenCalledWith('1')
        })
    })

    it('handles toggle publish action', async () => {
        render(<TestimonialsList />)
        await waitFor(() => screen.queryByText('Yükleniyor...'))

        // First item is published (true), icon should be Eye
        // Click to toggle
        const toggleBtns = screen.getAllByTitle('Yayında')
        fireEvent.click(toggleBtns[0]) // Since first item is published

        await waitFor(() => {
            expect(testimonialsService.toggleTestimonialPublish).toHaveBeenCalledWith('1', false)
        })
    })

    it('handles toggle featured action', async () => {
        render(<TestimonialsList />)
        await waitFor(() => screen.queryByText('Yükleniyor...'))

        // First item not featured
        const featuredBtn = screen.getAllByTitle('Öne çıkar')[0]
        fireEvent.click(featuredBtn)

        await waitFor(() => {
            expect(testimonialsService.toggleTestimonialFeatured).toHaveBeenCalledWith('1', true)
        })
    })
})
