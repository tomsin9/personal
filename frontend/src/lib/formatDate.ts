/**
 * Map vue-i18n locale to Intl locale for date formatting.
 * Use en-GB for British English; zh-HK for Traditional Chinese (Hong Kong).
 */
const localeMap: Record<string, string> = {
  en: 'en-GB',
  zh: 'zh-HK',
}

/** For datetime we use British English (en-GB) with AM/PM. */
const datetimeLocaleMap: Record<string, string> = {
  en: 'en-GB',
  zh: 'zh-HK',
}

export type DateFormatStyle = 'short' | 'medium' | 'long'

const defaultOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

/**
 * Parse ISO date string. If no timezone (Z or ±HH:MM), treat as UTC so
 * backend UTC times display correctly in user's local timezone (e.g. Hong Kong).
 */
function parseAsUtcIfNeeded(isoDate: string): Date {
  const s = isoDate.trim()
  const hasOffset = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(s)
  return new Date(hasOffset ? s : s + 'Z')
}

/**
 * Format an ISO date string for display, respecting i18n locale.
 * Use in components with: formatDate(isoDate, locale) where locale from useI18n().
 *
 * @param isoDate - ISO 8601 string (e.g. 2026-02-04T09:08:32.000078)
 * @param locale - Optional locale (e.g. 'en', 'zh'). When omitted, uses browser default.
 * @param style - Optional style; default is 'medium' (e.g. "Feb 4, 2026" / "2026年2月4日")
 * @returns Formatted date string, or original string if invalid
 */
export function formatDate(
  isoDate: string | undefined,
  locale?: string,
  style: DateFormatStyle = 'medium'
): string {
  if (isoDate == null || isoDate === '') return ''
  const d = parseAsUtcIfNeeded(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate

  const intlLocale = locale ? localeMap[locale] ?? locale : undefined
  const options: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { year: 'numeric', month: 'numeric', day: 'numeric' }
      : style === 'long'
        ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
        : defaultOptions

  return new Intl.DateTimeFormat(intlLocale, options).format(d)
}

/**
 * Format an ISO date-time for display with time (AM/PM or 上午/下午).
 * Chinese uses 上午/下午; English uses British format (en-GB) with AM/PM.
 */
export function formatDateTime(isoDate: string | undefined, locale?: string): string {
  if (isoDate == null || isoDate === '') return ''
  const d = parseAsUtcIfNeeded(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate

  const intlLocale = locale ? datetimeLocaleMap[locale] ?? localeMap[locale] ?? locale : undefined
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }
  return new Intl.DateTimeFormat(intlLocale, options).format(d)
}


type RelativeTimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

/**
 * Format an ISO date as a relative time string (e.g. "2 hours ago", "3 days ago").
 * Uses Intl.RelativeTimeFormat for locale-aware output (en-GB / zh-HK).
 *
 * @param isoDate - ISO 8601 string
 * @param locale - Optional locale ('en', 'zh'). When omitted, uses browser default.
 * @returns Relative time string, or formatted date if invalid / far in the past
 */
export function formatTimeAgo(isoDate: string | undefined, locale?: string): string {
  if (isoDate == null || isoDate === '') return ''
  const d = parseAsUtcIfNeeded(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate

  const intlLocale = locale ? localeMap[locale] ?? locale : undefined
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' })

  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)
  const diffWeek = Math.round(diffDay / 7)
  const diffMonth = Math.round(diffDay / 30)
  const diffYear = Math.round(diffDay / 365)

  const choose = (value: number, unit: RelativeTimeUnit): string =>
    rtf.format(value, unit)

  if (Math.abs(diffSec) < 60) return choose(diffSec, 'second')
  if (Math.abs(diffMin) < 60) return choose(diffMin, 'minute')
  if (Math.abs(diffHour) < 24) return choose(diffHour, 'hour')
  if (Math.abs(diffDay) < 7) return choose(diffDay, 'day')
  if (Math.abs(diffWeek) < 4) return choose(diffWeek, 'week')
  if (Math.abs(diffMonth) < 12) return choose(diffMonth, 'month')
  return choose(diffYear, 'year')
}