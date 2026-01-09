import { motion } from 'framer-motion'
import { ContactForm } from '../components/ContactForm'
import { useLang } from '../context/LangContext'

export function ContactPage() {
    const { t } = useLang()

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
                <ContactForm />
            </motion.div>
        </div>
    )
}
