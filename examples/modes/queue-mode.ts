import { PushClient, ProviderType } from '../src';

async function runCallback() {
  // 1. Initialize with specific queue settings
  const client = new PushClient({
    provider: ProviderType.EXPO,
    queue: {
      enabled: true,
      concurrency: 5,   // Process 5 at a time
      maxSize: 1000,    // Hold up to 1000 messages
    }
  });

  await client.initialize();

  console.log('🚀 Queue Mode Started');

  // 2. Add 20 messages to queue
  for (let i = 0; i < 20; i++) {
    client.queue({
      token: `ExponentPushToken[mock-token-${i}]`,
      notification: {
        title: `Message ${i}`,
        body: 'This is queued'
      }
    });
    console.log(`Queued message ${i}`);
  }

  // 3. Watch them process
  const status = client.getQueueStatus();
  console.log('Queue Status:', status);

  // Keep alive to process
  setTimeout(async () => {
    console.log('Final Queue Status:', client.getQueueStatus());
    await client.shutdown();
  }, 2000);
}

runCallback();
