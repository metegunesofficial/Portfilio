import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

export function RegisterPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [localError, setLocalError] = useState<string | null>(null)
    const { register, loading, error, clearError } = useAuth()
    const { t } = useLang()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)

        if (password !== confirmPassword) {
            setLocalError(t.passwordMismatch)
            return
        }

        if (password.length < 6) {
            setLocalError(t.passwordTooShort)
            return
        }

        const success = await register(email, password, fullName)
        if (success) {
            navigate('/')
        }
    }

    const displayError = localError || error

    return (
        <div className="auth-page">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-header">
                    <div className="auth-icon">
                        <UserPlus size={32} />
                    </div>
                    <h1>{t.registerTitle}</h1>
                    <p>{t.registerSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {displayError && (
                        <motion.div
                            className="auth-error"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <AlertCircle size={18} />
                            <span>{displayError}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setLocalError(null)
                                    clearError()
                                }}
                                className="error-close"
                            >
                                ×
                            </button>
                        </motion.div>
                    )}

                    <div className="form-group">
                        <label htmlFor="fullName">{t.contactName}</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder={t.fullNamePlaceholder}
                                required
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">{t.contactEmail}</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{t.password}</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">{t.confirmPassword}</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                {t.registerBtn}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {t.hasAccount}{' '}
                        <Link to="/login">{t.loginLink}</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
