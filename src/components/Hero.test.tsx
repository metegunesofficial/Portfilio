import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = render(<Hero />)
            expect(container).toBeDefined()
        })

        it('renders the heading', () => {
            render(<Hero />)
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        })

        it('renders the hero title text', () => {
            render(<Hero />)
            expect(screen.getByText(/Hey, Saumya here/)).toBeInTheDocument()
        })

        it('renders the bio text', () => {
            render(<Hero />)
            expect(screen.getByText(/friendly neighborhood CAD wizard/)).toBeInTheDocument()
        })
    })

    describe('call to action', () => {
        it('renders contact button', () => {
            render(<Hero />)
            expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument()
        })

        it('contact button links to contact section', () => {
            render(<Hero />)
            const contactLink = screen.getByRole('link', { name: /Contact/i })
            expect(contactLink).toHaveAttribute('href', '#contact')
        })

        it('contact button has correct class', () => {
            render(<Hero />)
            const contactLink = screen.getByRole('link', { name: /Contact/i })
            expect(contactLink).toHaveClass('btn-primary')
        })
    })

    describe('structure', () => {
        it('renders within a section element', () => {
            const { container } = render(<Hero />)
            const section = container.querySelector('section')
            expect(section).toBeInTheDocument()
        })

        it('has proper container structure', () => {
            const { container } = render(<Hero />)
            const containerDiv = container.querySelector('.container')
            expect(containerDiv).toBeInTheDocument()
        })
    })
})
