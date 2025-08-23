#!/usr/bin/env node

/**
 * Git Hooks Setup Script
 * Installs pre-commit hooks for security
 */

import { writeFileSync, chmodSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🔒 Setting up Git security hooks...\n');

const gitHooksDir = join(process.cwd(), '.git', 'hooks');
const preCommitHook = join(gitHooksDir, 'pre-commit');

try {
  // Create hooks directory if it doesn't exist
  if (!existsSync(gitHooksDir)) {
    mkdirSync(gitHooksDir, { recursive: true });
  }

  // Create pre-commit hook
  const hookContent = `#!/bin/sh
# Git Pre-commit Hook for UniConnect
# Prevents accidental commits of sensitive data

node scripts/pre-commit.js
`;

  writeFileSync(preCommitHook, hookContent);
  chmodSync(preCommitHook, '755');

  console.log('✅ Pre-commit hook installed successfully!');
  console.log('🔒 This will prevent accidental commits of API keys and sensitive data.\n');

  console.log('📝 To manually run security checks:');
  console.log('   npm run check-env\n');

  console.log('🚀 Your repository is now protected against accidental exposure of sensitive data!');

} catch (error) {
  console.error('❌ Error setting up Git hooks:', error.message);
  console.log('\n📝 Manual setup:');
  console.log('   1. Copy scripts/pre-commit.js to .git/hooks/pre-commit');
  console.log('   2. Make it executable: chmod +x .git/hooks/pre-commit');
  process.exit(1);
}
