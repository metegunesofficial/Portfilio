# Supabase Konfigürasyon Bilgileri

## Proje Bilgileri

| Özellik | Değer |
|---------|-------|
| **Proje Adı** | PortfolioSite |
| **Proje ID** | `bkblxxtqacppxrqznwco` |
| **Bölge** | ap-southeast-1 |
| **Durum** | ACTIVE_HEALTHY |

## API Endpoints

| Endpoint | URL |
|----------|-----|
| **Project URL** | `https://bkblxxtqacppxrqznwco.supabase.co` |
| **REST API** | `https://bkblxxtqacppxrqznwco.supabase.co/rest/v1/` |
| **Auth API** | `https://bkblxxtqacppxrqznwco.supabase.co/auth/v1/` |
| **Storage API** | `https://bkblxxtqacppxrqznwco.supabase.co/storage/v1/` |
| **Realtime API** | `wss://bkblxxtqacppxrqznwco.supabase.co/realtime/v1/` |

## API Keys

> ⚠️ **GÜVENLİK:** API Key'ler `.env.local` dosyasında saklanmaktadır. 
> Bu dosya git'e dahil değildir.

| Key Tipi | Kullanım |
|----------|----------|
| **Publishable Key (anon)** | Client-side, RLS korumalı |
| **Service Role Key** | Server-side only, RLS bypass - **.env.local'da sakla!** |

## Database Schema

### Tablolar

| Tablo | Açıklama | RLS |
|-------|----------|-----|
| `profiles` | Kullanıcı profilleri (auth ile bağlantılı) | ✅ |
| `blogs` | Blog yazıları (TR/EN) | ✅ |
| `projects` | Portföy projeleri (TR/EN) | ✅ |
| `settings` | Site ayarları (key-value) | ✅ |
| `testimonials` | Referanslar/Yorumlar | ✅ |
| `contact_messages` | İletişim form mesajları | ✅ |
| `newsletter_subscribers` | Newsletter aboneleri | ✅ |
| `page_views` | Sayfa görüntüleme analytics | ✅ |

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

## Environment Variables Template

```env
# .env.local dosyasında sakla (git'e EKLEME!)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
# Server-side only:
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Güvenlik Notları

⚠️ **ASLA şunları yapma:**
- Service Role Key'i client-side kodda kullanma
- API key'leri git'e commit etme
- RLS'i devre dışı bırakma
- Secret'ları markdown dosyalarına yazma

✅ **Her zaman:**
- Publishable key ile client-side işlemler yap
- Service Role key sadece server-side API rotalarında kullan
- Tüm tablolarda RLS aktif tut
- Secret'ları sadece .env.local'da sakla
