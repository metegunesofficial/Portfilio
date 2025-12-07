import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { HomePage } from './pages/HomePage'
import { BlogsPage } from './pages/BlogsPage'
import { ProductsPage } from './pages/ProductsPage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'

function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/products-listing" element={<ProductsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  )
}

export default App

