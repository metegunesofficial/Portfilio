import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { SkeletonCard } from '../components/ui/Skeleton'

type Category = 'all' | 'ai' | 'web' | 'automation' | 'mobile'

interface Project {
    id: string
    slug: string
    title: { en: string; tr: string }
    description: { en: string; tr: string }
    category: Category
    categoryLabel: { en: string; tr: string }
    tech: string[]
    link?: string
    image?: string
}

const projects: Project[] = [
    {
        id: '1',
        slug: 'ai-chatbot-integration',
        title: { en: 'AI Chatbot Integration', tr: 'AI Chatbot Entegrasyonu' },
        description: {
            en: 'Custom ChatGPT-powered chatbot for e-commerce customer support with 40% faster response time.',
            tr: 'E-ticaret müşteri desteği için ChatGPT destekli özel chatbot, %40 daha hızlı yanıt süresi.'
        },
        category: 'ai',
        categoryLabel: { en: 'AI Integration', tr: 'AI Entegrasyonu' },
        tech: ['ChatGPT API', 'LangChain', 'Node.js', 'React']
    },
    {
        id: '2',
        slug: 'workflow-automation-suite',
        title: { en: 'Workflow Automation Suite', tr: 'İş Akışı Otomasyon Paketi' },
        description: {
            en: 'End-to-end automation solution reducing manual tasks by 60% for a finance company.',
            tr: 'Bir finans şirketi için manuel görevleri %60 azaltan uçtan uca otomasyon çözümü.'
        },
        category: 'automation',
        categoryLabel: { en: 'Automation', tr: 'Otomasyon' },
        tech: ['n8n', 'Zapier', 'Python', 'REST APIs']
    },
    {
        id: '3',
        slug: 'saas-dashboard',
        title: { en: 'SaaS Analytics Dashboard', tr: 'SaaS Analiz Paneli' },
        description: {
            en: 'Real-time analytics dashboard with interactive charts and data visualization.',
            tr: 'Etkileşimli grafikler ve veri görselleştirme ile gerçek zamanlı analiz paneli.'
        },
        category: 'web',
        categoryLabel: { en: 'Web App', tr: 'Web Uygulama' },
        tech: ['React', 'TypeScript', 'Supabase', 'Recharts']
    },
    {
        id: '4',
        slug: 'ai-content-generator',
        title: { en: 'AI Content Generator', tr: 'AI İçerik Üretici' },
        description: {
            en: 'Multi-language content generation tool using GPT-4 with brand voice customization.',
            tr: 'Marka sesi özelleştirmeli GPT-4 kullanan çok dilli içerik üretim aracı.'
        },
        category: 'ai',
        categoryLabel: { en: 'AI Tool', tr: 'AI Araç' },
        tech: ['GPT-4', 'Next.js', 'Prisma', 'PostgreSQL']
    },
    {
        id: '5',
        slug: 'ecommerce-platform',
        title: { en: 'E-commerce Platform', tr: 'E-ticaret Platformu' },
        description: {
            en: 'Full-featured e-commerce solution with payment integration and inventory management.',
            tr: 'Ödeme entegrasyonu ve envanter yönetimi ile tam özellikli e-ticaret çözümü.'
        },
        category: 'web',
        categoryLabel: { en: 'E-commerce', tr: 'E-ticaret' },
        tech: ['Next.js', 'Stripe', 'Supabase', 'Tailwind']
    },
    {
        id: '6',
        slug: 'invoice-automation',
        title: { en: 'Invoice Automation System', tr: 'Fatura Otomasyon Sistemi' },
        description: {
            en: 'Automated invoice processing with OCR and accounting software integration.',
            tr: 'OCR ve muhasebe yazılımı entegrasyonu ile otomatik fatura işleme.'
        },
        category: 'automation',
        categoryLabel: { en: 'Business Automation', tr: 'İş Otomasyonu' },
        tech: ['Python', 'OCR', 'REST APIs', 'PostgreSQL']
    }
]

const categories: { value: Category; label: { en: string; tr: string } }[] = [
    { value: 'all', label: { en: 'All Projects', tr: 'Tüm Projeler' } },
    { value: 'ai', label: { en: 'AI & ML', tr: 'AI & ML' } },
    { value: 'web', label: { en: 'Web Apps', tr: 'Web Uygulamaları' } },
    { value: 'automation', label: { en: 'Automation', tr: 'Otomasyon' } },
]

export function ProductsPage() {
    const { lang } = useLang()
    const [filter, setFilter] = useState<Category>('all')
    const [isLoading, setIsLoading] = useState(false)

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter)

    const handleFilterChange = (newFilter: Category) => {
        setIsLoading(true)
        setFilter(newFilter)
        // Simulate loading for smooth transition
        setTimeout(() => setIsLoading(false), 300)
    }

    return (
        <div className="page-wrapper">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>{lang === 'tr' ? 'Projeler' : 'Projects'}</h1>
                <p>{lang === 'tr'
                    ? 'AI entegrasyonu, otomasyon ve web geliştirme projelerim'
                    : 'My AI integration, automation, and web development projects'
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
                        onClick={() => handleFilterChange(cat.value)}
                    >
                        {cat.label[lang]}
                    </button>
                ))}
            </motion.div>

            {/* Projects Grid */}
            <div className="card-grid">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        // Skeleton loading
                        <>
                            {[1, 2, 3].map((i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </>
                    ) : (
                        filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="content-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -6 }}
                            >
                                <Link to={`/projects/${project.slug}`} className="card-link">
                                    <div className="card-image">
                                        <span className="card-emoji">
                                            {project.category === 'ai' ? '🤖' :
                                                project.category === 'automation' ? '⚡' : '💻'}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <span className="card-category">{project.categoryLabel[lang]}</span>
                                        <h3 className="card-title">{project.title[lang]}</h3>
                                        <p className="card-excerpt">{project.description[lang]}</p>
                                        <div className="card-tech">
                                            {project.tech.slice(0, 3).map((t, i) => (
                                                <span key={i} className="tech-tag">{t}</span>
                                            ))}
                                        </div>
                                        <div className="card-footer">
                                            <span className="card-action">
                                                {lang === 'tr' ? 'Detay' : 'View'}
                                            </span>
                                            <ArrowUpRight size={16} className="card-arrow" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
