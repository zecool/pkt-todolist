const { pool } = require('../config/database');

/**
 * 휴지통 조회 서비스
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 삭제된 할일 목록
 */
const getTrash = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM todos WHERE user_id = $1 AND deleted_at IS NOT NULL ORDER BY deleted_at DESC',
    [userId]
  );

  return result.rows.map(row => ({
    todoId: row.todo_id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    startDate: row.start_date,
    dueDate: row.due_date,
    status: row.status,
    isCompleted: row.is_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at
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
    'DELETE FROM todos WHERE todo_id = $1 AND user_id = $2 AND deleted_at IS NOT NULL RETURNING *',
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