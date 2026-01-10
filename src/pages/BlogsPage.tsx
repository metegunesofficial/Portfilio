import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { getSupabaseClient } from '../lib/supabase-client'



interface BlogPost {
    id: string
    slug: string
    title_tr: string
    title_en: string
    excerpt_tr: string | null
    excerpt_en: string | null
    category: string | null
    emoji: string
    published: boolean
    created_at: string
}

// Fallback data for when database is empty
const fallbackPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'ai-automation-business-guide',
        title_tr: 'İşletmeler için AI Otomasyonu: Kapsamlı Rehber',
        title_en: 'AI Automation for Business: A Complete Guide',
        excerpt_tr: 'AI otomasyonunu iş süreçlerinizi düzene sokmak için nasıl kullanacağınızı öğrenin.',
        excerpt_en: 'Learn how to leverage AI automation to streamline your business processes.',
        category: 'AI',
        emoji: '🤖',
        published: true,
        created_at: '2024-01-05'
    },
    {
        id: '2',
        slug: 'chatgpt-api-integration-tutorial',
        title_tr: 'ChatGPT API Entegrasyonu: Adım Adım Rehber',
        title_en: 'ChatGPT API Integration: Step-by-Step Tutorial',
        excerpt_tr: 'Gerçek dünya örnekleriyle uygulamalarınıza ChatGPT API entegrasyonu için pratik rehber.',
        excerpt_en: 'A practical guide to integrating ChatGPT API into your applications.',
        category: 'Web',
        emoji: '💬',
        published: true,
        created_at: '2024-01-02'
    }
]

const categories = [
    { value: 'all', label: { en: 'All Posts', tr: 'Tüm Yazılar' } },
    { value: 'AI', label: { en: 'AI & Automation', tr: 'AI & Otomasyon' } },
    { value: 'Web', label: { en: 'Web', tr: 'Web' } },
    { value: 'Genel', label: { en: 'General', tr: 'Genel' } },
]

export function BlogsPage() {
    const { lang } = useLang()
    const [filter, setFilter] = useState<string>('all')
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        try {
            const supabase = getSupabaseClient()
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data && data.length > 0 ? data : fallbackPosts)
        } catch (err) {
            console.error('Error fetching blogs:', err)
            setPosts(fallbackPosts)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredPosts = filter === 'all'
        ? posts
        : posts.filter(p => p.category?.toLowerCase() === filter.toLowerCase())

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getReadTime = (content: string) => {
        const words = content?.split(' ').length || 0
        return Math.max(1, Math.ceil(words / 200))
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

            {isLoading ? (
                <div className="loading-state">Yükleniyor...</div>
            ) : (
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
                                    <span className="card-category">{post.category}</span>
                                    <h3 className="card-title">
                                        {lang === 'tr' ? post.title_tr : post.title_en}
                                    </h3>
                                    <p className="card-excerpt">
                                        {lang === 'tr' ? post.excerpt_tr : post.excerpt_en}
                                    </p>
                                    <div className="card-footer">
                                        <div className="card-meta">
                                            <span className="card-date">
                                                <Calendar size={14} />
                                                {formatDate(post.created_at)}
                                            </span>
                                            <span className="card-read-time">
                                                <Clock size={14} />
                                                {getReadTime((lang === 'tr' ? post.excerpt_tr : post.excerpt_en) || '')} {lang === 'tr' ? 'dk' : 'min'}
                                            </span>
                                        </div>
                                        <ArrowUpRight size={16} className="card-arrow" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
