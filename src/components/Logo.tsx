import { motion } from 'framer-motion'

// MG Logo SVG Component - Clean minimal version
function MGLogoSVG() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
            fill="none"
            width="48"
            height="48"
        >
            {/* Main M Letter */}
            <path
                d="M20 95 L20 35 L38 60 L56 35 L56 95"
                stroke="#1a1a1a"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* G Letter integrated with M */}
            <path
                d="M60 50 C60 32, 85 28, 98 40 M98 50 L98 75 C98 92, 70 95, 58 80 M98 70 L80 70"
                stroke="#1a1a1a"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Tech Circuit Nodes - Blue Accents */}
            <circle cx="20" cy="95" r="5" fill="#3b82f6" />
            <circle cx="56" cy="95" r="5" fill="#3b82f6" />
            <circle cx="38" cy="60" r="4" fill="#3b82f6" />
            <circle cx="98" cy="70" r="4" fill="#3b82f6" />

            {/* Connection Lines */}
            <line x1="20" y1="55" x2="30" y2="45" stroke="#3b82f6" strokeWidth="2" />
            <line x1="56" y1="55" x2="65" y2="48" stroke="#3b82f6" strokeWidth="2" />

            {/* Small Accent Dots */}
            <circle cx="30" cy="45" r="3" fill="#3b82f6" />
            <circle cx="65" cy="48" r="3" fill="#3b82f6" />
        </svg>
    )
}

export function Logo() {
    return (
        <motion.a
            href="/"
            className="sidebar-logo-custom"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <MGLogoSVG />
        </motion.a>
    )
}
