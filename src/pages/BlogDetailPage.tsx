import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../context/LangContext'

interface BlogPost {
    id: string
    slug: string
    title: { en: string; tr: string }
    excerpt: { en: string; tr: string }
    content: { en: string; tr: string }
    date: string
    category: string
    categoryLabel: { en: string; tr: string }
    readTime: number
    author: string
}

const blogData: Record<string, BlogPost> = {
    'ai-automation-business-guide': {
        id: '1',
        slug: 'ai-automation-business-guide',
        title: {
            en: 'AI Automation for Business: A Complete Guide',
            tr: 'İşletmeler için AI Otomasyonu: Kapsamlı Rehber'
        },
        excerpt: {
            en: 'Learn how to leverage AI automation to streamline your business processes.',
            tr: 'AI otomasyonunu iş süreçlerinizi düzene sokmak için nasıl kullanacağınızı öğrenin.'
        },
        content: {
            en: `## Introduction

Artificial Intelligence is transforming how businesses operate. In this comprehensive guide, I'll share my experience implementing AI automation solutions for various clients.

## Why AI Automation?

Over the past 4 years, I've helped many businesses integrate AI into their workflows. The results speak for themselves:

- **40% reduction** in response times
- **60% decrease** in manual tasks
- **$15,000+** monthly savings on average

## Key Implementation Steps

### 1. Identify Repetitive Tasks
Start by mapping out all repetitive tasks in your organization. These are prime candidates for automation.

### 2. Choose the Right Tools
Depending on your needs, consider:
- ChatGPT API for conversational AI
- n8n or Zapier for workflow automation
- Custom Python scripts for specific tasks

### 3. Start Small, Scale Fast
Begin with a pilot project. Once you prove ROI, expand to other departments.

## Real-World Example

One of my clients, an e-commerce company, was struggling with customer support. We implemented a ChatGPT-powered chatbot that now handles 65% of all queries automatically.

## Conclusion

AI automation isn't just for big tech companies. With the right approach, any business can benefit from these technologies.

*Have questions? Feel free to reach out!*`,
            tr: `## Giriş

Yapay Zeka, işletmelerin çalışma şeklini dönüştürüyor. Bu kapsamlı rehberde, çeşitli müşteriler için AI otomasyon çözümleri uygulama deneyimimi paylaşacağım.

## Neden AI Otomasyonu?

Son 4 yılda, birçok işletmenin iş akışlarına AI entegre etmelerine yardımcı oldum. Sonuçlar kendini gösteriyor:

- Yanıt sürelerinde **%40 azalma**
- Manuel görevlerde **%60 düşüş**
- Ortalama **aylık $15,000+** tasarruf

## Temel Uygulama Adımları

### 1. Tekrarlayan Görevleri Belirleyin
Kuruluşunuzdaki tüm tekrarlayan görevleri haritalayarak başlayın. Bunlar otomasyon için en uygun adaylardır.

### 2. Doğru Araçları Seçin
İhtiyaçlarınıza bağlı olarak şunları düşünün:
- Konuşmalı AI için ChatGPT API
- İş akışı otomasyonu için n8n veya Zapier
- Belirli görevler için özel Python scriptleri

### 3. Küçük Başlayın, Hızlı Ölçeklendirin
Bir pilot proje ile başlayın. ROI'yi kanıtladığınızda diğer departmanlara genişletin.

## Gerçek Dünya Örneği

Müşterilerimden biri, bir e-ticaret şirketi, müşteri desteği konusunda zorlanıyordu. Artık tüm sorguların %65'ini otomatik olarak yanıtlayan ChatGPT destekli bir chatbot uyguladık.

## Sonuç

AI otomasyonu sadece büyük teknoloji şirketleri için değil. Doğru yaklaşımla her işletme bu teknolojilerden faydalanabilir.

*Sorularınız mı var? Benimle iletişime geçmekten çekinmeyin!*`
        },
        date: '2024-01-05',
        category: 'ai',
        categoryLabel: { en: 'AI & Automation', tr: 'AI & Otomasyon' },
        readTime: 8,
        author: 'Mete Güneş'
    },
    'chatgpt-api-integration-tutorial': {
        id: '2',
        slug: 'chatgpt-api-integration-tutorial',
        title: {
            en: 'ChatGPT API Integration: Step-by-Step Tutorial',
            tr: 'ChatGPT API Entegrasyonu: Adım Adım Rehber'
        },
        excerpt: {
            en: 'A practical guide to integrating ChatGPT API into your applications.',
            tr: 'Uygulamalarınıza ChatGPT API entegrasyonu için pratik rehber.'
        },
        content: {
            en: `## Getting Started with ChatGPT API

In this tutorial, I'll walk you through integrating OpenAI's ChatGPT API into your web applications.

## Prerequisites

- Node.js 18+ installed
- OpenAI API key
- Basic JavaScript/TypeScript knowledge

## Step 1: Install the SDK

\`\`\`bash
npm install openai
\`\`\`

## Step 2: Initialize the Client

\`\`\`typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
\`\`\`

## Step 3: Make Your First Request

\`\`\`typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
});
\`\`\`

## Best Practices

1. **Rate Limiting**: Implement proper rate limiting
2. **Error Handling**: Always handle API errors gracefully
3. **Cost Management**: Monitor your token usage

## Conclusion

ChatGPT API integration is straightforward once you understand the basics. Start experimenting and build amazing AI-powered features!`,
            tr: `## ChatGPT API ile Başlarken

Bu eğitimde, OpenAI'nin ChatGPT API'sini web uygulamalarınıza entegre etme sürecinde size rehberlik edeceğim.

## Ön Koşullar

- Node.js 18+ kurulu
- OpenAI API anahtarı
- Temel JavaScript/TypeScript bilgisi

## Adım 1: SDK'yı Yükleyin

\`\`\`bash
npm install openai
\`\`\`

## Adım 2: İstemciyi Başlatın

\`\`\`typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
\`\`\`

## Adım 3: İlk İsteğinizi Yapın

\`\`\`typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'Sen yardımcı bir asistansın.' },
    { role: 'user', content: 'Merhaba!' }
  ],
});
\`\`\`

## En İyi Uygulamalar

1. **Hız Sınırlama**: Uygun hız sınırlaması uygulayın
2. **Hata Yönetimi**: API hatalarını her zaman zarif bir şekilde yönetin
3. **Maliyet Yönetimi**: Token kullanımınızı izleyin

## Sonuç

Temel bilgileri anladıktan sonra ChatGPT API entegrasyonu basittir. Denemeye başlayın ve harika AI destekli özellikler oluşturun!`
        },
        date: '2024-01-02',
        category: 'tech',
        categoryLabel: { en: 'Technology', tr: 'Teknoloji' },
        readTime: 12,
        author: 'Mete Güneş'
    }
}

const postOrder = ['ai-automation-business-guide', 'chatgpt-api-integration-tutorial', 'freelance-developer-journey', 'react-typescript-best-practices']

export function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const { lang } = useLang()

    const post = slug ? blogData[slug] : null

    if (!post) {
        return (
            <div className="page-wrapper blog-not-found">
                <h1>{lang === 'tr' ? 'Blog Yazısı Bulunamadı' : 'Blog Post Not Found'}</h1>
                <Link to="/blogs" className="btn-primary">
                    <ArrowLeft size={18} />
                    {lang === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}
                </Link>
            </div>
        )
    }

    const currentIndex = postOrder.indexOf(slug || '')
    const prevPost = currentIndex > 0 ? postOrder[currentIndex - 1] : null
    const nextPost = currentIndex < postOrder.length - 1 ? postOrder[currentIndex + 1] : null

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title[lang],
                url: window.location.href
            })
        }
    }

    return (
        <div className="page-wrapper blog-detail-page">
            {/* Back Link */}
            <motion.div
                className="blog-back"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Link to="/blogs" className="back-link">
                    <ArrowLeft size={18} />
                    {lang === 'tr' ? 'Tüm Yazılar' : 'All Posts'}
                </Link>
            </motion.div>

            {/* Header */}
            <motion.header
                className="blog-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="blog-category">{post.categoryLabel[lang]}</span>
                <h1>{post.title[lang]}</h1>

                <div className="blog-meta">
                    <span className="meta-item">
                        <Calendar size={16} />
                        {formatDate(post.date)}
                    </span>
                    <span className="meta-item">
                        <Clock size={16} />
                        {post.readTime} {lang === 'tr' ? 'dk okuma' : 'min read'}
                    </span>
                    <button className="share-btn" onClick={handleShare} title="Share">
                        <Share2 size={16} />
                    </button>
                </div>

                <p className="blog-author">
                    {lang === 'tr' ? 'Yazan:' : 'By'} <strong>{post.author}</strong>
                </p>
            </motion.header>

            {/* Content */}
            <motion.article
                className="blog-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content[lang]) }}
            />

            {/* Navigation */}
            <motion.div
                className="blog-nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {prevPost ? (
                    <Link to={`/blogs/${prevPost}`} className="nav-prev">
                        <ChevronLeft size={20} />
                        <span>{lang === 'tr' ? 'Önceki Yazı' : 'Previous Post'}</span>
                    </Link>
                ) : <div />}

                {nextPost && (
                    <Link to={`/blogs/${nextPost}`} className="nav-next">
                        <span>{lang === 'tr' ? 'Sonraki Yazı' : 'Next Post'}</span>
                        <ChevronRight size={20} />
                    </Link>
                )}
            </motion.div>
        </div>
    )
}

// Simple markdown to HTML converter
function formatMarkdown(text: string): string {
    return text
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`{3}(\w+)?\n([\s\S]*?)`{3}/g, '<pre><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, (match) => {
            if (match.startsWith('<')) return match
            return `<p>${match}</p>`
        })
}
