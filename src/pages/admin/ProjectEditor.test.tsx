import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProjectEditor } from './ProjectEditor'

// Mock icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual as any,
        ArrowLeft: () => <span>IconArrowLeft</span>,
        Save: () => <span>IconSave</span>,
        Eye: () => <span>IconEye</span>,
        EyeOff: () => <span>IconEyeOff</span>,
        Star: () => <span>IconStar</span>,
        X: () => <span>IconX</span>,
        Plus: () => <span>IconPlus</span>,
    }
})

// Mock TipTapEditor
vi.mock('../../components/TipTapEditor', () => ({
    TipTapEditor: ({ content, onChange, placeholder }: any) => (
        <textarea
            data-testid="tiptap-editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    )
}))

// Mock Supabase with stable references
const mockSingle = vi.fn()
const mockSelectEq = vi.fn()
const mockUpdateEq = vi.fn()

const mockSelectBuilder = {
    eq: mockSelectEq
}

const mockUpdateBuilder = {
    eq: mockUpdateEq
}

const mockFromSelect = vi.fn()
const mockFromInsert = vi.fn()
const mockFromUpdate = vi.fn()

const mockSupabase = {
    from: vi.fn(() => ({
        select: mockFromSelect,
        insert: mockFromInsert,
        update: mockFromUpdate,
    }))
}

// Chain setup
mockFromSelect.mockReturnValue(mockSelectBuilder)
mockFromInsert.mockResolvedValue({ error: null })
mockFromUpdate.mockReturnValue(mockUpdateBuilder)

mockSelectEq.mockReturnValue({ single: mockSingle })
mockUpdateEq.mockResolvedValue({ error: null })

vi.mock('../../lib/supabase-client', () => ({
    getSupabaseClient: () => mockSupabase
}))

// Mock Router
const mockNavigate = vi.fn()
const mockParams = { id: undefined as string | undefined }

vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => mockParams
    }
})

describe('ProjectEditor', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.setItem('admin_auth', 'true')
        mockParams.id = undefined

        // Reset chain behavior
        mockSingle.mockResolvedValue({ data: null, error: null })
        mockUpdateEq.mockResolvedValue({ error: null })
        mockSelectEq.mockReturnValue({ single: mockSingle })

        mockFromSelect.mockReturnValue(mockSelectBuilder)
        mockFromInsert.mockResolvedValue({ error: null })
        mockFromUpdate.mockReturnValue(mockUpdateBuilder)
    })

    it('renders empty form in create mode', () => {
        render(<ProjectEditor />)
        expect(screen.getByText('Yeni Proje')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Proje adı')).toHaveValue('')
    })

    it('generates slug from title', () => {
        render(<ProjectEditor />)
        const titleInput = screen.getByPlaceholderText('Proje adı')
        fireEvent.change(titleInput, { target: { value: 'Yeni Proje' } })

        const slugInput = screen.getByPlaceholderText('proje-adi')
        expect(slugInput).toHaveValue('yeni-proje')
    })

    it('handles adding and removing technologies', () => {
        render(<ProjectEditor />)

        const techInput = screen.getByPlaceholderText('React, Node.js...')
        // Find add button by class since we mock icon
        const addBtnByClass = screen.getAllByRole('button').find(b => b.className.includes('add-tech-btn'))

        fireEvent.change(techInput, { target: { value: 'React' } })
        fireEvent.click(addBtnByClass!)

        expect(screen.getByText('React')).toBeInTheDocument()

        fireEvent.change(techInput, { target: { value: 'TypeScript' } })
        fireEvent.keyPress(techInput, { key: 'Enter', code: 'Enter', charCode: 13 })

        expect(screen.getByText('TypeScript')).toBeInTheDocument()

        // Remove React
        const removeBtns = screen.getAllByText('IconX')
        fireEvent.click(removeBtns[0].closest('button')!) // First X is for React

        expect(screen.queryByText('React')).not.toBeInTheDocument()
    })

    it('fetches and displays project data in edit mode', async () => {
        mockParams.id = '999'
        mockSingle.mockResolvedValue({
            data: {
                title_tr: 'Test Project',
                description_tr: 'Desc',
                category: 'Web',
                tech: ['Vue', 'Vite'],
                slug: 'test-project'
            },
            error: null
        })

        render(<ProjectEditor />)

        await waitFor(() => {
            expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument()
        })

        expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument()
        expect(screen.getByText('Vue')).toBeInTheDocument()
        expect(screen.getByText('Vite')).toBeInTheDocument()
    })

    it('submits new project', async () => {
        render(<ProjectEditor />)

        fireEvent.change(screen.getByPlaceholderText('Proje adı'), { target: { value: 'New Project' } })

        // Save
        const saveBtn = screen.getByText('Kaydet')
        fireEvent.click(saveBtn)

        await waitFor(() => {
            expect(mockFromInsert).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    title_tr: 'New Project',
                    slug: 'new-project'
                })
            ]))
        })
    })

    it('updates existing project', async () => {
        mockParams.id = '999'
        mockSingle.mockResolvedValue({
            data: {
                id: '999',
                title_tr: 'Old Project',
                tech: []
            },
            error: null
        })

        render(<ProjectEditor />)
        await waitFor(() => expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument())

        fireEvent.change(screen.getByDisplayValue('Old Project'), { target: { value: 'Updated Project' } })

        const saveBtn = screen.getByText('Kaydet')
        fireEvent.click(saveBtn)

        await waitFor(() => {
            expect(mockFromUpdate).toHaveBeenCalledWith(expect.objectContaining({
                title_tr: 'Updated Project'
            }))
            expect(mockUpdateEq).toHaveBeenCalledWith('id', '999')
        })
    })
})
