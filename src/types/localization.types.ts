/**
 * Localization Types
 */

export interface Locale {
  code: string;
  name: string;
  translations: Record<string, string>;
}

export interface LocaleData {
  [key: string]: string | LocaleData;
}

export interface LocalizationConfig {
  localesPath?: string;
  defaultLocale?: string;
  fallbackLocale?: string;
  supportedLocales?: string[];
}
