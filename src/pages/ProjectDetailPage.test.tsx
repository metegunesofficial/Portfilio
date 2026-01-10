import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProjectDetailPage } from './ProjectDetailPage'
import { LangProvider } from '../context/LangContext'

// No need to mock supabase as component uses static data

const renderWithProviders = (
    slug = 'ai-chatbot-integration'
) => {
    return render(
        <MemoryRouter initialEntries={[`/projects/${slug}`]}>
            <LangProvider>
                <Routes>
                    <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                </Routes>
            </LangProvider>
        </MemoryRouter>
    )
}

describe('ProjectDetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders back button', async () => {
        renderWithProviders('ai-chatbot-integration')
        expect(screen.getByText(/All Projects/i)).toBeInTheDocument()
    })

    it('renders project content for valid slug', async () => {
        renderWithProviders('ai-chatbot-integration')

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'AI Chatbot Integration' })).toBeInTheDocument()
            expect(screen.getByText('AI Integration')).toBeInTheDocument()
            // Check for results text
            const results = screen.getAllByText(/40% faster response time/i)
            expect(results.length).toBeGreaterThan(0)
        }, { timeout: 3000 })
    })

    it('renders not found for invalid slug', async () => {
        renderWithProviders('invalid-slug')

        expect(screen.getByRole('heading', { name: /Project Not Found/i })).toBeInTheDocument()
        expect(screen.getByText(/Back to Projects/i)).toBeInTheDocument()
    })
})
