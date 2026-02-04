/**
 * Map vue-i18n locale to Intl locale for date formatting.
 * Use zh-HK for Traditional Chinese (Hong Kong).
 */
const localeMap: Record<string, string> = {
  en: 'en',
  zh: 'zh-HK',
}

export type DateFormatStyle = 'short' | 'medium' | 'long'

const defaultOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
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
  isoDate: string,
  locale?: string,
  style: DateFormatStyle = 'medium'
): string {
  const d = new Date(isoDate)
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
