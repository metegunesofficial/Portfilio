## 2024-05-23 - Accessibility of Graphical Links
**Learning:** Purely graphical links (like Logos or icons) must have an `aria-label` because they have no text content for screen readers. A test using `getByText` will fail on them, and more importantly, users relying on assistive technology won't know where the link goes.
**Action:** Always check `aria-label` for icon-only buttons or links. Use `getByLabelText` in tests for these elements.
