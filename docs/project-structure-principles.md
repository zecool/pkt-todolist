# 프로젝트 구조 설계 원칙 (Project Structure Principles)

본 문서는 `pkt-todolist` 프로젝트의 모든 개발자가 준수해야 할 아키텍처 및 코드 구조 원칙을 정의합니다.

---

## 1. 최상위 공통 원칙 (Top-Level Principles)

1.  **문서 기반 개발 (Documentation First)**: 모든 기능 구현은 `docs/` 디렉토리의 PRD 및 도메인 정의서를 기준으로 합니다. 코드와 문서가 충돌할 경우 문서를 우선하거나, 문서를 먼저 수정한 후 코드를 반영합니다.
2.  **관심사의 분리 (Separation of Concerns)**: UI, 비즈니스 로직, 데이터 접근 계층을 명확히 분리하여 의존성을 최소화합니다.
3.  **단일 진실 공급원 (Single Source of Truth)**: 데이터의 정합성은 데이터베이스(PostgreSQL)를 기준으로 하며, 상태 관리(Frontend Store)는 이를 반영하는 캐시 역할을 합니다.
4.  **표준 준수**:
    *   **인코딩**: 모든 소스 파일은 `UTF-8`을 사용합니다.
    *   **시간**: 데이터 저장 및 전송 시 `UTC (ISO 8601)` 형식을 기본으로 하며, 사용자 표시 단계에서 로컬 시간대(KST)로 변환합니다.
    *   **언어**: 코드(변수, 함수, 클래스명)는 **영어**를 사용하고, 주석 및 문서는 **한국어**를 사용합니다.

---

## 2. 의존성 및 레이어 원칙 (Dependency & Layer Rules)

### 2.1 백엔드 (Spring Boot)
**Layered Architecture** 패턴을 엄격히 준수합니다.

*   **방향성**: `Controller (Web)` → `Service (Business)` → `Repository (Data)`
*   **규칙**:
    *   상위 레이어는 하위 레이어를 의존할 수 있지만, 하위 레이어는 상위 레이어를 알 수 없습니다.
    *   **Entity 노출 금지**: Controller는 절대 Entity를 직접 반환하거나 파라미터로 받지 않습니다. 반드시 `DTO (Data Transfer Object)`를 통해 통신합니다.
    *   비즈니스 로직은 오직 `Service` 계층에만 존재해야 합니다.

### 2.2 프론트엔드 (React)
**Component-Based Architecture**와 **Separation of View & Logic**을 따릅니다.

*   **구조**:
    *   `Components (View)`: UI 렌더링에만 집중합니다.
    *   `Hooks (Logic)`: 상태 관리 및 비즈니스 로직을 캡슐화합니다.
    *   `API (Data)`: 서버 통신 코드는 별도 모듈로 분리하여 컴포넌트가 직접 `axios`를 호출하지 않도록 합니다.
*   **상태 관리**:
    *   전역 상태(Zustand)는 여러 컴포넌트 간 공유가 필요한 데이터(User Info, Theme 등)에 한정합니다.
    *   지역 상태는 `useState` 또는 커스텀 훅으로 관리합니다.

---

## 3. 코드 및 네이밍 원칙 (Coding & Naming Standards)

### 3.1 네이밍 규칙 (Naming Convention)

| 구분 | 규칙 | 예시 | 비고 |
| :--- | :--- | :--- | :--- |
| **변수/함수/메서드** | camelCase | `userId`, `getUser()` | 동사+명사 형태 권장 |
| **클래스/인터페이스** | PascalCase | `UserService`, `TodoItem` | 명사 형태 |
| **상수/Enum** | UPPER_SNAKE | `MAX_RETRY_COUNT`, `STATUS_ACTIVE` | |
| **컴포넌트 (React)** | PascalCase | `TodoList.tsx` | 파일명과 일치 |
| **데이터베이스** | snake_case | `user_id`, `created_at` | SQL 표준 |
| **URL (API)** | kebab-case | `/api/todo-items` | 복수형 명사 권장 |

### 3.2 코드 스타일
*   **Frontend**: Prettier 및 ESLint 설정을 준수합니다.
*   **Backend**: Google Java Style Guide를 기반으로 하되, 프로젝트 설정을 따릅니다.
*   **Clean Code**:
    *   함수는 하나의 기능만 수행하도록 작게 유지합니다.
    *   매직 넘버/스트링 사용을 지양하고 상수로 정의합니다.

---

## 4. 테스트 및 품질 원칙 (Testing & Quality)

1.  **테스트 범위**:
    *   **Backend**: Service 계층의 비즈니스 로직에 대한 단위 테스트(JUnit 5)는 필수입니다. 중요 시나리오에 대해 통합 테스트를 작성합니다.
    *   **Frontend**: 공통 유틸리티 함수 및 복잡한 커스텀 훅에 대한 단위 테스트(Vitest)를 권장합니다.
2.  **커밋 전 검증**: 로컬에서 빌드 및 린트 체크가 통과된 코드만 커밋합니다 (Husky/Lint-staged 활용 권장).

---

## 5. 설정, 보안 및 운영 원칙 (Config, Security & Ops)

1.  **설정 관리**:
    *   환경별 설정(`dev`, `prod`)을 분리합니다.
    *   **Secret 관리**: DB 비밀번호, JWT Secret Key 등 민감 정보는 절대 Git에 커밋하지 않습니다. `.env` 파일이나 환경 변수로 주입받습니다.
2.  **보안**:
    *   모든 API 요청은 인증 헤더(JWT)를 검증해야 합니다(Public API 제외).
    *   SQL Injection 방지를 위해 ORM(JPA) 또는 Prepared Statement를 사용합니다.
3.  **개발 환경**:
    *   로컬 개발 시 `Docker Compose`를 사용하여 DB 등 인프라를 일관되게 구성합니다.

---

## 6. 디렉토리 구조 (Directory Structure)

### 6.1 최상위 구조
```
pkt-todolist/
├── backend/            # Spring Boot Project
├── frontend/           # React Project
├── docs/               # Project Documentation
├── .claude/            # Agent Configurations
└── README.md
```

### 6.2 백엔드 (backend/)
```
src/main/java/com/pkt/todolist/
├── common/             # 공통 유틸리티, 예외 처리, 설정
├── user/               # User 도메인 (Controller, Service, Repository, Entity, DTO)
├── todo/               # Todo 도메인
├── trash/              # Trash 도메인
└── Application.java
```
*도메인형 패키지 구조를 권장하여 관련 코드를 응집시킵니다.*

### 6.3 프론트엔드 (frontend/)
```
src/
├── api/                # Axios 인스턴스 및 API 호출 함수
├── assets/             # 이미지, 폰트 등 정적 자원
├── components/         # 재사용 가능한 UI 컴포넌트 (Common, Layout 등)
├── features/           # 기능별 모듈 (User, Todo, Trash)
│   ├── auth/
│   │   ├── components/ # 해당 기능 전용 컴포넌트
│   │   └── hooks/      # 해당 기능 전용 훅
│   └── todo/
├── hooks/              # 전역 커스텀 훅
├── pages/              # 라우트 페이지 컴포넌트
├── stores/             # 전역 상태 (Zustand)
├── types/              # 공통 타입 정의 (TypeScript)
├── utils/              # 유틸리티 함수
└── App.tsx
```
