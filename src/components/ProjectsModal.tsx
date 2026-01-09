import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ArrowUpRight, Brain, Zap, Globe } from 'lucide-react'
import { useLang } from '../context/LangContext'

type Category = 'all' | 'ai' | 'web' | 'automation'

interface Project {
    id: string
    slug: string
    title: { en: string; tr: string }
    description: { en: string; tr: string }
    category: Category
    categoryLabel: { en: string; tr: string }
    tech: string[]
    problem?: { en: string; tr: string }
    solution?: { en: string; tr: string }
    results?: { en: string; tr: string }
    year?: string
    duration?: { en: string; tr: string }
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
        tech: ['ChatGPT API', 'LangChain', 'Node.js', 'React'],
        problem: {
            en: 'The client was struggling with high customer support volume, with average response times of 24 hours.',
            tr: 'Müşteri yüksek destek hacmi ile mücadele ediyordu, ortalama yanıt süreleri 24 saatti.'
        },
        solution: {
            en: 'I developed a custom ChatGPT-powered chatbot integrated with their e-commerce platform.',
            tr: 'E-ticaret platformlarıyla entegre özel ChatGPT destekli bir chatbot geliştirdim.'
        },
        results: {
            en: '• 40% faster response time\n• 65% of queries handled automatically\n• 28% increase in customer satisfaction',
            tr: '• %40 daha hızlı yanıt süresi\n• Sorguların %65\'i otomatik olarak yanıtlandı\n• Müşteri memnuniyetinde %28 artış'
        },
        year: '2024',
        duration: { en: '3 months', tr: '3 ay' }
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
        tech: ['n8n', 'Zapier', 'Python', 'REST APIs'],
        problem: {
            en: 'The finance team was spending 20+ hours weekly on repetitive data entry and report generation.',
            tr: 'Finans ekibi tekrarlayan veri girişi ve rapor oluşturma için haftada 20+ saat harcıyordu.'
        },
        solution: {
            en: 'I designed a comprehensive automation suite using n8n and custom Python scripts.',
            tr: 'n8n ve özel Python scriptleri kullanarak kapsamlı bir otomasyon paketi tasarladım.'
        },
        results: {
            en: '• 60% reduction in manual tasks\n• 8 hours/week saved per employee\n• Zero data synchronization errors',
            tr: '• Manuel görevlerde %60 azalma\n• Çalışan başına haftada 8 saat tasarruf\n• Sıfır veri senkronizasyon hatası'
        },
        year: '2024',
        duration: { en: '2 months', tr: '2 ay' }
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
        tech: ['React', 'TypeScript', 'Supabase', 'Recharts'],
        problem: {
            en: 'The SaaS startup needed a comprehensive dashboard to track key metrics in real-time.',
            tr: 'SaaS startup, anahtar metrikleri gerçek zamanlı izlemek için kapsamlı bir panele ihtiyaç duyuyordu.'
        },
        solution: {
            en: 'I built a custom React-based dashboard with real-time data synchronization.',
            tr: 'Gerçek zamanlı veri senkronizasyonu ile özel React tabanlı bir panel oluşturdum.'
        },
        results: {
            en: '• Real-time data updates every 30 seconds\n• 15+ custom chart types\n• 95% user satisfaction rate',
            tr: '• Her 30 saniyede gerçek zamanlı veri güncellemesi\n• 15+ özel grafik türü\n• %95 kullanıcı memnuniyet oranı'
        },
        year: '2023',
        duration: { en: '4 months', tr: '4 ay' }
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
        tech: ['GPT-4', 'Next.js', 'Prisma', 'PostgreSQL'],
        year: '2024',
        duration: { en: '3 months', tr: '3 ay' }
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
        tech: ['Next.js', 'Stripe', 'Supabase', 'Tailwind'],
        year: '2023',
        duration: { en: '5 months', tr: '5 ay' }
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
        tech: ['Python', 'OCR', 'REST APIs', 'PostgreSQL'],
        year: '2024',
        duration: { en: '2 months', tr: '2 ay' }
    }
]

interface ProjectsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
    const { lang } = useLang()
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [filter, setFilter] = useState<Category>('all')

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedProject) {
                    setSelectedProject(null)
                } else {
                    onClose()
                }
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen, selectedProject, onClose])

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter)

    const categories = [
        { value: 'all' as Category, label: { en: 'All', tr: 'Tümü' } },
        { value: 'ai' as Category, label: { en: 'AI', tr: 'AI' } },
        { value: 'web' as Category, label: { en: 'Web', tr: 'Web' } },
        { value: 'automation' as Category, label: { en: 'Automation', tr: 'Otomasyon' } },
    ]

    const handleBack = () => {
        setSelectedProject(null)
    }

    const handleClose = () => {
        setSelectedProject(null)
        setFilter('all')
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="modal-container"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="modal-header">
                            {selectedProject ? (
                                <button className="modal-back-btn" onClick={handleBack}>
                                    <ArrowLeft size={20} />
                                    <span>{lang === 'tr' ? 'Geri' : 'Back'}</span>
                                </button>
                            ) : (
                                <h2>{lang === 'tr' ? 'Projelerim' : 'My Projects'}</h2>
                            )}
                            <button className="modal-close-btn" onClick={handleClose}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="modal-content">
                            <AnimatePresence mode="wait">
                                {selectedProject ? (
                                    // Project Detail View
                                    <motion.div
                                        key="detail"
                                        className="modal-detail"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                    >
                                        <span className="modal-detail-category">{selectedProject.categoryLabel[lang]}</span>
                                        <h3>{selectedProject.title[lang]}</h3>
                                        <p className="modal-detail-desc">{selectedProject.description[lang]}</p>

                                        <div className="modal-detail-meta">
                                            {selectedProject.year && (
                                                <div className="meta-item">
                                                    <span className="meta-label">{lang === 'tr' ? 'Yıl' : 'Year'}</span>
                                                    <span className="meta-value">{selectedProject.year}</span>
                                                </div>
                                            )}
                                            {selectedProject.duration && (
                                                <div className="meta-item">
                                                    <span className="meta-label">{lang === 'tr' ? 'Süre' : 'Duration'}</span>
                                                    <span className="meta-value">{selectedProject.duration[lang]}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="modal-detail-tech">
                                            {selectedProject.tech.map((t, i) => (
                                                <span key={i} className="tech-tag">{t}</span>
                                            ))}
                                        </div>

                                        {selectedProject.problem && (
                                            <div className="modal-detail-section">
                                                <h4>🎯 {lang === 'tr' ? 'Problem' : 'The Problem'}</h4>
                                                <p>{selectedProject.problem[lang]}</p>
                                            </div>
                                        )}

                                        {selectedProject.solution && (
                                            <div className="modal-detail-section">
                                                <h4>💡 {lang === 'tr' ? 'Çözüm' : 'The Solution'}</h4>
                                                <p>{selectedProject.solution[lang]}</p>
                                            </div>
                                        )}

                                        {selectedProject.results && (
                                            <div className="modal-detail-section">
                                                <h4>📊 {lang === 'tr' ? 'Sonuçlar' : 'Results'}</h4>
                                                <p className="results-text">{selectedProject.results[lang]}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    // Projects List View
                                    <motion.div
                                        key="list"
                                        className="modal-list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                    >
                                        {/* Filter */}
                                        <div className="modal-filter">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    className={`filter-btn ${filter === cat.value ? 'active' : ''}`}
                                                    onClick={() => setFilter(cat.value)}
                                                >
                                                    {cat.label[lang]}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Projects Grid */}
                                        <div className="modal-projects-grid">
                                            {filteredProjects.map((project) => (
                                                <motion.div
                                                    key={project.id}
                                                    className="modal-project-card"
                                                    whileHover={{ y: -4 }}
                                                    onClick={() => setSelectedProject(project)}
                                                >
                                                    <div className="modal-project-icon">
                                                        {project.category === 'ai' ? <Brain size={28} /> :
                                                            project.category === 'automation' ? <Zap size={28} /> : <Globe size={28} />}
                                                    </div>
                                                    <span className="modal-project-category">{project.categoryLabel[lang]}</span>
                                                    <h4>{project.title[lang]}</h4>
                                                    <p>{project.description[lang]}</p>
                                                    <div className="modal-project-tech">
                                                        {project.tech.slice(0, 3).map((t, i) => (
                                                            <span key={i}>{t}</span>
                                                        ))}
                                                    </div>
                                                    <div className="modal-project-action">
                                                        <span>{lang === 'tr' ? 'Detay' : 'View'}</span>
                                                        <ArrowUpRight size={14} />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
