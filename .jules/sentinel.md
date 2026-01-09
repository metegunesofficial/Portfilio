## 2024-05-23 - Custom Markdown Parser XSS
**Vulnerability:** The `formatMarkdown` function in `src/pages/BlogDetailPage.tsx` used `dangerouslySetInnerHTML` with a custom regex-based parser that didn't escape HTML input. This allowed XSS attacks if the input text contained malicious HTML tags.
**Learning:** Even if data is currently static (hardcoded), functions handling data rendering should be secure by default to prevent future vulnerabilities when data sources change (e.g., fetching from API). Custom parsers are often risky.
**Prevention:** Always escape user input before applying custom formatting rules, or use established sanitization libraries like `DOMPurify` or safe markdown parsers. In this case, I implemented a simple `escapeHtml` function before processing markdown.
