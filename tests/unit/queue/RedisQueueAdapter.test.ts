/**
 * Unit tests for RedisQueueAdapter
 */

import { RedisQueueAdapter } from '../../../src/queue/adapters/RedisQueueAdapter';
import type { QueueJob } from '../../../src/queue/adapters/IQueueAdapter';
import Redis from 'ioredis';

// Mock ioredis
jest.mock('ioredis');

describe('RedisQueueAdapter', () => {
  let adapter: RedisQueueAdapter;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(() => {
    mockRedis = {
      lpush: jest.fn().mockResolvedValue(1),
      rpush: jest.fn().mockResolvedValue(1),
      lpop: jest.fn().mockResolvedValue(null),
      zadd: jest.fn().mockResolvedValue(1),
      zrangebyscore: jest.fn().mockResolvedValue([]),
      zrem: jest.fn().mockResolvedValue(1),
      llen: jest.fn().mockResolvedValue(0),
      zcard: jest.fn().mockResolvedValue(0),
      hlen: jest.fn().mockResolvedValue(0),
      scard: jest.fn().mockResolvedValue(0),
      hset: jest.fn().mockResolvedValue(1),
      hdel: jest.fn().mockResolvedValue(1),
      hget: jest.fn().mockResolvedValue(null),
      sadd: jest.fn().mockResolvedValue(1),
      keys: jest.fn().mockResolvedValue([]),
      del: jest.fn().mockResolvedValue(1),
      pipeline: jest.fn().mockReturnValue({
        rpush: jest.fn().mockReturnThis(),
        zrem: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }),
      quit: jest.fn().mockResolvedValue('OK'),
    } as any;

    (Redis as jest.MockedClass<typeof Redis>).mockImplementation(() => mockRedis);

    adapter = new RedisQueueAdapter({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    });
  });

  afterEach(async () => {
    await adapter.close();
    jest.clearAllMocks();
  });

  describe('enqueue', () => {
    it('should enqueue a job successfully', async () => {
      const jobId = await adapter.enqueue({ message: 'test' });

      expect(jobId).toBeDefined();
      expect(mockRedis.rpush).toHaveBeenCalled();
    });

    it('should enqueue delayed job to sorted set', async () => {
      await adapter.enqueue({ message: 'delayed' }, { delay: 5000 });

      expect(mockRedis.zadd).toHaveBeenCalled();
      expect(mockRedis.rpush).not.toHaveBeenCalled();
    });
  });

  describe('dequeue', () => {
    it('should return null when queue is empty', async () => {
      mockRedis.lpop.mockResolvedValue(null);

      const job = await adapter.dequeue();

      expect(job).toBeNull();
    });

    it('should dequeue a job successfully', async () => {
      const jobData: QueueJob = {
        id: 'job-1',
        data: { message: 'test' },
        priority: 1,
        attempts: 0,
        maxAttempts: 3,
        timestamp: Date.now(),
      };

      mockRedis.lpop.mockResolvedValue([JSON.stringify(jobData)] as any);

      const job = await adapter.dequeue();

      expect(job).toEqual(jobData);
    });
  });

  describe('getMetrics', () => {
    it('should return queue metrics', async () => {
      mockRedis.llen.mockResolvedValue(5);
      mockRedis.hlen.mockResolvedValue(2);
      mockRedis.scard.mockResolvedValue(10);

      const metrics = await adapter.getMetrics();

      expect(metrics.pending).toBe(5);
      expect(metrics.processing).toBe(2);
      expect(metrics.completed).toBe(10);
    });
  });

  describe('clear', () => {
    it('should clear all queues', async () => {
      mockRedis.keys.mockResolvedValue(['key1', 'key2']);

      await adapter.clear();

      expect(mockRedis.del).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close Redis connection', async () => {
      await adapter.close();

      expect(mockRedis.quit).toHaveBeenCalled();
    });
  });
});
