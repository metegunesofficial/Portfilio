import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
import { TipTapEditor } from '../../components/TipTapEditor'
import { getSupabaseClient } from '../../lib/supabase-client'

const CATEGORIES = ['AI', 'Otomasyon', 'Web', 'Genel']
const EMOJIS = ['🤖', '⚡', '💻', '📝', '🚀', '💡', '🎯', '🔥']

interface BlogForm {
    title_tr: string
    title_en: string
    slug: string
    excerpt_tr: string
    excerpt_en: string
    content_tr: string
    content_en: string
    category: string
    emoji: string
    published: boolean
}

const initialForm: BlogForm = {
    title_tr: '',
    title_en: '',
    slug: '',
    excerpt_tr: '',
    excerpt_en: '',
    content_tr: '',
    content_en: '',
    category: 'Genel',
    emoji: '📝',
    published: false,
}

export function BlogEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState<BlogForm>(initialForm)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'tr' | 'en'>('tr')

    const isEdit = Boolean(id)

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }

        if (id) {
            fetchBlog(id)
        }
    }, [id, navigate])

    const fetchBlog = async (blogId: string) => {
        setIsLoading(true)
        try {
            const supabase = getSupabaseClient()
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('id', blogId)
                .single()

            if (error) throw error
            if (data) {
                setForm({
                    title_tr: data.title_tr || '',
                    title_en: data.title_en || '',
                    slug: data.slug || '',
                    excerpt_tr: data.excerpt_tr || '',
                    excerpt_en: data.excerpt_en || '',
                    content_tr: data.content_tr || '',
                    content_en: data.content_en || '',
                    category: data.category || 'Genel',
                    emoji: data.emoji || '📝',
                    published: data.published || false,
                })
            }
        } catch (err) {
            console.error('Error fetching blog:', err)
            alert('Blog yüklenirken hata oluştu')
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.title_tr || !form.content_tr) {
            alert('Başlık ve içerik zorunludur')
            return
        }

        setIsSaving(true)
        try {
            const supabase = getSupabaseClient()
            const blogData = {
                ...form,
                updated_at: new Date().toISOString(),
            }

            if (isEdit) {
                const { error } = await supabase
                    .from('blogs')
                    .update(blogData)
                    .eq('id', id!)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('blogs')
                    .insert([blogData])

                if (error) throw error
            }

            navigate('/admin/dashboard')
        } catch (err) {
            console.error('Error saving blog:', err)
            alert('Blog kaydedilirken hata oluştu')
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
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
                    <ArrowLeft size={20} />
                    Geri
                </button>
                <h1>{isEdit ? 'Blog Düzenle' : 'Yeni Blog'}</h1>
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
                                <label>Başlık (TR)</label>
                                <input
                                    type="text"
                                    value={form.title_tr}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Blog başlığı"
                                />
                            </div>
                            <div className="form-row">
                                <label>Özet (TR)</label>
                                <textarea
                                    value={form.excerpt_tr}
                                    onChange={(e) => setForm({ ...form, excerpt_tr: e.target.value })}
                                    placeholder="Kısa özet"
                                    rows={2}
                                />
                            </div>
                            <div className="form-row">
                                <label>İçerik (TR)</label>
                                <TipTapEditor
                                    content={form.content_tr}
                                    onChange={(content) => setForm({ ...form, content_tr: content })}
                                    placeholder="Blog içeriğinizi yazın..."
                                />
                            </div>
                        </div>
                    )}

                    {/* English Content */}
                    {activeTab === 'en' && (
                        <div className="content-section">
                            <div className="form-row">
                                <label>Title (EN)</label>
                                <input
                                    type="text"
                                    value={form.title_en}
                                    onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                                    placeholder="Blog title"
                                />
                            </div>
                            <div className="form-row">
                                <label>Excerpt (EN)</label>
                                <textarea
                                    value={form.excerpt_en}
                                    onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })}
                                    placeholder="Short summary"
                                    rows={2}
                                />
                            </div>
                            <div className="form-row">
                                <label>Content (EN)</label>
                                <TipTapEditor
                                    content={form.content_en}
                                    onChange={(content) => setForm({ ...form, content_en: content })}
                                    placeholder="Write your blog content..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="editor-sidebar">
                    <div className="sidebar-card">
                        <h3>Ayarlar</h3>

                        <div className="form-row">
                            <label>URL Slug</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                                placeholder="url-slug"
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
                            <label>Emoji</label>
                            <div className="emoji-picker">
                                {EMOJIS.map(emoji => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        className={`emoji-btn ${form.emoji === emoji ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, emoji })}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
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
