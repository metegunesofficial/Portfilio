import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useLang } from '../context/LangContext'

interface FormErrors {
    name?: string
    email?: string
    message?: string
}

export function ContactPage() {
    const { lang, t } = useLang()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const errorMessages = {
        name: {
            required: lang === 'tr' ? 'İsim zorunludur' : 'Name is required',
            minLength: lang === 'tr' ? 'İsim en az 2 karakter olmalıdır' : 'Name must be at least 2 characters'
        },
        email: {
            required: lang === 'tr' ? 'E-posta zorunludur' : 'Email is required',
            invalid: lang === 'tr' ? 'Geçerli bir e-posta adresi girin' : 'Please enter a valid email address'
        },
        message: {
            required: lang === 'tr' ? 'Mesaj zorunludur' : 'Message is required',
            minLength: lang === 'tr' ? 'Mesaj en az 10 karakter olmalıdır' : 'Message must be at least 10 characters'
        }
    }

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'name':
                if (!value.trim()) return errorMessages.name.required
                if (value.trim().length < 2) return errorMessages.name.minLength
                break
            case 'email':
                if (!value.trim()) return errorMessages.email.required
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return errorMessages.email.invalid
                break
            case 'message':
                if (!value.trim()) return errorMessages.message.required
                if (value.trim().length < 10) return errorMessages.message.minLength
                break
        }
        return undefined
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        const nameError = validateField('name', formData.name)
        const emailError = validateField('email', formData.email)
        const messageError = validateField('message', formData.message)

        if (nameError) newErrors.name = nameError
        if (emailError) newErrors.email = emailError
        if (messageError) newErrors.message = messageError

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true })
        const error = validateField(field, formData[field as keyof typeof formData])
        setErrors({ ...errors, [field]: error })
    }

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value })

        // Clear error on change if field is touched
        if (touched[field]) {
            const error = validateField(field, value)
            setErrors({ ...errors, [field]: error })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({ name: true, email: true, message: true })

        if (!validateForm()) return

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Track event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'contact_form_submit', {
                event_category: 'engagement',
                event_label: 'contact_page'
            })
        }

        setIsSubmitting(false)
        setSubmitted(true)
    }

    return (
        <div className="page-wrapper">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>{t.contactTitle}</h1>
            </motion.header>

            <motion.div
                className="contact-form-section contact-form-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {submitted ? (
                    <div className="contact-success">
                        <CheckCircle size={48} className="success-icon" />
                        <h3>{t.contactSuccess}</h3>
                        <p>{t.contactSuccessDesc}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="contact-form" noValidate>
                        <div className={`form-row ${errors.name && touched.name ? 'has-error' : ''}`}>
                            <label htmlFor="name">{t.contactName}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                autoComplete="name"
                                placeholder={t.contactName}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                                aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                            />
                            {errors.name && touched.name && (
                                <span className="form-error" id="name-error" role="alert">
                                    <AlertCircle size={14} />
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div className={`form-row ${errors.email && touched.email ? 'has-error' : ''}`}>
                            <label htmlFor="email">{t.contactEmail}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            {errors.email && touched.email && (
                                <span className="form-error" id="email-error" role="alert">
                                    <AlertCircle size={14} />
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className={`form-row ${errors.message && touched.message ? 'has-error' : ''}`}>
                            <label htmlFor="message">{t.contactMessage}</label>
                            <textarea
                                id="message"
                                rows={4}
                                placeholder={t.contactMessage}
                                value={formData.message}
                                onChange={(e) => handleChange('message', e.target.value)}
                                onBlur={() => handleBlur('message')}
                                aria-invalid={errors.message && touched.message ? 'true' : 'false'}
                                aria-describedby={errors.message ? 'message-error' : undefined}
                            />
                            {errors.message && touched.message && (
                                <span className="form-error" id="message-error" role="alert">
                                    <AlertCircle size={14} />
                                    {errors.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="submit-btn flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="btn-loading flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    {lang === 'tr' ? 'Gönderiliyor...' : 'Sending...'}
                                </span>
                            ) : (
                                <>
                                    {t.contactSend}
                                    <Send size={16} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    )
}
