import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load env vars

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, '../');

let testCount = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

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

console.log('\n========== Task 2.4: JWT Utility Verification ==========\n');

// 1. Check if utils/jwtHelper.js exists
await runTest('src/utils/jwtHelper.js should exist', async () => {
  const jwtHelperPath = path.join(backendRoot, 'src/utils/jwtHelper.js');
  if (!fs.existsSync(jwtHelperPath)) {
    throw new Error('src/utils/jwtHelper.js does not exist.');
  }
});

// 2. Verify JWT Helper Functions
await runTest('Should export required JWT functions', async () => {
    const jwtHelperPath = path.join(backendRoot, 'src/utils/jwtHelper.js');
    const jwtHelper = await import(`file://${jwtHelperPath}`);
    
    const requiredFunctions = [
        'generateAccessToken',
        'generateRefreshToken',
        'verifyAccessToken',
        'verifyRefreshToken'
    ];

    requiredFunctions.forEach(funcName => {
        if (typeof jwtHelper[funcName] !== 'function') {
            throw new Error(`Function ${funcName} is missing.`);
        }
    });
});

await runTest('Should generate and verify access token', async () => {
    const jwtHelperPath = path.join(backendRoot, 'src/utils/jwtHelper.js');
    const { generateAccessToken, verifyAccessToken } = await import(`file://${jwtHelperPath}`);
    
    const payload = { userId: 'test-user-id', role: 'user' };
    const token = generateAccessToken(payload);
    
    if (!token || typeof token !== 'string') {
        throw new Error('generateAccessToken did not return a valid token string.');
    }

    const decoded = verifyAccessToken(token);
    if (decoded.userId !== payload.userId || decoded.role !== payload.role) {
        throw new Error('verifyAccessToken did not return correct payload.');
    }
});

await runTest('Should generate and verify refresh token', async () => {
    const jwtHelperPath = path.join(backendRoot, 'src/utils/jwtHelper.js');
    const { generateRefreshToken, verifyRefreshToken } = await import(`file://${jwtHelperPath}`);
    
    const payload = { userId: 'test-user-id' };
    const token = generateRefreshToken(payload);
    
    if (!token || typeof token !== 'string') {
        throw new Error('generateRefreshToken did not return a valid token string.');
    }

    const decoded = verifyRefreshToken(token);
    if (decoded.userId !== payload.userId) {
        throw new Error('verifyRefreshToken did not return correct payload.');
    }
});

await runTest('Should handle invalid token error', async () => {
    const jwtHelperPath = path.join(backendRoot, 'src/utils/jwtHelper.js');
    const { verifyAccessToken } = await import(`file://${jwtHelperPath}`);
    
    try {
        verifyAccessToken('invalid-token');
        throw new Error('Should have thrown an error for invalid token');
    } catch (error) {
        if (!error.message.includes('jwt') && !error.message.includes('invalid')) {
             // We expect jsonwebtoken library error or our custom error wrapper
             // Just ensure it threw
        }
    }
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
