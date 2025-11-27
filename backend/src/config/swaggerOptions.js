const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'pkt-TodoList API',
      version: '1.0.0',
      description: '사용자 인증 기반의 개인 할일 관리 애플리케이션 API입니다. JWT 인증을 통해 할일 생성, 조회, 수정, 삭제 및 국경일 관리 기능을 제공합니다.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '로컬 개발 서버'
      },
      {
        url: process.env.API_URL || 'https://your-project.vercel.app/api',
        description: 'Vercel 프로덕션 서버 (배포 후 API_URL 환경변수로 설정)'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT 인증 토큰을 입력하세요'
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../controllers/*.js'),
    path.join(__dirname, '../routes/*.js')
  ],
};

const specs = swaggerJsdoc(options);
module.exports = { specs, options };