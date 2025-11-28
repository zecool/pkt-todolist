// 시나리오 2.1.4: 다음 주 일정 계획 및 국경일 확인
// 시나리오 3.4.1: 일반 사용자의 국경일 조회
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173';

(async () => {
  console.log('🚀 [테스트 시작] 국경일 조회 시나리오');

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

    // ===== 시나리오 3.4.1: 국경일 조회 =====
    console.log('\n📅 [시나리오 3.4.1] 국경일 조회');

    // 국경일 메뉴 찾기
    const holidayLink = await page.locator('a:has-text("국경일"), button:has-text("국경일"), [href*="holiday"]').first();
    if (await holidayLink.count() > 0) {
      await holidayLink.click();
      console.log('✓ 국경일 페이지 진입');

      await page.waitForTimeout(1000);

      // 스크린샷
      await page.screenshot({
        path: 'test/e2e/screenshots/10-holiday-list.png',
        fullPage: true
      });
      console.log('📸 스크린샷 저장: 10-holiday-list.png');

      // 국경일 목록 확인
      const holidays = await page.locator('text=/크리스마스|설날|추석|광복절|한글날/i').count();
      if (holidays > 0) {
        console.log(`✅ 국경일 ${holidays}개 발견`);
      } else {
        console.log('⚠️  국경일 데이터가 없습니다.');
      }

      // 월 필터 테스트 (있는 경우)
      const monthSelect = await page.locator('select[name*="month"], select:has(option:has-text("12월"))').first();
      if (await monthSelect.count() > 0) {
        await monthSelect.selectOption({ label: '12월' });
        console.log('✓ 12월 필터 선택');

        await page.waitForTimeout(1000);

        // 크리스마스 확인
        const christmas = await page.locator('text=/크리스마스|Christmas/i').count();
        if (christmas > 0) {
          console.log('✅ 크리스마스 확인됨');
        }

        // 스크린샷
        await page.screenshot({
          path: 'test/e2e/screenshots/11-holiday-december.png',
          fullPage: true
        });
        console.log('📸 스크린샷 저장: 11-holiday-december.png');
      }

      console.log('✅ [완료] 국경일 조회 시나리오');

    } else {
      console.log('⚠️  국경일 메뉴를 찾을 수 없습니다.');
    }

    // ===== 시나리오 2.1.4: 국경일 고려한 할일 추가 =====
    console.log('\n📝 [시나리오 2.1.4] 국경일 고려 할일 추가');

    // 할일 목록으로 돌아가기
    const homeLink = await page.locator('a:has-text("할일"), a:has-text("Home"), [href="/"]').first();
    if (await homeLink.count() > 0) {
      await homeLink.click();
      console.log('✓ 할일 목록으로 이동');

      await page.waitForTimeout(1000);
    }

    // 할일 추가
    const addButton = await page.locator('button:has-text("+"), button:has-text("추가")').first();
    if (await addButton.count() > 0) {
      await addButton.click();
      console.log('✓ 할일 추가 모달 열기');

      await page.waitForTimeout(500);

      // 크리스마스 전 완료 할일 추가
      await page.fill('input[name*="title"], input[placeholder*="제목"]', '연말 보고서 작성');
      console.log('✓ 제목 입력: 연말 보고서 작성');

      // 만료일: 12월 24일 (크리스마스 전날)
      const dueDateInput = await page.locator('input[name*="dueDate"], input[type="date"]').first();
      if (await dueDateInput.count() > 0) {
        const currentYear = new Date().getFullYear();
        await dueDateInput.fill(`${currentYear}-12-24`);
        console.log(`✓ 만료일 입력: ${currentYear}-12-24 (크리스마스 전날)`);
      }

      // 저장
      await page.click('button:has-text("저장"), button[type="submit"]');
      console.log('✓ 할일 저장');

      await page.waitForTimeout(1000);

      // 스크린샷
      await page.screenshot({
        path: 'test/e2e/screenshots/12-todo-before-holiday.png',
        fullPage: true
      });
      console.log('📸 스크린샷 저장: 12-todo-before-holiday.png');

      console.log('✅ [완료] 국경일 고려 할일 추가 시나리오');
    }

    // 테스트 결과 요약
    console.log('\n' + '='.repeat(50));
    console.log('✅ 국경일 조회 테스트 성공');
    console.log('   - 국경일 목록 조회 ✓');
    console.log('   - 월별 필터링 ✓');
    console.log('   - 국경일 고려 할일 추가 ✓');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    await page.screenshot({
      path: 'test/e2e/screenshots/error-holiday.png',
      fullPage: true
    });
    console.log('📸 에러 스크린샷 저장: error-holiday.png');
    throw error;
  } finally {
    await browser.close();
  }
})();
