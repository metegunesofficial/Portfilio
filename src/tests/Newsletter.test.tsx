import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Newsletter } from '../components/Newsletter'
import { LangProvider } from '../context/LangContext'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LangProvider>
      {ui}
    </LangProvider>
  )
}

describe('Newsletter', () => {
  it('renders newsletter form', () => {
    renderWithProviders(<Newsletter />)
    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument()
  })

  it('validates email input', async () => {
    renderWithProviders(<Newsletter />)

    const input = screen.getByPlaceholderText(/your@email.com/i)
    const button = screen.getByRole('button', { name: /Subscribe/i })

    // Submit empty form
    fireEvent.click(button)
    // There isn't a direct "required" error message text visible immediately without interaction in some implementations,
    // but the component shows validation error on blur or submit.
    // Let's check if error appears.

    // In Newsletter.tsx:
    // const validateEmail = (value: string): string => {
    //    if (!value.trim()) return errorMessages.required
    //    ...
    // }

    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument()

    // Invalid email
    fireEvent.change(input, { target: { value: 'invalid-email' } })
    fireEvent.blur(input)
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
  })
})
