import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BlogDetailPage } from './BlogDetailPage'
import { LangProvider } from '../context/LangContext'

// Mock params
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useParams: () => ({ slug: 'ai-automation-business-guide' })
    }
})

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <LangProvider>
                <Routes>
                    <Route path="/" element={component} />
                </Routes>
            </LangProvider>
        </BrowserRouter>
    )
}

describe('BlogDetailPage', () => {
    it('renders blog content when slug matches', () => {
        renderWithProviders(<BlogDetailPage />)
        // Check for content from the static blogData in the component
        expect(screen.getByText(/AI Automation for Business/i)).toBeInTheDocument()
        expect(screen.getByText(/Artificial Intelligence is transforming/i)).toBeInTheDocument()
    })

    it('renders metadata', () => {
        renderWithProviders(<BlogDetailPage />)
        expect(screen.getByText(/min read/i)).toBeInTheDocument()
    })

    it('renders back button', () => {
        renderWithProviders(<BlogDetailPage />)
        // Back button links to /blogs and has text "All Posts"
        const links = screen.getAllByRole('link')
        const backBtn = links.find(l => l.getAttribute('href') === '/blogs')
        expect(backBtn).toBeInTheDocument()
        expect(screen.getByText(/All Posts/i)).toBeInTheDocument()
    })

    it('renders share button', () => {
        renderWithProviders(<BlogDetailPage />)
        // Share button has className="share-btn" or title="Share"
        const shareBtn = screen.getAllByRole('button', { name: /Share/i })[0] ||
            document.querySelector('.share-btn')
        expect(shareBtn).toBeInTheDocument()
    })
})
