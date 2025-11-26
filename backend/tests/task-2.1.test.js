import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// If this file is in backend/tests/, then ../../ is the repo root.
// We want to check files inside 'backend/' directory relative to repo root.
const projectRoot = path.join(__dirname, '../../');
const backendRoot = path.join(projectRoot, 'backend');

// 테스트 카운터 및 결과 추적
let testCount = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// 테스트 헬퍼 함수
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
    console.error(`  에러: ${error.message}`);
  }
}

// ==========================================
// Test Suite 1: package.json 검증
// ==========================================
console.log('\n========== Test Suite 1: package.json 검증 ==========\n');

const packageJsonPath = path.join(backendRoot, 'package.json');

runTest('package.json 파일 존재 확인', () => {
  assert(fs.existsSync(packageJsonPath), 'backend/package.json 파일이 존재하지 않습니다.');
});

let packageJson = null;

runTest('package.json 파일 읽기', () => {
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  packageJson = JSON.parse(content);
  assert(packageJson !== null, 'package.json 파일을 파싱할 수 없습니다.');
});

runTest('package.json - dependencies 존재', () => {
  assert(packageJson.dependencies, 'dependencies 필드가 존재하지 않습니다.');
});

runTest('package.json - 필수 패키지 존재 확인', () => {
  const requiredPackages = [
    'express',
    'cors',
    'dotenv',
    'jsonwebtoken',
    // 'bcryptjs', // Allow bcrypt OR bcryptjs
    'prisma',
    '@prisma/client',
    // 'axios' // Not required for Task 2.1
    'pg'
  ];

  const missingPackages = requiredPackages.filter(
    pkg => !packageJson.dependencies.hasOwnProperty(pkg)
  );
  
  // Check for bcrypt variant
  const hasBcrypt = packageJson.dependencies['bcrypt'] || packageJson.dependencies['bcryptjs'];
  if (!hasBcrypt) missingPackages.push('bcrypt/bcryptjs');

  assert(
    missingPackages.length === 0,
    `필수 패키지가 누락되었습니다: ${missingPackages.join(', ')}`
  );
});


// ==========================================
// Test Suite 3: .env 파일 검증
// ==========================================
console.log('\n========== Test Suite 3: .env 파일 검증 ==========\n');

const envPath = path.join(backendRoot, '.env');
let envContent = '';

runTest('.env 파일 존재 확인', () => {
  assert(
    fs.existsSync(envPath),
    'backend/.env 파일이 존재하지 않습니다.'
  );
});

if (fs.existsSync(envPath)) {
    runTest('.env 파일 읽기', () => {
      envContent = fs.readFileSync(envPath, 'utf-8');
      assert(envContent.length > 0, '.env 파일이 비어있습니다.');
    });

    runTest('.env - 필수 환경 변수 존재 확인', () => {
      const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
      const missingVars = [];

      requiredEnvVars.forEach(varName => {
        const regex = new RegExp(`^${varName}=`, 'm');
        if (!regex.test(envContent)) {
          missingVars.push(varName);
        }
      });

      assert(
        missingVars.length === 0,
        `필수 환경 변수가 누락되었습니다: ${missingVars.join(', ')}`
      );
    });
}

// ==========================================
// Test Results Summary
// ==========================================
console.log('\n\n========== 테스트 결과 요약 ==========\n');
console.log(`총 테스트: ${testCount}`);
console.log(`성공: ${passedTests}`);
console.log(`실패: ${failedTests}`);

const coveragePercentage = Math.round((passedTests / testCount) * 100);
console.log(`커버리지: ${coveragePercentage}%`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n모든 테스트가 통과했습니다!');
  process.exit(0);
}
