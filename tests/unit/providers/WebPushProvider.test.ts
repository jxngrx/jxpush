/**
 * Unit tests for WebPushProvider
 */

import { WebPushProvider } from '../../../src/providers/webpush/WebPushProvider';
import type { PushMessage } from '../../../src/types/message.types';
import webpush from 'web-push';

jest.mock('web-push');

describe('WebPushProvider', () => {
  let provider: WebPushProvider;

  beforeEach(() => {
    (webpush.setVapidDetails as jest.Mock) = jest.fn();
    (webpush.sendNotification as jest.Mock) = jest.fn().mockResolvedValue({
      statusCode: 201,
    });

    provider = new WebPushProvider({
      vapidKeys: {
        subject: 'mailto:test@example.com',
        publicKey: 'test-public-key',
        privateKey: 'test-private-key',
      },
    });
  });

  describe('send', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    it('should send web push notification', async () => {
      const subscription = {
        endpoint: 'https://push.example.com/123',
        keys: { p256dh: 'test-p256dh', auth: 'test-auth' },
      };

      const message: PushMessage = {
        token: JSON.stringify(subscription),
        notification: { title: 'Test', body: 'Body' },
      };

      const result = await provider.send(message);
      expect(result.success).toBe(true);
    });
  });

  describe('validateToken', () => {
    it('should validate subscription', () => {
      const subscription = JSON.stringify({
        endpoint: 'https://push.example.com/123',
        keys: { p256dh: 'test', auth: 'test' },
      });

      expect(provider.validateToken(subscription)).toBe(true);
    });
  });
});
