/**
 * 깃헙 이슈 자동 생성 스크립트 (Phase 3-4)
 * Phase 3 (프론트엔드 개발): 20개
 * Phase 4 (통합 및 배포): 7개
 * 총 27개 이슈 생성
 *
 * 사용법: node scripts/create-github-issues-phase3-4.js
 *
 * 주의: gh CLI가 설치되고 인증되어 있어야 합니다.
 * gh auth login 명령으로 먼저 인증하세요.
 */

const { execSync } = require('child_process');
const fs = require('fs');

// 이슈 데이터 저장용
const issueResults = {
  created: [],
  failed: [],
  summary: {
    phase3: 0,
    phase4: 0,
    total: 0
  }
};

// 이슈 생성 함수
function createIssue(issue, phaseNum) {
  const { title, body, labels } = issue;
  const labelString = labels.join(',');

  // 특수 문자 이스케이프
  const escapedBody = body.replace(/"/g, '\\"').replace(/`/g, '\\`');
  const escapedTitle = title.replace(/"/g, '\\"');

  const command = `gh issue create --title "${escapedTitle}" --body "${escapedBody}" --label "${labelString}"`;

  try {
    console.log(`\n📝 이슈 생성 중: ${title}`);
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    const issueUrl = result.trim();
    console.log(`✅ 생성 완료: ${issueUrl}`);

    issueResults.created.push({ title, url: issueUrl });
    issueResults.summary[`phase${phaseNum}`]++;
    issueResults.summary.total++;

    return issueUrl;
  } catch (error) {
    console.error(`❌ 이슈 생성 실패: ${title}`);
    console.error(`  오류: ${error.message}`);
    issueResults.failed.push({ title, error: error.message });
    return null;
  }
}

// Phase 3: 프론트엔드 개발 (20개)
const phase3Issues = [
  {
    title: '[Phase 3] Task 3.1: 프론트엔드 프로젝트 초기화 (React + Vite + Tailwind)',
    body: `## 📋 작업 개요
npm create vite@latest frontend -- --template react 실행, Tailwind CSS 설치 및 설정, 필수 패키지 설치 (react-router-dom, zustand, axios, react-hook-form, zod, date-fns, lucide-react), tailwind.config.js 설정, .env 파일 생성

## ✅ 완료 조건
- [ ] Vite 프로젝트 생성 완료
- [ ] Tailwind CSS 설정 완료
- [ ] 필수 패키지 7개 설치 완료
- [ ] .env 파일 작성
- [ ] 개발 서버 실행 확인 (npm run dev)

## 🔧 기술적 고려사항
- 사용 기술: React 18+, Vite 5+, Tailwind CSS 3+
- 상태 관리: Zustand
- 폼 관리: React Hook Form + Zod
- HTTP: Axios
- 환경 변수: VITE_API_BASE_URL

## 📦 의존성
### 선행 작업
없음 (독립 작업, 백엔드와 병렬 가능)

### 후행 작업
- Task 3.2 (디렉토리 구조 생성)

## 📌 산출물
- frontend/package.json
- frontend/tailwind.config.js
- frontend/.env

## ⏱️ 예상 시간
1시간`,
    labels: ['setup', 'frontend', 'complexity: low', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.2: 디렉토리 구조 생성',
    body: `## 📋 작업 개요
프로젝트 구조 설계 원칙에 따라 폴더 생성: src/components/ (공통, todo, holiday, layout), src/pages/, src/stores/, src/services/, src/hooks/, src/utils/, src/constants/, 기본 파일 생성 (App.jsx, main.jsx)

## ✅ 완료 조건
- [ ] 7개 디렉토리 생성
- [ ] 디렉토리 구조가 설계 원칙과 일치

## 🔧 기술적 고려사항
- 아키텍처: Feature-based 폴더 구조
- 컴포넌트: Atomic Design 패턴
- 코드 구조: 모듈화, 관심사 분리

## 📦 의존성
### 선행 작업
- Task 3.1 (프로젝트 초기화)

### 후행 작업
- Task 3.3 ~ 3.20 (프론트엔드 기능 구현)

## 📌 산출물
- 프론트엔드 디렉토리 구조

## ⏱️ 예상 시간
0.5시간`,
    labels: ['setup', 'frontend', 'complexity: low', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.3: 상수 정의 및 Axios 인스턴스 설정',
    body: `## 📋 작업 개요
apiEndpoints.js 작성 (API 엔드포인트 상수), todoStatus.js 작성 (active, completed, deleted), services/api.js 작성 (Axios 인스턴스, 요청/응답 인터셉터, 에러 핸들링)

## ✅ 완료 조건
- [ ] 상수 파일 2개 작성 완료
- [ ] Axios 인스턴스 설정 완료
- [ ] 인터셉터 동작 확인
- [ ] 환경 변수 (VITE_API_BASE_URL) 사용 확인

## 🔧 기술적 고려사항
- 사용 기술: Axios
- 인증: Authorization 헤더 자동 추가
- 토큰 갱신: 401 에러 시 자동 시도
- 에러 핸들링: 통합 에러 처리

## 📦 의존성
### 선행 작업
- Task 3.2 (디렉토리 구조)

### 후행 작업
- Task 3.5 (authStore)
- Task 3.6 (API 서비스 레이어)

## 📌 산출물
- frontend/src/constants/apiEndpoints.js
- frontend/src/constants/todoStatus.js
- frontend/src/services/api.js

## ⏱️ 예상 시간
1시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.4: 유틸리티 함수 작성',
    body: `## 📋 작업 개요
dateFormatter.js 작성 (날짜 포맷팅), tokenManager.js 작성 (LocalStorage에 토큰 저장/조회/삭제), validator.js 작성 (이메일, 비밀번호 검증)

## ✅ 완료 조건
- [ ] 3개 유틸리티 파일 작성 완료
- [ ] 토큰 저장/조회 동작 확인
- [ ] 날짜 포맷팅 동작 확인

## 🔧 기술적 고려사항
- 사용 기술: date-fns, localStorage
- 날짜 처리: ISO 8601 형식
- 보안: XSS 방어 (토큰 저장)
- 검증: 정규식 사용

## 📦 의존성
### 선행 작업
- Task 3.2 (디렉토리 구조)

### 후행 작업
- Task 3.5 (authStore)

## 📌 산출물
- frontend/src/utils/dateFormatter.js
- frontend/src/utils/tokenManager.js
- frontend/src/utils/validator.js

## ⏱️ 예상 시간
1시간`,
    labels: ['feature', 'frontend', 'complexity: low', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.5: Zustand 스토어 설정 (authStore)',
    body: `## 📋 작업 개요
authStore.js 작성 (State: user, isAuthenticated, isLoading, error / Actions: login, register, logout, refreshToken), API 호출 (authService), 토큰 저장 (tokenManager)

## ✅ 완료 조건
- [ ] authStore 작성 완료
- [ ] 로그인/회원가입/로그아웃 동작 확인
- [ ] 토큰 저장 확인
- [ ] 에러 상태 관리 확인

## 🔧 기술적 고려사항
- 사용 기술: Zustand
- 상태 관리: 전역 인증 상태
- 토큰: Access + Refresh Token
- 에러 핸들링: try-catch 패턴

## 📦 의존성
### 선행 작업
- Task 3.3 (Axios 인스턴스)
- Task 3.4 (tokenManager)

### 후행 작업
- Task 3.9 (라우팅)
- Task 3.11 (인증 화면)

## 📌 산출물
- frontend/src/stores/authStore.js

## ⏱️ 예상 시간
1.5시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.6: API 서비스 레이어 작성',
    body: `## 📋 작업 개요
authService.js 작성 (login, register, refreshToken), todoService.js 작성 (getTodos, getTodoById, createTodo, updateTodo, completeTodo, deleteTodo, restoreTodo), holidayService.js 작성 (getHolidays), userService.js 작성 (getProfile, updateProfile)

## ✅ 완료 조건
- [ ] 4개 서비스 파일 작성 완료
- [ ] Axios 인스턴스 사용 확인
- [ ] API 엔드포인트 상수 사용 확인

## 🔧 기술적 고려사항
- 사용 기술: Axios
- API 통신: RESTful API
- 에러 핸들링: Promise rejection
- 데이터 변환: Request/Response 매핑

## 📦 의존성
### 선행 작업
- Task 3.3 (Axios 인스턴스)

### 후행 작업
- Task 3.7 (todoStore, holidayStore)

## 📌 산출물
- frontend/src/services/authService.js
- frontend/src/services/todoService.js
- frontend/src/services/holidayService.js
- frontend/src/services/userService.js

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.7: Zustand 스토어 설정 (todoStore, holidayStore, uiStore)',
    body: `## 📋 작업 개요
todoStore.js 작성 (State: todos, isLoading, error, filters / Actions: fetchTodos, createTodo, updateTodo, deleteTodo, restoreTodo, setFilters), holidayStore.js 작성 (State: holidays, isLoading, error / Actions: fetchHolidays), uiStore.js 작성 (State: isModalOpen, modalType, selectedTodo, isDarkMode / Actions: openModal, closeModal, toggleDarkMode)

## ✅ 완료 조건
- [ ] 3개 스토어 작성 완료
- [ ] 서비스 레이어 호출 확인
- [ ] 상태 업데이트 동작 확인

## 🔧 기술적 고려사항
- 사용 기술: Zustand
- 상태 관리: 도메인별 분리
- 비동기: async/await 패턴
- UI 상태: 모달, 다크모드

## 📦 의존성
### 선행 작업
- Task 3.6 (서비스 레이어)

### 후행 작업
- Task 3.13 (할일 목록 페이지)
- Task 3.14 (할일 모달)

## 📌 산출물
- frontend/src/stores/todoStore.js
- frontend/src/stores/holidayStore.js
- frontend/src/stores/uiStore.js

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.8: 공통 컴포넌트 구현 (Button, Input, Modal)',
    body: `## 📋 작업 개요
Button.jsx 작성 (버튼 variants, 크기 옵션, 로딩 상태), Input.jsx 작성 (입력 필드, 에러 표시, 레이블), Modal.jsx 작성 (모달 오버레이, 닫기, 슬롯), Loading.jsx 작성 (로딩 스피너)

## ✅ 완료 조건
- [ ] 4개 공통 컴포넌트 작성 완료
- [ ] Tailwind CSS 스타일링 적용
- [ ] Props 검증 (PropTypes 또는 주석)
- [ ] 재사용성 확인

## 🔧 기술적 고려사항
- 사용 기술: React, Tailwind CSS
- 디자인: 일관된 UI/UX
- 접근성: ARIA 속성
- 재사용성: 컴포넌트 추상화

## 📦 의존성
### 선행 작업
- Task 3.2 (디렉토리 구조)

### 후행 작업
- Task 3.11 (인증 화면)
- Task 3.14 (할일 모달)

## 📌 산출물
- frontend/src/components/common/Button.jsx
- frontend/src/components/common/Input.jsx
- frontend/src/components/common/Modal.jsx
- frontend/src/components/common/Loading.jsx

## ⏱️ 예상 시간
3시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.9: 라우팅 설정 (React Router)',
    body: `## 📋 작업 개요
routes.jsx 작성, 라우트 정의 (/login, /register, /, /trash, /holidays, /profile), Protected Route 컴포넌트 작성 (인증 체크), 인증되지 않은 사용자는 /login으로 리다이렉트

## ✅ 완료 조건
- [ ] 6개 라우트 정의 완료
- [ ] Protected Route 동작 확인
- [ ] 인증 체크 동작 확인
- [ ] 리다이렉트 동작 확인

## 🔧 기술적 고려사항
- 사용 기술: react-router-dom
- 인증: authStore 연동
- 보호 라우트: Private Route 패턴
- 리다이렉트: Navigate 컴포넌트

## 📦 의존성
### 선행 작업
- Task 3.5 (authStore)

### 후행 작업
- Task 3.10 (레이아웃)
- Task 3.11 ~ 3.17 (페이지 구현)

## 📌 산출물
- frontend/src/routes.jsx
- frontend/src/components/ProtectedRoute.jsx (선택)

## ⏱️ 예상 시간
1.5시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.10: 레이아웃 컴포넌트 구현 (Header, MainLayout)',
    body: `## 📋 작업 개요
Header.jsx 작성 (로고, 네비게이션 링크, 로그아웃 버튼, 다크모드 토글), MainLayout.jsx 작성 (Header + 콘텐츠 영역, 반응형 디자인)

## ✅ 완료 조건
- [ ] Header 컴포넌트 작성 완료
- [ ] MainLayout 컴포넌트 작성 완료
- [ ] 네비게이션 링크 동작 확인
- [ ] 로그아웃 동작 확인
- [ ] 반응형 디자인 확인

## 🔧 기술적 고려사항
- 사용 기술: React, react-router-dom
- 네비게이션: NavLink 컴포넌트
- 반응형: Tailwind breakpoints
- 모바일: 햄버거 메뉴

## 📦 의존성
### 선행 작업
- Task 3.5 (authStore)
- Task 3.9 (라우팅)

### 후행 작업
- Task 3.11 ~ 3.17 (페이지 구현)

## 📌 산출물
- frontend/src/components/layout/Header.jsx
- frontend/src/components/layout/MainLayout.jsx

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.11: 인증 화면 구현 (로그인, 회원가입)',
    body: `## 📋 작업 개요
LoginPage.jsx 작성 (이메일, 비밀번호 입력, 로그인 버튼, React Hook Form + Zod, authStore 연동), RegisterPage.jsx 작성 (이메일, 비밀번호, 사용자 이름 입력, 회원가입 버튼, 검증), 에러 메시지 표시

## ✅ 완료 조건
- [ ] 로그인 페이지 작성 완료
- [ ] 회원가입 페이지 작성 완료
- [ ] 폼 검증 동작 확인
- [ ] API 연동 확인
- [ ] 에러 메시지 표시 확인
- [ ] 페이지 전환 확인

## 🔧 기술적 고려사항
- 사용 기술: React Hook Form, Zod
- 검증: 이메일 형식, 비밀번호 길이
- UX: 로딩 상태, 에러 메시지
- 라우팅: 성공 시 리다이렉트

## 📦 의존성
### 선행 작업
- Task 3.5 (authStore)
- Task 3.8 (공통 컴포넌트)

### 후행 작업
- Task 3.20 (통합 테스트)

## 📌 산출물
- frontend/src/pages/LoginPage.jsx
- frontend/src/pages/RegisterPage.jsx

## ⏱️ 예상 시간
3시간`,
    labels: ['feature', 'frontend', 'complexity: high', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.12: 할일 관련 컴포넌트 구현',
    body: `## 📋 작업 개요
TodoCard.jsx 작성 (할일 제목, 내용, 날짜, 완료 체크박스, 수정/삭제 버튼, 상태별 색상), TodoList.jsx 작성 (TodoCard 목록, 빈 상태), TodoFilter.jsx 작성 (상태 필터, 정렬, 검색)

## ✅ 완료 조건
- [ ] 3개 컴포넌트 작성 완료
- [ ] 할일 카드 스타일링 완료
- [ ] 필터/검색 동작 확인
- [ ] 상태별 색상 표시 확인

## 🔧 기술적 고려사항
- 사용 기술: React, Tailwind CSS
- 상태: active (주황), completed (초록)
- 만료일: 지난 할일 표시
- 필터: status, search, sortBy

## 📦 의존성
### 선행 작업
- Task 3.8 (공통 컴포넌트)

### 후행 작업
- Task 3.13 (할일 목록 페이지)

## 📌 산출물
- frontend/src/components/todo/TodoCard.jsx
- frontend/src/components/todo/TodoList.jsx
- frontend/src/components/todo/TodoFilter.jsx

## ⏱️ 예상 시간
4시간`,
    labels: ['feature', 'frontend', 'complexity: high', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.13: 할일 목록 페이지 구현',
    body: `## 📋 작업 개요
TodoListPage.jsx 작성 (TodoFilter 배치, TodoList 배치, 할일 추가 버튼 FAB, todoStore 연동, 페이지 로드 시 할일 목록 조회, 로딩/에러 상태)

## ✅ 완료 조건
- [ ] 할일 목록 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 필터링/검색 동작 확인
- [ ] 로딩/에러 상태 표시 확인
- [ ] 반응형 디자인 확인

## 🔧 기술적 고려사항
- 사용 기술: React, Zustand
- 데이터 fetching: useEffect 훅
- 상태 관리: todoStore
- UI: FAB (Floating Action Button)

## 📦 의존성
### 선행 작업
- Task 3.7 (todoStore)
- Task 3.12 (할일 컴포넌트)

### 후행 작업
- Task 3.14 (할일 모달)

## 📌 산출물
- frontend/src/pages/TodoListPage.jsx

## ⏱️ 예상 시간
3시간`,
    labels: ['feature', 'frontend', 'complexity: high', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.14: 할일 추가/수정 모달 구현',
    body: `## 📋 작업 개요
TodoForm.jsx 작성 (제목, 내용, 시작일, 만료일 입력, React Hook Form + Zod, 날짜 검증, 저장/취소 버튼, 추가/수정 모드), Modal 컴포넌트와 통합, uiStore/todoStore 연동

## ✅ 완료 조건
- [ ] TodoForm 컴포넌트 작성 완료
- [ ] 모달 동작 확인
- [ ] 폼 검증 동작 확인
- [ ] API 연동 확인 (생성/수정)
- [ ] 추가/수정 모드 전환 확인

## 🔧 기술적 고려사항
- 사용 기술: React Hook Form, Zod
- 검증: dueDate >= startDate
- UX: 모달 열기/닫기, 폼 리셋
- 상태: 추가/수정 모드 분기

## 📦 의존성
### 선행 작업
- Task 3.7 (todoStore, uiStore)
- Task 3.8 (Modal 컴포넌트)

### 후행 작업
- Task 3.20 (통합 테스트)

## 📌 산출물
- frontend/src/components/todo/TodoForm.jsx

## ⏱️ 예상 시간
3시간`,
    labels: ['feature', 'frontend', 'complexity: high', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.15: 휴지통 페이지 구현',
    body: `## 📋 작업 개요
TrashPage.jsx 작성 (삭제된 할일 목록, 복원 버튼, 영구 삭제 버튼, todoStore 연동, status='deleted' 필터, 빈 상태 표시)

## ✅ 완료 조건
- [ ] 휴지통 페이지 작성 완료
- [ ] API 연동 확인 (복원, 영구 삭제)
- [ ] 버튼 동작 확인
- [ ] 빈 상태 표시 확인

## 🔧 기술적 고려사항
- 사용 기술: React, Zustand
- 필터: status='deleted'
- 복원: PATCH /api/todos/:id/restore
- 영구 삭제: DELETE /api/trash/:id

## 📦 의존성
### 선행 작업
- Task 3.7 (todoStore)
- Task 3.12 (TodoCard)

### 후행 작업
- Task 3.20 (통합 테스트)

## 📌 산출물
- frontend/src/pages/TrashPage.jsx

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.16: 국경일 페이지 구현',
    body: `## 📋 작업 개요
HolidayCard.jsx 작성 (국경일 이름, 날짜, 설명, 빨간색 테마), HolidayPage.jsx 작성 (HolidayCard 목록, 연도/월 필터, holidayStore 연동, 로딩 상태)

## ✅ 완료 조건
- [ ] HolidayCard 컴포넌트 작성 완료
- [ ] 국경일 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 필터 동작 확인

## 🔧 기술적 고려사항
- 사용 기술: React, Zustand
- 스타일: 빨간색 테마
- 필터: year, month 쿼리
- 데이터: 국경일 목록

## 📦 의존성
### 선행 작업
- Task 3.7 (holidayStore)

### 후행 작업
- Task 3.20 (통합 테스트)

## 📌 산출물
- frontend/src/components/holiday/HolidayCard.jsx
- frontend/src/pages/HolidayPage.jsx

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.17: 프로필 페이지 구현',
    body: `## 📋 작업 개요
ProfilePage.jsx 작성 (사용자 정보 표시: 이메일, 이름, 가입일, 사용자 이름 수정, 비밀번호 변경, authStore/userService 연동)

## ✅ 완료 조건
- [ ] 프로필 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 정보 수정 동작 확인

## 🔧 기술적 고려사항
- 사용 기술: React, React Hook Form
- API: getProfile, updateProfile
- 검증: 사용자 이름, 비밀번호
- UX: 수정 성공 메시지

## 📦 의존성
### 선행 작업
- Task 3.5 (authStore)
- Task 3.6 (userService)

### 후행 작업
- Task 3.20 (통합 테스트)

## 📌 산출물
- frontend/src/pages/ProfilePage.jsx

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P1', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.18: 반응형 디자인 적용',
    body: `## 📋 작업 개요
Tailwind CSS 브레이크포인트 활용, 모바일 (< 768px) 최적화 (헤더 → 햄버거 메뉴, 할일 카드 스택, 터치 버튼 44x44px+), 태블릿/데스크톱 레이아웃, 모바일 테스트

## ✅ 완료 조건
- [ ] 모든 페이지 반응형 동작 확인
- [ ] 모바일 화면에서 사용 가능
- [ ] 터치 UI 최적화 확인
- [ ] 크로스 브라우저 테스트 (Chrome, Safari)

## 🔧 기술적 고려사항
- 사용 기술: Tailwind CSS
- 브레이크포인트: sm, md, lg, xl
- 모바일: 터치 친화적 UI
- 테스트: Chrome DevTools

## 📦 의존성
### 선행 작업
- Task 3.13, 3.15, 3.16, 3.17 (모든 페이지)

### 후행 작업
- Task 3.19 (다크모드)

## 📌 산출물
- 반응형 스타일 적용 완료

## ⏱️ 예상 시간
3시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.19: 다크모드 구현 (선택)',
    body: `## 📋 작업 개요
Tailwind CSS dark: 유틸리티 사용, uiStore에 isDarkMode 상태 추가, LocalStorage에 다크모드 설정 저장, 시스템 설정 감지 (prefers-color-scheme), Header에 다크모드 토글 버튼 추가

## ✅ 완료 조건
- [ ] 다크모드 토글 동작 확인
- [ ] LocalStorage 저장 확인
- [ ] 모든 페이지 다크모드 적용 확인
- [ ] 색상 대비 확인 (WCAG AA)

## 🔧 기술적 고려사항
- 사용 기술: Tailwind CSS, localStorage
- 다크모드: dark: 클래스
- 시스템 설정: matchMedia API
- 접근성: 색상 대비 WCAG AA

## 📦 의존성
### 선행 작업
- Task 3.18 (반응형 디자인)

### 후행 작업
- Task 3.20 (통합 테스트)

## 📌 산출물
- 다크모드 기능 완성

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'frontend', 'complexity: medium', 'P1', 'phase-3']
  },
  {
    title: '[Phase 3] Task 3.20: 프론트엔드 통합 테스트',
    body: `## 📋 작업 개요
전체 사용자 플로우 테스트 (회원가입 → 로그인 → 할일 추가 → 수정 → 완료 → 삭제 → 복원 → 영구 삭제 → 국경일 조회 → 프로필 수정 → 로그아웃), 버그 수정, 성능 확인 (React DevTools Profiler)

## ✅ 완료 조건
- [ ] 전체 플로우 정상 동작 확인
- [ ] 발견된 버그 수정 완료
- [ ] 성능 이슈 없음

## 🔧 기술적 고려사항
- 테스트: 수동 E2E 테스트
- 디버깅: React DevTools
- 성능: Profiler, Lighthouse
- 버그 수정: 이슈 트래킹

## 📦 의존성
### 선행 작업
- Phase 3의 모든 Task 완료

### 후행 작업
- Phase 4 (통합 및 배포)

## 📌 산출물
- 테스트 결과 메모
- 버그 수정 완료

## ⏱️ 예상 시간
2시간`,
    labels: ['test', 'frontend', 'complexity: medium', 'P0', 'phase-3']
  }
];

// Phase 4: 통합 및 배포 (7개)
const phase4Issues = [
  {
    title: '[Phase 4] Task 4.1: 프론트엔드-백엔드 통합 테스트',
    body: `## 📋 작업 개요
로컬 환경에서 프론트엔드와 백엔드 동시 실행, CORS 설정 확인, API 연동 확인, JWT 인증 플로우 테스트, 에러 핸들링 확인

## ✅ 완료 조건
- [ ] 프론트엔드에서 백엔드 API 호출 성공
- [ ] 인증 플로우 정상 동작
- [ ] CORS 문제 없음
- [ ] 에러 메시지 정상 표시

## 🔧 기술적 고려사항
- CORS: 프론트엔드 origin 허용
- 인증: JWT Access/Refresh Token
- 네트워크: localhost:3000 (백엔드), localhost:5173 (프론트엔드)
- 디버깅: Network 탭, Console

## 📦 의존성
### 선행 작업
- Phase 2 완료 (백엔드)
- Phase 3 완료 (프론트엔드)

### 후행 작업
- Task 4.2 (Supabase 설정)

## 📌 산출물
- 통합 테스트 결과

## ⏱️ 예상 시간
2시간`,
    labels: ['test', 'infrastructure', 'complexity: medium', 'P0', 'phase-4']
  },
  {
    title: '[Phase 4] Task 4.2: Supabase PostgreSQL 설정',
    body: `## 📋 작업 개요
Supabase 계정 생성, 새 프로젝트 생성, PostgreSQL 데이터베이스 확인, 연결 문자열 복사, 로컬 schema.sql을 Supabase에 실행, 국경일 데이터 삽입, 연결 테스트

## ✅ 완료 조건
- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 생성 완료
- [ ] 초기 데이터 삽입 완료
- [ ] 연결 문자열 확인

## 🔧 기술적 고려사항
- 사용 플랫폼: Supabase
- 데이터베이스: PostgreSQL 15+
- 연결: Connection Pooling
- 보안: SSL 연결

## 📦 의존성
### 선행 작업
- Task 1.2, 1.3, 1.4 (스키마 작성)

### 후행 작업
- Task 4.3 (백엔드 배포)

## 📌 산출물
- Supabase 프로젝트
- 연결 문자열 (DATABASE_URL)

## ⏱️ 예상 시간
1시간`,
    labels: ['setup', 'infrastructure', 'complexity: medium', 'P0', 'phase-4']
  },
  {
    title: '[Phase 4] Task 4.3: Vercel 백엔드 배포',
    body: `## 📋 작업 개요
GitHub 레포지토리에 코드 푸시, Vercel 계정 생성 및 연결, backend/ 디렉토리를 Serverless Functions로 배포, 환경 변수 설정 (DATABASE_URL, JWT_SECRET 등), 배포 성공 확인

## ✅ 완료 조건
- [ ] Vercel 배포 성공
- [ ] 환경 변수 설정 완료
- [ ] API 엔드포인트 접근 가능
- [ ] Supabase 연결 확인

## 🔧 기술적 고려사항
- 사용 플랫폼: Vercel
- 배포 방식: Serverless Functions
- 환경 변수: DATABASE_URL, JWT_SECRET
- 보안: HTTPS 자동 적용

## 📦 의존성
### 선행 작업
- Task 4.2 (Supabase 설정)
- Phase 2 완료 (백엔드 개발)

### 후행 작업
- Task 4.4 (프론트엔드 배포)

## 📌 산출물
- 백엔드 배포 URL

## ⏱️ 예상 시간
1시간`,
    labels: ['setup', 'infrastructure', 'complexity: medium', 'P0', 'phase-4']
  },
  {
    title: '[Phase 4] Task 4.4: Vercel 프론트엔드 배포',
    body: `## 📋 작업 개요
GitHub 레포지토리에 코드 푸시 (프론트엔드), Vercel 프로젝트 생성 (frontend 디렉토리), 환경 변수 설정 (VITE_API_BASE_URL), 빌드 설정 확인 (Vite), 배포 성공 확인

## ✅ 완료 조건
- [ ] Vercel 배포 성공
- [ ] 환경 변수 설정 완료
- [ ] 프론트엔드 접근 가능
- [ ] 백엔드 API 연동 확인

## 🔧 기술적 고려사항
- 사용 플랫폼: Vercel
- 빌드: Vite
- 환경 변수: VITE_API_BASE_URL
- SPA: Vercel rewrites 설정

## 📦 의존성
### 선행 작업
- Task 4.3 (백엔드 배포)
- Phase 3 완료 (프론트엔드 개발)

### 후행 작업
- Task 4.5 (프로덕션 테스트)

## 📌 산출물
- 프론트엔드 배포 URL

## ⏱️ 예상 시간
1시간`,
    labels: ['setup', 'infrastructure', 'complexity: medium', 'P0', 'phase-4']
  },
  {
    title: '[Phase 4] Task 4.5: 프로덕션 환경 테스트',
    body: `## 📋 작업 개요
배포된 프론트엔드에서 전체 플로우 테스트, 회원가입 → 로그인 → 할일 CRUD → 휴지통 → 국경일 조회 → 프로필 → 로그아웃, 성능 확인 (Lighthouse), 보안 확인 (HTTPS, CORS, Rate Limiting), 크로스 브라우저 테스트, 모바일 테스트

## ✅ 완료 조건
- [ ] 전체 플로우 정상 동작
- [ ] Lighthouse 점수 80+ (Performance, Accessibility)
- [ ] HTTPS 정상 동작
- [ ] 크로스 브라우저 정상 동작
- [ ] 모바일 정상 동작

## 🔧 기술적 고려사항
- 테스트: 프로덕션 환경
- 성능: Lighthouse, Core Web Vitals
- 보안: HTTPS, CORS, Rate Limiting
- 호환성: Chrome, Safari, Firefox

## 📦 의존성
### 선행 작업
- Task 4.4 (프론트엔드 배포)

### 후행 작업
- Task 4.6 (문서화)

## 📌 산출물
- 프로덕션 테스트 결과

## ⏱️ 예상 시간
1.5시간`,
    labels: ['test', 'infrastructure', 'complexity: medium', 'P0', 'phase-4']
  },
  {
    title: '[Phase 4] Task 4.6: 문서화 및 README 작성',
    body: `## 📋 작업 개요
README.md 작성 (프로젝트 개요, 기술 스택, 설치 및 실행 방법, 환경 변수 설정 가이드, API 문서 링크, 배포 URL, 스크린샷), backend/README.md 작성 (API 문서), frontend/README.md 작성 (컴포넌트 구조)

## ✅ 완료 조건
- [ ] 루트 README 작성 완료
- [ ] 백엔드 README 작성 완료 (선택)
- [ ] 프론트엔드 README 작성 완료 (선택)

## 🔧 기술적 고려사항
- 문서 형식: Markdown
- 내용: 프로젝트 소개, 설치, 실행, 배포
- 스크린샷: 주요 화면 캡처
- API 문서: OpenAPI 스펙 (선택)

## 📦 의존성
### 선행 작업
- Phase 4의 모든 Task 완료

### 후행 작업
- Task 4.7 (최종 점검)

## 📌 산출물
- README.md

## ⏱️ 예상 시간
1시간`,
    labels: ['documentation', 'infrastructure', 'complexity: low', 'P1', 'phase-4']
  },
  {
    title: '[Phase 4] Task 4.7: 최종 점검 및 런칭',
    body: `## 📋 작업 개요
모든 Task 완료 확인, 체크리스트 점검, 배포 URL 공유, 런칭 공지 (선택)

## ✅ 완료 조건
- [ ] 모든 P0 기능 동작 확인
- [ ] 배포 URL 확인
- [ ] 문서화 완료

## 🔧 기술적 고려사항
- 체크리스트: 실행 계획 문서 참조
- P0 기능: 인증, 할일 CRUD, 휴지통, 국경일
- 배포: 프론트엔드 + 백엔드 URL
- 런칭: GitHub, SNS 공유 (선택)

## 📦 의존성
### 선행 작업
- 모든 Task 완료

### 후행 작업
- 없음 (프로젝트 완료)

## 📌 산출물
- 런칭 완료

## ⏱️ 예상 시간
0.5시간`,
    labels: ['documentation', 'infrastructure', 'complexity: low', 'P0', 'phase-4']
  }
];

console.log('='.repeat(70));
console.log('🚀 pkt-todolist 깃헙 이슈 자동 생성 스크립트 (Phase 3-4)');
console.log('='.repeat(70));
console.log(`\n📝 총 생성할 이슈: 27개`);
console.log(`  - Phase 3 (프론트엔드): 20개`);
console.log(`  - Phase 4 (통합/배포): 7개`);
console.log(`\n⚠️  Phase 1-2는 별도 스크립트로 실행하세요.`);
console.log(`   명령어: node scripts/create-github-issues-complete.js`);
console.log(`\n계속하려면 Ctrl+C로 중단하세요...`);
console.log('\n');

// 잠시 대기
setTimeout(() => {
  console.log('🏁 이슈 생성을 시작합니다...\n');

  // Phase 3 실행
  console.log('\n' + '='.repeat(70));
  console.log('📦 Phase 3: 프론트엔드 개발 (20개 이슈)');
  console.log('='.repeat(70));
  phase3Issues.forEach(issue => createIssue(issue, 3));

  // Phase 4 실행
  console.log('\n' + '='.repeat(70));
  console.log('📦 Phase 4: 통합 및 배포 (7개 이슈)');
  console.log('='.repeat(70));
  phase4Issues.forEach(issue => createIssue(issue, 4));

  // 최종 결과 출력
  console.log('\n' + '='.repeat(70));
  console.log('✅ 이슈 생성 완료!');
  console.log('='.repeat(70));
  console.log(`\n📊 생성 결과:`);
  console.log(`  - Phase 3: ${issueResults.summary.phase3}개`);
  console.log(`  - Phase 4: ${issueResults.summary.phase4}개`);
  console.log(`  - 총 생성: ${issueResults.summary.total}개`);

  if (issueResults.failed.length > 0) {
    console.log(`\n❌ 실패한 이슈: ${issueResults.failed.length}개`);
    issueResults.failed.forEach(fail => {
      console.log(`  - ${fail.title}`);
      console.log(`    오류: ${fail.error}`);
    });
  }

  console.log(`\n📝 생성된 이슈 URL:`);
  issueResults.created.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.url}`);
  });

  // 결과를 파일로 저장
  const reportPath = 'scripts/issue-creation-report-phase3-4.json';
  try {
    fs.writeFileSync(reportPath, JSON.stringify(issueResults, null, 2));
    console.log(`\n💾 결과 보고서가 저장되었습니다: ${reportPath}`);
  } catch (error) {
    console.error(`\n❌ 보고서 저장 실패: ${error.message}`);
  }

  console.log(`\n🎉 Phase 3-4 이슈 생성이 완료되었습니다!`);
  console.log(`\n📌 다음 단계:`);
  console.log(`   1. GitHub Issues 페이지에서 생성된 이슈 확인`);
  console.log(`   2. 이슈 라벨 및 마일스톤 설정 확인`);
  console.log(`   3. 프로젝트 보드에 이슈 추가 (선택)`);
  console.log(`   4. 개발 시작!`);
  console.log('\n');
}, 2000);