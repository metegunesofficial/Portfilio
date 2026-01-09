import { motion } from 'framer-motion'

export function Logo() {
    return (
        <motion.a
            href="/"
            className="sidebar-logo-custom"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ textDecoration: 'none' }}
        >
            <div style={{
                background: '#1a1a1a', // Dark background
                borderRadius: '12px',
                padding: '0 20px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <span style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#f5f1eb', // Cream text
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap'
                }}>
                    METE GÜNEŞ
                </span>
            </div>
        </motion.a>
    )
}
