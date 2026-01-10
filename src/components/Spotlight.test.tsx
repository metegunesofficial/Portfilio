import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spotlight } from './Spotlight'

describe('Spotlight', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = render(<Spotlight />)
            expect(container).toBeDefined()
        })

        it('renders section title', () => {
            render(<Spotlight />)
            expect(screen.getByText('Spotlight')).toBeInTheDocument()
        })

        it('renders as section element', () => {
            const { container } = render(<Spotlight />)
            const section = container.querySelector('section')
            expect(section).toBeInTheDocument()
        })
    })

    describe('spotlight items', () => {
        it('renders all spotlight cards', () => {
            const { container } = render(<Spotlight />)
            const cards = container.querySelectorAll('.spotlight-card')
            expect(cards.length).toBe(3)
        })

        it('renders first item title', () => {
            render(<Spotlight />)
            expect(screen.getByText('South India Elite Brand Awards')).toBeInTheDocument()
        })

        it('renders second item title', () => {
            render(<Spotlight />)
            expect(screen.getByText('Honda Civic Modification')).toBeInTheDocument()
        })

        it('renders third item title', () => {
            render(<Spotlight />)
            expect(screen.getByText('Lamborghini: Fan Edition')).toBeInTheDocument()
        })

        it('renders item descriptions', () => {
            render(<Spotlight />)
            expect(screen.getByText(/budget find to weekend cruiser/)).toBeInTheDocument()
        })

        it('renders item categories', () => {
            render(<Spotlight />)
            expect(screen.getByText('GLOBAL PINNACLE')).toBeInTheDocument()
            expect(screen.getByText('HONDA')).toBeInTheDocument()
            expect(screen.getByText('Fan Book')).toBeInTheDocument()
        })

        it('renders item dates', () => {
            render(<Spotlight />)
            expect(screen.getByText('Apr, 2023')).toBeInTheDocument()
            expect(screen.getByText('Mar, 2021')).toBeInTheDocument()
            expect(screen.getByText('Jan, 2025')).toBeInTheDocument()
        })
    })

    describe('links', () => {
        it('all cards are links', () => {
            render(<Spotlight />)
            const links = screen.getAllByRole('link')
            expect(links.length).toBe(3)
        })

        it('links have href attribute', () => {
            render(<Spotlight />)
            const link = screen.getByText('South India Elite Brand Awards').closest('a')
            expect(link).toHaveAttribute('href', '#')
        })
    })

    describe('structure', () => {
        it('has container class', () => {
            const { container } = render(<Spotlight />)
            expect(container.querySelector('.container')).toBeInTheDocument()
        })

        it('has grid layout', () => {
            const { container } = render(<Spotlight />)
            expect(container.querySelector('.grid')).toBeInTheDocument()
        })

        it('renders spotlight images', () => {
            const { container } = render(<Spotlight />)
            const images = container.querySelectorAll('.spotlight-image')
            expect(images.length).toBe(3)
        })

        it('renders spotlight content', () => {
            const { container } = render(<Spotlight />)
            const content = container.querySelectorAll('.spotlight-content')
            expect(content.length).toBe(3)
        })

        it('renders sparkle emoji in images', () => {
            render(<Spotlight />)
            const sparkles = screen.getAllByText('✨')
            expect(sparkles.length).toBe(3)
        })
    })
})
