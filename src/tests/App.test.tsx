import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mocks

// Mock Supabase
vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: vi.fn(() => ({
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        },
    })),
}));

// Mock Auth Service
vi.mock('../services/auth', () => ({
    girisEmailParola: vi.fn(),
    registerEmailParola: vi.fn(),
    cikisYap: vi.fn(),
}));

// Mock IntersectionObserver for Framer Motion (App içinde Sidebar veya sayfalarda animasyon olabilir)
// Zaten setup.ts içinde mockladık ama burada gerekirse global kullanılır.

describe('App Integration', () => {
    it('renders the app without crashing and shows home page by default', async () => {
        render(<App />);

        // Sidebar elementlerinden biri
        expect(screen.getByRole('complementary', { hidden: true }).classList.contains('sidebar')).toBeTruthy();

        // Home page içeriği (hero title)
        // LangContext default EN olduğu için "Hey, I'm Mete Güneş" aramalıyız.
        // Ancak asenkron veri yüklemeleri olabilir, waitFor kullanmak güvenlidir.
        await waitFor(() => {
            expect(screen.getByText(/Hey, I'm Mete Güneş/i)).toBeInTheDocument();
        });
    });

    it('shows navigation links', () => {
        render(<App />);
        // Sidebar linkleri
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Blogs')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });
});
