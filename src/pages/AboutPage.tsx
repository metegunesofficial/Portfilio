import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Code, ArrowRight } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { ProjectsModal } from '../components/ProjectsModal'

// Skills data - AI Search optimized with specific technologies
const skillCategories = [
    {
        title: { en: 'AI & Automation', tr: 'AI & Otomasyon' },
        skills: ['ChatGPT API', 'LangChain', 'Workflow Automation', 'RPA', 'AI Integration']
    },
    {
        title: { en: 'Frontend', tr: 'Frontend' },
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion']
    },
    {
        title: { en: 'Backend', tr: 'Backend' },
        skills: ['Node.js', 'Express', 'Supabase', 'PostgreSQL', 'REST APIs']
    },
    {
        title: { en: 'Tools & DevOps', tr: 'Araçlar & DevOps' },
        skills: ['Git', 'Docker', 'Vercel', 'Figma', 'VS Code']
    }
]

// Featured Projects
const featuredProjects = [
    {
        title: { en: 'AI Workflow Automation', tr: 'AI İş Akışı Otomasyonu' },
        description: {
            en: 'Automated business processes using AI, reducing manual work by 60%.',
            tr: 'AI kullanarak iş süreçlerini otomatikleştirdim, manuel işleri %60 azalttım.'
        },
        tags: ['AI', 'Automation', 'Python']
    },
    {
        title: { en: 'E-Commerce Platform', tr: 'E-Ticaret Platformu' },
        description: {
            en: 'Full-stack e-commerce solution with modern tech stack.',
            tr: 'Modern teknoloji yığını ile tam kapsamlı e-ticaret çözümü.'
        },
        tags: ['React', 'Node.js', 'PostgreSQL']
    },
    {
        title: { en: 'Process Optimization Tool', tr: 'Süreç Optimizasyon Aracı' },
        description: {
            en: 'Custom dashboard for tracking and optimizing business workflows.',
            tr: 'İş akışlarını izlemek ve optimize etmek için özel dashboard.'
        },
        tags: ['Dashboard', 'Analytics', 'Automation']
    }
]

export function AboutPage() {
    const { lang } = useLang()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="page-wrapper about-page">
            {/* Header */}
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>{lang === 'tr' ? 'Hakkımda' : 'About Me'}</h1>
                <p>
                    {lang === 'tr'
                        ? 'AI ve otomasyon alanında 2+ yıllık deneyimle işletmelere dijital dönüşüm çözümleri sunuyorum.'
                        : 'Delivering digital transformation solutions to businesses with 2+ years of experience in AI and automation.'
                    }
                </p>
            </motion.header>

            {/* Bio Section */}
            <motion.section
                className="about-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="section-title">
                    <Briefcase size={20} />
                    {lang === 'tr' ? 'Kim Ben?' : 'Who Am I?'}
                </h2>
                <div className="bio-content">
                    <p>
                        {lang === 'tr'
                            ? `2+ yıllık deneyime sahip bir AI, Otomasyon ve Süreç Geliştirme Uzmanıyım. Karmaşık iş süreçlerini profesyonel dijital çözümlere dönüştürüyorum.`
                            : `I'm an AI, Automation and Process Development Specialist with 2+ years of experience. I transform complex business processes into professional digital solutions.`
                        }
                    </p>
                    <p>
                        {lang === 'tr'
                            ? 'AI entegrasyonu, iş akışı otomasyonu ve kurumsal süreç geliştirme konularında uzmanım. Hızlı MVP prototiplerinden kurumsal ölçekli sistemlere kadar, işletmelerin son teknolojiyi kullanarak verimliliği artırmasına ve büyümesine yardımcı oluyorum.'
                            : 'I specialize in AI integration, workflow automation, and enterprise process development. From rapid MVP prototypes to enterprise-scale systems, I help businesses increase efficiency and grow using cutting-edge technology.'
                        }
                    </p>
                </div>
            </motion.section>

            {/* Skills Section - Simplified */}
            <motion.section
                className="about-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="section-title">
                    <Code size={20} />
                    {lang === 'tr' ? 'Uzmanlık Alanları' : 'Expertise'}
                </h2>
                <div className="skills-simple">
                    {skillCategories.map((category, index) => (
                        <motion.span
                            key={index}
                            className="skill-item"
                            variants={itemVariants}
                        >
                            {category.title[lang]}
                        </motion.span>
                    ))}
                </div>
            </motion.section>

            {/* Projects Section */}
            <motion.section
                className="about-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="section-title">
                    <Briefcase size={20} />
                    {lang === 'tr' ? 'Projeler' : 'Projects'}
                </h2>
                <div className="projects-grid">
                    {featuredProjects.map((project, index) => (
                        <motion.div
                            key={index}
                            className="project-card-mini"
                            variants={itemVariants}
                        >
                            <h3>{project.title[lang]}</h3>
                            <p>{project.description[lang]}</p>
                            <div className="project-tags">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="project-tag">{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="view-all-link">
                    {lang === 'tr' ? 'Tüm Projeleri Gör' : 'View All Projects'}
                    <ArrowRight size={16} />
                </button>
            </motion.section>

            {/* Projects Modal */}
            <ProjectsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
