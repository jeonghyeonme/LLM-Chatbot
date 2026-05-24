import sys
import os

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.meal import MealCrawler
from services.crawler.schedule import ScheduleCrawler
from core.supabase import SupabaseService

def main():
    print("🚀 크롤링 작업을 시작합니다...")

    # 1. 식단 크롤링
    print("🍱 식단 정보 수집 중...")
    meal_crawler = MealCrawler()
    meals = meal_crawler.fetch_all_meals()
    print(f"✅ {len(meals)}개의 식단 데이터 수집 완료")

    # 2. 학사일정 크롤링
    print("📅 학사일정 정보 수집 중...")
    schedule_crawler = ScheduleCrawler()
    schedules = schedule_crawler.fetch_schedules()
    print(f"✅ {len(schedules)}개의 학사일정 데이터 수집 완료")

    # 3. Supabase 적재 (설정값이 있는 경우에만 실행)
    from core.config import settings
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        print("💾 Supabase에 데이터 적재 중...")
        # Static methods 사용
        meal_res = SupabaseService.upsert_meals(meals)
        if meal_res:
            print("✅ 식단 데이터 적재 완료")
            
        sch_res = SupabaseService.upsert_schedules(schedules)
        if sch_res:
            print("✅ 학사일정 데이터 적재 완료")
    else:
        print("⚠️ Supabase 설정(URL/ANON_KEY)이 없어 DB 적재를 건너뜁니다. (.env 파일을 확인해주세요)")

    print("🏁 모든 작업이 완료되었습니다.")

if __name__ == "__main__":
    main()
