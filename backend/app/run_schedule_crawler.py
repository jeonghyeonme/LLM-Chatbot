import sys
import os

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.schedule import ScheduleCrawler
from core.supabase import SupabaseService
from core.config import settings

def main():
    print("📅 학사일정 정보 수집을 시작합니다...")
    schedule_crawler = ScheduleCrawler()
    schedules = schedule_crawler.fetch_schedules()
    
    if not schedules:
        print("⚠️ 수집된 학사일정 데이터가 없습니다.")
        return

    print(f"✅ {len(schedules)}개의 학사일정 데이터 수집 완료")

    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        print("💾 Supabase에 학사일정 데이터 적재 중...")
        SupabaseService.upsert_schedules(schedules)
        print(f"✅ 학사일정 데이터 {len(schedules)}개 적재 완료")
    else:
        print("⚠️ Supabase 설정이 없어 DB 적재를 건너뜁니다.")

if __name__ == "__main__":
    main()
