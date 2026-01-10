# Supabase Konfigürasyon Bilgileri

## Proje Bilgileri

| Özellik | Değer |
|---------|-------|
| **Proje Adı** | PortfolioSite |
| **Proje ID** | `bkblxxtqacppxrqznwco` |
| **Bölge** | ap-southeast-1 |
| **Durum** | ACTIVE_HEALTHY |
| **Oluşturulma** | 2026-01-09 |

## API Endpoints

| Endpoint | URL |
|----------|-----|
| **Project URL** | `https://bkblxxtqacppxrqznwco.supabase.co` |
| **REST API** | `https://bkblxxtqacppxrqznwco.supabase.co/rest/v1/` |
| **Auth API** | `https://bkblxxtqacppxrqznwco.supabase.co/auth/v1/` |
| **Storage API** | `https://bkblxxtqacppxrqznwco.supabase.co/storage/v1/` |
| **Realtime API** | `wss://bkblxxtqacppxrqznwco.supabase.co/realtime/v1/` |
| **Database** | `db.bkblxxtqacppxrqznwco.supabase.co` |

## API Keys

| Key Tipi | Değer | Kullanım |
|----------|-------|----------|
| **Publishable Key** | `sb_publishable__UgfDZkjIldOG9EbHk1RLg_AbmUU_Nv` | Client-side, RLS korumalı |
| **Service Role Key** | `sb_secret_RhRKn0IgIRTksmUOFpYEag_aqlwzbuj` | Server-side only, RLS bypass |

## JWT Keys

| Durum | Key ID | Tip |
|-------|--------|-----|
| Current | `c2e7dcfc-ee15-4be3-877b-1cfa99057d75` | ECC (P-256) |
| Previous | `7a4654dc-d9df-4a5b-9ae9-89026dda828c` | Legacy HS256 |

## MCP Connection

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=bkblxxtqacppxrqznwco"
    }
  }
}
```

## Database Schema

### Tablolar

| Tablo | Açıklama | RLS | Kayıt |
|-------|----------|-----|-------|
| `profiles` | Kullanıcı profilleri (auth ile bağlantılı) | ✅ | - |
| `blogs` | Blog yazıları (TR/EN) | ✅ | 2 |
| `projects` | Portföy projeleri (TR/EN) | ✅ | 3 |
| `settings` | Site ayarları (key-value) | ✅ | 7 |
| `testimonials` | Referanslar/Yorumlar | ✅ | 3 |
| `contact_messages` | İletişim form mesajları | ✅ | - |
| `newsletter_subscribers` | Newsletter aboneleri | ✅ | - |
| `page_views` | Sayfa görüntüleme analytics | ✅ | - |

### RLS Politikaları

| Tablo | Public Read | Public Write | Auth Read | Auth Write |
|-------|-------------|--------------|-----------|------------|
| profiles | ✅ | ❌ | ✅ | ✅ (own) |
| blogs | ✅ (published) | ❌ | ✅ | ✅ |
| projects | ✅ (published) | ❌ | ✅ | ✅ |
| settings | ✅ | ❌ | ✅ | ✅ |
| testimonials | ✅ (published) | ❌ | ✅ | ✅ |
| contact_messages | ❌ | ✅ (insert) | ✅ | ✅ |
| newsletter_subscribers | ❌ | ✅ (insert) | ✅ | ✅ |
| page_views | ❌ | ✅ (insert) | ✅ | ❌ |

### Migrations

1. `initial_schema_blogs_projects_settings` - Ana tablolar
2. `enable_rls_policies` - RLS politikaları
3. `seed_initial_data` - Örnek veriler
4. `add_profiles_table` - Kullanıcı profilleri
5. `add_contact_messages_table` - İletişim mesajları
6. `add_testimonials_table` - Referanslar
7. `add_newsletter_subscribers_table` - Newsletter
8. `add_page_views_table` - Analytics
9. `add_updated_at_trigger` - Otomatik timestamp güncelleme

## Environment Variables

```env
# .env.local dosyasında saklanıyor
VITE_SUPABASE_URL=https://bkblxxtqacppxrqznwco.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable__UgfDZkjIldOG9EbHk1RLg_AbmUU_Nv
SUPABASE_SERVICE_ROLE_KEY=sb_secret_RhRKn0IgIRTksmUOFpYEag_aqlwzbuj
```

## Güvenlik Notları

⚠️ **ASLA şunları yapma:**
- Service Role Key'i client-side kodda kullanma
- API key'leri git'e commit etme
- RLS'i devre dışı bırakma

✅ **Her zaman:**
- Publishable key ile client-side işlemler yap
- Service Role key sadece server-side API rotalarında kullan
- Tüm tablolarda RLS aktif tut
