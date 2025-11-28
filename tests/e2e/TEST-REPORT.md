# pkt-TodoList E2E 테스트 실행 보고서

**테스트 실행 일시**: 2025-11-28
**테스트 도구**: Playwright v1.57.0
**참조 문서**: docs/4-user-scenarios.md

---

## 📊 실행 요약

| 항목 | 결과 |
|------|------|
| 총 테스트 수 | 20개 |
| 통과 | 0개 (0%) |
| 실패 | 20개 (100%) |
| 실행 시간 | ~2분 |
| 브라우저 | Chromium |

---

## 🔍 주요 실패 원인 분석

### 1. **회원가입 폼 입력 필드 불일치**

**문제**: `input[name="passwordConfirm"]` 필드를 찾을 수 없음

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="passwordConfirm"]')
```

**원인**:
- 테스트 코드에서는 `passwordConfirm` 필드명 사용
- 실제 프론트엔드 코드에서는 다른 필드명을 사용할 가능성 (`confirmPassword` 등)

**영향받은 테스트**:
- 시나리오 3.1.1: 신규 사용자 회원가입
- 시나리오 3.1.1: 회원가입 - 이메일 중복 오류
- 시나리오 3.1.1: 회원가입 - 비밀번호 불일치
- 모든 로그인 관련 테스트 (beforeEach에서 회원가입 실패)
- 모든 할일 CRUD 테스트
- 모든 휴지통 기능 테스트

### 2. **페이지 제목 텍스트 불일치**

**문제**: 회원가입 페이지 제목이 예상과 다름

```
Error: expect(locator).toContainText(/회원가입|가입/) failed
Expected pattern: /회원가입|가입/
Received string: "새 계정 만들기"
```

**원인**:
- 테스트에서는 "회원가입" 또는 "가입" 텍스트 기대
- 실제 페이지는 "새 계정 만들기" 텍스트 사용

### 3. **로그인 오류 메시지 미표시**

**문제**: 잘못된 로그인 정보 입력 시 오류 메시지가 표시되지 않음

```
Error: expect(locator).toBeVisible() failed
Locator: text=/등록되지 않은|존재하지 않는|로그인 실패/i
Expected: visible
```

**원인**:
- 프론트엔드에서 오류 메시지를 다른 형식으로 표시
- 또는 오류 메시지 기능이 구현되지 않음

---

## 📋 테스트 상세 결과

### 1. 인증 테스트 (auth.spec.js)

| # | 테스트 시나리오 | 결과 | 에러 유형 |
|---|----------------|------|----------|
| 1 | 신규 사용자 회원가입 성공 | ❌ 실패 | 페이지 제목 불일치 |
| 2 | 회원가입 - 이메일 중복 오류 | ❌ 실패 | passwordConfirm 필드 없음 |
| 3 | 회원가입 - 비밀번호 불일치 | ❌ 실패 | passwordConfirm 필드 없음 |
| 4 | 기존 사용자 로그인 성공 | ❌ 실패 | passwordConfirm 필드 없음 |
| 5 | 로그인 - 잘못된 비밀번호 | ❌ 실패 | passwordConfirm 필드 없음 |
| 6 | 로그인 - 등록되지 않은 이메일 | ❌ 실패 | 오류 메시지 미표시 |
| 7 | 로그아웃 기능 | ❌ 실패 | passwordConfirm 필드 없음 |
| 8 | 토큰 자동 갱신 | ❌ 실패 | passwordConfirm 필드 없음 |

### 2. 할일 관리 테스트 (todo-crud.spec.js)

| # | 테스트 시나리오 | 결과 | 에러 유형 |
|---|----------------|------|----------|
| 9 | 할일 추가 - 간단한 할일 | ❌ 실패 | beforeEach 실패 (회원가입 실패) |
| 10 | 상세 정보 포함 할일 추가 | ❌ 실패 | beforeEach 실패 |
| 11 | 할일 완료 처리 | ❌ 실패 | beforeEach 실패 |
| 12 | 할일 수정 - 일정 변경 | ❌ 실패 | beforeEach 실패 |
| 13 | 할일 조회 - 오늘 할일 확인 | ❌ 실패 | beforeEach 실패 |
| 14 | 데이터 검증 - 만료일 오류 | ❌ 실패 | beforeEach 실패 |
| 15 | 데이터 검증 - 제목 누락 | ❌ 실패 | beforeEach 실패 |
| 16 | 할일 검색 기능 | ❌ 실패 | beforeEach 실패 |

### 3. 휴지통 기능 테스트 (trash.spec.js)

| # | 테스트 시나리오 | 결과 | 에러 유형 |
|---|----------------|------|----------|
| 17 | 실수로 삭제한 할일 복원 | ❌ 실패 | beforeEach 실패 |
| 18 | 할일 삭제 및 휴지통 확인 | ❌ 실패 | beforeEach 실패 |
| 19 | 영구 삭제 | ❌ 실패 | beforeEach 실패 |
| 20 | 휴지통 비우기 기능 | ❌ 실패 | beforeEach 실패 |

---

## 🔧 필요한 수정사항

### 우선순위 1: 회원가입 폼 필드명 확인

프론트엔드 코드를 확인하여 실제 필드명을 파악해야 합니다:

```javascript
// 현재 테스트 코드
await page.fill('input[name="passwordConfirm"]', user.password);

// 실제 프론트엔드에서 사용하는 필드명 확인 필요
// 가능성: confirmPassword, password_confirm, password2 등
```

**수정이 필요한 파일**:
- `tests/e2e/utils/auth-helper.js` - register() 함수

### 우선순위 2: 페이지 텍스트 패턴 업데이트

실제 프론트엔드에서 사용하는 텍스트로 변경:

```javascript
// 현재 테스트
await expect(page.locator('h1, h2')).toContainText(/회원가입|가입/);

// 수정 필요
await expect(page.locator('h1, h2')).toContainText(/새 계정 만들기|회원가입|가입/);
```

### 우선순위 3: 오류 메시지 셀렉터 수정

프론트엔드의 실제 오류 메시지 표시 방식 확인:

```javascript
// 현재 테스트
await expect(page.locator('text=/등록되지 않은|존재하지 않는|로그인 실패/i')).toBeVisible();

// 실제 프론트엔드의 오류 메시지 형식 확인 필요
// 예: .error-message, .alert, .toast 등
```

---

## 📁 테스트 결과 파일

### 생성된 파일

1. **스크린샷**: `test-results/*/test-failed-*.png`
   - 각 실패한 테스트의 스크린샷 캡처
   - 프론트엔드 UI 상태 확인 가능

2. **비디오**: `test-results/*/video.webm`
   - 테스트 실행 과정 녹화
   - 실패 원인 분석에 활용

3. **Error Context**: `test-results/*/error-context.md`
   - 상세한 오류 정보
   - DOM 상태, 네트워크 요청 등

4. **테스트 출력**: `tests/e2e/test-output.txt`
   - 전체 테스트 실행 로그

---

## 🎯 다음 단계

### 1단계: 프론트엔드 코드 조사

프론트엔드의 실제 구현을 확인하여 다음 정보 파악:

```bash
# 회원가입 컴포넌트 찾기
grep -r "register\|signup" frontend/src

# 로그인 컴포넌트 찾기
grep -r "login" frontend/src

# 입력 필드명 확인
grep -r "name=\"password" frontend/src
```

### 2단계: 테스트 코드 수정

파악한 정보를 바탕으로 헬퍼 함수 수정:
- `tests/e2e/utils/auth-helper.js`
- `tests/e2e/specs/auth.spec.js`

### 3단계: 재실행 및 검증

```bash
cd tests/e2e
npm test
```

### 4단계: UI 디버깅

실패하는 테스트가 있으면 UI 모드로 디버깅:

```bash
cd tests/e2e
npm run test:ui
```

---

## 📸 스크린샷 분석

첫 번째 실패 테스트의 스크린샷을 확인하면:
- 회원가입 페이지가 정상적으로 로드됨
- 제목이 "새 계정 만들기"로 표시됨
- 입력 필드가 존재하지만 name 속성이 다를 가능성

**권장사항**:
1. 스크린샷 파일을 열어서 실제 UI 구조 확인
2. 브라우저 개발자 도구로 실제 HTML 구조 확인
3. 실제 필드명에 맞춰 테스트 수정

---

## 🤝 권장 개선사항

### 1. 프론트엔드와 테스트 코드 동기화

프론트엔드 개발 시 테스트를 고려한 속성 추가:

```html
<!-- 권장 방식 -->
<input
  name="passwordConfirm"
  data-testid="password-confirm-input"
  type="password"
/>
```

### 2. 에러 메시지 일관성

에러 메시지에 고정된 data-testid 또는 role 추가:

```html
<div role="alert" data-testid="error-message">
  등록되지 않은 이메일입니다
</div>
```

### 3. 환경 변수 설정

테스트 환경 전용 설정:

```javascript
// playwright.config.js
use: {
  baseURL: process.env.TEST_BASE_URL || 'http://localhost:5173',
}
```

---

## 📝 결론

### 테스트 인프라

✅ **성공적으로 구축됨**:
- Playwright 설치 및 설정 완료
- 20개의 사용자 시나리오 기반 테스트 작성
- 테스트 헬퍼 함수 구현
- 자동 스크린샷 및 비디오 캡처

### 현재 상태

⚠️ **수정 필요**:
- 프론트엔드 실제 구현과 테스트 코드 간 불일치
- 회원가입 폼 필드명 확인 필요
- 텍스트 패턴 및 셀렉터 조정 필요

### 예상 소요 시간

프론트엔드 코드 확인 후 테스트 수정에 약 **1-2시간** 소요 예상

---

**작성자**: Claude
**테스트 프레임워크**: Playwright v1.57.0
**참조**: docs/4-user-scenarios.md
