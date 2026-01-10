import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LangProvider, useLang } from './LangContext'
import type { ReactNode } from 'react'

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value }),
        removeItem: vi.fn((key: string) => { delete store[key] }),
        clear: vi.fn(() => { store = {} }),
    }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('LangContext', () => {
    beforeEach(() => {
        localStorageMock.clear()
        vi.clearAllMocks()
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <LangProvider>{children}</LangProvider>
    )

    describe('useLang hook', () => {
        it('throws error when used outside LangProvider', () => {
            expect(() => {
                renderHook(() => useLang())
            }).toThrow('useLang must be used within a LangProvider')
        })

        it('provides default language as English', () => {
            const { result } = renderHook(() => useLang(), { wrapper })
            expect(result.current.lang).toBe('en')
        })

        it('provides correct English translations', () => {
            const { result } = renderHook(() => useLang(), { wrapper })
            expect(result.current.t.home).toBe('Home')
            expect(result.current.t.blogs).toBe('Blogs')
            expect(result.current.t.contact).toBe('Contact')
            expect(result.current.t.heroTitle).toBe("Hey, I'm Mete")
        })

        it('switches language to Turkish', () => {
            const { result } = renderHook(() => useLang(), { wrapper })

            act(() => {
                result.current.setLang('tr')
            })

            expect(result.current.lang).toBe('tr')
            expect(result.current.t.home).toBe('Ana Sayfa')
            expect(result.current.t.blogs).toBe('Blog')
            expect(result.current.t.heroTitle).toBe('Merhaba, Ben Mete')
        })

        it('persists language preference to localStorage', () => {
            const { result } = renderHook(() => useLang(), { wrapper })

            act(() => {
                result.current.setLang('tr')
            })

            expect(localStorageMock.setItem).toHaveBeenCalledWith('lang', 'tr')
        })

        it('reads language preference from localStorage on init', () => {
            localStorageMock.getItem.mockReturnValue('tr')

            const { result } = renderHook(() => useLang(), { wrapper })

            expect(result.current.lang).toBe('tr')
        })

        it('switches back to English from Turkish', () => {
            const { result } = renderHook(() => useLang(), { wrapper })

            act(() => {
                result.current.setLang('tr')
            })
            expect(result.current.lang).toBe('tr')

            act(() => {
                result.current.setLang('en')
            })
            expect(result.current.lang).toBe('en')
            expect(result.current.t.home).toBe('Home')
        })
    })

    describe('translations completeness', () => {
        it('has all required keys for English', () => {
            const { result } = renderHook(() => useLang(), { wrapper })
            const t = result.current.t

            // Sidebar
            expect(t.home).toBeDefined()
            expect(t.blogs).toBeDefined()
            expect(t.products).toBeDefined()
            expect(t.contact).toBeDefined()

            // Newsletter
            expect(t.newsletterTitle).toBeDefined()
            expect(t.newsletterDesc).toBeDefined()
            expect(t.newsletterBtn).toBeDefined()

            // Contact
            expect(t.contactTitle).toBeDefined()
            expect(t.contactName).toBeDefined()
            expect(t.contactEmail).toBeDefined()
            expect(t.contactMessage).toBeDefined()
            expect(t.contactSend).toBeDefined()

            // Auth
            expect(t.loginTitle).toBeDefined()
            expect(t.loginBtn).toBeDefined()
            expect(t.registerTitle).toBeDefined()
            expect(t.registerBtn).toBeDefined()
            expect(t.logout).toBeDefined()
        })

        it('has all required keys for Turkish', () => {
            const { result } = renderHook(() => useLang(), { wrapper })

            act(() => {
                result.current.setLang('tr')
            })

            const t = result.current.t

            // Sidebar
            expect(t.home).toBeDefined()
            expect(t.blogs).toBeDefined()
            expect(t.products).toBeDefined()
            expect(t.contact).toBeDefined()

            // Newsletter
            expect(t.newsletterTitle).toBeDefined()
            expect(t.newsletterDesc).toBeDefined()
            expect(t.newsletterBtn).toBeDefined()

            // Contact
            expect(t.contactTitle).toBeDefined()
            expect(t.contactName).toBeDefined()
            expect(t.contactEmail).toBeDefined()
            expect(t.contactMessage).toBeDefined()
            expect(t.contactSend).toBeDefined()

            // Auth
            expect(t.loginTitle).toBeDefined()
            expect(t.loginBtn).toBeDefined()
            expect(t.registerTitle).toBeDefined()
            expect(t.registerBtn).toBeDefined()
            expect(t.logout).toBeDefined()
        })
    })
})
