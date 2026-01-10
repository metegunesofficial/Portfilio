import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { AuthProvider } from '../context/AuthContext'
import { LangProvider } from '../context/LangContext'

// Mock useAuth
const mockLogin = vi.fn()
const mockClearError = vi.fn()

vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext')
    return {
        ...actual,
        useAuth: () => ({
            login: mockLogin,
            loading: false,
            error: null,
            clearError: mockClearError
        })
    }
})

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            <LangProvider>
                <AuthProvider>
                    {component}
                </AuthProvider>
            </LangProvider>
        </MemoryRouter>
    )
}

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders login form', () => {
        renderWithProviders(<LoginPage />)
        // LangContext defaults: loginTitle="Welcome Back", loginBtn="Sign In"
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()

        // Check inputs by label (default en: Email, Password)
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    })

    it('validates input and calls login', async () => {
        mockLogin.mockResolvedValue(true)
        renderWithProviders(<LoginPage />)

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
        })
    })

    it('links to register page', () => {
        renderWithProviders(<LoginPage />)
        // LangContext: noAccount="Don't have an account?", registerLink="Sign up"
        expect(screen.getByText(/Sign up/i).closest('a')).toHaveAttribute('href', '/register')
    })
})
