import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../../components/ui/button';

describe('Button Component', () => {
    it('renders with default props', () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-amber-600'); // Default variant class
    });

    it('renders with variant="outline"', () => {
        render(<Button variant="outline">Outline Button</Button>);
        const button = screen.getByRole('button', { name: /outline button/i });
        expect(button).toHaveClass('border-slate-200');
    });

    it('renders with size="sm"', () => {
        render(<Button size="sm">Small Button</Button>);
        const button = screen.getByRole('button', { name: /small button/i });
        expect(button).toHaveClass('h-9');
    });

    it('handles onClick events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);
        const button = screen.getByRole('button', { name: /clickable/i });

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is passed', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
    });
});
