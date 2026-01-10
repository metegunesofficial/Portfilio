import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Footer } from './Footer'
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

describe('Footer', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithProviders(<Footer />)
            expect(container).toBeDefined()
        })

        it('renders footer title', () => {
            renderWithProviders(<Footer />)
            expect(screen.getByText(/Thanks for Visiting|Ziyaretiniz için/)).toBeInTheDocument()
        })

        it('renders footer subtitle', () => {
            renderWithProviders(<Footer />)
            expect(screen.getByText(/Explore Around|Etrafı keşfedin/)).toBeInTheDocument()
        })

        it('renders copyright text', () => {
            renderWithProviders(<Footer />)
            const year = new Date().getFullYear().toString()
            expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
        })
    })

    describe('social links', () => {
        it('renders all social links', () => {
            renderWithProviders(<Footer />)
            const links = screen.getAllByRole('link')
            // Should have social links + privacy policy link
            expect(links.length).toBeGreaterThanOrEqual(4)
        })

        it('renders LinkedIn link', () => {
            renderWithProviders(<Footer />)
            const linkedinLink = screen.getByLabelText('LinkedIn')
            expect(linkedinLink).toBeInTheDocument()
            expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/metegunes')
        })

        it('renders GitHub link', () => {
            renderWithProviders(<Footer />)
            const githubLink = screen.getByLabelText('GitHub')
            expect(githubLink).toBeInTheDocument()
            expect(githubLink).toHaveAttribute('href', 'https://github.com/metegunes')
        })

        it('renders Twitter link', () => {
            renderWithProviders(<Footer />)
            const twitterLink = screen.getByLabelText('Twitter')
            expect(twitterLink).toBeInTheDocument()
            expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/metegunes')
        })

        it('renders Email link', () => {
            renderWithProviders(<Footer />)
            const emailLink = screen.getByLabelText('Email')
            expect(emailLink).toBeInTheDocument()
            expect(emailLink).toHaveAttribute('href', 'mailto:contact@metegunes.dev')
        })

        it('opens social links in new tab', () => {
            renderWithProviders(<Footer />)
            const linkedinLink = screen.getByLabelText('LinkedIn')
            expect(linkedinLink).toHaveAttribute('target', '_blank')
            expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
        })
    })

    describe('privacy policy link', () => {
        it('renders privacy policy link', () => {
            renderWithProviders(<Footer />)
            expect(screen.getByText(/Privacy Policy|Gizlilik Politikası/)).toBeInTheDocument()
        })

        it('links to correct privacy policy page', () => {
            renderWithProviders(<Footer />)
            const privacyLink = screen.getByText(/Privacy Policy|Gizlilik Politikası/)
            expect(privacyLink).toHaveAttribute('href', '/privacy-policy')
        })
    })

    describe('accessibility', () => {
        it('has footer element', () => {
            renderWithProviders(<Footer />)
            expect(screen.getByRole('contentinfo')).toBeInTheDocument()
        })

        it('has proper aria-labels on social links', () => {
            renderWithProviders(<Footer />)
            expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
            expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
            expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
            expect(screen.getByLabelText('Email')).toBeInTheDocument()
        })
    })
})
