import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useLang } from '../context/LangContext'

export function ContactPage() {
    const { t } = useLang()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
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
                        <span className="success-emoji">🎉</span>
                        <h3>{t.contactSuccess}</h3>
                        <p>{t.contactSuccessDesc}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <label htmlFor="name">{t.contactName}</label>
                            <input
                                type="text"
                                id="name"
                                placeholder={t.contactName}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label htmlFor="email">{t.contactEmail}</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label htmlFor="message">{t.contactMessage}</label>
                            <textarea
                                id="message"
                                rows={4}
                                placeholder={t.contactMessage}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">
                            {t.contactSend}
                            <Send size={16} />
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    )
}
