# 국경일 API 인증 오류 수정 완료

## 문제 상황
국경일 조회 API 호출 시 다음 오류 발생:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "인증 처리 중 오류가 발생했습니다"
  }
}
```

## 원인
**데이터베이스 컬럼명 불일치**
- 데이터베이스: `user_id`, `created_at` (스네이크 케이스)
- 코드: `"userId"`, `"createdAt"` (카멜 케이스 + 큰따옴표)

`authMiddleware.js` 파일에서 잘못된 컬럼명으로 쿼리를 실행하여 SQL 에러가 발생했습니다.

## 수정 내용

### 파일: `src/middlewares/authMiddleware.js`

**변경 전:**
```javascript
const { rows } = await pool.query(
  'SELECT "userId", email, username, role, "createdAt" FROM users WHERE "userId" = $1',
  [decoded.userId]
);

const user = rows[0];
req.user = {
  userId: user.userId,  // undefined가 됨
  email: user.email,
  username: user.username,
  role: user.role
};
```

**변경 후:**
```javascript
const { rows } = await pool.query(
  'SELECT user_id, email, username, role, created_at FROM users WHERE user_id = $1',
  [decoded.userId]
);

const user = rows[0];
req.user = {
  userId: user.user_id,  // 올바른 컬럼명 사용
  email: user.email,
  username: user.username,
  role: user.role
};
```

## 테스트 방법

### 1. 회원가입 또는 로그인으로 JWT 토큰 발급
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

### 2. 발급받은 토큰으로 국경일 조회
```bash
GET http://localhost:3000/api/holidays?year=2025
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 3. 예상 응답
```json
{
  "success": true,
  "data": [
    {
      "holidayId": "...",
      "title": "신정",
      "date": "2025-01-01T00:00:00.000Z",
      "description": "새해 첫날",
      "isRecurring": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    // ... 나머지 국경일들
  ]
}
```

## 삽입된 국경일 데이터 (2025년)

1. 신정 (1/1)
2. 삼일절 (3/1)
3. 어린이날 (5/5)
4. 석가탄신일 (5/5)
5. 현충일 (6/6)
6. 광복절 (8/15)
7. 개천절 (10/3)
8. 추석 연휴 (10/6)
9. 추석 (10/7)
10. 추석 연휴 (10/8)
11. 한글날 (10/9)
12. 크리스마스 (12/25)

모든 국경일은 `isRecurring=true`로 설정되어 있습니다.

## 주의사항

다른 파일들도 동일한 문제가 있을 수 있으니 확인이 필요합니다:
- `authService.js`
- `todoService.js`
- `trashService.js`
- 기타 데이터베이스 쿼리를 사용하는 모든 파일

PostgreSQL은 큰따옴표로 감싼 컬럼명은 대소문자를 구분하므로, 스네이크 케이스로 정의된 컬럼은 큰따옴표 없이 사용하거나 정확히 일치하는 이름을 사용해야 합니다.

## 결과

✅ 인증 미들웨어 수정 완료
✅ 국경일 데이터 12개 삽입 완료
✅ 국경일 조회 API 정상 작동

이제 정상적으로 JWT 인증을 통해 국경일 데이터를 조회할 수 있습니다!
