# Faz 4: Legal, Launch & Monitoring

## Özet
Bu faz, yasal uyumluluk (KVKK/GDPR), production deployment hazırlığı ve lansman sonrası izlemeyi kapsar. Sitenin canlıya çıkması için son gerekli adımlar.

---

## Deliverables

### 1. KVKK/GDPR Aydınlatma Metni
**Dosyalar:**
- `src/pages/PrivacyPolicyPage.tsx` (yeni)
- `src/components/ContactForm.tsx` (checkbox ekleme)

**Yapılacaklar:**
- [ ] Privacy Policy sayfası oluştur
- [ ] Router'a ekle: `/privacy-policy`
- [ ] Footer'a link ekle
- [ ] İletişim formuna consent checkbox

**Aydınlatma Metni İçeriği:**
```markdown
# Gizlilik Politikası

## 1. Veri Sorumlusu
Mete Güneş
E-posta: contact@metegunes.dev

## 2. Toplanan Veriler
İletişim formu aracılığıyla toplanan:
- Ad soyad
- E-posta adresi
- Mesaj içeriği

## 3. Verilerin İşlenme Amacı
- İletişim taleplerini yanıtlama
- Profesyonel hizmet sunumu

## 4. Verilerin Saklanması
- Supabase bulut veritabanında güvenli şekilde saklanır
- 2 yıl sonra otomatik silinir

## 5. Haklarınız (KVKK Madde 11)
- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse bilgi talep etme
- Düzeltilmesini veya silinmesini isteme
- Verilerin aktarıldığı üçüncü kişileri bilme

## 6. İletişim
Haklarınız için: contact@metegunes.dev
```

**Contact Form Consent:**
```tsx
<label className="consent-checkbox">
  <input 
    type="checkbox" 
    required 
    checked={consent}
    onChange={(e) => setConsent(e.target.checked)}
  />
  <span>
    <a href="/privacy-policy" target="_blank">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
  </span>
</label>
```

---

### 2. Cookie Consent (Opsiyonel)
**Dosya:** `src/components/CookieConsent.tsx` (yeni)

**Durum Değerlendirmesi:**
- GA4 first-party cookies → Genelde consent gerekmez
- Supabase session → Essential cookie → Exempt

**Eğer gerekirse:**
- [ ] Simple cookie banner
- [ ] Accept/Reject buttons
- [ ] localStorage ile tercih saklama
- [ ] GA4'ü consent sonrası başlatma

---

### 3. Production Environment Hazırlığı
**Dosyalar:**
- `.env.production`
- `vercel.json` veya `netlify.toml`

**Yapılacaklar:**
- [ ] Production environment variables
- [ ] Build optimization flags
- [ ] Hosting konfigürasyonu
- [ ] Custom domain setup

**Environment Variables:**
```env
# .env.production
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://metegunes.dev
```

**Vercel Config:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

### 4. Launch Checklist
**Pre-Launch:**
- [ ] Domain satın alındı
- [ ] DNS ayarları yapıldı (A/CNAME)
- [ ] SSL sertifikası aktif (otomatik)
- [ ] Environment variables production'da set
- [ ] Supabase RLS politikaları test edildi
- [ ] 404 sayfası çalışıyor
- [ ] Favicon ve apple-touch-icon eklendi
- [ ] robots.txt ve sitemap.xml hazır
- [ ] OG image (1200x630) hazır
- [ ] Analytics kodu test edildi
- [ ] Contact form test edildi

**Launch Day:**
- [ ] Production build başarılı: `npm run build`
- [ ] Build size kontrolü: < 500KB gzipped
- [ ] Deploy: `vercel --prod` veya Netlify deploy
- [ ] DNS propagation kontrolü: https://dnschecker.org
- [ ] HTTPS çalışıyor
- [ ] Tüm sayfalar erişilebilir
- [ ] İletişim formu production'da test

**Post-Launch:**
- [ ] Google Search Console'a site eklendi
- [ ] sitemap.xml submit edildi
- [ ] Analytics real-time veri kontrolü
- [ ] Lighthouse audit (tüm sayfalar)
- [ ] Security headers kontrolü
- [ ] Mobil test (gerçek cihazda)
- [ ] Sosyal medya duyurusu

---

### 5. Monitoring & Alerting Setup
**Araçlar:**

1. **Uptime Monitoring:**
   - Better Uptime (free tier)
   - UptimeRobot
   - Check interval: 5 dakika

2. **Error Tracking:**
   - Sentry (free tier: 5K events/mo)
   - Supabase logs

3. **Performance Monitoring:**
   - Google Search Console
   - PageSpeed Insights scheduled checks

**Sentry Setup (Opsiyonel):**
```bash
npm install @sentry/react
```

```tsx
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

---

### 6. Dokümantasyon
**Dosyalar:**
- `README.md` (güncelleme)
- `CONTRIBUTING.md` (opsiyonel)

**README Güncelleme:**
```markdown
# Portfolio Website

## Tech Stack
- React 19 + Vite 7
- TypeScript 5.9
- Tailwind CSS 3.4
- Supabase (Auth + Database)
- Framer Motion

## Getting Started
1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npm run dev`

## Deployment
- Production: Vercel
- Preview: Automatic on PR

## Environment Variables
| Variable | Description |
|----------|-------------|
| VITE_SUPABASE_URL | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key |
| VITE_GA_MEASUREMENT_ID | Google Analytics ID |
```

---

## Test Stratejisi

### Manuel Test - Launch Day

1. **Smoke Test:**
   - [ ] / → homepage yüklenişor
   - [ ] /about → about sayfası
   - [ ] /products-listing → portfolio
   - [ ] /contact → form çalışıyor
   - [ ] /blogs → blog listesi
   - [ ] /privacy-policy → legal sayfa

2. **Form Test (Production):**
   - [ ] İletişim formu gönder
   - [ ] Supabase dashboard'da veri var
   - [ ] Rate limiting çalışıyor

3. **Cross-Browser Test:**
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Edge (latest)
   - [ ] Mobile Chrome (Android)
   - [ ] Mobile Safari (iOS)

4. **Legal Compliance Test:**
   - [ ] Privacy policy sayfası erişilebilir
   - [ ] Contact form consent checkbox zorunlu
   - [ ] Footer'da privacy link var

---

## Tahmini Süre

| Görev | Süre |
|-------|------|
| Privacy Policy | 2-3 saat |
| Cookie Consent (opsiyonel) | 1-2 saat |
| Production Config | 1-2 saat |
| Launch Checklist | 2-3 saat |
| Monitoring Setup | 1-2 saat |
| Documentation | 1-2 saat |
| **Toplam** | **8-14 saat** |

---

## Başarı Kriterleri

- [ ] Site canlıda: https://metegunes.dev
- [ ] SSL aktif (https)
- [ ] Privacy policy sayfası mevcut
- [ ] Contact form consent checkbox var
- [ ] Analytics veri topluyor
- [ ] Uptime monitoring aktif
- [ ] Google Search Console'da sitemap
- [ ] Lighthouse tüm metrikler ≥ 90
- [ ] README güncel

---

## Post-Launch Maintenance

### Haftalık
- Analytics review
- Error log kontrolü
- Uptime report

### Aylık
- Security dependency update
- Content freshness check
- Performance audit

### Quarterly
- Full Lighthouse audit
- A/B test review
- İçerik güncellemesi
