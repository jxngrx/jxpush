/**
 * Unit tests for KafkaAdapter
 */

import { KafkaAdapter } from '../../../src/adapters/messaging/KafkaAdapter';
import type { MessagingMessage } from '../../../src/types/messaging.types';
import { Kafka, Producer } from 'kafkajs';

// Mock kafkajs
jest.mock('kafkajs');

describe('KafkaAdapter', () => {
  let adapter: KafkaAdapter;
  let mockProducer: jest.Mocked<Producer>;
  let mockKafka: jest.Mocked<Kafka>;

  beforeEach(() => {
    mockProducer = {
      connect: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue([{ topicName: 'test-topic', partition: 0, baseOffset: '0' }]),
      sendBatch: jest.fn().mockResolvedValue([]),
      disconnect: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockKafka = {
      producer: jest.fn().mockReturnValue(mockProducer),
    } as any;

    (Kafka as jest.MockedClass<typeof Kafka>).mockImplementation(() => mockKafka);

    adapter = new KafkaAdapter({
      brokers: ['localhost:9092'],
      clientId: 'test-client',
    });
  });

  afterEach(async () => {
    await adapter.close();
    jest.clearAllMocks();
  });

  describe('publish', () => {
    it('should publish message to topic', async () => {
      const result = await adapter.publish('test-topic', { data: 'test' });

      expect(result.success).toBe(true);
      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'test-topic',
        })
      );
    });

    it('should publish message with key', async () => {
      await adapter.publish('test-topic', { data: 'test' }, { key: 'partition-key' });

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: 'partition-key',
            }),
          ]),
        })
      );
    });

    it('should handle publish errors', async () => {
      mockProducer.send.mockRejectedValue(new Error('Kafka Error'));

      const result = await adapter.publish('test-topic', { data: 'test' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('publishBatch', () => {
    it('should publish multiple messages', async () => {
      const messages: MessagingMessage[] = [
        { topic: 'topic1', value: { data: 'test1' } },
        { topic: 'topic2', value: { data: 'test2' } },
      ];

      const results = await adapter.publishBatch(messages);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
    });
  });

  describe('close', () => {
    it('should disconnect from Kafka', async () => {
      await adapter.connect();
      await adapter.close();

      expect(mockProducer.disconnect).toHaveBeenCalled();
    });
  });
});
