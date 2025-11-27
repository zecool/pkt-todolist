const { validationResult } = require('express-validator');
const holidayService = require('../services/holidayService');

/**
 * @swagger
 * tags:
 *   name: Holidays
 *   description: 국경일 관리 API
 */

/**
 * @swagger
 * /holidays:
 *   get:
 *     summary: 국경일 조회
 *     description: 국경일 목록을 조회합니다. 연도 및 월로 필터링 가능합니다.
 *     tags: [Holidays]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: 연도
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: 월 (1-12)
 *     responses:
 *       200:
 *         description: 국경일 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       holidayId:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *                       isRecurring:
 *                         type: boolean
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: 'UNAUTHORIZED'
 *                     message:
 *                       type: string
 *                       example: '인증이 필요합니다'
 */
const getHolidays = async (req, res) => {
  try {
    // 쿼리 파라미터 추출
    let { year, month } = req.query;

    // 기본값 설정: 현재 연도
    if (!year) {
      year = new Date().getFullYear();
    } else {
      year = parseInt(year);
    }

    if (month) {
      month = parseInt(month);
      // 월이 유효한 범위인지 확인
      if (month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: '월은 1에서 12 사이의 값이어야 합니다'
          }
        });
      }
    }

    const holidays = await holidayService.getHolidays(year, month);

    res.status(200).json({
      success: true,
      data: holidays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '국경일 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /holidays:
 *   post:
 *     summary: 국경일 추가 (관리자 전용)
 *     description: 새로운 국경일을 추가합니다. 관리자 권한이 필요합니다.
 *     tags: [Holidays]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: '광복절'
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2025-08-15'
 *               description:
 *                 type: string
 *                 example: '대한민국 독립 기념일'
 *               isRecurring:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: 국경일 추가 성공
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
 *                     holidayId:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *                     isRecurring:
 *                       type: boolean
 *       400:
 *         description: 요청 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: 'VALIDATION_ERROR'
 *                     message:
 *                       type: string
 *                       example: '요청 데이터가 유효하지 않습니다'
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 */
const createHoliday = async (req, res) => {
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

    // 관리자 권한 확인은 미들웨어에서 처리
    const { title, date, description, isRecurring } = req.body;

    const holidayData = {
      title,
      date,
      description: description || null,
      isRecurring: isRecurring !== undefined ? isRecurring : true
    };

    const holiday = await holidayService.createHoliday(holidayData);

    res.status(201).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '국경일 추가 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /holidays/{id}:
 *   put:
 *     summary: 국경일 수정 (관리자 전용)
 *     description: 기존 국경일을 수정합니다. 관리자 권한이 필요합니다.
 *     tags: [Holidays]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 국경일 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: '광복절'
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2025-08-15'
 *               description:
 *                 type: string
 *                 example: '수정된 설명'
 *               isRecurring:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 국경일 수정 성공
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
 *                     holidayId:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *                     isRecurring:
 *                       type: boolean
 *       400:
 *         description: 요청 데이터 오류
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 국경일을 찾을 수 없음
 */
const updateHoliday = async (req, res) => {
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

    const { id } = req.params;
    const { title, date, description, isRecurring } = req.body;

    const updateData = {
      title,
      date,
      description,
      isRecurring
    };

    const holiday = await holidayService.updateHoliday(id, updateData);

    res.status(200).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    if (error.message === '국경일을 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '국경일 수정 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday
};