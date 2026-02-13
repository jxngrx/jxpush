/**
 * Unit tests for BullMQAdapter
 */

import { BullMQAdapter } from '../../../src/queue/adapters/BullMQAdapter';
import { Queue, Worker } from 'bullmq';

// Mock bullmq
jest.mock('bullmq');

describe('BullMQAdapter', () => {
  let adapter: BullMQAdapter;
  let mockQueue: jest.Mocked<Queue>;
  let mockWorker: jest.Mocked<Worker>;

  beforeEach(() => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-1' }),
      getJobCounts: jest.fn().mockResolvedValue({
        waiting: 5,
        active: 2,
        completed: 10,
        failed: 1,
        delayed: 3,
      }),
      obliterate: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn().mockResolvedValue(undefined),
      resume: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockWorker = {
      close: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
    } as any;

    (Queue as jest.MockedClass<typeof Queue>).mockImplementation(() => mockQueue);
    (Worker as jest.MockedClass<typeof Worker>).mockImplementation(() => mockWorker);

    adapter = new BullMQAdapter({
      connection: {
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
    it('should add job to BullMQ queue', async () => {
      const jobId = await adapter.enqueue({ message: 'test' }, { priority: 1 });

      expect(jobId).toBeDefined();
      expect(mockQueue.add).toHaveBeenCalled();
    });

    it('should handle delayed jobs', async () => {
      await adapter.enqueue({ message: 'delayed' }, { delay: 5000 });

      expect(mockQueue.add).toHaveBeenCalledWith(
        'push-notification',
        expect.any(Object),
        expect.objectContaining({
          delay: 5000,
        })
      );
    });
  });

  describe('getMetrics', () => {
    it('should return queue metrics from BullMQ', async () => {
      const metrics = await adapter.getMetrics();

      expect(metrics.pending).toBeGreaterThanOrEqual(0);
      expect(metrics.completed).toBeGreaterThanOrEqual(0);
    });
  });

  describe('clear', () => {
    it('should obliterate the queue', async () => {
      await adapter.clear();

      expect(mockQueue.obliterate).toHaveBeenCalled();
    });
  });

  describe('pause and resume', () => {
    it('should pause the queue', async () => {
      await adapter.pause();

      expect(mockQueue.pause).toHaveBeenCalled();
    });

    it('should resume the queue', async () => {
      await adapter.resume();

      expect(mockQueue.resume).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close queue and events', async () => {
      await adapter.close();

      expect(mockQueue.close).toHaveBeenCalled();
      // Worker is only created via createWorker(), not in constructor
    });
  });
});
