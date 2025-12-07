import { NavLink, useNavigate } from 'react-router-dom'
import { Home, FileText, Package, Mail, Instagram, Facebook, Linkedin, Youtube, Twitter, MessageCircle, Music, LogIn, LogOut, User } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'

const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/', label: 'Facebook' },
    { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' },
    { icon: Linkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/', label: 'YouTube' },
    { icon: Twitter, href: 'https://twitter.com/', label: 'Twitter' },
    { icon: Mail, href: 'mailto:your@gmail.com', label: 'Gmail' },
    { icon: Music, href: 'https://tiktok.com/', label: 'TikTok' },
]

export function Sidebar() {
    const { lang, setLang, t } = useLang()
    const { user, logout, loading } = useAuth()
    const navigate = useNavigate()

    const navItems = [
        { to: '/', label: t.home, icon: Home },
        { to: '/blogs', label: t.blogs, icon: FileText },
        { to: '/products-listing', label: t.products, icon: Package },
        { to: '/contact', label: t.contact, icon: Mail },
    ]

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

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
                {/* User Auth Section */}
                <div className="sidebar-auth">
                    {loading ? (
                        <div className="auth-loading">
                            <span className="loading-spinner-small"></span>
                        </div>
                    ) : user ? (
                        <div className="user-section">
                            <div className="user-info">
                                <div className="user-avatar">
                                    <User size={16} />
                                </div>
                                <span className="user-name">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                            </div>
                            <button
                                className="auth-btn logout-btn"
                                onClick={handleLogout}
                                title={t.logout}
                            >
                                <LogOut size={16} />
                                <span>{t.logout}</span>
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `auth-btn login-btn ${isActive ? 'active' : ''}`
                            }
                        >
                            <LogIn size={16} />
                            <span>{t.loginBtn}</span>
                        </NavLink>
                    )}
                </div>

                {/* Language Switcher - Side by side with flags */}
                <div className="lang-switcher-row">
                    <button
                        className={`lang-btn ${lang === 'tr' ? 'active' : ''}`}
                        onClick={() => setLang('tr')}
                        title="Türkçe"
                    >
                        🇹🇷
                    </button>
                    <button
                        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                        onClick={() => setLang('en')}
                        title="English"
                    >
                        🇬🇧
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


