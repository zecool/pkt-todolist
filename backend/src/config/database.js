const { Pool } = require('pg');

// Connection Pool 설정
// Using individual parameters instead of connectionString to avoid URL encoding issues
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pkt_todolist',
  password: 'postgres',
  port: 5432,
  max: 10,                    // 최대 연결 수
  idleTimeoutMillis: 30000,   // 유휴 연결 타임아웃 (30초)
  connectionTimeoutMillis: 2000, // 연결 타임아웃 (2초)
});

// Connection Pool 이벤트 핸들러
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

// 테이블 존재 여부 확인 함수
const checkTablesExist = async () => {
  const client = await pool.connect();
  try {
    // User 테이블 존재 여부 확인
    const userResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      ) AS table_exists;
    `);

    // Todo 테이블 존재 여부 확인
    const todoResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Todo'
      ) AS table_exists;
    `);

    // Holiday 테이블 존재 여부 확인
    const holidayResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Holiday'
      ) AS table_exists;
    `);

    return userResult.rows[0].table_exists &&
           todoResult.rows[0].table_exists &&
           holidayResult.rows[0].table_exists;
  } catch (error) {
    console.error('❌ Error checking table existence:', error.message);
    return false;
  } finally {
    await client.release();
  }
};

// 데이터베이스 연결 테스트 함수
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log(`   Server time: ${result.rows[0].now}`);

    // 테이블 존재 여부 확인
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.log('⚠️  Required tables do not exist. Please run database initialization.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 연결 풀 종료 함수 (graceful shutdown)
const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing pool:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  closePool,
};
