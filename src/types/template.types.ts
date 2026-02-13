/**
 * Template Types
 */

export interface Template {
  id: string;
  name: string;
  content: string;
  locale?: string;
  variables?: string[];
  metadata?: Record<string, unknown>;
}

export interface TemplateData {
  [key: string]: unknown;
}

export interface TemplateConfig {
  templatesPath?: string;
  defaultLocale?: string;
  cacheTemplates?: boolean;
}

export interface RenderedTemplate {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
}
