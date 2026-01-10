/**
 * Sanitizes HTML string to prevent XSS attacks.
 * Uses DOMPurify to parse and clean the HTML.
 */
import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
    // DOMPurify handles sanitization safely.
    // In a browser environment, it uses the browser's DOM.
    // In a Node environment (SSR), it requires a window object or fails/returns empty depending on config.
    // Since this project is a Vite SPA, we are primarily concerned with client-side.

    // However, to be safe and avoid errors during build/test in Node envs without jsdom setup:
    if (typeof window === 'undefined') {
        // In true SSR, we would need isomorphic-dompurify.
        // For this SPA, if this runs on server, returning empty or simple escape is safer than raw HTML.
        // But since we are replacing a custom impl that returned raw HTML,
        // and this is primarily for client-side rendering in useEffect/components,
        // we can rely on DOMPurify if available, or return empty string to fail safe.
        // Or better, let's just let DOMPurify handle it if it can, or use a fallback.

        // Actually, DOMPurify requires a window.
        // The project uses `jsdom` in tests, so it should work there.
        return ''; // Fail safe for server-side if any
    }

    return DOMPurify.sanitize(html);
}
