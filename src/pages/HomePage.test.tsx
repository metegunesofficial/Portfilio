import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HomePage } from './HomePage'
import { LangProvider } from '../context/LangContext'

// Mock sub-components to verify integration without deep rendering
vi.mock('../components/Newsletter', () => ({
    Newsletter: () => <div data-testid="newsletter-mock">Newsletter Component</div>
}))

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <LangProvider>
                {component}
            </LangProvider>
        </BrowserRouter>
    )
}

describe('HomePage', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithProviders(<HomePage />)
            expect(container).toBeDefined()
        })

        it('renders hero section', () => {
            const { container } = renderWithProviders(<HomePage />)
            expect(container.querySelector('.hero-section')).toBeInTheDocument()
        })

        it('renders main title', () => {
            renderWithProviders(<HomePage />)
            // Checks for default English content from LangContext
            expect(screen.getByText(/Hey, I'm Mete/i)).toBeInTheDocument()
        })

        it('renders bio text', () => {
            renderWithProviders(<HomePage />)
            expect(screen.getByText(/AI & Automation Specialist/i)).toBeInTheDocument()
        })

        it('renders Newsletter component', () => {
            renderWithProviders(<HomePage />)
            expect(screen.getByTestId('newsletter-mock')).toBeInTheDocument()
        })
    })

    describe('CTA buttons', () => {
        it('renders "Get in Touch" button', () => {
            renderWithProviders(<HomePage />)
            const btn = screen.getByText(/Get in Touch/i).closest('a')
            expect(btn).toBeInTheDocument()
            expect(btn).toHaveAttribute('href', '/contact')
        })

        it('renders "View Projects" button', () => {
            renderWithProviders(<HomePage />)
            const btn = screen.getByText(/View Projects/i).closest('a')
            expect(btn).toBeInTheDocument()
            expect(btn).toHaveAttribute('href', '/about')
        })
    })
})
