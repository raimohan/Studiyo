#!/usr/bin/env node

/**
 * Environment Variables Security Check Script
 * This script checks if your environment variables are properly configured
 * Run this before deploying to ensure all required variables are set
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const requiredEnvVars = {
  // Firebase
  'VITE_FIREBASE_API_KEY': 'Firebase API Key',
  'VITE_FIREBASE_PROJECT_ID': 'Firebase Project ID',
  'VITE_FIREBASE_MESSAGING_SENDER_ID': 'Firebase Messaging Sender ID',
  'VITE_FIREBASE_APP_ID': 'Firebase App ID',
  
  // Cloudinary
  'VITE_CLOUDINARY_CLOUD_NAME': 'Cloudinary Cloud Name',
  'VITE_CLOUDINARY_UPLOAD_PRESET': 'Cloudinary Upload Preset',
  
  // DeepSeek AI
  'DEEPSEEK_API_KEY': 'DeepSeek API Key',
  
  // Optional
  'DATABASE_URL': 'Database URL (optional)',
  'PORT': 'Server Port (optional)'
};

console.log('🔒 Environment Variables Security Check\n');

// Check if .env file exists
const envPath = join(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Create .env file by copying env.example:');
  console.log('   cp env.example .env');
  console.log('   Then fill in your actual API keys\n');
  process.exit(1);
}

// Read .env file
try {
  const envContent = readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  let missingVars = [];
  let placeholderVars = [];
  
  // Check each required variable
  for (const [varName, description] of Object.entries(requiredEnvVars)) {
    const line = envLines.find(line => line.startsWith(varName + '='));
    
    if (!line) {
      missingVars.push(varName);
    } else {
      const value = line.split('=')[1]?.trim();
      if (!value || value.includes('your_') || value === '') {
        placeholderVars.push(varName);
      }
    }
  }
  
  // Report results
  if (missingVars.length === 0 && placeholderVars.length === 0) {
    console.log('✅ All environment variables are properly configured!');
    console.log('🚀 Your app is ready for deployment.\n');
  } else {
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:');
      missingVars.forEach(varName => {
        console.log(`   - ${varName}: ${requiredEnvVars[varName]}`);
      });
      console.log('');
    }
    
    if (placeholderVars.length > 0) {
      console.log('⚠️  Environment variables with placeholder values:');
      placeholderVars.forEach(varName => {
        console.log(`   - ${varName}: ${requiredEnvVars[varName]}`);
      });
      console.log('');
    }
    
    console.log('📝 Please update your .env file with actual values.');
    console.log('🔒 Remember: Never commit .env file to Git!\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

console.log('🔐 Security Tips:');
console.log('   - Keep your .env file in .gitignore');
console.log('   - Use different API keys for development and production');
console.log('   - Regularly rotate your API keys');
console.log('   - Never share your .env file publicly\n');
