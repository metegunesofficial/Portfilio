import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
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

describe('NotFoundPage', () => {
    it('renders 404 message', () => {
        renderWithProviders(<NotFoundPage />)
        expect(screen.getByText('404')).toBeInTheDocument()
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    })

    it('renders home button', () => {
        renderWithProviders(<NotFoundPage />)
        const homeLink = screen.getByText(/Go to Home/i).closest('a')
        expect(homeLink).toHaveAttribute('href', '/')
    })

    it('renders back button', () => {
        renderWithProviders(<NotFoundPage />)
        expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
    })
})
