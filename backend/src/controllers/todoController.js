const { validationResult } = require('express-validator');
const todoService = require('../services/todoService');

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         todoId:
 *           type: string
 *           format: uuid
 *           description: 할일 고유 ID
 *         userId:
 *           type: string
 *           format: uuid
 *           description: 소유자 ID
 *         title:
 *           type: string
 *           description: 할일 제목
 *           example: '할일 제목'
 *         content:
 *           type: string
 *           description: 할일 상세 내용
 *           example: '할일 상세 내용'
 *         startDate:
 *           type: string
 *           format: date
 *           description: 시작일
 *           example: '2025-11-25'
 *         dueDate:
 *           type: string
 *           format: date
 *           description: 만료일
 *           example: '2025-11-28'
 *         status:
 *           type: string
 *           enum: [active, completed, deleted]
 *           description: 할일 상태
 *           default: active
 *         isCompleted:
 *           type: boolean
 *           description: 완료 여부
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최종 수정일시
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: 삭제일시 (소프트 삭제)
 *       example:
 *         todoId: 550e8400-e29b-41d4-a716-446655440000
 *         userId: 550e8400-e29b-41d4-a716-446655440001
 *         title: '프로젝트 마감'
 *         content: 'PRD 작성 완료하기'
 *         startDate: '2025-11-25'
 *         dueDate: '2025-11-28'
 *         status: 'active'
 *         isCompleted: false
 *         createdAt: '2025-11-25T10:00:00Z'
 *         updatedAt: '2025-11-25T10:00:00Z'
 *     TodoInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: 할일 제목
 *           example: '할일 제목'
 *         content:
 *           type: string
 *           description: 할일 상세 내용
 *           example: '할일 상세 내용'
 *         startDate:
 *           type: string
 *           format: date
 *           description: 시작일
 *           example: '2025-11-25'
 *         dueDate:
 *           type: string
 *           format: date
 *           description: 만료일
 *           example: '2025-11-28'
 *     TodoUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 할일 제목
 *           example: '할일 제목'
 *         content:
 *           type: string
 *           description: 할일 상세 내용
 *           example: '할일 상세 내용'
 *         startDate:
 *           type: string
 *           format: date
 *           description: 시작일
 *           example: '2025-11-25'
 *         dueDate:
 *           type: string
 *           format: date
 *           description: 만료일
 *           example: '2025-11-28'
 *   responses:
 *     Unauthorized:
 *       description: 인증 실패
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: 권한 없음
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: 요청한 리소스를 찾을 수 없음
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: 할일 관리 API
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: 할일 목록 조회
 *     description: 로그인한 사용자의 할일 목록을 조회합니다. 상태, 검색어, 정렬 기준으로 필터링 가능합니다.
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, deleted]
 *         description: 할일 상태 필터
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 제목/내용 검색어
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [dueDate, createdAt]
 *           default: createdAt
 *         description: 정렬 기준
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 할일 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Todo'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 쿼리 파라미터 추출
    const { status, search, sortBy, order } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;

    const todos = await todoService.getTodos(userId, filters);

    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 목록 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: 할일 상세 조회
 *     description: 특정 할일의 상세 정보를 조회합니다.
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 할일 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.getTodoById(id, userId);

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: 할일 생성
 *     description: 새로운 할일을 생성합니다.
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: 할일 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: 요청 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
const createTodo = async (req, res) => {
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
    const { title, content, startDate, dueDate } = req.body;

    const todoData = {
      title,
      content,
      startDate,
      dueDate
    };

    const todo = await todoService.createTodo(userId, todoData);

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.message === '제목은 필수입니다') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TITLE_REQUIRED',
          message: error.message
        }
      });
    }

    if (error.message === '만료일은 시작일 이후여야 합니다') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 생성 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: 할일 수정
 *     description: 기존 할일의 정보를 수정합니다.
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 할일 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/TodoUpdate'
 *     responses:
 *       200:
 *         description: 할일 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: 요청 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const updateTodo = async (req, res) => {
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
    const userId = req.user.userId;
    const { title, content, startDate, dueDate } = req.body;

    const updateData = {
      title,
      content,
      startDate,
      dueDate
    };

    const todo = await todoService.updateTodo(id, userId, updateData);

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 권한이 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    if (error.message === '만료일은 시작일 이후여야 합니다') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 수정 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /todos/{id}/complete:
 *   patch:
 *     summary: 할일 완료
 *     description: 할일을 완료 상태로 변경합니다.
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 할일 완료 처리 성공
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
 *                     todoId:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       enum: [active, completed, deleted]
 *                     isCompleted:
 *                       type: boolean
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const completeTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.completeTodo(id, userId);

    res.status(200).json({
      success: true,
      data: {
        todoId: todo.todoId,
        status: todo.status,
        isCompleted: todo.isCompleted
      }
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 이미 삭제된 할일입니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 완료 처리 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: 할일 삭제 (휴지통 이동)
 *     description: 할일을 휴지통으로 이동합니다 (소프트 삭제).
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 할일 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: '할일이 휴지통으로 이동되었습니다'
 *                 data:
 *                   type: object
 *                   properties:
 *                     todoId:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       enum: [active, completed, deleted]
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.deleteTodo(id, userId);

    res.status(200).json({
      success: true,
      message: '할일이 휴지통으로 이동되었습니다',
      data: {
        todoId: todo.todoId,
        status: todo.status,
        deletedAt: todo.deletedAt
      }
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 이미 삭제된 할일입니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 삭제 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /todos/{id}/restore:
 *   patch:
 *     summary: 할일 복원
 *     description: 휴지통의 할일을 활성 상태로 복원합니다.
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 할일 복원 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: '할일이 복원되었습니다'
 *                 data:
 *                   type: object
 *                   properties:
 *                     todoId:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       enum: [active, completed, deleted]
 *                     deletedAt:
 *                       type: string
 *                       nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const restoreTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.restoreTodo(id, userId);

    res.status(200).json({
      success: true,
      message: '할일이 복원되었습니다',
      data: {
        todoId: todo.todoId,
        status: todo.status,
        deletedAt: todo.deletedAt
      }
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 복원할 수 없는 상태입니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 복원 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  restoreTodo
};