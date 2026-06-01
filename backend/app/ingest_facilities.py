import sys
import os

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.campus import CampusCrawler
from core.supabase import SupabaseService
from core.config import settings

def main():
    print("🚀 시설 데이터 전용 크롤링 및 적재를 시작합니다...")
    
    # 1. 크롤러 실행
    campus_crawler = CampusCrawler()
    facilities = campus_crawler.fetch_building_markers()
    print(f"✅ {len(facilities)}개의 시설 데이터 수집 완료")

    # 2. Supabase 적재
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        if facilities:
            print(f"💾 Supabase에 {len(facilities)}개의 데이터 적재 중...")
            res = SupabaseService.upsert_facilities(facilities)
            if res:
                print(f"✅ 시설 데이터 적재 완료")
    else:
        print("⚠️ Supabase 설정이 없어 적재를 건너뜁니다.")

if __name__ == "__main__":
    main()
