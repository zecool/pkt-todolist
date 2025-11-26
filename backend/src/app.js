const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// 보안 헤더 설정
app.use(helmet());

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 라우트 설정 (나중에 추가)
// app.use('/api/auth', authRoutes);
// app.use('/api/todos', todoRoutes);
// app.use('/api/trash', trashRoutes);
// app.use('/api/holidays', holidayRoutes);

// 404 핸들러 (정의된 라우트 이외의 경로에 대한 요청)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found'
    }
  });
});

// 에러 핸들링 미들웨어 (가장 마지막에 등록)
app.use(errorMiddleware);

module.exports = app;