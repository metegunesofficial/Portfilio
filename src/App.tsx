import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Brain, Languages, Mail, Moon, Sparkles, Sun, Workflow } from 'lucide-react'

type Lang = 'tr' | 'en'
type Theme = 'light' | 'dark'

const dictionary = {
  tr: {
    metaTitle: 'Dijital Dönüşüm & Yapay Zeka Danışmanı',
    tagline: 'Net değer, düşük risk',
    headline: 'AI ve otomasyonla süreçleri sadeleştir, riski azalt.',
    subheadline: 'Kurumsal ritme uygun, ölçülebilir sonuç odaklı yalın çözümler.',
    ctaPrimary: 'İletişime geç',
    nav: { contact: 'İletişim' },
    servicesTitle: 'Kısa özet',
    servicesCopy: 'Hızlı pilot, ölçülebilir çıktı, güvenli kurulum.',
    contactTitle: 'İletişim',
    contactCopy: '15 dakikalık bir görüşmede ihtiyacı netleştirelim.',
    contactCTA: 'İletişime geç',
  },
  en: {
    metaTitle: 'Digital Transformation & AI Consultant',
    tagline: 'Clear value, lower risk',
    headline: 'Simplify with AI and automation while reducing risk.',
    subheadline: 'Lean, measurable solutions paced for enterprise.',
    ctaPrimary: 'Contact',
    nav: { contact: 'Contact' },
    servicesTitle: 'Quick summary',
    servicesCopy: 'Fast pilot, measurable output, safe setup.',
    contactTitle: 'Contact',
    contactCopy: 'Let’s clarify needs in a 15-minute call.',
    contactCTA: 'Contact',
  },
} satisfies Record<
  Lang,
  {
    metaTitle: string
    tagline: string
    headline: string
    subheadline: string
    ctaPrimary: string
    nav: { contact: string }
    servicesTitle: string
    servicesCopy: string
    contactTitle: string
    contactCopy: string
    contactCTA: string
  }
>

const services = [
  {
    icon: Brain,
    tr: { title: 'Ürün içi AI', desc: 'LLM özellikleri, güvenli veri akışı, hızlı pilot.' },
    en: { title: 'In-product AI', desc: 'LLM features, secure data, fast pilots.' },
  },
  {
    icon: Workflow,
    tr: { title: 'Otomasyon', desc: 'Low-code/RPA ile sade akış ve kontrol listeleri.' },
    en: { title: 'Automation', desc: 'Low-code/RPA with simple flows and controls.' },
  },
  {
    icon: Sun,
    tr: { title: 'Dönüşüm', desc: 'Yol haritası, paydaş hizalaması, hızla kanıtlanan MVP döngüleri.' },
    en: { title: 'Transformation', desc: 'Roadmaps, alignment, and fast MVP loops that earn trust.' },
  },
] as const

const summary = [
  { tr: 'İlk görüşmede ihtiyaç netleşir', en: 'Need clarified in first call' },
  { tr: '2 haftada çalışan pilot', en: 'Working pilot in 2 weeks' },
  { tr: 'Risk kontrollü kurulum', en: 'Risk-controlled implementation' },
] as const

function App() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'tr'
    return (localStorage.getItem('lang') as Lang) ?? 'tr'
  })

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem('theme') as Theme) ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  const t = useMemo(() => dictionary[lang], [lang])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.lang = lang
    localStorage.setItem('theme', theme)
    localStorage.setItem('lang', lang)
    document.title = `Güneş | ${t.metaTitle}`
  }, [lang, theme, t.metaTitle])

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-5xl space-y-12 px-6 pb-16 pt-10 sm:pt-14">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-400 text-lg font-semibold text-white shadow-lg shadow-amber-300/30">
              GY
            </div>
            <div>
              <p className="font-display text-xl">Güneş</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-2 py-1 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <a
                href="#contact"
                className="rounded-full px-3 py-1 font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-700 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {t.nav.contact}
              </a>
            </nav>

            <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-2 py-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <button
                aria-label="Light mode"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm transition ${
                  theme === 'light'
                    ? 'bg-white text-amber-600 shadow-sm dark:bg-white/10 dark:text-white'
                    : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Sun size={16} />
              </button>
              <button
                aria-label="Dark mode"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm transition ${
                  theme === 'dark'
                    ? 'bg-white text-amber-600 shadow-sm dark:bg-white/10 dark:text-white'
                    : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Moon size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-2 py-1 text-sm font-medium shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <Languages size={16} className="text-amber-600" />
              {(['tr', 'en'] as Lang[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2 py-1 transition ${
                    lang === code
                      ? 'bg-white text-amber-700 shadow-sm dark:bg-white/10 dark:text-white'
                      : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="space-y-12">
          <section className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 dark:border-amber-200/20 dark:bg-amber-500/15 dark:text-amber-100">
                <Sparkles size={16} />
                {t.tagline}
              </div>
              <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-white">{t.headline}</h1>
              <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-200">{t.subheadline}</p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                >
                  {t.ctaPrimary}
                  <ArrowRight size={16} />
                </a>
              </div>

              <ul className="grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-3">
                {summary.map((item) => (
                  <li
                    key={item.tr}
                    className="flex items-start gap-2 rounded-2xl border border-white/60 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{lang === 'tr' ? item.tr : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="services" className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-200">
              <Sparkles size={16} />
              {t.servicesTitle}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t.servicesCopy}</p>
            <div className="grid gap-3 md:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon
                const copy = lang === 'tr' ? service.tr : service.en
                return (
                  <div
                    key={copy.title}
                    className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100">
                        <Icon size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-ink dark:text-white">{copy.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{copy.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section
            id="contact"
            className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-200">
                {t.contactTitle}
              </p>
              <h2 className="font-display text-3xl text-ink dark:text-white">{t.contactTitle}</h2>
              <p className="max-w-xl text-slate-700 dark:text-slate-200">{t.contactCopy}</p>
              <a
                href="mailto:hello@ornekdanismanlik.com"
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                <Mail size={16} />
                {t.contactCTA}
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
