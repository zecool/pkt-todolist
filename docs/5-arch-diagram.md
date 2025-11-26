# pkt-todolist 기술 아키텍처 다이어그램

**버전**: 1.0
**작성일**: 2025-11-26
**상태**: 최종
**작성자**: Claude
**참조 문서**:
- [도메인 정의서](./1-domain-definition.md)
- [PRD](./3-prd.md)
- [프로젝트 구조](./5-project-structure.md)

---

## 목차

1. [전체 시스템 아키텍처](#1-전체-시스템-아키텍처)
2. [프론트엔드 아키텍처](#2-프론트엔드-아키텍처)
3. [백엔드 아키텍처](#3-백엔드-아키텍처)
4. [데이터 흐름 다이어그램](#4-데이터-흐름-다이어그램)
5. [인증 흐름 다이어그램](#5-인증-흐름-다이어그램)
6. [데이터베이스 스키마](#6-데이터베이스-스키마)

---

## 1. 전체 시스템 아키텍처

### C4 컨테이너 다이어그램

```mermaid
C4Container
    title pkt-todolist 시스템 아키텍처

    Person(user, "사용자", "할일을 관리하는 사용자")

    Container_Boundary(frontend, "프론트엔드") {
        Container(web, "웹 애플리케이션", "React 18, Vite, Tailwind CSS", "사용자 인터페이스 제공")
        Container(store, "상태 관리", "Zustand", "전역 상태 관리")
    }

    Container_Boundary(backend, "백엔드") {
        Container(api, "REST API", "Node.js, Express.js", "비즈니스 로직 및 API 제공")
        Container(auth, "인증 시스템", "JWT", "사용자 인증 및 권한 관리")
    }

    ContainerDb(db, "데이터베이스", "PostgreSQL (Supabase)", "사용자, 할일, 국경일 데이터 저장")

    Container_Boundary(deployment, "배포 환경") {
        Container(vercel_fe, "Vercel", "Frontend Hosting", "프론트엔드 배포")
        Container(vercel_be, "Vercel", "Serverless Functions", "백엔드 API 배포")
    }

    Rel(user, web, "사용", "HTTPS")
    Rel(web, store, "상태 업데이트", "")
    Rel(web, api, "API 호출", "REST/JSON")
    Rel(api, auth, "토큰 검증", "")
    Rel(api, db, "데이터 읽기/쓰기", "Prisma ORM")

    Rel(web, vercel_fe, "배포", "")
    Rel(api, vercel_be, "배포", "")
    Rel(db, vercel_be, "연결", "PostgreSQL Protocol")
```

### 시스템 구성 요소 설명

| 구성 요소 | 기술 스택 | 역할 | 배포 위치 |
|-----------|----------|------|-----------|
| **웹 애플리케이션** | React 18, Vite, Tailwind CSS | 사용자 인터페이스 제공 | Vercel |
| **상태 관리** | Zustand | 클라이언트 전역 상태 관리 | 클라이언트 |
| **REST API** | Node.js, Express.js | 비즈니스 로직 및 API 제공 | Vercel Serverless |
| **인증 시스템** | JWT (jsonwebtoken) | 사용자 인증 및 권한 관리 | Vercel Serverless |
| **데이터베이스** | PostgreSQL (Supabase) | 데이터 영구 저장 | Supabase Cloud |
| **ORM** | Prisma | 데이터베이스 액세스 추상화 | API Layer |

### 핵심 설계 원칙

1. **레이어드 아키텍처**: 프레젠테이션, 비즈니스, 데이터 레이어 명확히 분리
2. **단방향 의존성**: 상위 레이어가 하위 레이어에만 의존
3. **Stateless 백엔드**: 수평 확장 가능한 서버리스 구조
4. **JWT 기반 인증**: 세션 없이 토큰 기반 인증
5. **단순성 우선**: 필요한 기능만 구현 (YAGNI 원칙)

---

## 2. 프론트엔드 아키텍처

### 프론트엔드 레이어 구조

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Pages<br/>LoginPage, TodoListPage]
        B[Components<br/>Button, TodoCard, Modal]
        C[Layouts<br/>MainLayout, Header]
    end

    subgraph "State Management Layer"
        D[Zustand Stores<br/>todoStore, authStore]
    end

    subgraph "Service Layer"
        E[API Services<br/>todoService, authService]
        F[Axios Instance<br/>HTTP Client]
    end

    subgraph "Utility Layer"
        G[Hooks<br/>useTodos, useAuth]
        H[Utils<br/>dateFormatter, validator]
    end

    A --> B
    A --> C
    A --> D
    A --> G
    B --> H
    D --> E
    E --> F
    G --> D

    F --> I[Backend API]

    style A fill:#e1f5ff
    style D fill:#fff4e1
    style E fill:#ffe1f5
    style I fill:#e1ffe1
```

### 주요 컴포넌트 설명

#### Presentation Layer (UI)
- **Pages**: 라우트별 페이지 컴포넌트 (LoginPage, TodoListPage, TrashPage 등)
- **Components**: 재사용 가능한 UI 컴포넌트 (Button, Input, TodoCard, Modal)
- **Layouts**: 공통 레이아웃 구조 (Header, Sidebar, MainLayout)

#### State Management Layer
- **Zustand Stores**: 전역 상태 관리
  - `todoStore`: 할일 목록, 필터, 정렬 상태
  - `authStore`: 로그인 정보, JWT 토큰
  - `holidayStore`: 국경일 데이터
  - `uiStore`: 모달, 토스트 등 UI 상태

#### Service Layer (API)
- **API Services**: 백엔드 API 호출 추상화
  - `todoService`: 할일 CRUD API 호출
  - `authService`: 인증 API 호출 (로그인, 회원가입, 토큰 갱신)
  - `holidayService`: 국경일 API 호출
- **Axios Instance**: HTTP 클라이언트, 인터셉터로 JWT 토큰 자동 첨부

#### Utility Layer
- **Custom Hooks**: 비즈니스 로직 재사용 (useTodos, useAuth, useDebounce)
- **Utils**: 순수 유틸리티 함수 (날짜 포맷팅, 유효성 검증, 토큰 관리)

### 데이터 흐름 (프론트엔드)

```mermaid
sequenceDiagram
    participant U as User
    participant P as Page Component
    participant S as Zustand Store
    participant API as API Service
    participant BE as Backend API

    U->>P: 할일 목록 요청
    P->>S: getTodos() 호출
    S->>API: fetchTodos()
    API->>BE: GET /api/todos
    BE-->>API: 할일 데이터
    API-->>S: 데이터 반환
    S->>S: 상태 업데이트
    S-->>P: 상태 변경 알림
    P-->>U: UI 렌더링
```

### 주요 기술 스택

| 라이브러리 | 용도 | 버전 |
|-----------|------|------|
| React | UI 라이브러리 | 18.x |
| Zustand | 상태 관리 | 최신 |
| React Router | 라우팅 | v6 |
| Axios | HTTP 클라이언트 | 최신 |
| Tailwind CSS | 스타일링 | 최신 |
| React Hook Form | 폼 관리 | 최신 |
| Zod | 스키마 검증 | 최신 |
| date-fns | 날짜 처리 | 최신 |

---

## 3. 백엔드 아키텍처

### 백엔드 레이어 구조

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Routes<br/>todoRoutes, authRoutes]
        B[Controllers<br/>todoController, authController]
        C[Middlewares<br/>authMiddleware, errorMiddleware]
    end

    subgraph "Business Logic Layer"
        D[Services<br/>todoService, authService]
        E[Validators<br/>express-validator]
    end

    subgraph "Data Access Layer"
        F[Repositories<br/>todoRepository, userRepository]
        G[Prisma Client<br/>ORM]
    end

    subgraph "Database"
        H[(PostgreSQL<br/>Supabase)]
    end

    I[HTTP Request] --> A
    A --> C
    C --> B
    B --> D
    D --> E
    D --> F
    F --> G
    G --> H

    B --> J[HTTP Response]

    style A fill:#e1f5ff
    style D fill:#fff4e1
    style F fill:#ffe1f5
    style H fill:#e1ffe1
```

### 주요 레이어 설명

#### Presentation Layer
- **Routes**: API 엔드포인트 정의 및 라우팅
  - `todoRoutes.js`: `/api/todos` 관련 라우트
  - `authRoutes.js`: `/api/auth` 관련 라우트
  - `holidayRoutes.js`: `/api/holidays` 관련 라우트

- **Controllers**: HTTP 요청/응답 처리
  - 요청 파라미터 추출
  - 응답 포맷팅 (JSON)
  - HTTP 상태 코드 설정

- **Middlewares**: 요청 전처리
  - `authMiddleware`: JWT 토큰 검증
  - `errorMiddleware`: 에러 핸들링
  - `validationMiddleware`: 요청 데이터 검증
  - `rateLimitMiddleware`: API 호출 제한

#### Business Logic Layer
- **Services**: 핵심 비즈니스 로직
  - 할일 생성, 수정, 삭제, 완료 처리
  - 휴지통 로직 (소프트 삭제, 복원)
  - 사용자 권한 검증
  - JWT 토큰 생성/갱신

- **Validators**: 데이터 유효성 검증
  - 이메일 형식 검증
  - 비밀번호 강도 검증
  - 날짜 유효성 검증 (dueDate >= startDate)

#### Data Access Layer
- **Repositories**: 데이터베이스 액세스 추상화
  - CRUD 작업 캡슐화
  - 쿼리 최적화 (인덱싱)
  - 트랜잭션 관리

- **Prisma Client**: ORM
  - 타입 안전성
  - 자동 마이그레이션
  - 쿼리 빌더

### API 엔드포인트 구조

```mermaid
graph LR
    A[API Gateway] --> B[/api/auth]
    A --> C[/api/todos]
    A --> D[/api/holidays]
    A --> E[/api/users]
    A --> F[/api/trash]

    B --> B1[POST /register]
    B --> B2[POST /login]
    B --> B3[POST /refresh]
    B --> B4[POST /logout]

    C --> C1[GET /]
    C --> C2[POST /]
    C --> C3[GET /:id]
    C --> C4[PUT /:id]
    C --> C5[DELETE /:id]
    C --> C6[PATCH /:id/complete]
    C --> C7[PATCH /:id/restore]

    D --> D1[GET /]
    D --> D2[POST /]
    D --> D3[PUT /:id]

    E --> E1[GET /me]
    E --> E2[PATCH /me]

    F --> F1[GET /]
    F --> F2[DELETE /:id]

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe1
    style E fill:#f5e1ff
    style F fill:#ffe1e1
```

### 주요 기술 스택

| 라이브러리 | 용도 | 버전 |
|-----------|------|------|
| Node.js | 런타임 환경 | 18+ |
| Express.js | 웹 프레임워크 | 4.x |
| Prisma | ORM | 최신 |
| jsonwebtoken | JWT 인증 | 최신 |
| bcrypt | 비밀번호 해싱 | 최신 |
| express-validator | 요청 검증 | 최신 |
| cors | CORS 설정 | 최신 |
| helmet | 보안 헤더 | 최신 |
| express-rate-limit | Rate Limiting | 최신 |

---

## 4. 데이터 흐름 다이어그램

### 할일 생성 흐름

```mermaid
sequenceDiagram
    autonumber

    actor User as 사용자
    participant UI as React Component
    participant Store as Zustand Store
    participant Service as API Service
    participant API as Express API
    participant Auth as Auth Middleware
    participant Controller as Todo Controller
    participant BL as Todo Service
    participant Repo as Todo Repository
    participant Prisma as Prisma Client
    participant DB as PostgreSQL

    User->>UI: 할일 추가 버튼 클릭
    UI->>UI: 폼 입력 (제목, 내용, 날짜)
    User->>UI: 저장 버튼 클릭

    UI->>Store: createTodo(data)
    Store->>Service: todoService.createTodo(data)
    Service->>API: POST /api/todos

    API->>Auth: JWT 토큰 검증
    Auth-->>API: 사용자 인증 완료

    API->>Controller: createTodo(req, res)
    Controller->>Controller: 요청 데이터 검증
    Controller->>BL: todoService.createTodo(userId, data)

    BL->>BL: 비즈니스 규칙 검증<br/>(dueDate >= startDate)
    BL->>Repo: todoRepository.create(userId, data)
    Repo->>Prisma: prisma.todo.create({...})
    Prisma->>DB: INSERT INTO todos ...

    DB-->>Prisma: 생성된 할일 데이터
    Prisma-->>Repo: Todo 객체
    Repo-->>BL: Todo 객체
    BL-->>Controller: Todo 객체
    Controller-->>API: 201 Created + JSON

    API-->>Service: 응답 데이터
    Service-->>Store: 새 할일 데이터
    Store->>Store: 상태 업데이트
    Store-->>UI: 상태 변경 알림
    UI-->>User: 할일 목록에 새 항목 표시
```

### 할일 조회 흐름 (캐싱 포함)

```mermaid
sequenceDiagram
    autonumber

    actor User as 사용자
    participant UI as React Component
    participant Store as Zustand Store
    participant Service as API Service
    participant API as Express API
    participant Cache as Repository Cache
    participant DB as PostgreSQL

    User->>UI: 페이지 접속
    UI->>Store: getTodos()

    alt 캐시 있음
        Store-->>UI: 캐시된 데이터 반환
        UI-->>User: 할일 목록 표시
    else 캐시 없음
        Store->>Service: fetchTodos()
        Service->>API: GET /api/todos
        API->>Cache: 캐시 확인

        alt 캐시 히트
            Cache-->>API: 캐시된 데이터
        else 캐시 미스
            API->>DB: SELECT * FROM todos ...
            DB-->>API: 할일 데이터
            API->>Cache: 캐시 저장
        end

        API-->>Service: 응답 데이터
        Service-->>Store: 할일 목록
        Store->>Store: 캐시 저장
        Store-->>UI: 상태 업데이트
        UI-->>User: 할일 목록 표시
    end
```

### 할일 삭제 및 복원 흐름 (소프트 삭제)

```mermaid
sequenceDiagram
    autonumber

    actor User as 사용자
    participant UI as React Component
    participant Store as Zustand Store
    participant API as Express API
    participant Service as Todo Service
    participant DB as PostgreSQL

    rect rgb(255, 230, 230)
        Note over User,DB: 할일 삭제 (휴지통 이동)
        User->>UI: 삭제 버튼 클릭
        UI->>Store: deleteTodo(todoId)
        Store->>API: DELETE /api/todos/:id
        API->>Service: softDelete(todoId)
        Service->>DB: UPDATE todos<br/>SET status='deleted',<br/>deletedAt=NOW()<br/>WHERE todoId=...
        DB-->>Service: 업데이트 완료
        Service-->>API: 성공 응답
        API-->>Store: 200 OK
        Store->>Store: 할일 목록에서 제거
        Store-->>UI: 상태 업데이트
        UI-->>User: 할일 삭제 완료
    end

    rect rgb(230, 255, 230)
        Note over User,DB: 할일 복원
        User->>UI: 휴지통 페이지 접속
        User->>UI: 복원 버튼 클릭
        UI->>Store: restoreTodo(todoId)
        Store->>API: PATCH /api/todos/:id/restore
        API->>Service: restore(todoId)
        Service->>DB: UPDATE todos<br/>SET status='active',<br/>deletedAt=NULL<br/>WHERE todoId=...
        DB-->>Service: 업데이트 완료
        Service-->>API: 성공 응답
        API-->>Store: 200 OK
        Store->>Store: 할일 목록에 추가
        Store-->>UI: 상태 업데이트
        UI-->>User: 할일 복원 완료
    end
```

---

## 5. 인증 흐름 다이어그램

### 회원가입 및 로그인 흐름

```mermaid
sequenceDiagram
    autonumber

    actor User as 사용자
    participant UI as Login Page
    participant API as Auth API
    participant Service as Auth Service
    participant DB as PostgreSQL
    participant JWT as JWT Helper

    rect rgb(230, 240, 255)
        Note over User,JWT: 회원가입 흐름
        User->>UI: 회원가입 정보 입력<br/>(email, password, username)
        UI->>UI: 클라이언트 검증<br/>(Zod 스키마)
        UI->>API: POST /api/auth/register
        API->>Service: register(email, password, username)
        Service->>Service: 이메일 중복 확인
        Service->>Service: 비밀번호 해싱 (bcrypt)
        Service->>DB: INSERT INTO users ...
        DB-->>Service: 생성된 사용자 정보
        Service-->>API: 사용자 정보 (비밀번호 제외)
        API-->>UI: 201 Created
        UI-->>User: 회원가입 완료 메시지
        UI->>UI: 로그인 페이지로 이동
    end

    rect rgb(255, 240, 230)
        Note over User,JWT: 로그인 흐름
        User->>UI: 로그인 정보 입력<br/>(email, password)
        UI->>API: POST /api/auth/login
        API->>Service: login(email, password)
        Service->>DB: SELECT * FROM users<br/>WHERE email=...
        DB-->>Service: 사용자 정보
        Service->>Service: 비밀번호 검증<br/>(bcrypt.compare)
        Service->>JWT: generateAccessToken(userId)
        JWT-->>Service: Access Token (15분)
        Service->>JWT: generateRefreshToken(userId)
        JWT-->>Service: Refresh Token (7일)
        Service-->>API: {accessToken, refreshToken, user}
        API-->>UI: 200 OK + 토큰
        UI->>UI: LocalStorage에 토큰 저장
        UI->>UI: authStore 상태 업데이트
        UI-->>User: 메인 페이지로 이동
    end
```

### JWT 토큰 갱신 흐름

```mermaid
sequenceDiagram
    autonumber

    participant UI as React App
    participant Axios as Axios Interceptor
    participant API as Auth API
    participant JWT as JWT Helper
    participant Store as Auth Store

    UI->>Axios: API 요청 (Access Token 포함)
    Axios->>API: Authorization: Bearer {token}

    alt Access Token 만료
        API->>JWT: verifyToken(accessToken)
        JWT-->>API: TokenExpiredError
        API-->>Axios: 401 Unauthorized

        Axios->>Axios: 인터셉터 감지
        Axios->>API: POST /api/auth/refresh<br/>{refreshToken}
        API->>JWT: verifyToken(refreshToken)

        alt Refresh Token 유효
            JWT-->>API: 검증 성공
            API->>JWT: generateAccessToken(userId)
            JWT-->>API: 새 Access Token
            API-->>Axios: {accessToken}
            Axios->>Store: 새 토큰 저장
            Axios->>Axios: 원래 요청 재시도<br/>(새 Access Token 포함)
            Axios->>API: 원래 요청
            API-->>Axios: 200 OK
            Axios-->>UI: 응답 데이터
        else Refresh Token 만료
            JWT-->>API: TokenExpiredError
            API-->>Axios: 401 Unauthorized
            Axios->>Store: 로그아웃 처리
            Store->>Store: 토큰 삭제
            Axios-->>UI: 로그인 페이지로 리다이렉트
        end
    else Access Token 유효
        API-->>Axios: 200 OK
        Axios-->>UI: 응답 데이터
    end
```

### 인증 미들웨어 동작

```mermaid
flowchart TD
    A[HTTP 요청] --> B{Authorization<br/>헤더 있음?}

    B -->|없음| C[401 Unauthorized<br/>토큰 필요]
    B -->|있음| D[Bearer 토큰 추출]

    D --> E{토큰 형식<br/>유효?}
    E -->|아니오| F[401 Unauthorized<br/>잘못된 형식]
    E -->|예| G[JWT 검증]

    G --> H{토큰 유효?}
    H -->|만료됨| I[401 Unauthorized<br/>토큰 만료]
    H -->|유효하지 않음| J[401 Unauthorized<br/>잘못된 토큰]
    H -->|유효함| K[토큰에서 userId 추출]

    K --> L[DB에서 사용자 조회]
    L --> M{사용자 존재?}

    M -->|없음| N[404 Not Found<br/>사용자 없음]
    M -->|있음| O[req.user에 사용자 정보 저장]

    O --> P[다음 미들웨어/컨트롤러로 진행]

    style A fill:#e1f5ff
    style P fill:#e1ffe1
    style C fill:#ffe1e1
    style F fill:#ffe1e1
    style I fill:#ffe1e1
    style J fill:#ffe1e1
    style N fill:#ffe1e1
```

### JWT 토큰 구조

```mermaid
graph LR
    A[JWT Token] --> B[Header]
    A --> C[Payload]
    A --> D[Signature]

    B --> B1[alg: HS256<br/>typ: JWT]

    C --> C1[userId<br/>email<br/>role<br/>iat: 발급시간<br/>exp: 만료시간]

    D --> D1[HMACSHA256<br/>base64UrlEncode header + <br/>base64UrlEncode payload +<br/>JWT_SECRET]

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe1
```

---

## 6. 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    USER ||--o{ TODO : owns

    USER {
        uuid userId PK
        varchar email UK "로그인 이메일"
        varchar password "bcrypt 해시"
        varchar username "사용자 이름"
        enum role "user, admin"
        timestamp createdAt
        timestamp updatedAt
    }

    TODO {
        uuid todoId PK
        uuid userId FK
        varchar title "할일 제목"
        text content "할일 상세"
        date startDate "시작일"
        date dueDate "만료일"
        enum status "active, completed, deleted"
        boolean isCompleted
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt "소프트 삭제"
    }

    HOLIDAY {
        uuid holidayId PK
        varchar title "국경일 이름"
        date date "날짜"
        text description "설명"
        boolean isRecurring "매년 반복"
        timestamp createdAt
        timestamp updatedAt
    }
```

### 데이터베이스 인덱스 전략

```mermaid
graph TB
    subgraph "User 테이블"
        U1[PRIMARY KEY: userId]
        U2[UNIQUE INDEX: email]
        U3[INDEX: role]
    end

    subgraph "Todo 테이블"
        T1[PRIMARY KEY: todoId]
        T2[INDEX: userId, status]
        T3[INDEX: dueDate]
        T4[INDEX: deletedAt]
        T5[FOREIGN KEY: userId → User]
    end

    subgraph "Holiday 테이블"
        H1[PRIMARY KEY: holidayId]
        H2[INDEX: date]
    end

    style U1 fill:#e1f5ff
    style T1 fill:#e1f5ff
    style H1 fill:#e1f5ff
```

### Prisma 스키마 (간소화)

```prisma
// User 모델
model User {
  userId    String   @id @default(uuid())
  email     String   @unique
  password  String
  username  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]

  @@index([role])
}

// Todo 모델
model Todo {
  todoId      String     @id @default(uuid())
  userId      String
  user        User       @relation(fields: [userId], references: [userId], onDelete: Cascade)
  title       String
  content     String?
  startDate   DateTime?
  dueDate     DateTime?
  status      TodoStatus @default(ACTIVE)
  isCompleted Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?

  @@index([userId, status])
  @@index([dueDate])
  @@index([deletedAt])
}

// Holiday 모델
model Holiday {
  holidayId   String   @id @default(uuid())
  title       String
  date        DateTime
  description String?
  isRecurring Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([date])
}

// Enums
enum Role {
  USER
  ADMIN
}

enum TodoStatus {
  ACTIVE
  COMPLETED
  DELETED
}
```

---

## 부록

### 아키텍처 설계 원칙 요약

| 원칙 | 설명 | 적용 예시 |
|------|------|-----------|
| **레이어드 아키텍처** | 계층 분리로 관심사 분리 | Presentation → Business → Data |
| **단방향 의존성** | 상위 레이어만 하위 레이어 의존 | Controller → Service → Repository |
| **SOLID 원칙** | 단일 책임, 의존성 역전 | 각 Service는 하나의 엔티티만 담당 |
| **DRY (Don't Repeat Yourself)** | 중복 코드 제거 | Utils, Hooks, Services로 추출 |
| **KISS (Keep It Simple)** | 단순성 유지 | 필요한 기능만 구현 |
| **Stateless Backend** | 서버 무상태 유지 | JWT 토큰 기반 인증, 세션 없음 |
| **API First** | API 중심 설계 | RESTful API 명세 우선 작성 |

### 보안 아키텍처

```mermaid
graph TB
    A[클라이언트 요청] --> B[HTTPS/TLS]
    B --> C[CORS 검증]
    C --> D[Rate Limiting]
    D --> E[JWT 인증]
    E --> F[권한 검증]
    F --> G[입력 검증]
    G --> H[SQL Injection 방어<br/>Prisma ORM]
    H --> I[XSS 방어<br/>Sanitization]
    I --> J[비즈니스 로직]
    J --> K[응답 암호화]
    K --> L[보안 헤더<br/>Helmet]
    L --> M[클라이언트 응답]

    style B fill:#ffe1e1
    style E fill:#ffe1e1
    style G fill:#ffe1e1
    style H fill:#ffe1e1
    style I fill:#ffe1e1
    style L fill:#ffe1e1
```

### 배포 아키텍처

```mermaid
graph TB
    subgraph "개발 환경"
        D1[Git Repository<br/>GitHub]
    end

    subgraph "CI/CD"
        C1[GitHub Actions<br/>자동 빌드/테스트]
    end

    subgraph "Vercel (프론트엔드)"
        V1[Static Site Hosting]
        V2[CDN]
        V3[Environment Variables]
    end

    subgraph "Vercel (백엔드)"
        V4[Serverless Functions]
        V5[Edge Network]
    end

    subgraph "Supabase"
        S1[PostgreSQL]
        S2[Auto Backup]
        S3[Connection Pooling]
    end

    D1 --> C1
    C1 --> V1
    C1 --> V4
    V1 --> V2
    V4 --> V5
    V4 --> S1
    S1 --> S2
    S1 --> S3

    style V1 fill:#e1f5ff
    style V4 fill:#fff4e1
    style S1 fill:#e1ffe1
```

### 성능 최적화 전략

| 계층 | 최적화 기법 | 구현 방법 |
|------|------------|-----------|
| **프론트엔드** | Code Splitting | React.lazy(), Suspense |
| | Lazy Loading | 이미지, 컴포넌트 지연 로딩 |
| | 캐싱 | Zustand 상태 캐싱 |
| | 번들 최소화 | Vite 빌드 최적화 |
| **백엔드** | 데이터베이스 인덱싱 | userId, status, dueDate |
| | 쿼리 최적화 | Prisma 쿼리 최적화 |
| | Connection Pooling | Supabase 자동 설정 |
| **네트워크** | CDN | Vercel Edge Network |
| | HTTPS/2 | Vercel 기본 제공 |
| | gzip 압축 | Express 미들웨어 |

---

**문서 종료**
