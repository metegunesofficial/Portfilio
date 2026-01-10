import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login, isConfigured } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!isConfigured) {
            setError('Supabase yapılandırılmamış. .env.local dosyasını kontrol edin.')
            setIsLoading(false)
            return
        }

        try {
            const success = await login(email, password)
            if (success) {
                // Store auth in sessionStorage for backward compatibility
                sessionStorage.setItem('admin_auth', 'true')
                navigate('/admin/dashboard')
            } else {
                setError('Giriş başarısız. Email veya şifrenizi kontrol edin.')
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_err) {
            setError('Giriş yapılırken bir hata oluştu.')
        }
        setIsLoading(false)
    }

    const isFormValid = email.trim() !== '' && password.trim() !== ''

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
                        <label htmlFor="email">Email</label>
                        <div className="email-input-wrapper">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                autoFocus
                            />
                            <span className="input-icon">
                                <Mail size={18} />
                            </span>
                        </div>
                    </div>

                    <div className="form-row">
                        <label htmlFor="password">Şifre</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
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
                        disabled={isLoading || !isFormValid}
                    >
                        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    )
}
