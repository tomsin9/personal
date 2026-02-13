/**
 * Initialize Google Analytics
 * Loads the gtag.js script and configures it with the tracking ID from environment variables
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function initGoogleAnalytics(): void {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

  if (!gaId || gaId === 'none' || gaId === 'None' || gaId === 'NONE' || gaId === 'undefined' || gaId.trim() === '') {
    return
  }

  // 1. Async script – load gtag.js
  const loadScript = document.createElement('script')
  loadScript.async = true
  loadScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(loadScript)

  // 2. Inline script – dataLayer + gtag + config
  const inlineScript = document.createElement('script')
  inlineScript.textContent = [
    'window.dataLayer = window.dataLayer || [];',
    'function gtag(){dataLayer.push(arguments);}',
    'gtag("js", new Date());',
    `gtag("config", "${gaId.replace(/"/g, '\\"')}");`,
  ].join('\n')
  document.head.appendChild(inlineScript)
}

function getGaId(): string | undefined {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
  if (!id || id === 'none' || id === 'None' || id === 'NONE' || id === 'undefined' || id.trim() === '') return undefined
  return id
}

export function trackPageView(path: string): void {
  const gaId = getGaId()
  if (!gaId || typeof window.gtag !== 'function') return
  window.gtag('config', gaId, { page_path: path })
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  const gaId = getGaId()
  if (!gaId || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}
