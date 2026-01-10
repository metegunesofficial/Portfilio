import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactMessagesList } from './ContactMessagesList'
import * as contactService from '../../services/contact'
import { BrowserRouter } from 'react-router-dom'

// Mock styles import if any (none visible in file but good practice)
// Mock lucide-react icons components to avoid rendering complications
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual as any,
        Mail: () => <span data-testid="icon-mail">Mail</span>,
        Archive: () => <span data-testid="icon-archive">Archive</span>,
        Reply: () => <span data-testid="icon-reply">Reply</span>,
        Trash2: () => <span data-testid="icon-trash">Trash</span>,
        RotateCcw: () => <span data-testid="icon-restore">Restore</span>,
        MessageSquare: () => <span data-testid="icon-message">Message</span>,
        Clock: () => <span data-testid="icon-clock">Clock</span>,
    }
})

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

// Mock services
vi.mock('../../services/contact', () => ({
    getContactMessages: vi.fn(),
    markMessageAsRead: vi.fn(),
    markMessageAsReplied: vi.fn(),
    archiveMessage: vi.fn(),
    deleteContactMessage: vi.fn(),
    restoreContactMessage: vi.fn()
}))

// Mock realtime hook
vi.mock('../../hooks/useRealtimeSubscription', () => ({
    useRealtimeMessages: vi.fn()
}))

const mockMessages = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        subject: 'Test Subject',
        message: 'Test Message Content',
        status: 'new',
        created_at: new Date().toISOString(),
        deleted_at: null,
        kvkk_consent: true
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        subject: 'Another Subject',
        message: 'Another Message Content',
        status: 'read',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        deleted_at: null,
        kvkk_consent: false
    }
]

describe('ContactMessagesList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.setItem('admin_auth', 'true')
        vi.mocked(contactService.getContactMessages).mockResolvedValue(mockMessages as any)
    })

    const renderComponent = () => {
        render(
            <BrowserRouter>
                <ContactMessagesList />
            </BrowserRouter>
        )
    }

    it('redirects to login if not authenticated', () => {
        sessionStorage.removeItem('admin_auth')
        renderComponent()
        expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })

    it('renders messages list', async () => {
        renderComponent()

        expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        })
    })

    it('shows message details when clicked and marks as read', async () => {
        renderComponent()
        await waitFor(() => screen.getByText('John Doe'))

        // Mock state update after markAsRead
        vi.mocked(contactService.markMessageAsRead).mockResolvedValue(true as any)

        const messageItem = screen.getByText('John Doe').closest('.message-item')
        fireEvent.click(messageItem!)

        expect(screen.getByText('Test Message Content')).toBeInTheDocument()

        await waitFor(() => {
            expect(contactService.markMessageAsRead).toHaveBeenCalledWith('1')
        })
    })

    it('handles filter change', async () => {
        renderComponent()
        await waitFor(() => screen.getByText('John Doe'))

        // Mock different response
        vi.mocked(contactService.getContactMessages).mockResolvedValueOnce([mockMessages[1]] as any)

        const filterSelect = screen.getByRole('combobox') // Selectbox
        fireEvent.change(filterSelect, { target: { value: 'read' } })

        await waitFor(() => {
            expect(contactService.getContactMessages).toHaveBeenCalledWith(expect.objectContaining({ status: 'read' }))
        })
    })

    it('toggles deleted messages view', async () => {
        renderComponent()
        await waitFor(() => screen.getByText('John Doe'))

        const validDeletedMessages = mockMessages.map(m => ({ ...m, deleted_at: new Date().toISOString() }))
        vi.mocked(contactService.getContactMessages).mockResolvedValueOnce(validDeletedMessages as any)

        const toggleButton = screen.getByText(/Silinmişler/i)
        fireEvent.click(toggleButton)

        await waitFor(() => {
            expect(contactService.getContactMessages).toHaveBeenCalledWith(expect.objectContaining({ includeDeleted: true }))
        })

        await waitFor(() => {
            expect(screen.getByText('Aktif Mesajlar')).toBeInTheDocument()
        })
    })

    it('handles mark as replied', async () => {
        renderComponent()
        await waitFor(() => screen.getByText('John Doe'))

        vi.mocked(contactService.markMessageAsReplied).mockResolvedValue(true as any)

        fireEvent.click(screen.getByText('John Doe')) // Select message

        const replyButton = screen.getByTitle('Yanıtlandı İşaretle')
        fireEvent.click(replyButton)

        await waitFor(() => {
            expect(contactService.markMessageAsReplied).toHaveBeenCalledWith('1')
        })
    })

    it('handles archive', async () => {
        renderComponent()
        await waitFor(() => screen.getByText('John Doe'))

        vi.mocked(contactService.archiveMessage).mockResolvedValue(true as any)

        fireEvent.click(screen.getByText('John Doe')) // Select message

        const archiveButton = screen.getByTitle('Arşivle')
        fireEvent.click(archiveButton)

        await waitFor(() => {
            expect(contactService.archiveMessage).toHaveBeenCalledWith('1')
        })
    })

    it('handles delete', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.mocked(contactService.deleteContactMessage).mockResolvedValue(true as any)

        renderComponent()
        await waitFor(() => screen.getByText('John Doe'))

        fireEvent.click(screen.getByText('John Doe')) // Select message

        const deleteButton = screen.getByTitle('Sil')
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(contactService.deleteContactMessage).toHaveBeenCalledWith('1')
        })
    })
})
