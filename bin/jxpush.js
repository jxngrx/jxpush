#!/usr/bin/env node

/**
 * jxpush CLI entry point
 * Enables npx jxpush commands
 */

import('../dist/esm/cli/index.js')
  .then((module) => module.run())
  .catch((error) => {
    console.error('Failed to start jxpush CLI:', error.message);
    process.exit(1);
  });
