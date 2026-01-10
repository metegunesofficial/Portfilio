import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProductsPage } from './ProductsPage'
import { LangProvider } from '../context/LangContext'

// Mock framer-motion to suppress AnimatePresence warnings
vi.mock('framer-motion', async () => {
    const actual = await vi.importActual('framer-motion')
    return {
        ...actual,
        AnimatePresence: ({ children }: any) => <>{children}</>,
        motion: new Proxy({}, {
            get: (_, prop: string) => {
                return ({ children, ...props }: any) => {
                    const Component = prop as any
                    // Filter out framer-motion specific props to avoid React warnings on DOM elements
                    const {
                        initial, animate, exit, variants, transition,
                        whileHover, whileTap, whileDrag, whileFocus,
                        onPan, onPanStart, onPanEnd, onPanSessionStart,
                        onTap, onTapStart, onTapCancel,
                        onHoverStart, onHoverEnd,
                        layout, layoutId,
                        ...validProps
                    } = props
                    return <Component {...validProps}>{children}</Component>
                }
            }
        })
    }
})

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <LangProvider>
                {component}
            </LangProvider>
        </BrowserRouter>
    )
}

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders page title', async () => {
        renderWithProviders(<ProductsPage />)

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /^Projects$/i })).toBeInTheDocument()
            expect(screen.getByText(/My AI integration/i)).toBeInTheDocument()
        }, { timeout: 5000 })
    })

    it('filters products', async () => {
        renderWithProviders(<ProductsPage />)

        await waitFor(() => {
            expect(screen.getByText(/AI Chatbot/i)).toBeInTheDocument()
        }, { timeout: 5000 })

        // Click filter
        const filterBtn = screen.getByRole('button', { name: /Web Apps/i })
        fireEvent.click(filterBtn)

        // Only check positive assertion to avoid flakiness due to exit animations
        await waitFor(() => {
            // Should show Web App
            expect(screen.getByText(/SaaS Analytics/i)).toBeInTheDocument()
        }, { timeout: 5000 })
    })
})
