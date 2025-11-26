const errorMiddleware = (err, req, res, next) => {
  // 상태 코드 설정 (기본값 500)
  const statusCode = err.statusCode || 500;
  
  // 에러 코드 설정
  const code = err.code || 'INTERNAL_ERROR';
  
  // 개발 환경일 경우 스택 트레이스 포함
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;
  
  // 에러 로깅
  console.error(`[${new Date().toISOString()}] ${statusCode} ${code}:`, {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // 프로덕션 환경에서는 내부 에러 정보를 숨김
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal Server Error' 
    : err.message || 'An error occurred';
  
  // 응답 형식 통일
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    ...(stack && { stack }) // 개발 환경에서는 스택 포함
  });
};

module.exports = errorMiddleware;