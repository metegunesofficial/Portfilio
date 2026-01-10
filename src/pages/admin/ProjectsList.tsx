import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Star, RotateCcw, Archive } from 'lucide-react'
import { getProjects, deleteProject, restoreProject, toggleProjectPublish, toggleProjectFeatured } from '../../services/projects'
import { useRealtimeProjects } from '../../hooks/useRealtimeSubscription'
import type { Project } from '../../types/supabase'

export function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleted, setShowDeleted] = useState(false)
    const navigate = useNavigate()

    const fetchProjects = useCallback(async () => {
        try {
            const data = await getProjects({ includeDeleted: showDeleted })
            setProjects(data)
        } catch (err) {
            console.error('Error fetching projects:', err)
        } finally {
            setIsLoading(false)
        }
    }, [showDeleted])

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }
        fetchProjects()
    }, [navigate, fetchProjects])

    // Real-time subscription
    useRealtimeProjects({
        onInsert: (newProject) => {
            setProjects(prev => [newProject as Project, ...prev])
        },
        onUpdate: (updatedProject) => {
            setProjects(prev => prev.map(p =>
                p.id === (updatedProject as Project).id ? updatedProject as Project : p
            ))
        },
        onDelete: (deletedProject) => {
            if (!showDeleted) {
                setProjects(prev => prev.filter(p => p.id !== (deletedProject as Project).id))
            }
        }
    })

    const handleDelete = async (id: string) => {
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz? (Geri yüklenebilir)')) return

        try {
            await deleteProject(id)
            setProjects(projects.map(p =>
                p.id === id ? { ...p, deleted_at: new Date().toISOString() } : p
            ))
        } catch (err) {
            console.error('Error deleting project:', err)
            alert('Proje silinirken hata oluştu')
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreProject(id)
            setProjects(projects.map(p =>
                p.id === id ? { ...p, deleted_at: null, deleted_by: null } : p
            ))
        } catch (err) {
            console.error('Error restoring project:', err)
            alert('Proje geri yüklenirken hata oluştu')
        }
    }

    const togglePublish = async (project: Project) => {
        try {
            await toggleProjectPublish(project.id, !project.published)
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, published: !p.published } : p
            ))
        } catch (err) {
            console.error('Error toggling publish:', err)
        }
    }

    const toggleFeatured = async (project: Project) => {
        try {
            await toggleProjectFeatured(project.id, !project.featured)
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, featured: !p.featured } : p
            ))
        } catch (err) {
            console.error('Error toggling featured:', err)
        }
    }

    const activeProjects = projects.filter(p => !p.deleted_at)
    const deletedProjects = projects.filter(p => p.deleted_at)
    const displayProjects = showDeleted ? deletedProjects : activeProjects

    return (
        <div className="admin-list-page">
            <div className="admin-page-header">
                <div>
                    <h1>Projeler</h1>
                    <p>Tüm projeleri yönetin</p>
                </div>
                <div className="header-actions">
                    <button
                        className={`btn-secondary ${showDeleted ? 'active' : ''}`}
                        onClick={() => setShowDeleted(!showDeleted)}
                    >
                        <Archive size={18} />
                        {showDeleted ? 'Aktif Projeler' : `Silinmişler (${deletedProjects.length})`}
                    </button>
                    <Link to="/admin/projects/new" className="btn-primary">
                        <Plus size={18} />
                        Yeni Proje
                    </Link>
                </div>
            </div>

            <div className="admin-content">
                {isLoading ? (
                    <div className="admin-loading">Yükleniyor...</div>
                ) : displayProjects.length === 0 ? (
                    <div className="admin-empty">
                        <FileText size={48} />
                        <h3>{showDeleted ? 'Silinmiş proje yok' : 'Henüz proje yok'}</h3>
                        <p>
                            {showDeleted
                                ? 'Silinen projeler burada görünecek.'
                                : 'İlk projenizi eklemek için "Yeni Proje" butonuna tıklayın.'}
                        </p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Proje</th>
                                <th>Kategori</th>
                                <th>Teknolojiler</th>
                                <th>Öne Çıkan</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayProjects.map(project => (
                                <tr key={project.id} className={project.deleted_at ? 'deleted-row' : ''}>
                                    <td className="blog-title-cell">
                                        <span className="blog-title">{project.title_tr}</span>
                                    </td>
                                    <td>
                                        <span className="blog-category">{project.category}</span>
                                    </td>
                                    <td>
                                        <div className="tech-tags-mini">
                                            {project.tech?.slice(0, 3).map((t, i) => (
                                                <span key={i} className="tech-tag-mini">{t}</span>
                                            ))}
                                            {project.tech?.length > 3 && (
                                                <span className="tech-tag-mini">+{project.tech.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {!project.deleted_at && (
                                            <button
                                                className={`featured-btn ${project.featured ? 'active' : ''}`}
                                                onClick={() => toggleFeatured(project)}
                                                title={project.featured ? 'Öne çıkarıldı' : 'Öne çıkar'}
                                            >
                                                <Star size={16} fill={project.featured ? 'currentColor' : 'none'} />
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {project.deleted_at ? (
                                            <span className="status-badge deleted">
                                                <Trash2 size={14} />
                                                Silindi
                                            </span>
                                        ) : (
                                            <button
                                                className={`status-badge ${project.published ? 'published' : 'draft'}`}
                                                onClick={() => togglePublish(project)}
                                            >
                                                {project.published ? (
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
                                        {project.deleted_at ? (
                                            <button
                                                onClick={() => handleRestore(project.id)}
                                                className="action-btn restore"
                                                title="Geri Yükle"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        ) : (
                                            <>
                                                <Link
                                                    to={`/admin/projects/${project.id}/edit`}
                                                    className="action-btn edit"
                                                    title="Düzenle"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
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
