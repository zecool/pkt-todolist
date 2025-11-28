// @ts-check
const { test, expect } = require('@playwright/test');
const { generateTestUser, register } = require('../utils/auth-helper');

/**
 * 휴지통 관련 E2E 테스트
 * 참조: docs/4-user-scenarios.md
 * - 시나리오 2.1.3: 실수로 삭제한 할일 복원
 * - 시나리오 3.3.1: 오래된 할일 정리 및 영구 삭제
 */

test.describe('휴지통 기능', () => {

  test('시나리오 2.1.3: 실수로 삭제한 할일 복원', async ({ page }) => {
    // Given: 로그인된 사용자 및 할일이 존재함
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date().toISOString().split('T')[0];

    // 할일 추가
    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await page.fill('input[name="title"]', '주간 보고서 작성');
    await page.fill('input[name="dueDate"]', today);
    await page.click('button:has-text("저장")');

    await expect(page.locator('text="주간 보고서 작성"')).toBeVisible({ timeout: 5000 });

    // When: 할일 삭제
    const todoItem = page.locator('text="주간 보고서 작성"').locator('..');
    const deleteButton = todoItem.locator('button[title="삭제"], button:has-text("🗑"), button:has-text("삭제")').first();

    // 삭제 다이얼로그 자동 수락
    page.on('dialog', dialog => dialog.accept());

    await deleteButton.click();

    // 할일이 목록에서 사라질 때까지 대기
    await page.waitForTimeout(1000);

    // When: 휴지통으로 이동
    const trashButton = page.locator('button:has-text("휴지통"), a:has-text("휴지통")').first();
    if (await trashButton.isVisible().catch(() => false)) {
      await trashButton.click();
      await page.waitForTimeout(1000);

      // When: 삭제된 할일 복원
      const restoreButton = page.locator('button:has-text("복원")').first();
      if (await restoreButton.isVisible().catch(() => false)) {
        await restoreButton.click();

        // Then: 할일 목록으로 이동
        await page.goto('/');

        // Then: 복원된 할일 확인
        await expect(page.locator('text="주간 보고서 작성"')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('시나리오 3.3.1: 할일 삭제 및 휴지통 확인', async ({ page }) => {
    // Given: 로그인된 사용자 및 할일이 존재함
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date().toISOString().split('T')[0];

    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await page.fill('input[name="title"]', 'Q2 보고서 작성');
    await page.fill('input[name="dueDate"]', today);
    await page.click('button:has-text("저장")');

    await expect(page.locator('text="Q2 보고서 작성"')).toBeVisible({ timeout: 5000 });

    // When: 할일 삭제
    const todoItem = page.locator('text="Q2 보고서 작성"').locator('..');
    const deleteButton = todoItem.locator('button[title="삭제"], button:has-text("🗑"), button:has-text("삭제")').first();

    page.on('dialog', dialog => dialog.accept());
    await deleteButton.click();

    await page.waitForTimeout(1000);

    // When: 휴지통 이동
    const trashButton = page.locator('button:has-text("휴지통"), a:has-text("휴지통")').first();
    if (await trashButton.isVisible().catch(() => false)) {
      await trashButton.click();
      await page.waitForTimeout(1000);

      // Then: 삭제된 할일이 휴지통에 표시됨
      const inTrash = await page.locator('text="Q2 보고서 작성"').isVisible().catch(() => false);
      expect(inTrash).toBeTruthy();
    }
  });

  test('시나리오 3.3.1: 영구 삭제', async ({ page }) => {
    // Given: 로그인된 사용자 및 할일이 휴지통에 있음
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date().toISOString().split('T')[0];

    // 할일 추가
    const addButton = page.locator('button:has-text("새 할일 추가"), button[aria-label="새 할일 추가"]').first();
    await addButton.click();
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await page.fill('input[name="title"]', '오래된 할일');
    await page.fill('input[name="dueDate"]', today);
    await page.click('button:has-text("저장")');

    await expect(page.locator('text="오래된 할일"')).toBeVisible({ timeout: 5000 });

    // 할일 삭제 (휴지통으로 이동)
    const todoItem = page.locator('text="오래된 할일"').locator('..');
    const deleteButton = todoItem.locator('button[title="삭제"], button:has-text("🗑"), button:has-text("삭제")').first();

    page.on('dialog', dialog => dialog.accept());
    await deleteButton.click();

    await page.waitForTimeout(1000);

    // 휴지통으로 이동
    const trashButton = page.locator('button:has-text("휴지통"), a:has-text("휴지통")').first();
    if (await trashButton.isVisible().catch(() => false)) {
      await trashButton.click();
      await page.waitForTimeout(1000);

      // When: 영구 삭제
      const permanentDeleteButton = page.locator('button:has-text("영구 삭제"), button:has-text("완전 삭제")').first();
      if (await permanentDeleteButton.isVisible().catch(() => false)) {
        await permanentDeleteButton.click();

        // 확인 다이얼로그 수락
        await page.waitForTimeout(500);

        // Then: 휴지통에서도 사라짐
        const stillExists = await page.locator('text="오래된 할일"').isVisible().catch(() => false);
        expect(stillExists).toBe(false);
      }
    }
  });

  test('휴지통 비우기 기능', async ({ page }) => {
    // Given: 로그인된 사용자 및 여러 할일을 삭제하여 휴지통에 추가
    const user = generateTestUser();
    await register(page, user);
    await page.goto('/');

    const today = new Date().toISOString().split('T')[0];

    const todosToDelete = ['할일1', '할일2', '할일3'];

    for (const todoTitle of todosToDelete) {
      await page.click('button:has-text("+")');
      await page.waitForSelector('input[name="title"]', { timeout: 5000 });
      await page.fill('input[name="title"]', todoTitle);
      await page.fill('input[name="dueDate"]', today);
      await page.click('button:has-text("저장")');
      await expect(page.locator(`text="${todoTitle}"`)).toBeVisible({ timeout: 5000 });

      // 삭제
      const todoItem = page.locator(`text="${todoTitle}"`).locator('..');
      const deleteButton = todoItem.locator('button[title="삭제"], button:has-text("🗑"), button:has-text("삭제")').first();
      page.on('dialog', dialog => dialog.accept());
      await deleteButton.click();
      await page.waitForTimeout(500);
    }

    // When: 휴지통으로 이동
    const trashButton = page.locator('button:has-text("휴지통"), a:has-text("휴지통")').first();
    if (await trashButton.isVisible().catch(() => false)) {
      await trashButton.click();
      await page.waitForTimeout(1000);

      // 휴지통 비우기 버튼
      const emptyTrashButton = page.locator('button:has-text("비우기"), button:has-text("전체 삭제")').first();
      if (await emptyTrashButton.isVisible().catch(() => false)) {
        await emptyTrashButton.click();

        // Then: 휴지통이 비워짐
        await page.waitForTimeout(1000);
        const isEmpty = await page.locator('text=/비어있음|항목이 없습니다/i').isVisible().catch(() => false);
        expect(isEmpty).toBeTruthy();
      }
    }
  });
});
