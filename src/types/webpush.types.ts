/**
 * Web Push Types
 */

export interface WebPushConfig {
  vapidKeys: {
    publicKey: string;
    privateKey: string;
    subject: string; // mailto: or https:// URL
  };
  gcmApiKey?: string; // For Chrome on Android
}

export interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface WebPushMessage {
  subscription: WebPushSubscription;
  title?: string;
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

export interface WebPushOptions {
  ttl?: number; // Time to live in seconds
  urgency?: 'very-low' | 'low' | 'normal' | 'high';
  topic?: string;
}

export interface WebPushResult {
  success: boolean;
  statusCode?: number;
  error?: Error;
}
