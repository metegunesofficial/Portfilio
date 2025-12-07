import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLang } from '../context/LangContext'

interface Product {
    title: { en: string; tr: string }
    description: { en: string; tr: string }
    category: { en: string; tr: string }
    price: string
    link: string
}

const products: Product[] = [
    {
        title: { en: 'Lamborghini: Fan Edition', tr: 'Lamborghini: Fan Edisyonu' },
        description: {
            en: 'Built out of pure passion and too much caffeine, my fan-made spin on a raging bull.',
            tr: 'Saf tutku ve aşırı kafeinle yapılmış, çılgın boğaya hayran bakışım.'
        },
        category: { en: 'Fan Book', tr: 'Fan Kitabı' },
        price: 'Free',
        link: '#',
    },
    {
        title: { en: 'CAD Design Templates', tr: 'CAD Tasarım Şablonları' },
        description: {
            en: 'Professional CAD templates for mechanical engineering projects.',
            tr: 'Makine mühendisliği projeleri için profesyonel CAD şablonları.'
        },
        category: { en: 'Templates', tr: 'Şablonlar' },
        price: '$29',
        link: '#',
    },
    {
        title: { en: 'Design Consultation', tr: 'Tasarım Danışmanlığı' },
        description: {
            en: 'One-on-one consultation for your design projects.',
            tr: 'Tasarım projeleriniz için birebir danışmanlık.'
        },
        category: { en: 'Service', tr: 'Hizmet' },
        price: 'Contact',
        link: '#',
    },
]

export function ProductsPage() {
    const { lang, t } = useLang()

    return (
        <div className="page-wrapper">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>{t.productsTitle}</h1>
                <p>{t.productsSubtitle}</p>
            </motion.header>

            <div className="card-grid">
                {products.map((product, index) => (
                    <motion.a
                        key={index}
                        href={product.link}
                        className="content-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -6 }}
                    >
                        <div className="card-image">
                            <span className="card-emoji">🎨</span>
                        </div>
                        <div className="card-body">
                            <span className="card-category">{product.category[lang]}</span>
                            <h3 className="card-title">{product.title[lang]}</h3>
                            <p className="card-excerpt">{product.description[lang]}</p>
                            <div className="card-footer">
                                <span className="card-price">{product.price}</span>
                                <ArrowUpRight size={16} className="card-arrow" />
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    )
}
