import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Newsletter } from './Newsletter'
import { LangProvider } from '../context/LangContext'

// Mock the newsletter service
vi.mock('../services/newsletter', () => ({
    subscribeToNewsletter: vi.fn().mockResolvedValue({
        success: true,
        subscriber: { id: '123', email: 'test@example.com', status: 'active' }
    })
}))

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <LangProvider>
            {component}
        </LangProvider>
    )
}

describe('Newsletter', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithProviders(<Newsletter />)
            expect(container).toBeDefined()
        })

        it('renders newsletter title', () => {
            renderWithProviders(<Newsletter />)
            expect(screen.getByText(/Newsletter|Bülten/)).toBeInTheDocument()
        })

        it('renders email input', () => {
            renderWithProviders(<Newsletter />)
            expect(screen.getByPlaceholderText(/email|e-posta/i)).toBeInTheDocument()
        })

        it('renders subscribe button', () => {
            renderWithProviders(<Newsletter />)
            expect(screen.getByRole('button', { name: /Subscribe|Abone/i })).toBeInTheDocument()
        })
    })

    describe('email validation', () => {
        it('shows error for empty email', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const submitBtn = screen.getByRole('button', { name: /Subscribe|Abone/i })
            await user.click(submitBtn)

            expect(screen.getByText(/required|gerekli/i)).toBeInTheDocument()
        })

        it('shows error for email without @', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const input = screen.getByPlaceholderText(/email|e-posta/i)
            await user.type(input, 'invalidemail')

            const submitBtn = screen.getByRole('button', { name: /Subscribe|Abone/i })
            await user.click(submitBtn)

            expect(screen.getByText(/@|symbol/i)).toBeInTheDocument()
        })

        it('shows error for too short email', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const input = screen.getByPlaceholderText(/email|e-posta/i)
            await user.type(input, 'a@b')

            const submitBtn = screen.getByRole('button', { name: /Subscribe|Abone/i })
            await user.click(submitBtn)

            expect(screen.getByText(/short|kısa/i)).toBeInTheDocument()
        })

        it('shows error for email without domain', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const input = screen.getByPlaceholderText(/email|e-posta/i)
            await user.type(input, 'test@test')

            const submitBtn = screen.getByRole('button', { name: /Subscribe|Abone/i })
            await user.click(submitBtn)

            expect(screen.getByText(/domain|alan adı/i)).toBeInTheDocument()
        })

        it('shows error for email with spaces', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const input = screen.getByPlaceholderText(/email|e-posta/i)
            await user.type(input, 'test @test.com')

            const submitBtn = screen.getByRole('button', { name: /Subscribe|Abone/i })
            await user.click(submitBtn)

            expect(screen.getByText(/invalid|geçersiz/i)).toBeInTheDocument()
        })
    })

    describe('form submission', () => {
        it('clears error when typing after failed validation', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const input = screen.getByPlaceholderText(/email|e-posta/i)
            const submitBtn = screen.getByRole('button', { name: /Subscribe|Abone/i })

            // Submit empty form to trigger error
            await user.click(submitBtn)
            expect(screen.getByText(/required|gerekli/i)).toBeInTheDocument()

            // Start typing to clear error
            await user.type(input, 't')
            expect(screen.queryByText(/required|gerekli/i)).not.toBeInTheDocument()
        })

        it('submits successfully with valid email', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const input = screen.getByPlaceholderText(/email|e-posta/i)
            await user.type(input, 'valid@email.com')

            const submitBtn = screen.getByRole('button', { name: /Subscribe|Abone/i })
            await user.click(submitBtn)

            // Wait for success message
            await waitFor(() => {
                expect(screen.getByText(/Thanks|teşekkürler/i)).toBeInTheDocument()
            }, { timeout: 3000 })
        })
    })

    describe('input handling', () => {
        it('updates input value on change', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Newsletter />)

            const input = screen.getByPlaceholderText(/email|e-posta/i) as HTMLInputElement
            await user.type(input, 'test@example.com')

            expect(input.value).toBe('test@example.com')
        })
    })
})
