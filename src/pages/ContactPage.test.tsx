import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ContactPage } from './ContactPage'
import { LangProvider } from '../context/LangContext'

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <LangProvider>
                {component}
            </LangProvider>
        </BrowserRouter>
    )
}

describe('ContactPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithProviders(<ContactPage />)
            expect(container).toBeDefined()
        })

        it('renders page title', () => {
            renderWithProviders(<ContactPage />)
            expect(screen.getAllByText(/Contact/i)[0]).toBeInTheDocument()
        })

        it('renders form elements', () => {
            renderWithProviders(<ContactPage />)
            expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument()
        })
    })

    describe('validation', () => {
        it('shows error for empty required fields', async () => {
            const user = userEvent.setup()
            renderWithProviders(<ContactPage />)

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText('Name is required')).toBeInTheDocument()
            expect(screen.getByText('Email is required')).toBeInTheDocument()
            expect(screen.getByText('Message is required')).toBeInTheDocument()
        })

        it('shows error for short name', async () => {
            const user = userEvent.setup()
            renderWithProviders(<ContactPage />)

            const nameInput = screen.getByLabelText(/Name/i)
            await user.type(nameInput, 'A')

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument()
        })

        it('shows error for invalid email', async () => {
            const user = userEvent.setup()
            renderWithProviders(<ContactPage />)

            const emailInput = screen.getByLabelText(/Email/i)
            await user.type(emailInput, 'invalid-email')

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
        })

        it('shows error for short message', async () => {
            const user = userEvent.setup()
            renderWithProviders(<ContactPage />)

            const msgInput = screen.getByLabelText(/Message/i)
            await user.type(msgInput, 'Hi')

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument()
        })
    })

    describe('submission', () => {
        it('shows success message on valid submission', { timeout: 20000 }, async () => {
            const user = userEvent.setup()
            renderWithProviders(<ContactPage />)

            const nameInput = screen.getByLabelText(/Name/i)
            await user.type(nameInput, 'John Doe')

            const emailInput = screen.getByLabelText(/Email/i)
            await user.type(emailInput, 'john@example.com')

            const msgInput = screen.getByLabelText(/Message/i)
            await user.type(msgInput, 'This is a valid message for testing.')

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            // Wait for async submission - increased timeout
            await waitFor(() => {
                expect(screen.getByText(/Message Sent/i)).toBeInTheDocument()
            }, { timeout: 10000 })
        })

        it('disables button during submission', async () => {
            const user = userEvent.setup()
            renderWithProviders(<ContactPage />)

            const nameInput = screen.getByLabelText(/Name/i)
            await user.type(nameInput, 'John Doe')

            const emailInput = screen.getByLabelText(/Email/i)
            await user.type(emailInput, 'john@example.com')

            const msgInput = screen.getByLabelText(/Message/i)
            await user.type(msgInput, 'This is a valid message.')

            const submitBtn = screen.getByRole('button', { name: /Send/i })
            await user.click(submitBtn)

            expect(screen.getByText(/Sending/i)).toBeInTheDocument()
            expect(submitBtn).toBeDisabled()
        })
    })
})
