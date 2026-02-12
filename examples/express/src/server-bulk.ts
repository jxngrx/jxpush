import express from 'express';
import { PushClient, ProviderType } from 'jxpush';

const app = express();
app.use(express.json());

// Bulk processing client
const bulkClient = new PushClient({
  provider: ProviderType.EXPO,
  queue: {
    enabled: true,
    concurrency: 20
  },
  // Higher limits for bulk
  rateLimit: {
    maxPerSecond: 100,
    allowBurst: true
  }
});

bulkClient.initialize().then(() => console.log('🚀 Bulk Client Ready'));

// Bulk endpoint
app.post('/notify/bulk', async (req, res) => {
  try {
    const { tokens, title, body } = req.body;

    if (!Array.isArray(tokens)) {
      return res.status(400).json({ error: 'tokens must be an array' });
    }

    // Map to messages
    const messages = tokens.map(token => ({
      token,
      notification: { title, body }
    }));

    // Send in bulk (auto-chunked)
    const result = await bulkClient.sendBulk(messages);

    res.json({
      success: true,
      processed: result.total,
      failures: result.failureCount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Bulk Server running on http://localhost:${PORT}`);
});
