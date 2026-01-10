# 🚀 Portfilio Deployment Kılavuzu

## Canlıya Alma Süreci

### 1. Kod Değişikliği Yaptıktan Sonra

```bash
git add -A
git commit -m "açıklama"
git push origin main
```

Vercel otomatik olarak build ve deploy eder (1-2 dk).

### 2. Vercel Environment Variables

Aşağıdaki değişkenler Vercel'de ayarlanmalıdır:

| Değişken | Değer |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://bkblxxtqacppxrqznwco.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard'dan alınacak |

> ⚠️ Bu değişkenler olmadan Supabase bağlantısı çalışmaz!

### 3. Admin Kullanıcı Oluşturma

1. https://supabase.com/dashboard/project/bkblxxtqacppxrqznwco/auth/users
2. "Add user" > "Create new user"
3. Email ve şifre gir

---

## Sık Karşılaşılan Hatalar

### Newsletter 406 Hatası
**Çözüm:** `newsletter.ts` → `.single()` yerine `.maybeSingle()` kullan

### Production'da Supabase Çalışmıyor
**Çözüm:** Vercel Environment Variables kontrol et

### Admin Paneline Girilemiyor
**Çözüm:** Supabase Auth'da admin kullanıcı oluştur

---

## Faydalı Linkler

- **Vercel Dashboard:** https://vercel.com/mete-guness-projects/portfilio
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bkblxxtqacppxrqznwco
- **GitHub Repo:** https://github.com/metegunesofficial/Portfilio
