# 📋 Yapılacaklar Listesi - Portfolio Projesi

## 🔴 Domain Alındığında Yapılacaklar

### 1. Resend Domain Verification
Domain aldıktan sonra email gönderimini kendi domain'inden yapmak için:

1. **Resend Dashboard'a git**: https://resend.com/domains
2. **"Add Domain" tıkla** ve domain'ini gir (örn: `metegunes.com`)
3. **DNS Kayıtlarını Ekle** (domain sağlayıcından):

   | Tip | Name | Value |
   |-----|------|-------|
   | TXT | @ | `v=spf1 include:_spf.resend.com ~all` |
   | CNAME | resend._domainkey | *(Resend verecek)* |
   | TXT | _dmarc | `v=DMARC1; p=none;` |

4. **Doğrulama Bekle** (5-10 dakika)
5. **Supabase Secret Güncelle**:
   - `NEWSLETTER_FROM_EMAIL` → `mete@senindomain.com`
   - `SITE_URL` → `https://senindomain.com`

### 2. Production Deployment
- [ ] Vercel/Cloudflare'a deploy et
- [ ] Environment variables'ları production'a ekle
- [ ] SSL sertifikası aktif mi kontrol et

### 3. SEO & Analytics
- [ ] Google Analytics ID ekle (VITE_GA_ID)
- [ ] Google Search Console'a site ekle
- [ ] Sitemap.xml oluştur
- [ ] robots.txt güncelle

---

## ✅ Tamamlanan Özellikler

### Newsletter Email System (10 Ocak 2026)
- [x] Newsletter subscription (Supabase entegrasyonu)
- [x] Admin Subscribers sayfası
- [x] Admin Campaigns sayfası
- [x] Edge Functions (send-newsletter, unsubscribe)
- [x] Resend API entegrasyonu
- [x] Unsubscribe token sistemi (KVKK uyumlu)
- [x] Unit tests (321 test geçti)

### Database
- [x] Supabase kurulumu
- [x] RLS policies
- [x] Migration'lar

---

## 🟡 Opsiyonel İyileştirmeler

- [ ] Admin kampanya editörü (full WYSIWYG)
- [ ] Blog yayınlandığında otomatik kampanya
- [ ] Email tracking (açılma, tıklama)
- [ ] A/B testing desteği
- [ ] Subscriber segmentasyonu
