import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, RotateCcw, Archive } from 'lucide-react'
import { getBlogs, deleteBlog, restoreBlog, toggleBlogPublish } from '../../services/blogs'
import { useRealtimeBlogs } from '../../hooks/useRealtimeSubscription'
import type { Blog } from '../../types/supabase'

export function BlogsList() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleted, setShowDeleted] = useState(false)
    const navigate = useNavigate()

    const fetchBlogs = useCallback(async () => {
        try {
            const data = await getBlogs({ includeDeleted: showDeleted })
            setBlogs(data)
        } catch (err) {
            console.error('Error fetching blogs:', err)
        } finally {
            setIsLoading(false)
        }
    }, [showDeleted])

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }
        fetchBlogs()
    }, [navigate, fetchBlogs])

    // Real-time subscription
    useRealtimeBlogs({
        onInsert: (newBlog) => {
            setBlogs(prev => [newBlog as Blog, ...prev])
        },
        onUpdate: (updatedBlog) => {
            setBlogs(prev => prev.map(b =>
                b.id === (updatedBlog as Blog).id ? updatedBlog as Blog : b
            ))
        },
        onDelete: (deletedBlog) => {
            if (!showDeleted) {
                setBlogs(prev => prev.filter(b => b.id !== (deletedBlog as Blog).id))
            }
        }
    })

    const handleDelete = async (id: string) => {
        if (!confirm('Bu blogu silmek istediğinize emin misiniz? (Geri yüklenebilir)')) return

        try {
            await deleteBlog(id)
            // Real-time güncelleyecek ama hemen UI'ı güncelleyelim
            setBlogs(blogs.map(b =>
                b.id === id ? { ...b, deleted_at: new Date().toISOString() } : b
            ))
        } catch (err) {
            console.error('Error deleting blog:', err)
            alert('Blog silinirken hata oluştu')
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreBlog(id)
            setBlogs(blogs.map(b =>
                b.id === id ? { ...b, deleted_at: null, deleted_by: null } : b
            ))
        } catch (err) {
            console.error('Error restoring blog:', err)
            alert('Blog geri yüklenirken hata oluştu')
        }
    }

    const togglePublish = async (blog: Blog) => {
        try {
            await toggleBlogPublish(blog.id, !blog.published)
            setBlogs(blogs.map(b =>
                b.id === blog.id ? { ...b, published: !b.published } : b
            ))
        } catch (err) {
            console.error('Error toggling publish:', err)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const activeBlogs = blogs.filter(b => !b.deleted_at)
    const deletedBlogs = blogs.filter(b => b.deleted_at)
    const displayBlogs = showDeleted ? deletedBlogs : activeBlogs

    return (
        <div className="admin-list-page">
            <div className="admin-page-header">
                <div>
                    <h1>Bloglar</h1>
                    <p>Tüm blog yazılarını yönetin</p>
                </div>
                <div className="header-actions">
                    <button
                        className={`btn-secondary ${showDeleted ? 'active' : ''}`}
                        onClick={() => setShowDeleted(!showDeleted)}
                    >
                        <Archive size={18} />
                        {showDeleted ? 'Aktif Bloglar' : `Silinmişler (${deletedBlogs.length})`}
                    </button>
                    <Link to="/admin/blogs/new" className="btn-primary">
                        <Plus size={18} />
                        Yeni Blog
                    </Link>
                </div>
            </div>

            <div className="admin-content">
                {isLoading ? (
                    <div className="admin-loading">Yükleniyor...</div>
                ) : displayBlogs.length === 0 ? (
                    <div className="admin-empty">
                        <FileText size={48} />
                        <h3>{showDeleted ? 'Silinmiş blog yok' : 'Henüz blog yok'}</h3>
                        <p>
                            {showDeleted
                                ? 'Silinen bloglar burada görünecek.'
                                : 'İlk blogunuzu oluşturmak için "Yeni Blog" butonuna tıklayın.'}
                        </p>
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
                            {displayBlogs.map(blog => (
                                <tr key={blog.id} className={blog.deleted_at ? 'deleted-row' : ''}>
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
                                        {blog.deleted_at ? (
                                            <span className="status-badge deleted">
                                                <Trash2 size={14} />
                                                Silindi
                                            </span>
                                        ) : (
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
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        {blog.deleted_at ? (
                                            <button
                                                onClick={() => handleRestore(blog.id)}
                                                className="action-btn restore"
                                                title="Geri Yükle"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Real-time indicator */}
            <div className="realtime-indicator">
                <span className="pulse"></span>
                Canlı güncelleme aktif
            </div>
        </div>
    )
}
