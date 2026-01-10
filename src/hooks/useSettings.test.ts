import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSettings } from './useSettings'

// Mock supabase client
const mockSelect = vi.fn()
const mockFrom = vi.fn(() => ({ select: mockSelect }))

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => ({
        from: mockFrom,
    }),
}))

describe('useSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSelect.mockReset()
    })

    describe('initial state', () => {
        it('starts with loading state', () => {
            mockSelect.mockReturnValue(new Promise(() => { })) // Never resolves
            const { result } = renderHook(() => useSettings())
            expect(result.current.isLoading).toBe(true)
        })

        it('provides default settings initially', () => {
            mockSelect.mockReturnValue(new Promise(() => { }))
            const { result } = renderHook(() => useSettings())

            expect(result.current.settings.hero_title_en).toBe("Hey, I'm Mete")
            expect(result.current.settings.hero_title_tr).toBe('Merhaba, Ben Mete')
        })
    })

    describe('successful data fetch', () => {
        it('fetches settings from supabase', async () => {
            mockSelect.mockResolvedValue({
                data: [
                    { key: 'hero_title', value_tr: 'Selam', value_en: 'Hello', type: 'text' },
                    { key: 'hero_bio', value_tr: 'Bio TR', value_en: 'Bio EN', type: 'text' },
                ],
                error: null,
            })

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            expect(result.current.settings.hero_title_tr).toBe('Selam')
            expect(result.current.settings.hero_title_en).toBe('Hello')
        })

        it('sets loading to false after fetch', async () => {
            mockSelect.mockResolvedValue({ data: [], error: null })

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })
        })

        it('handles empty data gracefully', async () => {
            mockSelect.mockResolvedValue({ data: [], error: null })

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            // Should keep default values
            expect(result.current.settings.hero_title_en).toBe("Hey, I'm Mete")
        })
    })

    describe('error handling', () => {
        let consoleSpy: any

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
        })

        afterEach(() => {
            consoleSpy.mockRestore()
        })

        it('handles fetch error', async () => {
            mockSelect.mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
            })

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            expect(result.current.error).toBe('Failed to load settings')
        })

        it('keeps default settings on error', async () => {
            mockSelect.mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
            })

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            // Should maintain defaults
            expect(result.current.settings.hero_title_en).toBe("Hey, I'm Mete")
        })

        it('handles exception during fetch', async () => {
            mockSelect.mockRejectedValue(new Error('Network error'))

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            expect(result.current.error).toBe('Failed to load settings')
        })
    })

    describe('JSON type settings', () => {
        it('parses JSON type settings correctly', async () => {
            mockSelect.mockResolvedValue({
                data: [
                    {
                        key: 'skills',
                        value_tr: '["React", "Node.js", "AI"]',
                        value_en: null,
                        type: 'json'
                    },
                ],
                error: null,
            })

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            expect(result.current.settings.skills).toEqual(['React', 'Node.js', 'AI'])
        })

        it('handles invalid JSON gracefully', async () => {
            mockSelect.mockResolvedValue({
                data: [
                    {
                        key: 'skills',
                        value_tr: 'invalid-json',
                        type: 'json'
                    },
                ],
                error: null,
            })

            const { result } = renderHook(() => useSettings())

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            // Should use the raw value or default
            expect(result.current.settings.skills).toBeDefined()
        })
    })

    describe('return value structure', () => {
        it('returns settings object', () => {
            mockSelect.mockReturnValue(new Promise(() => { }))
            const { result } = renderHook(() => useSettings())

            expect(result.current.settings).toBeDefined()
            expect(typeof result.current.settings).toBe('object')
        })

        it('returns isLoading boolean', () => {
            mockSelect.mockReturnValue(new Promise(() => { }))
            const { result } = renderHook(() => useSettings())

            expect(typeof result.current.isLoading).toBe('boolean')
        })

        it('returns error as null initially', () => {
            mockSelect.mockReturnValue(new Promise(() => { }))
            const { result } = renderHook(() => useSettings())

            expect(result.current.error).toBe(null)
        })
    })
})
