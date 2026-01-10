import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabase-client'

interface Settings {
    hero_title_tr: string
    hero_title_en: string
    hero_bio_tr: string
    hero_bio_en: string
    about_bio_tr: string
    about_bio_en: string
    skills: string[]
    social_linkedin: string
    social_github: string
    social_twitter: string
    social_instagram: string
    social_tiktok: string
    contact_email: string
    contact_phone: string
}

const defaultSettings: Settings = {
    hero_title_tr: 'Merhaba, Ben Mete',
    hero_title_en: "Hey, I'm Mete",
    hero_bio_tr: "4+ yıllık deneyime sahip bir AI, Otomasyon, Veri Analizi ve Süreç Geliştirme Uzmanıyım.",
    hero_bio_en: "I'm an AI, Automation & Data Analytics Specialist with 4+ years of experience.",
    about_bio_tr: "AI ve otomasyon alanında uzmanım.",
    about_bio_en: "I specialize in AI and automation.",
    skills: ['AI', 'Automation', 'React', 'Node.js'],
    social_linkedin: 'https://linkedin.com/in/metegunes',
    social_github: 'https://github.com/metegunes',
    social_twitter: 'https://twitter.com/metegunes',
    social_instagram: '',
    social_tiktok: '',
    contact_email: 'contact@metegunes.dev',
    contact_phone: '',
}

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const supabase = getSupabaseClient()
            const { data, error: fetchError } = await supabase
                .from('settings')
                .select('*')

            if (fetchError) throw fetchError

            if (data && data.length > 0) {
                const settingsMap: Record<string, any> = {}
                data.forEach((item: any) => {
                    if (item.type === 'json') {
                        try {
                            settingsMap[item.key] = JSON.parse(item.value_tr || '{}')
                        } catch {
                            settingsMap[item.key] = item.value_tr
                        }
                    } else {
                        settingsMap[item.key + '_tr'] = item.value_tr || ''
                        settingsMap[item.key + '_en'] = item.value_en || ''
                    }
                })

                setSettings({
                    hero_title_tr: settingsMap.hero_title_tr || defaultSettings.hero_title_tr,
                    hero_title_en: settingsMap.hero_title_en || defaultSettings.hero_title_en,
                    hero_bio_tr: settingsMap.hero_bio_tr || defaultSettings.hero_bio_tr,
                    hero_bio_en: settingsMap.hero_bio_en || defaultSettings.hero_bio_en,
                    about_bio_tr: settingsMap.about_bio_tr || defaultSettings.about_bio_tr,
                    about_bio_en: settingsMap.about_bio_en || defaultSettings.about_bio_en,
                    skills: settingsMap.skills || defaultSettings.skills,
                    social_linkedin: settingsMap.social_links?.linkedin || defaultSettings.social_linkedin,
                    social_github: settingsMap.social_links?.github || defaultSettings.social_github,
                    social_twitter: settingsMap.social_links?.twitter || defaultSettings.social_twitter,
                    social_instagram: settingsMap.social_links?.instagram || '',
                    social_tiktok: settingsMap.social_links?.tiktok || '',
                    contact_email: settingsMap.contact_email_tr || defaultSettings.contact_email,
                    contact_phone: settingsMap.contact_phone_tr || '',
                })
            }
        } catch (err) {
            console.error('Error fetching settings:', err)
            setError('Failed to load settings')
            // Keep default values on error
        } finally {
            setIsLoading(false)
        }
    }

    return { settings, isLoading, error }
}
