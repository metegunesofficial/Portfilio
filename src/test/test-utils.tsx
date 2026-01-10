import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { AuthProvider } from '../context/AuthContext'

interface WrapperProps {
    children: ReactNode
}

// All providers wrapper for general tests
const AllProviders = ({ children }: WrapperProps) => {
    return (
        <MemoryRouter>
            <AuthProvider>
                <LangProvider>
                    {children}
                </LangProvider>
            </AuthProvider>
        </MemoryRouter>
    )
}

// Custom render with all providers
const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

// Wrapper with custom initial route
interface RouterWrapperOptions {
    route?: string
    initialEntries?: string[]
}

const renderWithRouter = (
    ui: ReactElement,
    { route = '/', initialEntries = [route], ...options }: RouterWrapperOptions = {}
) => {
    const Wrapper = ({ children }: WrapperProps) => (
        <MemoryRouter initialEntries={initialEntries}>
            <AuthProvider>
                <LangProvider>
                    {children}
                </LangProvider>
            </AuthProvider>
        </MemoryRouter>
    )
    return render(ui, { wrapper: Wrapper, ...options })
}

// Simple render without providers (for isolated unit tests)
const renderBasic = (ui: ReactElement, options?: RenderOptions) =>
    render(ui, options)

// Export everything
export * from '@testing-library/react'
export { customRender as render, renderWithRouter, renderBasic }
