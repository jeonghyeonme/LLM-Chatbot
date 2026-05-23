-- 1. 식단표 테이블 (meals)
-- 학생식당(일반/특식/간편식) 및 교직원식당(일반) 통합 저장
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,              -- 식단 날짜 (YYYY-MM-DD)
    meal_type TEXT NOT NULL,         -- 조식, 중식, 석식
    menu_category TEXT NOT NULL,     -- 일반, 특식, 간편식, 스넥 등
    menu_content TEXT NOT NULL,      -- 실제 식단 내용
    restaurant_type TEXT NOT NULL,   -- 학생식당, 교직원식당
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 데이터 정합성을 위한 유니크 제약 조건 (Upsert의 기준)
    UNIQUE (date, meal_type, menu_category, restaurant_type)
);

-- 2. 학사일정 테이블 (schedules)
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date DATE NOT NULL,        -- 일정 시작일
    end_date DATE NOT NULL,          -- 일정 종료일
    title TEXT NOT NULL,             -- 일정 명칭
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 시작일, 종료일, 제목이 모두 같으면 동일한 일정으로 판단
    UNIQUE (start_date, end_date, title)
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);
CREATE INDEX IF NOT EXISTS idx_schedules_start_date ON schedules(start_date);

-- ==========================================
-- 🔒 RLS (Row Level Security) 설정 및 정책 추가
-- ==========================================

-- 1. 테이블의 RLS 기능 활성화
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 읽을 수 있는(SELECT) 정책 생성
-- (anon_key를 가진 프론트엔드 접속자들도 데이터를 볼 수 있도록 허용)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '누구나 식단표 조회 가능') THEN
        CREATE POLICY "누구나 식단표 조회 가능" ON meals FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '누구나 학사일정 조회 가능') THEN
        CREATE POLICY "누구나 학사일정 조회 가능" ON schedules FOR SELECT USING (true);
    END IF;
END
$$;
