/**
 * CLI Types
 */

export interface CLIConfig {
  provider?: string;
  token?: string;
  tokens?: string[];
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  file?: string;
  topic?: string;
  template?: string;
  locale?: string;
  config?: string;
  verbose?: boolean;
}

export interface SendOptions {
  provider: string;
  token: string;
  title?: string;
  body?: string;
  data?: string;
  priority?: string;
  ttl?: number;
  badge?: number;
  sound?: string;
  config?: string;
}

export interface BulkOptions {
  provider: string;
  file: string;
  title?: string;
  body?: string;
  data?: string;
  batchSize?: number;
  config?: string;
}

export interface TopicOptions {
  provider: string;
  topic: string;
  title?: string;
  body?: string;
  data?: string;
  config?: string;
}

export interface QueueOptions {
  action: 'status' | 'clear' | 'pause' | 'resume';
  config?: string;
}

export interface TemplateOptions {
  action: 'list' | 'render' | 'validate';
  name?: string;
  data?: string;
  locale?: string;
  config?: string;
}

export interface BulkMessageInput {
  token: string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
}
