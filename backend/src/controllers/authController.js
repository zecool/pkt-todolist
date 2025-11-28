const { validationResult } = require('express-validator');
const authService = require('../services/authService');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: 사용자 고유 ID
 *         email:
 *           type: string
 *           format: email
 *           description: 로그인 이메일
 *         username:
 *           type: string
 *           description: 사용자 이름
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: 사용자 역할
 *           default: user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 가입일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최종 수정일시
 *       example:
 *         userId: 550e8400-e29b-41d4-a716-446655440000
 *         email: user@example.com
 *         username: 홍길동
 *         role: user
 *         createdAt: '2025-11-25T10:00:00Z'
 *         updatedAt: '2025-11-25T10:00:00Z'
 *     AuthInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 로그인 이메일
 *         password:
 *           type: string
 *           description: 비밀번호
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 로그인 이메일
 *         password:
 *           type: string
 *           description: 비밀번호
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Access 토큰
 *         refreshToken:
 *           type: string
 *           description: Refresh 토큰
 *         user:
 *           $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: 'ERROR_CODE'
 *             message:
 *               type: string
 *               example: '에러 메시지'
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: '성공 메시지'
 *         data:
 *           type: object
 *           description: 응답 데이터
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     description: 이메일, 비밀번호, 사용자 이름으로 신규 계정을 생성합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               username:
 *                 type: string
 *                 example: 홍길동
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 요청 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 이메일 중복
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const register = async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '요청 데이터가 유효하지 않습니다',
          details: errors.array()
        }
      });
    }

    const { email, password, username } = req.body;

    // 서비스 호출
    const result = await authService.register(email, password, username);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message === '이미 사용 중인 이메일입니다') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '회원가입 처리 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 이메일/비밀번호 인증 후 JWT 토큰을 발급합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: 요청 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const login = async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '요청 데이터가 유효하지 않습니다',
          details: errors.array()
        }
      });
    }

    const { email, password } = req.body;

    // 서비스 호출
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message || '이메일 또는 비밀번호가 올바르지 않습니다'
      }
    });
  }
};

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     description: Refresh Token을 사용하여 새로운 Access Token을 발급합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '리프레시 토큰이 필요합니다'
        }
      });
    }

    // 서비스 호출
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message || '토큰 갱신에 실패했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     description: 클라이언트 토큰을 삭제합니다.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
const logout = async (req, res) => {
  // 클라이언트에서 토큰을 삭제하도록 안내
  res.status(200).json({
    success: true,
    message: '로그아웃 되었습니다'
  });
};

module.exports = {
  register,
  login,
  refresh,
  logout
};