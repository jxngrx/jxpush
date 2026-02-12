import { PushClient, ProviderType } from '../src';

async function runRetry() {
  const client = new PushClient({
    provider: ProviderType.EXPO,
    retry: {
      enabled: true,
      maxAttempts: 3,         // Try 3 times
      initialDelayMs: 500,    // Wait 500ms first
      backoffMultiplier: 2,   // Double wait time each fail
      useJitter: true         // Add randomness
    },
    hooks: {
      onRetry: (data) => {
        console.log(`⚠️ Retry attempt ${data.attempt}/${data.maxAttempts} for ${data.messageId}`);
        console.log(`   Waiting ${data.delayMs}ms before next try`);
      }
    }
  });

  await client.initialize();

  console.log('🚀 Retry Mode Started');
  console.log('(Note: Expect retries if token is invalid or network fails)');

  await client.send({
    token: 'ExponentPushToken[invalid-token]', // This might trigger error/retry depending on mock
    notification: { title: 'Retry Test', body: 'Checking backoff' }
  });

  await client.shutdown();
}

runRetry();
