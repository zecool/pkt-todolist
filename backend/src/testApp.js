const express = require('express');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// 미들웨어 설정
app.use(express.json());

// 테스트용 라우트 - 서버 에러
app.get('/server-error', (req, res) => {
  throw new Error('Test server error');
});

// 테스트용 라우트 - validation 에러
app.get('/validation-error', (req, res) => {
  const error = new Error('Validation error');
  error.statusCode = 422;
  error.code = 'VALIDATION_ERROR';
  throw error;
});

// 에러 처리 미들웨어 추가
app.use(errorMiddleware);

// 서버를 직접 실행하는 대신, 테스트에서 사용할 수 있도록 내보냄
module.exports = app;