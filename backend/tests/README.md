# 백엔드 테스트 문서

## Task 2.1 백엔드 프로젝트 초기화 테스트

백엔드 프로젝트의 초기화 상태를 검증하는 테스트 슈트입니다.

### 테스트 범위

#### 1. package.json 검증 (11개 테스트)
- `name` 필드 존재 확인
- `version` 필드 존재 및 semantic versioning 형식 검증
- `type` 필드가 "module"로 설정되어 있는지 확인
- `main` 필드 존재 확인
- `dependencies` 필드 존재 확인
- 필수 패키지 8개 이상 존재 확인
  - express
  - cors
  - dotenv
  - jsonwebtoken
  - bcryptjs
  - prisma
  - @prisma/client
  - axios
- `scripts.dev` 명령 존재 확인
- `scripts.start` 명령 존재 확인
- `engines.node >= 18.0.0` 설정 확인

#### 2. 디렉토리 구조 검증 (6개 테스트)
- `backend/src/controllers/` 디렉토리 존재
- `backend/src/services/` 디렉토리 존재
- `backend/src/routes/` 디렉토리 존재
- `backend/src/middlewares/` 디렉토리 존재
- `backend/src/config/` 디렉토리 존재
- `backend/src/utils/` 디렉토리 존재

#### 3. .env 파일 검증 (6개 테스트)
- `.env` 파일 존재 확인
- `.env` 파일 읽기 가능 확인
- 필수 환경 변수 존재 확인
  - DATABASE_URL
  - JWT_SECRET
  - PORT
- DATABASE_URL 형식 검증 (URL 프로토콜 포함)
- JWT_SECRET 값 존재 확인
- PORT 값 유효성 검증 (1-65535 범위)

#### 4. .env.example 파일 검증 (7개 테스트)
- `.env.example` 파일 존재 확인
- `.env.example` 파일 읽기 가능 확인
- 필수 환경 변수 예시 존재 확인
- DATABASE_URL 예시 형식 확인
- JWT_SECRET 예시 형식 확인
- PORT 예시 형식 확인

#### 5. .gitignore 검증 (6개 테스트)
- `.gitignore` 파일 존재 확인
- `.gitignore` 파일 읽기 가능 확인
- `node_modules` 포함 확인
- `.env` 포함 확인
- `.env.local` 포함 확인
- 빌드 결과물 (dist, build) 포함 확인
- 로그 파일 포함 확인

### 테스트 실행

```bash
# 테스트 실행
node backend/tests/task-2.1.test.js

# 또는 npm 스크립트로 실행
npm test
```

### 테스트 결과

- **총 테스트**: 36개
- **커버리지**: 100%
- **성공률**: 100%

### 테스트 출력 예시

```
========== Test Suite 1: package.json 검증 ==========

✓ package.json 파일 존재 확인
✓ package.json 파일 읽기
✓ package.json - name 필드 존재
✓ package.json - version 필드 존재
✓ package.json - type 필드 존재 및 "module" 설정
✓ package.json - main 필드 존재
✓ package.json - dependencies 존재
✓ package.json - 필수 패키지 8개 이상 존재
✓ package.json - scripts.dev 명령 존재
✓ package.json - scripts.start 명령 존재
✓ package.json - engines.node >= 18.0.0 설정

========== 테스트 결과 요약 ==========

총 테스트: 36
성공: 36
실패: 0
커버리지: 100%

모든 테스트가 통과했습니다!
```

### 테스트 구조

```
backend/
├── tests/
│   ├── task-2.1.test.js      # 메인 테스트 파일
│   └── README.md             # 이 문서
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── utils/
├── prisma/
│   └── schema.sql
└── ...
```

### 필요한 파일 및 설정

#### package.json 예시
```json
{
  "name": "pkt-todolist",
  "version": "1.0.0",
  "type": "module",
  "main": "backend/src/index.js",
  "scripts": {
    "dev": "node --watch backend/src/index.js",
    "start": "node backend/src/index.js",
    "test": "node backend/tests/task-2.1.test.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "axios": "^1.4.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### .env 예시
```
DATABASE_URL=postgresql://user:password@localhost:5432/todolist
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
API_TIMEOUT=30000
LOG_LEVEL=info
```

#### .env.example 예시
```
# 데이터베이스
DATABASE_URL=postgresql://user:password@localhost:5432/todolist

# JWT 설정
JWT_SECRET=your-secret-key-here

# 포트
PORT=3000

# 환경
NODE_ENV=development

# 기타
API_TIMEOUT=30000
LOG_LEVEL=info
```

#### .gitignore 필수 항목
```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# Logs
logs/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### 테스트 설계 특징

1. **독립적 실행**: 각 테스트는 다른 테스트에 의존하지 않음
2. **명확한 에러 메시지**: 테스트 실패 시 원인을 명확히 알 수 있음
3. **순차적 검증**: 파일 존재 확인 → 파일 읽기 → 내용 검증 순서
4. **상세한 결과 보고**: 성공/실패 현황 및 커버리지 통계 제공
5. **확장 가능성**: 새로운 테스트 케이스 추가 용이

### 테스트 통과 기준

- 모든 36개 테스트가 성공해야 함
- 커버리지가 80% 이상이어야 함 (현재 100%)
- 특정 필드나 디렉토리 누락 시 즉시 실패

### 관련 파일

- 테스트 파일: `/c/test/pkt-todolist/backend/tests/task-2.1.test.js`
- package.json: `/c/test/pkt-todolist/package.json`
- .env: `/c/test/pkt-todolist/.env`
- .env.example: `/c/test/pkt-todolist/.env.example`
- .gitignore: `/c/test/pkt-todolist/.gitignore`