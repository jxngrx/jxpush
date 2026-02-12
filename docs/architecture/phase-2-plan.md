# Phase 2 Architecture Plan

## 1. Redis Queue Adapter
**Goal**: Enable persistent queues and horizontal scaling.

### Design
- Interface `IQueue` (current `InMemoryQueue` implements this).
- Create `RedisQueue` implementing `IQueue`.
- Use `bullmq` or `ioredis`.

```typescript
interface IQueue {
  enqueue(item: QueueItem): Promise<string>;
  dequeue(): Promise<QueueItem | null>;
  // ...
}
```

## 2. Topic Messaging
**Goal**: Unified API for pub/sub messaging.

### Design
- FCM has native topics.
- Expo doesn't -> Implement "Virtual Topics" via Redis/Database mapping?
- Or just expose FCM topic API directly first.

```typescript
client.sendToTopic('news', { title: 'Breaking' });
```

## 3. Scheduling
**Goal**: Send messages at a future time.

### Design
- Add `scheduleAt` to `PushMessage`.
- If using Redis, use `delayed` jobs.
- If in-memory, use `setTimeout` (risky if restart).
- **Decision**: Requires Redis adapter for production reliability.

## 4. WebPush Support
**Goal**: Support browser notifications.

### Design
- Use `web-push` library.
- Add `ProviderType.WEB`.
- Standardize payload (Subject, VAPID keys).

## 5. Template Engine
**Goal**: Decouple content from code.

### Design
- Simple Mustache/Handlebars implementation.
- `client.registerTemplate('welcome', 'Hello {{name}}!')`.
- `client.sendTemplate('welcome', { name: 'User' })`.

## Task Breakdown

| Feature | Difficulty | Dependency |
| :--- | :---: | :--- |
| Redis Adapter | ⭐⭐⭐ | None |
| WebPush | ⭐⭐ | None |
| Scheduling | ⭐⭐ | Redis Adapter |
| Topics | ⭐ | None |
| Templates | ⭐ | None |
