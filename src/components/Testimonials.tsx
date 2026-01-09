import { motion } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '../context/LangContext'

interface Testimonial {
    id: number
    name: string
    role: { tr: string; en: string }
    company: string
    content: { tr: string; en: string }
    rating: number
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Ahmet Yılmaz',
        role: { tr: 'CEO', en: 'CEO' },
        company: 'TechStart',
        content: {
            tr: 'Mete ile çalışmak harika bir deneyimdi. AI otomasyonu projemizi zamanında ve bütçe dahilinde tamamladı. İş süreçlerimizde %40 verimlilik artışı sağladık.',
            en: 'Working with Mete was a fantastic experience. He completed our AI automation project on time and within budget. We achieved a 40% efficiency increase in our business processes.'
        },
        rating: 5
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        role: { tr: 'Ürün Müdürü', en: 'Product Manager' },
        company: 'Digital Agency',
        content: {
            tr: 'Profesyonel yaklaşımı ve teknik uzmanlığı sayesinde web uygulamamız tam istediğimiz gibi oldu. Kesinlikle tavsiye ederim.',
            en: 'Thanks to his professional approach and technical expertise, our web application turned out exactly as we wanted. Highly recommended.'
        },
        rating: 5
    },
    {
        id: 3,
        name: 'Mehmet Kaya',
        role: { tr: 'Kurucu Ortak', en: 'Co-Founder' },
        company: 'StartupX',
        content: {
            tr: 'MVP geliştirme sürecinde gösterdiği hız ve kalite beklentilerimizin üzerindeydi. Teknik bilgisi ve problem çözme yeteneği etkileyici.',
            en: 'The speed and quality he showed during the MVP development process exceeded our expectations. His technical knowledge and problem-solving ability are impressive.'
        },
        rating: 5
    }
]

export function Testimonials() {
    const { lang } = useLang()
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const current = testimonials[currentIndex]

    return (
        <section className="testimonials-section">
            <div className="testimonials-header">
                <h2>{lang === 'tr' ? 'Müşteri Yorumları' : 'Testimonials'}</h2>
                <p>
                    {lang === 'tr'
                        ? "Birlikte çalıştığım müşterilerin deneyimleri"
                        : "Experiences from clients I've worked with"
                    }
                </p>
            </div>

            <div className="testimonials-carousel">
                <motion.div
                    className="testimonial-card"
                    key={current.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Quote className="quote-icon" size={32} />

                    <p className="testimonial-content">
                        "{current.content[lang]}"
                    </p>

                    <div className="testimonial-rating">
                        {Array.from({ length: current.rating }).map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                        ))}
                    </div>

                    <div className="testimonial-author">
                        <div className="author-avatar">
                            <span>{current.name.charAt(0)}</span>
                        </div>
                        <div className="author-info">
                            <strong>{current.name}</strong>
                            <span>{current.role[lang]}, {current.company}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="testimonials-nav">
                    <button
                        onClick={prevTestimonial}
                        className="nav-btn"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="testimonials-dots">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextTestimonial}
                        className="nav-btn"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    )
}
