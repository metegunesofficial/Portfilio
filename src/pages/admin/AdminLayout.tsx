import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FileText, Briefcase, Settings, LogOut, LayoutDashboard, Home, Users, Mail } from 'lucide-react'

export function AdminLayout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth')
        navigate('/admin')
    }

    const menuItems = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/blogs', label: 'Bloglar', icon: FileText },
        { to: '/admin/projects', label: 'Projeler', icon: Briefcase },
        { to: '/admin/subscribers', label: 'Aboneler', icon: Users },
        { to: '/admin/campaigns', label: 'Kampanyalar', icon: Mail },
        { to: '/admin/settings', label: 'Ayarlar', icon: Settings },
    ]

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <NavLink to="/" className="admin-logo">
                        <Home size={20} />
                        <span>Siteye Dön</span>
                    </NavLink>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="admin-nav-item logout">
                        <LogOut size={18} />
                        <span>Çıkış</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}
