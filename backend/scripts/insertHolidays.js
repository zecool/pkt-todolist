require('dotenv').config();
const { Pool } = require('pg');

// 직접 연결 설정
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pkt_todolist',
  user: 'postgres',
  password: 'postgres',  // .env 파일의 비밀번호로 변경 필요
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * 2025년 대한민국 국경일 데이터 삽입 스크립트
 */
const holidays2025 = [
  {
    title: '신정',
    date: '2025-01-01',
    description: '새해 첫날',
    isRecurring: true
  },
  {
    title: '삼일절',
    date: '2025-03-01',
    description: '3·1 독립운동 기념일',
    isRecurring: true
  },
  {
    title: '어린이날',
    date: '2025-05-05',
    description: '어린이를 위한 날',
    isRecurring: true
  },
  {
    title: '석가탄신일',
    date: '2025-05-05',
    description: '부처님 오신 날',
    isRecurring: true
  },
  {
    title: '현충일',
    date: '2025-06-06',
    description: '순국선열과 전몰장병을 추모하는 날',
    isRecurring: true
  },
  {
    title: '광복절',
    date: '2025-08-15',
    description: '대한민국 광복 기념일',
    isRecurring: true
  },
  {
    title: '개천절',
    date: '2025-10-03',
    description: '대한민국 건국 기념일',
    isRecurring: true
  },
  {
    title: '추석 연휴',
    date: '2025-10-06',
    description: '추석 연휴 첫날',
    isRecurring: true
  },
  {
    title: '추석',
    date: '2025-10-07',
    description: '한가위',
    isRecurring: true
  },
  {
    title: '추석 연휴',
    date: '2025-10-08',
    description: '추석 연휴 마지막날',
    isRecurring: true
  },
  {
    title: '한글날',
    date: '2025-10-09',
    description: '한글 창제를 기념하는 날',
    isRecurring: true
  },
  {
    title: '크리스마스',
    date: '2025-12-25',
    description: '성탄절',
    isRecurring: true
  }
];

/**
 * 국경일 데이터 삽입 함수
 */
const insertHolidays = async () => {
  const client = await pool.connect();

  try {
    console.log('🚀 국경일 데이터 삽입 시작...\n');

    // 트랜잭션 시작
    await client.query('BEGIN');

    // 기존 2025년 데이터 확인
    const checkResult = await client.query(
      "SELECT COUNT(*) FROM holidays WHERE EXTRACT(YEAR FROM date) = 2025"
    );

    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      console.log(`⚠️  2025년 국경일 데이터가 이미 ${existingCount}개 존재합니다.`);
      console.log('기존 데이터를 삭제하고 새로 삽입하시겠습니까? (수동으로 처리해주세요)\n');
      await client.query('ROLLBACK');
      return;
    }

    // 국경일 데이터 삽입
    let insertedCount = 0;
    for (const holiday of holidays2025) {
      const result = await client.query(
        `INSERT INTO holidays (title, date, description, is_recurring)
         VALUES ($1, $2, $3, $4)
         RETURNING holiday_id, title, date`,
        [holiday.title, holiday.date, holiday.description, holiday.isRecurring]
      );

      const inserted = result.rows[0];
      console.log(`✅ ${inserted.title} (${inserted.date.toISOString().split('T')[0]}) - ID: ${inserted.holiday_id}`);
      insertedCount++;
    }

    // 트랜잭션 커밋
    await client.query('COMMIT');

    console.log(`\n🎉 총 ${insertedCount}개의 국경일 데이터가 성공적으로 삽입되었습니다!`);

    // 삽입된 데이터 확인
    const verifyResult = await client.query(
      `SELECT title, date, is_recurring
       FROM holidays
       WHERE EXTRACT(YEAR FROM date) = 2025
       ORDER BY date`
    );

    console.log('\n📋 삽입된 2025년 국경일 목록:');
    console.log('=====================================');
    verifyResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title} - ${row.date.toISOString().split('T')[0]} (반복: ${row.is_recurring})`);
    });

  } catch (error) {
    // 에러 발생 시 롤백
    await client.query('ROLLBACK');
    console.error('❌ 국경일 데이터 삽입 실패:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// 스크립트 실행
insertHolidays()
  .then(() => {
    console.log('\n✨ 스크립트 실행 완료');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 스크립트 실행 중 오류 발생:', error);
    process.exit(1);
  });
