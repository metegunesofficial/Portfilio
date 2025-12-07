import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { canSubmit, recordSubmission, getRemainingTimeSeconds } from '../lib/rateLimit'

type Lang = 'tr' | 'en'

interface ContactFormProps {
    lang: Lang
}

const formTexts = {
    tr: {
        name: 'Adınız',
        namePlaceholder: 'Adınız soyadınız',
        email: 'E-posta',
        emailPlaceholder: 'ornek@email.com',
        message: 'Mesajınız',
        messagePlaceholder: 'Projeniz veya ihtiyacınız hakkında kısa bilgi verin...',
        submit: 'Gönder',
        success: 'Mesajınız alındı, teşekkürler!',
        rateLimit: 'Çok hızlı deniyorsun, lütfen birkaç dakika sonra tekrar dene.',
        nameRequired: 'Ad alanı zorunludur',
        emailInvalid: 'Geçerli bir e-posta adresi giriniz',
        messageRequired: 'Mesaj alanı zorunludur',
    },
    en: {
        name: 'Your name',
        namePlaceholder: 'Your full name',
        email: 'Email',
        emailPlaceholder: 'example@email.com',
        message: 'Your message',
        messagePlaceholder: 'Tell us briefly about your project or need...',
        submit: 'Send',
        success: 'Message received, thank you!',
        rateLimit: 'Too many attempts. Please try again in a few minutes.',
        nameRequired: 'Name is required',
        emailInvalid: 'Please enter a valid email address',
        messageRequired: 'Message is required',
    },
} as const

interface FormErrors {
    name?: string
    email?: string
    message?: string
}

export function ContactForm({ lang }: ContactFormProps) {
    const t = formTexts[lang]

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [status, setStatus] = useState<'idle' | 'success' | 'rateLimit'>('idle')

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {}

        if (!name.trim()) {
            newErrors.name = t.nameRequired
        }

        if (!email.trim() || !validateEmail(email)) {
            newErrors.email = t.emailInvalid
        }

        if (!message.trim()) {
            newErrors.message = t.messageRequired
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        // Check rate limit first
        if (!canSubmit()) {
            setStatus('rateLimit')
            return
        }

        // Validate form
        if (!validate()) {
            return
        }

        // Record submission for rate limiting
        recordSubmission()

        // Simulate successful submission (frontend-only demo)
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
        setErrors({})

        // Reset success message after 5 seconds
        setTimeout(() => {
            setStatus('idle')
        }, 5000)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'success' && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <CheckCircle size={18} />
                    {t.success}
                </div>
            )}

            {status === 'rateLimit' && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    <AlertCircle size={18} />
                    {t.rateLimit} ({getRemainingTimeSeconds()}s)
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                />
                {errors.name && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                />
                {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">{t.message}</Label>
                <Textarea
                    id="message"
                    placeholder={t.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-invalid={!!errors.message}
                />
                {errors.message && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.message}</p>
                )}
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto">
                <Send size={16} />
                {t.submit}
            </Button>
        </form>
    )
}
