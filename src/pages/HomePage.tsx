import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import { Newsletter } from '../components/Newsletter'
import { Testimonials } from '../components/Testimonials'
import { useLang } from '../context/LangContext'

const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/metegunes', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/metegunes', label: 'GitHub' },
    { icon: Mail, href: 'mailto:contact@metegunes.dev', label: 'Email' },
]

const skills = ['AI Integration', 'Automation', 'React', 'TypeScript', 'Node.js', 'Supabase']

export function HomePage() {
    const { t, lang } = useLang()

    return (
        <div className="home-page">
            <section className="hero-section">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Greeting Badge */}
                    <motion.span
                        className="hero-badge"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {lang === 'tr' ? '👋 Hoş geldiniz' : '👋 Welcome'}
                    </motion.span>

                    {/* Main Title */}
                    <h1 className="hero-title">{t.heroTitle}</h1>

                    {/* Bio */}
                    <p className="hero-bio">{t.heroBio}</p>

                    {/* Skills Tags - AI Search optimized */}
                    <motion.div
                        className="hero-skills"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {skills.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        className="hero-cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Link to="/contact" className="btn-primary">
                            {lang === 'tr' ? 'İletişime Geç' : 'Get in Touch'}
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/products-listing" className="btn-secondary">
                            {lang === 'tr' ? 'Projelerimi Gör' : 'View Projects'}
                        </Link>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        className="hero-socials"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hero-social-link"
                                aria-label={social.label}
                            >
                                <social.icon size={20} />
                            </a>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            <Testimonials />
            <Newsletter />
        </div>
    )
}

