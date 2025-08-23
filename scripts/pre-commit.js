#!/usr/bin/env node

/**
 * Git Pre-commit Hook
 * Prevents accidental commits of sensitive information like API keys
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔒 Running security checks...');

try {
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .split('\n')
    .filter(file => file.trim());

  let hasSensitiveData = false;

  for (const file of stagedFiles) {
    if (!file) continue;

    try {
      const content = readFileSync(file, 'utf8');
      
      // Check for potential API keys or sensitive data
      const sensitivePatterns = [
        /sk-[a-zA-Z0-9]{32,}/,           // Stripe-like keys
        /pk_[a-zA-Z0-9]{32,}/,           // Public keys
        /[a-zA-Z0-9]{32,}/,              // Long random strings (potential keys)
        /AIza[a-zA-Z0-9]{35}/,           // Google API keys
        /firebase.*\.com/,                // Firebase URLs
        /cloudinary.*\.com/,              // Cloudinary URLs
        /your_.*_here/,                   // Placeholder values
        /api_key.*=.*[a-zA-Z0-9]{20,}/,  // API key assignments
      ];

      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          console.log(`⚠️  WARNING: Potential sensitive data in ${file}`);
          hasSensitiveData = true;
          break;
        }
      }

      // Check for .env files
      if (file.includes('.env') && !file.includes('.example')) {
        console.log(`❌ ERROR: Attempting to commit .env file: ${file}`);
        console.log('   .env files should never be committed!');
        hasSensitiveData = true;
      }

    } catch (error) {
      // File might be binary or deleted, skip
      continue;
    }
  }

  if (hasSensitiveData) {
    console.log('\n🚨 SECURITY WARNING:');
    console.log('   Potential sensitive data detected in staged files.');
    console.log('   Please review and remove any API keys or sensitive information.');
    console.log('   Use .env files for local configuration (never commit them).\n');
    process.exit(1);
  }

  console.log('✅ Security checks passed. No sensitive data detected.\n');

} catch (error) {
  console.error('❌ Error running security checks:', error.message);
  process.exit(1);
}
