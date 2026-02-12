# Reliability Test Plan

## Objective
Verify that `jxpush` can recover from failures and maintain data integrity under stress.

## Scenarios

### 1. Network Failure
- **Test**: Disconnect network while queue is processing.
- **Expected**:
    - Messages fail with retryable error.
    - Retry engine schedules backoff.
    - Messages are sent once network restores.

### 2. Rate Limit Handling
- **Test**: Flood provider with requests exceeding limits.
- **Expected**:
    - `429` errors detected.
    - Rate limiter pauses bucket.
    - `onRateLimit` hook fired.
    - Resume after wait time.

### 3. Crash Recovery (Persistent Queue)
*Note: Requires Redis adapter (Phase 2)*
- **Test**: Kill process mid-queue.
- **Expected**:
    - Pending messages remain in store.
    - Processing resumes on restart.

### 4. Invalid Token Spike
- **Test**: Send 50% invalid tokens in batch.
- **Expected**:
    - Valid tokens delivered.
    - Invalid tokens flagged.
    - Process does not crash.
    - Error hooks triggered for individual failures.

## Execution Log

| Date | Version | Scenario | Result | Notes |
| :--- | :--- | :--- | :--- | :--- |
| | | | | |
