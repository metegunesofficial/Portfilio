# Ürün Gereksinim Dokümanı (PRD)

## 1) Amaç
- Ziyaretçiyi hızla güvene ikna edip 15 dakikalık ilk görüşmeye yönlendirmek.

## 2) Hedef Kitle
- Kurumsal orta-üst düzey yöneticiler (IT/Operasyon/Ürün), hızlı pilot ve ölçülebilir sonuç arayan ekipler.

## 3) Temel Değer Önerisi
- 15 dakikada ihtiyaç netleştirme, 2 haftada çalışan pilot.
- AI/otomasyon çözümlerinde düşük riskli, ölçülebilir teslim.

## 4) Kullanıcı Senaryoları
- Ziyaretçi: Hero mesajını okur, CTA (mailto veya form) ile iletişime geçer.
- Ziyaretçi: Özet 3 maddeyi okur, hizmetler ve mock referans/proje kartlarını inceler, form gönderir.
- Admin (gelecek): Login → profil düzenleme → referans/proje güncelleme.

## 5) Özellik Gereksinimleri
- Hero: Başlık, alt başlık, tek birincil CTA.
- Özet: 3 madde, kısa ve ölçülebilir vaat.
- Hizmetler: 3 kart, ikon + kısa açıklama.
- Referans/Proje: 2 mock kart (başlık, etki metriği, kısa açıklama).
- İletişim: Mailto butonu + form (ad, e-posta, mesaj).
- Dil: TR/EN toggle.
- Tema: Light/Dark toggle.
- (Opsiyonel) Auth: Supabase e-posta/şifre; profil tablosu.

## 6) Fonksiyonel Gereksinimler
- Form validasyonu: Ad zorunlu, e-posta format kontrolü zorunlu, mesaj zorunlu.
- Form gönderimi sonrası “Mesaj alındı” bildirimi (inline).
- Rate limit: 5 dakikada 3 gönderim sınırı (IP + zaman; başlangıçta in-memory, gerekirse Supabase tablo/Edge Function). Limit aşımında mesaj: “Çok hızlı deniyorsun, lütfen birkaç dakika sonra tekrar dene.”
- Dil toggle: metinler seçilen dile göre değişir.
- Tema toggle: kalıcı (localStorage).
- (Opsiyonel) Login: kayıt, giriş, çıkış; profil kaydı Supabase’e yazılır.

## 7) UI/UX Gereksinimleri
- Minimal, tek CTA, az metin; temiz tasarım.
- Responsive (mobil öncelikli).
- Sade ikonlar (Lucide); blur/beam yok; hafif gölgeler.
- Radix tabanlı bileşenler hazır: button, input, textarea, label, separator, dialog, popover, tooltip; `cn` helper.
- Spinner yerine sade durum mesajları; skeleton sınırlı.

## 8) Teknik Gereksinimler
- Frontend: React + Vite + TypeScript + Tailwind.
- UI kit: Radix + yardımcı bileşenler (`src/components/ui/*`), `class-variance-authority`, `tailwind-merge`.
- Supabase: `profiles` tablosu, RLS; auth servis fonksiyonları mevcut.
- Rate limit: in-memory başlangıç; opsiyonel Supabase tablo/Edge Function.
- Komutlar: `npm run build`; preview: `npm run preview -- --host --port 4173`.

## 9) Performans ve Kalite
- Lighthouse: Perf ≥ 90, Best Practices ≥ 90, A11y ≥ 90.
- İkon/SVG optimize; gereksiz görsel yok.
- Kod: `no any`, console.log yok.

## 10) Ölçümler (KPI)
- CTA tıklama oranı.
- Form gönderim sayısı.
- Dil toggle kullanım oranı.
- Ziyaretçi → iletişim dönüşüm oranı.

## 11) Kapsam Dışı (şimdilik)
- Ödeme/abonelik.
- Geniş CMS veya çok sayıda dinamik proje listesi.
- Çok adımlı form/anket.

## 12) Riskler
- Mailto uyumsuzluğu: Form alternatifi var.
- Rate limit yanlış pozitifleri: Eşik 3/5dk; mesajla bekleme önerilir.
- Supabase ortam değişkeni eksikliği: `.env.local` yönergeleri net olmalı.

## 13) Zaman Planı (öneri)
- Gün 1: Form + validasyon + CTA hizalama + rate limit iskeleti.
- Gün 2: Mock referans/proje kartları + i18n kontrol + stil uyumu.
- Gün 3: Lighthouse iyileştirmeleri, küçük UI cilası, smoke test (build/preview).

## 14) Açık Sorular
- Rate limit kalıcılaştırma: Supabase tablo/Edge Function’a taşıma zamanı?
- İletişim formu başarı bildirimi: Yalın inline metin yeterli mi, toast ekleyelim mi?

