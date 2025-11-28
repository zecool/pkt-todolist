require('dotenv').config();
const { Pool } = require('pg');

// 직접 연결 설정
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pkt_todolist',
  user: 'postgres',
  password: 'postgres',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * 2025년 국경일 날짜 수정 스크립트
 * (시간대 문제로 날짜가 하루 뒤로 밀린 것을 수정)
 */
const fixDates = async () => {
  const client = await pool.connect();

  try {
    console.log('🔧 국경일 날짜 수정 시작...\n');

    await client.query('BEGIN');

    // 2025년 데이터 삭제
    const deleteResult = await client.query(
      "DELETE FROM holidays WHERE EXTRACT(YEAR FROM date) = 2025 OR EXTRACT(YEAR FROM date) = 2024"
    );
    console.log(`🗑️  기존 데이터 ${deleteResult.rowCount}개 삭제됨\n`);

    // 올바른 날짜로 다시 삽입
    const correctHolidays = [
      { title: '신정', date: '2025-01-01', description: '새해 첫날' },
      { title: '삼일절', date: '2025-03-01', description: '3·1 독립운동 기념일' },
      { title: '어린이날', date: '2025-05-05', description: '어린이를 위한 날' },
      { title: '석가탄신일', date: '2025-05-05', description: '부처님 오신 날' },
      { title: '현충일', date: '2025-06-06', description: '순국선열과 전몰장병을 추모하는 날' },
      { title: '광복절', date: '2025-08-15', description: '대한민국 광복 기념일' },
      { title: '개천절', date: '2025-10-03', description: '대한민국 건국 기념일' },
      { title: '추석 연휴', date: '2025-10-06', description: '추석 연휴 첫날' },
      { title: '추석', date: '2025-10-07', description: '한가위' },
      { title: '추석 연휴', date: '2025-10-08', description: '추석 연휴 마지막날' },
      { title: '한글날', date: '2025-10-09', description: '한글 창제를 기념하는 날' },
      { title: '크리스마스', date: '2025-12-25', description: '성탄절' }
    ];

    console.log('📝 새로운 국경일 데이터 삽입 중...\n');

    for (const holiday of correctHolidays) {
      const result = await client.query(
        `INSERT INTO holidays (title, date, description, is_recurring)
         VALUES ($1, $2::date, $3, true)
         RETURNING holiday_id, title, date::text`,
        [holiday.title, holiday.date, holiday.description]
      );

      const inserted = result.rows[0];
      console.log(`✅ ${inserted.title} - ${inserted.date}`);
    }

    await client.query('COMMIT');

    console.log('\n🎉 날짜 수정이 완료되었습니다!\n');

    // 최종 확인
    const verifyResult = await client.query(
      `SELECT title, date::text, is_recurring
       FROM holidays
       WHERE EXTRACT(YEAR FROM date) = 2025
       ORDER BY date`
    );

    console.log('📋 수정된 2025년 국경일 목록:');
    console.log('=====================================');
    verifyResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title} - ${row.date} (반복: ${row.is_recurring})`);
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 날짜 수정 실패:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// 스크립트 실행
fixDates()
  .then(() => {
    console.log('\n✨ 스크립트 실행 완료');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 스크립트 실행 중 오류 발생:', error);
    process.exit(1);
  });
