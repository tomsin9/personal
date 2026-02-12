/**
 * Google Analytics 4 helpers.
 * Only runs when VITE_GA_MEASUREMENT_ID is set (e.g. in production).
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackPageView(path: string): void {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('config', GA_ID, { page_path: path })
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}
