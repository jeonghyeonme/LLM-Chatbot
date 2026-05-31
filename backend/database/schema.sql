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

-- 3. 공지사항 테이블 (notices)
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT NOT NULL,       -- 학교 홈페이지 게시글 번호 (nttId)
    category TEXT NOT NULL,          -- 학사, 행사, 장학, 채용, 일반 등
    title TEXT NOT NULL,             -- 공지 제목
    content TEXT,                    -- 공지 본문 내용
    author TEXT DEFAULT '관리자',     -- 작성 부서/작성자
    date DATE NOT NULL,              -- 게시일
    views INTEGER DEFAULT 0,         -- 조회수
    attachments JSONB DEFAULT '[]',  -- 첨부파일 목록 [{"name": "...", "url": "..."}]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 게시판 종류와 게시글 번호 조합으로 유니크 제약
    UNIQUE (category, external_id)
);

-- 4. 시설 및 장소 정보 테이블 (facilities)
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,              -- 건물/장소 명칭
    latitude DOUBLE PRECISION NOT NULL, -- 위도
    longitude DOUBLE PRECISION NOT NULL, -- 경도
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE (name)
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);
CREATE INDEX IF NOT EXISTS idx_schedules_start_date ON schedules(start_date);
CREATE INDEX IF NOT EXISTS idx_notices_date ON notices(date DESC);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities(name);

-- ==========================================
-- 🔒 RLS (Row Level Security) 설정 및 정책 추가
-- ==========================================

-- 1. 테이블의 RLS 기능 활성화
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 읽을 수 있는(SELECT) 정책 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '누구나 식단표 조회 가능') THEN
        CREATE POLICY "누구나 식단표 조회 가능" ON meals FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '누구나 학사일정 조회 가능') THEN
        CREATE POLICY "누구나 학사일정 조회 가능" ON schedules FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '누구나 공지사항 조회 가능') THEN
        CREATE POLICY "누구나 공지사항 조회 가능" ON notices FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '누구나 시설 정보 조회 가능') THEN
        CREATE POLICY "누구나 시설 정보 조회 가능" ON facilities FOR SELECT USING (true);
    END IF;
END
$$;
