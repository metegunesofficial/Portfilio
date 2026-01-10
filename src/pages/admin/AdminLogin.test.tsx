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

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

describe('AdminLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
    })

    describe('rendering', () => {
        it('renders login page', () => {
            renderWithRouter(<AdminLogin />)
            expect(screen.getByText('Admin Paneli')).toBeInTheDocument()
        })

        it('renders description text', () => {
            renderWithRouter(<AdminLogin />)
            expect(screen.getByText('İçerik yönetimi için giriş yapın')).toBeInTheDocument()
        })

        it('renders password input', () => {
            renderWithRouter(<AdminLogin />)
            expect(screen.getByLabelText('Şifre')).toBeInTheDocument()
        })

        it('renders password placeholder', () => {
            renderWithRouter(<AdminLogin />)
            expect(screen.getByPlaceholderText('Admin şifresini girin')).toBeInTheDocument()
        })

        it('renders submit button', () => {
            renderWithRouter(<AdminLogin />)
            expect(screen.getByRole('button', { name: 'Giriş Yap' })).toBeInTheDocument()
        })

        it('renders show/hide password toggle', () => {
            renderWithRouter(<AdminLogin />)
            const toggleButtons = screen.getAllByRole('button')
            expect(toggleButtons.length).toBeGreaterThanOrEqual(2)
        })
    })

    describe('password visibility toggle', () => {
        it('hides password by default', () => {
            renderWithRouter(<AdminLogin />)
            const input = screen.getByLabelText('Şifre')
            expect(input).toHaveAttribute('type', 'password')
        })

        it('toggles password visibility', async () => {
            const user = userEvent.setup()
            renderWithRouter(<AdminLogin />)

            const input = screen.getByLabelText('Şifre')
            const toggleButtons = screen.getAllByRole('button')
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
        it('disables submit button when password is empty', () => {
            renderWithRouter(<AdminLogin />)
            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            expect(submitBtn).toBeDisabled()
        })

        it('enables submit button when password is entered', async () => {
            const user = userEvent.setup()
            renderWithRouter(<AdminLogin />)

            const input = screen.getByLabelText('Şifre')
            await user.type(input, 'test')

            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            expect(submitBtn).not.toBeDisabled()
        })
    })

    describe('form submission', () => {
        beforeEach(() => {
            vi.useFakeTimers()
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it('shows loading state during submission', async () => {
            const user = userEvent.setup()
            renderWithRouter(<AdminLogin />)

            const input = screen.getByLabelText('Şifre')
            await user.type(input, 'wrongpassword')

            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            await user.click(submitBtn)

            expect(screen.getByText('Giriş yapılıyor...')).toBeInTheDocument()

            await act(async () => {
                vi.advanceTimersByTime(500)
            })

            await waitFor(() => {
                expect(screen.queryByText('Giriş yapılıyor...')).not.toBeInTheDocument()
            })
        })

        it('shows error on wrong password', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
            renderWithRouter(<AdminLogin />)

            const input = screen.getByLabelText('Şifre')
            await user.type(input, 'wrongpassword')

            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            await user.click(submitBtn)

            await act(async () => {
                vi.advanceTimersByTime(500)
            })

            await waitFor(() => {
                expect(screen.getByText('Yanlış şifre. Lütfen tekrar deneyin.')).toBeInTheDocument()
            })
        })

        it('navigates to dashboard on correct password', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
            renderWithRouter(<AdminLogin />)

            const input = screen.getByLabelText('Şifre')
            await user.type(input, 'admin123')

            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            await user.click(submitBtn)

            await act(async () => {
                vi.advanceTimersByTime(500)
            })

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard')
            })
        })

        it('sets session storage on successful login', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
            renderWithRouter(<AdminLogin />)

            const input = screen.getByLabelText('Şifre')
            await user.type(input, 'admin123')

            const submitBtn = screen.getByRole('button', { name: 'Giriş Yap' })
            await user.click(submitBtn)

            await act(async () => {
                vi.advanceTimersByTime(500)
            })

            await waitFor(() => {
                expect(sessionStorage.getItem('admin_auth')).toBe('true')
            })
        })
    })

    describe('accessibility', () => {
        it('password input exists', () => {
            renderWithRouter(<AdminLogin />)
            const input = screen.getByLabelText('Şifre')
            expect(input).toBeInTheDocument()
        })

        it('has proper form structure', () => {
            renderWithRouter(<AdminLogin />)
            const form = document.querySelector('form')
            expect(form).toBeInTheDocument()
        })
    })
})
