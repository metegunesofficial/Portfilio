import { Download, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLang } from '../../context/LangContext'

interface CVDownloadProps {
    cvUrl?: string
    className?: string
}

export function CVDownload({ cvUrl = '/cv/mete-gunes-cv.pdf', className = '' }: CVDownloadProps) {
    const { lang } = useLang()

    const handleDownload = () => {
        // Track download event (for analytics)
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'cv_download', {
                event_category: 'engagement',
                event_label: 'CV Download',
            })
        }

        // Create download link
        const link = document.createElement('a')
        link.href = cvUrl
        link.download = `Mete-Gunes-CV-${lang.toUpperCase()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <motion.button
            className={`cv-download-btn ${className}`}
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={lang === 'tr' ? 'CV İndir' : 'Download CV'}
        >
            <FileText size={20} />
            <span>{lang === 'tr' ? 'CV İndir' : 'Download CV'}</span>
            <Download size={16} className="download-icon" />
        </motion.button>
    )
}
