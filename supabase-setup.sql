-- =========================================
-- PORTFOLIO CMS - SUPABASE DATABASE SETUP
-- =========================================
-- Run this SQL in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- =========================================

-- =========================================
-- BLOGS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt_tr TEXT,
  excerpt_en TEXT,
  content_tr TEXT,
  content_en TEXT,
  category TEXT DEFAULT 'Genel',
  emoji TEXT DEFAULT '📝',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- PROJECTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_tr TEXT,
  description_en TEXT,
  content_tr TEXT,
  content_en TEXT,
  category TEXT DEFAULT 'Web',
  tech TEXT[] DEFAULT '{}',
  link TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- SETTINGS TABLE (Key-Value Store)
-- =========================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value_tr TEXT,
  value_en TEXT,
  type TEXT DEFAULT 'text', -- text, json, array
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

-- Enable RLS on all tables
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Public read published blogs" ON blogs 
  FOR SELECT USING (published = true);

-- Public can read published projects
CREATE POLICY "Public read published projects" ON projects 
  FOR SELECT USING (published = true);

-- Public can read all settings
CREATE POLICY "Public read settings" ON settings 
  FOR SELECT USING (true);

-- Admin full access (authenticated users)
-- Note: For development, allow all operations
CREATE POLICY "Admin full access blogs" ON blogs 
  FOR ALL USING (true);

CREATE POLICY "Admin full access projects" ON projects 
  FOR ALL USING (true);

CREATE POLICY "Admin full access settings" ON settings 
  FOR ALL USING (true);

-- =========================================
-- INDEXES (Performance)
-- =========================================
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- =========================================
-- DEFAULT SETTINGS DATA
-- =========================================
INSERT INTO settings (key, value_tr, value_en, type) VALUES
  ('hero_title', 'Merhaba, Ben Mete', 'Hey, I''m Mete', 'text'),
  ('hero_bio', '2+ yıllık deneyime sahip bir AI, Otomasyon ve Süreç Geliştirme Uzmanıyım. Karmaşık iş süreçlerini profesyonel dijital çözümlere dönüştürüyorum.', 'I''m an AI & Automation Specialist with 2+ years of experience transforming complex business challenges into elegant digital solutions.', 'text'),
  ('about_bio', 'AI entegrasyonu, iş akışı otomasyonu ve kurumsal süreç geliştirme konularında uzmanım.', 'I specialize in AI integration, workflow automation, and enterprise process development.', 'text'),
  ('skills', '["AI", "Automation", "React", "Node.js", "TypeScript", "Supabase", "n8n", "ChatGPT API"]', '', 'json'),
  ('social_links', '{"linkedin": "https://linkedin.com/in/metegunes", "github": "https://github.com/metegunes", "twitter": "https://twitter.com/metegunes", "instagram": "", "tiktok": ""}', '', 'json'),
  ('contact_email', 'contact@metegunes.dev', '', 'text'),
  ('contact_phone', '', '', 'text')
ON CONFLICT (key) DO NOTHING;

-- =========================================
-- SAMPLE BLOG DATA
-- =========================================
INSERT INTO blogs (title_tr, title_en, slug, excerpt_tr, excerpt_en, content_tr, content_en, category, emoji, published) VALUES
  (
    'İşletmeler için AI Otomasyonu: Kapsamlı Rehber',
    'AI Automation for Business: A Complete Guide',
    'ai-automation-business-guide',
    'AI otomasyonunu iş süreçlerinizi düzene sokmak için nasıl kullanacağınızı öğrenin.',
    'Learn how to leverage AI automation to streamline your business processes.',
    '<p>AI otomasyonu, işletmelerin verimliliğini artırmak için güçlü bir araçtır...</p>',
    '<p>AI automation is a powerful tool for increasing business efficiency...</p>',
    'AI',
    '🤖',
    true
  ),
  (
    'ChatGPT API Entegrasyonu: Adım Adım Rehber',
    'ChatGPT API Integration: Step-by-Step Tutorial',
    'chatgpt-api-integration-tutorial',
    'Gerçek dünya örnekleriyle uygulamalarınıza ChatGPT API entegrasyonu.',
    'A practical guide to integrating ChatGPT API into your applications.',
    '<p>ChatGPT API, uygulamalarınıza AI yetenekleri eklemek için harika bir yoldur...</p>',
    '<p>ChatGPT API is a great way to add AI capabilities to your applications...</p>',
    'Web',
    '💬',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- =========================================
-- SAMPLE PROJECT DATA
-- =========================================
INSERT INTO projects (title_tr, title_en, slug, description_tr, description_en, category, tech, featured, order_index, published) VALUES
  (
    'AI Chatbot Entegrasyonu',
    'AI Chatbot Integration',
    'ai-chatbot-integration',
    'E-ticaret müşteri desteği için ChatGPT destekli özel chatbot.',
    'Custom ChatGPT-powered chatbot for e-commerce customer support.',
    'AI',
    ARRAY['ChatGPT API', 'LangChain', 'Node.js', 'React'],
    true,
    1,
    true
  ),
  (
    'İş Akışı Otomasyon Paketi',
    'Workflow Automation Suite',
    'workflow-automation-suite',
    'Manuel görevleri %60 azaltan uçtan uca otomasyon çözümü.',
    'End-to-end automation solution reducing manual tasks by 60%.',
    'Automation',
    ARRAY['n8n', 'Zapier', 'Python', 'REST APIs'],
    true,
    2,
    true
  ),
  (
    'SaaS Analiz Paneli',
    'SaaS Analytics Dashboard',
    'saas-dashboard',
    'Etkileşimli grafikler ve veri görselleştirme ile gerçek zamanlı analiz paneli.',
    'Real-time analytics dashboard with interactive charts and data visualization.',
    'Web',
    ARRAY['React', 'TypeScript', 'Supabase', 'Recharts'],
    false,
    3,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- =========================================
-- DONE!
-- =========================================
-- Your database is now configured.
-- Go to http://localhost:5173/admin to manage content
-- Default password: admin123
