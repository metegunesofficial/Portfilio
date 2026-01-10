import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, MessageSquare, Star, RotateCcw, Archive, Save, X } from 'lucide-react'
import {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    restoreTestimonial,
    toggleTestimonialPublish,
    toggleTestimonialFeatured
} from '../../services/testimonials'
import { useRealtimeTestimonials } from '../../hooks/useRealtimeSubscription'
import type { Testimonial } from '../../types/supabase'

export function TestimonialsList() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleted, setShowDeleted] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        role_tr: '',
        role_en: '',
        company: '',
        quote_tr: '',
        quote_en: '',
        rating: 5
    })
    const navigate = useNavigate()

    const fetchTestimonials = useCallback(async () => {
        try {
            const data = await getTestimonials({ includeDeleted: showDeleted })
            setTestimonials(data)
        } catch (err) {
            console.error('Error fetching testimonials:', err)
        } finally {
            setIsLoading(false)
        }
    }, [showDeleted])

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }
        fetchTestimonials()
    }, [navigate, fetchTestimonials])

    // Real-time subscription
    useRealtimeTestimonials({
        onInsert: (newTestimonial) => {
            setTestimonials(prev => [newTestimonial as Testimonial, ...prev])
        },
        onUpdate: (updatedTestimonial) => {
            setTestimonials(prev => prev.map(t =>
                t.id === (updatedTestimonial as Testimonial).id ? updatedTestimonial as Testimonial : t
            ))
        },
        onDelete: (deletedTestimonial) => {
            if (!showDeleted) {
                setTestimonials(prev => prev.filter(t => t.id !== (deletedTestimonial as Testimonial).id))
            }
        }
    })

    const resetForm = () => {
        setFormData({
            name: '',
            role_tr: '',
            role_en: '',
            company: '',
            quote_tr: '',
            quote_en: '',
            rating: 5
        })
        setEditingId(null)
        setIsCreating(false)
    }

    const handleCreate = async () => {
        try {
            await createTestimonial({
                ...formData,
                published: false,
                featured: false,
                order_index: testimonials.length
            })
            resetForm()
        } catch (err) {
            console.error('Error creating testimonial:', err)
            alert('Referans oluşturulurken hata oluştu')
        }
    }

    const handleUpdate = async () => {
        if (!editingId) return
        try {
            await updateTestimonial(editingId, formData)
            resetForm()
        } catch (err) {
            console.error('Error updating testimonial:', err)
            alert('Referans güncellenirken hata oluştu')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu referansı silmek istediğinize emin misiniz? (Geri yüklenebilir)')) return
        try {
            await deleteTestimonial(id)
            setTestimonials(testimonials.map(t =>
                t.id === id ? { ...t, deleted_at: new Date().toISOString() } : t
            ))
        } catch (err) {
            console.error('Error deleting testimonial:', err)
            alert('Referans silinirken hata oluştu')
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreTestimonial(id)
            setTestimonials(testimonials.map(t =>
                t.id === id ? { ...t, deleted_at: null, deleted_by: null } : t
            ))
        } catch (err) {
            console.error('Error restoring testimonial:', err)
            alert('Referans geri yüklenirken hata oluştu')
        }
    }

    const togglePublish = async (testimonial: Testimonial) => {
        try {
            await toggleTestimonialPublish(testimonial.id, !testimonial.published)
            setTestimonials(testimonials.map(t =>
                t.id === testimonial.id ? { ...t, published: !t.published } : t
            ))
        } catch (err) {
            console.error('Error toggling publish:', err)
        }
    }

    const toggleFeatured = async (testimonial: Testimonial) => {
        try {
            await toggleTestimonialFeatured(testimonial.id, !testimonial.featured)
            setTestimonials(testimonials.map(t =>
                t.id === testimonial.id ? { ...t, featured: !t.featured } : t
            ))
        } catch (err) {
            console.error('Error toggling featured:', err)
        }
    }

    const startEdit = (testimonial: Testimonial) => {
        setFormData({
            name: testimonial.name,
            role_tr: testimonial.role_tr || '',
            role_en: testimonial.role_en || '',
            company: testimonial.company || '',
            quote_tr: testimonial.quote_tr,
            quote_en: testimonial.quote_en,
            rating: testimonial.rating
        })
        setEditingId(testimonial.id)
        setIsCreating(false)
    }

    const activeTestimonials = testimonials.filter(t => !t.deleted_at)
    const deletedTestimonials = testimonials.filter(t => t.deleted_at)
    const displayTestimonials = showDeleted ? deletedTestimonials : activeTestimonials

    return (
        <div className="admin-list-page">
            <div className="admin-page-header">
                <div>
                    <h1>Referanslar</h1>
                    <p>Müşteri yorumlarını yönetin</p>
                </div>
                <div className="header-actions">
                    <button
                        className={`btn-secondary ${showDeleted ? 'active' : ''}`}
                        onClick={() => setShowDeleted(!showDeleted)}
                    >
                        <Archive size={18} />
                        {showDeleted ? 'Aktif Referanslar' : `Silinmişler (${deletedTestimonials.length})`}
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => { setIsCreating(true); setEditingId(null); }}
                    >
                        <Plus size={18} />
                        Yeni Referans
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {(isCreating || editingId) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{isCreating ? 'Yeni Referans' : 'Referansı Düzenle'}</h2>
                            <button className="close-btn" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Ad Soyad</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Müşteri adı"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Pozisyon (TR)</label>
                                    <input
                                        type="text"
                                        value={formData.role_tr}
                                        onChange={e => setFormData({ ...formData, role_tr: e.target.value })}
                                        placeholder="Örn: CEO"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pozisyon (EN)</label>
                                    <input
                                        type="text"
                                        value={formData.role_en}
                                        onChange={e => setFormData({ ...formData, role_en: e.target.value })}
                                        placeholder="E.g: CEO"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Şirket</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Şirket adı"
                                />
                            </div>
                            <div className="form-group">
                                <label>Yorum (TR)</label>
                                <textarea
                                    value={formData.quote_tr}
                                    onChange={e => setFormData({ ...formData, quote_tr: e.target.value })}
                                    placeholder="Türkçe yorum..."
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Yorum (EN)</label>
                                <textarea
                                    value={formData.quote_en}
                                    onChange={e => setFormData({ ...formData, quote_en: e.target.value })}
                                    placeholder="English comment..."
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Puan (1-5)</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`star-btn ${formData.rating >= num ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, rating: num })}
                                        >
                                            <Star size={24} fill={formData.rating >= num ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={resetForm}>
                                İptal
                            </button>
                            <button
                                className="btn-primary"
                                onClick={isCreating ? handleCreate : handleUpdate}
                                disabled={!formData.name || !formData.quote_tr || !formData.quote_en}
                            >
                                <Save size={18} />
                                {isCreating ? 'Oluştur' : 'Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-content">
                {isLoading ? (
                    <div className="admin-loading">Yükleniyor...</div>
                ) : displayTestimonials.length === 0 ? (
                    <div className="admin-empty">
                        <MessageSquare size={48} />
                        <h3>{showDeleted ? 'Silinmiş referans yok' : 'Henüz referans yok'}</h3>
                        <p>
                            {showDeleted
                                ? 'Silinen referanslar burada görünecek.'
                                : 'İlk referansı eklemek için "Yeni Referans" butonuna tıklayın.'}
                        </p>
                    </div>
                ) : (
                    <div className="testimonials-grid">
                        {displayTestimonials.map(testimonial => (
                            <div
                                key={testimonial.id}
                                className={`testimonial-card ${testimonial.deleted_at ? 'deleted' : ''}`}
                            >
                                <div className="testimonial-header">
                                    <div className="testimonial-info">
                                        <h3>{testimonial.name}</h3>
                                        <p>{testimonial.role_tr} - {testimonial.company}</p>
                                    </div>
                                    <div className="testimonial-rating">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <Star
                                                key={num}
                                                size={14}
                                                fill={testimonial.rating >= num ? '#fbbf24' : 'none'}
                                                stroke={testimonial.rating >= num ? '#fbbf24' : '#d1d5db'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="testimonial-quote">"{testimonial.quote_tr}"</p>
                                <div className="testimonial-actions">
                                    {testimonial.deleted_at ? (
                                        <button
                                            onClick={() => handleRestore(testimonial.id)}
                                            className="action-btn restore"
                                            title="Geri Yükle"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className={`featured-btn ${testimonial.featured ? 'active' : ''}`}
                                                onClick={() => toggleFeatured(testimonial)}
                                                title={testimonial.featured ? 'Öne çıkarıldı' : 'Öne çıkar'}
                                            >
                                                <Star size={16} fill={testimonial.featured ? 'currentColor' : 'none'} />
                                            </button>
                                            <button
                                                className={`status-btn ${testimonial.published ? 'published' : 'draft'}`}
                                                onClick={() => togglePublish(testimonial)}
                                                title={testimonial.published ? 'Yayında' : 'Taslak'}
                                            >
                                                {testimonial.published ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button
                                                onClick={() => startEdit(testimonial)}
                                                className="action-btn edit"
                                                title="Düzenle"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(testimonial.id)}
                                                className="action-btn delete"
                                                title="Sil"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
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
