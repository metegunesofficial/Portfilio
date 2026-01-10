// Admin Email Campaigns Page - Kampanya yönetimi
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Mail, Plus, Send, Clock, CheckCircle, XCircle,
    Eye, Trash2, RefreshCw, BarChart3, Users, MousePointer
} from 'lucide-react'
import {
    getCampaigns,
    getCampaignStats,
    deleteCampaign,
    updateCampaignStatus,
    type EmailCampaign,
    type CampaignStats,
    subscribeToCampaignsChanges
} from '../../services/email-campaigns'
import { getActiveSubscribers } from '../../services/newsletter'

interface NewCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

function NewCampaignModal({ isOpen, onClose, onSuccess: _onSuccess }: NewCampaignModalProps) {
    // Simplified modal for now
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Yeni Kampanya</h2>
                <p>Bu özellik yakında eklenecek. Şimdilik blog yayınlandığında otomatik kampanya oluşturulacak.</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-secondary">Kapat</button>
                </div>
            </div>
        </div>
    )
}

export function AdminCampaigns() {
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
    const [stats, setStats] = useState<CampaignStats | null>(null)
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showNewModal, setShowNewModal] = useState(false)
    const [sending, setSending] = useState<string | null>(null)

    useEffect(() => {
        loadData()

        const channel = subscribeToCampaignsChanges(() => {
            loadData()
        })

        return () => {
            channel.unsubscribe()
        }
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [campaignData, campaignStats, subscribers] = await Promise.all([
                getCampaigns({ limit: 50 }),
                getCampaignStats(),
                getActiveSubscribers()
            ])
            setCampaigns(campaignData.campaigns)
            setStats(campaignStats)
            setSubscriberCount(subscribers.length)
        } catch (error) {
            console.error('Failed to load campaigns:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSendCampaign = async (id: string) => {
        if (!confirm(`Bu kampanyayı ${subscriberCount} aboneye göndermek istediğinize emin misiniz?`)) return

        try {
            setSending(id)
            // Edge Function'ı çağır (henüz oluşturulmadı)
            await updateCampaignStatus(id, 'sending')

            // TODO: Edge function çağrısı
            // const response = await fetch('/api/send-newsletter', {
            //   method: 'POST',
            //   body: JSON.stringify({ campaignId: id })
            // })

            alert('Kampanya gönderim kuyruğuna alındı. (Edge Function henüz aktif değil)')
        } catch (error) {
            console.error('Failed to send campaign:', error)
            alert('Kampanya gönderilemedi: ' + error)
        } finally {
            setSending(null)
            loadData()
        }
    }

    const handleDeleteCampaign = async (id: string) => {
        if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return

        try {
            await deleteCampaign(id)
            loadData()
        } catch (error) {
            console.error('Failed to delete campaign:', error)
        }
    }

    const StatusBadge = ({ status }: { status: EmailCampaign['status'] }) => {
        const config: Record<EmailCampaign['status'], { icon: typeof Clock; color: string; label: string }> = {
            draft: { icon: Clock, color: 'var(--color-text-subtle)', label: 'Taslak' },
            scheduled: { icon: Clock, color: 'var(--color-warning)', label: 'Planlandı' },
            sending: { icon: RefreshCw, color: 'var(--color-primary)', label: 'Gönderiliyor' },
            sent: { icon: CheckCircle, color: 'var(--color-success)', label: 'Gönderildi' },
            failed: { icon: XCircle, color: 'var(--color-error)', label: 'Başarısız' }
        }
        const { icon: Icon, color, label } = config[status]
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color, fontSize: '13px' }}>
                <Icon size={14} className={status === 'sending' ? 'spin' : ''} />
                {label}
            </span>
        )
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1><Mail size={28} /> Email Kampanyaları</h1>
                    <p>Bülten abonelerinize email gönderin</p>
                </div>
                <button onClick={() => setShowNewModal(true)} className="btn btn-primary">
                    <Plus size={18} />
                    Yeni Kampanya
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-primary)' }}>
                            <Mail size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalCampaigns}</span>
                            <span className="stat-label">Toplam Kampanya</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-success)' }}>
                            <Send size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalSent.toLocaleString()}</span>
                            <span className="stat-label">Gönderilen</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-warning)' }}>
                            <Eye size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.avgOpenRate}%</span>
                            <span className="stat-label">Açılma Oranı</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-accent)' }}>
                            <MousePointer size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.avgClickRate}%</span>
                            <span className="stat-label">Tıklama Oranı</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Subscribers Info */}
            <div className="admin-info-banner">
                <Users size={20} />
                <span><strong>{subscriberCount}</strong> aktif abone kampanya gönderimi için hazır</span>
            </div>

            {/* Campaigns Table */}
            <div className="admin-table-container">
                {loading ? (
                    <div className="admin-loading">
                        <RefreshCw size={24} className="spin" />
                        Yükleniyor...
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="admin-empty">
                        <Mail size={48} />
                        <p>Henüz kampanya bulunmuyor</p>
                        <button onClick={() => setShowNewModal(true)} className="btn btn-primary">
                            İlk Kampanyayı Oluştur
                        </button>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Konu</th>
                                <th>Durum</th>
                                <th>Alıcı</th>
                                <th>Açılma</th>
                                <th>Tıklama</th>
                                <th>Tarih</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {campaigns.map((campaign) => (
                                    <motion.tr
                                        key={campaign.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td>
                                            <div className="campaign-subject">
                                                <strong>{campaign.subject}</strong>
                                                {campaign.blog && (
                                                    <span className="blog-badge">Blog: {campaign.blog.title_tr}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td><StatusBadge status={campaign.status} /></td>
                                        <td>{campaign.total_recipients.toLocaleString()}</td>
                                        <td>
                                            {campaign.delivered > 0 ? (
                                                <span className="stat-inline">
                                                    {campaign.opened} ({Math.round((campaign.opened / campaign.delivered) * 100)}%)
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {campaign.opened > 0 ? (
                                                <span className="stat-inline">
                                                    {campaign.clicked} ({Math.round((campaign.clicked / campaign.opened) * 100)}%)
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {campaign.sent_at
                                                ? new Date(campaign.sent_at).toLocaleDateString('tr-TR')
                                                : new Date(campaign.created_at).toLocaleDateString('tr-TR')
                                            }
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {campaign.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleSendCampaign(campaign.id)}
                                                        className="btn-icon btn-success"
                                                        title="Gönder"
                                                        disabled={sending === campaign.id}
                                                    >
                                                        {sending === campaign.id ? (
                                                            <RefreshCw size={16} className="spin" />
                                                        ) : (
                                                            <Send size={16} />
                                                        )}
                                                    </button>
                                                )}
                                                {campaign.status !== 'sending' && (
                                                    <button
                                                        onClick={() => handleDeleteCampaign(campaign.id)}
                                                        className="btn-icon btn-danger"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-icon"
                                                    title="İstatistikler"
                                                >
                                                    <BarChart3 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

            <NewCampaignModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                onSuccess={() => {
                    setShowNewModal(false)
                    loadData()
                }}
            />
        </div>
    )
}
