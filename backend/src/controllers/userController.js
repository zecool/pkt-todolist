const { validationResult } = require('express-validator');
const userService = require('../services/userService');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 프로필 관리 API
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 현재 사용자 프로필 조회
 *     description: 현재 로그인한 사용자의 프로필 정보를 조회합니다.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await userService.getProfile(userId);

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    if (error.message === '사용자를 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '프로필 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: 현재 사용자 프로필 수정
 *     description: 현재 로그인한 사용자의 프로필 정보를 수정합니다.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: 홍길동
 *               password:
 *                 type: string
 *                 description: 비밀번호 (변경 시에만 포함)
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
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
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *       400:
 *         description: 요청 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: 사용자 이름 중복
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const updateProfile = async (req, res) => {
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

    const userId = req.user.userId;
    const { username, password } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = password;

    const updatedUser = await userService.updateProfile(userId, updateData);

    res.status(200).json({
      success: true,
      data: {
        userId: updatedUser.userId,
        username: updatedUser.username
      }
    });
  } catch (error) {
    if (error.message === '사용자를 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: error.message
        }
      });
    }

    if (error.message === '이미 사용 중인 사용자 이름입니다') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '프로필 수정 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};