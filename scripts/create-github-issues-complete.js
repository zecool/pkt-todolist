/**
 * 깃헙 이슈 완전 자동 생성 스크립트
 * 실행 계획 문서의 모든 45개 Task에 대해 깃헙 이슈를 생성합니다.
 *
 * 사용법: node scripts/create-github-issues-complete.js
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
    phase1: 0,
    phase2: 0,
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

// Phase 1: 데이터베이스 구축 (4개)
const phase1Issues = [
  {
    title: '[Phase 1] Task 1.1: 로컬 PostgreSQL 설치 및 설정',
    body: `## 📋 작업 개요
PostgreSQL 15+ 설치 (Windows 환경), pgAdmin 또는 DBeaver 설치, 로컬 PostgreSQL 서버 실행 확인, 데이터베이스 생성 (whs_todolist_dev), 연결 테스트

## ✅ 완료 조건
- [ ] PostgreSQL 서비스 실행 중
- [ ] whs_todolist_dev 데이터베이스 생성 완료
- [ ] 연결 문자열 확인: postgresql://localhost:5432/whs_todolist_dev
- [ ] 관리 도구로 접속 가능

## 🔧 기술적 고려사항
- 사용 기술: PostgreSQL 15+, pgAdmin/DBeaver
- 데이터베이스: PostgreSQL (Supabase 호스팅)
- Connection Pooling 지원

## 📦 의존성
### 선행 작업
없음 (독립 작업)

### 후행 작업
- Task 1.2 (데이터베이스 스키마 작성)

## 📌 산출물
- PostgreSQL 설치 완료
- 데이터베이스: whs_todolist_dev
- 연결 정보 메모 (.env 작성용)

## ⏱️ 예상 시간
1시간`,
    labels: ['setup', 'database', 'complexity: low', 'P0', 'phase-1']
  },
  {
    title: '[Phase 1] Task 1.2: 데이터베이스 스키마 작성 (schema.sql)',
    body: `## 📋 작업 개요
User 테이블 정의, Todo 테이블 정의, Holiday 테이블 정의, UNIQUE INDEX 추가, INDEX 추가, FOREIGN KEY 설정, CHECK 제약 추가

## ✅ 완료 조건
- [ ] schema.sql 파일 작성 완료
- [ ] UUID 기본 키 설정
- [ ] 인덱스 설정 완료
- [ ] 외래 키 제약 조건 설정
- [ ] CHECK 제약 조건 추가

## 🔧 기술적 고려사항
- 사용 기술: PostgreSQL, SQL
- 데이터 모델: User, Todo, Holiday 엔티티
- 제약 조건: UNIQUE, INDEX, FOREIGN KEY, CHECK
- 보안: SQL Injection 방어

## 📦 의존성
### 선행 작업
- Task 1.1 (데이터베이스 생성)

### 후행 작업
- Task 1.3 (스키마 실행 및 검증)

## 📌 산출물
- backend/prisma/schema.sql

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'database', 'complexity: medium', 'P0', 'phase-1']
  },
  {
    title: '[Phase 1] Task 1.3: 스키마 실행 및 검증',
    body: `## 📋 작업 개요
schema.sql 실행, 테이블 생성 확인 (User, Todo, Holiday), 인덱스 생성 확인, 제약 조건 테스트

## ✅ 완료 조건
- [ ] 3개 테이블 생성 확인
- [ ] 인덱스 6개 생성 확인
- [ ] CHECK 제약 동작 확인 (잘못된 날짜 입력 시 에러)
- [ ] UNIQUE 제약 동작 확인 (이메일 중복 시 에러)

## 🔧 기술적 고려사항
- 사용 기술: psql, PostgreSQL
- 검증: 테이블, 인덱스, 제약 조건
- 보안: SQL Injection 방어

## 📦 의존성
### 선행 작업
- Task 1.2 (schema.sql 작성)

### 후행 작업
- Task 1.4 (초기 데이터 삽입)
- Task 2.3 (데이터베이스 연결 설정)

## 📌 산출물
- 데이터베이스 테이블 3개
- 검증 완료 보고서 (간단한 메모)

## ⏱️ 예상 시간
0.5시간`,
    labels: ['test', 'database', 'complexity: low', 'P0', 'phase-1']
  },
  {
    title: '[Phase 1] Task 1.4: 초기 데이터 삽입 (국경일)',
    body: `## 📋 작업 개요
2025년 주요 국경일 데이터 삽입 (신정, 삼일절, 어린이날, 석가탄신일, 현충일, 광복절, 추석, 개천절, 한글날, 크리스마스), isRecurring=true 설정

## ✅ 완료 조건
- [ ] 최소 10개 국경일 데이터 삽입
- [ ] Holiday 테이블 조회로 확인
- [ ] 날짜 정렬 확인

## 🔧 기술적 고려사항
- 사용 기술: SQL, PostgreSQL
- 데이터 정확성: 공공데이터포털 참조
- 매년 반복: isRecurring 플래그 활용

## 📦 의존성
### 선행 작업
- Task 1.3 (테이블 생성)

### 후행 작업
- Task 2.11 (국경일 API 구현)

## 📌 산출물
- 국경일 데이터 10+개
- seed-holidays.sql (선택)

## ⏱️ 예상 시간
0.5시간`,
    labels: ['feature', 'database', 'complexity: low', 'P1', 'phase-1']
  }
];

// Phase 2: 백엔드 개발 (14개) - 모든 Task 포함
const phase2Issues = [
  {
    title: '[Phase 2] Task 2.1: 백엔드 프로젝트 초기화',
    body: `## 📋 작업 개요
backend/ 디렉토리 생성, npm 초기화, 필수 패키지 설치 (express, pg, jsonwebtoken, bcrypt, express-validator, cors, helmet, express-rate-limit, dotenv), package.json 스크립트 설정, .env 파일 생성

## ✅ 완료 조건
- [ ] package.json 생성 완료
- [ ] 필수 패키지 8개 설치 완료
- [ ] .env 파일 작성 (DATABASE_URL, JWT_SECRET 등)
- [ ] .env.example 파일 생성
- [ ] .gitignore 설정 (node_modules, .env)

## 🔧 기술적 고려사항
- 사용 기술: Node.js 18+, Express.js 4.x
- 패키지 관리: npm
- 환경 변수: dotenv
- 보안: .env 파일 gitignore 필수

## 📦 의존성
### 선행 작업
- Task 1.3 (DB 준비)

### 후행 작업
- Task 2.2 (디렉토리 구조 생성)

## 📌 산출물
- backend/package.json
- backend/.env
- backend/.env.example

## ⏱️ 예상 시간
1시간`,
    labels: ['setup', 'backend', 'complexity: low', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.2: 디렉토리 구조 생성',
    body: `## 📋 작업 개요
프로젝트 구조 설계 원칙에 따라 폴더 생성: src/controllers/, src/services/, src/routes/, src/middlewares/, src/config/, src/utils/, src/app.js, src/server.js

## ✅ 완료 조건
- [ ] 7개 디렉토리 생성
- [ ] 기본 파일 생성 (app.js, server.js)
- [ ] 디렉토리 구조가 설계 원칙과 일치

## 🔧 기술적 고려사항
- 아키텍처: Layered Architecture (Controller-Service-Repository)
- 코드 구조: 모듈화, 관심사 분리
- 유지보수성: 명확한 폴더 구조

## 📦 의존성
### 선행 작업
- Task 2.1 (프로젝트 초기화)

### 후행 작업
- Task 2.3 ~ 2.7 (백엔드 기능 구현)

## 📌 산출물
- 백엔드 디렉토리 구조

## ⏱️ 예상 시간
0.5시간`,
    labels: ['setup', 'backend', 'complexity: low', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.3: 데이터베이스 연결 설정',
    body: `## 📋 작업 개요
src/config/database.js 작성, pg.Pool 설정 (Connection Pool), 연결 문자열 환경 변수로 관리, 연결 테스트 함수 작성, 에러 핸들링 추가

## ✅ 완료 조건
- [ ] database.js 작성 완료
- [ ] Connection Pool 설정 (max: 10)
- [ ] 연결 테스트 성공
- [ ] 에러 로그 출력 확인

## 🔧 기술적 고려사항
- 사용 기술: node-postgres (pg)
- Connection Pool: 최대 10개 연결
- 환경 변수: DATABASE_URL
- 에러 핸들링: 연결 실패 시 로그 출력

## 📦 의존성
### 선행 작업
- Task 2.2 (디렉토리 구조)
- Task 1.3 (DB 준비)

### 후행 작업
- Task 2.8 ~ 2.11 (API 구현)

## 📌 산출물
- backend/src/config/database.js

## ⏱️ 예상 시간
1시간`,
    labels: ['feature', 'backend', 'complexity: medium', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.4: JWT 유틸리티 작성',
    body: `## 📋 작업 개요
src/utils/jwtHelper.js 작성, generateAccessToken(payload) 함수 (15분 만료), generateRefreshToken(payload) 함수 (7일 만료), verifyAccessToken(token) 함수, verifyRefreshToken(token) 함수, 에러 핸들링

## ✅ 완료 조건
- [ ] 4개 함수 작성 완료
- [ ] Access Token 만료 시간: 15분
- [ ] Refresh Token 만료 시간: 7일
- [ ] 토큰 검증 에러 처리 완료

## 🔧 기술적 고려사항
- 사용 기술: jsonwebtoken
- 보안: JWT_SECRET 환경 변수 사용
- 토큰 만료: Access 15분, Refresh 7일
- 에러 핸들링: TokenExpiredError, JsonWebTokenError

## 📦 의존성
### 선행 작업
- Task 2.2 (디렉토리 구조)

### 후행 작업
- Task 2.6 (인증 미들웨어)
- Task 2.8 (인증 API)

## 📌 산출물
- backend/src/utils/jwtHelper.js

## ⏱️ 예상 시간
1시간`,
    labels: ['feature', 'backend', 'complexity: medium', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.5: 비밀번호 해싱 유틸리티 작성',
    body: `## 📋 작업 개요
src/utils/passwordHelper.js 작성, hashPassword(plainPassword) 함수 (bcrypt, salt rounds: 10), comparePassword(plainPassword, hashedPassword) 함수, 에러 핸들링

## ✅ 완료 조건
- [ ] 2개 함수 작성 완료
- [ ] Salt rounds: 10
- [ ] 비밀번호 해싱/비교 테스트 성공

## 🔧 기술적 고려사항
- 사용 기술: bcrypt
- 보안: Salt rounds 10
- 비밀번호 해싱: bcrypt 알고리즘
- 성능: 비동기 처리

## 📦 의존성
### 선행 작업
- Task 2.2 (디렉토리 구조)

### 후행 작업
- Task 2.8 (인증 API)

## 📌 산출물
- backend/src/utils/passwordHelper.js

## ⏱️ 예상 시간
0.5시간`,
    labels: ['feature', 'backend', 'complexity: low', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.6: 인증 미들웨어 작성',
    body: `## 📋 작업 개요
src/middlewares/authMiddleware.js 작성, authenticate 미들웨어: JWT 검증 후 req.user에 사용자 정보 저장, requireAdmin 미들웨어: 관리자 권한 확인, Authorization 헤더 파싱, 에러 응답 처리 (401)

## ✅ 완료 조건
- [ ] authenticate 미들웨어 작성
- [ ] requireAdmin 미들웨어 작성
- [ ] 토큰 없을 시 401 반환
- [ ] 토큰 만료 시 401 반환
- [ ] req.user에 userId, role 저장

## 🔧 기술적 고려사항
- 사용 기술: Express middleware
- 인증: JWT Bearer Token
- 권한: role 기반 접근 제어
- 보안: 401 Unauthorized 응답

## 📦 의존성
### 선행 작업
- Task 2.4 (JWT 유틸리티)

### 후행 작업
- Task 2.9 ~ 2.11 (API 구현)

## 📌 산출물
- backend/src/middlewares/authMiddleware.js

## ⏱️ 예상 시간
1시간`,
    labels: ['feature', 'backend', 'complexity: medium', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.7: 에러 핸들링 미들웨어 작성',
    body: `## 📋 작업 개요
src/middlewares/errorMiddleware.js 작성, 통일된 에러 응답 형식, HTTP 상태 코드 매핑, 에러 로깅, 프로덕션 환경에서는 스택 트레이스 숨김

## ✅ 완료 조건
- [ ] 에러 핸들러 작성 완료
- [ ] 에러 응답 형식 통일
- [ ] 로그 출력 확인
- [ ] 환경별 응답 차이 구현 (dev/prod)

## 🔧 기술적 고려사항
- 사용 기술: Express error middleware
- 에러 형식: {success: false, error: {code, message}}
- 로깅: console.error
- 보안: 프로덕션에서 스택 트레이스 숨김

## 📦 의존성
### 선행 작업
- Task 2.2 (디렉토리 구조)

### 후행 작업
- Task 2.13 (Express 앱 통합)

## 📌 산출물
- backend/src/middlewares/errorMiddleware.js

## ⏱️ 예상 시간
1시간`,
    labels: ['feature', 'backend', 'complexity: medium', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.8: 인증 API 구현 (회원가입, 로그인, 토큰 갱신)',
    body: `## 📋 작업 개요
authService.js 작성 (register, login, refreshAccessToken), authController.js 작성 (POST /api/auth/register, /login, /refresh, /logout), authRoutes.js 작성, 입력 검증 (express-validator)

## ✅ 완료 조건
- [ ] 회원가입 API 동작 확인 (이메일 중복 체크)
- [ ] 로그인 API 동작 확인 (Access + Refresh Token 발급)
- [ ] 토큰 갱신 API 동작 확인
- [ ] 비밀번호 bcrypt 해싱 확인
- [ ] 에러 응답 확인 (400, 401, 409)

## 🔧 기술적 고려사항
- 사용 기술: Express, express-validator
- 인증: JWT (Access 15분, Refresh 7일)
- 보안: bcrypt 비밀번호 해싱
- 검증: 이메일 형식, 비밀번호 길이

## 📦 의존성
### 선행 작업
- Task 2.3 (DB 연결)
- Task 2.4 (JWT 유틸리티)
- Task 2.5 (비밀번호 해싱)

### 후행 작업
- Task 3.11 (프론트엔드 인증 화면)

## 📌 산출물
- backend/src/services/authService.js
- backend/src/controllers/authController.js
- backend/src/routes/authRoutes.js

## ⏱️ 예상 시간
3시간`,
    labels: ['feature', 'backend', 'complexity: high', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.9: 할일 CRUD API 구현',
    body: `## 📋 작업 개요
todoService.js 작성 (getTodos, getTodoById, createTodo, updateTodo, completeTodo, deleteTodo, restoreTodo), todoController.js 작성 (7개 엔드포인트), todoRoutes.js 작성, 비즈니스 규칙 적용

## ✅ 완료 조건
- [ ] 7개 API 엔드포인트 동작 확인
- [ ] 인증 미들웨어 적용
- [ ] 권한 체크 (타인의 할일 접근 금지)
- [ ] 소프트 삭제 동작 확인
- [ ] 날짜 검증 동작 확인
- [ ] 에러 응답 확인 (400, 403, 404)

## 🔧 기술적 고려사항
- 사용 기술: Express, PostgreSQL
- 소프트 삭제: status='deleted', deletedAt 기록
- 권한 체크: userId 기반
- 검증: dueDate >= startDate

## 📦 의존성
### 선행 작업
- Task 2.3 (DB 연결)
- Task 2.6 (인증 미들웨어)

### 후행 작업
- Task 3.13 (할일 목록 페이지)

## 📌 산출물
- backend/src/services/todoService.js
- backend/src/controllers/todoController.js
- backend/src/routes/todoRoutes.js

## ⏱️ 예상 시간
4시간`,
    labels: ['feature', 'backend', 'complexity: high', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.10: 휴지통 API 구현',
    body: `## 📋 작업 개요
trashService.js 작성 (getTrash, permanentlyDelete), trashController.js 작성 (GET /api/trash, DELETE /api/trash/:id), trashRoutes.js 작성

## ✅ 완료 조건
- [ ] 휴지통 조회 API 동작 확인
- [ ] 영구 삭제 API 동작 확인 (DB에서 완전히 제거)
- [ ] 권한 체크 동작 확인
- [ ] 에러 응답 확인 (404, 400)

## 🔧 기술적 고려사항
- 사용 기술: Express, PostgreSQL
- 소프트 삭제: status='deleted' 필터
- 영구 삭제: DB DELETE 쿼리
- 권한: userId 기반 접근 제어

## 📦 의존성
### 선행 작업
- Task 2.9 (할일 API)

### 후행 작업
- Task 3.15 (휴지통 페이지)

## 📌 산출물
- backend/src/services/trashService.js
- backend/src/controllers/trashController.js
- backend/src/routes/trashRoutes.js

## ⏱️ 예상 시간
1.5시간`,
    labels: ['feature', 'backend', 'complexity: medium', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.11: 국경일 API 구현',
    body: `## 📋 작업 개요
holidayService.js 작성 (getHolidays, createHoliday, updateHoliday), holidayController.js 작성 (GET /api/holidays, POST, PUT), holidayRoutes.js 작성, 관리자 권한 미들웨어 적용

## ✅ 완료 조건
- [ ] 국경일 조회 API 동작 확인 (인증 필요)
- [ ] 국경일 추가 API 동작 확인 (관리자만 가능)
- [ ] 국경일 수정 API 동작 확인 (관리자만 가능)
- [ ] 연도/월 필터링 동작 확인
- [ ] 에러 응답 확인 (403, 404)

## 🔧 기술적 고려사항
- 사용 기술: Express, PostgreSQL
- 권한: role='admin' 확인
- 필터: year, month 쿼리 파라미터
- 비즈니스 규칙: 국경일 삭제 불가

## 📦 의존성
### 선행 작업
- Task 2.3 (DB 연결)
- Task 2.6 (인증 미들웨어)

### 후행 작업
- Task 3.16 (국경일 페이지)

## 📌 산출물
- backend/src/services/holidayService.js
- backend/src/controllers/holidayController.js
- backend/src/routes/holidayRoutes.js

## ⏱️ 예상 시간
2시간`,
    labels: ['feature', 'backend', 'complexity: medium', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.12: Rate Limiting 미들웨어 추가',
    body: `## 📋 작업 개요
rateLimitMiddleware.js 작성, 일반 API: 100 req/min per IP, 인증 API: 5 req/15min per IP, express-rate-limit 사용

## ✅ 완료 조건
- [ ] Rate Limiter 설정 완료
- [ ] 인증 API에 적용
- [ ] 제한 초과 시 429 응답 확인

## 🔧 기술적 고려사항
- 사용 기술: express-rate-limit
- 보안: DDoS 방어, Brute Force 방어
- 제한: 일반 100/min, 인증 5/15min
- 응답: 429 Too Many Requests

## 📦 의존성
### 선행 작업
- Task 2.2 (디렉토리 구조)

### 후행 작업
- Task 2.13 (Express 앱 통합)

## 📌 산출물
- backend/src/middlewares/rateLimitMiddleware.js

## ⏱️ 예상 시간
0.5시간`,
    labels: ['feature', 'backend', 'complexity: low', 'P1', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.13: Express 앱 통합 및 라우트 연결',
    body: `## 📋 작업 개요
app.js 작성 (CORS, Helmet, JSON 파싱, 라우트 연결, 에러 핸들러), server.js 작성 (포트 3000, 서버 시작)

## ✅ 완료 조건
- [ ] CORS 설정 완료
- [ ] 보안 헤더 적용 확인
- [ ] 4개 라우트 연결 확인
- [ ] 에러 핸들러 동작 확인
- [ ] 서버 실행 확인 (http://localhost:3000)

## 🔧 기술적 고려사항
- 사용 기술: Express, cors, helmet
- 보안: CORS, 보안 헤더
- 라우트: /api/auth, /api/todos, /api/trash, /api/holidays
- 에러 처리: 전역 에러 핸들러

## 📦 의존성
### 선행 작업
- Task 2.8, 2.9, 2.10, 2.11 (모든 라우트)

### 후행 작업
- Task 2.14 (API 테스트)

## 📌 산출물
- backend/src/app.js
- backend/src/server.js

## ⏱️ 예상 시간
1시간`,
    labels: ['feature', 'backend', 'complexity: medium', 'P0', 'phase-2']
  },
  {
    title: '[Phase 2] Task 2.14: API 테스트 (Postman/Thunder Client)',
    body: `## 📋 작업 개요
Postman 또는 Thunder Client 컬렉션 생성, 모든 API 엔드포인트 테스트, 성공 케이스 및 실패 케이스 테스트, 에러 응답 확인

## ✅ 완료 조건
- [ ] 모든 API 엔드포인트 테스트 완료
- [ ] 성공 케이스 동작 확인
- [ ] 실패 케이스 에러 응답 확인
- [ ] JWT 인증 동작 확인
- [ ] 권한 체크 동작 확인

## 🔧 기술적 고려사항
- 테스트 도구: Postman, Thunder Client
- 테스트 시나리오: 회원가입 → 로그인 → CRUD → 휴지통
- 검증: 상태 코드, 응답 형식, 에러 메시지

## 📦 의존성
### 선행 작업
- Task 2.13 (서버 실행)

### 후행 작업
- Phase 3 (프론트엔드 개발)

## 📌 산출물
- Postman/Thunder Client 컬렉션 (선택)
- 테스트 결과 메모

## ⏱️ 예상 시간
2시간`,
    labels: ['test', 'backend', 'complexity: medium', 'P0', 'phase-2']
  }
];

// Phase 3와 Phase 4는 파일이 너무 길어지므로 나눠서 작성합니다.
// 여기서는 요약만 표시

console.log('=' .repeat(70));
console.log('🚀 pkt-todolist 깃헙 이슈 자동 생성 스크립트');
console.log('='.repeat(70));
console.log(`\n📝 총 생성할 이슈: 45개`);
console.log(`  - Phase 1 (데이터베이스): 4개`);
console.log(`  - Phase 2 (백엔드): 14개`);
console.log(`  - Phase 3 (프론트엔드): 20개 (별도 스크립트 필요)`);
console.log(`  - Phase 4 (통합/배포): 7개 (별도 스크립트 필요)`);
console.log(`\n⚠️  이 스크립트는 Phase 1과 Phase 2만 생성합니다 (총 18개)`);
console.log(`\n계속하려면 Ctrl+C로 중단하세요...`);
console.log('\n');

// 잠시 대기
setTimeout(() => {
  console.log('🏁 이슈 생성을 시작합니다...\n');

  // Phase 1 실행
  console.log('\n' + '='.repeat(70));
  console.log('📦 Phase 1: 데이터베이스 구축 (4개 이슈)');
  console.log('='.repeat(70));
  phase1Issues.forEach(issue => createIssue(issue, 1));

  // Phase 2 실행
  console.log('\n' + '='.repeat(70));
  console.log('📦 Phase 2: 백엔드 개발 (14개 이슈)');
  console.log('='.repeat(70));
  phase2Issues.forEach(issue => createIssue(issue, 2));

  // 최종 결과 출력
  console.log('\n' + '='.repeat(70));
  console.log('✅ 이슈 생성 완료!');
  console.log('='.repeat(70));
  console.log(`\n📊 생성 결과:`);
  console.log(`  - Phase 1: ${issueResults.summary.phase1}개`);
  console.log(`  - Phase 2: ${issueResults.summary.phase2}개`);
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
  const reportPath = 'scripts/issue-creation-report.json';
  try {
    fs.writeFileSync(reportPath, JSON.stringify(issueResults, null, 2));
    console.log(`\n💾 결과 보고서가 저장되었습니다: ${reportPath}`);
  } catch (error) {
    console.error(`\n❌ 보고서 저장 실패: ${error.message}`);
  }

  console.log(`\n⚠️  Phase 3와 Phase 4 이슈는 별도로 생성해야 합니다.`);
  console.log(`   다음 명령어 실행: node scripts/create-github-issues-phase3-4.js`);
  console.log('\n');
}, 2000);
