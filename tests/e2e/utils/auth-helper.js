// @ts-check

/**
 * 인증 관련 헬퍼 함수
 */

/**
 * 테스트용 사용자 정보 생성
 * @param {string} [suffix] - 이메일 접미사
 * @returns {{ email: string, password: string, username: string }}
 */
function generateTestUser(suffix = '') {
  const timestamp = Date.now();
  return {
    email: `test${suffix}${timestamp}@example.com`,
    password: 'TestPass123!',
    username: `테스트유저${suffix}${timestamp}`
  };
}

/**
 * 회원가입 수행
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string, password: string, username: string }} user
 */
async function register(page, user) {
  // 회원가입 페이지로 이동
  await page.goto('/register');

  // 회원가입 폼 작성
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="passwordConfirm"]', user.password);
  await page.fill('input[name="username"]', user.username);

  // 회원가입 버튼 클릭
  await page.click('button[type="submit"]');

  // 회원가입 성공 후 메인 페이지로 자동 리다이렉트 대기
  await page.waitForURL('/', { timeout: 15000 });
}

/**
 * 로그인 수행
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string, password: string }} credentials
 */
async function login(page, credentials) {
  // 로그인 페이지로 이동
  await page.goto('/login');

  // 로그인 폼 작성
  await page.fill('input[name="email"]', credentials.email);
  await page.fill('input[name="password"]', credentials.password);

  // 로그인 버튼 클릭
  await page.click('button[type="submit"]');

  // 성공 후 리다이렉트 대기
  await page.waitForURL('/', { timeout: 5000 });
}

/**
 * 로그아웃 수행
 * @param {import('@playwright/test').Page} page
 */
async function logout(page) {
  // 프로필 메뉴 버튼 클릭 (드롭다운 열기)
  await page.click('button[aria-haspopup="true"]');

  // 로그아웃 버튼이 나타날 때까지 대기
  await page.waitForSelector('button:has-text("로그아웃")', { timeout: 2000 });

  // 로그아웃 버튼 클릭
  await page.click('button:has-text("로그아웃")');

  // 로그인 페이지로 리다이렉트 대기
  await page.waitForURL('/login', { timeout: 5000 });
}

/**
 * 로그인 상태 확인
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
async function isLoggedIn(page) {
  try {
    // 프로필 메뉴 버튼이 있는지 확인 (로그인 상태를 나타냄)
    await page.waitForSelector('button[aria-haspopup="true"]', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  generateTestUser,
  register,
  login,
  logout,
  isLoggedIn
};
