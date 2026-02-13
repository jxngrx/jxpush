/**
 * Email Types
 */

export interface EmailMessage {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface EmailAttachment {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
  encoding?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: Error;
}

export interface ResendConfig {
  apiKey: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure?: boolean; // true for 465, false for other ports
  auth?: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized?: boolean;
  };
}
