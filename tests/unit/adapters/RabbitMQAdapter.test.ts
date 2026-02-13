/**
 * Unit tests for RabbitMQAdapter
 */

import { RabbitMQAdapter } from '../../../src/adapters/messaging/RabbitMQAdapter';
import type { MessagingMessage } from '../../../src/types/messaging.types';
import amqp from 'amqplib';

// Mock amqplib
jest.mock('amqplib');

describe('RabbitMQAdapter', () => {
  let adapter: RabbitMQAdapter;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(() => {
    mockChannel = {
      assertExchange: jest.fn().mockResolvedValue({}),
      publish: jest.fn().mockReturnValue(true),
      prefetch: jest.fn().mockResolvedValue(undefined),
      waitForConfirms: jest.fn().mockResolvedValue(undefined),
      confirmSelect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn().mockResolvedValue(undefined),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

    adapter = new RabbitMQAdapter({
      url: 'amqp://localhost',
      exchange: 'test-exchange',
      exchangeType: 'topic',
    });
  });

  afterEach(async () => {
    await adapter.close();
    jest.clearAllMocks();
  });

  describe('publish', () => {
    it('should publish message to exchange', async () => {
      const result = await adapter.publish('test.routing.key', { data: 'test' });

      expect(result.success).toBe(true);
      expect(mockChannel.publish).toHaveBeenCalled();
    });

    it('should publish message with headers', async () => {
      await adapter.publish('test.key', { data: 'test' }, {
        headers: { 'x-custom-header': 'value' },
      });

      expect(mockChannel.publish).toHaveBeenCalledWith(
        'test-exchange',
        'test.key',
        expect.any(Buffer),
        expect.objectContaining({
          headers: { 'x-custom-header': 'value' },
        })
      );
    });

    it('should handle publish errors', async () => {
      mockChannel.publish.mockReturnValue(false);

      const result = await adapter.publish('test.key', { data: 'test' });

      expect(result.success).toBe(false);
    });
  });

  describe('publishBatch', () => {
    it('should publish multiple messages', async () => {
      const messages: MessagingMessage[] = [
        { topic: 'key1', value: { data: 'test1' } },
        { topic: 'key2', value: { data: 'test2' } },
      ];

      const results = await adapter.publishBatch(messages);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(mockChannel.publish).toHaveBeenCalledTimes(2);
    });
  });

  describe('close', () => {
    it('should close channel and connection', async () => {
      await adapter.connect();
      await adapter.close();

      expect(mockChannel.close).toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalled();
    });
  });
});
