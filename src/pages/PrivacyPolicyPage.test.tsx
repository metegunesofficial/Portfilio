import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PrivacyPolicyPage } from './PrivacyPolicyPage'
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

describe('PrivacyPolicyPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders title and updated date', async () => {
        renderWithProviders(<PrivacyPolicyPage />)

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Privacy Policy/i })).toBeInTheDocument()
            expect(screen.getByText(/Last updated/i)).toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('renders policy sections', async () => {
        renderWithProviders(<PrivacyPolicyPage />)

        await waitFor(() => {
            expect(screen.getByText(/Data Controller/i)).toBeInTheDocument()
            expect(screen.getByText(/Data Collected/i)).toBeInTheDocument()
        }, { timeout: 3000 })
    })
})
