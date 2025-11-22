#!/usr/bin/env node

/**
 * Wait for database to be ready before running migrations
 * This helps with databases that may be in an idle state (like Neon serverless)
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const MAX_RETRIES = 30;
const RETRY_DELAY = 2000; // 2 seconds

async function checkDatabase() {
  try {
    // Try to connect to the database using Prisma
    await execPromise('npx prisma db execute --stdin < /dev/null', {
      env: process.env,
      timeout: 10000
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function waitForDatabase() {
  console.log('🔍 Checking database connection...');
  
  for (let i = 1; i <= MAX_RETRIES; i++) {
    const isReady = await checkDatabase();
    
    if (isReady) {
      console.log('✅ Database is ready!');
      return true;
    }
    
    console.log(`⏳ Database not ready yet (attempt ${i}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY/1000}s...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }
  
  console.error('❌ Database failed to become ready after maximum retries');
  process.exit(1);
}

waitForDatabase()
  .then(() => {
    console.log('✅ Database connection verified. Proceeding with build...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error waiting for database:', error.message);
    process.exit(1);
  });
