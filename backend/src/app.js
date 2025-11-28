const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const { specs } = require('./config/swaggerOptions');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const trashRoutes = require('./routes/trashRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const { generalRateLimit } = require('./middlewares/rateLimitMiddleware');

const app = express();

// CORS 설정
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// 미들웨어 설정
app.use(generalRateLimit); // 요청 제한 미들웨어
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI 라우트 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/trash', trashRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/users', userRoutes);

// 404 처리
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다'
    }
  });
});

// 에러 핸들러 (가장 마지막에 등록)
app.use(errorHandler);

module.exports = app;
