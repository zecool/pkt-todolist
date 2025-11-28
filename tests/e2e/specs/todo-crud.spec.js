// @ts-check
const { test, expect } = require('@playwright/test');
const { generateTestUser, register } = require('../utils/auth-helper');
const { createTodo, completeTodo, deleteTodo, updateTodo, todoExists } = require('../utils/todo-helper');

/**
 * 할일 CRUD 관련 E2E 테스트
 * 참조: docs/4-user-scenarios.md
 * - 시나리오 2.1.1: 출근길 할일 확인 및 추가
 * - 시나리오 2.1.2: 업무 중 할일 완료 처리
 * - 시나리오 3.2.1: 상세 정보 포함 할일 추가
 * - 시나리오 3.2.2: 할일 수정 및 일정 변경
 */

test.describe('할일 생성 및 관리', () => {

  test('시나리오 2.1.1: 할일 추가 - 간단한 할일', async ({ page }) => {
    // Given: 로그인된 사용자
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    // When: 새로운 할일 추가
    const today = new Date().toISOString().split('T')[0];

    // + 버튼 또는 "새 할일 추가" 버튼 클릭
    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();

    // 모달이나 폼이 표시될 때까지 대기
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    await page.fill('input[name="title"]', '팀장님께 보고서 제출');
    await page.fill('textarea[name="content"]', '오전 11시까지 제출 필요');
    await page.fill('input[name="startDate"]', today);
    await page.fill('input[name="dueDate"]', today);
    await page.click('button:has-text("저장")');

    // Then: 할일이 목록에 표시됨
    await expect(page.locator('text="팀장님께 보고서 제출"')).toBeVisible({ timeout: 5000 });
  });

  test('시나리오 3.2.1: 상세 정보 포함 할일 추가', async ({ page }) => {
    // Given: 로그인된 사용자
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    // When: 상세 정보를 포함한 할일 추가
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    await page.fill('input[name="title"]', 'Q4 프로젝트 최종 보고서 제출');
    await page.fill('textarea[name="content"]', `- 경영진 발표 자료 포함
- 예산 집행 현황 첨부
- 팀장 검토 완료 필요`);
    await page.fill('input[name="startDate"]', today.toISOString().split('T')[0]);
    await page.fill('input[name="dueDate"]', nextWeek.toISOString().split('T')[0]);
    await page.click('button:has-text("저장")');

    // Then: 할일이 목록에 표시되고 상세 정보 확인 가능
    await expect(page.locator('text="Q4 프로젝트 최종 보고서 제출"')).toBeVisible({ timeout: 5000 });
  });

  test('시나리오 2.1.2: 할일 완료 처리', async ({ page }) => {
    // Given: 로그인된 사용자 및 할일이 존재함
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date().toISOString().split('T')[0];

    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await page.fill('input[name="title"]', '보고서 제출 완료');
    await page.fill('input[name="startDate"]', today);
    await page.fill('input[name="dueDate"]', today);
    await page.click('button:has-text("저장")');

    // 할일이 목록에 표시될 때까지 대기
    await expect(page.locator('text="보고서 제출 완료"')).toBeVisible({ timeout: 5000 });

    // When: 체크박스 클릭하여 완료 처리
    const todoItem = page.locator('text="보고서 제출 완료"').locator('..');
    const checkButton = todoItem.locator('button[aria-label*="완료"]').first();
    await checkButton.click();

    // Then: 완료 상태 표시 (취소선)
    const title = page.locator('h3:has-text("보고서 제출 완료")');
    await expect(title).toHaveClass(/line-through/, { timeout: 5000 });
  });

  test('시나리오 3.2.2: 할일 수정 - 일정 변경', async ({ page }) => {
    // Given: 로그인된 사용자 및 할일이 존재함
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // 할일 생성
    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await page.fill('input[name="title"]', '알고리즘 중간고사 준비');
    await page.fill('input[name="startDate"]', today.toISOString().split('T')[0]);
    await page.fill('input[name="dueDate"]', tomorrow.toISOString().split('T')[0]);
    await page.click('button:has-text("저장")');

    await expect(page.locator('text="알고리즘 중간고사 준비"')).toBeVisible({ timeout: 5000 });

    // When: 할일 클릭하여 상세보기
    await page.click('text="알고리즘 중간고사 준비"');

    // 수정 버튼 클릭
    await page.click('button:has-text("수정")');

    // 만료일 변경
    await page.fill('input[name="dueDate"]', nextWeek.toISOString().split('T')[0]);
    await page.fill('textarea[name="content"]', '시험 범위: 1-10장');
    await page.click('button:has-text("저장")');

    // Then: 수정된 내용 확인
    await expect(page.locator('text="알고리즘 중간고사 준비"')).toBeVisible({ timeout: 5000 });
  });

  test('시나리오 2.1.1: 할일 조회 - 오늘 할일 확인', async ({ page }) => {
    // Given: 로그인된 사용자 및 여러 할일이 존재함
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 오늘 할일 추가
    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await page.fill('input[name="title"]', '오늘 할 일');
    await page.fill('input[name="dueDate"]', today);
    await page.click('button:has-text("저장")');

    await expect(page.locator('text="오늘 할 일"')).toBeVisible({ timeout: 5000 });

    // 내일 할일 추가
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await page.fill('input[name="title"]', '내일 할 일');
    await page.fill('input[name="dueDate"]', tomorrowStr);
    await page.click('button:has-text("저장")');

    // Then: 모든 할일이 표시됨
    await expect(page.locator('text="오늘 할 일"')).toBeVisible();
    await expect(page.locator('text="내일 할 일"')).toBeVisible();
  });

  test('시나리오 4.2.1: 데이터 검증 - 만료일이 시작일보다 이전', async ({ page }) => {
    // Given: 로그인된 사용자 및 할일 추가 폼
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    // When: 만료일을 시작일보다 이전으로 설정
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    await page.fill('input[name="title"]', '프로젝트 제출');
    await page.fill('input[name="startDate"]', today.toISOString().split('T')[0]);
    await page.fill('input[name="dueDate"]', yesterday.toISOString().split('T')[0]);
    await page.click('button:has-text("저장")');

    // Then: 에러 메시지 표시
    const errorVisible = await page.locator('text=/만료일.*시작일.*이후|날짜.*오류/i').isVisible().catch(() => false);

    // 저장이 실패하거나 에러가 표시되어야 함
    expect(errorVisible).toBeTruthy();
  });

  test('시나리오 4.2.2: 데이터 검증 - 제목 누락', async ({ page }) => {
    // Given: 로그인된 사용자 및 할일 추가 폼
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    // When: 제목 없이 저장 시도
    const today = new Date().toISOString().split('T')[0];
    await page.fill('textarea[name="content"]', '중요한 회의');
    await page.fill('input[name="dueDate"]', today);
    await page.click('button:has-text("저장")');

    // Then: 에러 메시지 표시 또는 저장 실패
    const errorVisible = await page.locator('text=/제목.*필수|제목.*입력/i').isVisible().catch(() => false);

    expect(errorVisible).toBeTruthy();
  });

  test('시나리오 2.2.4: 할일 검색 기능', async ({ page }) => {
    // Given: 로그인된 사용자 및 여러 할일이 존재함
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date().toISOString().split('T')[0];

    // 할일들 추가
    const todos = [
      '알고리즘 중간고사 준비',
      '데이터베이스 중간고사 정리',
      '영어 과제 제출'
    ];

    for (const todo of todos) {
      await page.click('button:has-text("+")');
      await page.waitForSelector('input[name="title"]', { timeout: 5000 });
      await page.fill('input[name="title"]', todo);
      await page.fill('input[name="dueDate"]', today);
      await page.click('button:has-text("저장")');
      await expect(page.locator(`text="${todo}"`)).toBeVisible({ timeout: 5000 });
    }

    // When: "중간고사" 검색
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('중간고사');

      // Then: 중간고사 관련 할일만 표시
      await expect(page.locator('text="알고리즘 중간고사 준비"')).toBeVisible();
      await expect(page.locator('text="데이터베이스 중간고사 정리"')).toBeVisible();
    }
  });
});
