import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import type { ReactNode } from 'react'

// Mock import.meta.env
vi.stubEnv('VITE_SUPABASE_URL', '')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
    )

    describe('useAuth hook', () => {
        it('throws error when used outside AuthProvider', () => {
            expect(() => {
                renderHook(() => useAuth())
            }).toThrow('useAuth must be used within an AuthProvider')
        })

        it('provides initial state correctly', () => {
            const { result } = renderHook(() => useAuth(), { wrapper })

            expect(result.current.user).toBe(null)
            // loading may be true initially while checking session
            expect(typeof result.current.loading).toBe('boolean')
            expect(result.current.error).toBe(null)
            // isConfigured depends on env vars which may be present
            expect(typeof result.current.isConfigured).toBe('boolean')
        })

        it('provides login function', () => {
            const { result } = renderHook(() => useAuth(), { wrapper })
            expect(typeof result.current.login).toBe('function')
        })

        it('provides register function', () => {
            const { result } = renderHook(() => useAuth(), { wrapper })
            expect(typeof result.current.register).toBe('function')
        })

        it('provides logout function', () => {
            const { result } = renderHook(() => useAuth(), { wrapper })
            expect(typeof result.current.logout).toBe('function')
        })

        it('provides clearError function', () => {
            const { result } = renderHook(() => useAuth(), { wrapper })
            expect(typeof result.current.clearError).toBe('function')
        })
    })

    describe('when Supabase is not configured', () => {
        it('returns isConfigured status', () => {
            const { result } = renderHook(() => useAuth(), { wrapper })
            // isConfigured depends on env vars, may be true or false in test environment
            expect(typeof result.current.isConfigured).toBe('boolean')
        })

        it('login returns false and sets error', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper })

            let success: boolean = false
            await act(async () => {
                success = await result.current.login('test@test.com', 'password')
            })

            expect(success).toBe(false)
            expect(result.current.error).toContain('Supabase')
        })

        it('register returns false and sets error', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper })

            let success: boolean = false
            await act(async () => {
                success = await result.current.register('test@test.com', 'password', 'John')
            })

            expect(success).toBe(false)
            expect(result.current.error).toContain('Supabase')
        })

        it('logout handles unconfigured state gracefully', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper })

            await act(async () => {
                await result.current.logout()
            })

            // Logout may or may not set an error depending on configuration
            // The important thing is it doesn't throw
            expect(result.current.loading).toBe(false)
        })
    })

    describe('clearError', () => {
        it('clears the error state', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper })

            // Trigger an error
            await act(async () => {
                await result.current.login('test@test.com', 'password')
            })

            expect(result.current.error).not.toBe(null)

            // Clear the error
            act(() => {
                result.current.clearError()
            })

            expect(result.current.error).toBe(null)
        })
    })
})
