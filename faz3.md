# Faz 3: SEO, Analytics & Performans Optimizasyonu

## Özet
Bu faz, sitenin arama motorları ve AI arama motorlarında görünürlüğünü artırmak, kullanıcı davranışını izlemek ve Core Web Vitals hedeflerini karşılamak için teknik optimizasyonları kapsar.

---

## Deliverables

### 1. Meta Tags Optimizasyonu
**Dosyalar:**
- `index.html` (base tags)
- `src/utils/seo.ts` (yeni - helper fonksiyonlar)
- Her sayfa component'ı (document.title)

**Yapılacaklar:**
- [ ] Title tag formatı standardize
- [ ] Meta description her sayfa için
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] Canonical URL
- [ ] Robots meta tag

**Meta Tag Template:**
```tsx
// src/utils/seo.ts
export function updateMetaTags(config: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}) {
  document.title = `${config.title} | Mete Güneş - AI & Otomasyon Uzmanı`;
  
  // Meta description
  updateMeta('description', config.description);
  
  // Open Graph
  updateMeta('og:title', config.title, 'property');
  updateMeta('og:description', config.description, 'property');
  updateMeta('og:image', config.image || '/og-image.png', 'property');
  updateMeta('og:type', config.type || 'website', 'property');
  
  // Twitter
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', config.title);
  updateMeta('twitter:description', config.description);
}
```

**Sayfa Bazlı Meta:**
| Sayfa | Title | Description |
|-------|-------|-------------|
| Home | Ana Sayfa | Mete Güneş - AI ve otomasyon çözümleri sunan yazılım geliştirici. Projeler, referanslar ve iletişim. |
| About | Hakkımda | Mete Güneş hakkında: Deneyim, beceriler, eğitim ve profesyonel yolculuk. |
| Products | Portföy | AI, otomasyon ve web geliştirme projelerim. Case study'ler ve başarı hikayeleri. |
| Contact | İletişim | Mete Güneş ile iletişime geçin. Proje teklifleri ve işbirliği için form. |
| Blog | Blog | Teknoloji, kariyer ve AI hakkında yazılar ve paylaşımlar. |

---

### 2. Structured Data (JSON-LD Schema.org)
**Dosyalar:**
- `src/utils/schema.ts` (yeni)
- `index.html` (script injection)

**Yapılacaklar:**
- [ ] Person schema (site sahibi)
- [ ] WebSite schema
- [ ] BreadcrumbList schema
- [ ] Article schema (blog yazıları)
- [ ] Service schema (hizmetler)

**Person Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mete Güneş",
  "jobTitle": "AI & Automation Specialist",
  "url": "https://metegunes.dev",
  "sameAs": [
    "https://linkedin.com/in/metegunes",
    "https://github.com/metegunes"
  ],
  "knowsAbout": ["Artificial Intelligence", "Automation", "Web Development"],
  "email": "contact@metegunes.dev",
  "image": "https://metegunes.dev/profile.jpg"
}
```

---

### 3. sitemap.xml & robots.txt
**Dosyalar:**
- `public/sitemap.xml`
- `public/robots.txt`

**sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://metegunes.dev/</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://metegunes.dev/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://metegunes.dev/products-listing</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://metegunes.dev/blogs</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://metegunes.dev/contact</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /login
Disallow: /register
Disallow: /api/

Sitemap: https://metegunes.dev/sitemap.xml
```

---

### 4. Google Analytics Entegrasyonu
**Dosyalar:**
- `index.html` (GA4 script)
- `src/utils/analytics.ts` (event helper)

**Yapılacaklar:**
- [ ] GA4 measurement ID ekleme (environment variable)
- [ ] Pageview tracking
- [ ] Custom event tracking
- [ ] Conversion tracking (form submit)

**Event Tracking Setup:**
```ts
// src/utils/analytics.ts
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Events to track:
// - page_view (automatic)
// - contact_form_submit
// - cv_download
// - social_link_click (label: platform)
// - newsletter_subscribe
// - project_view (label: project_name)
// - lang_toggle (label: language)
```

**Environment Variable:**
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

### 5. Security Headers
**Dosya:** Hosting config (Vercel/Netlify)

**Headers:**
```yaml
# vercel.json veya _headers (Netlify)
headers:
  - source: "/(.*)"
    headers:
      - key: "X-Content-Type-Options"
        value: "nosniff"
      - key: "X-Frame-Options"
        value: "DENY"
      - key: "X-XSS-Protection"
        value: "1; mode=block"
      - key: "Referrer-Policy"
        value: "strict-origin-when-cross-origin"
      - key: "Permissions-Policy"
        value: "camera=(), microphone=(), geolocation=()"
      - key: "Content-Security-Policy"
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://www.google-analytics.com"
```

---

### 6. Core Web Vitals & Lighthouse Optimizasyonu
**Dosyalar:** Çeşitli

**Dağılacaklar:**

#### LCP < 2.5s
- [ ] Hero image preload
- [ ] Font preload (Inter)
- [ ] Critical CSS inline
- [ ] Image lazy loading
- [ ] Proper image sizing

#### FID < 100ms  
- [ ] Code splitting (React.lazy)
- [ ] Bundle size optimization
- [ ] Third-party script defer

#### CLS < 0.1
- [ ] Image dimensions (width/height attributes)
- [ ] Font fallback (font-display: swap)
- [ ] Skeleton loaders

**Optimizasyon Aksiyonları:**
```html
<!-- index.html preloads -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
```

```tsx
// Code splitting
const BlogsPage = React.lazy(() => import('./pages/BlogsPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
```

---

## Test Stratejisi

### Otomatik Testler

1. **Lighthouse CI:**
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:5173
```

2. **Meta Tag Validation:**
- https://developers.facebook.com/tools/debug/
- https://cards-dev.twitter.com/validator
- https://search.google.com/test/rich-results

### Manuel Test Adımları

1. **SEO Test:**
   - [ ] Her sayfanın unique title'ı var
   - [ ] Meta description 155-160 karakter
   - [ ] OG image 1200x630px
   - [ ] Canonical URL doğru

2. **Schema Test:**
   - [ ] Rich Results Test → hata yok
   - [ ] Person schema algılanıyor

3. **Analytics Test:**
   - [ ] GA Real-time'da pageview görünüyor
   - [ ] Custom event (form submit) kaydediliyor

4. **Performance Test:**
   - [ ] Lighthouse Performance ≥ 90
   - [ ] LCP < 2.5s
   - [ ] CLS < 0.1

5. **Security Test:**
   - [ ] https://securityheaders.com → A+ hedef
   - [ ] Headers browser DevTools'da doğru

---

## Tahmini Süre

| Görev | Süre |
|-------|------|
| Meta Tags | 2-3 saat |
| Structured Data | 2-3 saat |
| sitemap & robots | 1 saat |
| Analytics | 2-3 saat |
| Security Headers | 1-2 saat |
| Performance Optimization | 3-4 saat |
| **Toplam** | **11-16 saat** |

---

## Başarı Kriterleri

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse SEO ≥ 95
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Tüm sayfalar Google'da indexlenebilir
- [ ] Rich Results Test → hata yok
- [ ] Security Headers → A rating
- [ ] GA4 veri toplama aktif
- [ ] sitemap.xml Google Search Console'da submit edildi
