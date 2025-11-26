# pkt-todolist 실행 계획서

**버전**: 1.0
**작성일**: 2025-11-26
**상태**: 최종
**작성자**: Claude
**참조 문서**:

- [도메인 정의서](./1-domain-definition.md)
- [PRD](./3-prd.md)
- [프로젝트 구조](./5-project-structure.md)
- [아키텍처 다이어그램](./5-arch-diagram.md)

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [전체 일정](#2-전체-일정)
3. [Phase 1: 환경 설정](#phase-1-환경-설정)
4. [Phase 2: 데이터베이스](#phase-2-데이터베이스)
5. [Phase 3: 백엔드](#phase-3-백엔드)
6. [Phase 4: 프론트엔드](#phase-4-프론트엔드)
7. [Phase 5: 통합 및 배포](#phase-5-통합-및-배포)
8. [리스크 관리](#리스크-관리)

---

## 1. 프로젝트 개요

### 프로젝트 목표

- JWT 기반 인증이 포함된 할일 관리 애플리케이션 구축
- 휴지통 기능(소프트 삭제)을 통한 복원 가능한 데이터 관리
- 공통 국경일 정보 제공
- MVP 범위 내에서 필수 기능만 구현

### 개발 원칙

- **단순성 우선**: 오버엔지니어링 금지
- **MVP 집중**: P0 기능 우선 구현
- **독립적 Task**: 각 Task는 독립적으로 실행 가능
- **검증 가능성**: 완료 조건 명확히 정의

### 우선순위 정의

- **P0 (필수)**: MVP 출시에 반드시 필요한 기능
- **P1 (중요)**: 시간 여유 시 구현
- **P2 (선택)**: 2차 개발에서 고려

---

## 2. 전체 일정

### 마일스톤

| Phase   | 기간  | 목표                   |
| ------- | ----- | ---------------------- |
| Phase 1 | 0.5일 | 환경 설정 완료         |
| Phase 2 | 0.5일 | 데이터베이스 구축 완료 |
| Phase 3 | 1.5일 | 백엔드 API 구현 완료   |
| Phase 4 | 2일   | 프론트엔드 구현 완료   |
| Phase 5 | 0.5일 | 통합 테스트 및 배포    |

**총 예상 기간**: 5일 (여유 포함)

---

## Phase 1: 환경 설정

### 목표

프로젝트 초기 설정 및 개발 환경 구축

---

### [TASK-001] Git 저장소 및 프로젝트 구조 생성

**우선순위**: P0
**예상 시간**: 30분
**담당 영역**: 전체
**의존성**: 없음

#### 작업 내용

- Git 저장소 초기화
- `.gitignore` 파일 생성 (Node.js, React 템플릿)
- 프로젝트 루트 디렉토리 구조 생성 (`frontend/`, `backend/`, `docs/`)
- README.md 기본 구조 작성

#### 완료 조건

- [ ] Git 저장소 초기화 완료 (`git init`)
- [ ] `.gitignore` 파일 생성 (`.env`, `node_modules`, `dist` 포함)
- [ ] 프로젝트 루트에 `frontend/`, `backend/`, `docs/` 폴더 생성
- [ ] README.md에 프로젝트 제목, 설명, 기술 스택 작성

#### 산출물

- `.gitignore`
- `README.md`
- 프로젝트 디렉토리 구조

#### 참고 사항

- `.gitignore`에는 `.env`, `node_modules/`, `dist/`, `build/` 반드시 포함
- README에는 프로젝트 실행 방법 작성 (추후 업데이트)

---

### [TASK-002] 백엔드 프로젝트 초기 설정

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 백엔드
**의존성**: TASK-001

#### 작업 내용

- `backend/` 폴더에서 Node.js 프로젝트 초기화
- Express.js 및 필수 의존성 설치
- 디렉토리 구조 생성 (`src/controllers`, `src/services`, `src/routes` 등)
- 환경 변수 파일 설정 (`.env`, `.env.example`)
- ESLint, Prettier 설정

#### 완료 조건

- [ ] `package.json` 생성 (`npm init -y`)
- [ ] 필수 패키지 설치 완료
  - express
  - cors
  - helmet
  - dotenv
  - bcrypt
  - jsonwebtoken
  - express-validator
  - express-rate-limit
- [ ] 개발 도구 설치 완료
  - nodemon
  - eslint
  - prettier
- [ ] `src/` 폴더 및 하위 디렉토리 생성
  - `controllers/`, `services/`, `repositories/`, `routes/`, `middlewares/`, `utils/`, `config/`
- [ ] `.env.example` 파일 생성 (필요한 환경 변수 목록)
- [ ] `.eslintrc.json`, `.prettierrc` 설정 파일 생성
- [ ] `src/app.js` 및 `src/server.js` 기본 구조 작성

#### 산출물

- `backend/package.json`
- `backend/.env.example`
- `backend/src/` 디렉토리 구조
- `backend/.eslintrc.json`
- `backend/.prettierrc`

#### 참고 사항

- `.env.example`에는 실제 값 대신 설명 작성
- nodemon 설정: `"dev": "nodemon src/server.js"`

---

### [TASK-003] 프론트엔드 프로젝트 초기 설정

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 프론트엔드
**의존성**: TASK-001

#### 작업 내용

- Vite로 React 프로젝트 생성
- Tailwind CSS 설정
- 필수 의존성 설치
- 디렉토리 구조 생성
- ESLint, Prettier 설정

#### 완료 조건

- [ ] Vite React 프로젝트 생성 (`npm create vite@latest frontend -- --template react`)
- [ ] Tailwind CSS 설치 및 설정
  - `tailwindcss`, `postcss`, `autoprefixer` 설치
  - `tailwind.config.js` 생성
- [ ] 필수 패키지 설치 완료
  - react-router-dom
  - zustand
  - axios
  - react-hook-form
  - zod
  - date-fns
  - lucide-react
- [ ] `src/` 폴더 구조 생성
  - `components/`, `pages/`, `stores/`, `services/`, `hooks/`, `utils/`, `constants/`
- [ ] `.env.example` 파일 생성
- [ ] ESLint, Prettier 설정
- [ ] Vite 설정 파일 확인 (`vite.config.js`)

#### 산출물

- `frontend/package.json`
- `frontend/tailwind.config.js`
- `frontend/src/` 디렉토리 구조
- `frontend/.env.example`

#### 참고 사항

- Tailwind CSS 설정 후 `src/index.css`에 directives 추가
- Vite 프록시 설정 (개발 환경에서 백엔드 API 호출용)

---

### [TASK-004] 개발 도구 설정

**우선순위**: P1
**예상 시간**: 30분
**담당 영역**: 전체
**의존성**: TASK-002, TASK-003

#### 작업 내용

- VS Code 설정 파일 생성 (워크스페이스 설정)
- 코드 스타일 가이드 설정
- Git pre-commit hook 설정 (선택)

#### 완료 조건

- [ ] `.vscode/settings.json` 생성 (ESLint, Prettier 자동 포맷팅)
- [ ] `.vscode/extensions.json` 생성 (권장 확장 프로그램)
- [ ] 코드 스타일 가이드 문서화
- [ ] (선택) Husky + lint-staged 설정

#### 산출물

- `.vscode/settings.json`
- `.vscode/extensions.json`

#### 참고 사항

- VS Code 설정에서 `editor.formatOnSave: true` 권장
- Git hook은 시간 여유 시 설정

---

## Phase 2: 데이터베이스

### 목표

PostgreSQL 데이터베이스 스키마 설계 및 Prisma ORM 설정

---

### [TASK-005] Supabase 프로젝트 생성 및 연결

**우선순위**: P0
**예상 시간**: 30분
**담당 영역**: 데이터베이스
**의존성**: TASK-002

#### 작업 내용

- Supabase 계정 생성 및 프로젝트 생성
- PostgreSQL 데이터베이스 연결 정보 확인
- 백엔드 `.env` 파일에 `DATABASE_URL` 설정

#### 완료 조건

- [ ] Supabase 프로젝트 생성 완료
- [ ] PostgreSQL Connection String 확보
- [ ] `backend/.env` 파일에 `DATABASE_URL` 추가
- [ ] Supabase 대시보드 접속 확인

#### 산출물

- `backend/.env` (DATABASE_URL 포함)

#### 참고 사항

- Connection String 형식: `postgresql://[user]:[password]@[host]:[port]/[database]`
- Supabase는 자동 백업 제공 (설정 확인)

---

### [TASK-006] Prisma 설치 및 스키마 작성

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 데이터베이스
**의존성**: TASK-005

#### 작업 내용

- Prisma 설치 및 초기화
- Prisma 스키마 작성 (User, Todo, Holiday 모델)
- Enum 타입 정의 (Role, TodoStatus)
- 인덱스 설정

#### 완료 조건

- [ ] Prisma 설치 (`npm install prisma @prisma/client --save`)
- [ ] Prisma 초기화 (`npx prisma init`)
- [ ] `prisma/schema.prisma` 파일 작성 완료
  - User 모델 (userId, email, password, username, role, createdAt, updatedAt)
  - Todo 모델 (todoId, userId, title, content, startDate, dueDate, status, isCompleted, createdAt, updatedAt, deletedAt)
  - Holiday 모델 (holidayId, title, date, description, isRecurring, createdAt, updatedAt)
  - Role enum (USER, ADMIN)
  - TodoStatus enum (ACTIVE, COMPLETED, DELETED)
- [ ] 인덱스 설정 완료
  - User: email (unique), role
  - Todo: userId+status, dueDate, deletedAt
  - Holiday: date
- [ ] 관계 설정 (User 1:N Todo, onDelete: Cascade)

#### 산출물

- `backend/prisma/schema.prisma`

#### 참고 사항

- PRD 8.3 섹션 Prisma 스키마 참조
- UUID 사용 (`@default(uuid())`)
- Timestamp 자동 관리 (`@default(now())`, `@updatedAt`)

---

### [TASK-007] Prisma 마이그레이션 실행

**우선순위**: P0
**예상 시간**: 30분
**담당 영역**: 데이터베이스
**의존성**: TASK-006

#### 작업 내용

- Prisma 마이그레이션 생성 및 실행
- Prisma Client 생성
- 데이터베이스 연결 테스트

#### 완료 조건

- [ ] Prisma 마이그레이션 생성 (`npx prisma migrate dev --name init`)
- [ ] 마이그레이션 성공적으로 적용 확인
- [ ] Prisma Client 생성 확인 (`node_modules/@prisma/client`)
- [ ] Prisma Studio로 테이블 확인 (`npx prisma studio`)
- [ ] 데이터베이스에 User, Todo, Holiday 테이블 생성 확인

#### 산출물

- `backend/prisma/migrations/` (마이그레이션 파일)
- Prisma Client

#### 참고 사항

- 마이그레이션 실패 시 `prisma migrate reset` 후 재시도
- Supabase 대시보드에서 테이블 구조 확인 가능

---

### [TASK-008] 시드 데이터 작성 (선택)

**우선순위**: P1
**예상 시간**: 30분
**담당 영역**: 데이터베이스
**의존성**: TASK-007

#### 작업 내용

- 테스트용 사용자 데이터 생성
- 샘플 할일 데이터 생성
- 한국 국경일 데이터 생성

#### 완료 조건

- [ ] `prisma/seed.js` 파일 생성
- [ ] 관리자 계정 생성 (email: admin@example.com, role: ADMIN)
- [ ] 일반 사용자 계정 생성 (email: user@example.com, role: USER)
- [ ] 샘플 할일 데이터 3-5개 생성
- [ ] 2025년 한국 국경일 데이터 추가 (신정, 설날, 삼일절, 어린이날, 광복절, 추석, 개천절, 한글날, 성탄절)
- [ ] `package.json`에 `"prisma": { "seed": "node prisma/seed.js" }` 추가
- [ ] 시드 실행 (`npx prisma db seed`)

#### 산출물

- `backend/prisma/seed.js`

#### 참고 사항

- 비밀번호는 bcrypt로 해싱 필요
- 시드 데이터는 개발 환경에서만 사용

---

## Phase 3: 백엔드

### 목표

REST API 구현 및 비즈니스 로직 완성

---

### [TASK-009] Express 앱 기본 설정

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 백엔드
**의존성**: TASK-002, TASK-007

#### 작업 내용

- Express 앱 초기화
- 미들웨어 설정 (CORS, Helmet, JSON parser)
- 에러 핸들러 미들웨어 작성
- 서버 시작 코드 작성

#### 완료 조건

- [ ] `src/app.js` 작성 완료
  - Express 앱 인스턴스 생성
  - CORS 미들웨어 설정 (허용 Origin 환경 변수로 관리)
  - Helmet 미들웨어 적용
  - JSON body parser 설정
  - URL-encoded parser 설정
- [ ] `src/server.js` 작성 완료
  - 환경 변수에서 PORT 읽기 (기본값: 3000)
  - 서버 시작 로그
- [ ] `src/middlewares/errorMiddleware.js` 작성
  - 전역 에러 핸들러
  - 에러 로그 출력
  - 클라이언트에 JSON 형식 에러 응답
- [ ] 서버 실행 확인 (`npm run dev`)
- [ ] `http://localhost:3000` 접속 확인

#### 산출물

- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/middlewares/errorMiddleware.js`

#### 참고 사항

- CORS 설정: 프론트엔드 URL 허용 (개발: `http://localhost:5173`)
- Helmet은 기본 설정 사용

---

### [TASK-010] 유틸리티 함수 작성

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 백엔드
**의존성**: TASK-009

#### 작업 내용

- JWT 헬퍼 함수 작성 (토큰 생성, 검증)
- 비밀번호 헬퍼 함수 작성 (해싱, 비교)
- 응답 포맷 헬퍼 작성
- 환경 변수 설정 파일 작성

#### 완료 조건

- [ ] `src/utils/jwtHelper.js` 작성
  - `generateAccessToken(userId, email, role)` - Access Token 생성 (15분 만료)
  - `generateRefreshToken(userId)` - Refresh Token 생성 (7일 만료)
  - `verifyToken(token)` - 토큰 검증
- [ ] `src/utils/passwordHelper.js` 작성
  - `hashPassword(password)` - bcrypt 해싱 (saltRounds: 10)
  - `comparePassword(password, hash)` - 비밀번호 비교
- [ ] `src/utils/responseHelper.js` 작성
  - `successResponse(data, message)` - 성공 응답 포맷
  - `errorResponse(code, message)` - 에러 응답 포맷
- [ ] `src/config/jwt.js` 작성
  - JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY 환경 변수 관리
- [ ] `.env`에 `JWT_SECRET` 추가 (최소 32자 랜덤 문자열)

#### 산출물

- `backend/src/utils/jwtHelper.js`
- `backend/src/utils/passwordHelper.js`
- `backend/src/utils/responseHelper.js`
- `backend/src/config/jwt.js`

#### 참고 사항

- JWT_SECRET은 절대 Git에 커밋하지 않음
- bcrypt saltRounds는 10 사용 (보안과 성능 균형)

---

### [TASK-011] 인증 미들웨어 작성

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 백엔드
**의존성**: TASK-010

#### 작업 내용

- JWT 인증 미들웨어 작성
- 관리자 권한 확인 미들웨어 작성
- Request 객체에 사용자 정보 추가

#### 완료 조건

- [ ] `src/middlewares/authMiddleware.js` 작성
  - `authenticate` 미들웨어: Authorization 헤더에서 JWT 토큰 추출 및 검증
  - 토큰 검증 성공 시 `req.user`에 사용자 정보 추가
  - 토큰 없음/만료/유효하지 않음 시 401 응답
- [ ] `src/middlewares/adminMiddleware.js` 작성
  - `requireAdmin` 미들웨어: `req.user.role`이 ADMIN인지 확인
  - 권한 없으면 403 응답
- [ ] `src/middlewares/validationMiddleware.js` 작성
  - `validateRequest` 미들웨어: express-validator 결과 확인
  - 검증 실패 시 400 응답

#### 산출물

- `backend/src/middlewares/authMiddleware.js`
- `backend/src/middlewares/adminMiddleware.js`
- `backend/src/middlewares/validationMiddleware.js`

#### 참고 사항

- Authorization 헤더 형식: `Bearer {token}`
- 토큰 검증 실패 시 명확한 에러 메시지 반환

---

### [TASK-012] 인증 API 구현 (회원가입, 로그인)

**우선순위**: P0
**예상 시간**: 2시간
**담당 영역**: 백엔드
**의존성**: TASK-011

#### 작업 내용

- 회원가입 API 구현
- 로그인 API 구현
- 토큰 갱신 API 구현
- 로그아웃 API 구현 (선택)

#### 완료 조건

- [ ] `src/services/authService.js` 작성
  - `register(email, password, username)` - 회원가입 로직
    - 이메일 중복 확인
    - 비밀번호 해싱
    - 사용자 생성
  - `login(email, password)` - 로그인 로직
    - 사용자 조회
    - 비밀번호 검증
    - Access Token, Refresh Token 생성
  - `refreshToken(refreshToken)` - 토큰 갱신 로직
    - Refresh Token 검증
    - 새로운 Access Token 발급
- [ ] `src/controllers/authController.js` 작성
  - `register` - POST /api/auth/register
  - `login` - POST /api/auth/login
  - `refresh` - POST /api/auth/refresh
  - `logout` - POST /api/auth/logout (선택)
- [ ] `src/routes/authRoutes.js` 작성
  - 라우트 정의 및 검증 규칙 추가 (express-validator)
- [ ] `src/app.js`에 authRoutes 연결 (`app.use('/api/auth', authRoutes)`)
- [ ] Postman으로 API 테스트 완료
  - 회원가입 성공 (201 Created)
  - 이메일 중복 에러 (409 Conflict)
  - 로그인 성공 (200 OK, tokens 반환)
  - 잘못된 비밀번호 (401 Unauthorized)
  - 토큰 갱신 성공 (200 OK)

#### 산출물

- `backend/src/services/authService.js`
- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

#### 참고 사항

- 비밀번호는 절대 응답에 포함하지 않음
- express-validator로 이메일 형식, 비밀번호 길이 검증

---

### [TASK-013] 할일 CRUD API 구현

**우선순위**: P0
**예상 시간**: 3시간
**담당 영역**: 백엔드
**의존성**: TASK-011, TASK-012

#### 작업 내용

- 할일 생성, 조회, 수정, 삭제 API 구현
- 할일 완료 처리 API 구현
- 사용자별 권한 검증 로직 추가

#### 완료 조건

- [ ] `src/repositories/todoRepository.js` 작성
  - `findByUserId(userId, status)` - 사용자별 할일 조회
  - `findById(todoId)` - 할일 상세 조회
  - `create(userId, data)` - 할일 생성
  - `update(todoId, data)` - 할일 수정
  - `softDelete(todoId)` - 소프트 삭제 (status='DELETED', deletedAt 설정)
  - `restore(todoId)` - 복원 (status='ACTIVE', deletedAt=null)
  - `hardDelete(todoId)` - 영구 삭제
  - `updateStatus(todoId, status, isCompleted)` - 상태 변경
- [ ] `src/services/todoService.js` 작성
  - 비즈니스 로직 (권한 검증, 날짜 유효성 검증)
  - dueDate >= startDate 검증
  - 사용자 소유권 확인 (userId 일치 여부)
- [ ] `src/controllers/todoController.js` 작성
  - `getTodos` - GET /api/todos (쿼리: status, search, sortBy, order)
  - `getTodoById` - GET /api/todos/:id
  - `createTodo` - POST /api/todos
  - `updateTodo` - PUT /api/todos/:id
  - `deleteTodo` - DELETE /api/todos/:id (소프트 삭제)
  - `completeTodo` - PATCH /api/todos/:id/complete
  - `restoreTodo` - PATCH /api/todos/:id/restore
- [ ] `src/routes/todoRoutes.js` 작성
  - 모든 라우트에 `authenticate` 미들웨어 적용
  - 검증 규칙 추가 (title 필수, dueDate 형식 등)
- [ ] `src/app.js`에 todoRoutes 연결
- [ ] Postman으로 API 테스트 완료
  - 할일 생성 성공
  - 할일 목록 조회 (필터링, 정렬 테스트)
  - 할일 수정 성공
  - 할일 완료 처리
  - 할일 삭제 (휴지통 이동)
  - 할일 복원
  - 권한 없는 사용자 접근 차단 (403)

#### 산출물

- `backend/src/repositories/todoRepository.js`
- `backend/src/services/todoService.js`
- `backend/src/controllers/todoController.js`
- `backend/src/routes/todoRoutes.js`

#### 참고 사항

- 소프트 삭제: 데이터 실제 삭제하지 않고 status만 변경
- 사용자는 타인의 할일 접근 불가 (권한 검증 필수)

---

### [TASK-014] 휴지통 API 구현

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 백엔드
**의존성**: TASK-013

#### 작업 내용

- 휴지통 조회 API 구현
- 영구 삭제 API 구현

#### 완료 조건

- [ ] `src/controllers/trashController.js` 작성
  - `getTrash` - GET /api/trash (status='DELETED'인 할일 조회)
  - `permanentDelete` - DELETE /api/trash/:id (DB에서 완전히 제거)
- [ ] `src/routes/trashRoutes.js` 작성
  - `authenticate` 미들웨어 적용
- [ ] `src/app.js`에 trashRoutes 연결
- [ ] Postman으로 API 테스트 완료
  - 휴지통 조회 성공
  - 영구 삭제 성공
  - 활성 상태 할일 영구 삭제 시 에러 (400)

#### 산출물

- `backend/src/controllers/trashController.js`
- `backend/src/routes/trashRoutes.js`

#### 참고 사항

- 영구 삭제는 status='DELETED'인 할일만 가능
- 휴지통은 사용자별로 분리 (본인 할일만 조회)

---

### [TASK-015] 국경일 API 구현

**우선순위**: P0
**예상 시간**: 1.5시간
**담당 영역**: 백엔드
**의존성**: TASK-011

#### 작업 내용

- 국경일 조회 API 구현
- 국경일 추가/수정 API 구현 (관리자 전용)

#### 완료 조건

- [ ] `src/repositories/holidayRepository.js` 작성
  - `findByYear(year)` - 연도별 국경일 조회
  - `findByMonth(year, month)` - 월별 국경일 조회
  - `create(data)` - 국경일 추가
  - `update(holidayId, data)` - 국경일 수정
- [ ] `src/services/holidayService.js` 작성
  - 비즈니스 로직
- [ ] `src/controllers/holidayController.js` 작성
  - `getHolidays` - GET /api/holidays (쿼리: year, month)
  - `createHoliday` - POST /api/holidays (관리자 전용)
  - `updateHoliday` - PUT /api/holidays/:id (관리자 전용)
- [ ] `src/routes/holidayRoutes.js` 작성
  - GET은 `authenticate`만 적용
  - POST, PUT은 `authenticate` + `requireAdmin` 적용
- [ ] `src/app.js`에 holidayRoutes 연결
- [ ] Postman으로 API 테스트 완료
  - 국경일 조회 성공 (인증된 사용자)
  - 국경일 추가 성공 (관리자)
  - 일반 사용자 추가 시도 시 403

#### 산출물

- `backend/src/repositories/holidayRepository.js`
- `backend/src/services/holidayService.js`
- `backend/src/controllers/holidayController.js`
- `backend/src/routes/holidayRoutes.js`

#### 참고 사항

- 국경일 삭제 기능은 MVP에서 제외
- isRecurring=true는 매년 반복되는 국경일

---

### [TASK-016] 사용자 프로필 API 구현

**우선순위**: P1
**예상 시간**: 1시간
**담당 영역**: 백엔드
**의존성**: TASK-011

#### 작업 내용

- 현재 사용자 프로필 조회 API 구현
- 프로필 수정 API 구현 (사용자 이름, 비밀번호 변경)

#### 완료 조건

- [ ] `src/services/userService.js` 작성
  - `getProfile(userId)` - 사용자 정보 조회 (비밀번호 제외)
  - `updateProfile(userId, data)` - 사용자 정보 수정
- [ ] `src/controllers/userController.js` 작성
  - `getMe` - GET /api/users/me
  - `updateMe` - PATCH /api/users/me
- [ ] `src/routes/userRoutes.js` 작성
  - `authenticate` 미들웨어 적용
- [ ] `src/app.js`에 userRoutes 연결
- [ ] Postman으로 API 테스트 완료
  - 프로필 조회 성공
  - 사용자 이름 수정 성공
  - 비밀번호 변경 성공 (해싱 확인)

#### 산출물

- `backend/src/services/userService.js`
- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`

#### 참고 사항

- 비밀번호 변경 시 bcrypt 해싱 필수
- 응답에 비밀번호 포함하지 않음

---

### [TASK-017] Rate Limiting 미들웨어 추가

**우선순위**: P1
**예상 시간**: 30분
**담당 영역**: 백엔드
**의존성**: TASK-009

#### 작업 내용

- express-rate-limit 설정
- 인증 API에 엄격한 제한 적용

#### 완료 조건

- [ ] `src/middlewares/rateLimitMiddleware.js` 작성
  - 일반 API: 100 req/min per IP
  - 인증 API: 10 req/min per IP
- [ ] `src/routes/authRoutes.js`에 Rate Limiter 적용
- [ ] 제한 초과 시 429 응답 확인

#### 산출물

- `backend/src/middlewares/rateLimitMiddleware.js`

#### 참고 사항

- 개발 환경에서는 제한 완화 가능
- 프로덕션에서는 엄격히 적용

---

### [TASK-018] 백엔드 통합 테스트 (선택)

**우선순위**: P2
**예상 시간**: 2시간
**담당 영역**: 백엔드
**의존성**: TASK-012, TASK-013, TASK-015

#### 작업 내용

- Jest 설정
- 주요 API 엔드포인트 통합 테스트 작성

#### 완료 조건

- [ ] Jest, supertest 설치
- [ ] `tests/integration/` 폴더 생성
- [ ] 인증 API 테스트 작성 (`authApi.test.js`)
- [ ] 할일 CRUD API 테스트 작성 (`todoApi.test.js`)
- [ ] 테스트 실행 성공 (`npm test`)

#### 산출물

- `backend/tests/integration/authApi.test.js`
- `backend/tests/integration/todoApi.test.js`

#### 참고 사항

- 시간 부족 시 생략 가능
- 테스트 DB 별도 설정 필요

---

## Phase 4: 프론트엔드

### 목표

React 기반 사용자 인터페이스 구현 및 API 연동

---

### [TASK-019] Axios 인스턴스 및 인터셉터 설정

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 프론트엔드
**의존성**: TASK-003

#### 작업 내용

- Axios 인스턴스 생성
- Request 인터셉터 (JWT 토큰 자동 첨부)
- Response 인터셉터 (토큰 갱신, 에러 처리)

#### 완료 조건

- [ ] `src/services/api.js` 작성
  - Axios 인스턴스 생성 (`axios.create`)
  - baseURL 설정 (환경 변수: `VITE_API_URL`)
  - Request 인터셉터: Authorization 헤더에 Access Token 자동 추가
  - Response 인터셉터:
    - 401 에러 감지 시 토큰 갱신 시도
    - 토큰 갱신 성공 시 원래 요청 재시도
    - 토큰 갱신 실패 시 로그아웃 처리
- [ ] `.env`에 `VITE_API_URL` 추가 (개발: `http://localhost:3000/api`)
- [ ] LocalStorage에서 토큰 읽기/쓰기 함수 작성 (`src/utils/tokenManager.js`)

#### 산출물

- `frontend/src/services/api.js`
- `frontend/src/utils/tokenManager.js`

#### 참고 사항

- Access Token은 LocalStorage에 저장
- Refresh Token은 HttpOnly Cookie 또는 LocalStorage (MVP에서는 LocalStorage)

---

### [TASK-020] 인증 상태 관리 (Zustand)

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 프론트엔드
**의존성**: TASK-019

#### 작업 내용

- Zustand authStore 생성
- 로그인, 로그아웃, 토큰 갱신 액션 작성
- 사용자 정보 상태 관리

#### 완료 조건

- [ ] `src/stores/authStore.js` 작성
  - 상태: `user`, `isAuthenticated`, `accessToken`, `refreshToken`
  - 액션:
    - `login(email, password)` - 로그인 API 호출 후 토큰 저장
    - `logout()` - 토큰 삭제 및 상태 초기화
    - `setTokens(accessToken, refreshToken)` - 토큰 저장
    - `setUser(user)` - 사용자 정보 저장
    - `checkAuth()` - 토큰 존재 여부 확인 (앱 시작 시)
- [ ] LocalStorage에서 토큰 자동 로드 (persist)
- [ ] 로그인 상태 확인 훅 작성 (`src/hooks/useAuth.js`)

#### 산출물

- `frontend/src/stores/authStore.js`
- `frontend/src/hooks/useAuth.js`

#### 참고 사항

- Zustand persist 미들웨어 사용 권장
- 로그아웃 시 LocalStorage 완전히 정리

---

### [TASK-021] 라우팅 설정

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 프론트엔드
**의존성**: TASK-020

#### 작업 내용

- React Router 설정
- Protected Route 컴포넌트 작성
- 라우트 정의

#### 완료 조건

- [ ] `src/routes.jsx` 작성
  - `/login` - 로그인 페이지
  - `/register` - 회원가입 페이지
  - `/` - 할일 목록 (Protected)
  - `/trash` - 휴지통 (Protected)
  - `/holidays` - 국경일 (Protected)
  - `/profile` - 프로필 (Protected, P1)
- [ ] `src/components/common/ProtectedRoute.jsx` 작성
  - 인증되지 않은 사용자는 `/login`으로 리다이렉트
  - `useAuth` 훅으로 로그인 상태 확인
- [ ] `src/App.jsx`에 라우터 설정
- [ ] 라우트 이동 테스트 완료

#### 산출물

- `frontend/src/routes.jsx`
- `frontend/src/components/common/ProtectedRoute.jsx`
- `frontend/src/App.jsx`

#### 참고 사항

- BrowserRouter 사용
- 404 페이지 추가 (선택)

---

### [TASK-022] 공통 컴포넌트 구현

**우선순위**: P0
**예상 시간**: 2시간
**담당 영역**: 프론트엔드
**의존성**: TASK-003

#### 작업 내용

- Button, Input, Modal 등 재사용 가능한 컴포넌트 작성
- Tailwind CSS로 스타일링

#### 완료 조건

- [ ] `src/components/common/Button.jsx` 작성
  - Props: variant (primary, secondary), size, onClick, disabled, children
  - Tailwind 스타일 적용 (호버, 포커스 상태)
- [ ] `src/components/common/Input.jsx` 작성
  - Props: type, placeholder, value, onChange, error
  - 에러 상태 표시
- [ ] `src/components/common/Modal.jsx` 작성
  - Props: isOpen, onClose, title, children
  - ESC 키로 닫기
  - 배경 클릭 시 닫기
- [ ] `src/components/common/Loading.jsx` 작성
  - 스피너 애니메이션
- [ ] Storybook 또는 간단한 테스트 페이지로 확인 (선택)

#### 산출물

- `frontend/src/components/common/Button.jsx`
- `frontend/src/components/common/Input.jsx`
- `frontend/src/components/common/Modal.jsx`
- `frontend/src/components/common/Loading.jsx`

#### 참고 사항

- 스타일 가이드 참조 (docs/4-style-guide.md)
- 접근성 고려 (aria-label, role)

---

### [TASK-023] 레이아웃 컴포넌트 구현

**우선순위**: P0
**예상 시간**: 1.5시간
**담당 영역**: 프론트엔드
**의존성**: TASK-022

#### 작업 내용

- Header, MainLayout 컴포넌트 작성
- 로그아웃 버튼 추가

#### 완료 조건

- [ ] `src/components/layout/Header.jsx` 작성
  - 로고 또는 프로젝트 제목
  - 사용자 이름 표시
  - 로그아웃 버튼
  - 네비게이션 링크 (할일 목록, 휴지통, 국경일)
- [ ] `src/components/layout/MainLayout.jsx` 작성
  - Header 포함
  - children 렌더링 (페이지 컨텐츠)
  - 반응형 레이아웃 (Tailwind)
- [ ] 헤더 클릭 시 라우트 이동 확인

#### 산출물

- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/layout/MainLayout.jsx`

#### 참고 사항

- 모바일 반응형 고려 (햄버거 메뉴는 선택)
- 헤더는 모든 페이지에서 공통 사용

---

### [TASK-024] 로그인 및 회원가입 페이지 구현

**우선순위**: P0
**예상 시간**: 2시간
**담당 영역**: 프론트엔드
**의존성**: TASK-020, TASK-022

#### 작업 내용

- 로그인 페이지 구현
- 회원가입 페이지 구현
- React Hook Form + Zod 검증

#### 완료 조건

- [ ] `src/pages/LoginPage.jsx` 작성
  - 이메일, 비밀번호 입력 폼
  - React Hook Form 사용
  - Zod 스키마 검증
  - 로그인 버튼 클릭 시 authStore.login() 호출
  - 로그인 성공 시 `/`로 리다이렉트
  - 에러 메시지 표시
- [ ] `src/pages/RegisterPage.jsx` 작성
  - 이메일, 비밀번호, 사용자 이름 입력 폼
  - React Hook Form + Zod 검증
  - 회원가입 API 호출 (`src/services/authService.js`)
  - 성공 시 `/login`으로 리다이렉트
- [ ] `src/services/authService.js` 작성
  - `register(email, password, username)` - POST /api/auth/register
  - `login(email, password)` - POST /api/auth/login
- [ ] 로그인 및 회원가입 플로우 테스트

#### 산출물

- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/services/authService.js`

#### 참고 사항

- Zod 스키마: 이메일 형식, 비밀번호 최소 6자
- 로딩 상태 표시 (Button disabled)

---

### [TASK-025] 할일 상태 관리 (Zustand)

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 프론트엔드
**의존성**: TASK-019

#### 작업 내용

- Zustand todoStore 생성
- 할일 CRUD 액션 작성

#### 완료 조건

- [ ] `src/stores/todoStore.js` 작성
  - 상태: `todos`, `filter`, `sortBy`, `loading`, `error`
  - 액션:
    - `fetchTodos(status)` - 할일 목록 조회
    - `createTodo(data)` - 할일 생성
    - `updateTodo(todoId, data)` - 할일 수정
    - `deleteTodo(todoId)` - 할일 삭제 (휴지통 이동)
    - `completeTodo(todoId)` - 할일 완료
    - `restoreTodo(todoId)` - 할일 복원
    - `setFilter(filter)` - 필터 설정
    - `setSortBy(sortBy)` - 정렬 설정
- [ ] `src/services/todoService.js` 작성
  - API 호출 함수 작성

#### 산출물

- `frontend/src/stores/todoStore.js`
- `frontend/src/services/todoService.js`

#### 참고 사항

- 에러 처리 로직 포함
- 로딩 상태 관리 (loading: true/false)

---

### [TASK-026] 할일 목록 페이지 구현

**우선순위**: P0
**예상 시간**: 3시간
**담당 영역**: 프론트엔드
**의존성**: TASK-025, TASK-023

#### 작업 내용

- 할일 목록 페이지 구현
- 할일 카드 컴포넌트 작성
- 필터 및 정렬 기능 추가

#### 완료 조건

- [ ] `src/pages/TodoListPage.jsx` 작성
  - MainLayout 사용
  - 할일 추가 버튼
  - 할일 목록 렌더링
  - 필터 드롭다운 (전체, 진행 중, 완료)
  - 정렬 드롭다운 (날짜순, 생성일순)
  - useEffect로 페이지 로드 시 할일 조회
- [ ] `src/components/todo/TodoCard.jsx` 작성
  - 할일 제목, 내용, 시작일, 만료일 표시
  - 완료 체크박스
  - 수정 버튼 (모달 열기)
  - 삭제 버튼
  - 만료일 지난 할일은 빨간색 표시
- [ ] `src/components/todo/TodoList.jsx` 작성
  - TodoCard 배열 렌더링
  - 빈 상태 처리 (할일 없음)
- [ ] 할일 완료 처리 테스트
- [ ] 할일 삭제 테스트 (휴지통 이동)

#### 산출물

- `frontend/src/pages/TodoListPage.jsx`
- `frontend/src/components/todo/TodoCard.jsx`
- `frontend/src/components/todo/TodoList.jsx`

#### 참고 사항

- 로딩 스피너 표시
- 에러 메시지 표시
- 반응형 그리드 레이아웃 (Tailwind)

---

### [TASK-027] 할일 추가/수정 모달 구현

**우선순위**: P0
**예상 시간**: 2시간
**담당 영역**: 프론트엔드
**의존성**: TASK-022, TASK-025

#### 작업 내용

- 할일 추가/수정 모달 구현
- React Hook Form + Zod 검증

#### 완료 조건

- [ ] `src/components/todo/TodoFormModal.jsx` 작성
  - Modal 컴포넌트 사용
  - 제목, 내용, 시작일, 만료일 입력 폼
  - React Hook Form 사용
  - Zod 스키마 검증 (제목 필수, dueDate >= startDate)
  - 저장 버튼 클릭 시 createTodo() 또는 updateTodo() 호출
  - 성공 시 모달 닫기 및 목록 갱신
- [ ] TodoListPage에서 모달 상태 관리
  - 추가 버튼 클릭 시 모달 열기
  - TodoCard 수정 버튼 클릭 시 모달 열기 (기존 데이터 전달)
- [ ] 할일 추가 및 수정 플로우 테스트

#### 산출물

- `frontend/src/components/todo/TodoFormModal.jsx`

#### 참고 사항

- 날짜 입력은 `<input type="date">`
- 만료일이 시작일보다 이전이면 에러 표시

---

### [TASK-028] 휴지통 페이지 구현

**우선순위**: P0
**예상 시간**: 1.5시간
**담당 영역**: 프론트엔드
**의존성**: TASK-025

#### 작업 내용

- 휴지통 페이지 구현
- 복원 및 영구 삭제 버튼 추가

#### 완료 조건

- [ ] `src/pages/TrashPage.jsx` 작성
  - MainLayout 사용
  - 삭제된 할일 목록 렌더링
  - 복원 버튼 (restoreTodo 호출)
  - 영구 삭제 버튼 (확인 다이얼로그 후 hardDelete API 호출)
- [ ] `src/services/trashService.js` 작성
  - `getTrash()` - GET /api/trash
  - `permanentDelete(todoId)` - DELETE /api/trash/:id
- [ ] todoStore에 `hardDelete` 액션 추가
- [ ] 복원 및 영구 삭제 플로우 테스트

#### 산출물

- `frontend/src/pages/TrashPage.jsx`
- `frontend/src/services/trashService.js`

#### 참고 사항

- 영구 삭제는 확인 다이얼로그 필수
- 빈 휴지통 상태 표시

---

### [TASK-029] 국경일 페이지 구현

**우선순위**: P0
**예상 시간**: 1.5시간
**담당 영역**: 프론트엔드
**의존성**: TASK-023

#### 작업 내용

- 국경일 목록 페이지 구현
- 연도/월별 필터 추가

#### 완료 조건

- [ ] `src/stores/holidayStore.js` 작성
  - 상태: `holidays`, `year`, `month`, `loading`
  - 액션: `fetchHolidays(year, month)`
- [ ] `src/services/holidayService.js` 작성
  - `getHolidays(year, month)` - GET /api/holidays
- [ ] `src/pages/HolidayPage.jsx` 작성
  - MainLayout 사용
  - 연도/월 드롭다운 필터
  - 국경일 목록 렌더링
- [ ] `src/components/holiday/HolidayCard.jsx` 작성
  - 국경일 이름, 날짜, 설명 표시
- [ ] 국경일 조회 테스트 (연도/월 필터)

#### 산출물

- `frontend/src/stores/holidayStore.js`
- `frontend/src/services/holidayService.js`
- `frontend/src/pages/HolidayPage.jsx`
- `frontend/src/components/holiday/HolidayCard.jsx`

#### 참고 사항

- 현재 연도 기본값으로 설정
- 국경일은 날짜순 정렬

---

### [TASK-030] 프로필 페이지 구현 (선택)

**우선순위**: P1
**예상 시간**: 1.5시간
**담당 영역**: 프론트엔드
**의존성**: TASK-020

#### 작업 내용

- 프로필 조회 및 수정 페이지 구현

#### 완료 조건

- [ ] `src/pages/ProfilePage.jsx` 작성
  - MainLayout 사용
  - 사용자 이름 표시 및 수정 폼
  - 비밀번호 변경 폼
  - React Hook Form + Zod 검증
- [ ] `src/services/userService.js` 작성
  - `getMe()` - GET /api/users/me
  - `updateMe(data)` - PATCH /api/users/me
- [ ] 프로필 조회 및 수정 플로우 테스트

#### 산출물

- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/services/userService.js`

#### 참고 사항

- 비밀번호 변경 시 기존 비밀번호 확인 (선택)
- 시간 부족 시 생략 가능

---

### [TASK-031] 반응형 디자인 적용

**우선순위**: P0
**예상 시간**: 2시간
**담당 영역**: 프론트엔드
**의존성**: TASK-026, TASK-028, TASK-029

#### 작업 내용

- 모바일 및 태블릿 반응형 스타일 적용
- Tailwind 브레이크포인트 사용

#### 완료 조건

- [ ] 모바일 (< 768px) 레이아웃 최적화
  - 헤더 네비게이션 간소화 (햄버거 메뉴 선택)
  - 할일 카드 1열 표시
  - 버튼 크기 터치 친화적으로 (최소 44x44px)
- [ ] 태블릿 (768px ~ 1024px) 레이아웃 최적화
  - 할일 카드 2열 표시
- [ ] 데스크톱 (1024px+) 레이아웃
  - 할일 카드 3-4열 표시
- [ ] Chrome DevTools로 반응형 테스트 완료
- [ ] 실제 모바일 디바이스에서 테스트 (선택)

#### 산출물

- 반응형 스타일이 적용된 모든 컴포넌트

#### 참고 사항

- Tailwind의 `sm:`, `md:`, `lg:` 브레이크포인트 활용
- 모바일 먼저 작성 후 데스크톱 확장 (Mobile First)

---

### [TASK-032] 다크모드 구현 (선택)

**우선순위**: P1
**예상 시간**: 2시간
**담당 영역**: 프론트엔드
**의존성**: TASK-031

#### 작업 내용

- Tailwind CSS 다크모드 설정
- 테마 전환 버튼 추가

#### 완료 조건

- [ ] `tailwind.config.js`에 `darkMode: 'class'` 설정
- [ ] `src/stores/uiStore.js` 작성
  - 상태: `theme` (light, dark, system)
  - 액션: `toggleTheme()`, `setTheme(theme)`
- [ ] LocalStorage에 테마 설정 저장
- [ ] 헤더에 테마 전환 버튼 추가
- [ ] 모든 컴포넌트에 `dark:` 스타일 추가
- [ ] 시스템 설정 감지 (`prefers-color-scheme`)

#### 산출물

- `frontend/src/stores/uiStore.js`
- 다크모드 스타일이 적용된 모든 컴포넌트

#### 참고 사항

- 시간 부족 시 생략 가능
- 다크모드 색상은 스타일 가이드 참조

---

### [TASK-033] 에러 처리 및 로딩 상태 개선

**우선순위**: P1
**예상 시간**: 1시간
**담당 영역**: 프론트엔드
**의존성**: TASK-026, TASK-028, TASK-029

#### 작업 내용

- 전역 에러 핸들러 추가
- 로딩 스피너 개선
- Toast 알림 추가 (선택)

#### 완료 조건

- [ ] 모든 API 호출에 try-catch 추가
- [ ] 에러 메시지 사용자 친화적으로 표시
- [ ] 로딩 상태 동안 스피너 표시
- [ ] (선택) Toast 알림 라이브러리 추가 (react-hot-toast)
- [ ] 네트워크 에러 처리 (오프라인 상태)

#### 산출물

- 에러 처리 로직이 추가된 모든 페이지 및 컴포넌트

#### 참고 사항

- 사용자에게 기술적 에러 메시지 노출 금지
- Toast는 시간 여유 시 추가

---

## Phase 5: 통합 및 배포

### 목표

프론트엔드-백엔드 통합 테스트 및 프로덕션 배포

---

### [TASK-034] 통합 테스트 (E2E)

**우선순위**: P0
**예상 시간**: 2시간
**담당 영역**: 전체
**의존성**: TASK-026, TASK-028, TASK-029

#### 작업 내용

- 주요 사용자 플로우 수동 테스트
- 버그 수정

#### 완료 조건

- [ ] 회원가입 → 로그인 → 할일 생성 플로우 테스트
- [ ] 할일 수정 → 완료 → 삭제 → 복원 플로우 테스트
- [ ] 휴지통 영구 삭제 플로우 테스트
- [ ] 국경일 조회 플로우 테스트
- [ ] 토큰 만료 시 자동 갱신 테스트
- [ ] 권한 없는 사용자 접근 차단 테스트
- [ ] 발견된 버그 수정 및 재테스트

#### 산출물

- 테스트 결과 보고서 (간단한 체크리스트)

#### 참고 사항

- Chrome, Firefox, Safari에서 테스트
- 모바일 브라우저에서도 테스트

---

### [TASK-035] 환경 변수 설정 (프로덕션)

**우선순위**: P0
**예상 시간**: 30분
**담당 영역**: 전체
**의존성**: TASK-034

#### 작업 내용

- 프로덕션 환경 변수 설정
- Vercel, Supabase 설정 확인

#### 완료 조건

- [ ] `backend/.env.production` 작성 (Git 제외)
  - DATABASE_URL (Supabase 프로덕션)
  - JWT_SECRET (안전한 랜덤 문자열)
  - NODE_ENV=production
- [ ] `frontend/.env.production` 작성
  - VITE_API_URL (Vercel 백엔드 URL)
- [ ] Vercel 환경 변수 설정 (대시보드)
- [ ] Supabase Connection Pooling 설정 확인

#### 산출물

- `.env.production` 파일 (로컬 보관, Git 제외)

#### 참고 사항

- JWT_SECRET은 최소 32자 이상
- DATABASE_URL은 Connection Pooling URL 사용 권장

---

### [TASK-036] 백엔드 Vercel 배포

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 백엔드
**의존성**: TASK-035

#### 작업 내용

- Vercel Serverless Functions로 백엔드 배포
- API 엔드포인트 테스트

#### 완료 조건

- [ ] `vercel.json` 파일 생성 (백엔드 폴더)
  - rewrites 설정으로 `/api/*` → Serverless Functions
- [ ] Vercel CLI 설치 (`npm i -g vercel`)
- [ ] 백엔드 폴더에서 `vercel` 명령 실행
- [ ] 환경 변수 설정 (Vercel 대시보드)
- [ ] 배포 완료 후 URL 확인
- [ ] Postman으로 프로덕션 API 테스트
  - 회원가입, 로그인 성공 확인
  - 할일 CRUD 테스트

#### 산출물

- `backend/vercel.json`
- 배포된 백엔드 URL

#### 참고 사항

- Serverless Functions는 `/api` 폴더에 배치 필요
- Vercel 무료 티어 제한 확인

---

### [TASK-037] 프론트엔드 Vercel 배포

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 프론트엔드
**의존성**: TASK-036

#### 작업 내용

- Vercel로 프론트엔드 배포
- 빌드 최적화

#### 완료 조건

- [ ] `frontend/.env.production`에 `VITE_API_URL` 설정 (백엔드 URL)
- [ ] Vite 빌드 테스트 (`npm run build`)
- [ ] 빌드 결과 확인 (`dist/` 폴더)
- [ ] Vercel CLI로 배포 (`vercel --prod`)
- [ ] 환경 변수 설정 (Vercel 대시보드)
- [ ] 배포 완료 후 URL 확인
- [ ] 프로덕션 사이트 접속 테스트
  - 회원가입, 로그인
  - 할일 생성, 수정, 삭제
  - 휴지통 복원
  - 국경일 조회

#### 산출물

- 배포된 프론트엔드 URL

#### 참고 사항

- Vercel은 Git 연동 시 자동 배포 가능
- 빌드 로그 확인하여 에러 체크

---

### [TASK-038] 프로덕션 테스트 및 최종 점검

**우선순위**: P0
**예상 시간**: 1시간
**담당 영역**: 전체
**의존성**: TASK-037

#### 작업 내용

- 프로덕션 환경에서 전체 플로우 테스트
- 성능 측정 및 최적화

#### 완료 조건

- [ ] 프로덕션 URL로 전체 사용자 플로우 테스트
- [ ] 브라우저 개발자 도구로 네트워크 요청 확인
  - API 응답 시간 1초 이내
  - HTTPS 사용 확인
  - CORS 에러 없음
- [ ] Lighthouse 성능 측정
  - Performance: 70점 이상
  - Accessibility: 90점 이상
- [ ] 모바일 디바이스에서 테스트
- [ ] 보안 체크
  - JWT 토큰 노출 여부 확인
  - 환경 변수 유출 확인
  - HTTPS 적용 확인

#### 산출물

- Lighthouse 성능 보고서
- 최종 테스트 체크리스트

#### 참고 사항

- 성능 이슈 발견 시 번들 크기 확인
- 에러 모니터링 도구 추가 (선택, Sentry 등)

---

### [TASK-039] 문서화 완료

**우선순위**: P1
**예상 시간**: 1시간
**담당 영역**: 전체
**의존성**: TASK-038

#### 작업 내용

- README.md 업데이트
- API 문서 정리
- 배포 가이드 작성

#### 완료 조건

- [ ] `README.md` 업데이트
  - 프로젝트 소개
  - 기술 스택
  - 로컬 개발 환경 설정 방법
  - 프로덕션 URL
  - 스크린샷 추가 (선택)
- [ ] `docs/API.md` 작성 (선택)
  - 주요 API 엔드포인트 정리
  - 요청/응답 예시
- [ ] `docs/DEPLOYMENT.md` 작성
  - 배포 절차
  - 환경 변수 목록
  - 트러블슈팅

#### 산출물

- 업데이트된 `README.md`
- `docs/API.md`
- `docs/DEPLOYMENT.md`

#### 참고 사항

- 스크린샷은 실제 프로덕션 화면 캡처
- 시간 부족 시 README만 업데이트

---

## 리스크 관리

### 주요 리스크 및 대응 방안

| 리스크                          | 확률   | 영향도 | 대응 방안                                                                                              |
| ------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------ |
| **Prisma + Supabase 연동 이슈** | Medium | High   | - Prisma 공식 Supabase 가이드 참조<br>- Connection String 형식 확인<br>- 로컬 PostgreSQL로 백업 테스트 |
| **JWT 토큰 갱신 로직 복잡도**   | Medium | Medium | - 인터셉터 패턴 사용<br>- 토큰 갱신 실패 시 로그아웃 처리<br>- 테스트 철저히                           |
| **프론트엔드 개발 지연**        | High   | High   | - P1 기능 제외 (다크모드, 프로필 페이지)<br>- UI 단순화<br>- 테스트 자동화 생략                        |
| **Vercel 배포 설정 이슈**       | Medium | Medium | - Vercel 템플릿 활용<br>- 로컬 빌드 먼저 테스트<br>- 환경 변수 설정 체크리스트 작성                    |
| **CORS 에러**                   | Low    | Medium | - CORS 미들웨어 설정 확인<br>- 프론트엔드 URL 정확히 설정                                              |
| **성능 이슈**                   | Low    | Medium | - 인덱싱 적용<br>- 불필요한 렌더링 최소화<br>- Lazy Loading 적용                                       |

### 일정 지연 시 우선순위 조정

**필수 유지 (P0)**:

- TASK-001 ~ TASK-017 (환경 설정, 데이터베이스, 백엔드 핵심 API)
- TASK-019 ~ TASK-029 (프론트엔드 핵심 기능)
- TASK-034 ~ TASK-038 (통합 테스트 및 배포)

**생략 가능 (P1, P2)**:

- TASK-004 (개발 도구 설정)
- TASK-008 (시드 데이터)
- TASK-016 (사용자 프로필 API)
- TASK-017 (Rate Limiting)
- TASK-018 (백엔드 통합 테스트)
- TASK-030 (프로필 페이지)
- TASK-032 (다크모드)
- TASK-033 (에러 처리 개선)
- TASK-039 (문서화)

---

## 진행 상황 추적

### Task 진행 상태 표기

- ⬜ 대기 중 (Not Started)
- 🔵 진행 중 (In Progress)
- ✅ 완료 (Completed)
- ⚠️ 블로킹 이슈 (Blocked)
- ❌ 취소 (Cancelled)

### 일일 체크인 체크리스트

**매일 작업 전**:

- [ ] 오늘 완료할 Task 확인
- [ ] 의존성 Task 완료 여부 확인
- [ ] 블로킹 이슈 해결 방안 수립

**매일 작업 후**:

- [ ] 완료 조건 체크리스트 확인
- [ ] Git 커밋 및 푸시
- [ ] 다음 날 작업 계획 수립

---

## 부록

### 참조 문서

- [도메인 정의서](./1-domain-definition.md)
- [PRD](./3-prd.md)
- [프로젝트 구조](./5-project-structure.md)
- [아키텍처 다이어그램](./5-arch-diagram.md)
- [스타일 가이드](./4-style-guide.md)

### 유용한 명령어

**백엔드**:

```bash
# 개발 서버 시작
npm run dev

# Prisma 마이그레이션
npx prisma migrate dev

# Prisma Studio
npx prisma studio

# 빌드
npm run build
```

**프론트엔드**:

```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

**배포**:

```bash
# Vercel 배포
vercel --prod

# Vercel 환경 변수 설정
vercel env add
```

### 트러블슈팅

**문제: Prisma 마이그레이션 실패**

- 해결: `npx prisma migrate reset` 후 재시도
- 원인: 스키마 변경 충돌

**문제: CORS 에러**

- 해결: `backend/src/app.js`에서 CORS origin 확인
- 원인: 프론트엔드 URL이 허용 목록에 없음

**문제: JWT 토큰 만료 후 갱신 실패**

- 해결: Refresh Token 만료 시간 확인
- 원인: Refresh Token도 만료됨

**문제: Vercel 배포 후 API 호출 실패**

- 해결: 환경 변수 설정 확인 (DATABASE_URL, JWT_SECRET)
- 원인: 환경 변수 누락

---

## 변경 이력

| 버전 | 날짜       | 변경 내용 | 작성자 |
| ---- | ---------- | --------- | ------ |
| 1.0  | 2025-11-26 | 초안 작성 | Claude |

---

**문서 종료**
