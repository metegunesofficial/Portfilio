import { motion } from 'framer-motion'
import { Newsletter } from '../components/Newsletter'
import { useLang } from '../context/LangContext'

const getDayName = (lang: 'tr' | 'en') => {
    const days = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    }
    return days[lang][new Date().getDay()]
}

export function HomePage() {
    const { lang, t } = useLang()
    const dayName = getDayName(lang)

    return (
        <div className="home-page">
            <section className="hero-section">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="hero-title">{t.heroTitle}</h1>

                    <div className="hero-greeting">
                        <p>{t.heroGreeting1}</p>
                        <p className="hero-day">{dayName}{t.heroGreeting2}</p>
                    </div>

                    <p className="hero-bio">{t.heroBio}</p>
                </motion.div>
            </section>

            <Newsletter />
        </div>
    )
}
