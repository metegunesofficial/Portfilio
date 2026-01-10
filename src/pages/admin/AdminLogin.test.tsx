import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AdminLogin } from './AdminLogin'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

// Create the mock login function outside the describe block so it can be referenced in the mock factory
const mockLogin = vi.fn()

// Mock AuthContext
vi.mock('../../context/AuthContext', async () => {
    return {
        AuthProvider: ({ children }: any) => <>{children}</>,
        useAuth: () => ({
            login: mockLogin,
            isConfigured: true,
            loading: false
        })
    }
})

describe('AdminLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
    })

    const renderWithMockedAuth = (component: React.ReactNode) => {
        return render(
            <MemoryRouter>
                {component}
            </MemoryRouter>
        )
    }

    it('renders login page', () => {
        renderWithMockedAuth(<AdminLogin />)
        expect(screen.getByText('Admin Paneli')).toBeInTheDocument()
    })

    describe('password visibility toggle', () => {
        it('hides password by default', () => {
            renderWithMockedAuth(<AdminLogin />)
            const input = screen.getByLabelText('Şifre')
            expect(input).toHaveAttribute('type', 'password')
        })

        it('toggles password visibility', async () => {
            const user = userEvent.setup()
            renderWithMockedAuth(<AdminLogin />)

            const input = screen.getByLabelText('Şifre')
            const toggleButtons = screen.getAllByRole('button')
            // The toggle button is likely the one that is not the submit button
            const toggleBtn = toggleButtons.find(btn => !btn.textContent?.includes('Giriş'))

            expect(input).toHaveAttribute('type', 'password')

            if (toggleBtn) {
                await user.click(toggleBtn)
                expect(input).toHaveAttribute('type', 'text')

                await user.click(toggleBtn)
                expect(input).toHaveAttribute('type', 'password')
            }
        })
    })

    describe('form validation', () => {
        it('disables submit button when inputs are empty', () => {
            renderWithMockedAuth(<AdminLogin />)
            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            expect(submitBtn).toBeDisabled()
        })

        it('enables submit button when email and password are entered', async () => {
            const user = userEvent.setup()
            renderWithMockedAuth(<AdminLogin />)

            const emailInput = screen.getByLabelText('Email')
            await user.type(emailInput, 'test@example.com')

            const passwordInput = screen.getByLabelText('Şifre')
            await user.type(passwordInput, 'password')

            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            expect(submitBtn).not.toBeDisabled()
        })
    })

    it('shows loading state during submission', async () => {
        const user = userEvent.setup()

        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)))

        renderWithMockedAuth(<AdminLogin />)

        const emailInput = screen.getByLabelText('Email')
        await user.type(emailInput, 'test@example.com')

        const passwordInput = screen.getByLabelText('Şifre')
        await user.type(passwordInput, 'password')

        const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
        await user.click(submitBtn)

        expect(screen.getByText('Giriş yapılıyor...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('Giriş yapılıyor...')).not.toBeInTheDocument()
        })
    })

    it('shows error on login failure', async () => {
        const user = userEvent.setup()
        mockLogin.mockResolvedValue(false)

        renderWithMockedAuth(<AdminLogin />)

        const emailInput = screen.getByLabelText('Email')
        await user.type(emailInput, 'test@example.com')
        const passwordInput = screen.getByLabelText('Şifre')
        await user.type(passwordInput, 'password')

        const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
        await user.click(submitBtn)

        await waitFor(() => {
            expect(screen.getByText('Giriş başarısız. Email veya şifrenizi kontrol edin.')).toBeInTheDocument()
        })
    })

    it('navigates to dashboard on success', async () => {
        const user = userEvent.setup()
        mockLogin.mockResolvedValue(true)

        renderWithMockedAuth(<AdminLogin />)

        const emailInput = screen.getByLabelText('Email')
        await user.type(emailInput, 'test@example.com')
        const passwordInput = screen.getByLabelText('Şifre')
        await user.type(passwordInput, 'password')

        const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
        await user.click(submitBtn)

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard')
        })
    })
})
