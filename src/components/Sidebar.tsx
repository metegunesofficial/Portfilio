import { NavLink } from 'react-router-dom'
import { Home, FileText, Mail, Linkedin, UserCircle, Instagram, Github } from 'lucide-react'
import { useLang } from '../context/LangContext'

import { Logo } from './Logo'

// Custom TikTok icon (not available in lucide-react)
const TikTok = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

// Custom X (formerly Twitter) icon
const XIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/metegunesofficial', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/metegunesofficial/', label: 'Instagram' },
    { icon: TikTok, href: 'https://www.tiktok.com/@metegunesofficial', label: 'TikTok' },
    { icon: XIcon, href: 'https://x.com/metegnsofficial', label: 'X' },
    { icon: Github, href: 'https://github.com/metegunesofficial', label: 'GitHub' },
    { icon: Mail, href: 'mailto:metegunesofficial@gmail.com', label: 'Email' },
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
                        <item.icon size={18} />
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
                    >
                        <svg viewBox="0 0 30 20" className="flag-icon">
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
                    >
                        <svg viewBox="0 0 30 20" className="flag-icon">
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
                        >
                            <social.icon size={16} />
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    )
}


