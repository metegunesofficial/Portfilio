import { motion } from 'framer-motion'

const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()]
}

export function Hero() {
    const dayName = getDayName()

    return (
        <section className="py-16 md:py-24">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-[48px] md:text-[72px] font-bold leading-[1.1] tracking-tight text-[#1a1a1a]">
                        Hey, Saumya here
                    </h1>

                    <div className="mt-6 md:mt-8">
                        <p className="text-[24px] md:text-[32px] text-[#666] leading-relaxed">
                            How's your<br />
                            <span className="text-[#1a1a1a] font-medium">{dayName}</span>?
                        </p>
                    </div>

                    <p className="mt-6 text-[16px] md:text-[18px] text-[#666] leading-[1.7] max-w-[600px]">
                        I'm your friendly neighborhood CAD wizard from the mystical land of Haridwar
                        (yep, the place considered as a gateway to lord). With 5+ years of doodling…
                        uh, I mean designing, I turn "wait, how?" ideas into "wow, that's slick!" reality.
                        Whether I'm jamming with a team of quirky geniuses or flying solo like a design
                        ninja, I bring a mix of creativity, precision, and just enough magic to make
                        projects shine.
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-8"
                    >
                        <a href="#contact" className="btn-primary">
                            Contact
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
