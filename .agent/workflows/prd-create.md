---
description: FAANG/Big Tech seviyesinde kapsamlı PRD oluşturma workflow'u
---

# ══════════════════════════════════════════════════════════════
# /prd-create - Professional Grade PRD Generator
# ══════════════════════════════════════════════════════════════
# Version: 2.0 | Universal Template | Tüm Projeler için Uygun
# ══════════════════════════════════════════════════════════════

## Trigger
```
/prd-create <proje açıklaması veya tek satırlık brief>
```

---

## Workflow Steps

### STEP 1: Proje Analizi (1-2 dakika)
// turbo
1. Kullanıcının proje açıklamasını analiz et
2. Proje tipini belirle:
   - Web App (SaaS, Dashboard, E-commerce, Portfolio, etc.)
   - Mobile App (iOS, Android, Cross-platform)
   - API/Backend Service
   - Desktop Application
   - AI/ML Product
   - Other
3. Sektörü tespit et (Tech, Healthcare, Finance, Education, etc.)

### STEP 2: Bilgi Toplama (Opsiyonel)
Eksik kritik bilgiler varsa SADECE şunları sor (max 3 soru):
- Hedef kitle kimdir?
- Ana monetizasyon/iş modeli nedir?
- MVP scope nedir?
"Yeni bir [Proje Türü/Fikri] geliştirmek istiyorum. Bu proje için 'Agent Mode'da kullanacağımız mükemmel bir PRD (Ürün Gereksinim Belgesi) hazırlamanı istiyorum. Ancak önce, kapsamı, teknik detayları ve kullanıcı hikayelerini netleştirmek için bana proje hakkında 5-10 kritik soru sor. Cevaplarımı aldıktan sonra teknik stack, dosya yapısı ve başarı kriterlerini içeren PRD'yi oluştur."

> ⚠️ Eğer bilgi yeterliyse, SORMA ve varsayımlarla devam et.

### STEP 3: PRD Oluşturma (Ana Çıktı)
// turbo
Aşağıdaki yapıda tam PRD oluştur:

```
PRD YAPI ŞABLONU (40+ Bölüm)
═══════════════════════════════════════════════════════════════

## BÖLÜM A: ÖZET & BAĞLAM
├── 1. TL;DR (tek paragraf özet)
├── 2. Document Info (versiyon, tarih, yazar, durum, paydaşlar)
├── 3. Problem Statement
│   ├── Mevcut Durum (As-Is) - tablo formatında
│   ├── Hedef Durum (To-Be) - Mermaid flowchart
│   └── Çözülecek Temel Problemler (gap analizi)
└── 4. Narrative (kullanıcı hikayesi anlatımı)

## BÖLÜM B: HEDEFLER & STRATEJI
├── 5. Goals
│   ├── Business Goals (tablo: Hedef, Süre, Ölçüm, Baseline, Target)
│   ├── User Goals (bullet list)
│   └── Non-Goals (kapsam dışı - ❌ formatında)
├── 6. Assumptions & Constraints
│   ├── Assumptions (ID, Varsayım, Risk Seviyesi, Doğrulama)
│   └── Constraints (Bütçe, Zaman, Teknik, Yasal, Personel)
└── 7. Dependencies
    ├── External Dependencies (servis, kritiklik, fallback)
    └── Internal Dependencies (Mermaid diagram)

## BÖLÜM C: REKABET ANALİZİ
├── 8. Competitive Analysis
│   ├── Rakip Platformlar (tablo karşılaştırma)
│   ├── Feature Comparison Matrix (28x5 detaylı ASCII tablo)
│   ├── SWOT Analizi (Mermaid quadrantChart)
│   └── Unique Selling Proposition (USP)
└── 9. User Research Insights
    ├── Araştırma Metodolojisi
    ├── Key Findings (4+ finding, veri destekli)
    ├── Persona Definitions (3 persona, detaylı tablolar)
    └── User Journey Map (Mermaid journey)

## BÖLÜM D: MALİYET & ROI
└── 10. Cost Analysis
    ├── Geliştirme Maliyeti
    ├── Operasyonel Maliyetler (aylık)
    ├── 12 Aylık TCO (3 senaryo)
    └── ROI Projection

## BÖLÜM E: A/B TESTİNG
└── 11. A/B Testing Plan
    ├── Test Backlog (ID, Hipotez, Metrik, Öncelik)
    ├── Detaylı Hypothesis (YAML formatında)
    ├── Testing Infrastructure (Mermaid flowchart)
    ├── Sample Size Calculator (formül + hesaplama tablosu)
    ├── Statistical Significance Calculator (pseudo-code)
    ├── Power Analysis
    └── Implementation Options

## BÖLÜM F: KULLANICI & KABUL KRİTERLERİ
├── 12. Stakeholders & Responsibilities (RACI matrisi)
├── 13. User Stories (persona bazlı tablolar)
└── 14. Acceptance Criteria (Given-When-Then)
    ├── Her özellik için ayrı Feature bloğu
    ├── Gherkin formatında senaryolar
    ├── Edge cases dahil
    └── Minimum 8 feature, 25+ senaryo

## BÖLÜM G: FONKSİYONEL GEREKSİNİMLER
└── 15. Functional Requirements
    ├── Genel Site/App Yapısı (Priority: Highest)
    ├── Erişilebilirlik & Güven (Priority: High)
    └── İleri Özellikler (Priority: Medium)

## BÖLÜM H: ARAMA & AI OPTİMİZASYONU
└── 16. Search & AI Optimization Strategy
    ├── SEO (Technical, On-Page, Core Web Vitals, Structured Data)
    │   └── Meta Tag Gereksinimleri (HTML kod blokları)
    ├── GEO (Generative Engine Optimization)
    │   └── E-E-A-T, Conversational Content, FAQ formatları
    ├── AISEO (AI Search Engine Optimization)
    │   └── Checklist formatında
    ├── SEM (Search Engine Marketing)
    │   └── Landing Page Gereksinimleri
    ├── AIO (Answer Engine Optimization)
    │   ├── Mermaid flowchart
    │   └── Schema.org JSON-LD örneği
    └── Optimizasyon Karşılaştırma Tablosu & KPI'ları

## BÖLÜM I: KULLANICI DENEYİMİ
└── 17. User Experience
    ├── Entry Point & First-Time User Experience
    ├── Core Experience (Mermaid flowchart + tablo)
    ├── Advanced Features & Edge Cases
    └── UI/UX Highlights

## BÖLÜM J: BAŞARI METRİKLERİ
└── 18. Success Metrics
    ├── User-Centric Metrics
    ├── Business Metrics
    ├── Technical Metrics
    └── Tracking Plan (event listesi)

## BÖLÜM K: TEKNİK BELİRTİMLER
└── 19. Technical Considerations
    ├── Tech Stack (tablo formatında)
    ├── Integration Points
    ├── Data Storage & Privacy
    ├── Scalability & Performance
    └── Potential Challenges (risk/azaltma tablosu)

## BÖLÜM L: FONKSİYONEL OLMAYAN GEREKSİNİMLER
└── 20. Non-Functional Requirements (NFR)
    ├── Performance Requirements (Core Web Vitals tablosu)
    ├── Reliability & Availability
    └── Scalability hedefleri

## BÖLÜM M: GÜVENLİK
└── 21. Security Requirements
    ├── Authentication & Authorization
    ├── Data Protection
    └── Security Headers (kod bloğu)

## BÖLÜM N: ERİŞİLEBİLİRLİK
└── 22. Accessibility Requirements (a11y)
    ├── WCAG 2.1 AA Compliance (kontrol tablosu)
    └── Testing Tools

## BÖLÜM O: ULUSLARARASILAŞMA
└── 23. Internationalization (i18n)
    ├── Mevcut Durum tablosu
    └── Translation Coverage (tree formatı)

## BÖLÜM P: LANSMAN
└── 24. Release Criteria
    ├── Definition of Done (DoD)
    └── Launch Checklist
        ├── Pre-Launch
        ├── Launch Day
        └── Post-Launch

## BÖLÜM Q: YASAL & UYUMLULUK
└── 25. Legal & Compliance
    ├── KVKK (Türkiye)
    ├── GDPR (EU)
    └── Aydınlatma Metni (taslak)

## BÖLÜM R: RİSK YÖNETİMİ
└── 26. Risk Register
    ├── Risk Scoring Matrix (formül açıklaması)
    ├── Risk Heat Map (ASCII görsel matris)
    ├── Detaylı Risk Register (7+ risk, Contingency Plans)
    ├── Risk Trend Tracking
    ├── Contingency Budget
    └── Risk Monitoring Dashboard (ASCII)

## BÖLÜM S: ZAM ÇİZELGESİ
└── 27. Milestones & Sequencing
    ├── Project Estimate
    ├── Phases (Mermaid gantt chart)
    └── Faz tablosu (Dependencies dahil)

## BÖLÜM T: MEVCUT DURUM & SONRAKI ADIMLAR
└── 28. Mevcut Durum & Sonraki Adımlar
    ├── Tamamlanan (checklist)
    └── Sonraki Adımlar (checklist)

## BÖLÜM U: GELİŞME PLANI
└── 29. Future Considerations (v2.0+)
    ├── Potential Features (öncelik/effort matrisi)
    └── Technical Debt

## BÖLÜM V: AÇIK SORULAR
└── 30. Açık Sorular (numaralı liste)

## BÖLÜM W: EKLER
└── 31. Appendix
    ├── Wireframe References
    ├── Design System Tokens (CSS kod bloğu)
    └── API Endpoints

## BÖLÜM X: DEĞİŞİKLİK KAYDI
└── 32. Change Log (versiyon tablosu)

═══════════════════════════════════════════════════════════════
```

### STEP 4: Dosya Kaydetme
// turbo
PRD'yi şu konuma kaydet:
```
docs/PRD-{proje-adi}.md
```

Dosya adı örneği: `docs/PRD-saas-dashboard.md`

---

## Kalite Standartları (Zorunlu)

### Minimum Metrikler
| Metrik | Minimum | Hedef |
|--------|---------|-------|
| Toplam Satır | 1,500+ | 1,700+ |
| Toplam Bölüm | 30+ | 40+ |
| Tablo Sayısı | 50+ | 70+ |
| Mermaid Diagram | 10+ | 12+ |
| Gherkin Senaryosu | 20+ | 25+ |
| Checklist Maddesi | 60+ | 80+ |
| ASCII Diagram | 2+ | 3+ |

### Mermaid Diagram Türleri (Zorunlu)
- [ ] flowchart (user flow, architecture)
- [ ] gantt (timeline)
- [ ] journey (user journey)
- [ ] quadrantChart (SWOT)
- [ ] flowchart TD (A/B testing infrastructure)

### Kod Blokları (Zorunlu)
- [ ] Gherkin (Acceptance Criteria)
- [ ] HTML (Meta tags)
- [ ] JSON-LD (Schema.org)
- [ ] CSS (Design tokens)
- [ ] Python pseudo-code (Statistical calc)
- [ ] YAML (A/B Test hypothesis)
- [ ] ASCII art (Heat maps, Dashboards)

---

## Proje Tipi Adaptasyonları

### Web App (SaaS, Dashboard)
- E-commerce: Ödeme akışı, sepet, checkout AC'leri ekle
- Dashboard: Data visualization, real-time updates
- SaaS: Multi-tenant, subscription, billing

### Mobile App
- Platform-specific (iOS/Android) gereksinimleri
- Push notification, offline mode
- App Store/Play Store gereksinimleri

### API/Backend
- OpenAPI/Swagger dökümantasyonu
- Rate limiting, authentication detayları
- Versioning stratejisi

### AI/ML Product
- Model performans metrikleri
- Training data gereksinimleri
- Bias ve fairness değerlendirmesi

---

## Örnek Kullanım

```
Kullanıcı: /prd-create Freelancer'lar için proje yönetim SaaS'ı

Beklenen Çıktı:
├── docs/PRD-freelancer-pm-saas.md (1,700+ satır)
├── 40+ bölüm
├── 70+ tablo
├── 12+ Mermaid diagram
├── 25+ Gherkin senaryo
└── 10/10 Professional Grade
```

---

## Notlar

- PRD tamamlandıktan sonra Change Log bölümünü güncelle
- Her PRD v1.0 olarak başlar
- Kullanıcı feedback'i alındıkça versiyon artır
- Açık Sorular bölümünü kullanıcıyla paylaş