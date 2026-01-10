import { motion } from 'framer-motion'

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
            <img
                src="/images/mg-logo.png"
                alt="MG Logo"
                style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain'
                }}
            />
        </motion.a>
    )
}
