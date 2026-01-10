import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SideProjects } from './SideProjects'

describe('SideProjects', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            const { container } = render(<SideProjects />)
            expect(container).toBeDefined()
        })

        it('renders section title', () => {
            render(<SideProjects />)
            expect(screen.getByText('Side Projects')).toBeInTheDocument()
        })

        it('renders as section element', () => {
            const { container } = render(<SideProjects />)
            expect(container.querySelector('section')).toBeInTheDocument()
        })
    })

    describe('project cards', () => {
        it('renders all project cards', () => {
            const { container } = render(<SideProjects />)
            const cards = container.querySelectorAll('.project-card')
            expect(cards.length).toBe(4)
        })

        it('renders Discord project', () => {
            render(<SideProjects />)
            expect(screen.getByText('Discord Community for Gamers')).toBeInTheDocument()
        })

        it('renders Honda project', () => {
            render(<SideProjects />)
            expect(screen.getByText('Honda Civic 2008 Modification')).toBeInTheDocument()
        })

        it('renders Courses project', () => {
            render(<SideProjects />)
            expect(screen.getByText('Self-Paced Courses Website')).toBeInTheDocument()
        })

        it('renders Podcast project', () => {
            render(<SideProjects />)
            expect(screen.getByText('Podcast Series')).toBeInTheDocument()
        })
    })

    describe('project icons', () => {
        it('renders gaming emoji', () => {
            render(<SideProjects />)
            expect(screen.getByText('🎮')).toBeInTheDocument()
        })

        it('renders car emoji', () => {
            render(<SideProjects />)
            expect(screen.getByText('🚗')).toBeInTheDocument()
        })

        it('renders book emoji', () => {
            render(<SideProjects />)
            expect(screen.getByText('📚')).toBeInTheDocument()
        })

        it('renders microphone emoji', () => {
            render(<SideProjects />)
            expect(screen.getByText('🎙️')).toBeInTheDocument()
        })
    })

    describe('links', () => {
        it('all cards are links', () => {
            render(<SideProjects />)
            const links = screen.getAllByRole('link')
            expect(links.length).toBe(4)
        })

        it('Discord link is correct', () => {
            render(<SideProjects />)
            const link = screen.getByText('Discord Community for Gamers').closest('a')
            expect(link).toHaveAttribute('href', 'https://discord.gg/5fDgzYraCJ')
        })

        it('Courses link is correct', () => {
            render(<SideProjects />)
            const link = screen.getByText('Self-Paced Courses Website').closest('a')
            expect(link).toHaveAttribute('href', 'https://learn.skyyskill.com/')
        })

        it('Spotify link is correct', () => {
            render(<SideProjects />)
            const link = screen.getByText('Podcast Series').closest('a')
            expect(link).toHaveAttribute('href', 'https://open.spotify.com/show/2WlENMZeZSwtrrJ1yBOz29')
        })

        it('opens links in new tab', () => {
            render(<SideProjects />)
            const link = screen.getByText('Discord Community for Gamers').closest('a')
            expect(link).toHaveAttribute('target', '_blank')
            expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        })
    })

    describe('structure', () => {
        it('has container class', () => {
            const { container } = render(<SideProjects />)
            expect(container.querySelector('.container')).toBeInTheDocument()
        })

        it('has grid layout', () => {
            const { container } = render(<SideProjects />)
            expect(container.querySelector('.grid')).toBeInTheDocument()
        })

        it('renders project card icons', () => {
            const { container } = render(<SideProjects />)
            const icons = container.querySelectorAll('.project-card-icon')
            expect(icons.length).toBe(4)
        })

        it('renders project card titles', () => {
            const { container } = render(<SideProjects />)
            const titles = container.querySelectorAll('.project-card-title')
            expect(titles.length).toBe(4)
        })
    })
})
