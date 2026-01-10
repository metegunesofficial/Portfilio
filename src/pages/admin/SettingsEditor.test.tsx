import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsEditor } from './SettingsEditor'

// Mock icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual as any,
        Save: () => <span>IconSave</span>,
        Globe: () => <span>IconGlobe</span>,
        User: () => <span>IconUser</span>,
        Link: () => <span>IconLink</span>,
        Mail: () => <span>IconMail</span>,
        Loader2: () => <span>IconLoader2</span>,
    }
})

// Mock Supabase
const mockFromSelect = vi.fn()
const mockFromUpsert = vi.fn()

const mockSupabase = {
    from: vi.fn(() => ({
        select: mockFromSelect,
        upsert: mockFromUpsert,
    }))
}

// Chain setup
mockFromSelect.mockResolvedValue({ data: [], error: null })
mockFromUpsert.mockResolvedValue({ error: null })

vi.mock('../../lib/supabase-client', () => ({
    getSupabaseClient: () => mockSupabase
}))

// Mock Router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe('SettingsEditor', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.setItem('admin_auth', 'true')

        // Reset chain behavior
        mockFromSelect.mockResolvedValue({ data: [], error: null })
        mockFromUpsert.mockResolvedValue({ error: null })
        vi.stubGlobal('alert', vi.fn())
    })

    it('renders loading initially', async () => {
        render(<SettingsEditor />)
        expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()
        await waitFor(() => expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument())
    })

    it('redirects if not authenticated', async () => {
        sessionStorage.removeItem('admin_auth')
        render(<SettingsEditor />)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin')
        })
    })

    it('fetches and displays settings correctly', async () => {
        mockFromSelect.mockResolvedValue({
            data: [
                { key: 'hero_title', value_tr: 'TR Title', value_en: 'EN Title', type: 'text' },
                { key: 'skills', value_tr: '["React","Vue"]', type: 'json' },
                { key: 'social_links', value_tr: '{"linkedin":"ln_url"}', type: 'json' }
            ],
            error: null
        })

        render(<SettingsEditor />)

        await waitFor(() => {
            expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument()
        })

        // General tab default
        expect(screen.getByDisplayValue('TR Title')).toBeInTheDocument()
        expect(screen.getByDisplayValue('EN Title')).toBeInTheDocument()
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('Vue')).toBeInTheDocument()
    })

    it('handles tab switching', async () => {
        render(<SettingsEditor />)
        await waitFor(() => expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument())

        const socialTab = screen.getByText('Sosyal Medya')
        fireEvent.click(socialTab)

        expect(screen.getByText('Sosyal Medya Linkleri')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('https://linkedin.com/in/...')).toBeInTheDocument()

        const contactTab = screen.getByText('İletişim')
        fireEvent.click(contactTab)

        expect(screen.getByText('İletişim Bilgileri')).toBeInTheDocument()
    })

    it('adds and removes skills', async () => {
        render(<SettingsEditor />)
        await waitFor(() => expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument())

        const skillInput = screen.getByPlaceholderText('React, Node.js...')
        const addBtn = screen.getByText('Ekle')

        fireEvent.change(skillInput, { target: { value: 'Angular' } })
        fireEvent.click(addBtn)

        expect(screen.getByText('Angular')).toBeInTheDocument()

        const removeBtns = screen.getAllByText('×')
        fireEvent.click(removeBtns[removeBtns.length - 1]) // Click last remove btn (Angular)

        expect(screen.queryByText('Angular')).not.toBeInTheDocument()
    })

    it('saves settings correctly', async () => {
        render(<SettingsEditor />)
        await waitFor(() => expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument())

        // Update title
        const titleInput = screen.getByPlaceholderText('Merhaba, Ben Mete')
        fireEvent.change(titleInput, { target: { value: 'New TR Title' } })

        const saveBtn = screen.getByText('Kaydet')
        fireEvent.click(saveBtn)

        await waitFor(() => {
            expect(mockFromUpsert).toHaveBeenCalled()
            // Check if upsert was called for hero_title
            expect(mockFromUpsert).toHaveBeenCalledWith(expect.objectContaining({
                key: 'hero_title',
                value_tr: 'New TR Title',
            }), expect.anything())
        })
    })
})
