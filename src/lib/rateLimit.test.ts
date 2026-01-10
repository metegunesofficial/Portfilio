import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { canSubmit, recordSubmission, getRemainingTimeSeconds } from './rateLimit'

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

describe('rateLimit', () => {
    beforeEach(() => {
        localStorageMock.clear()
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('canSubmit', () => {
        it('returns true when no submissions exist', () => {
            expect(canSubmit()).toBe(true)
        })

        it('returns true when less than 3 submissions exist', () => {
            const now = Date.now()
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({
                timestamps: [now - 1000, now - 2000]
            }))
            expect(canSubmit()).toBe(true)
        })

        it('returns false when 3 or more recent submissions exist', () => {
            const now = Date.now()
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({
                timestamps: [now - 1000, now - 2000, now - 3000]
            }))
            expect(canSubmit()).toBe(false)
        })

        it('returns true when old submissions have expired', () => {
            const now = Date.now()
            const oldTime = now - (6 * 60 * 1000) // 6 minutes ago (expired)
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({
                timestamps: [oldTime, oldTime, oldTime]
            }))
            expect(canSubmit()).toBe(true)
        })
    })

    describe('recordSubmission', () => {
        it('records a new submission timestamp', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))
            recordSubmission()

            expect(localStorageMock.setItem).toHaveBeenCalled()
            const [key, value] = localStorageMock.setItem.mock.calls[0]
            expect(key).toBe('contact_form_submissions')

            const parsed = JSON.parse(value)
            expect(parsed.timestamps).toHaveLength(1)
            expect(parsed.timestamps[0]).toBe(Date.now())
        })

        it('adds to existing submissions', () => {
            const now = Date.now()
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({
                timestamps: [now - 1000]
            }))

            recordSubmission()

            const calls = localStorageMock.setItem.mock.calls
            const lastCall = calls[calls.length - 1]
            const parsed = JSON.parse(lastCall[1])
            expect(parsed.timestamps).toHaveLength(2)
        })
    })

    describe('getRemainingTimeSeconds', () => {
        it('returns 0 when can still submit', () => {
            expect(getRemainingTimeSeconds()).toBe(0)
        })

        it('returns 0 when less than 3 submissions', () => {
            const now = Date.now()
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({
                timestamps: [now - 1000, now - 2000]
            }))
            expect(getRemainingTimeSeconds()).toBe(0)
        })

        it('returns remaining seconds when rate limited', () => {
            const now = Date.now()
            // 3 submissions at now, means they expire in 5 minutes (300 seconds)
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({
                timestamps: [now - 60000, now - 30000, now] // oldest is 1 minute ago
            }))

            const remaining = getRemainingTimeSeconds()
            // Should be approximately 4 minutes = 240 seconds 
            expect(remaining).toBeGreaterThan(230)
            expect(remaining).toBeLessThanOrEqual(240)
        })

        it('returns 0 when rate limit expired', () => {
            const now = Date.now()
            const oldTime = now - (6 * 60 * 1000) // 6 minutes ago
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({
                timestamps: [oldTime, oldTime, oldTime]
            }))

            expect(getRemainingTimeSeconds()).toBe(0)
        })
    })

    describe('edge cases', () => {
        it('handles invalid JSON in localStorage', () => {
            localStorageMock.setItem('contact_form_submissions', 'invalid-json')
            expect(canSubmit()).toBe(true)
        })

        it('handles missing timestamps array', () => {
            localStorageMock.setItem('contact_form_submissions', JSON.stringify({}))
            expect(canSubmit()).toBe(true)
        })
    })
})
