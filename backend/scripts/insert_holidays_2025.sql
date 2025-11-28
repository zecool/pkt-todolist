-- 2025년 대한민국 국경일 데이터 삽입
-- isRecurring=true로 설정

-- 기존 2025년 데이터 확인 (선택사항)
-- SELECT COUNT(*) FROM holidays WHERE EXTRACT(YEAR FROM date) = 2025;

-- 국경일 데이터 삽입
BEGIN;

INSERT INTO holidays (title, date, description, is_recurring)
VALUES
  ('신정', '2025-01-01', '새해 첫날', true),
  ('삼일절', '2025-03-01', '3·1 독립운동 기념일', true),
  ('어린이날', '2025-05-05', '어린이를 위한 날', true),
  ('석가탄신일', '2025-05-05', '부처님 오신 날', true),
  ('현충일', '2025-06-06', '순국선열과 전몰장병을 추모하는 날', true),
  ('광복절', '2025-08-15', '대한민국 광복 기념일', true),
  ('개천절', '2025-10-03', '대한민국 건국 기념일', true),
  ('추석 연휴', '2025-10-06', '추석 연휴 첫날', true),
  ('추석', '2025-10-07', '한가위', true),
  ('추석 연휴', '2025-10-08', '추석 연휴 마지막날', true),
  ('한글날', '2025-10-09', '한글 창제를 기념하는 날', true),
  ('크리스마스', '2025-12-25', '성탄절', true);

COMMIT;

-- 삽입 결과 확인
SELECT
  holiday_id,
  title,
  date,
  description,
  is_recurring,
  created_at
FROM holidays
WHERE EXTRACT(YEAR FROM date) = 2025
ORDER BY date;

-- 총 개수 확인
SELECT COUNT(*) as total_count
FROM holidays
WHERE EXTRACT(YEAR FROM date) = 2025;
