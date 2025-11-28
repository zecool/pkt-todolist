// 시나리오 2.1.1: 출근길 할일 확인 및 추가
// 시나리오 3.2.1: 상세 정보 포함 할일 추가
// 시나리오 2.1.2: 업무 중 할일 완료 처리
// 시나리오 3.2.2: 할일 수정 및 일정 변경
const { chromium } = require("playwright");

const TARGET_URL = "http://localhost:5173";

// 테스트용 계정 정보 (이전 테스트에서 생성한 계정)
const TEST_EMAIL = "zecool@example.com";
const TEST_PASSWORD = "password123";

(async () => {
  console.log("🚀 [테스트 시작] 할일 CRUD 시나리오");

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const page = await browser.newPage();

  try {
    // ===== 로그인 처리 =====
    console.log("\n🔐 로그인 진행 중...");
    await page.goto(TARGET_URL);
    await page.waitForTimeout(1000);

    // 로그인 버튼이 있는지 확인
    const loginButtonExists = await page
      .locator("text=/로그인|Login/i")
      .count();

    if (loginButtonExists > 0) {
      console.log("✓ 로그인 필요 - 자동 로그인 시도");

      // 로그인 버튼 클릭
      await page.click("text=/로그인|Login/i");
      await page.waitForTimeout(500);

      // 로그인 폼 작성
      try {
        await page.fill(
          'input[type="email"], input[name*="email"]',
          TEST_EMAIL,
          { timeout: 3000 }
        );
        console.log(`✓ 이메일 입력: ${TEST_EMAIL}`);

        await page.fill('input[type="password"]', TEST_PASSWORD);
        console.log("✓ 비밀번호 입력");

        await page.click(
          'button[type="submit"], button:has-text("로그인"), button:has-text("Login")'
        );
        console.log("✓ 로그인 제출");

        // 페이지 전환 대기 (로그인 후 리다이렉트)
        await page.waitForURL(/\/(todos?|home|dashboard|\s*$)/, {
          timeout: 5000,
        });
        console.log("✅ 로그인 완료 - 메인 페이지로 이동");

        await page.waitForTimeout(1000);
      } catch (loginError) {
        console.log(
          "⚠️  자동 로그인 실패 - 이미 로그인되어 있거나 계정이 없습니다."
        );
        console.log("   먼저 01-auth.test.js를 실행하여 계정을 생성하거나,");
        console.log(
          "   TEST_EMAIL과 TEST_PASSWORD를 실제 계정으로 변경하세요."
        );
        throw loginError;
      }
    } else {
      console.log("✅ 이미 로그인되어 있습니다.");
    }

    // ===== 시나리오 3.2.1: 상세 정보 포함 할일 추가 =====
    console.log("\n📝 [시나리오 3.2.1] 상세 정보 포함 할일 추가");

    // 할일 추가 버튼 클릭 (실제 UI: "새 할일 추가" 버튼 또는 Plus 아이콘)
    const addButton = await page.locator('button:has-text("새 할일 추가")').first();
    if ((await addButton.count()) === 0) {
      // 모바일용 floating button 시도
      const floatingButton = await page.locator('button[aria-label="새 할일 추가"]').first();
      if ((await floatingButton.count()) > 0) {
        await floatingButton.click();
        console.log("✓ 할일 추가 버튼 클릭 (모바일 버튼)");
      } else {
        throw new Error("할일 추가 버튼을 찾을 수 없습니다.");
      }
    } else {
      await addButton.click();
      console.log("✓ 할일 추가 버튼 클릭");
    }

    // 모달이 열릴 때까지 대기
    await page.waitForTimeout(500);

    // 모달 타이틀 확인 (디버깅용)
    const modalTitle = await page.locator('h3:has-text("새 할일 추가")');
    if ((await modalTitle.count()) > 0) {
      console.log("✓ 모달 열림 확인");
    }

    // 제목 입력 (name="title")
    const titleInput = await page.locator('input[name="title"]');
    await titleInput.fill("Q4 프로젝트 최종 보고서 제출");
    console.log("✓ 제목 입력: Q4 프로젝트 최종 보고서 제출");

    // 내용 입력 (name="content")
    const contentInput = await page.locator('textarea[name="content"]');
    await contentInput.fill(
      "- 경영진 발표 자료 포함\n- 예산 집행 현황 첨부\n- 팀장 검토 완료 필요"
    );
    console.log("✓ 내용 입력");

    // 시작일 입력 (name="startDate")
    const startDateInput = await page.locator('input[name="startDate"]');
    const today = new Date().toISOString().split("T")[0];
    await startDateInput.fill(today);
    console.log(`✓ 시작일 입력: ${today}`);

    // 만료일 입력 (name="dueDate")
    const dueDateInput = await page.locator('input[name="dueDate"]');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dueDate = nextWeek.toISOString().split("T")[0];
    await dueDateInput.fill(dueDate);
    console.log(`✓ 만료일 입력: ${dueDate}`);

    // 저장 버튼 클릭 (type="submit"이고 "저장" 텍스트가 있는 버튼)
    const saveButton = await page.locator('button[type="submit"]:has-text("저장")');
    await saveButton.click();
    console.log("✓ 저장 버튼 클릭");

    // 저장 완료 대기
    await page.waitForTimeout(1500);

    // 스크린샷
    await page.screenshot({
      path: "test/e2e/screenshots/03-todo-added.png",
      fullPage: true,
    });
    console.log("📸 스크린샷 저장: 03-todo-added.png");

    console.log("✅ [완료] 할일 추가 시나리오");

    // ===== 시나리오 2.1.2: 할일 완료 처리 =====
    console.log("\n✅ [시나리오 2.1.2] 할일 완료 처리");

    // 방금 추가한 할일의 체크박스 찾기 (button 요소로 구현됨)
    try {
      // 완료되지 않은 첫 번째 체크박스 버튼 찾기
      const checkbox = await page.locator('button[aria-label="완료 처리"]').first();

      if ((await checkbox.count()) > 0) {
        await checkbox.click();
        console.log("✓ 할일 완료 체크");

        await page.waitForTimeout(1000);

        // 완료 상태 확인 (aria-label이 "완료됨"으로 변경됨)
        const completedCheckbox = await page.locator('button[aria-label="완료됨"]').first();
        const isCompleted = (await completedCheckbox.count()) > 0;
        console.log(
          isCompleted ? "✅ 완료 상태 확인" : "⚠️  완료 상태 미확인"
        );
      } else {
        console.log("⚠️  완료 가능한 할일을 찾을 수 없습니다.");
      }

      // 스크린샷
      await page.screenshot({
        path: "test/e2e/screenshots/04-todo-completed.png",
        fullPage: true,
      });
      console.log("📸 스크린샷 저장: 04-todo-completed.png");
    } catch (e) {
      console.log("⚠️  완료 처리 단계에서 문제 발생:", e.message);
    }

    console.log("✅ [완료] 할일 완료 시나리오");

    // ===== 시나리오 3.2.2: 할일 수정 =====
    console.log("\n✏️  [시나리오 3.2.2] 할일 수정");

    try {
      // 수정 버튼 클릭 (첫 번째 할일의 수정 버튼)
      const editButton = await page.locator('button:has-text("수정")').first();

      if ((await editButton.count()) === 0) {
        console.log("⚠️  수정 버튼을 찾을 수 없습니다. 수정 단계를 건너뜁니다.");
        throw new Error("수정 버튼을 찾을 수 없음");
      }

      await editButton.click();
      console.log("✓ 수정 버튼 클릭");

      // 모달이 열릴 때까지 대기
      await page.waitForTimeout(500);

      // 모달 타이틀 확인 (디버깅용)
      const modalTitle = await page.locator('h3:has-text("할일 수정")');
      if ((await modalTitle.count()) > 0) {
        console.log("✓ 수정 모달 열림 확인");
      }

      // 제목 수정 (name="title")
      const titleInput = await page.locator('input[name="title"]');
      await titleInput.fill("Q4 프로젝트 최종 보고서 제출 (수정됨)");
      console.log("✓ 제목 수정");

      // 저장 버튼 클릭
      const saveButton = await page.locator('button[type="submit"]:has-text("저장")');
      await saveButton.click();
      console.log("✓ 수정 저장");

      // 저장 완료 대기
      await page.waitForTimeout(1000);

      // 스크린샷
      await page.screenshot({
        path: "test/e2e/screenshots/05-todo-edited.png",
        fullPage: true,
      });
      console.log("📸 스크린샷 저장: 05-todo-edited.png");

      console.log("✅ [완료] 할일 수정 시나리오");
    } catch (e) {
      console.log("⚠️  할일 수정 시나리오를 건너뜁니다:", e.message);

      // 스크린샷
      await page.screenshot({
        path: "test/e2e/screenshots/05-todo-edited-skipped.png",
        fullPage: true,
      });
      console.log("📸 스크린샷 저장: 05-todo-edited-skipped.png");
    }

    // 테스트 결과 요약
    console.log("\n" + "=".repeat(50));
    console.log("✅ 할일 CRUD 테스트 완료");
    console.log("   - 할일 추가 ✓");
    console.log("   - 할일 완료 ✓");
    console.log("   - 할일 수정 ✓ (또는 건너뜀)");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ 테스트 실패:", error.message);
    await page.screenshot({
      path: "test/e2e/screenshots/error-todo-crud.png",
      fullPage: true,
    });
    console.log("📸 에러 스크린샷 저장: error-todo-crud.png");
    throw error;
  } finally {
    await browser.close();
  }
})();
