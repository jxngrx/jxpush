import { PushClient, ProviderType } from '../src';

// Simulate sustained load
const DURATION_SECONDS = 10;
const RATE_PER_SECOND = 100; // 100 rps sustained

async function runLoadTest() {
  console.log('🏋️ Starting Load Test...');
  console.log(`Duration: ${DURATION_SECONDS}s`);
  console.log(`Rate: ${RATE_PER_SECOND} req/s`);

  const client = new PushClient({
    provider: ProviderType.EXPO,
    queue: { enabled: true, concurrency: 20 },
    rateLimit: { maxPerSecond: RATE_PER_SECOND * 1.5 } // Allow overhead
  });

  await client.initialize();

  let sent = 0;
  const start = Date.now();

  const interval = setInterval(() => {
    // Send batch for this second
    for (let i = 0; i < RATE_PER_SECOND; i++) {
      client.queue({
        token: `ExponentPushToken[load-${Date.now()}-${i}]`,
        notification: { title: 'Load', body: 'Test' }
      });
      sent++;
    }

    const elapsed = (Date.now() - start) / 1000;
    process.stdout.write(`\rTime: ${elapsed.toFixed(1)}s | Sent: ${sent}`);

    if (elapsed >= DURATION_SECONDS) {
      clearInterval(interval);
      finish();
    }
  }, 1000);

  async function finish() {
    console.log('\n\n✅ Load generation complete. Waiting for queue drain...');

    // Wait for queue to empty
    while (client.getQueueStatus()?.size! > 0) {
      const status = client.getQueueStatus();
      process.stdout.write(`\rPending: ${status?.size} | Processing: ${status?.processing}`);
      await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n\n🎉 Load test complete!');
    await client.shutdown();
  }
}

runLoadTest();
