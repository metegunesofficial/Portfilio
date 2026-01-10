import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BlogEditor } from './BlogEditor'

// Mock icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual as any,
        ArrowLeft: () => <span>IconArrowLeft</span>,
        Save: () => <span>IconSave</span>,
        Eye: () => <span>IconEye</span>,
        EyeOff: () => <span>IconEyeOff</span>,
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

describe('BlogEditor', () => {
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
        render(<BlogEditor />)
        expect(screen.getByText('Yeni Blog')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Blog başlığı')).toHaveValue('')
    })

    it('redirects if not authenticated', () => {
        sessionStorage.removeItem('admin_auth')
        render(<BlogEditor />)
        expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })

    it('generates slug from title', () => {
        render(<BlogEditor />)
        const titleInput = screen.getByPlaceholderText('Blog başlığı')
        fireEvent.change(titleInput, { target: { value: 'Yeni Blog Başlığı' } })

        const slugInput = screen.getByPlaceholderText('url-slug')
        expect(slugInput).toHaveValue('yeni-blog-basligi')
    })

    it('switches languages', () => {
        render(<BlogEditor />)

        const enTab = screen.getByText('🇬🇧 English')
        fireEvent.click(enTab)

        expect(screen.getByText('Title (EN)')).toBeInTheDocument()
        expect(screen.queryByText('Başlık (TR)')).not.toBeInTheDocument()
    })

    it('fetches and displays blog data in edit mode', async () => {
        mockParams.id = '123'
        mockSingle.mockResolvedValue({
            data: {
                title_tr: 'Test Blog',
                content_tr: '<p>Content</p>',
                category: 'AI',
                slug: 'test-blog'
            },
            error: null
        })

        render(<BlogEditor />)

        expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument()
        })

        expect(screen.getByDisplayValue('Test Blog')).toBeInTheDocument()
        expect(screen.getByDisplayValue('test-blog')).toBeInTheDocument()
    })

    it('submits new blog', async () => {
        render(<BlogEditor />)

        fireEvent.change(screen.getByPlaceholderText('Blog başlığı'), { target: { value: 'My Blog' } })

        // Find editors by testid (simulated as textarea)
        const editors = screen.getAllByTestId('tiptap-editor')
        // Assuming first editor is TR content
        fireEvent.change(editors[0], { target: { value: '<p>My Content</p>' } })

        const saveBtn = screen.getByText('Kaydet')
        fireEvent.click(saveBtn)

        await waitFor(() => {
            expect(mockFromInsert).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    title_tr: 'My Blog',
                    content_tr: '<p>My Content</p>',
                    slug: 'my-blog'
                })
            ]))
        })
        expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard')
    })

    it('updates existing blog', async () => {
        mockParams.id = '123'
        // Mock fetch response
        mockSingle.mockResolvedValue({
            data: {
                id: '123',
                title_tr: 'Existing Blog',
                content_tr: '<p>Old Content</p>',
                slug: 'existing-blog'
            },
            error: null
        })

        render(<BlogEditor />)
        await waitFor(() => expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument())

        fireEvent.change(screen.getByDisplayValue('Existing Blog'), { target: { value: 'Updated Blog' } })

        const saveBtn = screen.getByText('Kaydet')
        fireEvent.click(saveBtn)

        await waitFor(() => {
            // Verify that update was called (via stable mock reference)
            expect(mockFromUpdate).toHaveBeenCalledWith(expect.objectContaining({
                title_tr: 'Updated Blog'
            }))
            expect(mockUpdateEq).toHaveBeenCalledWith('id', '123')
        })
    })
})
