// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './specs',

  // 테스트 타임아웃 설정
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  // 병렬 실행 설정
  fullyParallel: true,

  // CI에서 실패 시 재시도 안함
  forbidOnly: !!process.env.CI,

  // 재시도 설정
  retries: process.env.CI ? 2 : 0,

  // 워커 수 설정
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  // 공통 설정
  use: {
    // 기본 URL (프론트엔드 개발 서버)
    baseURL: 'http://localhost:5173',

    // 스크린샷 설정
    screenshot: 'only-on-failure',

    // 비디오 설정
    video: 'retain-on-failure',

    // 트레이스 설정
    trace: 'on-first-retry',
  },

  // 프로젝트별 브라우저 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 개발 서버 설정 (필요 시 자동 시작)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
});
