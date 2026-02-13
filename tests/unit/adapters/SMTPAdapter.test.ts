/**
 * Unit tests for SMTPAdapter
 */

import { SMTPAdapter } from '../../../src/adapters/email/SMTPAdapter';
import type { EmailMessage } from '../../../src/types/email.types';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('SMTPAdapter', () => {
  let adapter: SMTPAdapter;
  let mockTransporter: any;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'smtp-123' }),
      verify: jest.fn().mockResolvedValue(true),
      close: jest.fn(),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    adapter = new SMTPAdapter({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'password',
      },
    });
  });

  afterEach(async () => {
    await adapter.close();
    jest.clearAllMocks();
  });

  describe('send', () => {
    it('should send email successfully', async () => {
      const message: EmailMessage = {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
      };

      const result = await adapter.send(message);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('smtp-123');
    });

    it('should handle send errors', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

      const message: EmailMessage = {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'Hello',
      };

      const result = await adapter.send(message);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('sendBulk', () => {
    it('should send multiple emails', async () => {
      const messages: EmailMessage[] = [
        {
          from: 'sender@example.com',
          to: 'recipient1@example.com',
          subject: 'Email 1',
          text: 'Hello 1',
        },
        {
          from: 'sender@example.com',
          to: 'recipient2@example.com',
          subject: 'Email 2',
          text: 'Hello 2',
        },
      ];

      const results = await adapter.sendBulk(messages);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    });
  });

  describe('verify', () => {
    it('should verify SMTP connection', async () => {
      const result = await adapter.verify();

      expect(result).toBe(true);
      expect(mockTransporter.verify).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close transporter', async () => {
      await adapter.close();

      expect(mockTransporter.close).toHaveBeenCalled();
    });
  });
});
