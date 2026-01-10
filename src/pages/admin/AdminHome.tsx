import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Briefcase, Settings, Plus } from 'lucide-react'
import { getSupabaseClient } from '../../lib/supabase-client'

interface Stats {
    blogs: number
    projects: number
}

export function AdminHome() {
    const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }
        fetchStats()
    }, [navigate])

    const fetchStats = async () => {
        try {
            const supabase = getSupabaseClient()

            const [blogsResult, projectsResult] = await Promise.all([
                supabase.from('blogs').select('id', { count: 'exact', head: true }),
                supabase.from('projects').select('id', { count: 'exact', head: true })
            ])

            setStats({
                blogs: blogsResult.count || 0,
                projects: projectsResult.count || 0
            })
        } catch (err) {
            console.error('Error fetching stats:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const cards = [
        {
            title: 'Bloglar',
            count: stats.blogs,
            icon: FileText,
            link: '/admin/blogs',
            addLink: '/admin/blogs/new',
            color: '#3b82f6'
        },
        {
            title: 'Projeler',
            count: stats.projects,
            icon: Briefcase,
            link: '/admin/projects',
            addLink: '/admin/projects/new',
            color: '#10b981'
        },
        {
            title: 'Ayarlar',
            count: null,
            icon: Settings,
            link: '/admin/settings',
            addLink: null,
            color: '#8b5cf6'
        }
    ]

    return (
        <div className="admin-home">
            <div className="admin-page-header">
                <h1>Dashboard</h1>
                <p>İçerik yönetim paneline hoş geldiniz</p>
            </div>

            <div className="dashboard-cards">
                {cards.map((card) => (
                    <div key={card.title} className="dashboard-card">
                        <div className="dashboard-card-header">
                            <div
                                className="dashboard-card-icon"
                                style={{ background: `${card.color}15`, color: card.color }}
                            >
                                <card.icon size={24} />
                            </div>
                            {card.addLink && (
                                <Link to={card.addLink} className="dashboard-add-btn">
                                    <Plus size={18} />
                                </Link>
                            )}
                        </div>
                        <div className="dashboard-card-body">
                            <h3>{card.title}</h3>
                            {card.count !== null && (
                                <span className="dashboard-card-count">
                                    {isLoading ? '...' : card.count}
                                </span>
                            )}
                        </div>
                        <Link to={card.link} className="dashboard-card-link">
                            {card.title === 'Ayarlar' ? 'Düzenle' : 'Görüntüle'} →
                        </Link>
                    </div>
                ))}
            </div>

            <div className="dashboard-quick-actions">
                <h2>Hızlı İşlemler</h2>
                <div className="quick-action-buttons">
                    <Link to="/admin/blogs/new" className="btn-primary">
                        <Plus size={18} />
                        Yeni Blog
                    </Link>
                    <Link to="/admin/projects/new" className="btn-secondary">
                        <Plus size={18} />
                        Yeni Proje
                    </Link>
                </div>
            </div>
        </div>
    )
}
