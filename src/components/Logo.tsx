import { motion } from 'framer-motion'

// MG Logo SVG Component - Creative Arrow Design
function MGLogoSVG() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            width="56"
            height="56"
        >
            {/* Gradient definitions */}
            <defs>
                <linearGradient id="mgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
            </defs>

            {/* M Letter - Left side with arrow pointing up-right */}
            <path
                d="M15 80 L15 30 L30 50 L45 20 L45 80"
                stroke="url(#mgGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* G Letter - Integrated curve with arrow */}
            <path
                d="M50 35 C65 15, 90 25, 85 50 L85 65 C85 80, 60 85, 50 70"
                stroke="url(#blueGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* G inner line */}
            <path
                d="M85 55 L65 55"
                stroke="url(#blueGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
            />

            {/* Arrow tip on M */}
            <path
                d="M40 25 L45 20 L50 28"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    )
}

export function Logo() {
    return (
        <motion.a
            href="/"
            className="sidebar-logo-custom"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            aria-label="Home - Mete Güneş"
        >
            <MGLogoSVG />
        </motion.a>
    )
}
