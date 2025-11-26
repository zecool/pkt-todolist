# 테스트 통합 및 운영 가이드

## Task 2.1 테스트 통합 가이드

### 1. 테스트 실행 방법

#### 1.1 직접 실행
```bash
# 프로젝트 루트에서
node backend/tests/task-2.1.test.js

# 또는 절대 경로로 실행
node /c/test/pkt-todolist/backend/tests/task-2.1.test.js
```

#### 1.2 npm 스크립트로 실행
```bash
# package.json에 test 스크립트 추가됨
npm test
```

#### 1.3 개발 중 watch 모드 (향후 추가)
```bash
# node --watch 사용 (Node.js 18.11+)
node --watch backend/tests/task-2.1.test.js
```

### 2. CI/CD 통합

#### 2.1 GitHub Actions 통합
```yaml
# .github/workflows/test.yml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Node.js 설치
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: 초기화 테스트 실행
        run: npm test
```

#### 2.2 GitLab CI 통합
```yaml
# .gitlab-ci.yml
test:
  image: node:18
  script:
    - npm test
  only:
    - merge_requests
    - main
```

#### 2.3 Jenkins 통합
```groovy
stage('Backend Tests') {
  steps {
    sh 'node backend/tests/task-2.1.test.js'
  }
}
```

### 3. 테스트 결과 해석

#### 3.1 성공 케이스
```
모든 테스트가 통과했습니다!
커버리지: 100%
```
**의미**: 프로젝트 초기화가 완전함

#### 3.2 실패 케이스 및 해결책

##### Case 1: package.json 누락
```
✗ package.json 파일 존재 확인
  에러: package.json 파일이 존재하지 않습니다.
```
**해결**:
```bash
# package.json 생성
npm init -y
```

##### Case 2: 필수 패키지 누락
```
✗ package.json - 필수 패키지 8개 이상 존재
  에러: 필수 패키지가 누락되었습니다: express, cors
```
**해결**:
```bash
npm install express cors dotenv jsonwebtoken bcryptjs prisma @prisma/client axios
```

##### Case 3: .env 파일 누락
```
✗ .env 파일 존재 확인
  에러: .env 파일이 존재하지 않습니다.
```
**해결**:
```bash
# .env.example에서 복사
cp .env.example .env

# 또는 수동으로 생성
cat > .env << 'EOF'
DATABASE_URL=postgresql://user:password@localhost:5432/todolist
JWT_SECRET=your-secret-key
PORT=3000
EOF
```

##### Case 4: 디렉토리 구조 불완전
```
✗ 디렉토리 존재 확인: backend/src/services
  에러: backend/src/services 디렉토리가 존재하지 않습니다.
```
**해결**:
```bash
mkdir -p backend/src/{controllers,services,routes,middlewares,config,utils}
```

### 4. 테스트 커스터마이징

#### 4.1 새로운 테스트 추가
```javascript
// 기존 테스트 코드 뒤에 추가
runTest('새로운 테스트 이름', () => {
  const condition = true;
  assert(condition, '테스트 실패 메시지');
});
```

#### 4.2 특정 테스트만 실행
```javascript
// 테스트 함수 내에서 조건 검사
if (process.env.TEST_ONLY === 'package') {
  // package.json 테스트만 실행
}
```

#### 4.3 테스트 건너뛰기
```javascript
// 특정 테스트를 주석 처리
// runTest('테스트 이름', () => { ... });

// 또는 환경 변수로 제어
if (process.env.SKIP_ENV_TESTS !== 'true') {
  runTest('.env 파일 검증', () => { ... });
}
```

### 5. 테스트 모니터링

#### 5.1 실행 시간 추적
```javascript
// 테스트 시작 시간 기록
const startTime = Date.now();

// ... 테스트 실행 ...

// 실행 시간 출력
console.log(`테스트 실행 시간: ${Date.now() - startTime}ms`);
```

#### 5.2 상세 로그 출력
```bash
# 디버그 모드로 실행
DEBUG=* node backend/tests/task-2.1.test.js
```

#### 5.3 커버리지 추적
현재: **100% (36/36 테스트 성공)**

### 6. 문제 해결

#### 6.1 테스트가 모두 실패하는 경우

1. **Node.js 버전 확인**
   ```bash
   node --version  # >= 18.0.0 필요
   ```

2. **파일 경로 확인**
   ```bash
   pwd  # 현재 위치가 프로젝트 루트인지 확인
   ls -la backend/tests/task-2.1.test.js
   ```

3. **필수 파일 확인**
   ```bash
   ls -la package.json .env .env.example .gitignore
   ls -la backend/src/{controllers,services,routes,middlewares,config,utils}
   ```

#### 6.2 특정 테스트만 실패하는 경우

1. **에러 메시지 확인**: 명확한 에러 메시지로 문제 파악
2. **해당 파일 확인**: 누락되었거나 잘못된 형식
3. **파일 복구**: 예제에 따라 파일 재작성

#### 6.3 권한 문제
```bash
# 파일 읽기 권한 확인 및 수정
chmod 644 /c/test/pkt-todolist/.env
chmod 644 /c/test/pkt-todolist/package.json
chmod 755 /c/test/pkt-todolist/backend/src/*
```

### 7. 테스트 유지보수

#### 7.1 정기적 검토
- **월 1회**: 테스트 케이스 검토 및 업데이트
- **분기별**: 커버리지 분석 및 개선
- **반기별**: 새로운 검증 항목 추가 검토

#### 7.2 버전 관리
```bash
# 테스트 파일 변경 이력
git log --oneline backend/tests/task-2.1.test.js

# 변경사항 확인
git diff HEAD~1 backend/tests/task-2.1.test.js
```

#### 7.3 의존성 업데이트
```bash
# package.json의 패키지 버전 확인
npm outdated

# 테스트 재실행하여 호환성 확인
npm test
```

### 8. 고급 사용법

#### 8.1 JSON 형식 결과 출력
```javascript
// 결과를 JSON으로 저장하는 기능 추가
const results = {
  totalTests: testCount,
  passed: passedTests,
  failed: failedTests,
  coverage: `${Math.round((passedTests / testCount) * 100)}%`,
  timestamp: new Date().toISOString(),
  details: testResults
};

console.log(JSON.stringify(results, null, 2));
```

#### 8.2 HTML 리포트 생성
```javascript
// 테스트 결과를 HTML 파일로 저장
function generateHtmlReport() {
  // HTML 생성 로직
  const html = `
    <html>
      <head><title>테스트 보고서</title></head>
      <body>
        <h1>테스트 결과</h1>
        <p>총 테스트: ${testCount}</p>
        <p>성공: ${passedTests}</p>
      </body>
    </html>
  `;

  fs.writeFileSync('test-report.html', html);
}
```

#### 8.3 Slack 알림
```javascript
// 테스트 결과를 Slack에 전송
async function notifySlack() {
  const message = {
    text: `백엔드 테스트 결과: ${passedTests}/${testCount} 성공 (${Math.round((passedTests / testCount) * 100)}%)`
  };

  // Slack webhook URL로 POST
  // fetch(process.env.SLACK_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(message) });
}
```

### 9. 성능 최적화

#### 9.1 병렬 실행
```javascript
// 향후 여러 테스트 파일을 병렬로 실행
Promise.all([
  runTestFile('task-2.1.test.js'),
  runTestFile('task-2.2.test.js'),
  runTestFile('task-2.3.test.js')
]);
```

#### 9.2 캐싱
```javascript
// 파일 내용 캐싱
const fileCache = new Map();

function readFileWithCache(path) {
  if (fileCache.has(path)) {
    return fileCache.get(path);
  }
  const content = fs.readFileSync(path, 'utf-8');
  fileCache.set(path, content);
  return content;
}
```

### 10. 체크리스트

#### 초기 설정 체크리스트
- [ ] Node.js 18.0.0 이상 설치
- [ ] package.json 생성
- [ ] 필수 패키지 설치 (`npm install`)
- [ ] .env 파일 생성
- [ ] .env.example 파일 생성
- [ ] 디렉토리 구조 생성
- [ ] 테스트 파일 확인

#### 테스트 실행 체크리스트
- [ ] `npm test` 명령 실행
- [ ] 모든 테스트 통과 확인
- [ ] 커버리지 100% 달성 확인
- [ ] 결과 로그 저장

#### 배포 전 체크리스트
- [ ] 모든 테스트 성공 (100%)
- [ ] CI/CD 파이프라인 통과
- [ ] 코드 리뷰 완료
- [ ] 보안 검사 완료

### 11. 관련 문서

- [테스트 README](./README.md) - 테스트 개요 및 범위
- [테스트 분석](./TEST_ANALYSIS.md) - 상세 분석 및 통계
- [main 테스트 파일](./task-2.1.test.js) - 테스트 구현 코드

### 12. 지원 및 문의

문제 발생 시:
1. 에러 메시지 확인
2. 관련 파일 존재 확인
3. 파일 내용 검증
4. 테스트 문서 검토
5. 문제 재현 및 분석

---

**마지막 업데이트**: 2025-11-26
**테스트 버전**: 1.0.0
**커버리지**: 100%