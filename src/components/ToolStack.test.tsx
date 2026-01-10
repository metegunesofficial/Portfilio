import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ToolStack } from './ToolStack'

describe('ToolStack', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = render(<ToolStack />)
            expect(container).toBeDefined()
        })

        it('renders section title', () => {
            render(<ToolStack />)
            expect(screen.getByText('Tool Stack')).toBeInTheDocument()
        })

        it('renders as section element', () => {
            const { container } = render(<ToolStack />)
            const section = container.querySelector('section')
            expect(section).toBeInTheDocument()
        })
    })

    describe('tools list', () => {
        it('renders SolidWorks tool', () => {
            render(<ToolStack />)
            expect(screen.getByTitle('SolidWorks')).toBeInTheDocument()
        })

        it('renders Ansys tool', () => {
            render(<ToolStack />)
            expect(screen.getByTitle('Ansys')).toBeInTheDocument()
        })

        it('renders After Effects tool', () => {
            render(<ToolStack />)
            expect(screen.getByTitle('After Effects')).toBeInTheDocument()
        })

        it('renders Framer tool', () => {
            render(<ToolStack />)
            expect(screen.getByTitle('Framer')).toBeInTheDocument()
        })

        it('renders ChatGPT tool', () => {
            render(<ToolStack />)
            expect(screen.getByTitle('ChatGPT')).toBeInTheDocument()
        })

        it('renders Wix tool', () => {
            render(<ToolStack />)
            expect(screen.getByTitle('Wix')).toBeInTheDocument()
        })
    })

    describe('links', () => {
        it('all tools are links', () => {
            render(<ToolStack />)
            const links = screen.getAllByRole('link')
            expect(links.length).toBeGreaterThanOrEqual(6)
        })

        it('opens links in new tab', () => {
            render(<ToolStack />)
            const firstLink = screen.getByTitle('SolidWorks')
            expect(firstLink).toHaveAttribute('target', '_blank')
            expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer')
        })

        it('SolidWorks links to correct URL', () => {
            render(<ToolStack />)
            const link = screen.getByTitle('SolidWorks')
            expect(link).toHaveAttribute('href', 'https://www.solidworks.com/')
        })

        it('ChatGPT links to correct URL', () => {
            render(<ToolStack />)
            const link = screen.getByTitle('ChatGPT')
            expect(link).toHaveAttribute('href', 'https://chatgpt.com/')
        })
    })

    describe('structure', () => {
        it('has container class', () => {
            const { container } = render(<ToolStack />)
            expect(container.querySelector('.container')).toBeInTheDocument()
        })

        it('renders tool icons with emoji', () => {
            render(<ToolStack />)
            // Check for emoji icons
            expect(screen.getByText('🔧')).toBeInTheDocument()
            expect(screen.getByText('🤖')).toBeInTheDocument()
        })
    })
})
