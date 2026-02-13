/**
 * Template Loader
 * Load templates from file system
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import type { Template } from '../types/template.types.js';

export class TemplateLoader {
  /**
   * Load template from file
   */
  static loadTemplate(filePath: string): Template {
    if (!existsSync(filePath)) {
      throw new Error(`Template file not found: ${filePath}`);
    }

    const content = readFileSync(filePath, 'utf-8');
    const fileName = filePath.split('/').pop() || '';
    const nameWithoutExt = fileName.replace(extname(fileName), '');

    // Parse locale from filename (e.g., welcome.en.hbs -> en)
    const parts = nameWithoutExt.split('.');
    const locale = parts.length > 1 ? parts[parts.length - 1] : undefined;
    const templateId = parts.length > 1 ? parts.slice(0, -1).join('.') : nameWithoutExt;

    return {
      id: templateId,
      name: nameWithoutExt,
      content,
      locale,
    };
  }

  /**
   * Load all templates from directory
   */
  static loadTemplatesFromDirectory(directoryPath: string): Template[] {
    if (!existsSync(directoryPath)) {
      throw new Error(`Templates directory not found: ${directoryPath}`);
    }

    const templates: Template[] = [];
    const files = readdirSync(directoryPath);

    for (const file of files) {
      const filePath = join(directoryPath, file);
      const ext = extname(file);

      // Only load .hbs, .handlebars, or .json files
      if (['.hbs', '.handlebars', '.json'].includes(ext)) {
        try {
          const template = this.loadTemplate(filePath);
          templates.push(template);
        } catch (error) {
          console.error(`Failed to load template ${file}:`, error);
        }
      }
    }

    return templates;
  }

  /**
   * Parse template content from JSON
   */
  static parseTemplateJSON(jsonContent: string): Template {
    const data = JSON.parse(jsonContent);

    if (!data.id || !data.content) {
      throw new Error('Invalid template JSON: missing id or content');
    }

    return {
      id: data.id,
      name: data.name || data.id,
      content: data.content,
      locale: data.locale,
      variables: data.variables,
      metadata: data.metadata,
    };
  }
}
