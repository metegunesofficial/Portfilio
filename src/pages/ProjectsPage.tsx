import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { SkeletonCard } from '../components/ui/Skeleton'
import { getSupabaseClient } from '../lib/supabase-client'



interface Project {
    id: string
    slug: string
    title_tr: string
    title_en: string
    description_tr: string | null
    description_en: string | null
    category: string | null
    tech: string[]
    link?: string | null
    image_url?: string | null
    featured: boolean
    published: boolean
}

// Fallback data
const fallbackProjects: Project[] = [
    {
        id: '1',
        slug: 'ai-chatbot-integration',
        title_tr: 'AI Chatbot Entegrasyonu',
        title_en: 'AI Chatbot Integration',
        description_tr: 'E-ticaret müşteri desteği için ChatGPT destekli özel chatbot.',
        description_en: 'Custom ChatGPT-powered chatbot for e-commerce customer support.',
        category: 'AI',
        tech: ['ChatGPT API', 'LangChain', 'Node.js', 'React'],
        featured: true,
        published: true
    },
    {
        id: '2',
        slug: 'workflow-automation-suite',
        title_tr: 'İş Akışı Otomasyon Paketi',
        title_en: 'Workflow Automation Suite',
        description_tr: 'Manuel görevleri %60 azaltan uçtan uca otomasyon çözümü.',
        description_en: 'End-to-end automation solution reducing manual tasks by 60%.',
        category: 'Automation',
        tech: ['n8n', 'Zapier', 'Python', 'REST APIs'],
        featured: true,
        published: true
    },
    {
        id: '3',
        slug: 'saas-dashboard',
        title_tr: 'SaaS Analiz Paneli',
        title_en: 'SaaS Analytics Dashboard',
        description_tr: 'Etkileşimli grafikler ve veri görselleştirme ile gerçek zamanlı analiz paneli.',
        description_en: 'Real-time analytics dashboard with interactive charts and data visualization.',
        category: 'Web',
        tech: ['React', 'TypeScript', 'Supabase', 'Recharts'],
        featured: false,
        published: true
    }
]

const categories = [
    { value: 'all', label: { en: 'All Projects', tr: 'Tüm Projeler' } },
    { value: 'AI', label: { en: 'AI & ML', tr: 'AI & ML' } },
    { value: 'Web', label: { en: 'Web Apps', tr: 'Web Uygulamaları' } },
    { value: 'Automation', label: { en: 'Automation', tr: 'Otomasyon' } },
]

export function ProjectsPage() {
    const { lang } = useLang()
    const [filter, setFilter] = useState<string>('all')
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const supabase = getSupabaseClient()
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('published', true)
                .order('order_index', { ascending: true })

            if (error) throw error
            setProjects(data && data.length > 0 ? data : fallbackProjects)
        } catch (err) {
            console.error('Error fetching projects:', err)
            setProjects(fallbackProjects)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category?.toLowerCase() === filter.toLowerCase())

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter)
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
                    ? 'Geliştirdiğim projeler ve çalışmalarım'
                    : 'Projects and case studies'
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

            {isLoading ? (
                <div className="project-grid">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <motion.div className="project-grid" layout>
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="project-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                            >
                                <Link to={`/projects/${project.slug}`} className="project-link">
                                    <div className="project-image">
                                        {project.image_url ? (
                                            <img src={project.image_url} alt={lang === 'tr' ? project.title_tr : project.title_en} />
                                        ) : (
                                            <div className="project-placeholder">
                                                <span>🚀</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="project-content">
                                        <span className="project-category">{project.category}</span>
                                        <h3 className="project-title">
                                            {lang === 'tr' ? project.title_tr : project.title_en}
                                        </h3>
                                        <p className="project-description">
                                            {lang === 'tr' ? project.description_tr : project.description_en}
                                        </p>
                                        <div className="project-tech">
                                            {project.tech?.slice(0, 4).map((tech, i) => (
                                                <span key={i} className="tech-badge">{tech}</span>
                                            ))}
                                        </div>
                                        <div className="project-footer">
                                            <span className="view-project">
                                                {lang === 'tr' ? 'Detayları Gör' : 'View Details'}
                                                <ArrowUpRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}
