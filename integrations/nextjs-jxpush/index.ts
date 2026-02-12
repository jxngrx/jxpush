import { PushClient, ProviderType } from 'jxpush';

// Singleton instance helper for Next.js API routes
let client: PushClient | null = null;

export const getPushClient = async () => {
  if (!client) {
    client = new PushClient({
      provider: ProviderType.EXPO,
      // Config from env
      expo: { accessToken: process.env.EXPO_ACCESS_TOKEN },
      // Minimal config for serverless
      queue: { enabled: false }
    });
    await client.initialize();
  }
  return client;
};

// Hook for API routes
export const withPush = (handler: any) => async (req: any, res: any) => {
  req.pushClient = await getPushClient();
  return handler(req, res);
};
