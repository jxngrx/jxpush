/**
 * Unit tests for LocalizationEngine
 */

import { LocalizationEngine } from '../../../src/localization/LocalizationEngine';
import type { LocaleData } from '../../../src/types/localization.types';

describe('LocalizationEngine', () => {
  let engine: LocalizationEngine;

  beforeEach(() => {
    engine = new LocalizationEngine({
      defaultLocale: 'en',
      fallbackLocale: 'en',
      supportedLocales: ['en', 'es', 'fr'],
    });
  });

  describe('registerLocale', () => {
    it('should register a locale', () => {
      const localeData: LocaleData = {
        welcome: 'Welcome',
        goodbye: 'Goodbye',
      };

      engine.registerLocale('en', localeData);

      expect(engine.isLocaleSupported('en')).toBe(true);
    });

    it('should register multiple locales', () => {
      const enData: LocaleData = { greeting: 'Hello' };
      const esData: LocaleData = { greeting: 'Hola' };

      engine.registerLocale('en', enData);
      engine.registerLocale('es', esData);

      expect(engine.isLocaleSupported('en')).toBe(true);
      expect(engine.isLocaleSupported('es')).toBe(true);
    });
  });

  describe('translate', () => {
    beforeEach(() => {
      const enData: LocaleData = {
        messages: {
          welcome: 'Welcome',
          greeting: 'Hello {{name}}',
        },
        errors: {
          notFound: 'Not found',
        },
      };

      const esData: LocaleData = {
        messages: {
          welcome: 'Bienvenido',
          greeting: 'Hola {{name}}',
        },
      };

      engine.registerLocale('en', enData);
      engine.registerLocale('es', esData);
    });

    it('should translate simple key', () => {
      const result = engine.translate('messages.welcome', 'en');
      expect(result).toBe('Welcome');
    });

    it('should translate with different locale', () => {
      const result = engine.translate('messages.welcome', 'es');
      expect(result).toBe('Bienvenido');
    });

    it('should translate nested keys', () => {
      const result = engine.translate('errors.notFound', 'en');
      expect(result).toBe('Not found');
    });

    it('should replace variables in translation', () => {
      const result = engine.translate('messages.greeting', 'en', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should support both {{variable}} and {variable} syntax', () => {
      const localeData: LocaleData = {
        test: 'Hello {name}',
      };
      engine.registerLocale('test', localeData);

      const result = engine.translate('test', 'test', { name: 'Alice' });
      expect(result).toBe('Hello Alice');
    });

    it('should fallback to default locale when key not found', () => {
      const result = engine.translate('errors.notFound', 'es'); // es doesn't have this key
      expect(result).toBe('Not found'); // falls back to en
    });

    it('should return key when translation not found', () => {
      const result = engine.translate('non.existent.key', 'en');
      expect(result).toBe('non.existent.key');
    });

    it('should use default locale when no locale specified', () => {
      const result = engine.translate('messages.welcome');
      expect(result).toBe('Welcome');
    });
  });

  describe('translateBatch', () => {
    beforeEach(() => {
      const enData: LocaleData = {
        hello: 'Hello',
        goodbye: 'Goodbye',
        thanks: 'Thank you',
      };

      engine.registerLocale('en', enData);
    });

    it('should translate multiple keys at once', () => {
      const keys = ['hello', 'goodbye', 'thanks'];
      const result = engine.translateBatch(keys, 'en');

      expect(result).toEqual({
        hello: 'Hello',
        goodbye: 'Goodbye',
        thanks: 'Thank you',
      });
    });

    it('should handle variables in batch translation', () => {
      const localeData: LocaleData = {
        greeting: 'Hello {{name}}',
      };
      engine.registerLocale('test', localeData);

      const result = engine.translateBatch(['greeting'], 'test', { name: 'Bob' });

      expect(result.greeting).toBe('Hello Bob');
    });
  });

  describe('formatNumber', () => {
    it('should format number according to locale', () => {
      const result = engine.formatNumber(1234567.89, 'en-US');
      expect(result).toContain('1,234,567');
    });

    it('should use default locale when not specified', () => {
      const result = engine.formatNumber(1000);
      expect(result).toBeTruthy();
    });
  });

  describe('formatDate', () => {
    it('should format date according to locale', () => {
      const date = new Date('2024-01-15');
      const result = engine.formatDate(date, 'en-US');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should support date format options', () => {
      const date = new Date('2024-01-15');
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      const result = engine.formatDate(date, 'en-US', options);
      expect(result).toContain('January');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency according to locale', () => {
      const result = engine.formatCurrency(1234.56, 'USD', 'en-US');

      expect(result).toContain('$');
      expect(result).toContain('1,234.56');
    });

    it('should support different currencies', () => {
      const result = engine.formatCurrency(1000, 'EUR', 'de-DE');

      expect(result).toContain('€');
    });
  });

  describe('getSupportedLocales', () => {
    it('should return list of supported locales', () => {
      engine.registerLocale('en', {});
      engine.registerLocale('es', {});
      engine.registerLocale('fr', {});

      const locales = engine.getSupportedLocales();

      expect(locales).toContain('en');
      expect(locales).toContain('es');
      expect(locales).toContain('fr');
    });
  });

  describe('getLocaleData', () => {
    it('should return locale data', () => {
      const data: LocaleData = {
        test: 'Test value',
      };

      engine.registerLocale('test', data);
      const result = engine.getLocaleData('test');

      expect(result).toEqual(data);
    });

    it('should return undefined for non-existent locale', () => {
      const result = engine.getLocaleData('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('clearLocales', () => {
    it('should clear all registered locales', () => {
      engine.registerLocale('en', {});
      engine.registerLocale('es', {});

      expect(engine.getSupportedLocales()).toHaveLength(2);

      engine.clearLocales();

      expect(engine.getSupportedLocales()).toHaveLength(0);
    });
  });
});
