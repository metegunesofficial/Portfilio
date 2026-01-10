// Email Campaigns Service - Kampanya yönetimi
import { getSupabaseClient } from '../lib/supabase-client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface EmailCampaign {
  id: string
  subject: string
  content_html: string
  content_text: string | null
  blog_id: string | null
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduled_at: string | null
  sent_at: string | null
  total_recipients: number
  delivered: number
  opened: number
  clicked: number
  created_at: string
  updated_at: string
  created_by: string | null
  // Joined data
  blog?: {
    title_tr: string
    title_en: string
    slug: string
  } | null
}

export interface CampaignInsert {
  subject: string
  content_html: string
  content_text?: string
  blog_id?: string
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduled_at?: string
}

export interface EmailSendLog {
  id: string
  campaign_id: string
  subscriber_id: string | null
  email: string
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
  resend_id: string | null
  sent_at: string | null
  opened_at: string | null
  clicked_at: string | null
  error_message: string | null
}

// Kampanya oluştur
export async function createCampaign(campaign: CampaignInsert): Promise<EmailCampaign> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('email_campaigns')
    .insert({
      subject: campaign.subject,
      content_html: campaign.content_html,
      content_text: campaign.content_text || null,
      blog_id: campaign.blog_id || null,
      status: campaign.status || 'draft',
      scheduled_at: campaign.scheduled_at || null
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Kampanya güncelle
export async function updateCampaign(
  id: string,
  updates: Partial<CampaignInsert>
): Promise<EmailCampaign> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('email_campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Kampanya sil
export async function deleteCampaign(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('email_campaigns')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

// Kampanyaları listele
export async function getCampaigns(options?: {
  status?: EmailCampaign['status']
  limit?: number
  offset?: number
}): Promise<{ campaigns: EmailCampaign[]; total: number }> {
  const supabase = getSupabaseClient()

  let query = supabase
    .from('email_campaigns')
    .select(`
      *,
      blog:blogs(title_tr, title_en, slug)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset !== undefined) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { campaigns: data || [], total: count || 0 }
}

// Tek kampanya getir
export async function getCampaignById(id: string): Promise<EmailCampaign | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('email_campaigns')
    .select(`
      *,
      blog:blogs(title_tr, title_en, slug)
    `)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data
}

// Kampanya gönderim loglarını getir
export async function getCampaignSendLogs(campaignId: string): Promise<EmailSendLog[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('email_send_log')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('sent_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

// Kampanya istatistikleri
export interface CampaignStats {
  totalCampaigns: number
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  avgOpenRate: number
  avgClickRate: number
}

export async function getCampaignStats(): Promise<CampaignStats> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('email_campaigns')
    .select('total_recipients, delivered, opened, clicked')
    .eq('status', 'sent')

  if (error) throw new Error(error.message)

  const campaigns = data || []
  const totalCampaigns = campaigns.length
  const totalSent = campaigns.reduce((sum, c) => sum + c.total_recipients, 0)
  const totalDelivered = campaigns.reduce((sum, c) => sum + c.delivered, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0)

  return {
    totalCampaigns,
    totalSent,
    totalDelivered,
    totalOpened,
    totalClicked,
    avgOpenRate: totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0,
    avgClickRate: totalOpened > 0 ? Math.round((totalClicked / totalOpened) * 100) : 0
  }
}

// Blog'dan kampanya oluştur
export async function createCampaignFromBlog(
  blogId: string,
  lang: 'tr' | 'en' = 'tr'
): Promise<EmailCampaign> {
  const supabase = getSupabaseClient()

  // Blog bilgilerini getir
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', blogId)
    .single()

  if (blogError || !blog) {
    throw new Error('Blog bulunamadı')
  }

  const title = lang === 'tr' ? blog.title_tr : blog.title_en
  const excerpt = lang === 'tr' ? blog.excerpt_tr : blog.excerpt_en
  // content is available in blog object if needed for full email body

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://metegunes.com'
  const blogUrl = `${siteUrl}/${lang}/blog/${blog.slug}`

  // Email HTML oluştur
  const contentHtml = generateBlogEmailHtml({
    title,
    excerpt: excerpt || '',
    blogUrl,
    emoji: blog.emoji || '📝',
    category: blog.category || 'Genel'
  })

  const contentText = `${title}\n\n${excerpt}\n\nDevamını oku: ${blogUrl}`

  return createCampaign({
    subject: `${blog.emoji || '📝'} ${title}`,
    content_html: contentHtml,
    content_text: contentText,
    blog_id: blogId,
    status: 'draft'
  })
}

// Blog email HTML şablonu
export function generateBlogEmailHtml(params: {
  title: string
  excerpt: string
  blogUrl: string
  emoji: string
  category: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Mete Güneş
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Yeni Blog Yazısı 🎉
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <span style="display: inline-block; background-color: #f0f9ff; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; margin-bottom: 16px;">
                ${params.category}
              </span>
              
              <h2 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #18181b; line-height: 1.3;">
                ${params.emoji} ${params.title}
              </h2>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #52525b;">
                ${params.excerpt}
              </p>
              
              <a href="${params.blogUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Devamını Oku →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 32px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #71717a; text-align: center;">
                Bu e-postayı bültenime abone olduğunuz için aldınız.
              </p>
              <p style="margin: 0; font-size: 14px; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #6366f1; text-decoration: underline;">
                  Abonelikten çık
                </a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Kampanya durumunu güncelle
export async function updateCampaignStatus(
  id: string,
  status: EmailCampaign['status'],
  additionalData?: Partial<EmailCampaign>
): Promise<EmailCampaign> {
  const supabase = getSupabaseClient()

  const updates: Record<string, unknown> = { status, ...additionalData }

  if (status === 'sent') {
    updates.sent_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('email_campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Real-time subscription for campaigns
export function subscribeToCampaignsChanges(
  callback: (payload: { eventType: string; new: EmailCampaign | null; old: EmailCampaign | null }) => void
): RealtimeChannel {
  const supabase = getSupabaseClient()
  return supabase
    .channel('email_campaigns_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'email_campaigns' },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as EmailCampaign | null,
          old: payload.old as EmailCampaign | null
        })
      }
    )
    .subscribe()
}
