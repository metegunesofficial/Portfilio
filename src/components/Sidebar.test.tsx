import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { LangProvider } from '../context/LangContext'

const renderWithProviders = (component: React.ReactNode, initialEntry = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <LangProvider>
                {component}
            </LangProvider>
        </MemoryRouter>
    )
}

describe('Sidebar', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithProviders(<Sidebar />)
            expect(container).toBeDefined()
        })

        it('renders as aside element', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByRole('complementary')).toBeInTheDocument()
        })

        it('renders logo', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByText('METE GÜNEŞ')).toBeInTheDocument()
        })
    })

    describe('navigation', () => {
        it('renders all navigation links', () => {
            renderWithProviders(<Sidebar />)

            const navLinks = screen.getAllByRole('link')
            // Should have nav links + logo + social links
            expect(navLinks.length).toBeGreaterThanOrEqual(4)
        })

        it('renders Home link', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByText(/Home|Ana Sayfa/)).toBeInTheDocument()
        })

        it('renders About link', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByText(/About|Hakkımda/)).toBeInTheDocument()
        })

        it('renders Blogs link', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByText(/Blog/)).toBeInTheDocument()
        })

        it('renders Contact link', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByText(/Contact|İletişim/)).toBeInTheDocument()
        })

        it('Home link points to /', () => {
            renderWithProviders(<Sidebar />)
            const homeLink = screen.getByText(/Home|Ana Sayfa/).closest('a')
            expect(homeLink).toHaveAttribute('href', '/')
        })

        it('About link points to /about', () => {
            renderWithProviders(<Sidebar />)
            const aboutLink = screen.getByText(/About|Hakkımda/).closest('a')
            expect(aboutLink).toHaveAttribute('href', '/about')
        })

        it('Blogs link points to /blogs', () => {
            renderWithProviders(<Sidebar />)
            const blogsLink = screen.getByText(/Blog/).closest('a')
            expect(blogsLink).toHaveAttribute('href', '/blogs')
        })

        it('Contact link points to /contact', () => {
            renderWithProviders(<Sidebar />)
            const contactLink = screen.getByText(/Contact|İletişim/).closest('a')
            expect(contactLink).toHaveAttribute('href', '/contact')
        })

        it('applies active class to current route link', () => {
            renderWithProviders(<Sidebar />, '/')
            const homeLink = screen.getByText(/Home|Ana Sayfa/).closest('a')
            expect(homeLink).toHaveClass('active')
        })
    })

    describe('language switcher', () => {
        it('renders Turkish flag button', () => {
            renderWithProviders(<Sidebar />)
            const trButton = screen.getByTitle('Türkçe')
            expect(trButton).toBeInTheDocument()
        })

        it('renders English flag button', () => {
            renderWithProviders(<Sidebar />)
            const enButton = screen.getByTitle('English')
            expect(enButton).toBeInTheDocument()
        })

        it('switches to Turkish when TR button clicked', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Sidebar />)

            const trButton = screen.getByTitle('Türkçe')
            await user.click(trButton)

            // Check that Turkish translations appear
            expect(screen.getByText('Ana Sayfa')).toBeInTheDocument()
        })

        it('switches to English when EN button clicked', async () => {
            const user = userEvent.setup()
            renderWithProviders(<Sidebar />)

            const enButton = screen.getByTitle('English')
            await user.click(enButton)

            // Check that English translations appear
            expect(screen.getByText('Home')).toBeInTheDocument()
        })

        it('highlights active language button', () => {
            renderWithProviders(<Sidebar />)
            const enButton = screen.getByTitle('English')
            expect(enButton).toHaveClass('active')
        })
    })

    describe('social links', () => {
        it('renders LinkedIn link', () => {
            renderWithProviders(<Sidebar />)
            const linkedinLink = screen.getByTitle('LinkedIn')
            expect(linkedinLink).toBeInTheDocument()
            expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/metegunes')
        })

        it('renders GitHub link', () => {
            renderWithProviders(<Sidebar />)
            const githubLink = screen.getByTitle('GitHub')
            expect(githubLink).toBeInTheDocument()
            expect(githubLink).toHaveAttribute('href', 'https://github.com/metegunes')
        })

        it('renders Twitter link', () => {
            renderWithProviders(<Sidebar />)
            const twitterLink = screen.getByTitle('Twitter')
            expect(twitterLink).toBeInTheDocument()
            expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/metegunes')
        })

        it('renders Instagram link', () => {
            renderWithProviders(<Sidebar />)
            const instagramLink = screen.getByTitle('Instagram')
            expect(instagramLink).toBeInTheDocument()
            expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/metegunes')
        })

        it('renders TikTok link', () => {
            renderWithProviders(<Sidebar />)
            const tiktokLink = screen.getByTitle('TikTok')
            expect(tiktokLink).toBeInTheDocument()
            expect(tiktokLink).toHaveAttribute('href', 'https://tiktok.com/@metegunes')
        })

        it('renders Email link', () => {
            renderWithProviders(<Sidebar />)
            const emailLink = screen.getByTitle('Email')
            expect(emailLink).toBeInTheDocument()
            expect(emailLink).toHaveAttribute('href', 'mailto:contact@metegunes.dev')
        })

        it('opens social links in new tab', () => {
            renderWithProviders(<Sidebar />)
            const linkedinLink = screen.getByTitle('LinkedIn')
            expect(linkedinLink).toHaveAttribute('target', '_blank')
            expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
        })
    })

    describe('accessibility', () => {
        it('has navigation element', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByRole('navigation')).toBeInTheDocument()
        })

        it('language buttons have proper titles', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByTitle('Türkçe')).toBeInTheDocument()
            expect(screen.getByTitle('English')).toBeInTheDocument()
        })

        it('social links have proper titles', () => {
            renderWithProviders(<Sidebar />)
            expect(screen.getByTitle('LinkedIn')).toBeInTheDocument()
            expect(screen.getByTitle('GitHub')).toBeInTheDocument()
            expect(screen.getByTitle('Twitter')).toBeInTheDocument()
            expect(screen.getByTitle('Email')).toBeInTheDocument()
        })
    })
})
