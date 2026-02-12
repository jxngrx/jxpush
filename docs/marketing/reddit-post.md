**Title**: I built a production-grade push notification engine for Node.js (FCM + Expo) so you don't have to

**Body**:

Hey r/node,

I've been building mobile backends for years, and I always hit the same wall: **Push Notifications are easy to start, but hard to scale.**

Sending one request to FCM is simple. Sending 100,000? Now you need:
- A queue system (so you don't block the event loop)
- Rate limiting (so Google doesn't ban you)
- Batching logic (because you can't send 100k at once)
- Retry logic (because networks fail)

I got tired of copy-pasting this infrastructure code, so I bundled it into a library: **jxpush**.

### What it does:
- **Unified API**: Supports FCM and Expo with the same interface.
- **In-Memory Queue**: Concurrent worker pool built-in.
- **Auto-Throttling**: Token bucket rate limiter.
- **Auto-Batching**: Splits large arrays into optimal chunks.
- **Type-Safe**: Written in TypeScript.

### Example:
```typescript
const client = new PushClient({
  provider: ProviderType.EXPO,
  queue: { concurrency: 50 },
  retry: { maxAttempts: 5 }
});

// This handles queueing, rate-limiting, and retries for you
await client.send({ token, notification: { title: 'Hi' } });
```

It's open source and MIT licensed. I'd love for you to roast my code or give it a try.

🔗 **GitHub**: https://github.com/jxngrx/jxpush
📦 **NPM**: https://www.npmjs.com/package/jxpush
