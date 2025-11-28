// UI 디버깅 스크립트 - 실제 DOM 구조 확인
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'SecurePass123!';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  try {
    await page.goto(TARGET_URL);
    await page.waitForTimeout(1000);

    // 로그인
    const loginButtonExists = await page.locator('text=/로그인|Login/i').count();
    if (loginButtonExists > 0) {
      await page.click('text=/로그인|Login/i');
      await page.waitForTimeout(500);
      await page.fill('input[type="email"]', TEST_EMAIL);
      await page.fill('input[type="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }

    // 페이지의 모든 버튼 찾기
    const buttons = await page.locator('button').all();
    console.log(`\n발견된 버튼 수: ${buttons.length}\n`);

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const attributes = await button.evaluate(el => {
        return {
          id: el.id,
          className: el.className,
          ariaLabel: el.getAttribute('aria-label'),
          type: el.type
        };
      });

      console.log(`버튼 ${i + 1}:`);
      console.log(`  텍스트: "${text?.trim()}"`);
      console.log(`  보임: ${isVisible}`);
      console.log(`  ID: ${attributes.id || '없음'}`);
      console.log(`  Class: ${attributes.className || '없음'}`);
      console.log(`  Aria-label: ${attributes.ariaLabel || '없음'}`);
      console.log(`  Type: ${attributes.type || '없음'}`);
      console.log('');
    }

    // 링크 확인
    const links = await page.locator('a').all();
    console.log(`\n발견된 링크 수: ${links.length}\n`);

    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const link = links[i];
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      const isVisible = await link.isVisible();

      console.log(`링크 ${i + 1}:`);
      console.log(`  텍스트: "${text?.trim()}"`);
      console.log(`  Href: ${href}`);
      console.log(`  보임: ${isVisible}`);
      console.log('');
    }

    // 스크린샷
    await page.screenshot({
      path: 'test/e2e/screenshots/debug-main-page.png',
      fullPage: true
    });
    console.log('📸 디버그 스크린샷 저장: debug-main-page.png');

    console.log('\n✅ 디버깅 완료. 브라우저를 30초간 유지합니다.');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ 에러:', error.message);
  } finally {
    await browser.close();
  }
})();
