import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLang } from '../context/LangContext'

interface BlogPost {
    title: { en: string; tr: string }
    excerpt: { en: string; tr: string }
    date: string
    category: string
    link: string
}

const blogPosts: BlogPost[] = [
    {
        title: { en: 'Honda Civic Modification', tr: 'Honda Civic Modifikasyonu' },
        excerpt: {
            en: 'From budget find to weekend cruiser- modified my 2008 Honda Civic into an eye turner.',
            tr: 'Bütçe buluntusundan hafta sonu gezginine - 2008 Honda Civic\'imi göz alıcı hale getirdim.'
        },
        date: 'Mar, 2021',
        category: 'HONDA',
        link: '#',
    },
    {
        title: { en: 'South India Elite Brand Awards', tr: 'Güney Hindistan Elit Marka Ödülleri' },
        excerpt: {
            en: 'Truly grateful and excited to receive the Best-in-Class Leadership in Global Skill Development award.',
            tr: 'Global Beceri Geliştirmede Sınıfının En İyisi Liderlik ödülünü almaktan gurur duyuyorum.'
        },
        date: 'Apr, 2023',
        category: 'AWARD',
        link: '#',
    },
    {
        title: { en: 'My Journey in Design', tr: 'Tasarımdaki Yolculuğum' },
        excerpt: {
            en: 'How I went from doodling to becoming a CAD wizard with 5+ years of experience.',
            tr: 'Nasıl karalamaktan 5+ yıllık deneyimle CAD sihirbazı haline geldim.'
        },
        date: 'Jan, 2024',
        category: 'PERSONAL',
        link: '#',
    },
]

export function BlogsPage() {
    const { lang, t } = useLang()

    return (
        <div className="page-wrapper">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>{t.blogsTitle}</h1>
                <p>{t.blogsSubtitle}</p>
            </motion.header>

            <div className="card-grid">
                {blogPosts.map((post, index) => (
                    <motion.a
                        key={index}
                        href={post.link}
                        className="content-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -6 }}
                    >
                        <div className="card-image">
                            <span className="card-emoji">📝</span>
                        </div>
                        <div className="card-body">
                            <span className="card-category">{post.category}</span>
                            <h3 className="card-title">{post.title[lang]}</h3>
                            <p className="card-excerpt">{post.excerpt[lang]}</p>
                            <div className="card-footer">
                                <span className="card-date">{post.date}</span>
                                <ArrowUpRight size={16} className="card-arrow" />
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    )
}
