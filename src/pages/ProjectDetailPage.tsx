import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../context/LangContext'

interface ProjectDetail {
    id: string
    slug: string
    title: { en: string; tr: string }
    description: { en: string; tr: string }
    problem: { en: string; tr: string }
    solution: { en: string; tr: string }
    results: { en: string; tr: string }
    category: string
    tech: string[]
    year: string
    duration: { en: string; tr: string }
    liveUrl?: string
    githubUrl?: string
}

const projectsData: Record<string, ProjectDetail> = {
    'ai-chatbot-integration': {
        id: '1',
        slug: 'ai-chatbot-integration',
        title: { en: 'AI Chatbot Integration', tr: 'AI Chatbot Entegrasyonu' },
        description: {
            en: 'Custom ChatGPT-powered chatbot for e-commerce customer support with 40% faster response time.',
            tr: 'E-ticaret müşteri desteği için ChatGPT destekli özel chatbot, %40 daha hızlı yanıt süresi.'
        },
        problem: {
            en: 'The client was struggling with high customer support volume, with average response times of 24 hours and customer satisfaction dropping.',
            tr: 'Müşteri yüksek destek hacmi ile mücadele ediyordu, ortalama yanıt süreleri 24 saat ve müşteri memnuniyeti düşüyordu.'
        },
        solution: {
            en: 'I developed a custom ChatGPT-powered chatbot integrated with their e-commerce platform. The bot handles common queries, provides product recommendations, and seamlessly escalates complex issues to human agents.',
            tr: 'E-ticaret platformlarıyla entegre özel ChatGPT destekli bir chatbot geliştirdim. Bot yaygın soruları yanıtlıyor, ürün önerileri sunuyor ve karmaşık sorunları sorunsuz bir şekilde insan temsilcilere yönlendiriyor.'
        },
        results: {
            en: '• 40% faster response time\n• 65% of queries handled automatically\n• 28% increase in customer satisfaction\n• $15,000/month saved on support costs',
            tr: '• %40 daha hızlı yanıt süresi\n• Sorguların %65\'i otomatik olarak yanıtlandı\n• Müşteri memnuniyetinde %28 artış\n• Destek maliyetlerinde aylık $15,000 tasarruf'
        },
        category: 'AI Integration',
        tech: ['ChatGPT API', 'LangChain', 'Node.js', 'React', 'PostgreSQL'],
        year: '2024',
        duration: { en: '3 months', tr: '3 ay' }
    },
    'workflow-automation-suite': {
        id: '2',
        slug: 'workflow-automation-suite',
        title: { en: 'Workflow Automation Suite', tr: 'İş Akışı Otomasyon Paketi' },
        description: {
            en: 'End-to-end automation solution reducing manual tasks by 60% for a finance company.',
            tr: 'Bir finans şirketi için manuel görevleri %60 azaltan uçtan uca otomasyon çözümü.'
        },
        problem: {
            en: 'The finance team was spending 20+ hours weekly on repetitive data entry, report generation, and cross-platform data synchronization.',
            tr: 'Finans ekibi tekrarlayan veri girişi, rapor oluşturma ve platformlar arası veri senkronizasyonu için haftada 20+ saat harcıyordu.'
        },
        solution: {
            en: 'I designed and implemented a comprehensive automation suite using n8n and custom Python scripts that automatically syncs data, generates reports, and triggers notifications.',
            tr: 'n8n ve özel Python scriptleri kullanarak verileri otomatik olarak senkronize eden, raporlar oluşturan ve bildirimler tetikleyen kapsamlı bir otomasyon paketi tasarlayıp uyguladım.'
        },
        results: {
            en: '• 60% reduction in manual tasks\n• 8 hours/week saved per employee\n• Zero data synchronization errors\n• ROI achieved in 2 months',
            tr: '• Manuel görevlerde %60 azalma\n• Çalışan başına haftada 8 saat tasarruf\n• Sıfır veri senkronizasyon hatası\n• 2 ayda ROI elde edildi'
        },
        category: 'Automation',
        tech: ['n8n', 'Python', 'REST APIs', 'PostgreSQL', 'Slack Integration'],
        year: '2024',
        duration: { en: '2 months', tr: '2 ay' }
    },
    'saas-dashboard': {
        id: '3',
        slug: 'saas-dashboard',
        title: { en: 'SaaS Analytics Dashboard', tr: 'SaaS Analiz Paneli' },
        description: {
            en: 'Real-time analytics dashboard with interactive charts and data visualization.',
            tr: 'Etkileşimli grafikler ve veri görselleştirme ile gerçek zamanlı analiz paneli.'
        },
        problem: {
            en: 'The SaaS startup needed a comprehensive dashboard to track key metrics, user behavior, and revenue analytics in real-time.',
            tr: 'SaaS startup\'ı, anahtar metrikleri, kullanıcı davranışını ve gelir analizini gerçek zamanlı olarak izlemek için kapsamlı bir panele ihtiyaç duyuyordu.'
        },
        solution: {
            en: 'I built a custom React-based dashboard with real-time data synchronization, interactive charts using Recharts, and a clean, intuitive UI.',
            tr: 'Gerçek zamanlı veri senkronizasyonu, Recharts kullanarak etkileşimli grafikler ve temiz, sezgisel bir UI ile özel React tabanlı bir panel oluşturdum.'
        },
        results: {
            en: '• Real-time data updates every 30 seconds\n• 15+ custom chart types\n• Mobile-responsive design\n• 95% user satisfaction rate',
            tr: '• Her 30 saniyede gerçek zamanlı veri güncellemesi\n• 15+ özel grafik türü\n• Mobil uyumlu tasarım\n• %95 kullanıcı memnuniyet oranı'
        },
        category: 'Web App',
        tech: ['React', 'TypeScript', 'Supabase', 'Recharts', 'Tailwind CSS'],
        year: '2023',
        duration: { en: '4 months', tr: '4 ay' }
    }
}

const projectOrder = ['ai-chatbot-integration', 'workflow-automation-suite', 'saas-dashboard', 'ai-content-generator', 'ecommerce-platform', 'invoice-automation']

export function ProjectDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const { lang } = useLang()

    const project = slug ? projectsData[slug] : null

    if (!project) {
        return (
            <div className="page-wrapper project-not-found">
                <h1>{lang === 'tr' ? 'Proje Bulunamadı' : 'Project Not Found'}</h1>
                <Link to="/projects" className="btn-primary">
                    <ArrowLeft size={18} />
                    {lang === 'tr' ? 'Projelere Dön' : 'Back to Projects'}
                </Link>
            </div>
        )
    }

    const currentIndex = projectOrder.indexOf(slug || '')
    const prevProject = currentIndex > 0 ? projectOrder[currentIndex - 1] : null
    const nextProject = currentIndex < projectOrder.length - 1 ? projectOrder[currentIndex + 1] : null

    return (
        <div className="page-wrapper project-detail-page">
            {/* Back Button */}
            <motion.div
                className="project-back"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Link to="/projects" className="back-link">
                    <ArrowLeft size={18} />
                    {lang === 'tr' ? 'Tüm Projeler' : 'All Projects'}
                </Link>
            </motion.div>

            {/* Header */}
            <motion.header
                className="project-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="project-category">{project.category}</span>
                <h1>{project.title[lang]}</h1>
                <p className="project-intro">{project.description[lang]}</p>

                <div className="project-meta">
                    <div className="meta-item">
                        <span className="meta-label">{lang === 'tr' ? 'Yıl' : 'Year'}</span>
                        <span className="meta-value">{project.year}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">{lang === 'tr' ? 'Süre' : 'Duration'}</span>
                        <span className="meta-value">{project.duration[lang]}</span>
                    </div>
                </div>

                <div className="project-tech">
                    {project.tech.map((t, i) => (
                        <span key={i} className="tech-tag">{t}</span>
                    ))}
                </div>
            </motion.header>

            {/* Case Study Content - Card Format */}
            <motion.div
                className="case-study-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="case-card">
                    <div className="case-card-icon">🎯</div>
                    <span className="case-card-label">{lang === 'tr' ? 'PROBLEM' : 'THE PROBLEM'}</span>
                    <h3 className="case-card-title">{lang === 'tr' ? 'Problem' : 'Problem'}</h3>
                    <p className="case-card-text">{project.problem[lang]}</p>
                </div>

                <div className="case-card">
                    <div className="case-card-icon">💡</div>
                    <span className="case-card-label">{lang === 'tr' ? 'ÇÖZÜM' : 'THE SOLUTION'}</span>
                    <h3 className="case-card-title">{lang === 'tr' ? 'Çözüm' : 'Solution'}</h3>
                    <p className="case-card-text">{project.solution[lang]}</p>
                </div>

                <div className="case-card">
                    <div className="case-card-icon">📊</div>
                    <span className="case-card-label">{lang === 'tr' ? 'SONUÇLAR' : 'RESULTS'}</span>
                    <h3 className="case-card-title">{lang === 'tr' ? 'Sonuçlar' : 'Results'}</h3>
                    <p className="case-card-text results-text">{project.results[lang]}</p>
                </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
                className="project-nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {prevProject ? (
                    <Link to={`/projects/${prevProject}`} className="nav-prev">
                        <ChevronLeft size={20} />
                        <span>{lang === 'tr' ? 'Önceki Proje' : 'Previous'}</span>
                    </Link>
                ) : <div />}

                {nextProject && (
                    <Link to={`/projects/${nextProject}`} className="nav-next">
                        <span>{lang === 'tr' ? 'Sonraki Proje' : 'Next'}</span>
                        <ChevronRight size={20} />
                    </Link>
                )}
            </motion.div>
        </div>
    )
}
