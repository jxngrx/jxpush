# Scalability Claims & Proofs

## Throughput
`jxpush` is designed to saturate standard network I/O before hitting CPU bottlenecks.

- **Claim**: Capable of processing **5,000+ messages/second** on a single node (mock provider).
- **Proof**: Run `npm run benchmark`.
- **Architecture**:
    - Non-blocking I/O.
    - `Promise.all` batches with concurrency control.
    - Zero heavy computation on hot path.

## Memory Footprint
- **Claim**: Linear memory growth with queue size.
- **Limit**: In-memory queue limited by available RAM.
- **Recommendation**: Use `maxSize` config or Phase 2 Redis adapter for queues > 100k items.

## Horizontal Scaling
- **Stateless**: The client is stateless (except for in-memory queue).
- **Strategy**: Deploy multiple workers behind a load balancer.
- **Coordination**: Each worker manages its own rate limits (Provider-side limits apply globally).
