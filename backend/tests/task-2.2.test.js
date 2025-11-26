import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// tests directory is inside backend, so one level up is backend root
const backendRoot = path.join(__dirname, '../');

let testCount = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function runTest(testName, testFn) {
  testCount++;
  try {
    testFn();
    passedTests++;
    testResults.push({
      name: testName,
      status: 'PASS',
      error: null
    });
    console.log(`✓ ${testName}`);
  } catch (error) {
    failedTests++;
    testResults.push({
      name: testName,
      status: 'FAIL',
      error: error.message
    });
    console.error(`✗ ${testName}`);
    console.error(`  Error: ${error.message}`);
  }
}

console.log('\n========== Task 2.2: Directory Structure Verification ==========\n');

// 1. Verify required directories
const requiredDirectories = [
  'src/controllers',
  'src/services',
  'src/routes',
  'src/middlewares',
  'src/config',
  'src/utils'
];

requiredDirectories.forEach(dir => {
  runTest(`Directory should exist: ${dir}`, () => {
    const dirPath = path.join(backendRoot, dir);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory ${dir} does not exist.`);
    }
    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      throw new Error(`${dir} is not a directory.`);
    }
  });
});

// 2. Verify basic files
const requiredFiles = [
  'src/app.js',
  'src/server.js'
];

requiredFiles.forEach(file => {
  runTest(`File should exist: ${file}`, () => {
    const filePath = path.join(backendRoot, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${file} does not exist.`);
    }
  });
});

// 3. Verify src directory exists (implicit by above, but good to check explicit root)
runTest('src directory should exist', () => {
    const srcPath = path.join(backendRoot, 'src');
    if (!fs.existsSync(srcPath) || !fs.statSync(srcPath).isDirectory()) {
        throw new Error('src directory missing');
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
