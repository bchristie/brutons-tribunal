#!/usr/bin/env node

/**
 * Wait for database to be ready before running migrations
 * This helps with databases that may be in an idle state (like Neon serverless)
 */

const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

const MAX_RETRIES = 20;
const RETRY_DELAY = 3000; // 3 seconds

async function checkDatabase() {
  // Configure Neon for Node.js environment
  neonConfig.webSocketConstructor = ws;
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`   Error: ${error.message}`);
    try {
      await pool.end();
    } catch (e) {
      // Ignore cleanup errors
    }
    return false;
  }
}

async function waitForDatabase() {
  console.log('🔍 Checking database connection...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    process.exit(1);
  }
  
  console.log('   DATABASE_URL is set ✓');
  
  for (let i = 1; i <= MAX_RETRIES; i++) {
    const isReady = await checkDatabase();
    
    if (isReady) {
      console.log('✅ Database is ready!');
      return true;
    }
    
    if (i < MAX_RETRIES) {
      console.log(`⏳ Database not ready yet (attempt ${i}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
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
