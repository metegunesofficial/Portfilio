import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

type BlogCategory = 'all' | 'ai' | 'tech' | 'career'

interface BlogPost {
    id: string
    slug: string
    title: { en: string; tr: string }
    excerpt: { en: string; tr: string }
    date: string
    category: BlogCategory
    categoryLabel: { en: string; tr: string }
    readTime: number
    emoji: string
}

const blogPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'ai-automation-business-guide',
        title: {
            en: 'AI Automation for Business: A Complete Guide',
            tr: 'İşletmeler için AI Otomasyonu: Kapsamlı Rehber'
        },
        excerpt: {
            en: 'Learn how to leverage AI automation to streamline your business processes and boost productivity by 40%.',
            tr: 'AI otomasyonunu iş süreçlerinizi düzene sokmak ve verimliliği %40 artırmak için nasıl kullanacağınızı öğrenin.'
        },
        date: '2024-01-05',
        category: 'ai',
        categoryLabel: { en: 'AI & Automation', tr: 'AI & Otomasyon' },
        readTime: 8,
        emoji: '🤖'
    },
    {
        id: '2',
        slug: 'chatgpt-api-integration-tutorial',
        title: {
            en: 'ChatGPT API Integration: Step-by-Step Tutorial',
            tr: 'ChatGPT API Entegrasyonu: Adım Adım Rehber'
        },
        excerpt: {
            en: 'A practical guide to integrating ChatGPT API into your applications with real-world examples.',
            tr: 'Gerçek dünya örnekleriyle uygulamalarınıza ChatGPT API entegrasyonu için pratik rehber.'
        },
        date: '2024-01-02',
        category: 'tech',
        categoryLabel: { en: 'Technology', tr: 'Teknoloji' },
        readTime: 12,
        emoji: '💬'
    },
    {
        id: '3',
        slug: 'freelance-developer-journey',
        title: {
            en: 'My Journey as a Freelance Developer',
            tr: 'Freelance Geliştirici Olarak Yolculuğum'
        },
        excerpt: {
            en: 'From corporate job to freelancing: lessons learned, challenges faced, and tips for aspiring freelancers.',
            tr: 'Kurumsal işten freelance\'a: öğrenilen dersler, karşılaşılan zorluklar ve freelance olmak isteyenler için ipuçları.'
        },
        date: '2023-12-20',
        category: 'career',
        categoryLabel: { en: 'Career', tr: 'Kariyer' },
        readTime: 6,
        emoji: '🚀'
    },
    {
        id: '4',
        slug: 'react-typescript-best-practices',
        title: {
            en: 'React + TypeScript Best Practices in 2024',
            tr: '2024\'te React + TypeScript En İyi Uygulamaları'
        },
        excerpt: {
            en: 'Essential patterns and practices for building maintainable React applications with TypeScript.',
            tr: 'TypeScript ile sürdürülebilir React uygulamaları oluşturmak için temel kalıplar ve uygulamalar.'
        },
        date: '2023-12-15',
        category: 'tech',
        categoryLabel: { en: 'Technology', tr: 'Teknoloji' },
        readTime: 10,
        emoji: '⚛️'
    }
]

const categories: { value: BlogCategory; label: { en: string; tr: string } }[] = [
    { value: 'all', label: { en: 'All Posts', tr: 'Tüm Yazılar' } },
    { value: 'ai', label: { en: 'AI & Automation', tr: 'AI & Otomasyon' } },
    { value: 'tech', label: { en: 'Technology', tr: 'Teknoloji' } },
    { value: 'career', label: { en: 'Career', tr: 'Kariyer' } },
]

export function BlogsPage() {
    const { lang } = useLang()
    const [filter, setFilter] = useState<BlogCategory>('all')

    const filteredPosts = filter === 'all'
        ? blogPosts
        : blogPosts.filter(p => p.category === filter)

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="page-wrapper">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>{lang === 'tr' ? 'Blog' : 'Blog'}</h1>
                <p>{lang === 'tr'
                    ? 'AI, teknoloji ve kariyer hakkında yazılar'
                    : 'Articles about AI, technology, and career'
                }</p>
            </motion.header>

            {/* Filter Buttons */}
            <motion.div
                className="filter-buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Filter size={18} className="filter-icon" />
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        className={`filter-btn ${filter === cat.value ? 'active' : ''}`}
                        onClick={() => setFilter(cat.value)}
                    >
                        {cat.label[lang]}
                    </button>
                ))}
            </motion.div>

            <div className="card-grid">
                {filteredPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        className="content-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -6 }}
                    >
                        <Link to={`/blogs/${post.slug}`} className="card-link">
                            <div className="card-image">
                                <span className="card-emoji">{post.emoji}</span>
                            </div>
                            <div className="card-body">
                                <span className="card-category">{post.categoryLabel[lang]}</span>
                                <h3 className="card-title">{post.title[lang]}</h3>
                                <p className="card-excerpt">{post.excerpt[lang]}</p>
                                <div className="card-footer">
                                    <div className="card-meta">
                                        <span className="card-date">
                                            <Calendar size={14} />
                                            {formatDate(post.date)}
                                        </span>
                                        <span className="card-read-time">
                                            <Clock size={14} />
                                            {post.readTime} {lang === 'tr' ? 'dk' : 'min'}
                                        </span>
                                    </div>
                                    <ArrowUpRight size={16} className="card-arrow" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
