import { motion } from 'framer-motion'

interface SpotlightItem {
    title: string
    description: string
    category: string
    date: string
    image?: string
    link?: string
}

const spotlightItems: SpotlightItem[] = [
    {
        title: 'South India Elite Brand Awards',
        description: 'Truly grateful and excited to receive the Best-in-Class Leadership in Global Skill Development award from the wonderful Kompella Madhavi Latha ji; A moment I\'ll always cherish!',
        category: 'GLOBAL PINNACLE',
        date: 'Apr, 2023',
        link: '#',
    },
    {
        title: 'Honda Civic Modification',
        description: 'From budget find to weekend cruiser- modified my 2008 Honda Civic into an eye turner.',
        category: 'HONDA',
        date: 'Mar, 2021',
        link: '#',
    },
    {
        title: 'Lamborghini: Fan Edition',
        description: 'Built out of pure passion and too much caffeine, my fan-made spin on a raging bull. Bold, loud, and totally unnecessary… just how I like it.',
        category: 'Fan Book',
        date: 'Jan, 2025',
        link: '#',
    },
]

export function Spotlight() {
    return (
        <section className="py-12">
            <div className="container">
                <h2 className="section-title">Spotlight</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {spotlightItems.map((item, index) => (
                        <motion.a
                            key={index}
                            href={item.link}
                            className="spotlight-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="spotlight-image">
                                <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                                    ✨
                                </div>
                            </div>

                            <div className="spotlight-content">
                                <h3 className="spotlight-title">{item.title}</h3>
                                <p className="spotlight-desc">{item.description}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="spotlight-category">{item.category}</span>
                                    <span className="spotlight-date">{item.date}</span>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}
