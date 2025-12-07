import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

export function Newsletter() {
    const { t } = useLang()
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setSubmitted(true)
            setEmail('')
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
                        className="text-[16px] font-medium"
                    >
                        {t.newsletterSuccess}
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.newsletterPlaceholder}
                            className="newsletter-input"
                            required
                        />
                        <button type="submit" className="newsletter-btn">
                            {t.newsletterBtn}
                        </button>
                    </form>
                )}
            </motion.div>
        </section>
    )
}
