import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitize';

describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
        const input = '<p>Hello <script>alert("xss")</script> World</p>';
        const output = sanitizeHtml(input);
        expect(output).toBe('<p>Hello  World</p>');
    });

    it('should remove onclick attributes', () => {
        const input = '<button onclick="alert(1)">Click me</button>';
        const output = sanitizeHtml(input);
        expect(output).toBe('<button>Click me</button>');
    });

    it('should remove javascript: links', () => {
        const input = '<a href="javascript:alert(1)">Link</a>';
        const output = sanitizeHtml(input);
        expect(output).toBe('<a>Link</a>');
    });

    it('should keep safe HTML', () => {
        const input = '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text.</p>';
        const output = sanitizeHtml(input);
        expect(output).toBe(input);
    });

    it('should remove iframe tags', () => {
        const input = '<div><iframe src="http://malicious.com"></iframe></div>';
        const output = sanitizeHtml(input);
        expect(output).toBe('<div></div>');
    });

    it('should handle nested dangerous elements', () => {
        const input = '<div><p>Test <script>alert(1)</script></p></div>';
        const output = sanitizeHtml(input);
        expect(output).toBe('<div><p>Test </p></div>');
    });

    it('should remove img onerror', () => {
        const input = '<img src="x" onerror="alert(1)" />';
        const output = sanitizeHtml(input);
        expect(output).toBe('<img src="x">');
    });

    // Note: This simple implementation might normalize HTML (e.g., adding closing tags, quotes)
    // because it uses DOMParser. The tests check for semantic equivalence mostly.
});
