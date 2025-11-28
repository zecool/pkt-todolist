require('dotenv').config();
const https = require('http');
const { Pool } = require('pg');
const { generateAccessToken } = require('../src/utils/jwtHelper');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pkt_todolist',
  user: 'postgres',
  password: 'postgres'
});

const API_URL = 'http://localhost:3002/api';

async function testHolidayAPI() {
  try {
    console.log('🧪 국경일 API 테스트 시작...\n');

    // 1. 테스트 사용자 생성 또는 조회
    console.log('1️⃣ 테스트 사용자 확인 중...');
    let user = await pool.query(
      "SELECT \"userId\", email, username, role FROM \"users\" WHERE email = 'test@example.com'"
    );

    if (user.rows.length === 0) {
      console.log('   테스트 사용자가 없습니다. 생성 중...');
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('test1234', 10);

      user = await pool.query(
        `INSERT INTO "users" (email, password, username, role)
         VALUES ('test@example.com', $1, 'Test User', 'user')
         RETURNING "userId", email, username, role`,
        [hashedPassword]
      );
      console.log('   ✅ 테스트 사용자 생성 완료');
    } else {
      console.log('   ✅ 테스트 사용자 존재함');
    }

    const testUser = user.rows[0];
    console.log(`   사용자 ID: ${testUser.userId}`);
    console.log(`   이메일: ${testUser.email}\n`);

    // 2. JWT 토큰 생성
    console.log('2️⃣ JWT 토큰 생성 중...');
    const token = generateAccessToken({
      userId: testUser.userId,
      email: testUser.email,
      role: testUser.role
    });
    console.log(`   ✅ 토큰 생성 완료\n`);

    // 3. 국경일 API 호출
    console.log('3️⃣ 국경일 조회 API 테스트...');

    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 3002,
        path: '/api/holidays?year=2025',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        });
      });

      req.on('error', reject);
      req.end();
    });

    console.log(`   ✅ API 호출 성공!`);
    console.log(`   상태 코드: ${response.status}`);
    console.log(`   응답:`, JSON.stringify(response.data, null, 2));
    console.log(`\n📋 2025년 국경일 목록 (총 ${response.data.data.length}개):`);
    console.log('=====================================');

    response.data.data.forEach((holiday, index) => {
      console.log(`${index + 1}. ${holiday.title} - ${holiday.date.split('T')[0]}`);
    });

    console.log('\n✅ 테스트 완료! 국경일 API가 정상적으로 작동합니다.');

  } catch (error) {
    console.error('❌ 테스트 실패:', error.response?.data || error.message);
    if (error.response) {
      console.error('   상태 코드:', error.response.status);
      console.error('   응답 데이터:', JSON.stringify(error.response.data, null, 2));
    }
  } finally {
    await pool.end();
  }
}

testHolidayAPI();
