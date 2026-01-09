import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider, useLang } from '../../context/LangContext';
import { describe, it, expect } from 'vitest';

// Test component to consume the context
const TestComponent = () => {
  const { lang, setLang, t } = useLang();
  return (
    <div>
      <span data-testid="current-lang">{lang}</span>
      <span data-testid="greeting">{t.home}</span>
      <button onClick={() => setLang('tr')}>Switch to TR</button>
      <button onClick={() => setLang('en')}>Switch to EN</button>
    </div>
  );
};

describe('LangContext', () => {
  it('provides default language (en)', () => {
    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('greeting')).toHaveTextContent('Home');
  });

  it('switches language correctly', () => {
    render(
      <LangProvider>
        <TestComponent />
      </LangProvider>
    );

    // Switch to TR
    fireEvent.click(screen.getByText('Switch to TR'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('tr');
    expect(screen.getByTestId('greeting')).toHaveTextContent('Ana Sayfa');

    // Switch back to EN
    fireEvent.click(screen.getByText('Switch to EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('greeting')).toHaveTextContent('Home');
  });
});
