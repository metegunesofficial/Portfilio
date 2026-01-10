// Admin Subscribers Page - Abone yönetimi
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, Search, Download, Trash2, RefreshCw,
    CheckCircle, XCircle, AlertCircle, Mail, Calendar
} from 'lucide-react'
import {
    getAllSubscribers,
    getSubscriberStats,
    deleteSubscriber,
    restoreSubscriber,
    unsubscribeById,
    subscribeToSubscribersChanges,
    type SubscriberStats
} from '../../services/newsletter'
import type { NewsletterSubscriber } from '../../types/supabase'

export function AdminSubscribers() {
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
    const [stats, setStats] = useState<SubscriberStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed' | 'bounced'>('all')
    const [showDeleted, setShowDeleted] = useState(false)

    // Load data
    useEffect(() => {
        loadData()

        // Real-time updates
        const channel = subscribeToSubscribersChanges(() => {
            loadData()
        })

        return () => {
            channel.unsubscribe()
        }
    }, [statusFilter, showDeleted])

    const loadData = async () => {
        try {
            setLoading(true)
            const [subs, subscriberStats] = await Promise.all([
                getAllSubscribers({
                    status: statusFilter === 'all' ? undefined : statusFilter,
                    includeDeleted: showDeleted
                }),
                getSubscriberStats()
            ])
            setSubscribers(subs)
            setStats(subscriberStats)
        } catch (error) {
            console.error('Failed to load subscribers:', error)
        } finally {
            setLoading(false)
        }
    }

    // Filter by search
    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Status badge
    const StatusBadge = ({ status }: { status: string }) => {
        const config: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
            active: { icon: CheckCircle, color: 'var(--color-success)', label: 'Aktif' },
            unsubscribed: { icon: XCircle, color: 'var(--color-text-subtle)', label: 'Abonelik İptal' },
            bounced: { icon: AlertCircle, color: 'var(--color-error)', label: 'Bounce' }
        }
        const { icon: Icon, color, label } = config[status] || config.active
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color, fontSize: '13px' }}>
                <Icon size={14} />
                {label}
            </span>
        )
    }

    // Handle unsubscribe
    const handleUnsubscribe = async (id: string) => {
        if (!confirm('Bu aboneyi pasif yapmak istediğinize emin misiniz?')) return
        try {
            await unsubscribeById(id)
            loadData()
        } catch (error) {
            console.error('Failed to unsubscribe:', error)
        }
    }

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm('Bu aboneyi silmek istediğinize emin misiniz?')) return
        try {
            await deleteSubscriber(id)
            loadData()
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    // Handle restore
    const handleRestore = async (id: string) => {
        try {
            await restoreSubscriber(id)
            loadData()
        } catch (error) {
            console.error('Failed to restore:', error)
        }
    }

    // Export CSV
    const handleExportCSV = () => {
        const headers = ['Email', 'Ad', 'Durum', 'Kaynak', 'Kayıt Tarihi']
        const rows = filteredSubscribers.map(sub => [
            sub.email,
            sub.name || '',
            sub.status,
            sub.source,
            new Date(sub.subscribed_at).toLocaleDateString('tr-TR')
        ])

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1><Users size={28} /> Bülten Aboneleri</h1>
                    <p>Bültene abone olan kullanıcıları yönetin</p>
                </div>
                <button onClick={handleExportCSV} className="btn btn-secondary">
                    <Download size={18} />
                    CSV İndir
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-primary)' }}>
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Toplam Abone</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-success)' }}>
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.active}</span>
                            <span className="stat-label">Aktif Abone</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-warning)' }}>
                            <Calendar size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.thisMonth}</span>
                            <span className="stat-label">Bu Ay</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: stats.growthRate >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                            <RefreshCw size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%</span>
                            <span className="stat-label">Büyüme</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="admin-filters">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Email veya isim ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    className="filter-select"
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="active">Aktif</option>
                    <option value="unsubscribed">Abonelik İptal</option>
                    <option value="bounced">Bounce</option>
                </select>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={showDeleted}
                        onChange={(e) => setShowDeleted(e.target.checked)}
                    />
                    Silinenleri Göster
                </label>
            </div>

            {/* Subscribers Table */}
            <div className="admin-table-container">
                {loading ? (
                    <div className="admin-loading">
                        <RefreshCw size={24} className="spin" />
                        Yükleniyor...
                    </div>
                ) : filteredSubscribers.length === 0 ? (
                    <div className="admin-empty">
                        <Mail size={48} />
                        <p>Henüz abone bulunmuyor</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Ad</th>
                                <th>Durum</th>
                                <th>Kaynak</th>
                                <th>Kayıt Tarihi</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredSubscribers.map((subscriber) => (
                                    <motion.tr
                                        key={subscriber.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={subscriber.deleted_at ? 'deleted-row' : ''}
                                    >
                                        <td>
                                            <div className="email-cell">
                                                <Mail size={16} />
                                                {subscriber.email}
                                            </div>
                                        </td>
                                        <td>{subscriber.name || '-'}</td>
                                        <td><StatusBadge status={subscriber.status} /></td>
                                        <td>
                                            <span className="source-badge">{subscriber.source}</span>
                                        </td>
                                        <td>
                                            {new Date(subscriber.subscribed_at).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {subscriber.deleted_at ? (
                                                    <button
                                                        onClick={() => handleRestore(subscriber.id)}
                                                        className="btn-icon btn-success"
                                                        title="Geri Yükle"
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                ) : (
                                                    <>
                                                        {subscriber.status === 'active' && (
                                                            <button
                                                                onClick={() => handleUnsubscribe(subscriber.id)}
                                                                className="btn-icon btn-warning"
                                                                title="Aboneliği İptal Et"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(subscriber.id)}
                                                            className="btn-icon btn-danger"
                                                            title="Sil"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

            <div className="admin-page-footer">
                <p>Toplam {filteredSubscribers.length} abone gösteriliyor</p>
            </div>
        </div>
    )
}
