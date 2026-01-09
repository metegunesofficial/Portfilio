# Faz 1: Core UI/UX İyileştirmeleri & Tasarım Polish

## Özet
Bu faz, kullanıcı deneyiminin temelleri ile görsel tasarımın profesyonel seviyeye ulaştırılmasını kapsar. İlk izlenim kritik olduğundan (PRD'de %55 ziyaretçinin 3 saniye içinde çıktığı belirtiliyor), hero section ve genel UI polish önceliklidir.

---

## Deliverables

### 1. Hero Section İyileştirmesi
**Dosya:** `src/components/Hero.tsx`

**Yapılacaklar:**
- [ ] Placeholder içeriği gerçek içerikle değiştir
- [ ] Animasyonlu entrance efektleri (Framer Motion)
- [ ] Net value proposition başlık
- [ ] Single, prominent CTA butonu ("İletişime Geç")
- [ ] Profesyonel profil görseli (veya placeholder avatar)
- [ ] Mobil responsive tipografi (64px → 40px → 32px)

**Kod Değişiklikleri:**
```tsx
// Hero.tsx - Önerilen yapı
- Greeting: "Merhaba, Ben Mete"
- Title: "AI & Otomasyon Uzmanı"
- Description: Kısa, etkileyici bio (2-3 cümle)
- CTA: Primary button → /contact
- Secondary: Small links (LinkedIn, GitHub)
```

---

### 2. Hakkımda (About) Sayfası
**Yeni Dosya:** `src/pages/AboutPage.tsx`

**Yapılacaklar:**
- [ ] Yeni sayfa oluştur
- [ ] Router'a ekle (`/about`)
- [ ] Sidebar'a navigation link ekle
- [ ] İçerik bölümleri:
  - Profesyonel özet
  - Beceri/teknoloji stack'i
  - Eğitim geçmişi
  - Deneyim timeline
- [ ] Animasyonlu section geçişleri

---

### 3. Portfolio/Products Sayfası Grid & Filtreleme
**Dosya:** `src/pages/ProductsPage.tsx`

**Yapılacaklar:**
- [ ] Proje kartları için responsive grid (1/2/3 column)
- [ ] Kategori filtreleme (All, Web, Mobile, AI, vb.)
- [ ] Hover efektleri (transform, shadow)
- [ ] Skeleton loading states
- [ ] Fallback görsel için placeholder
- [ ] Lazy loading görseller

**Kod Değişiklikleri:**
```tsx
// Filtreleme state'i
const [filter, setFilter] = useState<'all'|'web'|'mobile'|'ai'>('all')

// Grid responsive
grid-template-columns: 
  mobile: 1fr
  tablet: repeat(2, 1fr)  
  desktop: repeat(3, 1fr)
```

---

### 4. Dark Mode Toggle
**Dosyalar:** 
- `src/context/ThemeContext.tsx` (yeni)
- `src/index.css` (güncelleme)
- `src/components/Sidebar.tsx` (toggle button)

**Yapılacaklar:**
- [ ] ThemeContext oluştur (light/dark/system)
- [ ] localStorage ile tercih saklama
- [ ] CSS variables dark mode varyantları
- [ ] Toggle button (moon/sun icon)
- [ ] Smooth transition animasyonu
- [ ] System preference detection

**CSS Variables (Dark Mode):**
```css
[data-theme="dark"] {
  --bg-main: #121212;
  --bg-card: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --border-light: #333333;
}
```

---

### 5. Skeleton Loading States
**Yeni Dosya:** `src/components/ui/Skeleton.tsx`

**Yapılacaklar:**
- [ ] Reusable Skeleton component
- [ ] Shimmer animasyonu
- [ ] Farklı boyutlar (text, card, image, avatar)
- [ ] ProductsPage'de kullanım
- [ ] Hero section initial load

---

### 6. Responsive Tasarım İyileştirmeleri
**Dosya:** `src/index.css`

**Yapılacaklar:**
- [ ] Mobile-first yaklaşım revizyonu
- [ ] Breakpoint standardizasyonu:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- [ ] Touch target minimum 44x44px
- [ ] Horizontal scroll önleme
- [ ] Font size scaling (clamp)
- [ ] Hamburger menu iyileştirmesi

---

## Teknik Gereksinimler

### Dependencies (Mevcut - Yeterli)
- Framer Motion ✅
- Lucide React (icons) ✅
- Radix UI (primitives) ✅

### Yeni Eklenmesi Gereken
- Yok (mevcut bağımlılıklar yeterli)

---

## Test Stratejisi

### Manuel Test Adımları

1. **Hero Section Test:**
   - [ ] Sayfayı aç, hero 2 saniye içinde render olmalı
   - [ ] CTA butonuna tıkla → /contact'a yönlenmeli
   - [ ] Mobil ekranda (350px) test et → overflow olmamalı

2. **About Sayfası Test:**
   - [ ] URL: /about → sayfa yüklenmeli
   - [ ] Sidebar'da "Hakkımda" linki aktif görünmeli
   - [ ] TR/EN dil değişimi içeriği güncellemeli

3. **Portfolio Filtreleme Test:**
   - [ ] "All" seçili → tüm kartlar görünmeli
   - [ ] "Web" seçili → sadece web projeleri
   - [ ] Filtre değişimi → smooth animasyon

4. **Dark Mode Test:**
   - [ ] Toggle tıkla → tema değişmeli
   - [ ] Sayfayı yenile → tercih korunmalı
   - [ ] System preference'da dark → otomatik dark

5. **Responsive Test:**
   - [ ] 1920px (desktop) → 3 column grid
   - [ ] 768px (tablet) → 2 column grid
   - [ ] 375px (mobile) → 1 column grid, hamburger menu

### Lighthouse Hedefleri (Faz 1 Sonrası)
- Performance: ≥ 85
- Accessibility: ≥ 90
- Best Practices: ≥ 90

---

## Tahmini Süre

| Görev | Süre |
|-------|------|
| Hero Section | 2-3 saat |
| About Sayfası | 2-3 saat |
| Portfolio Grid & Filter | 3-4 saat |
| Dark Mode | 2-3 saat |
| Skeleton Loading | 1-2 saat |
| Responsive Polish | 2-3 saat |
| **Toplam** | **12-18 saat** |

---

## Başarı Kriterleri

- [ ] Hero section LCP < 2.5s
- [ ] Tüm sayfalar responsive (375px - 1920px)
- [ ] Dark mode preference persist
- [ ] Filter animasyonları smooth (60fps)
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Kod TypeScript strict mode uyumlu
