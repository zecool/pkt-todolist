import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config(); // Load environment variables

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, '../');

let testCount = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// Async test helper
async function runTest(testName, testFn) {
  testCount++;
  try {
    await testFn();
    passedTests++;
    testResults.push({ name: testName, status: 'PASS', error: null });
    console.log(`✓ ${testName}`);
  } catch (error) {
    failedTests++;
    testResults.push({ name: testName, status: 'FAIL', error: error.message });
    console.error(`✗ ${testName}`);
    console.error(`  Error: ${error.message}`);
  }
}

console.log('\n========== Task 2.3: Database Connection Verification ==========\n');

// 1. Check if config/database.js exists
await runTest('config/database.js should exist', async () => {
  const dbConfigPath = path.join(backendRoot, 'src/config/database.js');
  if (!fs.existsSync(dbConfigPath)) {
    throw new Error('src/config/database.js does not exist.');
  }
});

// 2. Verify Connection (Integration Test)
// This requires the actual database to be running and .env to be set correctly.
await runTest('Should connect to database using pool', async () => {
    // Import the database module dynamically to use the newly created file
    const dbModulePath = path.join(backendRoot, 'src/config/database.js');
    const dbModule = await import(`file://${dbModulePath}`);
    
    // Assuming it exports 'pool' or 'query' or 'testConnection'
    const { pool, testConnection } = dbModule;

    if (!pool) {
        throw new Error('Database module should export a "pool" object.');
    }

    if (typeof testConnection !== 'function') {
        throw new Error('Database module should export a "testConnection" function.');
    }

    // Test the connection
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT NOW()');
        if (!res.rows || res.rows.length === 0) {
            throw new Error('Query execution failed (no rows returned).');
        }
    } finally {
        client.release();
    }
    
    // Also test the testConnection function
    await testConnection();
    
    // Clean up
    await pool.end();
});

console.log('\n========== Test Summary ==========\n');
console.log(`Total: ${testCount}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
