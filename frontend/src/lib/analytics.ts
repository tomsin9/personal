/**
 * Google Analytics 4 – loads gtag in-app when VITE_GA_MEASUREMENT_ID is set.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Call from main.ts to load gtag.js and config GA4. No-op if ID is not set. */
export function initGoogleAnalytics(): void {
  if (!GA_ID || typeof GA_ID !== 'string' || GA_ID.trim() === '') return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  script.onload = () => {
    window.gtag!('config', GA_ID)
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
