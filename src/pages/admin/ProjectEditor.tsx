import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Eye, EyeOff, Star, X, Plus } from 'lucide-react'
import { TipTapEditor } from '../../components/TipTapEditor'
import { getSupabaseClient } from '../../lib/supabase-client'

const CATEGORIES = ['AI', 'Automation', 'Web', 'Mobile', 'E-Commerce', 'Dashboard', 'API']

interface ProjectForm {
    title_tr: string
    title_en: string
    slug: string
    description_tr: string
    description_en: string
    content_tr: string
    content_en: string
    category: string
    tech: string[]
    link: string
    image_url: string
    featured: boolean
    published: boolean
}

const initialForm: ProjectForm = {
    title_tr: '',
    title_en: '',
    slug: '',
    description_tr: '',
    description_en: '',
    content_tr: '',
    content_en: '',
    category: 'Web',
    tech: [],
    link: '',
    image_url: '',
    featured: false,
    published: false,
}

export function ProjectEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState<ProjectForm>(initialForm)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'tr' | 'en'>('tr')
    const [newTech, setNewTech] = useState('')

    const isEdit = Boolean(id)

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }

        if (id) {
            fetchProject(id)
        }
    }, [id, navigate])

    const fetchProject = async (projectId: string) => {
        setIsLoading(true)
        try {
            const supabase = getSupabaseClient()
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (error) throw error
            if (data) {
                setForm({
                    title_tr: data.title_tr || '',
                    title_en: data.title_en || '',
                    slug: data.slug || '',
                    description_tr: data.description_tr || '',
                    description_en: data.description_en || '',
                    content_tr: data.content_tr || '',
                    content_en: data.content_en || '',
                    category: data.category || 'Web',
                    tech: data.tech || [],
                    link: data.link || '',
                    image_url: data.image_url || '',
                    featured: data.featured || false,
                    published: data.published || false,
                })
            }
        } catch (err) {
            console.error('Error fetching project:', err)
            alert('Proje yüklenirken hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9ğüşıöç\s-]/g, '')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleTitleChange = (value: string) => {
        setForm(prev => ({
            ...prev,
            title_tr: value,
            slug: prev.slug || generateSlug(value),
        }))
    }

    const addTech = () => {
        if (newTech.trim() && !form.tech.includes(newTech.trim())) {
            setForm({ ...form, tech: [...form.tech, newTech.trim()] })
            setNewTech('')
        }
    }

    const removeTech = (techToRemove: string) => {
        setForm({ ...form, tech: form.tech.filter(t => t !== techToRemove) })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.title_tr) {
            alert('Proje başlığı zorunludur')
            return
        }

        setIsSaving(true)
        try {
            const supabase = getSupabaseClient()
            const projectData = {
                ...form,
                updated_at: new Date().toISOString(),
            }

            if (isEdit) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', id!)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert([projectData])

                if (error) throw error
            }

            navigate('/admin/projects')
        } catch (err) {
            console.error('Error saving project:', err)
            alert('Proje kaydedilirken hata oluştu')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="admin-loading">Yükleniyor...</div>
    }

    return (
        <div className="blog-editor-page">
            <div className="editor-header">
                <button onClick={() => navigate('/admin/projects')} className="back-btn">
                    <ArrowLeft size={20} />
                    Geri
                </button>
                <h1>{isEdit ? 'Proje Düzenle' : 'Yeni Proje'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="editor-form">
                <div className="editor-main">
                    {/* Language Tabs */}
                    <div className="lang-tabs">
                        <button
                            type="button"
                            className={`lang-tab ${activeTab === 'tr' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tr')}
                        >
                            🇹🇷 Türkçe
                        </button>
                        <button
                            type="button"
                            className={`lang-tab ${activeTab === 'en' ? 'active' : ''}`}
                            onClick={() => setActiveTab('en')}
                        >
                            🇬🇧 English
                        </button>
                    </div>

                    {/* Turkish Content */}
                    {activeTab === 'tr' && (
                        <div className="content-section">
                            <div className="form-row">
                                <label>Proje Adı (TR)</label>
                                <input
                                    type="text"
                                    value={form.title_tr}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Proje adı"
                                />
                            </div>
                            <div className="form-row">
                                <label>Kısa Açıklama (TR)</label>
                                <textarea
                                    value={form.description_tr}
                                    onChange={(e) => setForm({ ...form, description_tr: e.target.value })}
                                    placeholder="Proje hakkında kısa açıklama"
                                    rows={2}
                                />
                            </div>
                            <div className="form-row">
                                <label>Detaylı İçerik (TR)</label>
                                <TipTapEditor
                                    content={form.content_tr}
                                    onChange={(content) => setForm({ ...form, content_tr: content })}
                                    placeholder="Proje detaylarını yazın..."
                                />
                            </div>
                        </div>
                    )}

                    {/* English Content */}
                    {activeTab === 'en' && (
                        <div className="content-section">
                            <div className="form-row">
                                <label>Project Name (EN)</label>
                                <input
                                    type="text"
                                    value={form.title_en}
                                    onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                                    placeholder="Project name"
                                />
                            </div>
                            <div className="form-row">
                                <label>Short Description (EN)</label>
                                <textarea
                                    value={form.description_en}
                                    onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                                    placeholder="Short description about the project"
                                    rows={2}
                                />
                            </div>
                            <div className="form-row">
                                <label>Detailed Content (EN)</label>
                                <TipTapEditor
                                    content={form.content_en}
                                    onChange={(content) => setForm({ ...form, content_en: content })}
                                    placeholder="Write project details..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="editor-sidebar">
                    <div className="sidebar-card">
                        <h3>Proje Ayarları</h3>

                        <div className="form-row">
                            <label>URL Slug</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                                placeholder="proje-adi"
                            />
                        </div>

                        <div className="form-row">
                            <label>Kategori</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Teknolojiler</label>
                            <div className="tech-input-wrapper">
                                <input
                                    type="text"
                                    value={newTech}
                                    onChange={(e) => setNewTech(e.target.value)}
                                    placeholder="React, Node.js..."
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                                />
                                <button type="button" onClick={addTech} className="add-tech-btn">
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="tech-tags">
                                {form.tech.map((tech, i) => (
                                    <span key={i} className="tech-tag">
                                        {tech}
                                        <button type="button" onClick={() => removeTech(tech)}>
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <label>Proje Linki</label>
                            <input
                                type="url"
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-row">
                            <label>Resim URL</label>
                            <input
                                type="url"
                                value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-row">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                />
                                <span>Öne Çıkar</span>
                                <Star size={16} fill={form.featured ? 'currentColor' : 'none'} />
                            </label>
                        </div>

                        <div className="form-row">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={form.published}
                                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                />
                                <span>Yayınla</span>
                                {form.published ? <Eye size={16} /> : <EyeOff size={16} />}
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary save-btn" disabled={isSaving}>
                        <Save size={18} />
                        {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    )
}
