# Supabase ortam değişkenleri

- `VITE_SUPABASE_URL`: Supabase projesi > Settings > API > Project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase projesi > Settings > API > Project API keys > anon/public
- `SUPABASE_SERVICE_ROLE_KEY`: (opsiyonel) hassas işlemler için service_role anahtarı

Proje köküne `.env.local` dosyası oluştur ve değerleri ekle:

```
VITE_SUPABASE_URL=https://ornek-proje-id.supabase.co
VITE_SUPABASE_ANON_KEY=ornek_anon_anahtar
SUPABASE_SERVICE_ROLE_KEY=
```

Dosyayı paylaşma veya commit etme.

