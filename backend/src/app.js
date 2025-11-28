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

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
});

// CORS 설정
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://pkt-be-todolist.vercel.app',  // Add deployed backend URL
    'https://pkt-fe-todolist.vercel.app'   // Add if frontend is deployed separately
  ],
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

// API 루트 엔드포인트
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API Server is running',
    endpoints: {
      auth: '/api/auth',
      todos: '/api/todos',
      trash: '/api/trash',
      holidays: '/api/holidays',
      users: '/api/users'
    }
  });
});

// 라우트 등록 - API prefix 버전 (기존)
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/trash', trashRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/users', userRoutes);

// 라우트 등록 - 호환성 버전 (prefix 없이도 작동 가능하도록)
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);
app.use('/trash', trashRoutes);
app.use('/holidays', holidayRoutes);
app.use('/users', userRoutes);

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
