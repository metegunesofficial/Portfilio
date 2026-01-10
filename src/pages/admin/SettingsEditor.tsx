import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Globe, User, Link as LinkIcon, Mail, Loader2 } from 'lucide-react'
import { getSupabaseClient } from '../../lib/supabase-client'

interface Settings {
    hero_title_tr: string
    hero_title_en: string
    hero_bio_tr: string
    hero_bio_en: string
    about_bio_tr: string
    about_bio_en: string
    skills: string[]
    social_linkedin: string
    social_github: string
    social_twitter: string
    social_instagram: string
    social_tiktok: string
    contact_email: string
    contact_phone: string
}

const initialSettings: Settings = {
    hero_title_tr: '',
    hero_title_en: '',
    hero_bio_tr: '',
    hero_bio_en: '',
    about_bio_tr: '',
    about_bio_en: '',
    skills: [],
    social_linkedin: '',
    social_github: '',
    social_twitter: '',
    social_instagram: '',
    social_tiktok: '',
    contact_email: '',
    contact_phone: '',
}

type TabType = 'general' | 'social' | 'contact'

export function SettingsEditor() {
    const [settings, setSettings] = useState<Settings>(initialSettings)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('general')
    const [newSkill, setNewSkill] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }
        fetchSettings()
    }, [navigate])

    const fetchSettings = async () => {
        try {
            const supabase = getSupabaseClient()
            const { data, error } = await supabase
                .from('settings')
                .select('*')

            if (error) throw error

            if (data && data.length > 0) {
                const settingsMap: Record<string, any> = {}
                data.forEach((item: any) => {
                    if (item.type === 'json') {
                        try {
                            settingsMap[item.key] = JSON.parse(item.value_tr || '{}')
                        } catch {
                            settingsMap[item.key] = item.value_tr
                        }
                    } else {
                        settingsMap[item.key + '_tr'] = item.value_tr || ''
                        settingsMap[item.key + '_en'] = item.value_en || ''
                    }
                })

                setSettings({
                    hero_title_tr: settingsMap.hero_title_tr || '',
                    hero_title_en: settingsMap.hero_title_en || '',
                    hero_bio_tr: settingsMap.hero_bio_tr || '',
                    hero_bio_en: settingsMap.hero_bio_en || '',
                    about_bio_tr: settingsMap.about_bio_tr || '',
                    about_bio_en: settingsMap.about_bio_en || '',
                    skills: settingsMap.skills || [],
                    social_linkedin: settingsMap.social_links?.linkedin || '',
                    social_github: settingsMap.social_links?.github || '',
                    social_twitter: settingsMap.social_links?.twitter || '',
                    social_instagram: settingsMap.social_links?.instagram || '',
                    social_tiktok: settingsMap.social_links?.tiktok || '',
                    contact_email: settingsMap.contact_email_tr || '',
                    contact_phone: settingsMap.contact_phone_tr || '',
                })
            }
        } catch (err) {
            console.error('Error fetching settings:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const supabase = getSupabaseClient()

            const settingsToSave = [
                { key: 'hero_title', value_tr: settings.hero_title_tr, value_en: settings.hero_title_en, type: 'text' },
                { key: 'hero_bio', value_tr: settings.hero_bio_tr, value_en: settings.hero_bio_en, type: 'text' },
                { key: 'about_bio', value_tr: settings.about_bio_tr, value_en: settings.about_bio_en, type: 'text' },
                { key: 'skills', value_tr: JSON.stringify(settings.skills), value_en: '', type: 'json' },
                {
                    key: 'social_links',
                    value_tr: JSON.stringify({
                        linkedin: settings.social_linkedin,
                        github: settings.social_github,
                        twitter: settings.social_twitter,
                        instagram: settings.social_instagram,
                        tiktok: settings.social_tiktok,
                    }),
                    value_en: '',
                    type: 'json'
                },
                { key: 'contact_email', value_tr: settings.contact_email, value_en: '', type: 'text' },
                { key: 'contact_phone', value_tr: settings.contact_phone, value_en: '', type: 'text' },
            ]

            for (const setting of settingsToSave) {
                const { error } = await supabase
                    .from('settings')
                    .upsert({
                        ...setting,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'key' })

                if (error) throw error
            }

            alert('Ayarlar başarıyla kaydedildi!')
        } catch (err) {
            console.error('Error saving settings:', err)
            alert('Ayarlar kaydedilirken hata oluştu')
        } finally {
            setIsSaving(false)
        }
    }

    const addSkill = () => {
        if (newSkill.trim() && !settings.skills.includes(newSkill.trim())) {
            setSettings({ ...settings, skills: [...settings.skills, newSkill.trim()] })
            setNewSkill('')
        }
    }

    const removeSkill = (skill: string) => {
        setSettings({ ...settings, skills: settings.skills.filter(s => s !== skill) })
    }

    if (isLoading) {
        return <div className="admin-loading">Yükleniyor...</div>
    }

    const tabs = [
        { id: 'general' as TabType, label: 'Genel', icon: Globe },
        { id: 'social' as TabType, label: 'Sosyal Medya', icon: LinkIcon },
        { id: 'contact' as TabType, label: 'İletişim', icon: Mail },
    ]

    return (
        <div className="settings-page">
            <div className="admin-page-header">
                <div>
                    <h1>Site Ayarları</h1>
                    <p>Ana sayfa, hakkımda ve iletişim bilgilerini düzenleyin</p>
                </div>
                <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
                    {isSaving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <div className="settings-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="settings-content">
                {activeTab === 'general' && (
                    <div className="settings-section">
                        <div className="settings-card">
                            <h3>
                                <Globe size={18} />
                                Ana Sayfa Hero
                            </h3>
                            <div className="form-row">
                                <label>Başlık (TR)</label>
                                <input
                                    type="text"
                                    value={settings.hero_title_tr}
                                    onChange={(e) => setSettings({ ...settings, hero_title_tr: e.target.value })}
                                    placeholder="Merhaba, Ben Mete"
                                />
                            </div>
                            <div className="form-row">
                                <label>Başlık (EN)</label>
                                <input
                                    type="text"
                                    value={settings.hero_title_en}
                                    onChange={(e) => setSettings({ ...settings, hero_title_en: e.target.value })}
                                    placeholder="Hello, I'm Mete"
                                />
                            </div>
                            <div className="form-row">
                                <label>Bio (TR)</label>
                                <textarea
                                    value={settings.hero_bio_tr}
                                    onChange={(e) => setSettings({ ...settings, hero_bio_tr: e.target.value })}
                                    rows={3}
                                    placeholder="Ana sayfada görünecek kısa açıklama..."
                                />
                            </div>
                            <div className="form-row">
                                <label>Bio (EN)</label>
                                <textarea
                                    value={settings.hero_bio_en}
                                    onChange={(e) => setSettings({ ...settings, hero_bio_en: e.target.value })}
                                    rows={3}
                                    placeholder="Short description for homepage..."
                                />
                            </div>
                        </div>

                        <div className="settings-card">
                            <h3>
                                <User size={18} />
                                Hakkımda Sayfası
                            </h3>
                            <div className="form-row">
                                <label>Bio (TR)</label>
                                <textarea
                                    value={settings.about_bio_tr}
                                    onChange={(e) => setSettings({ ...settings, about_bio_tr: e.target.value })}
                                    rows={4}
                                    placeholder="Hakkımda sayfasında görünecek detaylı bilgi..."
                                />
                            </div>
                            <div className="form-row">
                                <label>Bio (EN)</label>
                                <textarea
                                    value={settings.about_bio_en}
                                    onChange={(e) => setSettings({ ...settings, about_bio_en: e.target.value })}
                                    rows={4}
                                    placeholder="Detailed bio for About page..."
                                />
                            </div>
                            <div className="form-row">
                                <label>Yetenekler</label>
                                <div className="tech-input-wrapper">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="React, Node.js..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <button type="button" onClick={addSkill} className="add-tech-btn">
                                        Ekle
                                    </button>
                                </div>
                                <div className="tech-tags">
                                    {settings.skills.map((skill, i) => (
                                        <span key={i} className="tech-tag">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="settings-section">
                        <div className="settings-card">
                            <h3>
                                <LinkIcon size={18} />
                                Sosyal Medya Linkleri
                            </h3>
                            <div className="form-row">
                                <label>LinkedIn</label>
                                <input
                                    type="url"
                                    value={settings.social_linkedin}
                                    onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div className="form-row">
                                <label>GitHub</label>
                                <input
                                    type="url"
                                    value={settings.social_github}
                                    onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div className="form-row">
                                <label>Twitter (X)</label>
                                <input
                                    type="url"
                                    value={settings.social_twitter}
                                    onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div className="form-row">
                                <label>Instagram</label>
                                <input
                                    type="url"
                                    value={settings.social_instagram}
                                    onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="form-row">
                                <label>TikTok</label>
                                <input
                                    type="url"
                                    value={settings.social_tiktok}
                                    onChange={(e) => setSettings({ ...settings, social_tiktok: e.target.value })}
                                    placeholder="https://tiktok.com/@..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="settings-section">
                        <div className="settings-card">
                            <h3>
                                <Mail size={18} />
                                İletişim Bilgileri
                            </h3>
                            <div className="form-row">
                                <label>E-posta</label>
                                <input
                                    type="email"
                                    value={settings.contact_email}
                                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                    placeholder="contact@example.com"
                                />
                            </div>
                            <div className="form-row">
                                <label>Telefon</label>
                                <input
                                    type="tel"
                                    value={settings.contact_phone}
                                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                                    placeholder="+90 xxx xxx xx xx"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
