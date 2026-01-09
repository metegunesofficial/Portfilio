// src/types/global.d.ts
export {}

declare global {
  interface Window {
    gtag?: (
      command: string,
      target: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params?: Record<string, any>
    ) => void
  }
}
