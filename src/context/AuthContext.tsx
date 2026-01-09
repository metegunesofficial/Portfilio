import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

// Supabase ortam değişkenlerini kontrol et
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

interface AuthContextType {
    user: User | null
    loading: boolean
    error: string | null
    isConfigured: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (email: string, password: string, fullName: string) => Promise<boolean>
    logout: () => Promise<void>
    clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(isSupabaseConfigured)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Supabase yapılandırılmamışsa, hiçbir şey yapma
        if (!isSupabaseConfigured) {
            setLoading(false)
            return
        }

        // Dinamik import ile Supabase client'ı yükle
        import('../lib/supabase-client').then(({ getSupabaseClient }) => {
            try {
                const supabase = getSupabaseClient()

                // Sayfa yüklendiğinde mevcut oturumu kontrol et
                supabase.auth.getSession().then(({ data: { session } }) => {
                    setUser(session?.user ?? null)
                    setLoading(false)
                })

                // Oturum değişikliklerini dinle
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    setUser(session?.user ?? null)
                    setLoading(false)
                })

                return () => subscription.unsubscribe()
            } catch {
                setLoading(false)
            }
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        if (!isSupabaseConfigured) {
            setError('Supabase yapılandırılmamış. .env.local dosyasını kontrol edin.')
            return false
        }
        try {
            setError(null)
            setLoading(true)
            const { girisEmailParola } = await import('../services/auth')
            await girisEmailParola(email, password)
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Giriş yapılamadı')
            return false
        } finally {
            setLoading(false)
        }
    }

    const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
        if (!isSupabaseConfigured) {
            setError('Supabase yapılandırılmamış. .env.local dosyasını kontrol edin.')
            return false
        }
        try {
            setError(null)
            setLoading(true)
            const { registerEmailParola } = await import('../services/auth')
            await registerEmailParola(email, password, fullName)
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Kayıt yapılamadı')
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = async (): Promise<void> => {
        if (!isSupabaseConfigured) return
        try {
            setError(null)
            const { cikisYap } = await import('../services/auth')
            await cikisYap()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Çıkış yapılamadı')
        }
    }

    const clearError = () => setError(null)

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            isConfigured: isSupabaseConfigured,
            login,
            register,
            logout,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

