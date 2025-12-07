import { motion } from 'framer-motion'

interface Project {
    title: string
    icon: string
    bgColor: string
    link: string
}

const projects: Project[] = [
    {
        title: 'Discord Community for Gamers',
        icon: '🎮',
        bgColor: '#5865F2',
        link: 'https://discord.gg/5fDgzYraCJ',
    },
    {
        title: 'Honda Civic 2008 Modification',
        icon: '🚗',
        bgColor: '#CC0000',
        link: '#',
    },
    {
        title: 'Self-Paced Courses Website',
        icon: '📚',
        bgColor: '#10B981',
        link: 'https://learn.skyyskill.com/',
    },
    {
        title: 'Podcast Series',
        icon: '🎙️',
        bgColor: '#1DB954',
        link: 'https://open.spotify.com/show/2WlENMZeZSwtrrJ1yBOz29',
    },
]

export function SideProjects() {
    return (
        <section className="py-12">
            <div className="container">
                <h2 className="section-title">Side Projects</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projects.map((project, index) => (
                        <motion.a
                            key={index}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div
                                className="project-card-icon"
                                style={{ background: `${project.bgColor}20` }}
                            >
                                {project.icon}
                            </div>
                            <h3 className="project-card-title">{project.title}</h3>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}
