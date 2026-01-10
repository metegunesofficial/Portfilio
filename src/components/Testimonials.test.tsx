import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Testimonials } from './Testimonials'
import { LangProvider } from '../context/LangContext'

const renderWithProvider = (component: React.ReactNode) => {
    return render(
        <LangProvider>
            {component}
        </LangProvider>
    )
}

describe('Testimonials', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = renderWithProvider(<Testimonials />)
            expect(container).toBeDefined()
        })

        it('renders section title', () => {
            renderWithProvider(<Testimonials />)
            expect(screen.getByText('Testimonials')).toBeInTheDocument()
        })

        it('renders as section element', () => {
            const { container } = renderWithProvider(<Testimonials />)
            expect(container.querySelector('.testimonials-section')).toBeInTheDocument()
        })
    })

    describe('testimonial content', () => {
        it('renders first testimonial author', () => {
            renderWithProvider(<Testimonials />)
            expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument()
        })

        it('renders testimonial company', () => {
            renderWithProvider(<Testimonials />)
            expect(screen.getByText(/TechStart/)).toBeInTheDocument()
        })

        it('renders testimonial content', () => {
            renderWithProvider(<Testimonials />)
            // Check for English content since default lang is 'en'
            expect(screen.getByText(/fantastic experience/)).toBeInTheDocument()
        })

        it('renders star ratings', () => {
            const { container } = renderWithProvider(<Testimonials />)
            const stars = container.querySelectorAll('.testimonial-rating svg')
            expect(stars.length).toBe(5) // 5 stars for first testimonial
        })
    })

    describe('navigation', () => {
        it('renders navigation buttons', () => {
            renderWithProvider(<Testimonials />)
            expect(screen.getByLabelText('Previous testimonial')).toBeInTheDocument()
            expect(screen.getByLabelText('Next testimonial')).toBeInTheDocument()
        })

        it('renders navigation dots', () => {
            const { container } = renderWithProvider(<Testimonials />)
            const dots = container.querySelectorAll('.dot')
            expect(dots.length).toBe(3) // 3 testimonials
        })

        it('first dot is active initially', () => {
            const { container } = renderWithProvider(<Testimonials />)
            const dots = container.querySelectorAll('.dot')
            expect(dots[0]).toHaveClass('active')
        })

        it('navigates to next testimonial', async () => {
            const user = userEvent.setup()
            renderWithProvider(<Testimonials />)

            const nextBtn = screen.getByLabelText('Next testimonial')
            await user.click(nextBtn)

            // Should now show second testimonial
            expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
        })

        it('navigates to previous testimonial', async () => {
            const user = userEvent.setup()
            renderWithProvider(<Testimonials />)

            // First go to next
            const nextBtn = screen.getByLabelText('Next testimonial')
            await user.click(nextBtn)

            // Then go back
            const prevBtn = screen.getByLabelText('Previous testimonial')
            await user.click(prevBtn)

            // Should be back to first testimonial
            expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument()
        })

        it('wraps around when reaching end', async () => {
            const user = userEvent.setup()
            renderWithProvider(<Testimonials />)

            const nextBtn = screen.getByLabelText('Next testimonial')

            // Click 3 times to wrap around
            await user.click(nextBtn)
            await user.click(nextBtn)
            await user.click(nextBtn)

            // Should be back to first
            expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument()
        })

        it('wraps around when going backward from first', async () => {
            const user = userEvent.setup()
            renderWithProvider(<Testimonials />)

            const prevBtn = screen.getByLabelText('Previous testimonial')
            await user.click(prevBtn)

            // Should wrap to last testimonial
            expect(screen.getByText('Mehmet Kaya')).toBeInTheDocument()
        })

        it('navigates via dots', async () => {
            const user = userEvent.setup()
            const { container } = renderWithProvider(<Testimonials />)

            const dots = container.querySelectorAll('.dot')
            await user.click(dots[2]) // Click third dot

            // Should show third testimonial
            expect(screen.getByText('Mehmet Kaya')).toBeInTheDocument()
        })
    })

    describe('structure', () => {
        it('has testimonials carousel', () => {
            const { container } = renderWithProvider(<Testimonials />)
            expect(container.querySelector('.testimonials-carousel')).toBeInTheDocument()
        })

        it('has testimonial card', () => {
            const { container } = renderWithProvider(<Testimonials />)
            expect(container.querySelector('.testimonial-card')).toBeInTheDocument()
        })

        it('has author avatar with initial', () => {
            const { container } = renderWithProvider(<Testimonials />)
            const avatar = container.querySelector('.author-avatar')
            expect(avatar).toBeInTheDocument()
            expect(avatar).toHaveTextContent('A') // First letter of Ahmet
        })

        it('has quote icon', () => {
            const { container } = renderWithProvider(<Testimonials />)
            expect(container.querySelector('.quote-icon')).toBeInTheDocument()
        })
    })

    describe('accessibility', () => {
        it('navigation buttons have aria-labels', () => {
            renderWithProvider(<Testimonials />)
            expect(screen.getByLabelText('Previous testimonial')).toBeInTheDocument()
            expect(screen.getByLabelText('Next testimonial')).toBeInTheDocument()
        })

        it('dots have aria-labels', () => {
            renderWithProvider(<Testimonials />)
            expect(screen.getByLabelText('Go to testimonial 1')).toBeInTheDocument()
            expect(screen.getByLabelText('Go to testimonial 2')).toBeInTheDocument()
            expect(screen.getByLabelText('Go to testimonial 3')).toBeInTheDocument()
        })
    })
})
