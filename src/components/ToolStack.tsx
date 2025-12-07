import { motion } from 'framer-motion'

interface Tool {
    name: string
    icon: string
    link: string
}

const tools: Tool[] = [
    { name: 'SolidWorks', icon: '🔧', link: 'https://www.solidworks.com/' },
    { name: 'Ansys', icon: '📊', link: 'https://www.ansys.com/' },
    { name: 'After Effects', icon: '🎬', link: 'https://www.adobe.com/products/aftereffects.html' },
    { name: 'Framer', icon: '🎨', link: 'https://www.framer.com/' },
    { name: 'ChatGPT', icon: '🤖', link: 'https://chatgpt.com/' },
    { name: 'Wix', icon: '🌐', link: 'https://www.wix.com/' },
]

export function ToolStack() {
    return (
        <section className="py-12">
            <div className="container">
                <h2 className="section-title">Tool Stack</h2>

                <div className="flex flex-wrap gap-4">
                    {tools.map((tool, index) => (
                        <motion.a
                            key={index}
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tool-icon"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            title={tool.name}
                        >
                            <span className="text-2xl">{tool.icon}</span>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}
