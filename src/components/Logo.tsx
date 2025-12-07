import { motion } from 'framer-motion'

export function Logo() {
    return (
        <motion.a
            href="/"
            className="sidebar-logo-custom"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            <svg
                width="100%"
                height="48"
                viewBox="0 0 200 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#3a3a3a" />
                    </linearGradient>
                    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e8e4df" />
                        <stop offset="100%" stopColor="#d4cfc8" />
                    </linearGradient>
                </defs>

                {/* Full width rounded background */}
                <rect x="0" y="0" width="200" height="48" rx="14" fill="url(#logoGradient)" />

                {/* Abstract "G" shape on left */}
                <path
                    d="M24 14C19.2 14 15 18.2 15 24C15 29.8 19.2 34 24 34C26.6 34 28.9 32.9 30.6 31.1"
                    stroke="url(#accentGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                />
                <path
                    d="M24 20V28H29"
                    stroke="url(#accentGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                {/* Decorative dots */}
                <circle cx="32" cy="15" r="2" fill="#e8e4df" />

                {/* Text "GÜNEŞ" */}
                <text
                    x="100"
                    y="29"
                    fill="#e8e4df"
                    fontSize="16"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                    textAnchor="middle"
                >
                    GÜNEŞ
                </text>

                {/* Decorative line */}
                <line x1="155" y1="24" x2="185" y2="24" stroke="#e8e4df" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
        </motion.a>
    )
}
