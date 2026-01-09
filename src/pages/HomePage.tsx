import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Newsletter } from '../components/Newsletter'
import { useLang } from '../context/LangContext'

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
                    {/* Main Title */}
                    <h1 className="hero-title">{t.heroTitle}</h1>

                    {/* Bio */}
                    <p className="hero-bio">{t.heroBio}</p>

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
                        <Link to="/about" className="btn-secondary">
                            {lang === 'tr' ? 'Projelerimi Gör' : 'View Projects'}
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            <Newsletter />
        </div>
    )
}

