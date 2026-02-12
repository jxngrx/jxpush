import express from 'express';
import { PushClient, ProviderType } from 'jxpush';

const app = express();
app.use(express.json());

// Initialize jxpush client
const pushClient = new PushClient({
  provider: ProviderType.EXPO,
  // Using generic options for demo
  queue: { enabled: true },
  rateLimit: { maxPerSecond: 10 }
});

// Initialize on startup
pushClient.initialize().then(() => {
  console.log('🚀 Push Client ready');
});

// Simple send endpoint
app.post('/notify', async (req, res) => {
  try {
    const { token, title, body } = req.body;

    const result = await pushClient.send({
      token,
      notification: { title, body }
    });

    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
