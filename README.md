# 간단한 인증기반 TodoList

JWT 인증 기반의 할일 관리 REST API 서버입니다.

## 기술 스택

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (Access Token + Refresh Token)
- **API Documentation**: Swagger UI
- **Testing**: Jest
- **Deployment**: Vercel

## 주요 기능

- 사용자 인증 (회원가입, 로그인, 토큰 갱신)
- 할일 관리 (생성, 조회, 수정, 완료, 삭제)
- 휴지통 기능 (삭제된 할일 관리)
- 공휴일 관리
- 사용자 프로필 관리

## 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd pkt-todolist/backend
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 값을 설정합니다.

```bash
cp .env.example .env
```

`.env` 파일 예시:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-secret-key-minimum-32-characters-change-this
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3000/api
```

### 4. 데이터베이스 설정
PostgreSQL 데이터베이스를 생성하고 `database/schema.sql` 파일을 실행하여 테이블을 생성합니다.

```bash
psql -U username -d database_name -f ../database/schema.sql
```

### 5. 서버 실행
```bash
# 개발 모드 (nodemon)
npm run dev

# 프로덕션 모드
npm start
```

### 6. API 문서 확인
서버 실행 후 브라우저에서 접속:
```
http://localhost:3000/api-docs
```

## Vercel 배포 가이드

### 1. Vercel 프로젝트 생성
1. [Vercel](https://vercel.com)에 로그인
2. 새 프로젝트 생성
3. GitHub 저장소 연결
4. `backend` 디렉토리를 루트 디렉토리로 설정

### 2. 환경변수 설정
Vercel 프로젝트 설정에서 다음 환경변수를 추가:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=your-production-secret-key-minimum-32-characters
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
API_URL=https://your-project.vercel.app/api
```

### 3. 데이터베이스 설정
- Vercel Postgres 또는 외부 PostgreSQL 서비스 사용
- 추천 서비스: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app)

### 4. 배포
```bash
cd backend
vercel --prod
```

또는 GitHub에 푸시하면 자동 배포됩니다.

## 테스트 실행

```bash
# 전체 테스트
npm test

# 테스트 watch 모드
npm run test:watch

# 커버리지 확인
npm run test:coverage
```

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 할일 (Todos)
- `GET /api/todos` - 할일 목록 조회
- `GET /api/todos/:id` - 특정 할일 조회
- `POST /api/todos` - 할일 생성
- `PUT /api/todos/:id` - 할일 수정
- `PATCH /api/todos/:id/complete` - 할일 완료
- `DELETE /api/todos/:id` - 할일 삭제 (휴지통 이동)
- `PATCH /api/todos/:id/restore` - 할일 복원

### 휴지통 (Trash)
- `GET /api/trash` - 휴지통 조회
- `DELETE /api/trash/:id` - 영구 삭제

### 공휴일 (Holidays)
- `GET /api/holidays` - 공휴일 목록 조회
- `POST /api/holidays` - 공휴일 추가 (관리자 전용)
- `PUT /api/holidays/:id` - 공휴일 수정 (관리자 전용)
- `DELETE /api/holidays/:id` - 공휴일 삭제 (관리자 전용)

### 사용자 (Users)
- `GET /api/users/me` - 내 프로필 조회
- `PUT /api/users/me` - 내 프로필 수정

## 프로젝트 구조

```
backend/
├── src/
│   ├── config/          # 설정 파일
│   ├── controllers/     # 컨트롤러
│   ├── middlewares/     # 미들웨어
│   ├── routes/          # 라우터
│   ├── services/        # 비즈니스 로직
│   ├── utils/           # 유틸리티 함수
│   ├── app.js           # Express 앱 설정
│   └── server.js        # 서버 진입점
├── database/            # 데이터베이스 스키마
├── .env.example         # 환경변수 예시
├── vercel.json          # Vercel 배포 설정
└── package.json
```

## 라이선스

ISC
