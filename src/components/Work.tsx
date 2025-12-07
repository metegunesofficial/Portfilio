import { motion } from 'framer-motion'
import { Linkedin } from 'lucide-react'

interface WorkItem {
    company: string
    period: string
    logo?: string
}

const workItems: WorkItem[] = [
    { company: 'Birla Corporation', period: '2025 - Present' },
    { company: 'Birla Corporation', period: '2025 - Present' },
]

export function Work() {
    // Double the items for seamless marquee
    const allItems = [...workItems, ...workItems, ...workItems, ...workItems]

    return (
        <section className="py-12">
            <div className="container">
                <h2 className="section-title">Work</h2>
            </div>

            <div className="marquee-container">
                <div className="marquee-content">
                    {allItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="work-card"
                            whileHover={{ y: -2 }}
                        >
                            <div className="work-card-logo">
                                {item.company.charAt(0)}
                            </div>
                            <div>
                                <h3 className="work-card-title">{item.company}</h3>
                                <p className="work-card-period">{item.period}</p>
                            </div>
                        </motion.div>
                    ))}

                    <motion.a
                        href="https://www.linkedin.com/in/schats"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="say-hi-card"
                        whileHover={{ y: -2 }}
                    >
                        <Linkedin size={24} />
                        <span className="text-[15px] font-semibold">Say Hi!</span>
                    </motion.a>

                    {/* Duplicate for seamless loop */}
                    {allItems.map((item, index) => (
                        <motion.div
                            key={`dup-${index}`}
                            className="work-card"
                            whileHover={{ y: -2 }}
                        >
                            <div className="work-card-logo">
                                {item.company.charAt(0)}
                            </div>
                            <div>
                                <h3 className="work-card-title">{item.company}</h3>
                                <p className="work-card-period">{item.period}</p>
                            </div>
                        </motion.div>
                    ))}

                    <motion.a
                        href="https://www.linkedin.com/in/schats"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="say-hi-card"
                        whileHover={{ y: -2 }}
                    >
                        <Linkedin size={24} />
                        <span className="text-[15px] font-semibold">Say Hi!</span>
                    </motion.a>
                </div>
            </div>
        </section>
    )
}
