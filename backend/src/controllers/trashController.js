const trashService = require('../services/trashService');

/**
 * @swagger
 * tags:
 *   name: Trash
 *   description: 휴지통 관리 API
 */

/**
 * @swagger
 * /trash:
 *   get:
 *     summary: 휴지통 조회
 *     description: 삭제된 할일 목록을 조회합니다.
 *     tags: [Trash]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 휴지통 조회 성공
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
const getTrash = async (req, res) => {
  try {
    const userId = req.user.userId;

    const trashItems = await trashService.getTrash(userId);

    res.status(200).json({
      success: true,
      data: trashItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '휴지통 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * @swagger
 * /trash/{id}:
 *   delete:
 *     summary: 영구 삭제
 *     description: 휴지통의 할일을 데이터베이스에서 완전히 삭제합니다.
 *     tags: [Trash]
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
 *         description: 영구 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 잘못된 요청 (활성 상태의 할일은 영구 삭제 불가)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const permanentlyDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await trashService.permanentlyDelete(id, userId);

    res.status(200).json({
      success: true,
      message: '할일이 영구적으로 삭제되었습니다'
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 영구 삭제할 수 없는 상태입니다') {
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
        message: error.message || '할일 영구 삭제 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getTrash,
  permanentlyDelete
};