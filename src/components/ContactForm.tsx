import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { canSubmit, recordSubmission, getRemainingTimeSeconds } from '../lib/rateLimit'
import { useLang } from '../context/LangContext'

interface FormErrors {
    name?: string
    email?: string
    message?: string
    privacy?: string
}

export function ContactForm() {
    const { t, lang } = useLang()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [privacyAccepted, setPrivacyAccepted] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [status, setStatus] = useState<'idle' | 'success' | 'rateLimit'>('idle')

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {}

        if (!name.trim()) {
            newErrors.name = lang === 'tr' ? 'Ad alanı zorunludur' : 'Name is required'
        }

        if (!email.trim() || !validateEmail(email)) {
            newErrors.email = lang === 'tr' ? 'Geçerli bir e-posta adresi giriniz' : 'Please enter a valid email address'
        }

        if (!message.trim()) {
            newErrors.message = lang === 'tr' ? 'Mesaj alanı zorunludur' : 'Message is required'
        }

        if (!privacyAccepted) {
            newErrors.privacy = lang === 'tr' ? 'Devam etmek için onay gereklidir' : 'Consent is required to proceed'
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
        setPrivacyAccepted(false)
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
                    {t.contactSuccess}
                </div>
            )}

            {status === 'rateLimit' && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    <AlertCircle size={18} />
                    {lang === 'tr' ? 'Çok hızlı deniyorsun, lütfen birkaç dakika sonra tekrar dene.' : 'Too many attempts. Please try again in a few minutes.'} ({getRemainingTimeSeconds()}s)
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">{t.contactName}</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder={lang === 'tr' ? 'Adınız soyadınız' : 'Your full name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                />
                {errors.name && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">{t.contactEmail}</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={lang === 'tr' ? 'ornek@email.com' : 'example@email.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                />
                {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">{t.contactMessage}</Label>
                <Textarea
                    id="message"
                    placeholder={lang === 'tr' ? 'Projeniz veya ihtiyacınız hakkında kısa bilgi verin...' : 'Tell us briefly about your project or need...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-invalid={!!errors.message}
                />
                {errors.message && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <Checkbox
                        id="privacy"
                        checked={privacyAccepted}
                        onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                        aria-invalid={!!errors.privacy}
                    />
                    <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                        {lang === 'tr' ? 'Kişisel verilerimin işlenmesini kabul ediyorum.' : 'I agree to the processing of my personal data.'}{' '}
                        <Link to="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">
                            {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                        </Link>
                    </Label>
                </div>
                {errors.privacy && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.privacy}</p>
                )}
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto">
                <Send size={16} />
                {t.contactSend}
            </Button>
        </form>
    )
}
