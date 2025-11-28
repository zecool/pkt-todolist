#!/bin/bash
# E2E 테스트 전체 실행 스크립트

echo "🚀 pkt-TodoList E2E 테스트 시작"
echo "================================"

# Playwright skill 디렉토리
SKILL_DIR="/c/Users/student/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill"
TEST_DIR="/c/test/pkt-todolist/test/e2e"

# 결과 저장 변수
PASSED=0
FAILED=0
TOTAL=0

# 색상 코드
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 테스트 실행 함수
run_test() {
    local test_file=$1
    local test_name=$2

    echo ""
    echo "▶ 테스트 실행: $test_name"
    echo "  파일: $test_file"

    TOTAL=$((TOTAL + 1))

    if cd "$SKILL_DIR" && node run.js "$TEST_DIR/$test_file"; then
        echo -e "${GREEN}✅ 성공: $test_name${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ 실패: $test_name${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# 테스트 실행
echo ""
echo "📋 테스트 목록:"
echo "  1. 회원가입/로그인 (01-auth.test.js)"
echo "  2. 할일 CRUD (02-todo-crud.test.js)"
echo "  3. 휴지통 관리 (03-trash.test.js)"
echo "  4. 국경일 조회 (04-holiday.test.js)"
echo ""

run_test "01-auth.test.js" "회원가입/로그인"
run_test "02-todo-crud.test.js" "할일 CRUD"
run_test "03-trash.test.js" "휴지통 관리"
run_test "04-holiday.test.js" "국경일 조회"

# 결과 요약
echo ""
echo "================================"
echo "📊 테스트 결과 요약"
echo "================================"
echo -e "전체: $TOTAL"
echo -e "${GREEN}성공: $PASSED${NC}"
echo -e "${RED}실패: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 모든 테스트가 성공했습니다!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  일부 테스트가 실패했습니다.${NC}"
    exit 1
fi
