import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PushClient, PushClientConfig } from 'jxpush';

export const JX_PUSH_CLIENT = 'JX_PUSH_CLIENT';

@Module({})
export class JxPushModule {
  static register(config: PushClientConfig): DynamicModule {
    const provider: Provider = {
      provide: JX_PUSH_CLIENT,
      useFactory: async () => {
        const client = new PushClient(config);
        await client.initialize();
        return client;
      },
    };

    return {
      module: JxPushModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static registerAsync(options: any): DynamicModule {
    // Implementation for async config (e.g. ConfigService)
    return {
        module: JxPushModule,
        // ... async provider logic
        providers: [],
        exports: []
    }
  }
}
