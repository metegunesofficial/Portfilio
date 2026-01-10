import { NavLink } from 'react-router-dom'
import { Home, FileText, Mail, Linkedin, Twitter, UserCircle, Github, Instagram } from 'lucide-react'
import { useLang } from '../context/LangContext'

import { Logo } from './Logo'

// Custom TikTok icon (not available in lucide-react)
const TikTok = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/metegunes', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/metegunes', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/metegunes', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/metegunes', label: 'Instagram' },
    { icon: TikTok, href: 'https://tiktok.com/@metegunes', label: 'TikTok' },
    { icon: Mail, href: 'mailto:contact@metegunes.dev', label: 'Email' },
]

export function Sidebar() {
    const { lang, setLang, t } = useLang()

    const navItems = [
        { to: '/', label: t.home, icon: Home },
        { to: '/about', label: lang === 'tr' ? 'Hakkımda' : 'About', icon: UserCircle },
        { to: '/blogs', label: t.blogs, icon: FileText },
        { to: '/contact', label: t.contact, icon: Mail },
    ]

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Logo />
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={18} aria-hidden="true" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">

                {/* Language Switcher */}
                <div className="lang-switcher-row">
                    <button
                        className={`lang-btn ${lang === 'tr' ? 'active' : ''}`}
                        onClick={() => setLang('tr')}
                        title="Türkçe"
                        aria-label="Türkçe"
                    >
                        <svg viewBox="0 0 30 20" className="flag-icon" aria-hidden="true">
                            <rect width="30" height="20" fill="#E30A17" />
                            <circle cx="11" cy="10" r="6" fill="#fff" />
                            <circle cx="12.5" cy="10" r="4.8" fill="#E30A17" />
                            <polygon fill="#fff" points="16,10 19,12 17.5,10 19,8" />
                        </svg>
                    </button>
                    <button
                        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                        onClick={() => setLang('en')}
                        title="English"
                        aria-label="English"
                    >
                        <svg viewBox="0 0 30 20" className="flag-icon" aria-hidden="true">
                            <rect width="30" height="20" fill="#012169" />
                            <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="3" />
                            <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2" />
                            <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="5" />
                            <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3" />
                        </svg>
                    </button>
                </div>

                {/* Social Links */}
                <div className="sidebar-socials">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sidebar-social-icon"
                            title={social.label}
                            aria-label={social.label}
                        >
                            <social.icon size={16} aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    )
}
