// @ts-check

/**
 * 할일 관련 헬퍼 함수
 */

/**
 * 할일 생성
 * @param {import('@playwright/test').Page} page
 * @param {{ title: string, content?: string, startDate?: string, dueDate?: string }} todo
 */
async function createTodo(page, todo) {
  // 할일 추가 버튼 클릭
  await page.click('button:has-text("+")');

  // 폼 작성
  await page.fill('input[name="title"]', todo.title);

  if (todo.content) {
    await page.fill('textarea[name="content"]', todo.content);
  }

  if (todo.startDate) {
    await page.fill('input[name="startDate"]', todo.startDate);
  }

  if (todo.dueDate) {
    await page.fill('input[name="dueDate"]', todo.dueDate);
  }

  // 저장 버튼 클릭
  await page.click('button:has-text("저장")');

  // 목록에 추가될 때까지 대기
  await page.waitForSelector(`text="${todo.title}"`, { timeout: 5000 });
}

/**
 * 할일 완료 처리
 * @param {import('@playwright/test').Page} page
 * @param {string} title - 할일 제목
 */
async function completeTodo(page, title) {
  // 할일 항목 찾기
  const todoItem = page.locator(`text="${title}"`).locator('..');

  // 체크박스 클릭
  await todoItem.locator('input[type="checkbox"]').check();

  // 완료 상태 확인 (취소선 또는 completed 클래스)
  await todoItem.locator('text="${title}"').waitFor({ state: 'visible' });
}

/**
 * 할일 삭제
 * @param {import('@playwright/test').Page} page
 * @param {string} title - 할일 제목
 */
async function deleteTodo(page, title) {
  // 할일 항목 찾기
  const todoItem = page.locator(`text="${title}"`).locator('..');

  // 삭제 버튼 클릭
  await todoItem.locator('button[title="삭제"], button:has-text("🗑")').click();

  // 확인 다이얼로그가 있다면 확인
  page.on('dialog', dialog => dialog.accept());

  // 항목이 사라질 때까지 대기
  await page.waitForSelector(`text="${title}"`, { state: 'hidden', timeout: 5000 });
}

/**
 * 할일 수정
 * @param {import('@playwright/test').Page} page
 * @param {string} oldTitle - 기존 제목
 * @param {{ title?: string, content?: string, dueDate?: string }} updates - 수정할 내용
 */
async function updateTodo(page, oldTitle, updates) {
  // 할일 항목 클릭 (상세 보기)
  await page.click(`text="${oldTitle}"`);

  // 수정 버튼 클릭
  await page.click('button:has-text("수정")');

  // 수정할 내용 입력
  if (updates.title) {
    await page.fill('input[name="title"]', updates.title);
  }

  if (updates.content) {
    await page.fill('textarea[name="content"]', updates.content);
  }

  if (updates.dueDate) {
    await page.fill('input[name="dueDate"]', updates.dueDate);
  }

  // 저장 버튼 클릭
  await page.click('button:has-text("저장")');

  // 수정된 제목 확인
  const newTitle = updates.title || oldTitle;
  await page.waitForSelector(`text="${newTitle}"`, { timeout: 5000 });
}

/**
 * 할일 존재 확인
 * @param {import('@playwright/test').Page} page
 * @param {string} title - 할일 제목
 * @returns {Promise<boolean>}
 */
async function todoExists(page, title) {
  try {
    await page.waitForSelector(`text="${title}"`, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * 할일 목록 개수 조회
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>}
 */
async function getTodoCount(page) {
  const todos = await page.locator('[data-testid="todo-item"]').count();
  return todos;
}

module.exports = {
  createTodo,
  completeTodo,
  deleteTodo,
  updateTodo,
  todoExists,
  getTodoCount
};
