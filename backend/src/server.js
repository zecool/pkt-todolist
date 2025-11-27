require('dotenv').config();
const app = require('./app');
const { testConnection, closePool } = require('./config/database');

let PORT = parseInt(process.env.PORT) || 3000;
const MAX_PORT_ATTEMPTS = 10;

const startServer = async (port = PORT, attempt = 1) => {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ Failed to connect to database. Server startup aborted.');
      process.exit(1);
    }

    // 서버 시작
    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (port !== PORT) {
        console.log(`⚠️  Port ${PORT} was in use, using port ${port} instead`);
      }
    });

    // 포트 사용 중 에러 처리
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        if (attempt >= MAX_PORT_ATTEMPTS) {
          console.error(`❌ Unable to find available port after ${MAX_PORT_ATTEMPTS} attempts`);
          process.exit(1);
        }
        console.log(`⚠️  Port ${port} is in use, trying port ${port + 1}...`);
        server.close();
        startServer(port + 1, attempt + 1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('📴 Shutting down gracefully...');
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
