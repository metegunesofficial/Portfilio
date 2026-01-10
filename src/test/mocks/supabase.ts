/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest'

// Create chainable mock that returns itself for all methods
const createChainableMock = (): any => {
    const mock: any = {}

    const chainMethods = [
        'select', 'eq', 'is', 'neq', 'gt', 'gte', 'lt', 'lte',
        'like', 'ilike', 'in', 'order', 'limit', 'range',
        'insert', 'update', 'delete', 'upsert'
    ]

    chainMethods.forEach(method => {
        mock[method] = vi.fn(() => mock)
    })

    // Terminal methods
    mock.single = vi.fn(() => Promise.resolve({ data: null, error: null }))
    mock.maybeSingle = vi.fn(() => Promise.resolve({ data: null, error: null }))
    mock.then = vi.fn((resolve: any) => resolve({ data: [], error: null }))

    return mock
}

// Mock Supabase client
export const mockSupabaseClient: any = {
    from: vi.fn(() => createChainableMock()),
    auth: {
        signInWithPassword: vi.fn(() => Promise.resolve({ data: null, error: null })),
        signUp: vi.fn(() => Promise.resolve({ data: null, error: null })),
        signOut: vi.fn(() => Promise.resolve({ error: null })),
        getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        onAuthStateChange: vi.fn(() => ({
            data: { subscription: { unsubscribe: vi.fn() } },
        })),
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
    channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
        unsubscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
}

// Helper to mock successful data fetch
export const mockSupabaseData = <T>(tableName: string, data: T[]) => {
    (mockSupabaseClient.from as any).mockImplementation((table: string) => {
        const mock = createChainableMock()

        if (table === tableName) {
            mock.single = vi.fn(() => Promise.resolve({ data: data[0] || null, error: null }))
            mock.maybeSingle = vi.fn(() => Promise.resolve({ data: data[0] || null, error: null }))
            mock.then = vi.fn((resolve: any) => resolve({ data, error: null }))
        }

        return mock
    })
}

// Helper to mock error
export const mockSupabaseError = (errorMessage: string) => {
    (mockSupabaseClient.from as any).mockImplementation(() => {
        const mock = createChainableMock()
        mock.single = vi.fn(() => Promise.resolve({ data: null, error: { message: errorMessage } }))
        mock.maybeSingle = vi.fn(() => Promise.resolve({ data: null, error: { message: errorMessage } }))
        mock.then = vi.fn((resolve: any) => resolve({ data: null, error: { message: errorMessage } }))
        return mock
    })
}

// Reset all mocks
export const resetSupabaseMocks = () => {
    vi.clearAllMocks()
}

// Mock the getSupabaseClient function
vi.mock('../../lib/supabase-client', () => ({
    getSupabaseClient: () => mockSupabaseClient,
}))
