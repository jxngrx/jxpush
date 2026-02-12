# Feature Comparison

| Feature | jxpush | firebase-admin | expo-server-sdk | node-pushnotifications |
| :--- | :---: | :---: | :---: | :---: |
| **Providers** | **Universal** | FCM Only | Expo Only | Many (via plugins) |
| **Type Safety** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Queue System** | ✅ **Built-in** | ❌ | ❌ | ❌ |
| **Rate Limiting** | ✅ **Token Bucket** | ❌ (Throws error) | ❌ (Throws error)| ❌ |
| **Retries** | ✅ **Exp. Backoff** | ⚠️ Basic | ⚠️ Basic | ❌ |
| **Bulk Send** | ✅ **Auto-Chunking** | ✅ (Manual) | ✅ (Manual) | ⚠️ Partial |
| **Analytics Hooks**| ✅ | ❌ | ❌ | ❌ |
| **Developer Exp** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
