import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../');

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

const packageJsonPath = path.join(projectRoot, 'package.json');

runTest('package.json 파일 존재 확인', () => {
  assert(fs.existsSync(packageJsonPath), 'package.json 파일이 존재하지 않습니다.');
});

let packageJson = null;

runTest('package.json 파일 읽기', () => {
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  packageJson = JSON.parse(content);
  assert(packageJson !== null, 'package.json 파일을 파싱할 수 없습니다.');
});

runTest('package.json - name 필드 존재', () => {
  assert(packageJson.name, 'name 필드가 존재하지 않습니다.');
  assert(typeof packageJson.name === 'string', 'name 필드는 문자열이어야 합니다.');
});

runTest('package.json - version 필드 존재', () => {
  assert(packageJson.version, 'version 필드가 존재하지 않습니다.');
  assert(typeof packageJson.version === 'string', 'version 필드는 문자열이어야 합니다.');
  // 버전 형식 검증 (semantic versioning)
  assert(/^\d+\.\d+\.\d+/.test(packageJson.version), 'version 형식이 올바르지 않습니다. (예: 1.0.0)');
});

runTest('package.json - type 필드 존재 및 "module" 설정', () => {
  assert(packageJson.type, 'type 필드가 존재하지 않습니다.');
  assert(packageJson.type === 'module', 'type 필드는 "module"이어야 합니다.');
});

runTest('package.json - main 필드 존재', () => {
  assert(packageJson.main, 'main 필드가 존재하지 않습니다.');
  assert(typeof packageJson.main === 'string', 'main 필드는 문자열이어야 합니다.');
});

runTest('package.json - dependencies 존재', () => {
  assert(packageJson.dependencies, 'dependencies 필드가 존재하지 않습니다.');
  assert(typeof packageJson.dependencies === 'object', 'dependencies는 객체여야 합니다.');
});

runTest('package.json - 필수 패키지 8개 이상 존재', () => {
  const requiredPackages = [
    'express',
    'cors',
    'dotenv',
    'jsonwebtoken',
    'bcryptjs',
    'prisma',
    '@prisma/client',
    'axios'
  ];

  const missingPackages = requiredPackages.filter(
    pkg => !packageJson.dependencies.hasOwnProperty(pkg)
  );

  assert(
    missingPackages.length === 0,
    `필수 패키지가 누락되었습니다: ${missingPackages.join(', ')}`
  );
});

runTest('package.json - scripts.dev 명령 존재', () => {
  assert(packageJson.scripts, 'scripts 필드가 존재하지 않습니다.');
  assert(packageJson.scripts.dev, 'dev 스크립트가 존재하지 않습니다.');
  assert(typeof packageJson.scripts.dev === 'string', 'dev 스크립트는 문자열이어야 합니다.');
});

runTest('package.json - scripts.start 명령 존재', () => {
  assert(packageJson.scripts.start, 'start 스크립트가 존재하지 않습니다.');
  assert(typeof packageJson.scripts.start === 'string', 'start 스크립트는 문자열이어야 합니다.');
});

runTest('package.json - engines.node >= 18.0.0 설정', () => {
  assert(packageJson.engines, 'engines 필드가 존재하지 않습니다.');
  assert(packageJson.engines.node, 'node engines 필드가 존재하지 않습니다.');
  assert(
    packageJson.engines.node.includes('>=18') || packageJson.engines.node.includes('18'),
    'Node.js 버전이 18.0.0 이상이어야 합니다.'
  );
});

// ==========================================
// Test Suite 2: 디렉토리 구조 검증
// ==========================================
console.log('\n========== Test Suite 2: 디렉토리 구조 검증 ==========\n');

const requiredDirs = [
  'backend/src/controllers',
  'backend/src/services',
  'backend/src/routes',
  'backend/src/middlewares',
  'backend/src/config',
  'backend/src/utils'
];

requiredDirs.forEach(dir => {
  runTest(`디렉토리 존재 확인: ${dir}`, () => {
    const dirPath = path.join(projectRoot, dir);
    assert(
      fs.existsSync(dirPath),
      `${dir} 디렉토리가 존재하지 않습니다.`
    );

    const stat = fs.statSync(dirPath);
    assert(
      stat.isDirectory(),
      `${dir}은(는) 디렉토리여야 합니다.`
    );
  });
});

// ==========================================
// Test Suite 3: .env 파일 검증
// ==========================================
console.log('\n========== Test Suite 3: .env 파일 검증 ==========\n');

const envPath = path.join(projectRoot, '.env');
let envContent = '';

runTest('.env 파일 존재 확인', () => {
  assert(
    fs.existsSync(envPath),
    '.env 파일이 존재하지 않습니다.'
  );
});

runTest('.env 파일 읽기', () => {
  envContent = fs.readFileSync(envPath, 'utf-8');
  assert(envContent.length > 0, '.env 파일이 비어있습니다.');
});

runTest('.env - 필수 환경 변수 존재 확인', () => {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
  const missingVars = [];

  requiredEnvVars.forEach(varName => {
    // .env 파일에서 환경 변수 찾기
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

runTest('.env - DATABASE_URL 형식 검증', () => {
  const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
  assert(dbUrlMatch, 'DATABASE_URL 환경 변수를 찾을 수 없습니다.');

  const dbUrl = dbUrlMatch[1].trim();
  assert(dbUrl.length > 0, 'DATABASE_URL 값이 비어있습니다.');
  assert(
    dbUrl.includes('://'),
    'DATABASE_URL 형식이 올바르지 않습니다. (예: postgresql://...)'
  );
});

runTest('.env - JWT_SECRET 값 존재 확인', () => {
  const secretMatch = envContent.match(/JWT_SECRET=(.+)/);
  assert(secretMatch, 'JWT_SECRET 환경 변수를 찾을 수 없습니다.');

  const secret = secretMatch[1].trim();
  assert(secret.length > 0, 'JWT_SECRET 값이 비어있습니다.');
});

runTest('.env - PORT 값 확인', () => {
  const portMatch = envContent.match(/PORT=(.+)/);
  assert(portMatch, 'PORT 환경 변수를 찾을 수 없습니다.');

  const port = portMatch[1].trim();
  assert(port.length > 0, 'PORT 값이 비어있습니다.');

  const portNum = parseInt(port);
  assert(
    !isNaN(portNum) && portNum > 0 && portNum <= 65535,
    'PORT는 1부터 65535 사이의 숫자여야 합니다.'
  );
});

// ==========================================
// Test Suite 4: .env.example 파일 검증
// ==========================================
console.log('\n========== Test Suite 4: .env.example 파일 검증 ==========\n');

const envExamplePath = path.join(projectRoot, '.env.example');
let envExampleContent = '';

runTest('.env.example 파일 존재 확인', () => {
  assert(
    fs.existsSync(envExamplePath),
    '.env.example 파일이 존재하지 않습니다.'
  );
});

runTest('.env.example 파일 읽기', () => {
  envExampleContent = fs.readFileSync(envExamplePath, 'utf-8');
  assert(envExampleContent.length > 0, '.env.example 파일이 비어있습니다.');
});

runTest('.env.example - 필수 환경 변수 예시 존재', () => {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
  const missingVars = [];

  requiredVars.forEach(varName => {
    const regex = new RegExp(`${varName}=`, 'm');
    if (!regex.test(envExampleContent)) {
      missingVars.push(varName);
    }
  });

  assert(
    missingVars.length === 0,
    `.env.example에 누락된 환경 변수: ${missingVars.join(', ')}`
  );
});

runTest('.env.example - DATABASE_URL 예시 형식', () => {
  const hasDbExample = envExampleContent.includes('DATABASE_URL');
  assert(hasDbExample, '.env.example에 DATABASE_URL 예시가 없습니다.');
});

runTest('.env.example - JWT_SECRET 예시 형식', () => {
  const hasSecretExample = envExampleContent.includes('JWT_SECRET');
  assert(hasSecretExample, '.env.example에 JWT_SECRET 예시가 없습니다.');
});

runTest('.env.example - PORT 예시 형식', () => {
  const hasPortExample = envExampleContent.includes('PORT');
  assert(hasPortExample, '.env.example에 PORT 예시가 없습니다.');
});

// ==========================================
// Test Suite 5: .gitignore 검증
// ==========================================
console.log('\n========== Test Suite 5: .gitignore 검증 ==========\n');

const gitignorePath = path.join(projectRoot, '.gitignore');
let gitignoreContent = '';

runTest('.gitignore 파일 존재 확인', () => {
  assert(
    fs.existsSync(gitignorePath),
    '.gitignore 파일이 존재하지 않습니다.'
  );
});

runTest('.gitignore 파일 읽기', () => {
  gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  assert(gitignoreContent.length > 0, '.gitignore 파일이 비어있습니다.');
});

runTest('.gitignore - node_modules 포함', () => {
  assert(
    gitignoreContent.includes('node_modules'),
    '.gitignore에 node_modules가 포함되지 않았습니다.'
  );
});

runTest('.gitignore - .env 포함', () => {
  assert(
    gitignoreContent.includes('.env'),
    '.gitignore에 .env가 포함되지 않았습니다.'
  );
});

runTest('.gitignore - .env.local 포함', () => {
  assert(
    gitignoreContent.includes('.env.local'),
    '.gitignore에 .env.local이 포함되지 않았습니다.'
  );
});

runTest('.gitignore - dist/build 디렉토리 포함', () => {
  const hasDist = gitignoreContent.includes('dist/') || gitignoreContent.includes('dist');
  const hasBuild = gitignoreContent.includes('build/') || gitignoreContent.includes('build');

  assert(
    hasDist || hasBuild,
    '.gitignore에 빌드 결과물(dist, build)이 포함되지 않았습니다.'
  );
});

runTest('.gitignore - 일반적인 로그 파일 포함', () => {
  const hasLogs = gitignoreContent.includes('*.log') || gitignoreContent.includes('logs/');
  assert(
    hasLogs,
    '.gitignore에 로그 파일이 포함되지 않았습니다.'
  );
});

// ==========================================
// Test Results Summary
// ==========================================
console.log('\n\n========== 테스트 결과 요약 ==========\n');
console.log(`총 테스트: ${testCount}`);
console.log(`성공: ${passedTests}`);
console.log(`실패: ${failedTests}`);

const coveragePercentage = Math.round((passedTests / testCount) * 100);
console.log(`커버리지: ${coveragePercentage}%`);

// 상세 결과
if (failedTests > 0) {
  console.log('\n실패한 테스트:');
  testResults
    .filter(result => result.status === 'FAIL')
    .forEach(result => {
      console.log(`  - ${result.name}`);
      console.log(`    ${result.error}`);
    });
}

// 종료 코드
if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n모든 테스트가 통과했습니다!');
  process.exit(0);
}