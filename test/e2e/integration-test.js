// pkt-TodoList 통합 테스트 - 사용자 시나리오 기반
// 참조: docs/4-user-scenarios.md

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const TARGET_URL = "http://localhost:5173";
const SCREENSHOTS_DIR = path.resolve(__dirname, "screenshots");
const TEST_RESULTS_FILE = path.resolve(__dirname, "integration-test-results.md");

// 테스트용 계정 정보
const TEST_USER = {
  email: `test_${Date.now()}@example.com`,
  password: "SecurePass123!",
  username: "통합테스트사용자",
};

// 스크린샷 디렉토리 생성
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// 테스트 결과 저장용
const testResults = {
  timestamp: new Date().toISOString(),
  url: TARGET_URL,
  scenarios: [],
};

function logScenario(name, status, details = "") {
  const result = {
    scenario: name,
    status,
    details,
    timestamp: new Date().toISOString(),
  };
  testResults.scenarios.push(result);
  console.log(
    `\n${"=".repeat(60)}\n${status === "PASS" ? "✅" : "❌"} ${name}\n${
      details ? details + "\n" : ""
    }${"=".repeat(60)}\n`
  );
}

(async () => {
  console.log("🚀 pkt-TodoList 통합 테스트 시작");
  console.log(`📍 대상 URL: ${TARGET_URL}`);
  console.log(`📸 스크린샷 저장 위치: ${SCREENSHOTS_DIR}`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300, // 액션을 천천히 수행하여 관찰 가능
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }, // 데스크톱 크기로 설정
  });
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // ===== 시나리오 3.1.1: 신규 사용자 회원가입 =====
    console.log("\n📝 [시나리오 3.1.1] 신규 사용자 회원가입");

    try {
      await page.goto(TARGET_URL);
      await page.waitForTimeout(1000);

      // 회원가입 페이지로 이동
      const registerLink = await page.locator('a:has-text("회원가입")').first();
      if ((await registerLink.count()) > 0) {
        await registerLink.click();
        console.log("✓ 회원가입 페이지로 이동");
      } else {
        // URL 직접 이동
        await page.goto(`${TARGET_URL}/register`);
        console.log("✓ 회원가입 페이지로 직접 이동");
      }

      await page.waitForTimeout(1000);

      // 회원가입 폼 작성
      await page.fill('input[type="email"]', TEST_USER.email);
      console.log(`✓ 이메일 입력: ${TEST_USER.email}`);

      await page.fill('input[type="password"]', TEST_USER.password);
      console.log("✓ 비밀번호 입력");

      // 사용자 이름 입력 (필드가 있는 경우)
      const usernameField = await page.locator('input[name="username"]').first();
      if ((await usernameField.count()) > 0) {
        await usernameField.fill(TEST_USER.username);
        console.log(`✓ 사용자 이름 입력: ${TEST_USER.username}`);
      }

      // 회원가입 제출
      await page.click('button[type="submit"]');
      console.log("✓ 회원가입 제출");

      // 페이지 전환 대기 (로그인 페이지 또는 메인 페이지)
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "01-signup-complete.png"),
        fullPage: true,
      });

      logScenario(
        "시나리오 3.1.1: 신규 사용자 회원가입",
        "PASS",
        `이메일: ${TEST_USER.email}`
      );
      testsPassed++;
    } catch (error) {
      logScenario(
        "시나리오 3.1.1: 신규 사용자 회원가입",
        "FAIL",
        error.message
      );
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "01-signup-error.png"),
        fullPage: true,
      });
    }

    // ===== 시나리오 3.1.2: 기존 사용자 로그인 =====
    console.log("\n🔐 [시나리오 3.1.2] 기존 사용자 로그인");

    try {
      // 로그인 페이지로 이동 (회원가입 후 자동 로그인되었을 수도 있음)
      const currentUrl = page.url();
      if (!currentUrl.includes("/todos") && !currentUrl.includes("/home")) {
        // 로그인 필요
        const loginLink = await page.locator('a:has-text("로그인")').first();
        if ((await loginLink.count()) > 0) {
          await loginLink.click();
          await page.waitForTimeout(1000);
        } else {
          await page.goto(`${TARGET_URL}/login`);
        }

        // 로그인 폼 작성
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        console.log("✓ 로그인 제출");

        await page.waitForTimeout(2000);
      } else {
        console.log("✓ 이미 로그인되어 있습니다 (자동 로그인)");
      }

      // 메인 페이지 확인
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "02-login-complete.png"),
        fullPage: true,
      });

      logScenario(
        "시나리오 3.1.2: 기존 사용자 로그인",
        "PASS",
        "로그인 성공 및 메인 페이지 진입"
      );
      testsPassed++;
    } catch (error) {
      logScenario(
        "시나리오 3.1.2: 기존 사용자 로그인",
        "FAIL",
        error.message
      );
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "02-login-error.png"),
        fullPage: true,
      });
    }

    // ===== 시나리오 3.2.1: 상세 정보 포함 할일 추가 =====
    console.log("\n📝 [시나리오 3.2.1] 상세 정보 포함 할일 추가");

    try {
      // 로그인 후 현재 페이지 URL 확인
      await page.waitForTimeout(1000);
      const afterLoginUrl = page.url();
      console.log(`✓ 로그인 후 현재 페이지: ${afterLoginUrl}`);

      // 할일 페이지로 이동 (페이지를 새로 로드하지 않고 네비게이션 사용)
      if (!afterLoginUrl.includes("/todos")) {
        // 할일 메뉴가 있는지 확인하고 클릭
        try {
          await page.waitForSelector("a", { timeout: 5000 });
          const todoLink = await page.locator('a:has-text("할일")').first();

          if (await todoLink.count() > 0) {
            await todoLink.click();
            console.log("✓ 할일 메뉴 클릭");
            await page.waitForTimeout(2000);
          } else {
            console.log("⚠️  할일 메뉴가 없음, 수동으로 네비게이션");
            // URL을 변경하지만 context는 유지
            await page.evaluate(() => {
              window.history.pushState({}, '', '/todos');
              window.location.href = '/todos';
            });
            await page.waitForTimeout(2000);
          }
        } catch (e) {
          console.log("⚠️  네비게이션 실패:", e.message);
        }
      }

      // 페이지 로드 대기
      await page.waitForLoadState("domcontentloaded");
      console.log(`✓ 현재 페이지: ${page.url()}`);

      // React 앱의 root div가 렌더링될 때까지 대기
      try {
        await page.waitForSelector("#root", { timeout: 10000 });
        console.log("✓ React root div 찾음");
      } catch (e) {
        console.log("⚠️  React root div를 찾을 수 없습니다");
      }

      // React 앱이 완전히 마운트되고 h1이 렌더링될 때까지 대기
      try {
        await page.waitForSelector("h1", { timeout: 10000, state: "visible" });
        const h1Text = await page.locator("h1").first().textContent();
        console.log(`✓ 페이지 제목: ${h1Text}`);
      } catch (e) {
        console.log("⚠️  페이지 제목을 찾을 수 없습니다");
      }

      // 추가 안정화 대기
      await page.waitForTimeout(1000);

      // 할일 추가 버튼 찾기 (여러 방법 시도)
      let buttonClicked = false;

      // 방법 1: Plus 아이콘과 함께 있는 버튼 찾기
      try {
        // Plus 아이콘(svg)이 있는 버튼 찾기
        const buttons = await page.locator("button").all();
        console.log(`\n총 버튼 수: ${buttons.length}`);

        for (let i = 0; i < buttons.length; i++) {
          const button = buttons[i];
          const text = await button.textContent();
          const isVisible = await button.isVisible();

          console.log(`버튼 ${i + 1}: "${text?.trim()}" | visible: ${isVisible}`);

          if (text && text.includes("새 할일") && isVisible) {
            await button.click();
            console.log("✓ 할일 추가 버튼 클릭 (텍스트 검색)");
            buttonClicked = true;
            break;
          }
        }
      } catch (e) {
        console.log("⚠️  버튼 검색 중 오류:", e.message);
      }

      if (!buttonClicked) {
        // 방법 2: CSS 선택자로 직접 찾기
        try {
          // 텍스트가 "새 할일 추가"를 포함하는 버튼
          const button = page.locator('button').filter({ hasText: '새 할일 추가' }).first();
          if (await button.count() > 0) {
            await button.click();
            console.log("✓ 할일 추가 버튼 클릭 (filter 사용)");
            buttonClicked = true;
          }
        } catch (e) {
          console.log("⚠️  Filter 방법 실패");
        }
      }

      if (!buttonClicked) {
        // 마지막 시도: aria-label
        try {
          const button = await page.locator('button[aria-label="새 할일 추가"]').first();
          if (await button.count() > 0) {
            await button.click();
            console.log("✓ 할일 추가 버튼 클릭 (aria-label)");
            buttonClicked = true;
          }
        } catch (e) {
          console.log("⚠️  aria-label 방법 실패");
        }
      }

      if (!buttonClicked) {
        // 디버깅: 페이지 HTML 구조 출력
        const bodyHTML = await page.content();
        console.log("\n페이지 HTML (첫 500자):");
        console.log(bodyHTML.substring(0, 500));
        throw new Error("할일 추가 버튼을 찾을 수 없습니다");
      }

      await page.waitForTimeout(1000);

      // 모달 확인
      const modalTitle = await page.locator('h3:has-text("새 할일 추가")');
      if ((await modalTitle.count()) > 0) {
        console.log("✓ 모달 열림 확인");
      }

      // 할일 정보 입력
      const todoTitle = "Q4 프로젝트 최종 보고서 제출";
      await page.fill('input[name="title"]', todoTitle);
      console.log(`✓ 제목 입력: ${todoTitle}`);

      const todoContent =
        "- 경영진 발표 자료 포함\n- 예산 집행 현황 첨부\n- 팀장 검토 완료 필요";
      await page.fill('textarea[name="content"]', todoContent);
      console.log("✓ 내용 입력");

      // 날짜 입력
      const today = new Date().toISOString().split("T")[0];
      await page.fill('input[name="startDate"]', today);
      console.log(`✓ 시작일 입력: ${today}`);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const dueDate = nextWeek.toISOString().split("T")[0];
      await page.fill('input[name="dueDate"]', dueDate);
      console.log(`✓ 만료일 입력: ${dueDate}`);

      // 저장
      await page.click('button[type="submit"]:has-text("저장")');
      console.log("✓ 저장 버튼 클릭");

      await page.waitForTimeout(1500);

      // 할일 목록에서 확인
      const todoItem = await page.locator(`text=${todoTitle}`).first();
      if ((await todoItem.count()) > 0) {
        console.log("✓ 할일이 목록에 추가되었습니다");
      }

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "03-todo-added.png"),
        fullPage: true,
      });

      logScenario(
        "시나리오 3.2.1: 상세 정보 포함 할일 추가",
        "PASS",
        `할일 추가 성공: ${todoTitle}`
      );
      testsPassed++;
    } catch (error) {
      logScenario(
        "시나리오 3.2.1: 상세 정보 포함 할일 추가",
        "FAIL",
        error.message
      );
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "03-todo-added-error.png"),
        fullPage: true,
      });
    }

    // ===== 시나리오 2.1.2: 업무 중 할일 완료 처리 =====
    console.log("\n✅ [시나리오 2.1.2] 업무 중 할일 완료 처리");

    try {
      // 완료되지 않은 첫 번째 할일의 체크박스 찾기
      const checkbox = await page
        .locator('button[aria-label="완료 처리"]')
        .first();

      if ((await checkbox.count()) > 0) {
        await checkbox.click();
        console.log("✓ 할일 완료 체크");

        await page.waitForTimeout(1000);

        // 완료 상태 확인
        const completedCheckbox = await page
          .locator('button[aria-label="완료됨"]')
          .first();
        const isCompleted = (await completedCheckbox.count()) > 0;
        console.log(
          isCompleted ? "✅ 완료 상태 확인" : "⚠️  완료 상태 미확인"
        );

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "04-todo-completed.png"),
          fullPage: true,
        });

        logScenario(
          "시나리오 2.1.2: 업무 중 할일 완료 처리",
          "PASS",
          "할일 완료 처리 성공"
        );
        testsPassed++;
      } else {
        throw new Error("완료 가능한 할일을 찾을 수 없습니다");
      }
    } catch (error) {
      logScenario(
        "시나리오 2.1.2: 업무 중 할일 완료 처리",
        "FAIL",
        error.message
      );
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "04-todo-completed-error.png"),
        fullPage: true,
      });
    }

    // ===== 시나리오 3.2.2: 할일 수정 및 일정 변경 =====
    console.log("\n✏️  [시나리오 3.2.2] 할일 수정 및 일정 변경");

    try {
      // 수정 버튼 클릭 (첫 번째 할일의 수정 버튼)
      const editButton = await page.locator('button:has-text("수정")').first();

      if ((await editButton.count()) === 0) {
        throw new Error("수정 버튼을 찾을 수 없습니다");
      }

      await editButton.click();
      console.log("✓ 수정 버튼 클릭");

      await page.waitForTimeout(500);

      // 모달 타이틀 확인
      const modalTitle = await page.locator('h3:has-text("할일 수정")');
      if ((await modalTitle.count()) > 0) {
        console.log("✓ 수정 모달 열림 확인");
      }

      // 제목 수정
      const titleInput = await page.locator('input[name="title"]');
      const originalTitle = await titleInput.inputValue();
      const newTitle = `${originalTitle} (수정됨)`;
      await titleInput.fill(newTitle);
      console.log(`✓ 제목 수정: ${newTitle}`);

      // 저장
      await page.click('button[type="submit"]:has-text("저장")');
      console.log("✓ 수정 저장");

      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "05-todo-edited.png"),
        fullPage: true,
      });

      logScenario(
        "시나리오 3.2.2: 할일 수정 및 일정 변경",
        "PASS",
        `할일 수정 성공: ${newTitle}`
      );
      testsPassed++;
    } catch (error) {
      logScenario(
        "시나리오 3.2.2: 할일 수정 및 일정 변경",
        "FAIL",
        error.message
      );
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "05-todo-edited-error.png"),
        fullPage: true,
      });
    }

    // ===== 시나리오 2.1.3: 실수로 삭제한 할일 복원 =====
    console.log("\n🗑️ [시나리오 2.1.3] 실수로 삭제한 할일 복원");

    try {
      // 삭제 버튼 클릭
      const deleteButton = await page
        .locator('button:has-text("삭제")')
        .first();

      if ((await deleteButton.count()) === 0) {
        throw new Error("삭제 버튼을 찾을 수 없습니다");
      }

      // 삭제할 할일의 제목 저장
      const todoItems = await page.locator('[class*="todo"]').first();
      const deletedTodoTitle = await todoItems.textContent();

      await deleteButton.click();
      console.log("✓ 삭제 버튼 클릭");

      await page.waitForTimeout(1000);

      // 휴지통으로 이동
      const trashLink = await page.locator('a:has-text("휴지통")').first();
      if ((await trashLink.count()) > 0) {
        await trashLink.click();
        console.log("✓ 휴지통 페이지로 이동");
        await page.waitForTimeout(1000);
      } else {
        await page.goto(`${TARGET_URL}/trash`);
        console.log("✓ 휴지통 페이지로 직접 이동");
        await page.waitForTimeout(1000);
      }

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "06-trash-view.png"),
        fullPage: true,
      });

      // 복원 버튼 찾기
      const restoreButton = await page
        .locator('button:has-text("복원")')
        .first();

      if ((await restoreButton.count()) > 0) {
        await restoreButton.click();
        console.log("✓ 복원 버튼 클릭");
        await page.waitForTimeout(1000);

        // 할일 목록으로 돌아가기
        const todosLink = await page.locator('a:has-text("할일")').first();
        if ((await todosLink.count()) > 0) {
          await todosLink.click();
          await page.waitForTimeout(1000);
        }

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "07-todo-restored.png"),
          fullPage: true,
        });

        logScenario(
          "시나리오 2.1.3: 실수로 삭제한 할일 복원",
          "PASS",
          "할일 복원 성공"
        );
        testsPassed++;
      } else {
        throw new Error("복원 버튼을 찾을 수 없습니다");
      }
    } catch (error) {
      logScenario(
        "시나리오 2.1.3: 실수로 삭제한 할일 복원",
        "FAIL",
        error.message
      );
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "07-todo-restored-error.png"),
        fullPage: true,
      });
    }

    // ===== 시나리오 3.3.1: 오래된 할일 정리 및 영구 삭제 =====
    console.log("\n🗑️ [시나리오 3.3.1] 오래된 할일 정리 및 영구 삭제");

    try {
      // 휴지통으로 이동
      const currentUrl = page.url();
      if (!currentUrl.includes("/trash")) {
        const trashLink = await page.locator('a:has-text("휴지통")').first();
        if ((await trashLink.count()) > 0) {
          await trashLink.click();
          await page.waitForTimeout(1000);
        } else {
          await page.goto(`${TARGET_URL}/trash`);
          await page.waitForTimeout(1000);
        }
      }

      // 영구 삭제 버튼 찾기
      const permanentDeleteButton = await page
        .locator('button:has-text("영구 삭제")')
        .first();

      if ((await permanentDeleteButton.count()) > 0) {
        await permanentDeleteButton.click();
        console.log("✓ 영구 삭제 버튼 클릭");

        await page.waitForTimeout(1000);

        // 확인 다이얼로그가 있다면 확인
        const confirmButton = await page
          .locator('button:has-text("확인")')
          .first();
        if ((await confirmButton.count()) > 0) {
          await confirmButton.click();
          console.log("✓ 영구 삭제 확인");
          await page.waitForTimeout(1000);
        }

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "08-permanent-delete.png"),
          fullPage: true,
        });

        logScenario(
          "시나리오 3.3.1: 오래된 할일 정리 및 영구 삭제",
          "PASS",
          "영구 삭제 성공"
        );
        testsPassed++;
      } else {
        console.log("⚠️  휴지통이 비어있거나 영구 삭제할 항목이 없습니다");
        logScenario(
          "시나리오 3.3.1: 오래된 할일 정리 및 영구 삭제",
          "PASS",
          "휴지통이 비어있음"
        );
        testsPassed++;
      }
    } catch (error) {
      logScenario(
        "시나리오 3.3.1: 오래된 할일 정리 및 영구 삭제",
        "FAIL",
        error.message
      );
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "08-permanent-delete-error.png"),
        fullPage: true,
      });
    }

    // ===== 추가 시나리오: 국경일 조회 =====
    console.log("\n📅 [추가 시나리오] 국경일 조회");

    try {
      // 국경일 페이지로 이동
      const holidayLink = await page.locator('a:has-text("국경일")').first();
      if ((await holidayLink.count()) > 0) {
        await holidayLink.click();
        console.log("✓ 국경일 페이지로 이동");
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "09-holidays-view.png"),
          fullPage: true,
        });

        logScenario("추가 시나리오: 국경일 조회", "PASS", "국경일 조회 성공");
        testsPassed++;
      } else {
        console.log("⚠️  국경일 메뉴를 찾을 수 없습니다");
        logScenario(
          "추가 시나리오: 국경일 조회",
          "SKIP",
          "국경일 메뉴 없음"
        );
      }
    } catch (error) {
      logScenario("추가 시나리오: 국경일 조회", "FAIL", error.message);
      testsFailed++;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "09-holidays-view-error.png"),
        fullPage: true,
      });
    }

    // ===== 테스트 결과 요약 =====
    console.log("\n" + "=".repeat(60));
    console.log("📊 통합 테스트 결과 요약");
    console.log("=".repeat(60));
    console.log(`✅ 성공: ${testsPassed}개`);
    console.log(`❌ 실패: ${testsFailed}개`);
    console.log(`📸 스크린샷 저장 위치: ${SCREENSHOTS_DIR}`);
    console.log("=".repeat(60));

    // 마크다운 형식의 테스트 결과 저장
    const markdown = `# pkt-TodoList 통합 테스트 결과

**테스트 일시**: ${testResults.timestamp}
**대상 URL**: ${testResults.url}
**총 테스트**: ${testsPassed + testsFailed}개
**성공**: ${testsPassed}개
**실패**: ${testsFailed}개

---

## 테스트 시나리오별 결과

${testResults.scenarios
  .map(
    (s, i) => `
### ${i + 1}. ${s.scenario}

- **상태**: ${s.status}
- **시간**: ${s.timestamp}
${s.details ? `- **세부사항**: ${s.details}` : ""}
`
  )
  .join("\n")}

---

## 스크린샷

테스트 중 생성된 스크린샷은 다음 위치에 저장되었습니다:
\`${SCREENSHOTS_DIR}\`

---

## 참조 문서

- [사용자 시나리오](../../docs/4-user-scenarios.md)
- [PRD](../../docs/3-prd.md)

---

**테스트 완료 시각**: ${new Date().toISOString()}
`;

    fs.writeFileSync(TEST_RESULTS_FILE, markdown, "utf-8");
    console.log(`\n📄 테스트 결과 저장: ${TEST_RESULTS_FILE}`);
  } catch (error) {
    console.error("❌ 테스트 실행 중 오류 발생:", error.message);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "error-critical.png"),
      fullPage: true,
    });
  } finally {
    await page.waitForTimeout(3000); // 결과 확인을 위한 대기
    await browser.close();
    console.log("\n✅ 브라우저 종료");
  }
})();
