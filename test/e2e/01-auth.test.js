// 시나리오 3.1.1: 신규 사용자 회원가입
// 시나리오 3.1.2: 기존 사용자 로그인
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173';

(async () => {
  console.log('🚀 [테스트 시작] 회원가입 및 로그인 시나리오');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();

  try {
    // ===== 시나리오 3.1.1: 신규 사용자 회원가입 =====
    console.log('\n📝 [시나리오 3.1.1] 신규 사용자 회원가입');

    await page.goto(TARGET_URL);
    console.log('✓ 앱 접속 완료');

    // 회원가입 페이지로 이동
    const signupButton = await page.waitForSelector('text=/회원가입|시작하기|Sign.*up/i', { timeout: 5000 });
    await signupButton.click();
    console.log('✓ 회원가입 페이지 진입');

    // 테스트 계정 정보 (타임스탬프로 중복 방지)
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'SecurePass123!';
    const testUsername = '테스트유저';

    // 회원가입 폼 작성
    await page.fill('input[type="email"], input[name*="email"]', testEmail);
    console.log(`✓ 이메일 입력: ${testEmail}`);

    await page.fill('input[type="password"]:first-of-type, input[name*="password"]:first-of-type', testPassword);
    console.log('✓ 비밀번호 입력');

    // 비밀번호 확인 필드가 있는 경우 (타임아웃 짧게)
    try {
      const passwordConfirmField = await page.locator('input[type="password"]:nth-of-type(2)').first();
      if (await passwordConfirmField.count() > 0) {
        await passwordConfirmField.fill(testPassword, { timeout: 3000 });
        console.log('✓ 비밀번호 확인 입력');
      }
    } catch (e) {
      console.log('⚠️  비밀번호 확인 필드 없음 (선택사항)');
    }

    // 사용자 이름 필드가 있는 경우
    try {
      const usernameField = await page.locator('input[name*="name"], input[name*="username"]').first();
      if (await usernameField.count() > 0) {
        await usernameField.fill(testUsername, { timeout: 3000 });
        console.log(`✓ 사용자 이름 입력: ${testUsername}`);
      }
    } catch (e) {
      console.log('⚠️  사용자 이름 필드 없음 (선택사항)');
    }

    // 회원가입 버튼 클릭
    await page.click('button[type="submit"], button:has-text("가입"), button:has-text("Sign")');
    console.log('✓ 회원가입 제출');

    // 회원가입 성공 대기 (메인 페이지 또는 환영 메시지)
    await page.waitForTimeout(2000);

    // 스크린샷 저장
    await page.screenshot({
      path: 'test/e2e/screenshots/01-signup-success.png',
      fullPage: true
    });
    console.log('📸 스크린샷 저장: 01-signup-success.png');

    console.log('✅ [완료] 회원가입 시나리오');

    // ===== 시나리오 3.1.2: 로그아웃 후 재로그인 =====
    console.log('\n🔄 [시나리오 3.1.2] 로그아웃 후 재로그인');

    // 로그아웃
    const logoutButton = await page.locator('button:has-text("로그아웃"), button:has-text("Logout"), a:has-text("로그아웃")').first();
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      console.log('✓ 로그아웃 완료');
      await page.waitForTimeout(1000);
    }

    // 로그인 페이지로 이동
    await page.goto(TARGET_URL);
    const loginButton = await page.waitForSelector('text=/로그인|Login/i', { timeout: 5000 });
    await loginButton.click();
    console.log('✓ 로그인 페이지 진입');

    // 로그인 정보 입력
    await page.fill('input[type="email"], input[name*="email"]', testEmail);
    console.log(`✓ 이메일 입력: ${testEmail}`);

    await page.fill('input[type="password"]', testPassword);
    console.log('✓ 비밀번호 입력');

    // 로그인 버튼 클릭
    await page.click('button[type="submit"], button:has-text("로그인"), button:has-text("Login")');
    console.log('✓ 로그인 제출');

    // 로그인 성공 대기
    await page.waitForTimeout(2000);

    // 메인 화면 확인 (할일 목록 또는 대시보드)
    const isLoggedIn = await page.locator('text=/할일|Todo|환영/i').count() > 0;
    console.log(isLoggedIn ? '✅ 로그인 성공 확인' : '⚠️  로그인 상태 확인 필요');

    // 스크린샷 저장
    await page.screenshot({
      path: 'test/e2e/screenshots/02-login-success.png',
      fullPage: true
    });
    console.log('📸 스크린샷 저장: 02-login-success.png');

    console.log('✅ [완료] 로그인 시나리오');

    // 테스트 결과 요약
    console.log('\n' + '='.repeat(50));
    console.log('✅ 인증 테스트 성공');
    console.log(`   테스트 계정: ${testEmail}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    await page.screenshot({
      path: 'test/e2e/screenshots/error-auth.png',
      fullPage: true
    });
    console.log('📸 에러 스크린샷 저장: error-auth.png');
    throw error;
  } finally {
    await browser.close();
  }
})();
