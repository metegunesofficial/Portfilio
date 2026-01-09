import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock Supabase
vi.mock('../lib/supabase-client', () => ({
  getSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  }),
}));

// Mock Auth Services
vi.mock('../services/auth', () => ({
  girisEmailParola: vi.fn(),
  registerEmailParola: vi.fn(),
  cikisYap: vi.fn(),
}));

// Mock ResizeObserver (already in setup.ts but good to be safe if environment differs)
// Mock matchMedia (handled in setup.ts)

describe('App Component', () => {
  it('renders without crashing', async () => {
    // We need to render the App.
    // Since App contains Providers (ThemeProvider, LangProvider, AuthProvider, BrowserRouter),
    // we don't need to wrap it here again.

    render(<App />);

    // Check for a known element, e.g., Sidebar or Home content
    // Since content might load asynchronously (Auth checking), we might need waitFor

    // Checking for Sidebar nav items or Home page text
    // Assuming default route is '/', HomePage renders.
    // HomePage has "Hey, I'm Mete Güneş" (en) or "Merhaba, Ben Mete Güneş" (tr)
    // Default lang is 'en' unless localStorage says otherwise.

    await waitFor(() => {
        // Look for something from the Sidebar or Home
        // Sidebar usually has "Home" or "Ana Sayfa"
        const homeLink = screen.queryByText(/Home/i) || screen.queryByText(/Ana Sayfa/i);
        expect(homeLink).toBeInTheDocument();
    });
  });
});
