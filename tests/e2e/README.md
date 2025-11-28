# pkt-TodoList E2E 테스트

Playwright를 사용한 pkt-TodoList 애플리케이션의 E2E(End-to-End) 통합 테스트입니다.

## 📋 테스트 시나리오

이 테스트는 `docs/4-user-scenarios.md`에 정의된 사용자 시나리오를 기반으로 작성되었습니다.

### 1. 인증 테스트 (auth.spec.js)

- ✅ 시나리오 3.1.1: 신규 사용자 회원가입 성공
- ✅ 회원가입 - 이메일 중복 오류
- ✅ 회원가입 - 비밀번호 불일치
- ✅ 시나리오 3.1.2: 기존 사용자 로그인 성공
- ✅ 로그인 - 잘못된 비밀번호
- ✅ 로그인 - 등록되지 않은 이메일
- ✅ 로그아웃 기능
- ✅ 시나리오 4.1.1: 토큰 자동 갱신 (로그인 상태 유지)

### 2. 할일 관리 테스트 (todo-crud.spec.js)

- ✅ 시나리오 2.1.1: 할일 추가 - 간단한 할일
- ✅ 시나리오 3.2.1: 상세 정보 포함 할일 추가
- ✅ 시나리오 2.1.2: 할일 완료 처리
- ✅ 시나리오 3.2.2: 할일 수정 - 일정 변경
- ✅ 시나리오 2.1.1: 할일 조회 - 오늘 할일 확인
- ✅ 시나리오 4.2.1: 데이터 검증 - 만료일이 시작일보다 이전
- ✅ 시나리오 4.2.2: 데이터 검증 - 제목 누락
- ✅ 시나리오 2.2.4: 할일 검색 기능

### 3. 휴지통 테스트 (trash.spec.js)

- ✅ 시나리오 2.1.3: 실수로 삭제한 할일 복원
- ✅ 시나리오 3.3.1: 할일 삭제 및 휴지통 확인
- ✅ 시나리오 3.3.1: 영구 삭제
- ✅ 휴지통 비우기 기능

## 🚀 사전 요구사항

### 1. 개발 서버 실행

테스트 실행 전에 백엔드와 프론트엔드 개발 서버가 실행되어 있어야 합니다.

#### 백엔드 서버 (포트: 3000)
```bash
cd backend
npm run dev
```

#### 프론트엔드 서버 (포트: 5173)
```bash
cd frontend
npm run dev
```

### 2. 데이터베이스 설정

PostgreSQL 데이터베이스가 실행 중이어야 하며, 백엔드의 `.env` 파일이 올바르게 설정되어 있어야 합니다.

## 📦 설치

```bash
cd tests/e2e
npm install
```

## 🧪 테스트 실행

### 전체 테스트 실행

```bash
npm test
```

### UI 모드로 테스트 실행 (디버깅)

```bash
npm run test:ui
```

### 디버그 모드로 테스트 실행

```bash
npm run test:debug
```

### 특정 테스트 파일만 실행

```bash
npx playwright test specs/auth.spec.js
npx playwright test specs/todo-crud.spec.js
npx playwright test specs/trash.spec.js
```

### 특정 브라우저로 실행

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 테스트 결과

### 결과 보기

테스트 실행 후 HTML 리포트를 확인할 수 있습니다:

```bash
npm run report
```

### 결과 파일 위치

- HTML 리포트: `test-results/html-report/index.html`
- JSON 결과: `test-results/results.json`
- 스크린샷: `test-results/` (실패 시에만)
- 비디오: `test-results/` (실패 시에만)

## 📁 프로젝트 구조

```
tests/e2e/
├── specs/              # 테스트 스펙 파일
│   ├── auth.spec.js        # 인증 관련 테스트
│   ├── todo-crud.spec.js   # 할일 CRUD 테스트
│   └── trash.spec.js       # 휴지통 기능 테스트
├── utils/              # 테스트 헬퍼 함수
│   ├── auth-helper.js      # 인증 관련 헬퍼
│   └── todo-helper.js      # 할일 관련 헬퍼
├── test-results/       # 테스트 결과 (자동 생성)
├── playwright.config.js    # Playwright 설정
├── package.json
└── README.md
```

## 🔧 설정

### playwright.config.js

주요 설정:

- **baseURL**: `http://localhost:5173` (프론트엔드 개발 서버)
- **timeout**: 30초
- **retries**: CI에서는 2회, 로컬에서는 0회
- **screenshot**: 실패 시에만 캡처
- **video**: 실패 시에만 녹화
- **브라우저**: Chromium (기본)

## 🐛 디버깅

### 1. UI 모드 사용

```bash
npm run test:ui
```

UI 모드에서는 테스트를 단계별로 실행하고 각 단계의 DOM 상태를 확인할 수 있습니다.

### 2. 디버그 모드

```bash
npm run test:debug
```

디버그 모드에서는 Playwright Inspector가 열리며, 브레이크포인트를 설정하고 단계별로 실행할 수 있습니다.

### 3. 헤드풀 모드

기본적으로 헤드리스 모드로 실행되지만, 브라우저를 직접 보고 싶다면:

```bash
npx playwright test --headed
```

### 4. 느린 실행

각 단계를 천천히 실행하여 확인:

```bash
npx playwright test --headed --slow-mo=1000
```

## 📝 테스트 작성 가이드

### 1. 새로운 테스트 추가

`specs/` 폴더에 `*.spec.js` 파일을 생성하고 다음 형식을 따르세요:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('기능 이름', () => {
  test('테스트 시나리오', async ({ page }) => {
    // Given: 사전 조건

    // When: 사용자 액션

    // Then: 예상 결과
  });
});
```

### 2. 헬퍼 함수 사용

인증 및 할일 관련 헬퍼 함수를 활용하세요:

```javascript
const { register, login } = require('../utils/auth-helper');
const { createTodo, completeTodo } = require('../utils/todo-helper');
```

## 📚 참고 문서

- [Playwright 공식 문서](https://playwright.dev/)
- [pkt-TodoList 사용자 시나리오](../../docs/4-user-scenarios.md)
- [pkt-TodoList PRD](../../docs/3-prd.md)

## ⚠️ 주의사항

1. **데이터베이스 상태**: 테스트는 실제 데이터베이스를 사용하므로, 테스트 실행 후 데이터가 남을 수 있습니다.
2. **서버 실행**: 테스트 실행 전 백엔드와 프론트엔드 서버가 실행 중이어야 합니다.
3. **포트 충돌**: 기본 포트(3000, 5173)가 사용 중이면 테스트가 실패할 수 있습니다.
4. **네트워크**: 로컬 환경에서 실행하므로 네트워크 연결이 필요합니다.

## 🔄 CI/CD 통합

GitHub Actions 또는 다른 CI/CD 파이프라인에서 실행하려면:

```yaml
- name: Install dependencies
  run: |
    cd tests/e2e
    npm install
    npx playwright install --with-deps

- name: Run E2E tests
  run: |
    cd tests/e2e
    npm test
```

## 📈 테스트 커버리지

현재 구현된 테스트는 다음 기능을 커버합니다:

- ✅ 사용자 인증 (회원가입, 로그인, 로그아웃)
- ✅ 할일 CRUD (생성, 조회, 수정, 삭제)
- ✅ 할일 완료 처리
- ✅ 휴지통 기능 (삭제, 복원, 영구 삭제)
- ✅ 데이터 검증
- ✅ 검색 기능

### 추가 예정 기능

- ⏳ 국경일 조회
- ⏳ 크로스 플랫폼 동기화
- ⏳ 오프라인 모드
- ⏳ 필터 및 정렬

## 🤝 기여

테스트를 추가하거나 개선하려면:

1. 시나리오 문서(`docs/4-user-scenarios.md`)를 참고하세요
2. 테스트 작성 가이드를 따르세요
3. 헬퍼 함수를 재사용하여 코드 중복을 줄이세요
4. 의미 있는 테스트 이름을 사용하세요

## 📞 문의

테스트 관련 문의사항이 있으면 이슈를 생성해주세요.
