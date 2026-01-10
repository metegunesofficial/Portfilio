import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { BlogsPage } from './pages/BlogsPage'
import { BlogDetailPage } from './pages/BlogDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminHome } from './pages/admin/AdminHome'
import { BlogsList } from './pages/admin/BlogsList'
import { BlogEditor } from './pages/admin/BlogEditor'
import { ProjectsList } from './pages/admin/ProjectsList'
import { ProjectEditor } from './pages/admin/ProjectEditor'
import { SettingsEditor } from './pages/admin/SettingsEditor'
import { TestimonialsList } from './pages/admin/TestimonialsList'
import { ContactMessagesList } from './pages/admin/ContactMessagesList'
import { AdminSubscribers } from './pages/admin/AdminSubscribers'
import { AdminCampaigns } from './pages/admin/AdminCampaigns'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'

import './index.css'

function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Login - Separate */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Admin Routes - With Sidebar Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminHome />} />
              <Route path="blogs" element={<BlogsList />} />
              <Route path="blogs/new" element={<BlogEditor />} />
              <Route path="blogs/:id/edit" element={<BlogEditor />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectEditor />} />
              <Route path="projects/:id/edit" element={<ProjectEditor />} />
              <Route path="testimonials" element={<TestimonialsList />} />
              <Route path="messages" element={<ContactMessagesList />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="settings" element={<SettingsEditor />} />
            </Route>

            {/* Main Site Routes - With Sidebar */}
            <Route path="/*" element={
              <div className="app-layout">
                <Sidebar />
                <main id="main-content" role="main" className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/blogs/:slug" element={<BlogDetailPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  )
}

export default App



