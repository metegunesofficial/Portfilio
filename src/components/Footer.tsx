import { motion } from 'framer-motion'
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { useLang } from '../context/LangContext'

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/schats', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
]

export function Footer() {
    const { t } = useLang()

    return (
        <footer className="footer-section">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2 className="footer-title">{t.footerTitle}</h2>
                <p className="footer-subtitle">{t.footerSubtitle}</p>

                <div className="social-links">
                    {socialLinks.map((social, index) => (
                        <motion.a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            whileHover={{ y: -3 }}
                            aria-label={social.label}
                        >
                            <social.icon size={20} />
                        </motion.a>
                    ))}
                </div>

                <motion.a
                    href="#"
                    className="btn-outline"
                    whileHover={{ scale: 1.02 }}
                >
                    {t.exploreMore}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                </motion.a>
            </motion.div>
        </footer>
    )
}
