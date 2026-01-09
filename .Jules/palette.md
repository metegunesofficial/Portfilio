## 2024-05-23 - [Form Accessibility & Feedback]
**Learning:** Adding `aria-describedby` linking inputs to their error messages ensures screen reader users hear the validation error immediately when focusing the invalid field. Without this, they might not know *why* the input is invalid.
**Action:** Always generate unique IDs for error messages and link them via `aria-describedby` when the input is invalid.

**Learning:** Visual feedback for async actions (like form submission) is critical even for fast operations. A "Loading..." state prevents double submissions and reassures the user that the system is working.
**Action:** Implement `isSubmitting` state for all async buttons, disabling them and showing a spinner.
