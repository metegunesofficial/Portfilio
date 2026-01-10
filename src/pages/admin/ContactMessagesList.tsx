import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Archive, Reply, Trash2, RotateCcw, MessageSquare, Clock } from 'lucide-react'
import {
    getContactMessages,
    markMessageAsRead,
    markMessageAsReplied,
    archiveMessage,
    deleteContactMessage,
    restoreContactMessage
} from '../../services/contact'
import { useRealtimeMessages } from '../../hooks/useRealtimeSubscription'
import type { ContactMessage } from '../../types/supabase'

export function ContactMessagesList() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleted, setShowDeleted] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const navigate = useNavigate()

    const fetchMessages = useCallback(async () => {
        try {
            const options: { includeDeleted?: boolean; status?: 'new' | 'read' | 'replied' | 'archived' } = {
                includeDeleted: showDeleted
            }
            if (statusFilter !== 'all') {
                options.status = statusFilter as 'new' | 'read' | 'replied' | 'archived'
            }
            const data = await getContactMessages(options)
            setMessages(data)
        } catch (err) {
            console.error('Error fetching messages:', err)
        } finally {
            setIsLoading(false)
        }
    }, [showDeleted, statusFilter])

    useEffect(() => {
        if (!sessionStorage.getItem('admin_auth')) {
            navigate('/admin')
            return
        }
        fetchMessages()
    }, [navigate, fetchMessages])

    // Real-time subscription
    useRealtimeMessages({
        onInsert: (newMessage) => {
            setMessages(prev => [newMessage as ContactMessage, ...prev])
        },
        onUpdate: (updatedMessage) => {
            setMessages(prev => prev.map(m =>
                m.id === (updatedMessage as ContactMessage).id ? updatedMessage as ContactMessage : m
            ))
        }
    })

    const handleMarkAsRead = async (id: string) => {
        try {
            await markMessageAsRead(id)
            setMessages(messages.map(m =>
                m.id === id ? { ...m, status: 'read' as const } : m
            ))
        } catch (err) {
            console.error('Error marking as read:', err)
        }
    }

    const handleMarkAsReplied = async (id: string) => {
        try {
            await markMessageAsReplied(id)
            setMessages(messages.map(m =>
                m.id === id ? { ...m, status: 'replied' as const } : m
            ))
        } catch (err) {
            console.error('Error marking as replied:', err)
        }
    }

    const handleArchive = async (id: string) => {
        try {
            await archiveMessage(id)
            setMessages(messages.map(m =>
                m.id === id ? { ...m, status: 'archived' as const } : m
            ))
        } catch (err) {
            console.error('Error archiving:', err)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu mesajı silmek istediğinize emin misiniz? (Geri yüklenebilir)')) return
        try {
            await deleteContactMessage(id)
            setMessages(messages.map(m =>
                m.id === id ? { ...m, deleted_at: new Date().toISOString() } : m
            ))
        } catch (err) {
            console.error('Error deleting message:', err)
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreContactMessage(id)
            setMessages(messages.map(m =>
                m.id === id ? { ...m, deleted_at: null, deleted_by: null } : m
            ))
        } catch (err) {
            console.error('Error restoring message:', err)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        if (hours < 1) return 'Az önce'
        if (hours < 24) return `${hours} saat önce`
        if (days < 7) return `${days} gün önce`
        return date.toLocaleDateString('tr-TR')
    }

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; class: string }> = {
            new: { label: 'Yeni', class: 'new' },
            read: { label: 'Okundu', class: 'read' },
            replied: { label: 'Yanıtlandı', class: 'replied' },
            archived: { label: 'Arşivlendi', class: 'archived' }
        }
        return statusMap[status] || { label: status, class: '' }
    }

    const activeMessages = messages.filter(m => !m.deleted_at)
    const deletedMessages = messages.filter(m => m.deleted_at)
    const displayMessages = showDeleted ? deletedMessages : activeMessages
    const newCount = activeMessages.filter(m => m.status === 'new').length

    return (
        <div className="admin-list-page">
            <div className="admin-page-header">
                <div>
                    <h1>İletişim Mesajları</h1>
                    <p>{newCount > 0 && <span className="new-badge">{newCount} yeni mesaj</span>}</p>
                </div>
                <div className="header-actions">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="new">Yeni</option>
                        <option value="read">Okundu</option>
                        <option value="replied">Yanıtlandı</option>
                        <option value="archived">Arşivlendi</option>
                    </select>
                    <button
                        className={`btn-secondary ${showDeleted ? 'active' : ''}`}
                        onClick={() => setShowDeleted(!showDeleted)}
                    >
                        <Archive size={18} />
                        {showDeleted ? 'Aktif Mesajlar' : `Silinmişler (${deletedMessages.length})`}
                    </button>
                </div>
            </div>

            <div className="admin-content messages-layout">
                {/* Messages List */}
                <div className="messages-list">
                    {isLoading ? (
                        <div className="admin-loading">Yükleniyor...</div>
                    ) : displayMessages.length === 0 ? (
                        <div className="admin-empty">
                            <MessageSquare size={48} />
                            <h3>{showDeleted ? 'Silinmiş mesaj yok' : 'Henüz mesaj yok'}</h3>
                        </div>
                    ) : (
                        displayMessages.map(message => (
                            <div
                                key={message.id}
                                className={`message-item ${message.status === 'new' ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''} ${message.deleted_at ? 'deleted' : ''}`}
                                onClick={() => {
                                    setSelectedMessage(message)
                                    if (message.status === 'new' && !message.deleted_at) {
                                        handleMarkAsRead(message.id)
                                    }
                                }}
                            >
                                <div className="message-header">
                                    <span className="message-sender">{message.name}</span>
                                    <span className="message-time">
                                        <Clock size={12} />
                                        {formatDate(message.created_at)}
                                    </span>
                                </div>
                                <div className="message-subject">{message.subject || 'Konu Yok'}</div>
                                <div className="message-preview">
                                    {message.message.substring(0, 100)}...
                                </div>
                                <div className="message-meta">
                                    <span className={`status-badge ${getStatusBadge(message.status).class}`}>
                                        {getStatusBadge(message.status).label}
                                    </span>
                                    {message.kvkk_consent && (
                                        <span className="kvkk-badge">KVKK ✓</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Detail */}
                {selectedMessage && (
                    <div className="message-detail">
                        <div className="message-detail-header">
                            <div>
                                <h2>{selectedMessage.name}</h2>
                                <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                                {selectedMessage.phone && <p>{selectedMessage.phone}</p>}
                            </div>
                            <div className="message-actions">
                                {!selectedMessage.deleted_at && (
                                    <>
                                        <button
                                            onClick={() => handleMarkAsReplied(selectedMessage.id)}
                                            className="action-btn"
                                            title="Yanıtlandı İşaretle"
                                        >
                                            <Reply size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleArchive(selectedMessage.id)}
                                            className="action-btn"
                                            title="Arşivle"
                                        >
                                            <Archive size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(selectedMessage.id)}
                                            className="action-btn delete"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                )}
                                {selectedMessage.deleted_at && (
                                    <button
                                        onClick={() => handleRestore(selectedMessage.id)}
                                        className="action-btn restore"
                                        title="Geri Yükle"
                                    >
                                        <RotateCcw size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="message-detail-meta">
                            <span><strong>Konu:</strong> {selectedMessage.subject || 'Konu Yok'}</span>
                            <span><strong>Tarih:</strong> {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</span>
                        </div>
                        <div className="message-detail-body">
                            {selectedMessage.message}
                        </div>
                        <a
                            href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'İletişim Formu'}`}
                            className="btn-primary reply-btn"
                        >
                            <Mail size={18} />
                            E-posta ile Yanıtla
                        </a>
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
