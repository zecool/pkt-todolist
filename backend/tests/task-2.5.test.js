import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

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

console.log('\n========== Task 2.5: Password Hashing Utility Verification ==========\n');

// 1. Check if utils/passwordHelper.js exists
await runTest('src/utils/passwordHelper.js should exist', async () => {
  const passwordHelperPath = path.join(backendRoot, 'src/utils/passwordHelper.js');
  if (!fs.existsSync(passwordHelperPath)) {
    throw new Error('src/utils/passwordHelper.js does not exist.');
  }
});

// 2. Verify Functions
await runTest('Should export hashPassword and comparePassword functions', async () => {
    const passwordHelperPath = path.join(backendRoot, 'src/utils/passwordHelper.js');
    const passwordHelper = await import(`file://${passwordHelperPath}`);
    
    if (typeof passwordHelper.hashPassword !== 'function') {
        throw new Error('hashPassword function is missing.');
    }
    if (typeof passwordHelper.comparePassword !== 'function') {
        throw new Error('comparePassword function is missing.');
    }
});

await runTest('Should hash a password correctly', async () => {
    const passwordHelperPath = path.join(backendRoot, 'src/utils/passwordHelper.js');
    const { hashPassword } = await import(`file://${passwordHelperPath}`);
    
    const plainPassword = 'mySuperSecretPassword123';
    const hashedPassword = await hashPassword(plainPassword);
    
    if (!hashedPassword || typeof hashedPassword !== 'string') {
        throw new Error('hashPassword did not return a valid hash string.');
    }
    
    // Check if it looks like a bcrypt hash
    if (!hashedPassword.startsWith('$2b$')) {
        throw new Error('Hash does not look like a valid bcrypt hash (should start with $2b$).');
    }
});

await runTest('Should compare passwords correctly', async () => {
    const passwordHelperPath = path.join(backendRoot, 'src/utils/passwordHelper.js');
    const { hashPassword, comparePassword } = await import(`file://${passwordHelperPath}`);
    
    const plainPassword = 'password123';
    const hashedPassword = await hashPassword(plainPassword);
    
    const isMatch = await comparePassword(plainPassword, hashedPassword);
    if (isMatch !== true) {
        throw new Error('comparePassword failed: correct password did not match.');
    }
    
    const isNotMatch = await comparePassword('wrongPassword', hashedPassword);
    if (isNotMatch !== false) {
        throw new Error('comparePassword failed: wrong password matched incorrectly.');
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
