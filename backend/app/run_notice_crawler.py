import sys
import os

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.notice import NoticeCrawler
from core.supabase import SupabaseService
from core.config import settings

def main():
    print("📢 공지사항 수집을 시작합니다...")
    notices_to_save = []
    
    # 수집 대상 정의 (menu_id, category_name)
    targets = [
        ("461", "학사"),
        ("464", "행사"),
        ("463", "장학"),
        ("465", "채용"),
        ("466", "일반"),
    ]
    
    for menu_id, cat in targets:
        try:
            crawler = NoticeCrawler(menu_id, cat)
            # 상세 페이지 크롤링이 포함되어 시간이 걸리므로 limit을 적절히 조절
            items = crawler.fetch_notices(limit=5) 
            notices_to_save.extend(items)
            print(f"   - {cat}: {len(items)}개 수집 완료")
        except Exception as e:
            print(f"   - {cat} 수집 실패: {e}")

    if not notices_to_save:
        print("⚠️ 수집된 공지사항 데이터가 없습니다.")
        return

    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        # (category, external_id) 조합으로 중복 제거
        unique_notices = []
        seen = set()
        for item in notices_to_save:
            identifier = (item['category'], item['external_id'])
            if identifier not in seen:
                unique_notices.append(item)
                seen.add(identifier)
        
        print(f"💾 Supabase에 {len(unique_notices)}개의 공지사항 적재 중...")
        not_res = SupabaseService.upsert_notices(unique_notices)
        if not_res:
            print(f"✅ 공지사항 {len(unique_notices)}개 적재 완료")
    else:
        print("⚠️ Supabase 설정이 없어 DB 적재를 건너뜁니다.")

if __name__ == "__main__":
    main()
