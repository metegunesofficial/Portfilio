// E-posta/şifre tabanlı kimlik doğrulama işlemleri
import { getSupabaseClient } from '../lib/supabase-client'
import type { Database } from '../types/supabase'

type ProfilEkle = Database['public']['Tables']['profiles']['Insert']

type KayitSonucu = { userId: string | null }
type OturumBilgisi = { sessionToken: string | null }

// Yeni kullanıcıyı e-posta ve şifre ile oluşturur
export async function registerEmailParola(
  email: string,
  password: string,
  adSoyad?: string
): Promise<KayitSonucu> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: adSoyad } },
  })
  if (error) throw new Error(error.message)

  if (data.user && adSoyad) {
    const profil: ProfilEkle = { id: data.user.id, full_name: adSoyad }
    const { error: profilHatasi } = await supabase.from('profiles').insert(profil)
    if (profilHatasi) throw new Error(profilHatasi.message)
  }

  return { userId: data.user?.id ?? null }
}

// Var olan kullanıcıyı e-posta ve şifre ile oturum açtırır
export async function girisEmailParola(email: string, password: string): Promise<OturumBilgisi> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return { sessionToken: data.session?.access_token ?? null }
}

// Oturumu sonlandırır
export async function cikisYap(): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

// Aktif oturumu döndürür
export async function aktifOturumAl(): Promise<OturumBilgisi> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  return { sessionToken: data.session?.access_token ?? null }
}

