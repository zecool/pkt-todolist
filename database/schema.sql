-- ============================================================
-- pkt-todolist Database Schema (PostgreSQL)
-- ============================================================
-- Version: 1.0
-- Created: 2025-11-26
-- Description: pkt-todolist 애플리케이션의 데이터베이스 스키마
-- PostgreSQL 15+ 호환
-- ============================================================

-- ============================================================
-- 1. 데이터베이스 생성 (선택)
-- ============================================================
-- CREATE DATABASE pkt_todolist
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'ko_KR.UTF-8'
--     LC_CTYPE = 'ko_KR.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- \c pkt_todolist;

-- ============================================================
-- 2. 확장 기능 활성화
-- ============================================================

-- UUID 생성을 위한 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 3. ENUM 타입 정의
-- ============================================================

-- 사용자 역할 ENUM
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- 할일 상태 ENUM
CREATE TYPE "TodoStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DELETED');

-- ============================================================
-- 4. 테이블 생성
-- ============================================================

-- ------------------------------------------------------------
-- 4.1 사용자 테이블 (users)
-- ------------------------------------------------------------
CREATE TABLE users (
    "userId"    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    username    VARCHAR(100) NOT NULL,
    role        "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    -- 제약 조건
    CONSTRAINT CK_User_Email_NotEmpty CHECK (email <> ''),
    CONSTRAINT CK_User_Password_NotEmpty CHECK (password <> ''),
    CONSTRAINT CK_User_Username_NotEmpty CHECK (username <> '')
);

-- users 테이블 주석
COMMENT ON TABLE users IS '시스템 사용자 정보';
COMMENT ON COLUMN users."userId" IS '사용자 고유 ID (UUID)';
COMMENT ON COLUMN users.email IS '로그인 이메일 (고유)';
COMMENT ON COLUMN users.password IS 'bcrypt 해시된 비밀번호';
COMMENT ON COLUMN users.username IS '사용자 이름';
COMMENT ON COLUMN users.role IS '사용자 역할 (USER, ADMIN)';
COMMENT ON COLUMN users."createdAt" IS '가입일시';
COMMENT ON COLUMN users."updatedAt" IS '최종 수정일시';

-- ------------------------------------------------------------
-- 4.2 할일 테이블 (todos)
-- ------------------------------------------------------------
CREATE TABLE todos (
    "todoId"      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId"      UUID NOT NULL,
    title         VARCHAR(200) NOT NULL,
    content       TEXT,
    "startDate"   DATE,
    "dueDate"     DATE,
    status        "TodoStatus" NOT NULL DEFAULT 'ACTIVE',
    "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
    "deletedAt"   TIMESTAMP,

    -- 제약 조건
    CONSTRAINT CK_Todo_Title_NotEmpty CHECK (title <> ''),
    CONSTRAINT CK_Todo_Title_Length CHECK (LENGTH(title) <= 200),
    CONSTRAINT CK_Todo_DateRange CHECK ("dueDate" IS NULL OR "startDate" IS NULL OR "dueDate" >= "startDate"),

    -- 외래키 제약
    CONSTRAINT FK_Todo_User FOREIGN KEY ("userId")
        REFERENCES users("userId") ON DELETE CASCADE
);

-- todos 테이블 주석
COMMENT ON TABLE todos IS '사용자별 할일 정보';
COMMENT ON COLUMN todos."todoId" IS '할일 고유 ID (UUID)';
COMMENT ON COLUMN todos."userId" IS '소유자 ID (users 테이블 참조)';
COMMENT ON COLUMN todos.title IS '할일 제목 (최대 200자)';
COMMENT ON COLUMN todos.content IS '할일 상세 내용';
COMMENT ON COLUMN todos."startDate" IS '시작일';
COMMENT ON COLUMN todos."dueDate" IS '만료일 (시작일 이후)';
COMMENT ON COLUMN todos.status IS '할일 상태 (ACTIVE, COMPLETED, DELETED)';
COMMENT ON COLUMN todos."isCompleted" IS '완료 여부';
COMMENT ON COLUMN todos."createdAt" IS '생성일시';
COMMENT ON COLUMN todos."updatedAt" IS '최종 수정일시';
COMMENT ON COLUMN todos."deletedAt" IS '삭제일시 (소프트 삭제)';

-- ------------------------------------------------------------
-- 4.3 국경일 테이블 (holidays)
-- ------------------------------------------------------------
CREATE TABLE holidays (
    "holidayId"   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title         VARCHAR(100) NOT NULL,
    date          DATE NOT NULL,
    description   TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),

    -- 제약 조건
    CONSTRAINT CK_Holiday_Title_NotEmpty CHECK (title <> ''),
    CONSTRAINT CK_Holiday_Title_Length CHECK (LENGTH(title) <= 100)
);

-- holidays 테이블 주석
COMMENT ON TABLE holidays IS '공통 국경일 정보';
COMMENT ON COLUMN holidays."holidayId" IS '국경일 고유 ID (UUID)';
COMMENT ON COLUMN holidays.title IS '국경일 이름 (최대 100자)';
COMMENT ON COLUMN holidays.date IS '국경일 날짜';
COMMENT ON COLUMN holidays.description IS '국경일 설명';
COMMENT ON COLUMN holidays."isRecurring" IS '매년 반복 여부';
COMMENT ON COLUMN holidays."createdAt" IS '생성일시';
COMMENT ON COLUMN holidays."updatedAt" IS '최종 수정일시';

-- ============================================================
-- 5. 인덱스 생성
-- ============================================================

-- ------------------------------------------------------------
-- 5.1 users 테이블 인덱스
-- ------------------------------------------------------------
-- 이메일은 UNIQUE 제약으로 자동 인덱스 생성됨
CREATE INDEX idx_users_role ON users(role);

-- ------------------------------------------------------------
-- 5.2 todos 테이블 인덱스
-- ------------------------------------------------------------
-- 사용자별 상태 조회를 위한 복합 인덱스
CREATE INDEX idx_todos_userId_status ON todos("userId", status);

-- 만료일 기준 정렬을 위한 인덱스
CREATE INDEX idx_todos_dueDate ON todos("dueDate");

-- 휴지통 조회를 위한 인덱스
CREATE INDEX idx_todos_deletedAt ON todos("deletedAt");

-- ------------------------------------------------------------
-- 5.3 holidays 테이블 인덱스
-- ------------------------------------------------------------
-- 날짜 기준 조회를 위한 인덱스
CREATE INDEX idx_holidays_date ON holidays(date);

-- ============================================================
-- 6. 트리거 함수 (자동 updatedAt 갱신)
-- ============================================================

-- updatedAt 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블 트리거
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- todos 테이블 트리거
CREATE TRIGGER trigger_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- holidays 테이블 트리거
CREATE TRIGGER trigger_holidays_updated_at
    BEFORE UPDATE ON holidays
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. 샘플 데이터 (개발/테스트용)
-- ============================================================
-- 주의: 프로덕션 환경에서는 이 섹션을 실행하지 마세요!

-- ------------------------------------------------------------
-- 7.1 사용자 샘플 데이터
-- ------------------------------------------------------------
-- 비밀번호: 'password123' (bcrypt 해시 예시)
-- 실제 사용 시 bcrypt로 해시된 비밀번호를 사용해야 합니다

INSERT INTO users ("userId", email, password, username, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@example.com', '$2b$10$YourHashedPasswordHere', '관리자', 'ADMIN'),
('550e8400-e29b-41d4-a716-446655440001', 'user@example.com', '$2b$10$YourHashedPasswordHere', '홍길동', 'USER'),
('550e8400-e29b-41d4-a716-446655440002', 'test@example.com', '$2b$10$YourHashedPasswordHere', '테스트유저', 'USER')
ON CONFLICT ("userId") DO NOTHING;

-- ------------------------------------------------------------
-- 7.2 할일 샘플 데이터
-- ------------------------------------------------------------
INSERT INTO todos ("todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted") VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '프로젝트 마감', 'PRD 작성 완료하기', '2025-11-25', '2025-11-28', 'ACTIVE', false),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '회의 준비', '발표 자료 준비', '2025-11-26', '2025-11-27', 'COMPLETED', true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '백엔드 개발', 'API 구현 및 테스트', '2025-11-26', '2025-11-27', 'ACTIVE', false),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '프론트엔드 개발', 'React 컴포넌트 작성', '2025-11-27', '2025-11-28', 'ACTIVE', false)
ON CONFLICT ("todoId") DO NOTHING;

-- ------------------------------------------------------------
-- 7.3 국경일 샘플 데이터 (2025년 대한민국 공휴일)
-- ------------------------------------------------------------
INSERT INTO holidays ("holidayId", title, date, description, "isRecurring") VALUES
('770e8400-e29b-41d4-a716-446655440000', '신정', '2025-01-01', '새해 첫날', true),
('770e8400-e29b-41d4-a716-446655440001', '설날', '2025-01-28', '음력 1월 1일 (설날 연휴 시작)', true),
('770e8400-e29b-41d4-a716-446655440002', '설날', '2025-01-29', '음력 1월 1일 (설날)', true),
('770e8400-e29b-41d4-a716-446655440003', '설날', '2025-01-30', '음력 1월 1일 (설날 연휴 종료)', true),
('770e8400-e29b-41d4-a716-446655440004', '삼일절', '2025-03-01', '3.1 독립운동 기념일', true),
('770e8400-e29b-41d4-a716-446655440005', '어린이날', '2025-05-05', '어린이날', true),
('770e8400-e29b-41d4-a716-446655440006', '부처님오신날', '2025-05-05', '음력 4월 8일', true),
('770e8400-e29b-41d4-a716-446655440007', '현충일', '2025-06-06', '국가를 위해 희생한 분들을 추모하는 날', true),
('770e8400-e29b-41d4-a716-446655440008', '광복절', '2025-08-15', '대한민국 독립 기념일', true),
('770e8400-e29b-41d4-a716-446655440009', '추석', '2025-10-05', '음력 8월 15일 (추석 연휴 시작)', true),
('770e8400-e29b-41d4-a716-446655440010', '추석', '2025-10-06', '음력 8월 15일 (추석)', true),
('770e8400-e29b-41d4-a716-446655440011', '추석', '2025-10-07', '음력 8월 15일 (추석 연휴 종료)', true),
('770e8400-e29b-41d4-a716-446655440012', '개천절', '2025-10-03', '대한민국 건국 기념일', true),
('770e8400-e29b-41d4-a716-446655440013', '한글날', '2025-10-09', '한글 창제 기념일', true),
('770e8400-e29b-41d4-a716-446655440014', '크리스마스', '2025-12-25', '성탄절', true)
ON CONFLICT ("holidayId") DO NOTHING;

-- ============================================================
-- 8. 뷰 (선택)
-- ============================================================

-- 활성 할일 조회 뷰
CREATE OR REPLACE VIEW view_active_todos AS
SELECT
    t."todoId",
    t."userId",
    u.username,
    t.title,
    t.content,
    t."startDate",
    t."dueDate",
    t.status,
    t."isCompleted",
    t."createdAt",
    t."updatedAt",
    CASE
        WHEN t."dueDate" < CURRENT_DATE THEN true
        ELSE false
    END AS "isOverdue"
FROM todos t
JOIN users u ON t."userId" = u."userId"
WHERE t.status = 'ACTIVE';

-- 완료된 할일 조회 뷰
CREATE OR REPLACE VIEW view_completed_todos AS
SELECT
    t."todoId",
    t."userId",
    u.username,
    t.title,
    t.content,
    t."startDate",
    t."dueDate",
    t."createdAt",
    t."updatedAt"
FROM todos t
JOIN users u ON t."userId" = u."userId"
WHERE t.status = 'COMPLETED';

-- 휴지통 조회 뷰
CREATE OR REPLACE VIEW view_trash_todos AS
SELECT
    t."todoId",
    t."userId",
    u.username,
    t.title,
    t.content,
    t."deletedAt"
FROM todos t
JOIN users u ON t."userId" = u."userId"
WHERE t.status = 'DELETED' AND t."deletedAt" IS NOT NULL;

-- ============================================================
-- 9. 권한 설정 (선택)
-- ============================================================
-- 애플리케이션 전용 사용자 생성 및 권한 부여

-- CREATE USER pkt_app_user WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE pkt_todolist TO pkt_app_user;
-- GRANT USAGE ON SCHEMA public TO pkt_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pkt_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pkt_app_user;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO pkt_app_user;

-- ============================================================
-- 10. 유용한 쿼리 모음
-- ============================================================

-- 사용자별 할일 통계
-- SELECT
--     u."userId",
--     u.username,
--     COUNT(CASE WHEN t.status = 'ACTIVE' THEN 1 END) AS active_count,
--     COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) AS completed_count,
--     COUNT(CASE WHEN t.status = 'DELETED' THEN 1 END) AS deleted_count,
--     COUNT(*) AS total_count
-- FROM users u
-- LEFT JOIN todos t ON u."userId" = t."userId"
-- GROUP BY u."userId", u.username;

-- 이번 달 국경일 조회
-- SELECT * FROM holidays
-- WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
--   AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
-- ORDER BY date;

-- 만료 임박 할일 조회 (3일 이내)
-- SELECT * FROM todos
-- WHERE status = 'ACTIVE'
--   AND "dueDate" IS NOT NULL
--   AND "dueDate" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
-- ORDER BY "dueDate";

-- ============================================================
-- 스키마 생성 완료
-- ============================================================