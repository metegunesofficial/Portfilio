# Supabase Auth rehberi

1) Supabase projesi oluştur, `ENV.md` içindeki ortam değişkenlerini `.env.local` içine yaz.
2) `supabase/sql/profiles.sql` dosyasını Supabase SQL editor ile çalıştır (tablo + RLS).
3) Bağımlılık kurulu: `@supabase/supabase-js` (gerekirse `npm install @supabase/supabase-js`).

Kullanılacak yardımcılar:
- İstemci: `src/lib/supabase-client.ts` → `getSupabaseClient()`
- Servis (sunucu): `server/supabase-server.ts` → `getServiceClient()` (service_role için)
- Auth işlemleri: `src/services/auth.ts` → `registerEmailParola`, `girisEmailParola`, `cikisYap`, `aktifOturumAl`
- Korumalı sayfa helper: `src/lib/session-guard.ts` → `oturumVarMi`, `oturumZorunlu`

Manuel test akışları:
- Kayıt: `registerEmailParola(email, sifre, adSoyad)` → Supabase Auth + `profiles` kaydı.
- Giriş: `girisEmailParola(email, sifre)` → `sessionToken` dönmeli.
- Korumalı içerik: Oturum kapalıyken `oturumZorunlu()` çağırırsan hata fırlatır.
- Çıkış: `cikisYap()` → ardından `aktifOturumAl()` null token döner.

