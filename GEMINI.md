# pkt-todolist 프로젝트 컨텍스트

## 프로젝트 개요

**pkt-todolist**는 사용자 인증 기반의 할일 관리 애플리케이션으로, 안전하고 통합된 일정 관리 경험을 제공합니다.

- **목표**: 개인 할일과 공통 일정(국경일 등)을 함께 관리하며, 실수로 인한 삭제를 방지합니다.
- **핵심 가치**:
  - **안전한 삭제**: 휴지통 기능을 통한 "소프트 삭제" 메커니즘 (30일 보관).
  - **통합 뷰**: 개인 할일과 공통 일정을 하나의 화면에서 관리.
  - **시간 기반**: 시작일과 만료일을 통한 효과적인 시간 관리.

## 현재 상태: 기획 및 설계 단계

프로젝트는 현재 **기획 단계**에 있습니다. PRD(Product Requirements Document)와 도메인 정의서가 완료되었으며, 구현(코딩)은 아직 시작되지 않았습니다.

## 기술 스택 (계획)

- **프론트엔드**: React 18+ (Vite), Tailwind CSS, Zustand, React Router, Axios
- **백엔드**: Node.js 18+, Express.js, Prisma ORM, JWT 인증
- **데이터베이스**: PostgreSQL (Supabase)
- **인프라**: Vercel (프론트엔드 + 백엔드)

## 아키텍처 및 핵심 엔티티

`docs/1-domain-definition.md` 기반:

- **User (사용자)**: `userId`, `email`, `password` (bcrypt), `username`, `role`
- **Todo (할일)**: `todoId`, `userId`, `title`, `content`, `startDate`, `dueDate`, `status` (ACTIVE, COMPLETED, DELETED), `isCompleted`
- **Holiday (국경일)**: `holidayId`, `title`, `date`, `description`, `isRecurring`

## 디렉터리 구조

- `docs/`: 프로젝트 문서 포함
  - `1-domain-definition.md`: 상세한 도메인 모델, 엔티티, 비즈니스 규칙, 유스케이스
  - `3-prd.md`: 제품 요구사항 문서 (비전, 사용자 페르소나, 기능, 로드맵)
  - `6-erd.md`: 데이터 모델 ERD (Mermaid 형식)
- `database/`: 데이터베이스 스키마
  - `schema.sql`: PostgreSQL DDL 스크립트
- `README.md`: 프로젝트 진입점

## 개발 규칙 (계획)

- **스타일**:
  - **프론트엔드**: 함수형 컴포넌트, Hooks, 유틸리티 우선 CSS (Tailwind)
  - **백엔드**: 계층형 아키텍처 (Controller -> Service -> Repository)
- **커밋 전략**: Git flow, feature 브랜치 (`feature/*`)
- **테스트**:
  - 프론트엔드: Vitest, React Testing Library
  - 백엔드: Jest

## 다음 단계 (즉시)

1.  **환경 설정**: React (프론트엔드) 및 Express (백엔드) 프로젝트 초기화
2.  **데이터베이스 구축**: 도메인 정의 기반 SQL DDL 실행
3.  **구현 1단계**: 사용자 인증 (회원가입/로그인) 및 기본 할일 CRUD 집중

## 반드시 지켜야할 것

- 모든 입출력은 한국어로 할것
- 오버엔지니어링 금지
