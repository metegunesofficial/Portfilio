import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Work } from './Work'

describe('Work', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = render(<Work />)
            expect(container).toBeDefined()
        })

        it('renders section title', () => {
            render(<Work />)
            expect(screen.getByText('Work')).toBeInTheDocument()
        })

        it('renders as section element', () => {
            const { container } = render(<Work />)
            const section = container.querySelector('section')
            expect(section).toBeInTheDocument()
        })
    })

    describe('work items', () => {
        it('renders company name', () => {
            render(<Work />)
            // Should render multiple times due to marquee duplication
            const companyCards = screen.getAllByText('Birla Corporation')
            expect(companyCards.length).toBeGreaterThan(0)
        })

        it('renders period', () => {
            render(<Work />)
            const periods = screen.getAllByText('2025 - Present')
            expect(periods.length).toBeGreaterThan(0)
        })

        it('renders work cards', () => {
            const { container } = render(<Work />)
            const workCards = container.querySelectorAll('.work-card')
            expect(workCards.length).toBeGreaterThan(0)
        })

        it('renders company logo initial', () => {
            const { container } = render(<Work />)
            const logos = container.querySelectorAll('.work-card-logo')
            expect(logos.length).toBeGreaterThan(0)
            // Should contain first letter of company name
            expect(logos[0]).toHaveTextContent('B')
        })
    })

    describe('Say Hi button', () => {
        it('renders Say Hi links', () => {
            render(<Work />)
            const sayHiLinks = screen.getAllByText('Say Hi!')
            expect(sayHiLinks.length).toBeGreaterThan(0)
        })

        it('links to LinkedIn', () => {
            render(<Work />)
            const link = screen.getAllByText('Say Hi!')[0].closest('a')
            expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/schats')
        })

        it('opens LinkedIn in new tab', () => {
            render(<Work />)
            const link = screen.getAllByText('Say Hi!')[0].closest('a')
            expect(link).toHaveAttribute('target', '_blank')
            expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        })
    })

    describe('marquee structure', () => {
        it('has marquee container', () => {
            const { container } = render(<Work />)
            expect(container.querySelector('.marquee-container')).toBeInTheDocument()
        })

        it('has marquee content', () => {
            const { container } = render(<Work />)
            expect(container.querySelector('.marquee-content')).toBeInTheDocument()
        })

        it('duplicates items for seamless loop', () => {
            const { container } = render(<Work />)
            const workCards = container.querySelectorAll('.work-card')
            // Should have more cards than original due to duplication
            expect(workCards.length).toBeGreaterThanOrEqual(4)
        })
    })
})
