import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, FileText } from 'lucide-react'
import { getSupabaseClient } from '../../lib/supabase-client'

interface Blog {
    id: string
    title_tr: string
    title_en: string
    slug: string
    category: string | null
    emoji: string
    published: boolean
    created_at: string
}

export function AdminDashboard() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Check auth
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }
        fetchBlogs()
    }, [navigate])

    const fetchBlogs = async () => {
        try {
            const supabase = getSupabaseClient()
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setBlogs(data || [])
        } catch (err) {
            console.error('Error fetching blogs:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu blogu silmek istediğinize emin misiniz?')) return

        try {
            const supabase = getSupabaseClient()
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id)

            if (error) throw error
            setBlogs(blogs.filter(b => b.id !== id))
        } catch (err) {
            console.error('Error deleting blog:', err)
            alert('Blog silinirken hata oluştu')
        }
    }

    const togglePublish = async (blog: Blog) => {
        try {
            const supabase = getSupabaseClient()
            const { error } = await supabase
                .from('blogs')
                .update({ published: !blog.published })
                .eq('id', blog.id)

            if (error) throw error
            setBlogs(blogs.map(b =>
                b.id === blog.id ? { ...b, published: !b.published } : b
            ))
        } catch (err) {
            console.error('Error toggling publish:', err)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth')
        navigate('/admin')
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="admin-header-left">
                    <FileText size={24} />
                    <h1>Blog Yönetimi</h1>
                </div>
                <div className="admin-header-right">
                    <Link to="/admin/blogs/new" className="btn-primary">
                        <Plus size={18} />
                        Yeni Blog
                    </Link>
                    <button onClick={handleLogout} className="btn-secondary admin-logout">
                        <LogOut size={18} />
                        Çıkış
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {isLoading ? (
                    <div className="admin-loading">Yükleniyor...</div>
                ) : blogs.length === 0 ? (
                    <div className="admin-empty">
                        <FileText size={48} />
                        <h3>Henüz blog yok</h3>
                        <p>İlk blogunuzu oluşturmak için "Yeni Blog" butonuna tıklayın.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Blog</th>
                                <th>Kategori</th>
                                <th>Tarih</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map(blog => (
                                <tr key={blog.id}>
                                    <td className="blog-title-cell">
                                        <span className="blog-emoji">{blog.emoji}</span>
                                        <span className="blog-title">{blog.title_tr}</span>
                                    </td>
                                    <td>
                                        <span className="blog-category">{blog.category}</span>
                                    </td>
                                    <td className="blog-date">
                                        {formatDate(blog.created_at)}
                                    </td>
                                    <td>
                                        <button
                                            className={`status-badge ${blog.published ? 'published' : 'draft'}`}
                                            onClick={() => togglePublish(blog)}
                                        >
                                            {blog.published ? (
                                                <>
                                                    <Eye size={14} />
                                                    Yayında
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff size={14} />
                                                    Taslak
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="actions-cell">
                                        <Link
                                            to={`/admin/blogs/${blog.id}/edit`}
                                            className="action-btn edit"
                                            title="Düzenle"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="action-btn delete"
                                            title="Sil"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
