import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Mail } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { subscribeToNewsletter } from '../services/newsletter'

export function Newsletter() {
    const { lang, t } = useLang()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const errorMessages = {
        required: lang === 'tr' ? 'E-posta adresi gerekli' : 'Email address is required',
        invalid: lang === 'tr' ? 'Geçerli bir e-posta adresi girin' : 'Please enter a valid email address',
        noAt: lang === 'tr' ? 'E-posta adresi @ işareti içermeli' : 'Email must contain @ symbol',
        noDomain: lang === 'tr' ? 'E-posta adresi bir alan adı içermeli (örn: gmail.com)' : 'Email must contain a domain (e.g., gmail.com)',
        invalidChars: lang === 'tr' ? 'E-posta adresi geçersiz karakterler içeriyor' : 'Email contains invalid characters',
        tooShort: lang === 'tr' ? 'E-posta adresi çok kısa' : 'Email address is too short',
        alreadySubscribed: lang === 'tr' ? 'Bu e-posta adresi zaten bültenimize kayıtlı' : 'This email is already subscribed to our newsletter'
    }

    const validateEmail = (value: string): string => {
        const trimmed = value.trim()

        // Check if empty
        if (!trimmed) return errorMessages.required

        // Check minimum length
        if (trimmed.length < 5) return errorMessages.tooShort

        // Check for @ symbol
        if (!trimmed.includes('@')) return errorMessages.noAt

        // Check for invalid characters (spaces, special chars at wrong places)
        if (/\s/.test(trimmed)) return errorMessages.invalidChars

        // Split into local and domain parts
        const parts = trimmed.split('@')
        if (parts.length !== 2) return errorMessages.invalid

        const [local, domain] = parts

        // Check local part
        if (!local || local.length === 0) return errorMessages.invalid

        // Check domain part
        if (!domain || !domain.includes('.')) return errorMessages.noDomain

        // Check domain has valid TLD (at least 2 characters after last dot)
        const domainParts = domain.split('.')
        const tld = domainParts[domainParts.length - 1]
        if (!tld || tld.length < 2) return errorMessages.noDomain

        // Comprehensive regex for final validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        if (!emailRegex.test(trimmed)) return errorMessages.invalid

        return ''
    }

    const handleChange = (value: string) => {
        setEmail(value)
        // Clear error when user starts typing after a failed submit
        if (error) {
            setError('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationError = validateEmail(email)
        if (validationError) {
            setError(validationError)
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            // Call the actual newsletter service
            const result = await subscribeToNewsletter(email.trim(), undefined, 'website_form')

            if (!result.success) {
                setError(result.error || errorMessages.alreadySubscribed)
                setIsSubmitting(false)
                return
            }

            // Track event
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'newsletter_signup', {
                    event_category: 'engagement'
                })
            }

            setIsSubmitting(false)
            setSubmitted(true)
            setEmail('')
        } catch (err) {
            console.error('Newsletter subscription error:', err)
            setError(lang === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.')
            setIsSubmitting(false)
        }
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
                        <div className={`newsletter-input-wrapper ${error ? 'has-error' : ''}`}>
                            <Mail size={18} className="newsletter-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => handleChange(e.target.value)}
                                placeholder={t.newsletterPlaceholder}
                                className="newsletter-input"
                                aria-invalid={error ? 'true' : 'false'}
                                aria-describedby={error ? 'newsletter-error' : undefined}
                            />
                        </div>

                        {error && (
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
