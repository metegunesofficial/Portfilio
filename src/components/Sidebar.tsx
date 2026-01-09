import { NavLink, useNavigate } from 'react-router-dom'
import { Home, FileText, Package, Mail, Linkedin, Twitter, LogIn, LogOut, User, UserCircle, Sun, Moon, Github } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Logo } from './Logo'

const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/metegunes', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/metegunes', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/metegunes', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@metegunes.dev', label: 'Email' },
]

export function Sidebar() {
    const { lang, setLang, t } = useLang()
    const { user, logout, loading } = useAuth()
    const { resolvedTheme, setTheme } = useTheme()
    const navigate = useNavigate()

    const navItems = [
        { to: '/', label: t.home, icon: Home },
        { to: '/about', label: lang === 'tr' ? 'Hakkımda' : 'About', icon: UserCircle },
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

                {/* Theme & Language Row */}
                <div className="lang-switcher-row">
                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle-btn"
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                        aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Language Switcher */}
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


