import { Request, Response, NextFunction } from 'express';
import { PushClient, PushClientConfig } from 'jxpush';

declare global {
  namespace Express {
    interface Request {
      push: PushClient;
    }
  }
}

export const jxpushMiddleware = (config: PushClientConfig) => {
  const client = new PushClient(config);

  // Initialize in background
  client.initialize().catch(console.error);

  return (req: Request, res: Response, next: NextFunction) => {
    req.push = client;
    next();
  };
};
