import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { useLang } from '../context/LangContext'

export function NotFoundPage() {
    const { lang } = useLang()

    return (
        <div className="not-found-page">
            <motion.div
                className="not-found-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* 404 Illustration */}
                <div className="not-found-illustration">
                    <span className="not-found-number">404</span>
                </div>

                {/* Title */}
                <h1>
                    {lang === 'tr' ? 'Sayfa Bulunamadı' : 'Page Not Found'}
                </h1>

                {/* Description */}
                <p>
                    {lang === 'tr'
                        ? 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.'
                        : 'The page you are looking for doesn\'t exist or has been moved.'
                    }
                </p>

                {/* CTA Buttons */}
                <div className="not-found-actions">
                    <Link to="/" className="btn-primary">
                        <Home size={18} />
                        {lang === 'tr' ? 'Ana Sayfaya Dön' : 'Go to Home'}
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary"
                    >
                        <ArrowLeft size={18} />
                        {lang === 'tr' ? 'Geri Git' : 'Go Back'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
