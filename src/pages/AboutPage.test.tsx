import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AboutPage } from './AboutPage'
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

describe('AboutPage', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithProviders(<AboutPage />)
            expect(container).toBeDefined()
        })

        it('renders tech stack section (Expertise)', async () => {
            renderWithProviders(<AboutPage />)
            await waitFor(() => {
                expect(screen.getByText(/Expertise/i)).toBeInTheDocument()
            })
        })

        it('renders featured projects section', async () => {
            renderWithProviders(<AboutPage />)
            await waitFor(() => {
                expect(screen.getByText(/E-Commerce Platform/i)).toBeInTheDocument()
            })
        })
    })

    describe('skills and expertise', () => {
        // AboutPage currently only renders category titles, not individual skills in the simplified view
        it('renders expertise categories', async () => {
            renderWithProviders(<AboutPage />)
            await waitFor(() => {
                expect(screen.getByText('AI & Automation')).toBeInTheDocument()
                expect(screen.getByText('Frontend')).toBeInTheDocument()
                expect(screen.getByText('Backend')).toBeInTheDocument()
            })
        })
    })

    describe('projects display', () => {
        it('renders AI Workflow project', async () => {
            renderWithProviders(<AboutPage />)
            await waitFor(() => {
                expect(screen.getByText('AI Workflow Automation')).toBeInTheDocument()
            })
        })

        it('renders project descriptions', async () => {
            renderWithProviders(<AboutPage />)
            await waitFor(() => {
                expect(screen.getByText(/Automated business processes/i)).toBeInTheDocument()
            })
        })
    })
})
