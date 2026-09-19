import englishMessages from '../locales/en.json';
import dutchMessages from '../locales/nl.json';
import simplifiedChineseMessages from '../locales/zh-CN.json';

export const SUPPORTED_LOCALES = ['en', 'zh-CN', 'nl'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type TranslationKey = keyof typeof englishMessages;
export type TranslationParameters = Record<string, string | number>;

const DEFAULT_LOCALE: SupportedLocale = 'en';
const STORAGE_KEY = 'trust-protocol.locale';

const messages: Record<
  SupportedLocale,
  Partial<Record<TranslationKey, string>>
> = {
  en: englishMessages,
  'zh-CN': simplifiedChineseMessages,
  nl: dutchMessages,
};

export function translate(
  locale: SupportedLocale,
  key: TranslationKey,
  parameters: TranslationParameters = {},
): string {
  const template = messages[locale][key] ?? messages[DEFAULT_LOCALE][key] ?? key;

  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(parameters, name)
      ? String(parameters[name])
      : match,
  );
}

export function getInitialLocale(): SupportedLocale {
  const savedLocale = window.localStorage.getItem(STORAGE_KEY);
  if (isSupportedLocale(savedLocale)) return savedLocale;

  for (const requestedLocale of navigator.languages) {
    const matchedLocale = matchLocale(requestedLocale);
    if (matchedLocale) return matchedLocale;
  }

  return DEFAULT_LOCALE;
}

export function persistLocale(locale: SupportedLocale): void {
  window.localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function formatNumber(
  locale: SupportedLocale,
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  locale: SupportedLocale,
  value: number,
  currency: string,
): string {
  return formatNumber(locale, value, {
    style: 'currency',
    currency,
  });
}

export function formatDateTime(
  locale: SupportedLocale,
  value: Date | number,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, options).format(value);
}

function matchLocale(requestedLocale: string): SupportedLocale | undefined {
  const exactMatch = SUPPORTED_LOCALES.find(
    (locale) => locale.toLowerCase() === requestedLocale.toLowerCase(),
  );
  if (exactMatch) return exactMatch;

  const requestedLanguage = requestedLocale.split('-')[0]?.toLowerCase();
  return SUPPORTED_LOCALES.find(
    (locale) => locale.split('-')[0]?.toLowerCase() === requestedLanguage,
  );
}
