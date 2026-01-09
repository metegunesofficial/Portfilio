import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export function PrivacyPolicyPage() {
    const { lang } = useLang()

    const content = {
        tr: {
            title: 'Gizlilik Politikası',
            lastUpdated: 'Son güncelleme: 9 Ocak 2026',
            sections: [
                {
                    title: '1. Veri Sorumlusu',
                    content: `Mete Güneş
E-posta: contact@metegunes.dev

Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.`
                },
                {
                    title: '2. Toplanan Veriler',
                    content: `İletişim formu aracılığıyla aşağıdaki veriler toplanmaktadır:
• Ad soyad
• E-posta adresi
• Mesaj içeriği

Bu veriler yalnızca iletişim taleplerinizi yanıtlamak amacıyla kullanılır.`
                },
                {
                    title: '3. Verilerin İşlenme Amacı',
                    content: `Kişisel verileriniz şu amaçlarla işlenmektedir:
• İletişim taleplerini yanıtlama
• Profesyonel hizmet sunumu
• Yasal yükümlülüklerin yerine getirilmesi`
                },
                {
                    title: '4. Verilerin Saklanması',
                    content: `• Verileriniz Supabase bulut veritabanında güvenli şekilde saklanır
• HTTPS şifrelemesi ile korunur
• İletişim verileri 2 yıl sonra otomatik silinir`
                },
                {
                    title: '5. Haklarınız (KVKK Madde 11)',
                    content: `Kanun kapsamında aşağıdaki haklara sahipsiniz:
• Kişisel verilerinizin işlenip işlenmediğini öğrenme
• İşlenmişse bilgi talep etme
• İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme
• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
• Eksik veya yanlış işlenmişse düzeltilmesini isteme
• Silinmesini veya yok edilmesini isteme`
                },
                {
                    title: '6. Çerezler (Cookies)',
                    content: `Bu site şu anda yalnızca zorunlu çerezler kullanmaktadır:
• Oturum yönetimi için gerekli çerezler
• Dil tercihi saklama

Pazarlama veya izleme amaçlı çerez kullanılmamaktadır.`
                },
                {
                    title: '7. İletişim',
                    content: `Gizlilik politikası ile ilgili sorularınız veya haklarınızı kullanmak için:
E-posta: contact@metegunes.dev`
                }
            ]
        },
        en: {
            title: 'Privacy Policy',
            lastUpdated: 'Last updated: January 9, 2026',
            sections: [
                {
                    title: '1. Data Controller',
                    content: `Mete Güneş
Email: contact@metegunes.dev

This privacy policy explains how your personal data is collected, used, and protected.`
                },
                {
                    title: '2. Data Collected',
                    content: `The following data is collected through the contact form:
• Full name
• Email address
• Message content

This data is used solely to respond to your contact requests.`
                },
                {
                    title: '3. Purpose of Data Processing',
                    content: `Your personal data is processed for the following purposes:
• Responding to contact requests
• Providing professional services
• Fulfilling legal obligations`
                },
                {
                    title: '4. Data Storage',
                    content: `• Your data is securely stored in Supabase cloud database
• Protected with HTTPS encryption
• Contact data is automatically deleted after 2 years`
                },
                {
                    title: '5. Your Rights (GDPR)',
                    content: `Under applicable law, you have the following rights:
• Right to access your personal data
• Right to rectification of inaccurate data
• Right to erasure ("right to be forgotten")
• Right to restriction of processing
• Right to data portability
• Right to object to processing`
                },
                {
                    title: '6. Cookies',
                    content: `This site currently uses only essential cookies:
• Session management cookies
• Language preference storage

No marketing or tracking cookies are used.`
                },
                {
                    title: '7. Contact',
                    content: `For questions about this privacy policy or to exercise your rights:
Email: contact@metegunes.dev`
                }
            ]
        }
    }

    const t = content[lang]

    return (
        <div className="page-wrapper privacy-page">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="privacy-header-content">
                    <Shield size={32} className="privacy-icon" />
                    <div>
                        <h1>{t.title}</h1>
                        <p className="privacy-updated">{t.lastUpdated}</p>
                    </div>
                </div>
            </motion.header>

            <motion.div
                className="privacy-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {t.sections.map((section, index) => (
                    <section key={index} className="privacy-section">
                        <h2>{section.title}</h2>
                        <p>{section.content}</p>
                    </section>
                ))}
            </motion.div>

            <motion.div
                className="privacy-back"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Link to="/" className="btn-secondary">
                    <ArrowLeft size={18} />
                    {lang === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
                </Link>
            </motion.div>
        </div>
    )
}
