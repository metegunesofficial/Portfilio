import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Logo } from './Logo'

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Logo', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithRouter(<Logo />)
            expect(container).toBeDefined()
        })

        it('renders svg logo', () => {
            renderWithRouter(<Logo />)
            expect(document.querySelector('svg')).toBeInTheDocument()
        })

        it('renders as a link', () => {
            renderWithRouter(<Logo />)
            const link = screen.getByRole('link')
            expect(link).toBeInTheDocument()
        })

        it('links to home page', () => {
            renderWithRouter(<Logo />)
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/')
        })
    })

    describe('styling', () => {
        it('has the correct class name', () => {
            renderWithRouter(<Logo />)
            const link = screen.getByRole('link')
            expect(link).toHaveClass('sidebar-logo-custom')
        })
    })
})
