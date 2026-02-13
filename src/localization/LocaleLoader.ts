/**
 * Locale Loader
 * Load locale files from file system
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import type { LocaleData } from '../types/localization.types.js';

export class LocaleLoader {
  /**
   * Load locale from JSON file
   */
  static loadLocale(filePath: string): { code: string; data: LocaleData } {
    if (!existsSync(filePath)) {
      throw new Error(`Locale file not found: ${filePath}`);
    }

    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as LocaleData;

    // Extract locale code from filename (e.g., en.json -> en)
    const fileName = filePath.split('/').pop() || '';
    const code = fileName.replace(extname(fileName), '');

    return { code, data };
  }

  /**
   * Load all locales from directory
   */
  static loadLocalesFromDirectory(directoryPath: string): Map<string, LocaleData> {
    if (!existsSync(directoryPath)) {
      throw new Error(`Locales directory not found: ${directoryPath}`);
    }

    const locales = new Map<string, LocaleData>();
    const files = readdirSync(directoryPath);

    for (const file of files) {
      const filePath = join(directoryPath, file);
      const ext = extname(file);

      // Only load .json files
      if (ext === '.json') {
        try {
          const { code, data } = this.loadLocale(filePath);
          locales.set(code, data);
        } catch (error) {
          console.error(`Failed to load locale ${file}:`, error);
        }
      }
    }

    return locales;
  }
}
