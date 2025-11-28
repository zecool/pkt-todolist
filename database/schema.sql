 -- 기존 테이블 삭제 (외래키 때문에 순서 중요)
  DROP TABLE IF EXISTS "Todo" CASCADE;
  DROP TABLE IF EXISTS "User" CASCADE;
  DROP TABLE IF EXISTS "Holiday" CASCADE;

  -- UUID extension 활성화
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- User 테이블 정의
  CREATE TABLE "User" (
      userId      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email       VARCHAR(255) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      username    VARCHAR(100) NOT NULL,
      role        VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      createdAt   TIMESTAMP NOT NULL DEFAULT NOW(),
      updatedAt   TIMESTAMP NOT NULL DEFAULT NOW()
  );

  -- Todo 테이블 정의
  CREATE TABLE "Todo" (
      todoId      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      userId      UUID NOT NULL REFERENCES "User"(userId) ON DELETE CASCADE ON UPDATE CASCADE,
      title       VARCHAR(200) NOT NULL,
      content     TEXT,
      startDate   DATE,
      dueDate     DATE,
      status      VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'deleted')),
      isCompleted BOOLEAN NOT NULL DEFAULT false,
      createdAt   TIMESTAMP NOT NULL DEFAULT NOW(),
      updatedAt   TIMESTAMP NOT NULL DEFAULT NOW(),
      deletedAt   TIMESTAMP,

      -- 제약 조건: 만료일은 시작일 이후
      CONSTRAINT check_todo_duedate CHECK (
          dueDate IS NULL OR
          startDate IS NULL OR
          dueDate >= startDate
      )
  );

  -- Holiday 테이블 정의
  CREATE TABLE "Holiday" (
      holidayId   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title       VARCHAR(100) NOT NULL,
      date        DATE NOT NULL,
      description TEXT,
      isRecurring BOOLEAN NOT NULL DEFAULT true,
      createdAt   TIMESTAMP NOT NULL DEFAULT NOW(),
      updatedAt   TIMESTAMP NOT NULL DEFAULT NOW()
  );

  -- UNIQUE INDEX 추가
  CREATE UNIQUE INDEX idx_user_email ON "User"(email);

  -- INDEX 추가
  CREATE INDEX idx_todo_user_status ON "Todo"(userId, status);
  CREATE INDEX idx_todo_duedate ON "Todo"(dueDate);
  CREATE INDEX idx_todo_deletedat ON "Todo"(deletedAt);
  CREATE INDEX idx_todo_createdat ON "Todo"(createdAt);
  CREATE INDEX idx_user_role ON "User"(role);
  CREATE INDEX idx_holiday_date ON "Holiday"(date);

  -- 트리거 함수 생성 (updatedAt 자동 갱신)
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updatedAt = NOW();
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- User 테이블 트리거
  CREATE TRIGGER trigger_user_updated_at
  BEFORE UPDATE ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

  -- Todo 테이블 트리거
  CREATE TRIGGER trigger_todo_updated_at
  BEFORE UPDATE ON "Todo"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

  -- Holiday 테이블 트리거
  CREATE TRIGGER trigger_holiday_updated_at
  BEFORE UPDATE ON "Holiday"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

  -- 테이블 코멘트
  COMMENT ON TABLE "User" IS '사용자 계정 정보';
  COMMENT ON COLUMN "User".userId IS '사용자 고유 ID (UUID)';
  COMMENT ON COLUMN "User".email IS '로그인용 이메일 주소 (고유)';
  COMMENT ON COLUMN "User".password IS 'bcrypt 해시된 비밀번호';
  COMMENT ON COLUMN "User".username IS '사용자 표시 이름';
  COMMENT ON COLUMN "User".role IS '사용자 역할 (user, admin)';
  COMMENT ON COLUMN "User".createdAt IS '계정 생성 일시';
  COMMENT ON COLUMN "User".updatedAt IS '최종 정보 수정 일시';

  COMMENT ON TABLE "Todo" IS '사용자별 할일 정보';
  COMMENT ON COLUMN "Todo".todoId IS '할일 고유 ID (UUID)';
  COMMENT ON COLUMN "Todo".userId IS '할일 소유자 ID (외래키)';
  COMMENT ON COLUMN "Todo".title IS '할일 제목 (필수, 최대 200자)';
  COMMENT ON COLUMN "Todo".content IS '할일 상세 내용 (선택)';
  COMMENT ON COLUMN "Todo".startDate IS '할일 시작일';
  COMMENT ON COLUMN "Todo".dueDate IS '할일 만료일 (시작일 이후)';
  COMMENT ON COLUMN "Todo".status IS '할일 상태 (active, completed, deleted)';
  COMMENT ON COLUMN "Todo".isCompleted IS '완료 여부 플래그';
  COMMENT ON COLUMN "Todo".createdAt IS '할일 생성 일시';
  COMMENT ON COLUMN "Todo".updatedAt IS '할일 최종 수정 일시';
  COMMENT ON COLUMN "Todo".deletedAt IS '할일 삭제 일시 (소프트 삭제)';

  COMMENT ON TABLE "Holiday" IS '공통 국경일 정보';
  COMMENT ON COLUMN "Holiday".holidayId IS '국경일 고유 ID (UUID)';
  COMMENT ON COLUMN "Holiday".title IS '국경일 이름';
  COMMENT ON COLUMN "Holiday".date IS '국경일 날짜';
  COMMENT ON COLUMN "Holiday".description IS '국경일 설명';
  COMMENT ON COLUMN "Holiday".isRecurring IS '매년 반복 여부';
  COMMENT ON COLUMN "Holiday".createdAt IS '데이터 생성 일시';
  COMMENT ON COLUMN "Holiday".updatedAt IS '데이터 최종 수정 일시';