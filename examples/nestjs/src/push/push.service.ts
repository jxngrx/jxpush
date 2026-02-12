import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PushClient, ProviderType, PushMessage } from 'jxpush';

@Injectable()
export class PushService implements OnModuleInit, OnModuleDestroy {
  private client: PushClient;

  constructor() {
    this.client = new PushClient({
      provider: ProviderType.EXPO,
      // In a real app, inject configuration here
      queue: { enabled: true },
    });
  }

  async onModuleInit() {
    await this.client.initialize();
    console.log('Push Service initialized');
  }

  async onModuleDestroy() {
    await this.client.shutdown();
  }

  async send(token: string, title: string, body: string) {
    return this.client.send({
      token,
      notification: { title, body },
    });
  }

  async sendBulk(messages: PushMessage[]) {
    return this.client.sendBulk(messages);
  }
}
