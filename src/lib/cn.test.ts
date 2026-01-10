import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
    describe('basic functionality', () => {
        it('merges class names', () => {
            const result = cn('bg-red-500', 'text-white')
            expect(result).toBe('bg-red-500 text-white')
        })

        it('handles single class name', () => {
            const result = cn('bg-blue-500')
            expect(result).toBe('bg-blue-500')
        })

        it('handles empty input', () => {
            const result = cn()
            expect(result).toBe('')
        })

        it('handles undefined values', () => {
            const result = cn('base', undefined, 'active')
            expect(result).toBe('base active')
        })

        it('handles null values', () => {
            const result = cn('base', null, 'active')
            expect(result).toBe('base active')
        })

        it('handles false values', () => {
            const result = cn('base', false, 'active')
            expect(result).toBe('base active')
        })
    })

    describe('tailwind merge functionality', () => {
        it('resolves conflicting tailwind classes', () => {
            const result = cn('bg-red-500', 'bg-blue-500')
            expect(result).toBe('bg-blue-500')
        })

        it('resolves padding conflicts', () => {
            const result = cn('px-2', 'px-4')
            expect(result).toBe('px-4')
        })

        it('resolves margin conflicts', () => {
            const result = cn('mt-4', 'mt-8')
            expect(result).toBe('mt-8')
        })

        it('resolves text color conflicts', () => {
            const result = cn('text-gray-500', 'text-white')
            expect(result).toBe('text-white')
        })
    })

    describe('conditional classes', () => {
        it('handles object syntax', () => {
            const isActive = true
            const result = cn({ 'bg-blue-500': isActive, 'bg-gray-500': !isActive })
            expect(result).toBe('bg-blue-500')
        })

        it('handles mixed array and string', () => {
            const result = cn(['base', 'class'], 'extra')
            expect(result).toBe('base class extra')
        })

        it('handles boolean conditions correctly', () => {
            const disabled = false
            const result = cn('btn', disabled && 'btn-disabled')
            expect(result).toBe('btn')
        })
    })
})
