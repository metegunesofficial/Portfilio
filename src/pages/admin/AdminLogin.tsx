import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'

// Admin şifresi - production'da .env'den alınmalı
const ADMIN_PASSWORD = 'admin123'

export function AdminLogin() {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        if (password === ADMIN_PASSWORD) {
            // Store auth in sessionStorage
            sessionStorage.setItem('admin_auth', 'true')
            navigate('/admin/dashboard')
        } else {
            setError('Yanlış şifre. Lütfen tekrar deneyin.')
        }
        setIsLoading(false)
    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-icon">
                    <Lock size={32} />
                </div>
                <h1>Admin Paneli</h1>
                <p>İçerik yönetimi için giriş yapın</p>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-row">
                        <label htmlFor="password">Şifre</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Admin şifresini girin"
                                autoFocus
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="admin-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary admin-submit"
                        disabled={isLoading || !password}
                    >
                        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    )
}
