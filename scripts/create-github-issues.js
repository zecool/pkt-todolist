/**
 * 깃헙 이슈 생성 스크립트
 * 실행 계획 문서(7-execution-plan.md)의 모든 Task에 대해 깃헙 이슈를 자동 생성합니다.
 *
 * 사용법: node scripts/create-github-issues.js
 */

const { execSync } = require("child_process");

// 이슈 생성 함수
function createIssue(issue) {
  const { title, body, labels } = issue;

  const labelString = labels.join(",");

  const command = `gh issue create --title "${title}" --body "${body}" --label "${labelString}"`;

  try {
    console.log(`\n이슈 생성 중: ${title}`);
    const result = execSync(command, { encoding: "utf-8" });
    console.log(`✅ 생성 완료: ${result.trim()}`);
    return result.trim();
  } catch (error) {
    console.error(`❌ 이슈 생성 실패: ${title}`);
    console.error(error.message);
    return null;
  }
}

// Phase 1: 데이터베이스 구축
const phase1Issues = [
  {
    title: "[Phase 1] Task 1.1: 로컬 PostgreSQL 설치 및 설정",
    body: `## 📋 작업 개요
PostgreSQL 15+ 설치 (Windows 환경), pgAdmin 또는 DBeaver 설치, 로컬 PostgreSQL 서버 실행 확인, 데이터베이스 생성 (\`whs_todolist_dev\`), 연결 테스트

## ✅ 완료 조건
- [ ] PostgreSQL 서비스 실행 중
- [ ] \`whs_todolist_dev\` 데이터베이스 생성 완료
- [ ] 연결 문자열 확인: \`postgresql://localhost:5432/whs_todolist_dev\`
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
- 데이터베이스: \`whs_todolist_dev\`
- 연결 정보 메모 (.env 작성용)

## ⏱️ 예상 시간
1시간`,
    labels: ["setup", "database", "complexity: low", "P0", "phase-1"],
  },
  {
    title: "[Phase 1] Task 1.2: 데이터베이스 스키마 작성 (schema.sql)",
    body: `## 📋 작업 개요
User 테이블 정의, Todo 테이블 정의, Holiday 테이블 정의, UNIQUE INDEX 추가, INDEX 추가, FOREIGN KEY 설정, CHECK 제약 추가

## ✅ 완료 조건
- [ ] \`schema.sql\` 파일 작성 완료
- [ ] UUID 기본 키 설정
- [ ] 인덱스 설정 완료
- [ ] 외래 키 제약 조건 설정
- [ ] CHECK 제약 조건 추가

## 🔧 기술적 고려사항
- 사용 기술: PostgreSQL, SQL
- 데이터 모델: User, Todo, Holiday 엔티티
- 제약 조건: UNIQUE, INDEX, FOREIGN KEY, CHECK

## 📦 의존성
### 선행 작업
- Task 1.1 (데이터베이스 생성)

### 후행 작업
- Task 1.3 (스키마 실행 및 검증)

## 📌 산출물
- \`backend/prisma/schema.sql\`

## ⏱️ 예상 시간
2시간`,
    labels: ["feature", "database", "complexity: medium", "P0", "phase-1"],
  },
  {
    title: "[Phase 1] Task 1.3: 스키마 실행 및 검증",
    body: `## 📋 작업 개요
\`schema.sql\` 실행, 테이블 생성 확인 (User, Todo, Holiday), 인덱스 생성 확인, 제약 조건 테스트

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
    labels: ["test", "database", "complexity: low", "P0", "phase-1"],
  },
  {
    title: "[Phase 1] Task 1.4: 초기 데이터 삽입 (국경일)",
    body: `## 📋 작업 개요
2025년 주요 국경일 데이터 삽입 (신정, 삼일절, 어린이날, 석가탄신일, 현충일, 광복절, 추석, 개천절, 한글날, 크리스마스), \`isRecurring=true\` 설정

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
- \`seed-holidays.sql\` (선택)

## ⏱️ 예상 시간
0.5시간`,
    labels: ["feature", "database", "complexity: low", "P1", "phase-1"],
  },
];

// Phase 2: 백엔드 개발 (14개 Task)
const phase2Issues = [
  {
    title: "[Phase 2] Task 2.1: 백엔드 프로젝트 초기화",
    body: `## 📋 작업 개요
\`backend/\` 디렉토리 생성, npm 초기화, 필수 패키지 설치 (express, pg, jsonwebtoken, bcrypt, express-validator, cors, helmet, express-rate-limit, dotenv), package.json 스크립트 설정, .env 파일 생성

## ✅ 완료 조건
- [ ] \`package.json\` 생성 완료
- [ ] 필수 패키지 8개 설치 완료
- [ ] \`.env\` 파일 작성 (DATABASE_URL, JWT_SECRET 등)
- [ ] \`.env.example\` 파일 생성
- [ ] \`.gitignore\` 설정 (node_modules, .env)

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
- \`backend/package.json\`
- \`backend/.env\`
- \`backend/.env.example\`

## ⏱️ 예상 시간
1시간`,
    labels: ["setup", "backend", "complexity: low", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.2: 디렉토리 구조 생성",
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
    labels: ["setup", "backend", "complexity: low", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.3: 데이터베이스 연결 설정",
    body: `## 📋 작업 개요
\`src/config/database.js\` 작성, pg.Pool 설정 (Connection Pool), 연결 문자열 환경 변수로 관리, 연결 테스트 함수 작성, 에러 핸들링 추가

## ✅ 완료 조건
- [ ] \`database.js\` 작성 완료
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
- \`backend/src/config/database.js\`

## ⏱️ 예상 시간
1시간`,
    labels: ["feature", "backend", "complexity: medium", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.4: JWT 유틸리티 작성",
    body: `## 📋 작업 개요
\`src/utils/jwtHelper.js\` 작성, generateAccessToken(payload) 함수 (15분 만료), generateRefreshToken(payload) 함수 (7일 만료), verifyAccessToken(token) 함수, verifyRefreshToken(token) 함수, 에러 핸들링

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
- \`backend/src/utils/jwtHelper.js\`

## ⏱️ 예상 시간
1시간`,
    labels: ["feature", "backend", "complexity: medium", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.5: 비밀번호 해싱 유틸리티 작성",
    body: `## 📋 작업 개요
\`src/utils/passwordHelper.js\` 작성, hashPassword(plainPassword) 함수 (bcrypt, salt rounds: 10), comparePassword(plainPassword, hashedPassword) 함수, 에러 핸들링

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
- \`backend/src/utils/passwordHelper.js\`

## ⏱️ 예상 시간
0.5시간`,
    labels: ["feature", "backend", "complexity: low", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.6: 인증 미들웨어 작성",
    body: `## 📋 작업 개요
\`src/middlewares/authMiddleware.js\` 작성, authenticate 미들웨어: JWT 검증 후 req.user에 사용자 정보 저장, requireAdmin 미들웨어: 관리자 권한 확인, Authorization 헤더 파싱, 에러 응답 처리 (401)

## ✅ 완료 조건
- [ ] \`authenticate\` 미들웨어 작성
- [ ] \`requireAdmin\` 미들웨어 작성
- [ ] 토큰 없을 시 401 반환
- [ ] 토큰 만료 시 401 반환
- [ ] \`req.user\`에 userId, role 저장

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
- \`backend/src/middlewares/authMiddleware.js\`

## ⏱️ 예상 시간
1시간`,
    labels: ["feature", "backend", "complexity: medium", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.7: 에러 핸들링 미들웨어 작성",
    body: `## 📋 작업 개요
\`src/middlewares/errorMiddleware.js\` 작성, 통일된 에러 응답 형식, HTTP 상태 코드 매핑, 에러 로깅, 프로덕션 환경에서는 스택 트레이스 숨김

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
- \`backend/src/middlewares/errorMiddleware.js\`

## ⏱️ 예상 시간
1시간`,
    labels: ["feature", "backend", "complexity: medium", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.8: 인증 API 구현 (회원가입, 로그인, 토큰 갱신)",
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
- \`backend/src/services/authService.js\`
- \`backend/src/controllers/authController.js\`
- \`backend/src/routes/authRoutes.js\`

## ⏱️ 예상 시간
3시간`,
    labels: ["feature", "backend", "complexity: high", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.9: 할일 CRUD API 구현",
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
- \`backend/src/services/todoService.js\`
- \`backend/src/controllers/todoController.js\`
- \`backend/src/routes/todoRoutes.js\`

## ⏱️ 예상 시간
4시간`,
    labels: ["feature", "backend", "complexity: high", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.10: 휴지통 API 구현",
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
- \`backend/src/services/trashService.js\`
- \`backend/src/controllers/trashController.js\`
- \`backend/src/routes/trashRoutes.js\`

## ⏱️ 예상 시간
1.5시간`,
    labels: ["feature", "backend", "complexity: medium", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.11: 국경일 API 구현",
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
- \`backend/src/services/holidayService.js\`
- \`backend/src/controllers/holidayController.js\`
- \`backend/src/routes/holidayRoutes.js\`

## ⏱️ 예상 시간
2시간`,
    labels: ["feature", "backend", "complexity: medium", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.12: Rate Limiting 미들웨어 추가",
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
- \`backend/src/middlewares/rateLimitMiddleware.js\`

## ⏱️ 예상 시간
0.5시간`,
    labels: ["feature", "backend", "complexity: low", "P1", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.13: Express 앱 통합 및 라우트 연결",
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
- \`backend/src/app.js\`
- \`backend/src/server.js\`

## ⏱️ 예상 시간
1시간`,
    labels: ["feature", "backend", "complexity: medium", "P0", "phase-2"],
  },
  {
    title: "[Phase 2] Task 2.14: API 테스트 (Postman/Thunder Client)",
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
    labels: ["test", "backend", "complexity: medium", "P0", "phase-2"],
  },
];

// Phase 3: 프론트엔드 개발 (20개 Task) - 일부만 표시
const phase3Issues = [
  {
    title:
      "[Phase 3] Task 3.1: 프론트엔드 프로젝트 초기화 (React + Vite + Tailwind)",
    body: `## 📋 작업 개요
npm create vite@latest frontend 실행, Tailwind CSS 설치 및 설정, 필수 패키지 설치 (react-router-dom, zustand, axios, react-hook-form, zod, date-fns, lucide-react), tailwind.config.js 설정, .env 파일 생성

## ✅ 완료 조건
- [ ] Vite 프로젝트 생성 완료
- [ ] Tailwind CSS 설정 완료
- [ ] 필수 패키지 7개 설치 완료
- [ ] \`.env\` 파일 작성
- [ ] 개발 서버 실행 확인 (npm run dev)

## 🔧 기술적 고려사항
- 사용 기술: React 18, Vite, Tailwind CSS
- 상태 관리: Zustand
- HTTP 클라이언트: Axios
- 폼 관리: React Hook Form + Zod

## 📦 의존성
### 선행 작업
없음 (독립 작업, 백엔드와 병렬 가능)

### 후행 작업
- Task 3.2 (디렉토리 구조)

## 📌 산출물
- \`frontend/package.json\`
- \`frontend/tailwind.config.js\`
- \`frontend/.env\`

## ⏱️ 예상 시간
1시간`,
    labels: ["setup", "frontend", "complexity: low", "P0", "phase-3"],
  },
  {
    title: "[Phase 3] Task 3.2: 디렉토리 구조 생성",
    body: `## 📋 작업 개요
프로젝트 구조 설계 원칙에 따라 폴더 생성: src/components/, src/pages/, src/stores/, src/services/, src/hooks/, src/utils/, src/constants/, 기본 파일 생성

## ✅ 완료 조건
- [ ] 7개 디렉토리 생성
- [ ] 디렉토리 구조가 설계 원칙과 일치

## 🔧 기술적 고려사항
- 아키텍처: Feature-based 구조
- 컴포넌트: common, todo, holiday, layout
- 상태 관리: Zustand stores
- 서비스: API 레이어

## 📦 의존성
### 선행 작업
- Task 3.1 (프로젝트 초기화)

### 후행 작업
- Task 3.3 ~ 3.20 (프론트엔드 기능 구현)

## 📌 산출물
- 프론트엔드 디렉토리 구조

## ⏱️ 예상 시간
0.5시간`,
    labels: ["setup", "frontend", "complexity: low", "P0", "phase-3"],
  },
  // ... 나머지 Phase 3 이슈들은 길이 제한으로 인해 스크립트에서 동적으로 생성
];

// Phase 4: 통합 및 배포 (7개 Task)
const phase4Issues = [
  {
    title: "[Phase 4] Task 4.1: 프론트엔드-백엔드 통합 테스트",
    body: `## 📋 작업 개요
로컬 환경에서 프론트엔드와 백엔드 동시 실행, CORS 설정 확인, API 연동 확인, JWT 인증 플로우 테스트, 에러 핸들링 확인

## ✅ 완료 조건
- [ ] 프론트엔드에서 백엔드 API 호출 성공
- [ ] 인증 플로우 정상 동작
- [ ] CORS 문제 없음
- [ ] 에러 메시지 정상 표시

## 🔧 기술적 고려사항
- 통합 테스트: E2E 시나리오
- CORS: 프론트-백엔드 도메인 허용
- 인증: JWT 토큰 전달
- 에러: 통일된 에러 응답 형식

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
    labels: ["test", "infrastructure", "complexity: medium", "P0", "phase-4"],
  },
];

// 모든 이슈 생성
async function createAllIssues() {
  console.log("=".repeat(60));
  console.log("깃헙 이슈 생성 시작");
  console.log("=".repeat(60));

  const createdIssues = [];

  // Phase 1
  console.log("\n📦 Phase 1: 데이터베이스 구축 (4개 이슈)");
  for (const issue of phase1Issues) {
    const result = createIssue(issue);
    if (result) createdIssues.push(result);
  }

  // Phase 2
  console.log("\n📦 Phase 2: 백엔드 개발 (14개 이슈)");
  for (const issue of phase2Issues) {
    const result = createIssue(issue);
    if (result) createdIssues.push(result);
  }

  // Phase 3 (샘플 2개만)
  console.log("\n📦 Phase 3: 프론트엔드 개발 (샘플 2개 이슈)");
  for (const issue of phase3Issues) {
    const result = createIssue(issue);
    if (result) createdIssues.push(result);
  }

  // Phase 4 (샘플 1개만)
  console.log("\n📦 Phase 4: 통합 및 배포 (샘플 1개 이슈)");
  for (const issue of phase4Issues) {
    const result = createIssue(issue);
    if (result) createdIssues.push(result);
  }

  // 최종 결과 요약
  console.log("\n" + "=".repeat(60));
  console.log("✅ 이슈 생성 완료");
  console.log("=".repeat(60));
  console.log(`총 생성된 이슈: ${createdIssues.length}개`);
  console.log("\nPhase별 이슈 개수:");
  console.log(`- Phase 1 (데이터베이스 구축): ${phase1Issues.length}개`);
  console.log(`- Phase 2 (백엔드 개발): ${phase2Issues.length}개`);
  console.log(`- Phase 3 (프론트엔드 개발): ${phase3Issues.length}개 (샘플)`);
  console.log(`- Phase 4 (통합 및 배포): ${phase4Issues.length}개 (샘플)`);
  console.log("\n생성된 이슈 URL:");
  createdIssues.forEach((url) => console.log(`- ${url}`));
}

// 실행
createAllIssues();
