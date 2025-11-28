const rateLimit = require('express-rate-limit');

// 개발 환경에서는 레이트 리미팅 비활성화
const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// 일반 API 요청 제한: 100회/분
const generalRateLimit = isDevOrTest ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 100회 요청 제한
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: '요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.'
    }
  },
  standardHeaders: true, // `RateLimit-*` 헤더 반환
  legacyHeaders: false, // `X-RateLimit-*` 헤더 반환 비활성화
});

// 인증 관련 API 요청 제한: 5회/15분
const authRateLimit = isDevOrTest ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // IP당 5회 요청 제한
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalRateLimit,
  authRateLimit
};