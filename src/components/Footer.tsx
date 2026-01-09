import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/metegunes', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/metegunes', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/metegunes', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@metegunes.dev', label: 'Email' },
]

export function Footer() {
    const { t, lang } = useLang()

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

                <div className="footer-links">
                    <Link to="/privacy-policy" className="footer-legal-link">
                        {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                    </Link>
                </div>

                <p className="footer-copyright">
                    © {new Date().getFullYear()} Mete Güneş. {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
                </p>
            </motion.div>
        </footer>
    )
}

