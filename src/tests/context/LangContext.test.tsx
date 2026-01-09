import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { LangProvider, useLang } from '../../context/LangContext';

// Test bileşeni
const TestComponent = () => {
    const { lang, setLang, t } = useLang();
    return (
        <div>
            <span data-testid="current-lang">{lang}</span>
            <span data-testid="translated-home">{t.home}</span>
            <button onClick={() => setLang('tr')}>Switch to TR</button>
            <button onClick={() => setLang('en')}>Switch to EN</button>
        </div>
    );
};

describe('LangContext', () => {
    beforeEach(() => {
        // localStorage temizle
        window.localStorage.clear();
    });

    it('renders with default language (en)', () => {
        render(
            <LangProvider>
                <TestComponent />
            </LangProvider>
        );
        expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
        expect(screen.getByTestId('translated-home')).toHaveTextContent('Home');
    });

    it('switches language correctly', () => {
        render(
            <LangProvider>
                <TestComponent />
            </LangProvider>
        );

        const trButton = screen.getByText('Switch to TR');
        fireEvent.click(trButton);

        expect(screen.getByTestId('current-lang')).toHaveTextContent('tr');
        expect(screen.getByTestId('translated-home')).toHaveTextContent('Ana Sayfa');
    });

    it('persists language selection to localStorage', () => {
        render(
            <LangProvider>
                <TestComponent />
            </LangProvider>
        );

        const trButton = screen.getByText('Switch to TR');
        fireEvent.click(trButton);

        expect(window.localStorage.getItem('lang')).toBe('tr');
    });

    it('loads language from localStorage on init', () => {
        window.localStorage.setItem('lang', 'tr');
        render(
            <LangProvider>
                <TestComponent />
            </LangProvider>
        );
        expect(screen.getByTestId('current-lang')).toHaveTextContent('tr');
    });
});
