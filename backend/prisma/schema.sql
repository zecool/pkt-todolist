-- User 테이블 생성
CREATE TABLE IF NOT EXISTS "User" (
    "userId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'user',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Todo 테이블 생성
CREATE TABLE IF NOT EXISTS "Todo" (
    "todoId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "startDate" DATE,
    "dueDate" DATE,
    "status" VARCHAR(20) DEFAULT 'active',
    "isCompleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE,
    CHECK ("dueDate" >= "startDate" OR "startDate" IS NULL OR "dueDate" IS NULL)
);

-- Holiday 테이블 생성
CREATE TABLE IF NOT EXISTS "Holiday" (
    "holidayId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "isRecurring" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User.email에 UNIQUE INDEX 추가
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON "User"("email");

-- Todo 테이블에 필요한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_todo_user_id_status ON "Todo"("userId", "status");
CREATE INDEX IF NOT EXISTS idx_todo_due_date ON "Todo"("dueDate");
CREATE INDEX IF NOT EXISTS idx_todo_deleted_at ON "Todo"("deletedAt");

-- Holiday.date에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_holiday_date ON "Holiday"("date");

-- User 테이블에 role에 대한 CHECK 제약 조건 추가
ALTER TABLE "User" ADD CONSTRAINT chk_user_role 
    CHECK ("role" IN ('user', 'admin'));

-- Todo 테이블에 status에 대한 CHECK 제약 조건 추가
ALTER TABLE "Todo" ADD CONSTRAINT chk_todo_status 
    CHECK ("status" IN ('active', 'completed', 'deleted'));