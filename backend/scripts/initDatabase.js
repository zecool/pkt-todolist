const { Pool } = require('pg');

// Create a separate pool configuration for initialization to avoid connection issues
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pkt_todolist',
  password: 'postgres',
  port: 5432,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
// Define the SQL commands directly to avoid potential character encoding issues
const schemaSQL = `
-- 기존 테이블 삭제 (외래키 때문에 순서 중요)
DROP TABLE IF EXISTS "Todo" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "Holiday" CASCADE;

-- UUID extension 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User 테이블 정의
CREATE TABLE "users" (
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
    userId      UUID NOT NULL REFERENCES "users"(userId) ON DELETE CASCADE ON UPDATE CASCADE,
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
CREATE UNIQUE INDEX idx_user_email ON "users"(email);

-- INDEX 추가
CREATE INDEX idx_todo_user_status ON "Todo"(userId, status);
CREATE INDEX idx_todo_duedate ON "Todo"(dueDate);
CREATE INDEX idx_todo_deletedat ON "Todo"(deletedAt);
CREATE INDEX idx_todo_createdat ON "Todo"(createdAt);
CREATE INDEX idx_user_role ON "users"(role);
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
BEFORE UPDATE ON "users"
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
`;

const initDatabase = async () => {
  let client;
  try {
    console.log('🚀 Starting database initialization...');
    client = await pool.connect();
    
    console.log('📋 Creating database tables...');
    await client.query(schemaSQL);
    console.log('✅ Database tables created successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Run the initialization if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(success => {
      if (success) {
        console.log('🎉 Database initialization completed successfully!');
        process.exit(0);
      } else {
        console.log('💥 Database initialization failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error during database initialization:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;