import { PushClient, ProviderType } from '../src';

async function runRateLimit() {
  const client = new PushClient({
    provider: ProviderType.EXPO,
    rateLimit: {
      enabled: true,
      maxPerSecond: 5,        // Extract 5 per second
      allowBurst: true,       // Allow slight bursts
    },
    hooks: {
      onRateLimit: (waitMs) => {
        console.log(`⏳ Rate limited! Throttling for ${waitMs}ms`);
      },
      onSendSuccess: () => process.stdout.write('.')
    }
  });

  await client.initialize();

  console.log('🚀 Rate Limit Mode Started (Sending 20 messages fast)');

  const promises = [];
  for (let i = 0; i < 20; i++) {
    promises.push(client.send({
      token: 'ExponentPushToken[mock-token]',
      notification: { title: 'Spam', body: 'Fast message' }
    }));
  }

  await Promise.all(promises);
  console.log('\n✅ Done!');

  await client.shutdown();
}

runRateLimit();
