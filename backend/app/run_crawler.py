import sys
import os

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.meal import MealCrawler
from services.crawler.schedule import ScheduleCrawler
from services.crawler.notice import NoticeCrawler
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

    # 3. 공지사항 수집 (정확한 메뉴 ID 반영)
    print("📢 공지사항 수집 중...")
    notices_to_save = []
    
    # 수집 대상 정의 (menu_id, bbs_id, category_name)
    targets = [
        ("461", "2", "학사"),
        ("464", "2", "행사"),
        ("463", "2", "장학"),
        ("465", "2", "채용"),
        ("466", "2", "일반"),
    ]
    
    for menu_id, bbs_id, cat in targets:
        try:
            crawler = NoticeCrawler(menu_id, bbs_id, cat)
            items = crawler.fetch_notices(limit=10)
            notices_to_save.extend(items)
            print(f"   - {cat}: {len(items)}개 수집")
        except Exception as e:
            print(f"   - {cat} 수집 실패: {e}")

    # 4. Supabase 적재 (설정값이 있는 경우에만 실행)
    from core.config import settings
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        print("💾 Supabase에 데이터 적재 중...")
        
        # 식단 데이터 처리: 삭제 후 삽입 (중복 방지)
        if meals:
            dates = [m['date'] for m in meals]
            start_date = min(dates)
            end_date = max(dates)
            
            print(f"🧹 기존 데이터 삭제 중 ({start_date} ~ {end_date})...")
            SupabaseService.delete_meals_by_date_range(start_date, end_date)
            
            meal_res = SupabaseService.upsert_meals(meals)
            if meal_res:
                print(f"✅ 식단 데이터 {len(meals)}개 적재 완료")
            
        # 학사일정 업서트
        SupabaseService.upsert_schedules(schedules)
        
        # 공지사항 업서트 (중복 제거 로직 추가)
        if notices_to_save:
            # (category, external_id) 조합으로 중복 제거
            unique_notices = []
            seen = set()
            for item in notices_to_save:
                identifier = (item['category'], item['external_id'])
                if identifier not in seen:
                    unique_notices.append(item)
                    seen.add(identifier)
            
            print(f"🧹 중복 제거 후 {len(unique_notices)}개의 공지사항 적재 시도...")
            not_res = SupabaseService.upsert_notices(unique_notices)
            if not_res:
                print(f"✅ 공지사항 {len(unique_notices)}개 적재 완료")
    else:
        print("⚠️ Supabase 설정(URL/ANON_KEY)이 없어 DB 적재를 건너뜁니다. (.env 파일을 확인해주세요)")

    print("🏁 모든 작업이 완료되었습니다.")

if __name__ == "__main__":
    main()
