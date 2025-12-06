// Basit oturum kontrol yardımcıları (korumalı sayfalar için)
import { aktifOturumAl } from '../services/auth'

// Oturum varsa true döner, yoksa false
export async function oturumVarMi(): Promise<boolean> {
  const { sessionToken } = await aktifOturumAl()
  return Boolean(sessionToken)
}

// Oturum yoksa hata fırlatır (örn. korumalı içerik öncesi çağır)
export async function oturumZorunlu(): Promise<void> {
  const { sessionToken } = await aktifOturumAl()
  if (!sessionToken) {
    throw new Error('Bu içeriği görmek için oturum açmalısın')
  }
}

