# Stop Building Push Notification Infrastructure From Scratch 🛑

**tl;dr**: Meet `jxpush`, a unified, type-safe library for Node.js that handles FCM, Expo, queues, rate-limiting, and retries out of the box.

---

Hey developers! 👋

If you've ever built a backend for a mobile app, you know the pain of push notifications.

It starts simple: "Just send a message to FCM."
Then it gets real:
- "We need to support Android (FCM) and iOS (APNs/Expo)."
- "Why are we getting rate-limited?"
- "The server crashed because we sent 100k messages at once."
- "We need to retry failed requests."

Before you know it, you're building a whole infrastructure just to say "Hello World".

**I built `jxpush` to stop this madness.**

## Infrastructure-in-a-Box 📦

`jxpush` isn't just a wrapper. It's an engine.

### 1. Unified API
Switch between providers without changing your code.

```typescript
const client = new PushClient({ provider: ProviderType.EXPO });
// vs
const client = new PushClient({ provider: ProviderType.FCM });
```

### 2. Built-in Queue & Concurrency
Stop managing worker pools. `jxpush` has a concurrent in-memory queue.

```typescript
client.queue({ token: '...' }); // Returns immediately, processed in background
```

### 3. Smart Retries
Network blip? Rate limit? `jxpush` handles exponential backoff automatically.

### 4. Bulk Sending
Send 10,000 messages? We split them into optimal chunks (500 for FCM, 100 for Expo) automatically.

## Quick Start

```bash
npm install jxpush
```

```typescript
import { PushClient, ProviderType } from 'jxpush';

const client = new PushClient({ provider: ProviderType.EXPO });
await client.initialize();

await client.send({
  token: 'ExponentPushToken[...]',
  notification: { title: 'It works!', body: 'Production ready in 30s' }
});
```

## Comparisons

| Feature | Generic Libraries | jxpush |
|---------|-------------------|--------|
| Multi-Provider | ❌ | ✅ |
| Rate Limiting | ❌ | ✅ |
| Retries | ❌ | ✅ |
| TypeScript | ⚠️ | ✅ |

## Give it a try!

I'd love to hear your feedback.
🔗 **GitHub**: https://github.com/jxngrx/jxpush
📦 **NPM**: https://www.npmjs.com/package/jxpush

Happy coding! 🚀
