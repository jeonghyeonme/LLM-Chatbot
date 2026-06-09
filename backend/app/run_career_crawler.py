import sys
import os
import json

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.career import CareerCrawler
from core.supabase import SupabaseService
from core.config import settings

def main():
    print("💼 학과별 취업 및 추천채용 정보 수집을 시작합니다...")
    
    # 1. 설정 및 학과 맵 로드
    if not settings.CAMPUS_ID or not settings.CAMPUS_PW:
        print("⚠️ 에러: CAMPUS_ID와 CAMPUS_PW 환경변수가 설정되지 않았습니다.")
        return

    map_path = os.path.join(os.getcwd(), 'dept_career_map.json')
    if not os.path.exists(map_path):
        print("⚠️ 에러: dept_career_map.json 파일이 없습니다. discover_depts.py를 먼저 실행하세요.")
        return

    with open(map_path, 'r', encoding='utf-8') as f:
        dept_map = json.load(f)

    total_count = 0
    # 2. 각 학과별 크롤링 수행
    for entry in dept_map:
        dept_name = entry['department']
        url = entry['career_url']
        
        # 'job.inhatc.ac.kr'은 구조가 다르므로 일단 제외하거나 추후 별도 처리
        if "job.inhatc.ac.kr" in url:
            print(f"  ⏭️ [{dept_name}] 중앙 취업 포털은 건너뜁니다.")
            continue

        try:
            crawler = CareerCrawler(department=dept_name, target_url=url)
            items = crawler.fetch_career_notices(limit=5)
            
            if items:
                print(f"    ✅ [{dept_name}] {len(items)}개 수집 완료")
                if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
                    SupabaseService.upsert_careers(items)
                    total_count += len(items)
            else:
                print(f"    ⚠️ [{dept_name}] 새로운 정보가 없습니다.")
        except Exception as e:
            print(f"    ❌ [{dept_name}] 수집 중 오류: {e}")

    print(f"🏁 모든 학과 수집 완료! (총 {total_count}건 적재)")

if __name__ == "__main__":
    main()
