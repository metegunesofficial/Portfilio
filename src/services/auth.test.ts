import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerEmailParola, girisEmailParola, cikisYap, aktifOturumAl } from './auth'

// Mock Supabase client
const mockClient = {
    auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getSession: vi.fn()
    },
    from: vi.fn(),
    select: vi.fn()
}

// Mock chainable query builder
const mockQueryBuilder = {
    insert: vi.fn(() => Promise.resolve({ error: null }))
}

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset chainable mock
        mockClient.from.mockReturnValue(mockQueryBuilder)
    })

    describe('registerEmailParola', () => {
        const email = 'test@example.com'
        const password = 'password123'
        const name = 'Test User'

        it('should register user successfully with profile', async () => {
            const mockUser = { id: 'user123' }
            mockClient.auth.signUp.mockResolvedValue({
                data: { user: mockUser },
                error: null
            })
            mockQueryBuilder.insert.mockResolvedValue({ error: null })

            const result = await registerEmailParola(email, password, name)

            expect(mockClient.auth.signUp).toHaveBeenCalledWith({
                email,
                password,
                options: { data: { full_name: name } }
            })
            expect(mockClient.from).toHaveBeenCalledWith('profiles')
            expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
                id: mockUser.id,
                full_name: name
            })
            expect(result).toEqual({ userId: mockUser.id })
        })

        it('should register user successfully without profile name', async () => {
            const mockUser = { id: 'user123' }
            mockClient.auth.signUp.mockResolvedValue({
                data: { user: mockUser },
                error: null
            })

            const result = await registerEmailParola(email, password)

            expect(mockClient.auth.signUp).toHaveBeenCalledWith({
                email,
                password,
                options: { data: { full_name: undefined } }
            })
            expect(mockClient.from).not.toHaveBeenCalled()
            expect(result).toEqual({ userId: mockUser.id })
        })

        it('should throw error when registration fails', async () => {
            const errorMsg = 'Registration failed'
            mockClient.auth.signUp.mockResolvedValue({
                data: { user: null },
                error: { message: errorMsg }
            })

            await expect(registerEmailParola(email, password)).rejects.toThrow(errorMsg)
        })

        it('should throw error when profile creation fails', async () => {
            const mockUser = { id: 'user123' }
            const errorMsg = 'Profile creation failed'

            mockClient.auth.signUp.mockResolvedValue({
                data: { user: mockUser },
                error: null
            })
            mockQueryBuilder.insert.mockResolvedValue({ error: { message: errorMsg } as any })

            await expect(registerEmailParola(email, password, name)).rejects.toThrow(errorMsg)
        })
    })

    describe('girisEmailParola', () => {
        const email = 'test@example.com'
        const password = 'password123'

        it('should sign in successfully', async () => {
            const mockSession = { access_token: 'token123' }
            mockClient.auth.signInWithPassword.mockResolvedValue({
                data: { session: mockSession },
                error: null
            })

            const result = await girisEmailParola(email, password)

            expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({ email, password })
            expect(result).toEqual({ sessionToken: mockSession.access_token })
        })

        it('should return null token if no session', async () => {
            mockClient.auth.signInWithPassword.mockResolvedValue({
                data: { session: null },
                error: null
            })

            const result = await girisEmailParola(email, password)

            expect(result).toEqual({ sessionToken: null })
        })

        it('should throw error when sign in fails', async () => {
            const errorMsg = 'Invalid credentials'
            mockClient.auth.signInWithPassword.mockResolvedValue({
                data: { session: null },
                error: { message: errorMsg }
            })

            await expect(girisEmailParola(email, password)).rejects.toThrow(errorMsg)
        })
    })

    describe('cikisYap', () => {
        it('should sign out successfully', async () => {
            mockClient.auth.signOut.mockResolvedValue({ error: null })

            await cikisYap()

            expect(mockClient.auth.signOut).toHaveBeenCalled()
        })

        it('should throw error when sign out fails', async () => {
            const errorMsg = 'Sign out failed'
            mockClient.auth.signOut.mockResolvedValue({ error: { message: errorMsg } })

            await expect(cikisYap()).rejects.toThrow(errorMsg)
        })
    })

    describe('aktifOturumAl', () => {
        it('should return active session token', async () => {
            const mockSession = { access_token: 'token123' }
            mockClient.auth.getSession.mockResolvedValue({
                data: { session: mockSession },
                error: null
            })

            const result = await aktifOturumAl()

            expect(mockClient.auth.getSession).toHaveBeenCalled()
            expect(result).toEqual({ sessionToken: mockSession.access_token })
        })

        it('should return null token if no active session', async () => {
            mockClient.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null
            })

            const result = await aktifOturumAl()

            expect(result).toEqual({ sessionToken: null })
        })

        it('should throw error when getting session fails', async () => {
            const errorMsg = 'Session check failed'
            mockClient.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: { message: errorMsg }
            })

            await expect(aktifOturumAl()).rejects.toThrow(errorMsg)
        })
    })
})
