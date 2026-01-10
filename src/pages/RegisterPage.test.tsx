import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RegisterPage } from './RegisterPage'
import { AuthProvider } from '../context/AuthContext'
import { LangProvider } from '../context/LangContext'

// Mock useAuth
const mockRegister = vi.fn()
const mockClearError = vi.fn()

vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext')
    return {
        ...actual,
        useAuth: () => ({
            register: mockRegister,
            loading: false,
            error: null,
            clearError: mockClearError
        })
    }
})

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <LangProvider>
                <AuthProvider>
                    {component}
                </AuthProvider>
            </LangProvider>
        </BrowserRouter>
    )
}

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders register form', () => {
        renderWithProviders(<RegisterPage />)
        expect(screen.getByText(/Create Account/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
    })

    it('shows error on password mismatch', async () => {
        renderWithProviders(<RegisterPage />)

        fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'mismatch' } })

        // Explicitly submit the form
        fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }).closest('form')!)

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
        }, { timeout: 3000 })

        expect(mockRegister).not.toHaveBeenCalled()
    })

    it('calls register on valid submission', async () => {
        mockRegister.mockResolvedValue(true)
        renderWithProviders(<RegisterPage />)

        fireEvent.change(screen.getByRole('textbox', { name: /Name/i }), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByRole('textbox', { name: /Email/i }), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })

        // Explicitly submit the form
        fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }).closest('form')!)

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User')
        }, { timeout: 3000 })
    })
})
