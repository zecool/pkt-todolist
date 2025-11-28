// @ts-check
const { test, expect } = require('@playwright/test');
const { generateTestUser, register, login, logout, isLoggedIn } = require('../utils/auth-helper');

/**
 * 인증 관련 E2E 테스트
 * 참조: docs/4-user-scenarios.md
 * - 시나리오 3.1.1: 신규 사용자 회원가입
 * - 시나리오 3.1.2: 기존 사용자 로그인
 */

test.describe('회원가입 및 로그인', () => {

  test('시나리오 3.1.1: 신규 사용자 회원가입 성공', async ({ page }) => {
    // Given: 신규 사용자 정보 생성
    const user = generateTestUser();

    // When: 회원가입 페이지 방문
    await page.goto('/register');

    // Then: 회원가입 폼이 표시됨
    await expect(page.locator('h1, h2')).toContainText(/새 계정 만들기|회원가입|가입/);

    // When: 회원가입 정보 입력
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="passwordConfirm"]', user.password);
    await page.fill('input[name="username"]', user.username);

    // When: 회원가입 버튼 클릭
    await page.click('button[type="submit"]');

    // Then: 메인 페이지로 리다이렉트
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Then: 로그인 상태 확인 (프로필 메뉴 버튼 존재)
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBe(true);
  });

  test('시나리오 3.1.1: 회원가입 - 이메일 중복 오류', async ({ page }) => {
    // Given: 기존 사용자 생성
    const user = generateTestUser('_dup');
    await register(page, user);
    await logout(page);

    // When: 동일한 이메일로 재가입 시도
    await page.goto('/register');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', 'AnotherPass123!');
    await page.fill('input[name="passwordConfirm"]', 'AnotherPass123!');
    await page.fill('input[name="username"]', '다른이름');
    await page.click('button[type="submit"]');

    // Then: 이메일 중복 오류 메시지 표시
    await expect(page.locator('text=/이미 사용 중|중복/i')).toBeVisible({ timeout: 5000 });
  });

  test('시나리오 3.1.1: 회원가입 - 비밀번호 불일치', async ({ page }) => {
    // Given: 신규 사용자 정보
    const user = generateTestUser('_pwd');

    // When: 비밀번호 확인이 다른 경우
    await page.goto('/register');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="passwordConfirm"]', 'DifferentPass123!');
    await page.fill('input[name="username"]', user.username);
    await page.click('button[type="submit"]');

    // Then: 비밀번호 불일치 오류 표시
    await expect(page.locator('text=/비밀번호.*일치/i')).toBeVisible({ timeout: 5000 });
  });

  test('시나리오 3.1.2: 기존 사용자 로그인 성공', async ({ page }) => {
    // Given: 기존 사용자 생성
    const user = generateTestUser('_login');
    await register(page, user);
    await logout(page);

    // When: 로그인 시도
    await page.goto('/login');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // Then: 로그인 성공 및 메인 페이지 이동
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Then: 로그인 상태 확인
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBe(true);
  });

  test('시나리오 3.1.2: 로그인 - 잘못된 비밀번호', async ({ page }) => {
    // Given: 기존 사용자 생성
    const user = generateTestUser('_wrongpwd');
    await register(page, user);
    await logout(page);

    // When: 잘못된 비밀번호로 로그인 시도
    await page.goto('/login');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Then: 오류 메시지 표시 (올바르지 않습니다)
    await expect(page.locator('text=/올바르지 않습니다|로그인 실패|비밀번호/i')).toBeVisible({ timeout: 5000 });
  });

  test('시나리오 3.1.2: 로그인 - 등록되지 않은 이메일', async ({ page }) => {
    // When: 존재하지 않는 이메일로 로그인 시도
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'SomePassword123!');
    await page.click('button[type="submit"]');

    // Then: 오류 메시지 표시 (올바르지 않습니다)
    await expect(page.locator('text=/올바르지 않습니다|로그인 실패|이메일/i')).toBeVisible({ timeout: 5000 });
  });

  test('로그아웃 기능', async ({ page }) => {
    // Given: 로그인된 사용자
    const user = generateTestUser('_logout');
    await register(page, user);

    // When: 로그아웃 수행
    await logout(page);

    // Then: 로그인 페이지로 리다이렉트
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('시나리오 4.1.1: 토큰 자동 갱신 (로그인 상태 유지)', async ({ page }) => {
    // Given: 로그인된 사용자
    const user = generateTestUser('_token');
    await register(page, user);

    // When: 페이지 새로고침 (토큰 확인)
    await page.reload();

    // 페이지 로딩 및 Auth 초기화 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Then: 로그인 상태 유지
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBe(true);
  });
});
