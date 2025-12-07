import { createContext, useContext, useState, type ReactNode } from 'react'

type Lang = 'tr' | 'en'

interface Translations {
    // Sidebar
    home: string
    blogs: string
    products: string
    contact: string

    // Home
    heroTitle: string
    heroGreeting1: string
    heroGreeting2: string
    heroBio: string

    // Newsletter
    newsletterTitle: string
    newsletterDesc: string
    newsletterPlaceholder: string
    newsletterBtn: string
    newsletterSuccess: string

    // Footer
    footerTitle: string
    footerSubtitle: string
    exploreMore: string

    // Blogs
    blogsTitle: string
    blogsSubtitle: string

    // Products  
    productsTitle: string
    productsSubtitle: string

    // Contact
    contactTitle: string
    contactSubtitle: string
    contactName: string
    contactEmail: string
    contactMessage: string
    contactSend: string
    contactSuccess: string
    contactSuccessDesc: string
    contactLocation: string

    // Auth
    loginTitle: string
    loginSubtitle: string
    loginBtn: string
    registerTitle: string
    registerSubtitle: string
    registerBtn: string
    password: string
    confirmPassword: string
    fullNamePlaceholder: string
    noAccount: string
    registerLink: string
    hasAccount: string
    loginLink: string
    passwordMismatch: string
    passwordTooShort: string
    logout: string
}

const translations: Record<Lang, Translations> = {
    en: {
        home: 'Home',
        blogs: 'Blogs',
        products: 'Products',
        contact: 'Contact',

        heroTitle: 'Hey, Saumya here',
        heroGreeting1: "How's your",
        heroGreeting2: '?',
        heroBio: "I'm your friendly neighborhood CAD wizard from the mystical land of Haridwar (yep, the place considered as a gateway to lord). With 5+ years of doodling… uh, I mean designing, I turn \"wait, how?\" ideas into \"wow, that's slick!\" reality.",

        newsletterTitle: 'Newsletter',
        newsletterDesc: "I document my learnings once a month. I would love to share them with you over mail. No bulls**t. No spam. Straight up value.",
        newsletterPlaceholder: 'your@email.com',
        newsletterBtn: 'Subscribe',
        newsletterSuccess: '🎉 Thanks for subscribing!',

        footerTitle: 'Thanks for Visiting.',
        footerSubtitle: 'Explore Around. Until Next Time.',
        exploreMore: 'Explore More',

        blogsTitle: 'Blogs',
        blogsSubtitle: 'Thoughts, stories, and ideas from my journey',

        productsTitle: 'Products',
        productsSubtitle: 'Digital products and services',

        contactTitle: 'Contact',
        contactSubtitle: "Let's connect and create something amazing together",
        contactName: 'Name',
        contactEmail: 'Email',
        contactMessage: 'Message',
        contactSend: 'Send Message',
        contactSuccess: 'Message Sent!',
        contactSuccessDesc: "Thanks for reaching out. I'll get back to you soon.",
        contactLocation: 'Location',

        // Auth
        loginTitle: 'Welcome Back',
        loginSubtitle: 'Sign in to your account',
        loginBtn: 'Sign In',
        registerTitle: 'Create Account',
        registerSubtitle: 'Join us today',
        registerBtn: 'Sign Up',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullNamePlaceholder: 'John Doe',
        noAccount: "Don't have an account?",
        registerLink: 'Sign up',
        hasAccount: 'Already have an account?',
        loginLink: 'Sign in',
        passwordMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters',
        logout: 'Logout',
    },
    tr: {
        home: 'Ana Sayfa',
        blogs: 'Blog',
        products: 'Ürünler',
        contact: 'İletişim',

        heroTitle: 'Merhaba, ben Saumya',
        heroGreeting1: 'Nasıl gidiyor',
        heroGreeting2: '?',
        heroBio: "Haridwar'ın mistik topraklarından gelen bir CAD sihirbazıyım (evet, tanrılara açılan kapı olarak bilinen yer). 5+ yıllık çizim... yani tasarım deneyimimle, \"nasıl yapılır?\" fikirlerini \"vay, harika!\" gerçekliğe dönüştürüyorum.",

        newsletterTitle: 'Bülten',
        newsletterDesc: "Ayda bir öğrendiklerimi belgeliyorum. Bunları sizinle mail ile paylaşmak isterim. Saçmalık yok. Spam yok. Sadece değer.",
        newsletterPlaceholder: 'email@adresiniz.com',
        newsletterBtn: 'Abone Ol',
        newsletterSuccess: '🎉 Abone olduğunuz için teşekkürler!',

        footerTitle: 'Ziyaretiniz için teşekkürler.',
        footerSubtitle: 'Etrafı keşfedin. Bir dahaki sefere kadar.',
        exploreMore: 'Daha Fazla Keşfet',

        blogsTitle: 'Blog',
        blogsSubtitle: 'Yolculuğumdan düşünceler, hikayeler ve fikirler',

        productsTitle: 'Ürünler',
        productsSubtitle: 'Dijital ürünler ve hizmetler',

        contactTitle: 'İletişim',
        contactSubtitle: 'Birlikte harika bir şeyler yaratalım',
        contactName: 'İsim',
        contactEmail: 'E-posta',
        contactMessage: 'Mesaj',
        contactSend: 'Mesaj Gönder',
        contactSuccess: 'Mesaj Gönderildi!',
        contactSuccessDesc: 'İletişime geçtiğiniz için teşekkürler. En kısa sürede döneceğim.',
        contactLocation: 'Konum',

        // Auth
        loginTitle: 'Tekrar Hoşgeldin',
        loginSubtitle: 'Hesabına giriş yap',
        loginBtn: 'Giriş Yap',
        registerTitle: 'Hesap Oluştur',
        registerSubtitle: 'Bugün bize katıl',
        registerBtn: 'Kayıt Ol',
        password: 'Şifre',
        confirmPassword: 'Şifreyi Onayla',
        fullNamePlaceholder: 'Ahmet Yılmaz',
        noAccount: 'Hesabın yok mu?',
        registerLink: 'Kayıt ol',
        hasAccount: 'Zaten hesabın var mı?',
        loginLink: 'Giriş yap',
        passwordMismatch: 'Şifreler eşleşmiyor',
        passwordTooShort: 'Şifre en az 6 karakter olmalı',
        logout: 'Çıkış Yap',
    },
}

interface LangContextType {
    lang: Lang
    setLang: (lang: Lang) => void
    t: Translations
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('lang') as Lang) || 'en'
        }
        return 'en'
    })

    const handleSetLang = (newLang: Lang) => {
        setLang(newLang)
        localStorage.setItem('lang', newLang)
    }

    return (
        <LangContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
            {children}
        </LangContext.Provider>
    )
}

export function useLang() {
    const context = useContext(LangContext)
    if (!context) {
        throw new Error('useLang must be used within a LangProvider')
    }
    return context
}
