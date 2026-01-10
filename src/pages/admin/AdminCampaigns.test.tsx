// AdminCampaigns Page Unit Tests
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AdminCampaigns } from './AdminCampaigns'
import { deleteCampaign } from '../../services/email-campaigns'

// Mock services
const mockCampaigns = [
    {
        id: '1',
        subject: 'Test Campaign',
        status: 'draft', // Type is matched now
        total_recipients: 100,
        delivered: 0,
        opened: 0,
        clicked: 0,
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
    }
]

const mockStats = {
    totalCampaigns: 1,
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0,
    avgOpenRate: 0,
    avgClickRate: 0
}

vi.mock('../../services/email-campaigns', () => ({
    getCampaigns: vi.fn(() => Promise.resolve({ campaigns: mockCampaigns, total: 1 })),
    getCampaignStats: vi.fn(() => Promise.resolve(mockStats)),
    createCampaign: vi.fn((data) => Promise.resolve({ id: '2', ...data, created_at: '2023-01-02' })),
    updateCampaignStatus: vi.fn(() => Promise.resolve({ ...mockCampaigns[0], status: 'sending' })),
    deleteCampaign: vi.fn(() => Promise.resolve(true)),
    subscribeToCampaignsChanges: vi.fn(() => ({
        unsubscribe: vi.fn()
    }))
}))

vi.mock('../../services/newsletter', () => ({
    getActiveSubscribers: vi.fn(() => Promise.resolve([{ id: 'sub1' }]))
}))

describe('AdminCampaigns Page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders stats and campaigns list', async () => {
        render(<AdminCampaigns />)

        // Wait for stats to load
        await waitFor(() => {
            const label = screen.getByText('Toplam Kampanya')
            const value = label.parentElement?.querySelector('.stat-value')
            expect(value).toHaveTextContent('1')
        })

        // List
        expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    })

    it('opens new campaign modal', async () => {
        render(<AdminCampaigns />)
        await waitFor(() => screen.getByText('Test Campaign'))

        const newButton = screen.getByText('Yeni Kampanya')
        fireEvent.click(newButton)

        expect(screen.getByText('Yeni Kampanya', { selector: 'h2' })).toBeInTheDocument()
        expect(screen.getByText(/Bu özellik yakında eklenecek/i)).toBeInTheDocument()

        const closeButton = screen.getByText('Kapat')
        fireEvent.click(closeButton)
    })

    it('handles delete campaign', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

        render(<AdminCampaigns />)
        await waitFor(() => screen.getByText('Test Campaign'))

        const deleteButton = screen.getByTitle('Sil')
        fireEvent.click(deleteButton)

        expect(confirmSpy).toHaveBeenCalled()

        await waitFor(() => {
            expect(deleteCampaign).toHaveBeenCalledWith('1')
        })
    })
})
