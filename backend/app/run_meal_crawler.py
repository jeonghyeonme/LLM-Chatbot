import sys
import os

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.meal import MealCrawler
from core.supabase import SupabaseService
from core.config import settings

def main():
    print("🍱 식단 정보 수집을 시작합니다...")
    meal_crawler = MealCrawler()
    meals = meal_crawler.fetch_all_meals()
    
    if not meals:
        print("⚠️ 수집된 식단 데이터가 없습니다.")
        return

    print(f"✅ {len(meals)}개의 식단 데이터 수집 완료")

    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        print("💾 Supabase에 식단 데이터 적재 중...")
        dates = [m['date'] for m in meals]
        start_date = min(dates)
        end_date = max(dates)
        
        print(f"🧹 기존 데이터 삭제 중 ({start_date} ~ {end_date})...")
        SupabaseService.delete_meals_by_date_range(start_date, end_date)
        
        meal_res = SupabaseService.upsert_meals(meals)
        if meal_res:
            print(f"✅ 식단 데이터 {len(meals)}개 적재 완료")
    else:
        print("⚠️ Supabase 설정이 없어 DB 적재를 건너뜁니다.")

if __name__ == "__main__":
    main()
