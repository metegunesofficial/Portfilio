import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Code, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { CVDownload } from '../components/ui/CVDownload'

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

// Experience timeline
const experiences = [
    {
        period: '2021 - Present',
        title: { en: 'AI & Automation Specialist', tr: 'AI & Otomasyon Uzmanı' },
        company: { en: 'Freelance / Consulting', tr: 'Serbest / Danışmanlık' },
        description: {
            en: 'Helping businesses integrate AI solutions and automate workflows. Delivered 50+ projects across various industries.',
            tr: 'İşletmelerin AI çözümlerini entegre etmelerine ve iş akışlarını otomatikleştirmelerine yardımcı oluyorum. Çeşitli sektörlerde 50+ proje teslim ettim.'
        }
    },
    {
        period: '2019 - 2021',
        title: { en: 'Full-Stack Developer', tr: 'Full-Stack Geliştirici' },
        company: { en: 'Tech Company', tr: 'Teknoloji Şirketi' },
        description: {
            en: 'Built and maintained web applications using React, Node.js, and cloud services.',
            tr: 'React, Node.js ve bulut servisleri kullanarak web uygulamaları geliştirdim ve sürdürdüm.'
        }
    },
    {
        period: '2017 - 2019',
        title: { en: 'Junior Developer', tr: 'Junior Geliştirici' },
        company: { en: 'Startup', tr: 'Startup' },
        description: {
            en: 'Started my journey in software development. Learned fundamentals of web development.',
            tr: 'Yazılım geliştirme yolculuğuma başladım. Web geliştirme temellerini öğrendim.'
        }
    }
]

export function AboutPage() {
    const { lang } = useLang()

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
                        ? 'AI ve otomasyon alanında 5+ yıllık deneyimle işletmelere dijital dönüşüm çözümleri sunuyorum.'
                        : 'Delivering digital transformation solutions to businesses with 5+ years of experience in AI and automation.'
                    }
                </p>
            </motion.header>

            {/* Bio Section - AI Search optimized */}
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
                            ? `Merhaba! Ben Mete Güneş, Türkiye merkezli bir AI ve Otomasyon Uzmanıyım. Karmaşık iş problemlerini zarif dijital çözümlere dönüştürmeye tutkuyla bağlıyım. Son 5+ yılda, küçük startuplardan büyük kurumsal şirketlere kadar 50'den fazla projeyi başarıyla tamamladım.`
                            : `Hello! I'm Mete Güneş, an AI and Automation Specialist based in Turkey. I'm passionate about transforming complex business problems into elegant digital solutions. Over the past 5+ years, I've successfully completed 50+ projects ranging from small startups to large enterprise companies.`
                        }
                    </p>
                    <p>
                        {lang === 'tr'
                            ? 'Uzmanlık alanlarım arasında AI entegrasyonu (ChatGPT, LangChain), iş akışı otomasyonu, full-stack web geliştirme ve dijital dönüşüm danışmanlığı bulunmaktadır.'
                            : 'My areas of expertise include AI integration (ChatGPT, LangChain), workflow automation, full-stack web development, and digital transformation consulting.'
                        }
                    </p>
                </div>
            </motion.section>

            {/* Skills Section */}
            <motion.section
                className="about-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="section-title">
                    <Code size={20} />
                    {lang === 'tr' ? 'Yetenekler' : 'Skills'}
                </h2>
                <div className="skills-grid">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            className="skill-category"
                            variants={itemVariants}
                        >
                            <h3>{category.title[lang]}</h3>
                            <div className="skill-tags">
                                {category.skills.map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Experience Section */}
            <motion.section
                className="about-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="section-title">
                    <Award size={20} />
                    {lang === 'tr' ? 'Deneyim' : 'Experience'}
                </h2>
                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            className="timeline-item"
                            variants={itemVariants}
                        >
                            <div className="timeline-period">{exp.period}</div>
                            <div className="timeline-content">
                                <h3>{exp.title[lang]}</h3>
                                <span className="timeline-company">{exp.company[lang]}</span>
                                <p>{exp.description[lang]}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Education Section */}
            <motion.section
                className="about-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="section-title">
                    <GraduationCap size={20} />
                    {lang === 'tr' ? 'Eğitim' : 'Education'}
                </h2>
                <div className="education-card">
                    <h3>{lang === 'tr' ? 'Bilgisayar Mühendisliği' : 'Computer Engineering'}</h3>
                    <p>{lang === 'tr' ? 'Üniversite Lisans Derecesi' : 'University Bachelor\'s Degree'}</p>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="about-cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h2>
                    {lang === 'tr'
                        ? 'Birlikte çalışmak ister misiniz?'
                        : 'Want to work together?'
                    }
                </h2>
                <div className="about-cta-buttons">
                    <Link to="/contact" className="btn-primary">
                        {lang === 'tr' ? 'İletişime Geçin' : 'Get in Touch'}
                        <ArrowRight size={18} />
                    </Link>
                    <CVDownload />
                </div>
            </motion.section>
        </div>
    )
}
