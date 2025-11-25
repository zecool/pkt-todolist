---
document_id: DOM-001
title: pkt-todolist 도메인 정의서
version: 1.5
status: Review
created_date: 2025-11-25
updated_date: 2025-11-25
author: Domain Expert (Claude Code)
reviewers:
  - name: TBD
    role: Product Owner
    status: Pending
  - name: TBD
    role: Tech Lead
    status: Pending
related_documents:
  - id: API-001
    title: REST API 명세서
    link: ../2-api-specification/README.md
  - id: DB-001
    title: 데이터베이스 스키마
    link: ../3-database-schema/README.md
  - id: TEST-001
    title: 테스트 시나리오
    link: ../4-test-scenarios/README.md
tags: [domain, requirements, specification]
---

# pkt-todolist 도메인 정의서

## 1. 프로젝트 개요

### 1.1 프로젝트명

**pkt-todolist** - 사용자 인증 기반 할일 관리 애플리케이션

### 1.2 목적

개인별 할일 관리와 공통 일정(국경일 등)을 통합하여 관리할 수 있는 웹 기반 할일 관리 시스템을 제공합니다. 사용자는 로그인 후 자신만의 할일을 생성하고, 시작일과 만료일을 설정하여 효율적으로 관리할 수 있으며, 삭제된 항목은 휴지통에서 복구 가능합니다.

### 1.3 핵심 가치

- **개인화된 할일 관리**: 사용자별로 독립적인 할일 목록 관리
- **일정 기반 관리**: 시작일과 만료일을 통한 체계적인 일정 관리
- **안전한 삭제**: 휴지통 기능을 통한 실수 방지 및 복구 가능
- **공통 일정 통합**: 국경일 등 공통 일정과 개인 할일의 통합 관리

---

## 2. 도메인 모델

### 2.1 핵심 엔티티

#### 2.1.1 User (사용자)

사용자 계정 정보를 관리하는 엔티티입니다.

**속성 명세:**

| 속성명    | 데이터 타입  | 제약사항           | 기본값                      | 설명                                 |
| --------- | ------------ | ------------------ | --------------------------- | ------------------------------------ |
| userId    | BIGINT       | PK, AUTO_INCREMENT | -                           | 사용자 고유 식별자                   |
| username  | VARCHAR(50)  | NOT NULL, UNIQUE   | -                           | 로그인용 사용자명 (3-50자)           |
| email     | VARCHAR(100) | NOT NULL, UNIQUE   | -                           | 이메일 주소 (RFC 5322 준수)          |
| password  | VARCHAR(255) | NOT NULL           | -                           | bcrypt 해시 비밀번호 (원본 최소 8자) |
| createdAt | TIMESTAMP    | NOT NULL           | CURRENT_TIMESTAMP           | 계정 생성일시                        |
| updatedAt | TIMESTAMP    | NOT NULL           | CURRENT_TIMESTAMP ON UPDATE | 최종 수정일시                        |
| isActive  | BOOLEAN      | NOT NULL           | true                        | 계정 활성화 상태                     |

**비즈니스 의미:**

- 시스템 접근 권한을 가진 주체
- 개인 할일의 소유자
- 인증 및 권한 관리의 기본 단위

---

#### 2.1.2 Todo (할일)

사용자가 관리하는 할일 항목입니다.

**속성 명세:**

| 속성명      | 데이터 타입  | 제약사항                    | 기본값                      | 설명                                       |
| ----------- | ------------ | --------------------------- | --------------------------- | ------------------------------------------ |
| todoId      | BIGINT       | PK, AUTO_INCREMENT          | -                           | 할일 고유 식별자                           |
| userId      | BIGINT       | FK (User.userId), NULL 허용 | -                           | 할일 소유자 (NULL = 공통 할일)             |
| title       | VARCHAR(200) | NOT NULL                    | -                           | 할일 제목 (trim 후 1-200자)                |
| description | TEXT(2000)   | NULL 허용                   | NULL                        | 할일 상세 내용 (최대 2000자)               |
| startDate   | DATE         | NULL 허용                   | NULL                        | 시작일 (선택 사항)                         |
| dueDate     | DATE         | NULL 허용                   | NULL                        | 만료일 (선택 사항)                         |
| status      | ENUM         | NOT NULL                    | ACTIVE                      | 할일 상태 (ACTIVE, COMPLETED, DELETED)     |
| isPublic    | BOOLEAN      | NOT NULL                    | false                       | 공통 할일 여부 (true = 공통, false = 개인) |
| createdAt   | TIMESTAMP    | NOT NULL                    | CURRENT_TIMESTAMP           | 생성일시                                   |
| updatedAt   | TIMESTAMP    | NOT NULL                    | CURRENT_TIMESTAMP ON UPDATE | 최종 수정일시                              |
| deletedAt   | TIMESTAMP    | NULL 허용                   | NULL                        | 삭제일시 (소프트 삭제)                     |

**비즈니스 의미:**

- 사용자의 개인 할일 또는 시스템 공통 일정
- 생명주기: 생성 → 활성 → 완료/삭제 → (복구) → 영구삭제

**상태 정의:**

- `ACTIVE`: 현재 진행 중인 할일
- `COMPLETED`: 완료된 할일
- `DELETED`: 휴지통에 있는 할일 (복구 가능)

**제약 조건:**

- `CHECK (startDate IS NULL OR dueDate IS NULL OR startDate <= dueDate)`: 시작일이 만료일보다 늦을 수 없음
- `CHECK (TRIM(title) != '')`: 제목은 공백만으로 구성될 수 없음
- `CHECK (isPublic = false OR userId IS NULL)`: 공통 할일은 userId가 NULL이어야 함

---

#### 2.1.3 Trash (휴지통)

삭제된 할일의 메타데이터를 관리합니다.

**속성 명세:**

| 속성명     | 데이터 타입 | 제약사항                   | 기본값            | 설명                    |
| ---------- | ----------- | -------------------------- | ----------------- | ----------------------- |
| trashId    | BIGINT      | PK, AUTO_INCREMENT         | -                 | 휴지통 항목 고유 식별자 |
| todoId     | BIGINT      | FK (Todo.todoId), UNIQUE   | -                 | 삭제된 할일 참조        |
| userId     | BIGINT      | FK (User.userId), NOT NULL | -                 | 삭제를 수행한 사용자    |
| deletedAt  | TIMESTAMP   | NOT NULL                   | CURRENT_TIMESTAMP | 삭제 일시               |
| canRestore | BOOLEAN     | NOT NULL                   | true              | 복구 가능 여부          |

**비즈니스 의미:**

- 삭제된 할일의 임시 보관소
- 실수로 인한 삭제 방지 및 복구 지원
- 삭제 히스토리 추적

---

### 2.2 엔티티 관계도

```
User (1) ----< (0..N) Todo
                       |
                       | (0..1)
                       ↓
                    Trash
```

**관계 설명:**

1. **User ↔ Todo** (1:N, 선택적)

   - 한 명의 User는 여러 개의 Todo를 소유할 수 있음
   - Todo는 최대 하나의 User에 속함 (개인 할일인 경우)
   - Todo.userId = NULL인 경우 공통 할일을 의미함
   - `ON DELETE CASCADE`: 사용자 삭제 시 해당 사용자의 할일도 삭제
   - `ON UPDATE CASCADE`: 사용자 ID 변경 시 할일도 함께 업데이트

2. **Todo ↔ Trash** (1:0..1)
   - 삭제된 Todo만 Trash 레코드를 가짐
   - status = DELETED인 Todo는 반드시 Trash 레코드 존재
   - `ON DELETE CASCADE`: Todo 영구 삭제 시 Trash도 삭제
   - UNIQUE 제약: 하나의 Todo는 하나의 Trash 레코드만 가짐

---

## 3. 주요 유스케이스

### 3.1 사용자 인증 관련

#### UC-01: 회원가입

**관련 항목:**

- **엔티티**: [User](#211-user-사용자)
- **비즈니스 규칙**: [BR-02](#br-02-사용자명-및-이메일-유일성), [BR-03](#br-03-비밀번호-보안)
- **API**: `POST /api/auth/signup`
- **에러 코드**: USER_001, USER_002, USER_003

**액터**: 미인증 사용자
**전제조건**: 없음
**주요 흐름**:

1. 사용자가 회원가입 정보(username, email, password) 입력
2. 시스템은 username과 email의 중복 여부 확인
3. 비밀번호를 bcrypt로 해싱하여 사용자 계정 생성
4. 계정 생성 완료

**후속조건**: 사용자 계정이 활성 상태(isActive = true)로 생성됨

---

#### UC-02: 로그인

**관련 항목:**

- **엔티티**: [User](#211-user-사용자)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수)
- **API**: `POST /api/auth/login`
- **에러 코드**: AUTH_001, AUTH_002

**액터**: 미인증 사용자
**전제조건**: 유효한 계정이 존재함
**주요 흐름**:

1. 사용자가 username과 password 입력
2. 시스템은 인증 정보 검증
3. 인증 성공 시 세션/토큰 발급
4. 로그인 완료

**후속조건**: 사용자가 인증된 상태로 시스템 이용 가능

---

### 3.2 할일 관리 관련

#### UC-03: 할일 목록 조회

**관련 항목:**

- **엔티티**: [Todo](#212-todo-할일), [User](#211-user-사용자)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수), [BR-13](#br-13-통합-목록-표시), [BR-14](#br-14-정렬-기준)
- **API**: `GET /api/todos`
- **에러 코드**: AUTH_001

**액터**: 인증된 사용자
**전제조건**: 사용자가 로그인된 상태
**주요 흐름**:

1. 사용자가 할일 목록 조회 요청
2. 시스템은 사용자의 개인 할일(userId = 현재 사용자) 조회
3. 시스템은 공통 할일(isPublic = true) 조회
4. 두 목록을 병합하여 반환 (status = ACTIVE 또는 COMPLETED인 항목만)
5. 만료일 기준으로 정렬하여 표시

**후속조건**: 사용자에게 개인 할일과 공통 일정이 통합된 목록 표시

---

#### UC-04: 할일 추가

**관련 항목:**

- **엔티티**: [Todo](#212-todo-할일)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수), [BR-06](#br-06-할일-제목-필수), [BR-07](#br-07-일정-유효성)
- **API**: `POST /api/todos`
- **에러 코드**: AUTH_001, TODO_001, TODO_002, TODO_003

**액터**: 인증된 사용자
**전제조건**: 사용자가 로그인된 상태
**주요 흐름**:

1. 사용자가 할일 정보(제목, 내용, 시작일, 만료일) 입력
2. 시스템은 필수 정보(제목) 검증
3. 시스템은 일정 유효성 검증 (startDate <= dueDate)
4. 현재 사용자를 소유자로 설정하여 할일 생성
5. status를 ACTIVE로 설정
6. 할일 생성 완료

**후속조건**: 새로운 할일이 사용자의 목록에 추가됨

---

#### UC-05: 할일 수정

**관련 항목:**

- **엔티티**: [Todo](#212-todo-할일)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수), [BR-04](#br-04-할일-소유권), [BR-05](#br-05-공통-할일-불변성), [BR-06](#br-06-할일-제목-필수), [BR-07](#br-07-일정-유효성)
- **API**: `PUT /api/todos/{id}`
- **에러 코드**: AUTH_001, TODO_001, TODO_002, TODO_004, TODO_005, TODO_006

**액터**: 인증된 사용자
**전제조건**:

- 사용자가 로그인된 상태
- 수정할 할일이 존재함
- 해당 할일의 소유자가 현재 사용자임 (공통 할일은 수정 불가)

**주요 흐름**:

1. 사용자가 수정할 할일 선택
2. 시스템은 소유권 검증 (userId = 현재 사용자)
3. 시스템은 공통 할일 여부 확인 (isPublic = false)
4. 사용자가 수정할 정보(제목, 내용, 시작일, 만료일) 입력
5. 시스템은 변경사항 저장 및 updatedAt 갱신
6. 수정 완료

**예외 흐름**:

- 공통 할일(isPublic = true) 수정 시도 시 TODO_005 에러 반환

**후속조건**: 할일 정보가 업데이트됨

---

#### UC-06: 할일 삭제 (휴지통으로 이동)

**관련 항목:**

- **엔티티**: [Todo](#212-todo-할일), [Trash](#213-trash-휴지통)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수), [BR-04](#br-04-할일-소유권), [BR-05](#br-05-공통-할일-불변성), [BR-08](#br-08-할일-상태-전이), [BR-09](#br-09-소프트-삭제-원칙)
- **API**: `DELETE /api/todos/{id}`
- **에러 코드**: AUTH_001, TODO_004, TODO_005, TODO_006

**액터**: 인증된 사용자
**전제조건**:

- 사용자가 로그인된 상태
- 삭제할 할일이 존재함
- 해당 할일이 개인 할일임 (공통 할일은 삭제 불가)

**주요 흐름**:

1. 사용자가 삭제할 할일 선택
2. 시스템은 isPublic 여부 확인 (공통 할일은 삭제 불가)
3. 시스템은 소유권 검증 (userId = 현재 사용자)
4. 트랜잭션 시작
5. Todo의 status를 DELETED로 변경
6. deletedAt에 현재 시각 기록
7. Trash 엔티티 생성 (canRestore = true)
8. 트랜잭션 커밋
9. 삭제 완료

**예외 흐름**:

- 공통 할일(isPublic = true) 삭제 시도 시 TODO_005 에러 반환
- 트랜잭션 실패 시 롤백

**후속조건**: 할일이 휴지통으로 이동하여 일반 목록에서 보이지 않음

---

#### UC-07: 할일 복구 (휴지통에서 복원)

**관련 항목:**

- **엔티티**: [Todo](#212-todo-할일), [Trash](#213-trash-휴지통)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수), [BR-04](#br-04-할일-소유권), [BR-08](#br-08-할일-상태-전이), [BR-10](#br-10-복구-가능성)
- **API**: `POST /api/trash/{id}/restore`
- **에러 코드**: AUTH_001, TRASH_001, TRASH_002, TODO_006

**액터**: 인증된 사용자
**전제조건**:

- 사용자가 로그인된 상태
- 휴지통에 복구할 할일이 존재함
- canRestore = true

**주요 흐름**:

1. 사용자가 휴지통에서 복구할 할일 선택
2. 시스템은 소유권 검증
3. 시스템은 canRestore 여부 확인
4. 트랜잭션 시작
5. Todo의 status를 ACTIVE로 변경
6. deletedAt을 NULL로 설정
7. Trash 엔티티 삭제
8. 트랜잭션 커밋
9. 복구 완료

**후속조건**: 할일이 일반 목록으로 복원됨

---

#### UC-08: 할일 영구 삭제

**관련 항목:**

- **엔티티**: [Todo](#212-todo-할일), [Trash](#213-trash-휴지통)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수), [BR-04](#br-04-할일-소유권), [BR-11](#br-11-영구-삭제-확인)
- **API**: `DELETE /api/trash/{id}`
- **에러 코드**: AUTH_001, TODO_004, TODO_006

**액터**: 인증된 사용자
**전제조건**:

- 사용자가 로그인된 상태
- 휴지통에 영구 삭제할 할일이 존재함

**주요 흐름**:

1. 사용자가 휴지통에서 영구 삭제할 할일 선택
2. 시스템은 소유권 검증
3. 사용자에게 확인 메시지 표시
4. 사용자 확인 후 트랜잭션 시작
5. Trash 엔티티 삭제 (CASCADE로 자동)
6. Todo 엔티티 물리적 삭제
7. 트랜잭션 커밋
8. 영구 삭제 완료

**후속조건**: 할일이 완전히 삭제되어 복구 불가능

---

#### UC-09: 휴지통 조회

**관련 항목:**

- **엔티티**: [Todo](#212-todo-할일), [Trash](#213-trash-휴지통)
- **비즈니스 규칙**: [BR-01](#br-01-사용자-인증-필수), [BR-12](#br-12-휴지통-격리)
- **API**: `GET /api/trash`
- **에러 코드**: AUTH_001

**액터**: 인증된 사용자
**전제조건**: 사용자가 로그인된 상태
**주요 흐름**:

1. 사용자가 휴지통 조회 요청
2. 시스템은 현재 사용자의 삭제된 할일 조회 (status = DELETED)
3. 삭제 일시 기준으로 정렬하여 반환
4. 각 항목의 복구 가능 여부(canRestore) 표시

**후속조건**: 사용자에게 삭제된 할일 목록 표시

---

## 4. 비즈니스 규칙

### 4.1 사용자 관련 규칙

#### BR-01: 사용자 인증 필수

- 모든 할일 관리 기능은 로그인한 사용자만 이용 가능합니다.
- 미인증 사용자는 회원가입과 로그인 기능만 접근 가능합니다.
- **검증 레이어**: Controller (Authentication Filter)
- **위반 시 에러**: AUTH_001

---

#### BR-02: 사용자명 및 이메일 유일성

- 동일한 username 또는 email로 중복 가입이 불가능합니다.
- **대소문자 처리**:
  - 저장: 입력된 대소문자 그대로 저장
  - 비교: 대소문자 구분 없이 중복 검사 (예: "User" == "user")
  - 로그인: 대소문자 구분 없이 인증
- **검증 예시**:
  - "john@example.com" 가입 후 "John@example.com" 가입 시도 → 거부 (USER_002)
  - 저장된 username: "JohnDoe", 로그인 입력: "johndoe" → 성공
- **검증 레이어**: Service (비즈니스 로직), Repository (UNIQUE 제약)
- **위반 시 에러**: USER_001 (username 중복), USER_002 (email 중복)

---

#### BR-03: 비밀번호 보안

- 비밀번호는 bcrypt 알고리즘으로 해싱되어 저장되며 평문으로 저장하지 않습니다.
- **최소 요구사항** (강제 정책):
  - 최소 8자 이상 필수
  - 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합
- **해싱 파라미터**: bcrypt cost factor = 10
- **검증 레이어**: Service (비밀번호 정책 검증), Repository (해싱 처리)
- **위반 시 에러**: USER_003

---

### 4.2 할일 관리 규칙

#### BR-04: 할일 소유권

- 개인 할일은 생성한 사용자만 조회, 수정, 삭제할 수 있습니다.
- 공통 할일(isPublic = true)은 모든 사용자가 조회할 수 있으나 수정/삭제는 불가능합니다.
- **검증 레이어**: Service (소유권 검증)
- **위반 시 에러**: TODO_004

---

#### BR-05: 공통 할일 불변성

- 국경일 등 공통 할일(isPublic = true)은 일반 사용자가 삭제하거나 수정할 수 없습니다.
- 공통 할일은 시스템 관리자만 관리할 수 있습니다.
- **구현 방법**: 향후 User.role 추가 시 ADMIN 역할만 공통 할일 관리 가능
- **검증 레이어**: Service (권한 검증)
- **위반 시 에러**: TODO_005

---

#### BR-06: 할일 제목 필수

- 모든 할일은 반드시 제목(title)을 가져야 합니다.
- **검증 규칙**:
  - NULL 값 불허
  - 빈 문자열("") 불허
  - 공백만으로 구성된 문자열(" ") 불허
  - trim() 후 최소 1자 이상 필수
  - 최대 200자 제한
- **검증 예시**:
  - " " (공백만) → 거부 (TODO_001)
  - "할일" → 허용
  - " 할일 " → trim 후 "할일"로 저장
- **검증 레이어**: Controller (Bean Validation), Service (비즈니스 검증)
- **위반 시 에러**: TODO_001

---

#### BR-07: 일정 유효성

- 시작일(startDate)이 만료일(dueDate)보다 늦을 수 없습니다.
- 시작일과 만료일은 선택 사항이나, 둘 다 입력 시 유효성 검증을 수행합니다.
- **검증 규칙**:
  - startDate = NULL, dueDate = NULL → 허용
  - startDate != NULL, dueDate = NULL → 허용
  - startDate = NULL, dueDate != NULL → 허용
  - startDate <= dueDate → 허용
  - startDate > dueDate → 거부
- **검증 레이어**: Service (비즈니스 검증), Database (CHECK 제약)
- **위반 시 에러**: TODO_002

---

#### BR-08: 할일 상태 전이

- 할일의 상태 전이는 다음과 같습니다:
  - ACTIVE → COMPLETED (완료 처리)
  - ACTIVE → DELETED (삭제)
  - COMPLETED → DELETED (삭제)
  - DELETED → ACTIVE (복구)
  - DELETED → (물리적 삭제) (영구 삭제)
- **비허용 전이**:
  - COMPLETED → ACTIVE (완료된 할일은 재활성화 불가, 삭제 후 재생성 필요)
  - DELETED → COMPLETED (삭제된 할일은 복구 후 완료 처리 가능)
- **검증 레이어**: Service (상태 전이 검증)
- **위반 시 에러**: TODO_007

---

### 4.3 휴지통 관련 규칙

#### BR-09: 소프트 삭제 원칙

- 개인 할일 삭제 시 즉시 물리적 삭제하지 않고 휴지통으로 이동합니다.
- 삭제된 할일은 status = DELETED, deletedAt에 삭제 시각이 기록됩니다.
- **검증 레이어**: Service (비즈니스 로직)

---

#### BR-10: 복구 가능성

- 휴지통의 할일은 canRestore = true인 경우에만 복구 가능합니다.
- 사용자는 자신이 삭제한 할일만 복구할 수 있습니다.
- **검증 레이어**: Service (비즈니스 검증)
- **위반 시 에러**: TRASH_001 (복구 불가), TRASH_002 (소유권 없음)

---

#### BR-11: 영구 삭제 확인

- 휴지통에서 영구 삭제 시 사용자에게 확인 메시지를 표시해야 합니다.
- 영구 삭제 후에는 복구가 불가능합니다.
- **구현 방법**: 클라이언트에서 확인 다이얼로그 표시
- **검증 레이어**: Client (UI), Service (트랜잭션 관리)

---

#### BR-12: 휴지통 격리

- 휴지통에 있는 할일(status = DELETED)은 일반 할일 목록에 표시되지 않습니다.
- 휴지통 전용 조회 기능을 통해서만 확인 가능합니다.
- **검증 레이어**: Repository (쿼리 필터링)

---

### 4.4 목록 조회 규칙

#### BR-13: 통합 목록 표시

- 할일 목록 조회 시 개인 할일과 공통 할일이 함께 표시됩니다.
- 삭제된 할일(status = DELETED)은 제외됩니다.
- **검증 레이어**: Service (비즈니스 로직), Repository (쿼리)

---

#### BR-14: 정렬 기준

- **기본 정렬**: 만료일(dueDate) 오름차순
- 만료일이 없는 항목은 목록 하단에 배치
- 동일 만료일의 경우 생성일(createdAt) 기준 정렬
- **SQL 예시**: `ORDER BY dueDate ASC NULLS LAST, createdAt ASC`
- **검증 레이어**: Repository (쿼리)

---

#### BR-15: 만료일 강조

- 만료일이 지난 할일은 시각적으로 구분하여 표시
- 만료일이 임박한 할일(D-3 이내)은 강조 표시
- **임박 기준**: `dueDate - CURRENT_DATE <= 3`
- **구현 방법**: 클라이언트에서 조건부 스타일링
- **검증 레이어**: Client (UI)

---

## 5. 기술적 고려사항

### 5.1 데이터 무결성

- User.username과 User.email에 UNIQUE 제약 조건 적용
- Todo.userId는 User.userId를 참조하는 외래키 (NULL 허용)
- Trash.todoId는 Todo.todoId를 참조하는 외래키 (UNIQUE)
- Todo에 CHECK 제약 조건 적용:
  - `CHECK (startDate IS NULL OR dueDate IS NULL OR startDate <= dueDate)`
  - `CHECK (TRIM(title) != '')`

### 5.2 성능 최적화

**인덱스 전략:**

- `CREATE INDEX idx_todo_user_status ON Todo(userId, status)`
- `CREATE INDEX idx_todo_duedate ON Todo(dueDate)`
- `CREATE UNIQUE INDEX idx_user_username ON User(LOWER(username))`
- `CREATE UNIQUE INDEX idx_user_email ON User(LOWER(email))`
- `CREATE INDEX idx_trash_deleted_at ON Trash(deletedAt)`

**쿼리 최적화:**

- N+1 쿼리 방지: Fetch Join 사용
- 페이지네이션: 목록 조회 시 LIMIT/OFFSET 적용
- 부분 인덱스: `WHERE status = 'ACTIVE'` 조건이 많은 경우 고려

### 5.3 보안

- 비밀번호는 bcrypt (cost=10) 해싱
- 세션 또는 JWT 기반 인증 구현
- SQL Injection 방어: Prepared Statement 사용
- XSS 방어: 입출력 Sanitization
- CSRF 방어: Token 검증
- Rate Limiting: 분당 60회 제한

### 5.4 동시성 및 확장성

**동시성 제어:**

- 낙관적 잠금(Optimistic Locking): Todo.updatedAt을 버전으로 사용
- 동시 수정 시 "다른 사용자가 수정했습니다" 오류 반환 (TODO_008)

**데이터 제한:**

- 할일 목록 조회: 페이지당 최대 50개 항목
- 사용자당 최대 활성 할일: 1,000개 (soft limit)
- 제목 길이: 최대 200자
- 설명 길이: 최대 2,000자

**트랜잭션 경계:**

- UC-06 (할일 삭제): Todo 상태 변경 + Trash 생성은 단일 트랜잭션
- UC-07 (할일 복구): Todo 상태 변경 + Trash 삭제는 단일 트랜잭션
- UC-08 (영구 삭제): Trash 삭제 + Todo 삭제는 단일 트랜잭션

### 5.5 경계 케이스 및 예외 처리

#### 5.5.1 휴지통 자동 정리

- 삭제 후 30일이 경과한 항목은 자동으로 영구 삭제됨
- 매일 자동 배치 작업으로 처리 (예: 매일 02:00)
- 영구 삭제 7일 전 사용자에게 알림 발송 (선택 기능)

#### 5.5.2 비활성 계정 처리

- isActive = false인 계정은 로그인 불가
- 비활성 계정의 할일은 조회/수정 불가
- 재활성화 시 모든 데이터 복원
- 비활성화 구현: 관리자 기능 또는 장기 미사용 계정

#### 5.5.3 공통 할일 관리

- 시스템 관리자만 공통 할일 생성/수정/삭제 가능
- 관리자 역할은 향후 User 엔티티에 role 속성 추가로 구현
- 공통 할일은 userId = NULL로 저장
- 공통 할일 예시: 국경일, 공휴일, 회사 전체 행사

#### 5.5.4 동시 삭제 및 복구

- 사용자 A가 할일 삭제, 사용자 B가 동시에 수정 시도:
  - 낙관적 잠금으로 B의 수정 실패 (TODO_008)
- 휴지통에서 복구 중 다른 세션에서 영구 삭제 시도:
  - 트랜잭션 격리 수준으로 방어 (READ_COMMITTED)

---

## 6. 용어 정리

### 6.1 명명 규칙

- **코드/DB 필드명**: camelCase (예: userId, startDate)
- **UI 표시명**: 한글 (예: 사용자 아이디, 시작일)
- **문서 내 병기**: 영문(한글) 형식 권장
- **상수**: UPPER_SNAKE_CASE (예: MAX_TITLE_LENGTH)
- **클래스명**: PascalCase (예: TodoService, UserRepository)

### 6.2 핵심 용어

| 영문               | 한글        | 정의                                          | 예시                       |
| ------------------ | ----------- | --------------------------------------------- | -------------------------- |
| **Todo**           | 할일        | 사용자가 관리하는 작업 항목 또는 일정         | "회의 준비"                |
| **Public Todo**    | 공통 할일   | 모든 사용자에게 표시되는 일정 (isPublic=true) | "설날", "광복절"           |
| **Private Todo**   | 개인 할일   | 특정 사용자만 소유 (isPublic=false)           | "장보기"                   |
| **Trash**          | 휴지통      | 삭제된 할일의 임시 보관 영역                  | -                          |
| **Soft Delete**    | 소프트 삭제 | 상태만 변경, 물리 데이터 보존                 | status=DELETED             |
| **Hard Delete**    | 영구 삭제   | DB에서 물리적 제거, 복구 불가                 | DELETE FROM                |
| **Due Date**       | 만료일      | 할일을 완료해야 하는 기한                     | 2025-12-31                 |
| **Start Date**     | 시작일      | 할일을 시작하는 날짜                          | 2025-11-25                 |
| **Status**         | 상태        | 할일의 현재 진행 상황                         | ACTIVE, COMPLETED, DELETED |
| **Authentication** | 인증        | 사용자 신원 확인                              | 로그인                     |
| **Authorization**  | 인가        | 사용자 권한 확인                              | 소유권 검증                |

---

## 7. 문서 버전 및 변경 이력

### 7.1 현재 버전

- **버전**: 1.5
- **작성일**: 2025-11-25
- **작성자**: Domain Expert (Claude Code)
- **검토 상태**: 검토 중 (Review)

### 7.2 변경 이력

| 버전 | 날짜       | 작성자      | 변경 내용                                                                                                                      | 영향 범위 |
| ---- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- |
| 1.5  | 2025-11-25 | Claude Code | 주요 개선: 데이터 타입 명세, 에러 코드, 테스트 케이스, 추적성 매트릭스, 구현 가이드라인, 비기능 요구사항, 영향도 매트릭스 추가 | 전체      |
| 1.0  | 2025-11-25 | Claude Code | 초기 버전 작성                                                                                                                 | 전체      |

### 7.3 검토 이력

| 날짜       | 검토자 | 역할          | 피드백 | 반영 여부 |
| ---------- | ------ | ------------- | ------ | --------- |
| 2025-11-25 | TBD    | Product Owner | TBD    | -         |
| 2025-11-25 | TBD    | Tech Lead     | TBD    | -         |

---

## 8. 추적성 매트릭스

### 8.1 요구사항 - 유스케이스 매핑

| 요구사항 ID | 요구사항 명 | 관련 유스케이스            | 우선순위 | 상태      |
| ----------- | ----------- | -------------------------- | -------- | --------- |
| REQ-001     | 사용자 인증 | UC-01, UC-02               | HIGH     | 구현 완료 |
| REQ-002     | 할일 CRUD   | UC-03, UC-04, UC-05        | HIGH     | 구현 완료 |
| REQ-003     | 안전한 삭제 | UC-06, UC-07, UC-08, UC-09 | MEDIUM   | 개발 중   |
| REQ-004     | 공통 일정   | UC-03 (부분)               | LOW      | 계획      |

### 8.2 유스케이스 - 엔티티 매핑

| 유스케이스 | 생성(C) | 조회(R)     | 수정(U) | 삭제(D)     |
| ---------- | ------- | ----------- | ------- | ----------- |
| UC-01      | User    | -           | -       | -           |
| UC-02      | -       | User        | -       | -           |
| UC-03      | -       | Todo, User  | -       | -           |
| UC-04      | Todo    | -           | -       | -           |
| UC-05      | -       | Todo        | Todo    | -           |
| UC-06      | Trash   | Todo        | Todo    | -           |
| UC-07      | -       | Todo, Trash | Todo    | Trash       |
| UC-08      | -       | Todo, Trash | -       | Todo, Trash |
| UC-09      | -       | Todo, Trash | -       | -           |

### 8.3 비즈니스 규칙 - 유스케이스 매핑

| 비즈니스 규칙 | 관련 유스케이스            | 검증 레이어         |
| ------------- | -------------------------- | ------------------- |
| BR-01         | UC-03~UC-09 (인증 필요)    | Controller          |
| BR-02         | UC-01                      | Service, Repository |
| BR-03         | UC-01                      | Service, Repository |
| BR-04         | UC-05, UC-06, UC-07, UC-08 | Service             |
| BR-05         | UC-05, UC-06               | Service             |
| BR-06         | UC-04, UC-05               | Controller, Service |
| BR-07         | UC-04, UC-05               | Service, Database   |
| BR-08         | UC-04, UC-05, UC-06, UC-07 | Service             |
| BR-09         | UC-06                      | Service             |
| BR-10         | UC-07                      | Service             |
| BR-11         | UC-08                      | Client, Service     |
| BR-12         | UC-03, UC-09               | Repository          |
| BR-13         | UC-03                      | Service, Repository |
| BR-14         | UC-03, UC-09               | Repository          |
| BR-15         | UC-03                      | Client              |

---

## 9. 구현 가이드라인

### 9.1 레이어별 책임

#### Controller Layer

**책임**: HTTP 요청/응답 처리, 인증 검증

**검증 항목**:

- BR-01: 인증 필수 (Authentication Filter)
- 입력 데이터 형식 검증 (Bean Validation)
- HTTP 상태 코드 반환
- DTO 변환 (Entity ↔ DTO)

**예시**:

```java
@PostMapping("/todos")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<TodoResponse> createTodo(
    @Valid @RequestBody CreateTodoRequest request,
    @AuthenticationPrincipal User currentUser) {
    // Validation은 @Valid로 자동 처리
    // Service 호출
}
```

#### Service Layer

**책임**: 비즈니스 로직 실행, 트랜잭션 관리

**검증 항목**:

- BR-04: 할일 소유권
- BR-05: 공통 할일 불변성
- BR-06: 할일 제목 필수
- BR-07: 일정 유효성
- BR-08: 할일 상태 전이
- BR-09~BR-12: 휴지통 규칙

**예시**:

```java
@Transactional
public TodoResponse deleteTodo(Long todoId, User currentUser) {
    Todo todo = findTodoOrThrow(todoId);
    validateOwnership(todo, currentUser); // BR-04
    validateNotPublic(todo); // BR-05

    todo.setStatus(Status.DELETED);
    todo.setDeletedAt(LocalDateTime.now());

    Trash trash = new Trash(todo, currentUser);
    trashRepository.save(trash);

    return TodoResponse.from(todo);
}
```

#### Repository Layer

**책임**: 데이터 영속성, 쿼리 실행

**제약사항 적용**:

- BR-02: UNIQUE 제약 (DB Level)
- BR-03: 비밀번호 해싱 (Save 전)
- BR-12: 쿼리 필터링 (status != DELETED)
- BR-14: 정렬 기준 적용

**예시**:

```java
@Query("SELECT t FROM Todo t WHERE " +
       "(t.userId = :userId OR t.isPublic = true) " +
       "AND t.status != 'DELETED' " +
       "ORDER BY t.dueDate ASC NULLS LAST, t.createdAt ASC")
List<Todo> findActiveTodos(@Param("userId") Long userId);
```

### 9.2 API 엔드포인트 매핑

| 유스케이스 | HTTP 메서드 | 엔드포인트              | 요청 DTO          | 응답 DTO          | 인증 필요 |
| ---------- | ----------- | ----------------------- | ----------------- | ----------------- | --------- |
| UC-01      | POST        | /api/auth/signup        | SignupRequest     | UserResponse      | ❌        |
| UC-02      | POST        | /api/auth/login         | LoginRequest      | TokenResponse     | ❌        |
| UC-03      | GET         | /api/todos              | -                 | TodoListResponse  | ✅        |
| UC-04      | POST        | /api/todos              | CreateTodoRequest | TodoResponse      | ✅        |
| UC-05      | PUT         | /api/todos/{id}         | UpdateTodoRequest | TodoResponse      | ✅        |
| UC-06      | DELETE      | /api/todos/{id}         | -                 | SuccessResponse   | ✅        |
| UC-07      | POST        | /api/trash/{id}/restore | -                 | TodoResponse      | ✅        |
| UC-08      | DELETE      | /api/trash/{id}         | -                 | SuccessResponse   | ✅        |
| UC-09      | GET         | /api/trash              | -                 | TrashListResponse | ✅        |

### 9.3 에러 코드 정의

| 에러 코드     | HTTP Status | 메시지                                        | 관련 BR | 발생 UC                    |
| ------------- | ----------- | --------------------------------------------- | ------- | -------------------------- |
| **AUTH_001**  | 401         | 인증이 필요합니다                             | BR-01   | 모든 인증 필요 UC          |
| **AUTH_002**  | 401         | 잘못된 인증 정보입니다                        | -       | UC-02                      |
| **USER_001**  | 409         | 이미 존재하는 사용자명입니다                  | BR-02   | UC-01                      |
| **USER_002**  | 409         | 이미 존재하는 이메일입니다                    | BR-02   | UC-01                      |
| **USER_003**  | 400         | 비밀번호 정책을 만족하지 않습니다             | BR-03   | UC-01                      |
| **TODO_001**  | 400         | 할일 제목은 필수입니다                        | BR-06   | UC-04, UC-05               |
| **TODO_002**  | 400         | 시작일이 만료일보다 늦습니다                  | BR-07   | UC-04, UC-05               |
| **TODO_003**  | 400         | 제목 길이는 200자를 초과할 수 없습니다        | -       | UC-04, UC-05               |
| **TODO_004**  | 403         | 할일 소유자만 접근 가능합니다                 | BR-04   | UC-05, UC-06, UC-07, UC-08 |
| **TODO_005**  | 403         | 공통 할일은 수정/삭제할 수 없습니다           | BR-05   | UC-05, UC-06               |
| **TODO_006**  | 404         | 할일을 찾을 수 없습니다                       | -       | UC-05, UC-06, UC-07, UC-08 |
| **TODO_007**  | 400         | 허용되지 않은 상태 전이입니다                 | BR-08   | UC-05                      |
| **TODO_008**  | 409         | 다른 사용자가 수정했습니다 (낙관적 잠금 충돌) | -       | UC-05                      |
| **TRASH_001** | 400         | 복구할 수 없는 항목입니다                     | BR-10   | UC-07                      |
| **TRASH_002** | 403         | 자신이 삭제한 항목만 복구 가능합니다          | BR-10   | UC-07                      |

### 9.4 검증 순서 및 우선순위

#### 요청 검증 파이프라인

```
1. 인증 검증 (BR-01)
   ↓ 실패 시 → 401 Unauthorized (AUTH_001)

2. 형식 검증 (Field Validation)
   - 필수 필드 존재 여부
   - 데이터 타입 일치
   - 길이 제한
   ↓ 실패 시 → 400 Bad Request

3. 비즈니스 규칙 검증 (Service Layer)
   - BR-02: 유일성 제약
   - BR-04: 소유권 검증
   - BR-05: 불변성 검증
   - BR-06: 제목 필수
   - BR-07: 일정 유효성
   ↓ 실패 시 → 400/403/409 (규칙에 따라)

4. 비즈니스 로직 실행
   ↓ 성공 시 → 200/201
```

#### 여러 규칙 위반 시 처리

- **원칙**: 필드별 오류는 모두 수집하여 반환 (Validation Errors)
- **형식**: 첫 번째 검출된 오류만 반환 (Fast Fail)

**응답 예시**:

```json
{
  "status": 400,
  "error": "VALIDATION_ERROR",
  "timestamp": "2025-11-25T10:30:00",
  "errors": [
    {
      "field": "title",
      "code": "TODO_001",
      "message": "할일 제목은 필수입니다"
    },
    {
      "field": "dueDate",
      "code": "TODO_002",
      "message": "시작일이 만료일보다 늦습니다"
    }
  ]
}
```

---

## 10. 테스트 케이스

### 10.1 유스케이스별 테스트 시나리오

#### UC-04: 할일 추가

**정상 시나리오 (Happy Path)**

| 테스트 ID | 입력                                                                   | 예상 결과                          | 검증 BR      |
| --------- | ---------------------------------------------------------------------- | ---------------------------------- | ------------ |
| TC-04-001 | title="회의", desc="팀 회의", startDate=2025-11-26, dueDate=2025-11-30 | 201 Created, Todo 생성             | BR-06, BR-07 |
| TC-04-002 | title="장보기", desc=null, startDate=null, dueDate=null                | 201 Created, 일정 없는 Todo 생성   | BR-06        |
| TC-04-003 | title="메모", startDate=2025-11-25, dueDate=2025-11-25                 | 201 Created, 시작일=만료일 허용    | BR-07        |
| TC-04-004 | title=" 할일 " (앞뒤 공백)                                             | 201 Created, trim 후 "할일"로 저장 | BR-06        |

**예외 시나리오 (Exception Path)**

| 테스트 ID | 입력                                     | 예상 결과        | 검증 BR | 에러 코드 |
| --------- | ---------------------------------------- | ---------------- | ------- | --------- |
| TC-04-101 | title=null                               | 400 Bad Request  | BR-06   | TODO_001  |
| TC-04-102 | title=""                                 | 400 Bad Request  | BR-06   | TODO_001  |
| TC-04-103 | title=" " (공백만)                       | 400 Bad Request  | BR-06   | TODO_001  |
| TC-04-104 | startDate=2025-12-01, dueDate=2025-11-30 | 400 Bad Request  | BR-07   | TODO_002  |
| TC-04-105 | 미인증 요청                              | 401 Unauthorized | BR-01   | AUTH_001  |

**경계값 테스트**

| 테스트 ID | 입력                 | 예상 결과       | 검증 항목                 |
| --------- | -------------------- | --------------- | ------------------------- |
| TC-04-201 | title="a" (1자)      | 201 Created     | 최소 길이                 |
| TC-04-202 | title=(200자 문자열) | 201 Created     | 최대 길이                 |
| TC-04-203 | title=(201자 문자열) | 400 Bad Request | 최대 길이 초과 (TODO_003) |
| TC-04-204 | description=(2000자) | 201 Created     | 최대 길이                 |
| TC-04-205 | description=(2001자) | 400 Bad Request | 최대 길이 초과            |

---

#### UC-05: 할일 수정

**정상 시나리오**

| 테스트 ID | 입력                      | 예상 결과              | 검증 BR |
| --------- | ------------------------- | ---------------------- | ------- |
| TC-05-001 | 소유자가 자신의 할일 수정 | 200 OK, Todo 수정됨    | BR-04   |
| TC-05-002 | title 변경                | 200 OK, updatedAt 갱신 | BR-06   |

**예외 시나리오**

| 테스트 ID | 입력                         | 예상 결과     | 검증 BR | 에러 코드 |
| --------- | ---------------------------- | ------------- | ------- | --------- |
| TC-05-101 | 다른 사용자의 할일 수정 시도 | 403 Forbidden | BR-04   | TODO_004  |
| TC-05-102 | 공통 할일 수정 시도          | 403 Forbidden | BR-05   | TODO_005  |
| TC-05-103 | 존재하지 않는 할일 수정      | 404 Not Found | -       | TODO_006  |
| TC-05-104 | 동시 수정 충돌               | 409 Conflict  | -       | TODO_008  |

---

#### UC-06: 할일 삭제

**정상 시나리오**

| 테스트 ID | 입력                       | 예상 결과                          | 검증 BR      |
| --------- | -------------------------- | ---------------------------------- | ------------ |
| TC-06-001 | 소유자가 자신의 할일 삭제  | 200 OK, status=DELETED, Trash 생성 | BR-04, BR-09 |
| TC-06-002 | 삭제 후 일반 목록에서 제외 | 200 OK, UC-03에서 미표시           | BR-12        |

**예외 시나리오**

| 테스트 ID | 입력                         | 예상 결과     | 검증 BR | 에러 코드 |
| --------- | ---------------------------- | ------------- | ------- | --------- |
| TC-06-101 | 공통 할일 삭제 시도          | 403 Forbidden | BR-05   | TODO_005  |
| TC-06-102 | 다른 사용자의 할일 삭제 시도 | 403 Forbidden | BR-04   | TODO_004  |

---

### 10.2 통합 테스트 시나리오

#### 시나리오 1: 할일 전체 생명주기

```
사용자 행동:
1. 회원가입 (UC-01) → 201 Created
2. 로그인 (UC-02) → 200 OK, token 발급
3. 할일 추가 "회의 준비" (UC-04) → 201 Created
4. 할일 목록 조회 (UC-03) → 200 OK, "회의 준비" 표시 확인
5. 할일 수정 "팀 회의 준비"로 변경 (UC-05) → 200 OK
6. 할일 삭제 (UC-06) → 200 OK, 휴지통 이동
7. 할일 목록 조회 (UC-03) → 200 OK, "팀 회의 준비" 미표시 확인
8. 휴지통 조회 (UC-09) → 200 OK, "팀 회의 준비" 표시 확인
9. 할일 복구 (UC-07) → 200 OK
10. 할일 목록 조회 (UC-03) → 200 OK, "팀 회의 준비" 재표시 확인
11. 할일 삭제 (UC-06) → 200 OK, 휴지통 이동
12. 영구 삭제 (UC-08) → 200 OK
13. 휴지통 조회 (UC-09) → 200 OK, 항목 없음 확인
```

**검증 포인트**:

- 각 단계의 HTTP 상태 코드
- 데이터베이스 상태 일관성
- 트랜잭션 롤백 시나리오

---

#### 시나리오 2: 동시성 충돌

```
사용자 A와 B가 동시에 같은 할일 수정:

1. A가 할일 조회 (updatedAt = T1)
2. B가 할일 조회 (updatedAt = T1)
3. A가 할일 수정 요청 (updatedAt = T1 전송)
   → 200 OK, updatedAt = T2로 업데이트
4. B가 할일 수정 요청 (updatedAt = T1 전송)
   → 409 Conflict (TODO_008)
   → "다른 사용자가 수정했습니다. 새로고침 후 다시 시도하세요."
```

**검증 포인트**:

- 낙관적 잠금 동작 확인
- 데이터 정합성 유지
- 적절한 에러 메시지

---

#### 시나리오 3: 권한 검증

```
사용자 A와 B가 있을 때:

1. A가 할일 "A의 할일" 생성 (UC-04) → 201 Created
2. B가 "A의 할일" 수정 시도 (UC-05) → 403 Forbidden (TODO_004)
3. B가 "A의 할일" 삭제 시도 (UC-06) → 403 Forbidden (TODO_004)
4. 관리자가 공통 할일 "설날" 생성 → 201 Created
5. A가 "설날" 수정 시도 (UC-05) → 403 Forbidden (TODO_005)
6. A가 "설날" 삭제 시도 (UC-06) → 403 Forbidden (TODO_005)
7. A가 "설날" 조회 (UC-03) → 200 OK, "설날" 표시 확인
```

**검증 포인트**:

- 소유권 검증 (BR-04)
- 공통 할일 불변성 (BR-05)
- 공통 할일 조회 가능 확인

---

## 11. 비기능 요구사항

### 11.1 성능 요구사항

| 항목             | 목표            | 측정 방법      | 검증 방법                |
| ---------------- | --------------- | -------------- | ------------------------ |
| API 응답 시간    | 평균 200ms 이하 | 95 percentile  | JMeter 부하 테스트       |
| 할일 목록 조회   | 100ms 이하      | 50개 항목 기준 | 성능 프로파일링          |
| 동시 사용자      | 100명           | 동시 요청 처리 | Apache Bench             |
| DB 쿼리 시간     | 50ms 이하       | N+1 쿼리 방지  | Query Profiling, EXPLAIN |
| 페이지 로드 시간 | 2초 이하        | 초기 로딩      | Lighthouse               |

### 11.2 가용성 요구사항

| 항목            | 목표                              | 검증 방법       |
| --------------- | --------------------------------- | --------------- |
| Uptime          | 99% (월 7.2시간 다운타임 허용)    | 모니터링 시스템 |
| 데이터 백업     | 일 1회 자동 백업                  | 백업 스크립트   |
| 복구 시간 (RTO) | 1시간 이내                        | DR 테스트       |
| 복구 시점 (RPO) | 1일 이내 (최대 1일치 데이터 손실) | 백업 정책       |

### 11.3 보안 요구사항

| 항목          | 요구사항                | 검증 방법              |
| ------------- | ----------------------- | ---------------------- |
| 비밀번호 해싱 | bcrypt cost=10          | 코드 리뷰, 단위 테스트 |
| SQL Injection | Prepared Statement 사용 | 정적 분석, 침투 테스트 |
| XSS           | 입출력 Sanitization     | 보안 스캔              |
| CSRF          | Token 검증              | 침투 테스트            |
| Rate Limiting | 분당 60회 제한          | 부하 테스트            |
| HTTPS         | TLS 1.2 이상            | SSL Labs 테스트        |
| 세션 타임아웃 | 30분 비활동 시 로그아웃 | 기능 테스트            |

### 11.4 호환성 요구사항

| 항목         | 지원 범위                                     | 검증 방법              |
| ------------ | --------------------------------------------- | ---------------------- |
| 브라우저     | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ | 크로스 브라우저 테스트 |
| 모바일       | iOS 14+, Android 10+                          | 모바일 디바이스 테스트 |
| 화면 해상도  | 1024x768 이상                                 | 반응형 테스트          |
| 데이터베이스 | PostgreSQL 13+, MySQL 8+                      | 통합 테스트            |

### 11.5 확장성 요구사항

- 향후 Todo 카테고리, 태그, 우선순위 등 추가 속성 확장 가능
- 공유 할일, 협업 기능 등으로 확장 가능
- 알림, 반복 일정 등 고급 기능 추가 가능
- 마이크로서비스 아키텍처로 전환 가능한 모듈 구조

---

## 12. 영향도 매트릭스

### 12.1 엔티티 변경 영향도

#### User 엔티티 변경 시

| 변경 유형          | 영향받는 UC  | 영향받는 BR  | 영향받는 API                                | 비고                 |
| ------------------ | ------------ | ------------ | ------------------------------------------- | -------------------- |
| username 길이 변경 | UC-01, UC-02 | BR-02        | POST /api/auth/signup, POST /api/auth/login | DB 마이그레이션 필요 |
| role 필드 추가     | 모든 UC      | BR-01, BR-05 | 모든 인증 필요 API                          | 권한 체계 전면 개편  |
| isActive 로직 변경 | UC-02        | BR-01        | POST /api/auth/login                        | 세션 관리 영향       |

#### Todo 엔티티 변경 시

| 변경 유형          | 영향받는 UC         | 영향받는 BR  | 영향받는 API                                         | 비고                 |
| ------------------ | ------------------- | ------------ | ---------------------------------------------------- | -------------------- |
| priority 필드 추가 | UC-03, UC-04, UC-05 | BR-14 (정렬) | GET /api/todos, POST /api/todos, PUT /api/todos/{id} | 정렬 로직 변경       |
| category 필드 추가 | UC-03, UC-04, UC-05 | -            | 모든 Todo API                                        | 필터링 기능 추가     |
| title 길이 변경    | UC-04, UC-05        | BR-06        | POST /api/todos, PUT /api/todos/{id}                 | DB 마이그레이션 필요 |
| repeatPattern 추가 | UC-04, UC-05        | 새 BR 필요   | 모든 Todo API                                        | 반복 일정 기능       |

#### Trash 엔티티 변경 시

| 변경 유형       | 영향받는 UC  | 영향받는 BR       | 영향받는 API                           | 비고           |
| --------------- | ------------ | ----------------- | -------------------------------------- | -------------- |
| expiryDate 추가 | UC-06, UC-09 | 새 BR (자동 삭제) | DELETE /api/todos/{id}, GET /api/trash | 배치 작업 필요 |

### 12.2 비즈니스 규칙 변경 영향도

| BR    | 영향받는 UC                | 영향받는 엔티티 | 테스트 변경             | 문서 변경                 |
| ----- | -------------------------- | --------------- | ----------------------- | ------------------------- |
| BR-01 | 모든 인증 필요 UC          | User            | 모든 인증 테스트        | API 명세서, 사용자 가이드 |
| BR-06 | UC-04, UC-05               | Todo            | TC-04-101~103, TC-05-xx | API 명세서, 사용자 가이드 |
| BR-07 | UC-04, UC-05               | Todo            | TC-04-104, TC-05-xx     | API 명세서                |
| BR-08 | UC-04, UC-05, UC-06, UC-07 | Todo            | 상태 전이 테스트 전체   | 도메인 정의서, API 명세서 |

### 12.3 API 변경 영향도

| API 변경                       | 영향받는 UC | 영향받는 클라이언트   | 버전 관리               |
| ------------------------------ | ----------- | --------------------- | ----------------------- |
| POST /api/todos 요청 필드 추가 | UC-04       | 프론트엔드, 모바일 앱 | 하위 호환 (선택 필드)   |
| GET /api/todos 응답 형식 변경  | UC-03       | 모든 클라이언트       | 버전업 필요 (/v2/todos) |
| 에러 코드 변경                 | 모든 UC     | 에러 처리 로직        | 문서 업데이트           |

---

## 13. 문서 업데이트 체크리스트

### 13.1 엔티티 변경 시

- [ ] 2.1 핵심 엔티티 섹션 업데이트
- [ ] 속성 명세 테이블 수정
- [ ] 관련 UC의 입출력 확인
- [ ] 비즈니스 규칙 영향도 검토
- [ ] 12.1 영향도 매트릭스 업데이트
- [ ] API 명세서 동기화 (관련 문서)
- [ ] DB 스키마 동기화 (관련 문서)
- [ ] 테스트 케이스 업데이트
- [ ] 마이그레이션 스크립트 작성
- [ ] 변경 이력(7.2) 기록

### 13.2 유스케이스 변경 시

- [ ] 3. 주요 유스케이스 섹션 업데이트
- [ ] 관련 엔티티 영향도 확인
- [ ] 비즈니스 규칙 추가/수정 확인
- [ ] 8.1, 8.2 추적성 매트릭스 업데이트
- [ ] 9.2 API 엔드포인트 매핑 업데이트
- [ ] 테스트 시나리오 업데이트
- [ ] 사용자 가이드 업데이트 (관련 문서)
- [ ] 변경 이력(7.2) 기록

### 13.3 비즈니스 규칙 변경 시

- [ ] 4. 비즈니스 규칙 섹션 업데이트
- [ ] 영향받는 UC 식별 및 업데이트
- [ ] 8.3 BR-UC 매핑 업데이트
- [ ] 9.1 레이어별 책임 업데이트
- [ ] 검증 로직 구현 확인
- [ ] 9.3 에러 코드 추가/수정
- [ ] 10.1 테스트 케이스 업데이트
- [ ] 릴리스 노트 작성
- [ ] 변경 이력(7.2) 기록

### 13.4 API 변경 시

- [ ] 9.2 API 엔드포인트 매핑 업데이트
- [ ] API 명세서 동기화 (관련 문서)
- [ ] 9.3 에러 코드 정의 업데이트
- [ ] 클라이언트 영향도 분석
- [ ] 버전 관리 전략 수립
- [ ] 테스트 케이스 업데이트
- [ ] 변경 이력(7.2) 기록

---

## 14. 다음 단계

### 14.1 즉시 조치 항목

1. **Product Owner 검토**: 도메인 정의서 승인
2. **Tech Lead 검토**: 기술적 타당성 검토
3. **API 명세서 작성**: 9.2 API 엔드포인트 기반
4. **DB 스키마 설계**: 2.1 엔티티 명세 기반

### 14.2 후속 문서 작성

- [ ] REST API 명세서 (OpenAPI/Swagger)
- [ ] 데이터베이스 스키마 및 마이그레이션 계획
- [ ] 테스트 시나리오 상세 명세
- [ ] 사용자 매뉴얼
- [ ] 개발 환경 구축 가이드

### 14.3 구현 우선순위

**Phase 1 - MVP (최소 기능 제품)**:

- UC-01, UC-02: 사용자 인증
- UC-03, UC-04, UC-05: 할일 CRUD
- 기본 보안 (bcrypt, JWT)

**Phase 2 - 안전한 삭제**:

- UC-06, UC-07, UC-08, UC-09: 휴지통 기능
- 트랜잭션 관리

**Phase 3 - 공통 일정**:

- 관리자 기능
- 공통 할일 관리

---

## 부록

### A. 참고 자료

- [RFC 5322 - Internet Message Format](https://tools.ietf.org/html/rfc5322) (이메일 형식)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) (보안 가이드라인)
- [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) (비밀번호 해싱)

### B. 용어 약어

| 약어  | 전체 명칭                         |
| ----- | --------------------------------- |
| UC    | Use Case (유스케이스)             |
| BR    | Business Rule (비즈니스 규칙)     |
| PK    | Primary Key (기본키)              |
| FK    | Foreign Key (외래키)              |
| API   | Application Programming Interface |
| CRUD  | Create, Read, Update, Delete      |
| DTO   | Data Transfer Object              |
| JWT   | JSON Web Token                    |
| TLS   | Transport Layer Security          |
| HTTPS | HTTP Secure                       |
| SQL   | Structured Query Language         |

---

**문서 끝**
