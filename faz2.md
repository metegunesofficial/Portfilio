# Faz 2: İçerik & Fonksiyonel Özellikler

## Özet
Bu faz, güven oluşturan içerik öğeleri (referanslar, case study'ler) ve kullanıcı deneyimini zenginleştiren fonksiyonel özellikleri (CV indirme, sosyal bağlantılar) kapsar. PRD'deki User Research'e göre referanslar %78 güven artışı sağlıyor.

---

## Deliverables

### 1. Testimonials/Referanslar Bölümü
**Dosya:** `src/components/Testimonials.tsx` (güncelleme)

**Yapılacaklar:**
- [ ] Testimonial card component oluştur
- [ ] Carousel/slider implementasyonu (Framer Motion)
- [ ] Testimonial data yapısı:
  ```ts
  interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    photo?: string;
    quote: string;
    rating?: number; // 1-5 stars
  }
  ```
- [ ] Auto-play carousel (opsiyonel)
- [ ] Responsive tasarım (mobile: stack, desktop: row)
- [ ] Ana sayfaya entegrasyon (Hero altı)
- [ ] About sayfasına entegrasyon

**Veri Kaynağı:**
- Statik JSON dosyası (`src/data/testimonials.json`)
- Gelecekte: Supabase'den çekme

---

### 2. CV İndirme Özelliği
**Dosyalar:**
- `public/cv/mete-gunes-cv.pdf`
- `src/components/CV Download.tsx` (yeni)
- `src/components/Sidebar.tsx` (link ekleme)

**Yapılacaklar:**
- [ ] PDF CV dosyasını public klasörüne ekle
- [ ] Download button component
- [ ] Click tracking (event: cv_download)
- [ ] Sidebar'a download link
- [ ] About sayfasına prominent download CTA
- [ ] Mobil için optimizasyon

**Kod Örneği:**
```tsx
const handleDownload = () => {
  // Analytics tracking
  if (window.gtag) {
    window.gtag('event', 'cv_download', { method: 'click' });
  }
  
  const link = document.createElement('a');
  link.href = '/cv/mete-gunes-cv.pdf';
  link.download = 'Mete-Gunes-CV.pdf';
  link.click();
};
```

---

### 3. Sosyal Medya Bağlantıları
**Dosyalar:**
- `src/components/Sidebar.tsx` (güncelleme)
- `src/components/Footer.tsx` (güncelleme)
- `src/data/socials.ts` (yeni)

**Yapılacaklar:**
- [ ] Sosyal linkler için merkezi config
- [ ] LinkedIn, GitHub, Instagram, Twitter/X ikonları
- [ ] Hover efektleri ve tooltip
- [ ] Click tracking (event: social_link_click)
- [ ] rel="noopener noreferrer" target="_blank"
- [ ] Aria labels ekleme

**Sosyal Linkler Config:**
```ts
// src/data/socials.ts
export const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/...', icon: 'linkedin' },
  { name: 'GitHub', url: 'https://github.com/...', icon: 'github' },
  { name: 'Instagram', url: 'https://instagram.com/...', icon: 'instagram' },
  { name: 'X', url: 'https://x.com/...', icon: 'twitter' },
];
```

---

### 4. Blog İçerik Yapısı
**Dosyalar:**
- `src/pages/BlogsPage.tsx` (güncelleme)
- `src/data/blogs.ts` (yeni)
- `src/components/BlogCard.tsx` (yeni)

**Yapılacaklar:**
- [ ] Blog veri yapısı tanımlama
- [ ] Blog list view (kart tabanlı)
- [ ] Tarih formatı (locale-aware)
- [ ] Kategori badge'leri
- [ ] Read time estimation
- [ ] Placeholder blog yazıları (3-5 adet)

**Blog Data Yapısı:**
```ts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: 'tech' | 'career' | 'thoughts';
  publishedAt: Date;
  readTime: number; // minutes
  coverImage?: string;
}
```

---

### 5. Project Detail Sayfaları (Case Study)
**Yeni Dosyalar:**
- `src/pages/ProjectDetailPage.tsx`
- `src/data/projects.ts`
- `src/components/ProjectGallery.tsx`

**Yapılacaklar:**
- [ ] Dinamik route: `/projects/:slug`
- [ ] Proje detay sayfası template
- [ ] Case study section'ları:
  - Problem statement
  - Çözüm yaklaşımı
  - Teknolojiler
  - Sonuçlar/metrikler
  - Görsel galeri
- [ ] Önceki/Sonraki proje navigasyonu
- [ ] Portfolio kartlarından detaya link

**Route Ekleme:**
```tsx
// App.tsx
<Route path="/projects/:slug" element={<ProjectDetailPage />} />
```

---

### 6. Error Sayfaları (404, 500)
**Yeni Dosyalar:**
- `src/pages/NotFoundPage.tsx`
- `src/pages/ErrorPage.tsx`

**Yapılacaklar:**
- [ ] 404 sayfa tasarımı (friendly, helpful)
- [ ] Genel error boundary component
- [ ] Ana sayfaya dönüş butonu
- [ ] Arama önerisi (gelecek özellik için placeholder)
- [ ] SEO: noindex meta tag
- [ ] Route: "*" catch-all

**404 İçerik:**
```
Başlık: "Sayfa Bulunamadı"
Açıklama: "Aradığınız sayfa mevcut değil veya taşınmış olabilir."
CTA: "Ana Sayfaya Dön"
İllüstrasyon: Minimal, on-brand görsel
```

---

## Bağımlılıklar

### Faz 1'den Önkoşullar
- Dark mode CSS variables (transitions için)
- Skeleton component (loading states)
- Responsive grid sistemi

### Yeni Dependencies
- Yok (mevcut bağımlılıklar yeterli)

---

## Test Stratejisi

### Manuel Test Adımları

1. **Testimonials Test:**
   - [ ] Ana sayfada referanslar görünmeli
   - [ ] Carousel ok tuşlarıyla gezilebilmeli
   - [ ] Mobilde stack layout olmalı

2. **CV Download Test:**
   - [ ] Sidebar'dan CV download tıkla
   - [ ] Browser download başlamalı
   - [ ] PDF dosyası düzgün açılmalı

3. **Sosyal Linkler Test:**
   - [ ] Her sosyal ikona tıkla → yeni tab açılmalı
   - [ ] Tooltip görünmeli (hover)
   - [ ] Keyboard navigation çalışmalı

4. **Blog Test:**
   - [ ] /blogs sayfasına git
   - [ ] Blog kartları listelenmeli
   - [ ] Kartlara tıklama etkileşimi

5. **Project Detail Test:**
   - [ ] Portfolio kartına tıkla → /projects/:slug
   - [ ] Case study içeriği görünmeli
   - [ ] Geri navigation çalışmalı

6. **404 Test:**
   - [ ] URL: /olmayan-sayfa → 404 görünmeli
   - [ ] "Ana Sayfa" butonuna tıkla → / 'e yönlenmeli

---

## i18n Gereksinimleri

Yeni çevirilerin eklenmesi:
```ts
// LangContext.tsx'e eklenecek
testimonials: {
  title: { tr: 'Referanslar', en: 'Testimonials' },
}
cv: {
  download: { tr: 'CV İndir', en: 'Download CV' },
}
blog: {
  readTime: { tr: 'dk okuma', en: 'min read' },
}
error: {
  notFound: { tr: 'Sayfa Bulunamadı', en: 'Page Not Found' },
  goHome: { tr: 'Ana Sayfaya Dön', en: 'Go to Home' },
}
```

---

## Tahmini Süre

| Görev | Süre |
|-------|------|
| Testimonials | 3-4 saat |
| CV Download | 1-2 saat |
| Sosyal Linkler | 1-2 saat |
| Blog Yapısı | 2-3 saat |
| Project Detail | 4-5 saat |
| Error Sayfaları | 1-2 saat |
| **Toplam** | **12-18 saat** |

---

## Başarı Kriterleri

- [ ] En az 3 testimonial kartı görüntüleniyor
- [ ] CV download tracking çalışıyor
- [ ] Tüm sosyal linkler yeni tab'da açılıyor
- [ ] Blog kartları responsive grid'de
- [ ] Project detail:slug routing çalışıyor
- [ ] 404 sayfası professional görünüyor
- [ ] Tüm yeni içerik TR/EN çevrilmiş
