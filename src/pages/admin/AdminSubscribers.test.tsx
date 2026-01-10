import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { AdminSubscribers } from './AdminSubscribers'
import * as newsletterService from '../../services/newsletter'

// Mock styles/icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual as any,
        Users: () => <span>IconUsers</span>,
        Search: () => <span>IconSearch</span>,
        Download: () => <span>IconDownload</span>,
        Trash2: () => <span>IconTrash</span>,
        RefreshCw: () => <span>IconRefresh</span>,
        CheckCircle: () => <span>IconCheck</span>,
        XCircle: () => <span>IconX</span>,
        AlertCircle: () => <span>IconAlert</span>,
        Mail: () => <span>IconMail</span>,
        Calendar: () => <span>IconCalendar</span>,
    }
})

// Mock services
vi.mock('../../services/newsletter', () => ({
    getAllSubscribers: vi.fn(),
    getSubscriberStats: vi.fn(),
    deleteSubscriber: vi.fn(),
    restoreSubscriber: vi.fn(),
    unsubscribeById: vi.fn(),
    subscribeToSubscribersChanges: vi.fn(() => ({
        unsubscribe: vi.fn()
    }))
}))

// Mock URL for CSV export
global.URL.createObjectURL = vi.fn()

const mockSubscribers = [
    {
        id: '1',
        email: 'sub1@example.com',
        name: 'Subscriber One',
        status: 'active',
        source: 'footer',
        subscribed_at: '2023-01-01',
        deleted_at: null
    },
    {
        id: '2',
        email: 'sub2@example.com',
        name: 'Subscriber Two',
        status: 'unsubscribed',
        source: 'popup',
        subscribed_at: '2023-01-02',
        deleted_at: null
    }
]

const mockStats = {
    total: 10,
    active: 8,
    unsubscribed: 1,
    bounced: 1,
    thisMonth: 2,
    growthRate: 5
}

describe('AdminSubscribers', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(newsletterService.getAllSubscribers).mockResolvedValue(mockSubscribers as any)
        vi.mocked(newsletterService.getSubscriberStats).mockResolvedValue(mockStats)
    })

    it('renders stats and subscribers list', async () => {
        render(<AdminSubscribers />)

        expect(screen.getByText('Bülten Aboneleri')).toBeInTheDocument()

        await waitFor(() => {
            const totalStat = screen.getByText('Toplam Abone').previousSibling
            expect(totalStat).toHaveTextContent('10')
            expect(screen.getByText('sub1@example.com')).toBeInTheDocument()
        })
    })

    it('filters subscribers by search term', async () => {
        render(<AdminSubscribers />)
        await waitFor(() => screen.getByText('sub1@example.com'))

        const searchInput = screen.getByPlaceholderText('Email veya isim ara...')
        fireEvent.change(searchInput, { target: { value: 'sub2' } })

        await waitFor(() => {
            expect(screen.queryByText('sub1@example.com')).not.toBeInTheDocument()
        })
        expect(screen.getByText('sub2@example.com')).toBeInTheDocument()
    })

    it('filters subscribers by status', async () => {
        render(<AdminSubscribers />)
        await waitFor(() => screen.getByText('sub1@example.com'))

        // Mock different response for filtered data
        vi.mocked(newsletterService.getAllSubscribers).mockResolvedValueOnce([mockSubscribers[0]] as any)

        const statusSelect = screen.getByRole('combobox')
        fireEvent.change(statusSelect, { target: { value: 'active' } })

        await waitFor(() => {
            expect(newsletterService.getAllSubscribers).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'active' })
            )
        })
    })

    it('toggles deleted subscribers view', async () => {
        render(<AdminSubscribers />)
        await waitFor(() => screen.getByText('sub1@example.com'))

        const deletedCheckbox = screen.getByLabelText(/Silinenleri Göster/i)
        fireEvent.click(deletedCheckbox)

        await waitFor(() => {
            expect(newsletterService.getAllSubscribers).toHaveBeenCalledWith(
                expect.objectContaining({ includeDeleted: true })
            )
        })
    })

    it('handles unsubscribe action', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.mocked(newsletterService.unsubscribeById).mockResolvedValue(true as any)

        render(<AdminSubscribers />)
        await waitFor(() => screen.getByText('sub1@example.com'))

        const row = screen.getByText('sub1@example.com').closest('tr')
        const unsubscribeMsg = within(row!).getByTitle('Aboneliği İptal Et')
        fireEvent.click(unsubscribeMsg)

        await waitFor(() => {
            expect(newsletterService.unsubscribeById).toHaveBeenCalledWith('1')
        })
    })

    it('handles delete action', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.mocked(newsletterService.deleteSubscriber).mockResolvedValue(true as any)

        render(<AdminSubscribers />)
        await waitFor(() => screen.getByText('sub1@example.com'))

        const row = screen.getByText('sub1@example.com').closest('tr')
        const deleteBtn = within(row!).getByTitle('Sil')
        fireEvent.click(deleteBtn)

        await waitFor(() => {
            expect(newsletterService.deleteSubscriber).toHaveBeenCalledWith('1')
        })
    })

    it('handles export CSV', async () => {
        render(<AdminSubscribers />)
        await waitFor(() => screen.getByText('sub1@example.com'))

        const exportBtn = screen.getByText('CSV İndir')
        fireEvent.click(exportBtn)

        expect(global.URL.createObjectURL).toHaveBeenCalled()
    })
})
