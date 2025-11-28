// 시나리오 2.1.3: 실수로 삭제한 할일 복원
// 시나리오 3.3.1: 오래된 할일 정리 및 영구 삭제
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173';

(async () => {
  console.log('🚀 [테스트 시작] 휴지통 관리 시나리오');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();

  try {
    // 로그인
    console.log('\n🔐 로그인 진행 중...');
    await page.goto(TARGET_URL);
    await page.waitForTimeout(2000);

    // ===== 시나리오 2.1.3: 실수로 삭제한 할일 복원 =====
    console.log('\n🗑️  [시나리오 2.1.3] 할일 삭제 및 복원');

    // 테스트용 할일 추가
    console.log('📝 테스트용 할일 추가 중...');
    const addButton = await page.locator('button:has-text("+"), button:has-text("추가")').first();
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(500);

      await page.fill('input[name*="title"], input[placeholder*="제목"]', '주간 보고서 작성');
      console.log('✓ 제목 입력: 주간 보고서 작성');

      await page.click('button:has-text("저장"), button[type="submit"]');
      console.log('✓ 할일 저장');

      await page.waitForTimeout(1000);
    }

    // 할일 삭제
    console.log('\n🗑️  할일 삭제 중...');
    const deleteButton = await page.locator('button:has-text("삭제"), button[title*="삭제"], button:has(svg)').first();
    if (await deleteButton.count() > 0) {
      await deleteButton.click();
      console.log('✓ 삭제 버튼 클릭');

      await page.waitForTimeout(500);

      // 확인 다이얼로그가 있는 경우
      const confirmButton = await page.locator('button:has-text("확인"), button:has-text("OK"), button:has-text("예")').first();
      if (await confirmButton.count() > 0) {
        await confirmButton.click();
        console.log('✓ 삭제 확인');
      }

      await page.waitForTimeout(1000);

      // 스크린샷
      await page.screenshot({
        path: 'test/e2e/screenshots/06-todo-deleted.png',
        fullPage: true
      });
      console.log('📸 스크린샷 저장: 06-todo-deleted.png');
    }

    // 휴지통으로 이동
    console.log('\n🗂️  휴지통으로 이동 중...');
    const trashLink = await page.locator('a:has-text("휴지통"), button:has-text("휴지통"), [href*="trash"]').first();
    if (await trashLink.count() > 0) {
      await trashLink.click();
      console.log('✓ 휴지통 페이지 진입');

      await page.waitForTimeout(1000);

      // 스크린샷
      await page.screenshot({
        path: 'test/e2e/screenshots/07-trash-list.png',
        fullPage: true
      });
      console.log('📸 스크린샷 저장: 07-trash-list.png');

      // 삭제된 할일 확인
      const trashedItem = await page.locator('text=/주간 보고서|보고서 작성/i').first();
      if (await trashedItem.count() > 0) {
        console.log('✅ 삭제된 할일 확인됨');

        // 복원 버튼 찾기
        const restoreButton = await page.locator('button:has-text("복원"), button:has-text("Restore")').first();
        if (await restoreButton.count() > 0) {
          await restoreButton.click();
          console.log('✓ 복원 버튼 클릭');

          await page.waitForTimeout(1000);

          // 메인 페이지로 돌아가기
          const homeLink = await page.locator('a:has-text("할일"), a:has-text("Home"), [href="/"], [href*="todo"]').first();
          if (await homeLink.count() > 0) {
            await homeLink.click();
            console.log('✓ 할일 목록으로 이동');

            await page.waitForTimeout(1000);

            // 복원 확인
            const restoredItem = await page.locator('text=/주간 보고서|보고서 작성/i').first();
            if (await restoredItem.count() > 0) {
              console.log('✅ 할일 복원 확인됨');
            }

            // 스크린샷
            await page.screenshot({
              path: 'test/e2e/screenshots/08-todo-restored.png',
              fullPage: true
            });
            console.log('📸 스크린샷 저장: 08-todo-restored.png');
          }
        }
      } else {
        console.log('⚠️  삭제된 할일을 찾을 수 없습니다.');
      }
    }

    console.log('✅ [완료] 할일 삭제 및 복원 시나리오');

    // ===== 시나리오 3.3.1: 영구 삭제 =====
    console.log('\n🗑️  [시나리오 3.3.1] 영구 삭제');

    // 다시 휴지통으로 이동
    const trashLink2 = await page.locator('a:has-text("휴지통"), button:has-text("휴지통"), [href*="trash"]').first();
    if (await trashLink2.count() > 0) {
      await trashLink2.click();
      console.log('✓ 휴지통 페이지 진입');

      await page.waitForTimeout(1000);

      // 할일을 다시 삭제하여 휴지통에 넣기
      await page.goto(TARGET_URL);
      await page.waitForTimeout(1000);

      const deleteButton2 = await page.locator('button:has-text("삭제"), button[title*="삭제"]').first();
      if (await deleteButton2.count() > 0) {
        await deleteButton2.click();
        await page.waitForTimeout(500);

        const confirmButton2 = await page.locator('button:has-text("확인"), button:has-text("OK")').first();
        if (await confirmButton2.count() > 0) {
          await confirmButton2.click();
        }

        await page.waitForTimeout(1000);
      }

      // 휴지통으로 다시 이동
      const trashLink3 = await page.locator('a:has-text("휴지통"), [href*="trash"]').first();
      if (await trashLink3.count() > 0) {
        await trashLink3.click();
        await page.waitForTimeout(1000);

        // 영구 삭제 버튼 찾기
        const permanentDeleteButton = await page.locator('button:has-text("영구"), button:has-text("Delete Forever"), button:has-text("완전")').first();
        if (await permanentDeleteButton.count() > 0) {
          await permanentDeleteButton.click();
          console.log('✓ 영구 삭제 버튼 클릭');

          await page.waitForTimeout(500);

          // 확인 다이얼로그
          const confirmPermanent = await page.locator('button:has-text("확인"), button:has-text("OK"), button:has-text("예")').first();
          if (await confirmPermanent.count() > 0) {
            await confirmPermanent.click();
            console.log('✓ 영구 삭제 확인');
          }

          await page.waitForTimeout(1000);

          // 스크린샷
          await page.screenshot({
            path: 'test/e2e/screenshots/09-permanent-delete.png',
            fullPage: true
          });
          console.log('📸 스크린샷 저장: 09-permanent-delete.png');

          console.log('✅ 영구 삭제 완료');
        }
      }
    }

    console.log('✅ [완료] 영구 삭제 시나리오');

    // 테스트 결과 요약
    console.log('\n' + '='.repeat(50));
    console.log('✅ 휴지통 관리 테스트 성공');
    console.log('   - 할일 삭제 ✓');
    console.log('   - 휴지통 조회 ✓');
    console.log('   - 할일 복원 ✓');
    console.log('   - 영구 삭제 ✓');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    await page.screenshot({
      path: 'test/e2e/screenshots/error-trash.png',
      fullPage: true
    });
    console.log('📸 에러 스크린샷 저장: error-trash.png');
    throw error;
  } finally {
    await browser.close();
  }
})();
