#!/usr/bin/env node

/**
 * jxpush CLI
 *
 * Commands:
 * - init: Create config file
 * - send: Send test message
 * - doctor: Check environment
 */

import { program } from 'commander';
import { PushClient, ProviderType } from '../dist/esm/index.js';

program
  .name('jxpush')
  .description('CLI for jxpush - Unified Push Notifications')
  .version('1.0.1');

program
  .command('init')
  .description('Initialize jxpush configuration')
  .action(() => {
    console.log('🚧 Init command not yet implemented');
    console.log('Would create jxpush.config.js');
  });

program
  .command('doctor')
  .description('Check environment for push notification requirements')
  .action(() => {
    console.log('🩺 Running diagnostic checks...');
    console.log('✅ Node.js version:', process.version);
    // Check for expo token env
    if (process.env.EXPO_ACCESS_TOKEN) {
      console.log('✅ EXPO_ACCESS_TOKEN found');
    } else {
      console.log('ℹ️  EXPO_ACCESS_TOKEN not found (optional)');
    }
  });

program
  .command('send')
  .description('Send a test notification')
  .option('-t, --token <token>', 'Target token')
  .option('--title <title>', 'Notification title', 'Test Notification')
  .option('--body <body>', 'Notification body', 'This is a test message from jxpush CLI')
  .option('--provider <provider>', 'Provider (expo/fcm)', 'expo')
  .action(async (options) => {
    if (!options.token) {
      console.error('❌ Error: Token is required');
      process.exit(1);
    }

    const providerMap = {
      expo: ProviderType.EXPO,
      fcm: ProviderType.FCM
    };

    const client = new PushClient({
      provider: providerMap[options.provider as keyof typeof providerMap] || ProviderType.EXPO
    });

    try {
      await client.initialize();
      console.log(`📤 Sending to ${options.token}...`);

      const result = await client.send({
        token: options.token,
        notification: {
          title: options.title,
          body: options.body
        }
      });

      console.log('✅ Result:', result);
    } catch (error: any) {
      console.error('❌ Failed:', error.message);
    } finally {
      await client.shutdown();
    }
  });

program.parse();
