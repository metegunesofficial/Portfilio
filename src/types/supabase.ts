// Supabase şema tipleri - Otomatik oluşturuldu
// Son güncelleme: 2026-01-09

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Soft delete alanları için ortak tip
export type SoftDeleteFields = {
  deleted_at: string | null
  deleted_by: string | null
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          updated_at?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          id: string
          title_tr: string
          title_en: string
          slug: string
          excerpt_tr: string | null
          excerpt_en: string | null
          content_tr: string | null
          content_en: string | null
          category: string | null
          emoji: string
          published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          deleted_by: string | null
        }
        Insert: {
          id?: string
          title_tr: string
          title_en: string
          slug: string
          excerpt_tr?: string | null
          excerpt_en?: string | null
          content_tr?: string | null
          content_en?: string | null
          category?: string | null
          emoji?: string
          published?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Update: {
          title_tr?: string
          title_en?: string
          slug?: string
          excerpt_tr?: string | null
          excerpt_en?: string | null
          content_tr?: string | null
          content_en?: string | null
          category?: string | null
          emoji?: string
          published?: boolean
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          title_tr: string
          title_en: string
          slug: string
          description_tr: string | null
          description_en: string | null
          content_tr: string | null
          content_en: string | null
          category: string | null
          tech: string[]
          link: string | null
          image_url: string | null
          featured: boolean
          order_index: number
          published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          deleted_by: string | null
        }
        Insert: {
          id?: string
          title_tr: string
          title_en: string
          slug: string
          description_tr?: string | null
          description_en?: string | null
          content_tr?: string | null
          content_en?: string | null
          category?: string | null
          tech?: string[]
          link?: string | null
          image_url?: string | null
          featured?: boolean
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Update: {
          title_tr?: string
          title_en?: string
          slug?: string
          description_tr?: string | null
          description_en?: string | null
          content_tr?: string | null
          content_en?: string | null
          category?: string | null
          tech?: string[]
          link?: string | null
          image_url?: string | null
          featured?: boolean
          order_index?: number
          published?: boolean
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string
          value_tr: string | null
          value_en: string | null
          type: string
          updated_at: string
          deleted_at: string | null
          deleted_by: string | null
        }
        Insert: {
          id?: string
          key: string
          value_tr?: string | null
          value_en?: string | null
          type?: string
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Update: {
          key?: string
          value_tr?: string | null
          value_en?: string | null
          type?: string
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role_tr: string | null
          role_en: string | null
          company: string | null
          avatar_url: string | null
          quote_tr: string
          quote_en: string
          rating: number
          featured: boolean
          order_index: number
          published: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
          deleted_by: string | null
        }
        Insert: {
          id?: string
          name: string
          role_tr?: string | null
          role_en?: string | null
          company?: string | null
          avatar_url?: string | null
          quote_tr: string
          quote_en: string
          rating?: number
          featured?: boolean
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Update: {
          name?: string
          role_tr?: string | null
          role_en?: string | null
          company?: string | null
          avatar_url?: string | null
          quote_tr?: string
          quote_en?: string
          rating?: number
          featured?: boolean
          order_index?: number
          published?: boolean
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          kvkk_consent: boolean
          ip_address: string | null
          user_agent: string | null
          status: 'new' | 'read' | 'replied' | 'archived'
          created_at: string
          updated_at: string
          deleted_at: string | null
          deleted_by: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          kvkk_consent?: boolean
          ip_address?: string | null
          user_agent?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Update: {
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          kvkk_consent?: boolean
          ip_address?: string | null
          user_agent?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          updated_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          status: 'active' | 'unsubscribed' | 'bounced'
          source: string
          ip_address: string | null
          subscribed_at: string
          unsubscribed_at: string | null
          deleted_at: string | null
          deleted_by: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          status?: 'active' | 'unsubscribed' | 'bounced'
          source?: string
          ip_address?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Update: {
          email?: string
          name?: string | null
          status?: 'active' | 'unsubscribed' | 'bounced'
          source?: string
          ip_address?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: string
          path: string
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          country: string | null
          device_type: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          path: string
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          country?: string | null
          device_type?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          path?: string
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          country?: string | null
          device_type?: string | null
          session_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      data_backups: {
        Row: {
          id: string
          table_name: string
          record_id: string
          operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'RESTORE'
          old_data: Json | null
          new_data: Json | null
          changed_by: string | null
          changed_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'RESTORE'
          old_data?: Json | null
          new_data?: Json | null
          changed_by?: string | null
          changed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          table_name?: string
          record_id?: string
          operation?: 'INSERT' | 'UPDATE' | 'DELETE' | 'RESTORE'
          old_data?: Json | null
          new_data?: Json | null
          changed_by?: string | null
          changed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      unsubscribe_tokens: {
        Row: {
          id: string
          subscriber_id: string
          token: string
          created_at: string
          used_at: string | null
        }
        Insert: {
          id?: string
          subscriber_id: string
          token: string
          created_at?: string
          used_at?: string | null
        }
        Update: {
          subscriber_id?: string
          token?: string
          created_at?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'unsubscribe_tokens_subscriber_id_fkey'
            columns: ['subscriber_id']
            referencedRelation: 'newsletter_subscribers'
            referencedColumns: ['id']
          }
        ]
      }
      email_campaigns: {
        Row: {
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
        }
        Insert: {
          id?: string
          subject: string
          content_html: string
          content_text?: string | null
          blog_id?: string | null
          status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number
          delivered?: number
          opened?: number
          clicked?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          subject?: string
          content_html?: string
          content_text?: string | null
          blog_id?: string | null
          status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number
          delivered?: number
          opened?: number
          clicked?: number
          updated_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'email_campaigns_blog_id_fkey'
            columns: ['blog_id']
            referencedRelation: 'blogs'
            referencedColumns: ['id']
          }
        ]
      }
      email_send_log: {
        Row: {
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
        Insert: {
          id?: string
          campaign_id: string
          subscriber_id?: string | null
          email: string
          status?: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
          resend_id?: string | null
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          error_message?: string | null
        }
        Update: {
          campaign_id?: string
          subscriber_id?: string | null
          email?: string
          status?: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
          resend_id?: string | null
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          error_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'email_send_log_campaign_id_fkey'
            columns: ['campaign_id']
            referencedRelation: 'email_campaigns'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'email_send_log_subscriber_id_fkey'
            columns: ['subscriber_id']
            referencedRelation: 'newsletter_subscribers'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      soft_delete: {
        Args: { p_table_name: string; p_record_id: string }
        Returns: boolean
      }
      restore_record: {
        Args: { p_table_name: string; p_record_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Type aliases for common use
export type Profile = Tables<'profiles'>
export type Blog = Tables<'blogs'>
export type Project = Tables<'projects'>
export type Setting = Tables<'settings'>
export type Testimonial = Tables<'testimonials'>
export type ContactMessage = Tables<'contact_messages'>
export type NewsletterSubscriber = Tables<'newsletter_subscribers'>
export type PageView = Tables<'page_views'>
export type DataBackup = Tables<'data_backups'>
export type UnsubscribeToken = Tables<'unsubscribe_tokens'>
export type EmailCampaign = Tables<'email_campaigns'>
export type EmailSendLogRow = Tables<'email_send_log'>

// Active (non-deleted) types
export type ActiveBlog = Omit<Blog, 'deleted_at' | 'deleted_by'> & { deleted_at: null }
export type ActiveProject = Omit<Project, 'deleted_at' | 'deleted_by'> & { deleted_at: null }
export type ActiveTestimonial = Omit<Testimonial, 'deleted_at' | 'deleted_by'> & { deleted_at: null }
