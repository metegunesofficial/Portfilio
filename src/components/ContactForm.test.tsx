import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ContactForm } from './ContactForm'

// Mock rate limit functions
vi.mock('../lib/rateLimit', () => ({
    canSubmit: vi.fn(() => true),
    recordSubmission: vi.fn(),
    getRemainingTimeSeconds: vi.fn(() => 60),
}))

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('ContactForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('rendering (English)', () => {
        it('renders without crashing', () => {
            const { container } = renderWithRouter(<ContactForm lang="en" />)
            expect(container).toBeDefined()
        })

        it('renders name input', () => {
            renderWithRouter(<ContactForm lang="en" />)
            expect(screen.getByLabelText('Your name')).toBeInTheDocument()
        })

        it('renders email input', () => {
            renderWithRouter(<ContactForm lang="en" />)
            expect(screen.getByLabelText('Email')).toBeInTheDocument()
        })

        it('renders message textarea', () => {
            renderWithRouter(<ContactForm lang="en" />)
            expect(screen.getByLabelText('Your message')).toBeInTheDocument()
        })

        it('renders submit button', () => {
            renderWithRouter(<ContactForm lang="en" />)
            expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument()
        })

        it('renders privacy checkbox', () => {
            renderWithRouter(<ContactForm lang="en" />)
            expect(screen.getByRole('checkbox')).toBeInTheDocument()
        })

        it('renders privacy policy link', () => {
            renderWithRouter(<ContactForm lang="en" />)
            expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
        })
    })

    describe('rendering (Turkish)', () => {
        it('renders Turkish labels', () => {
            renderWithRouter(<ContactForm lang="tr" />)
            expect(screen.getByLabelText('Adınız')).toBeInTheDocument()
            expect(screen.getByLabelText('E-posta')).toBeInTheDocument()
            expect(screen.getByLabelText('Mesajınız')).toBeInTheDocument()
        })

        it('renders Turkish submit button', () => {
            renderWithRouter(<ContactForm lang="tr" />)
            expect(screen.getByRole('button', { name: /Gönder/i })).toBeInTheDocument()
        })
    })

    describe('validation (English)', () => {
        it('shows error for empty name', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText('Name is required')).toBeInTheDocument()
        })

        it('validates email format', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const nameInput = screen.getByLabelText('Your name')
            await user.type(nameInput, 'John Doe')

            // Leave email empty to trigger validation
            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            // Email validation should trigger - check for any error or aria-invalid
            const emailInput = screen.getByLabelText('Email')
            expect(emailInput).toHaveAttribute('aria-invalid', 'true')
        })

        it('shows error for empty message', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const nameInput = screen.getByLabelText('Your name')
            await user.type(nameInput, 'John Doe')

            const emailInput = screen.getByLabelText('Email')
            await user.type(emailInput, 'john@example.com')

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText('Message is required')).toBeInTheDocument()
        })

        it('shows error for unchecked privacy', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const nameInput = screen.getByLabelText('Your name')
            await user.type(nameInput, 'John Doe')

            const emailInput = screen.getByLabelText('Email')
            await user.type(emailInput, 'john@example.com')

            const messageInput = screen.getByLabelText('Your message')
            await user.type(messageInput, 'This is my message')

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText('Consent is required to proceed')).toBeInTheDocument()
        })
    })

    describe('form submission', () => {
        it('shows success message on valid submission', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const nameInput = screen.getByLabelText('Your name')
            await user.type(nameInput, 'John Doe')

            const emailInput = screen.getByLabelText('Email')
            await user.type(emailInput, 'john@example.com')

            const messageInput = screen.getByLabelText('Your message')
            await user.type(messageInput, 'This is my message')

            const checkbox = screen.getByRole('checkbox')
            await user.click(checkbox)

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText(/Message received/i)).toBeInTheDocument()
        })

        it('clears form after successful submission', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const nameInput = screen.getByLabelText('Your name') as HTMLInputElement
            await user.type(nameInput, 'John Doe')

            const emailInput = screen.getByLabelText('Email') as HTMLInputElement
            await user.type(emailInput, 'john@example.com')

            const messageInput = screen.getByLabelText('Your message') as HTMLTextAreaElement
            await user.type(messageInput, 'This is my message')

            const checkbox = screen.getByRole('checkbox')
            await user.click(checkbox)

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            // Form should be cleared
            expect(nameInput.value).toBe('')
            expect(emailInput.value).toBe('')
            expect(messageInput.value).toBe('')
        })
    })

    describe('input handling', () => {
        it('updates name input value', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const nameInput = screen.getByLabelText('Your name') as HTMLInputElement
            await user.type(nameInput, 'John Doe')

            expect(nameInput.value).toBe('John Doe')
        })

        it('updates email input value', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const emailInput = screen.getByLabelText('Email') as HTMLInputElement
            await user.type(emailInput, 'john@example.com')

            expect(emailInput.value).toBe('john@example.com')
        })

        it('updates message textarea value', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const messageInput = screen.getByLabelText('Your message') as HTMLTextAreaElement
            await user.type(messageInput, 'Hello there')

            expect(messageInput.value).toBe('Hello there')
        })
    })

    describe('accessibility', () => {
        it('has proper labels for all inputs', () => {
            renderWithRouter(<ContactForm lang="en" />)

            expect(screen.getByLabelText('Your name')).toBeInTheDocument()
            expect(screen.getByLabelText('Email')).toBeInTheDocument()
            expect(screen.getByLabelText('Your message')).toBeInTheDocument()
        })

        it('sets aria-invalid on invalid inputs', async () => {
            const user = userEvent.setup()
            renderWithRouter(<ContactForm lang="en" />)

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            const nameInput = screen.getByLabelText('Your name')
            expect(nameInput).toHaveAttribute('aria-invalid', 'true')
        })
    })
})
