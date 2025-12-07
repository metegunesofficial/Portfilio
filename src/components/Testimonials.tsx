import { motion } from 'framer-motion'

interface Testimonial {
    quote: string
    author: string
}

const testimonials: Testimonial[] = [
    {
        quote: "Saumya is a great person to work with. He is madly obsessed over cars and he is very passionate about the things he love.",
        author: "Vishnumaya Unni",
    },
    {
        quote: "Worked with Saumya on our Major Project, the Dynamometer, and other projects. Dedicated, passionate, and a true petrol head. Wishing him the best ahead.",
        author: "Saliq Shah",
    },
    {
        quote: "There are very few people in this world who are driven by just the looks of some cars, saumya is one of them. I can recommend him to entrust with any job as I know I will get much more than just the required results",
        author: "Subodh Dangi",
    },
]

export function Testimonials() {
    return (
        <section className="py-12">
            <div className="container">
                <h2 className="section-title">Social Validation</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <p className="testimonial-author">{testimonial.author}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
