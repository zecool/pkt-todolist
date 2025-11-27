# Vercel 배포 가이드

이 문서는 pkt-TodoList 백엔드를 Vercel에 배포하는 상세 가이드입니다.

## 사전 준비

### 1. 필수 계정
- [Vercel 계정](https://vercel.com) (GitHub 연동 권장)
- PostgreSQL 데이터베이스 (아래 서비스 중 선택)
  - [Neon](https://neon.tech) - 무료 플랜 제공
  - [Supabase](https://supabase.com) - 무료 플랜 제공
  - [Railway](https://railway.app) - $5 무료 크레딧 제공
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Vercel 통합

### 2. 데이터베이스 설정

#### Option A: Neon (추천)

1. [Neon](https://neon.tech)에서 회원가입
2. 새 프로젝트 생성
3. 데이터베이스 생성 완료 후 Connection String 복사
   ```
   postgresql://username:password@host/dbname?sslmode=require
   ```
4. 데이터베이스에 스키마 적용:
   ```bash
   psql "postgresql://username:password@host/dbname?sslmode=require" -f database/schema.sql
   ```

#### Option B: Supabase

1. [Supabase](https://supabase.com)에서 회원가입
2. 새 프로젝트 생성
3. Settings > Database에서 Connection String 복사 (Session mode 사용)
4. SQL Editor에서 `database/schema.sql` 내용을 붙여넣고 실행

#### Option C: Railway

1. [Railway](https://railway.app)에서 회원가입
2. New Project > PostgreSQL 선택
3. Variables 탭에서 `DATABASE_URL` 복사
4. Railway CLI 또는 psql로 스키마 적용

## Vercel 배포 단계

### 1. GitHub 저장소 연결

1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 import
3. **Root Directory를 `backend`로 설정** ⭐ 중요!
4. Framework Preset: "Other" 선택

### 2. 환경변수 설정

Environment Variables 섹션에서 다음 변수들을 추가:

```env
# 필수 변수
DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require
JWT_SECRET=production-secret-key-minimum-32-characters-recommended-64-characters
NODE_ENV=production

# 선택 변수 (기본값 사용 가능)
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 환경변수 설명:
- `DATABASE_URL`: PostgreSQL 데이터베이스 연결 문자열 (필수)
- `JWT_SECRET`: JWT 서명에 사용할 비밀키, 최소 32자 이상 (필수)
- `NODE_ENV`: 환경 설정 (production 고정)
- `JWT_ACCESS_EXPIRATION`: Access 토큰 만료 시간 (기본: 15분)
- `JWT_REFRESH_EXPIRATION`: Refresh 토큰 만료 시간 (기본: 7일)
- `PORT`: 포트 번호 (Vercel에서는 자동 설정)
- `FRONTEND_URL`: CORS 허용 프론트엔드 URL

### 3. Build & Output Settings

Vercel이 자동으로 `vercel.json` 파일을 읽습니다. 수동 설정 필요 없음.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### 4. 배포 실행

"Deploy" 버튼 클릭 → 자동 배포 시작

## 배포 후 확인

### 1. API 헬스체크
```bash
curl https://your-project.vercel.app/health
```

예상 응답:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 2. Swagger 문서 확인
브라우저에서 접속:
```
https://your-project.vercel.app/api-docs
```

### 3. 회원가입 테스트
```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "테스트사용자"
  }'
```

## 배포 문제 해결

### 문제 1: "Database connection failed"
**원인**: DATABASE_URL이 잘못되었거나 데이터베이스가 외부 접속을 허용하지 않음

**해결**:
1. Vercel 환경변수에서 DATABASE_URL 확인
2. 데이터베이스가 외부 접속 허용하는지 확인
3. SSL 모드 확인 (`?sslmode=require` 추가)

### 문제 2: "Internal Server Error"
**원인**: 환경변수 누락 또는 잘못된 설정

**해결**:
1. Vercel Logs 확인 (Deployments > Logs)
2. 필수 환경변수 확인:
   - DATABASE_URL
   - JWT_SECRET
   - NODE_ENV
3. 환경변수 수정 후 재배포

### 문제 3: "404 Not Found"
**원인**: vercel.json의 routes 설정 오류

**해결**:
1. `backend/vercel.json` 파일 확인
2. Root Directory가 `backend`로 설정되었는지 확인

### 문제 4: "Function Timeout"
**원인**: Vercel Serverless Function은 10초 제한 (무료 플랜)

**해결**:
1. 쿼리 최적화
2. 긴 작업은 백그라운드 처리
3. Pro 플랜 업그레이드 (60초 제한)

## CLI를 통한 배포

### Vercel CLI 설치
```bash
npm i -g vercel
```

### 로그인
```bash
vercel login
```

### 배포
```bash
cd backend
vercel
```

### 프로덕션 배포
```bash
vercel --prod
```

## 자동 배포 설정

GitHub에 푸시하면 자동으로 배포되도록 설정됨:
- `main` 브랜치 → Production 배포
- 다른 브랜치 → Preview 배포

## 환경별 배포

### Preview (개발)
```bash
vercel
```

### Production
```bash
vercel --prod
```

## 커스텀 도메인 설정

1. Vercel 프로젝트 > Settings > Domains
2. 도메인 입력 (예: api.yourdomain.com)
3. DNS 레코드 추가 (Vercel이 안내)
4. SSL 자동 발급 완료

## 성능 최적화

### 1. Connection Pooling
데이터베이스 연결 풀 설정 (이미 구현됨):
```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

### 2. 로그 최소화
프로덕션 환경에서 불필요한 로그 제거

### 3. 에러 처리
모든 에러를 적절히 처리하여 500 에러 최소화

## 모니터링

### Vercel Analytics
- Vercel 대시보드에서 요청 통계 확인
- 함수 실행 시간 모니터링
- 에러 로그 확인

### 외부 모니터링 도구
- [Sentry](https://sentry.io) - 에러 추적
- [LogRocket](https://logrocket.com) - 세션 리플레이
- [Datadog](https://datadog.com) - 성능 모니터링

## 비용 안내

### Vercel 무료 플랜
- 함수 실행 시간: 100GB-hours/월
- 대역폭: 100GB/월
- 동시 빌드: 1개
- 서버리스 함수 크기: 50MB
- 함수 실행 제한: 10초

### 데이터베이스 무료 플랜
- **Neon**: 512MB 스토리지, 1개 프로젝트
- **Supabase**: 500MB 데이터베이스, 500MB 스토리지
- **Railway**: $5 무료 크레딧

## 보안 권장사항

1. **JWT_SECRET**: 최소 64자 이상의 무작위 문자열 사용
   ```bash
   openssl rand -base64 64
   ```

2. **DATABASE_URL**: Vercel 환경변수에만 저장, 코드에 하드코딩 금지

3. **CORS**: FRONTEND_URL을 정확한 프론트엔드 도메인으로 설정

4. **Rate Limiting**: 이미 구현됨 (15분당 100회)

5. **환경변수 암호화**: Vercel이 자동으로 암호화 처리

## 추가 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/runtimes/node-js)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
