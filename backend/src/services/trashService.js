const { pool } = require('../config/database');

/**
 * 휴지통 조회 서비스
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 삭제된 할일 목록
 */
const getTrash = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM "Todo" WHERE "userId" = $1 AND "deletedAt" IS NOT NULL ORDER BY "deletedAt" DESC',
    [userId]
  );

  return result.rows.map(row => ({
    todoId: row.todoId,
    userId: row.userId,
    title: row.title,
    content: row.content,
    startDate: row.startDate,
    dueDate: row.dueDate,
    status: row.status,
    isCompleted: row.isCompleted,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt
  }));
};

/**
 * 할일 영구 삭제 서비스
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
const permanentlyDelete = async (todoId, userId) => {
  const result = await pool.query(
    'DELETE FROM "Todo" WHERE "todoId" = $1 AND "userId" = $2 AND "deletedAt" IS NOT NULL RETURNING *',
    [todoId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('할일을 찾을 수 없거나 영구 삭제할 수 없는 상태입니다');
  }

  return true;
};

module.exports = {
  getTrash,
  permanentlyDelete
};