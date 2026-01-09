import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Mail } from 'lucide-react'
import { useLang } from '../context/LangContext'

export function Newsletter() {
    const { lang, t } = useLang()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [touched, setTouched] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const errorMessages = {
        required: lang === 'tr' ? 'E-posta adresi gerekli' : 'Email address is required',
        invalid: lang === 'tr' ? 'Geçerli bir e-posta adresi girin' : 'Please enter a valid email address'
    }

    const validateEmail = (value: string): string => {
        if (!value.trim()) return errorMessages.required
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return errorMessages.invalid
        return ''
    }

    const handleBlur = () => {
        setTouched(true)
        setError(validateEmail(email))
    }

    const handleChange = (value: string) => {
        setEmail(value)
        if (touched) {
            setError(validateEmail(value))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched(true)

        const validationError = validateEmail(email)
        if (validationError) {
            setError(validationError)
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Track event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'newsletter_signup', {
                event_category: 'engagement'
            })
        }

        setIsSubmitting(false)
        setSubmitted(true)
        setEmail('')
    }

    return (
        <section className="newsletter-section">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h3>{t.newsletterTitle}</h3>
                <p>{t.newsletterDesc}</p>

                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="newsletter-success"
                    >
                        <CheckCircle size={24} />
                        <span>{t.newsletterSuccess}</span>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="newsletter-form" noValidate>
                        <div className={`newsletter-input-wrapper ${error && touched ? 'has-error' : ''}`}>
                            <Mail size={18} className="newsletter-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder={t.newsletterPlaceholder}
                                className="newsletter-input"
                                aria-invalid={error && touched ? 'true' : 'false'}
                                aria-describedby={error ? 'newsletter-error' : undefined}
                            />
                        </div>

                        {error && touched && (
                            <motion.span
                                className="newsletter-error"
                                id="newsletter-error"
                                role="alert"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.span>
                        )}

                        <button
                            type="submit"
                            className="newsletter-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (lang === 'tr' ? 'Gönderiliyor...' : 'Subscribing...')
                                : t.newsletterBtn
                            }
                        </button>
                    </form>
                )}
            </motion.div>
        </section>
    )
}
