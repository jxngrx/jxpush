import { PushClient, ProviderType } from '../src';

const TOTAL_MESSAGES = 1000;
const CONCURRENCY = 50;

async function runBenchmark() {
  console.log('🚀 Starting Benchmark...');
  console.log(`Target: Process ${TOTAL_MESSAGES} messages`);
  console.log(`Concurrency: ${CONCURRENCY}`);

  const client = new PushClient({
    provider: ProviderType.EXPO,
    queue: {
      enabled: true,
      concurrency: CONCURRENCY,
    },
    // Mock provider is fast, so we need high rate limit to test raw throughput
    rateLimit: {
      maxPerSecond: 1000,
      allowBurst: true
    }
  });

  await client.initialize();

  const start = Date.now();
  const promises = [];

  for (let i = 0; i < TOTAL_MESSAGES; i++) {
    promises.push(
      client.send({
        token: `ExponentPushToken[bench-${i}]`,
        notification: { title: 'Bench', body: 'Mark' }
      })
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;
  const rps = (TOTAL_MESSAGES / (duration / 1000)).toFixed(2);

  console.log('\n📊 Benchmark Results:');
  console.log(`Total Time: ${duration}ms`);
  console.log(`Throughput: ${rps} msg/sec`);

  await client.shutdown();
}

runBenchmark();
