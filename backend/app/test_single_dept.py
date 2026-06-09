import sys
import os
import json

# 프로젝트 루트 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.crawler.career import CareerCrawler
from core.config import settings

def main():
    map_path = os.path.join(os.getcwd(), 'dept_career_map.json')
    if not os.path.exists(map_path):
        print("⚠️ dept_career_map.json 파일이 없습니다.")
        return

    with open(map_path, 'r', encoding='utf-8') as f:
        dept_map = json.load(f)

    # 첫 번째 학과 (기계공학과) 테스트
    first = dept_map[0]
    print(f"🚀 테스트 대상 학과: {first['department']}")
    print(f"🔗 목표 URL: {first['career_url']}")

    if not settings.CAMPUS_ID or not settings.CAMPUS_PW:
        print("❌ .env 설정 필요")
        return

    try:
        crawler = CareerCrawler(department=first['department'], target_url=first['career_url'])
        # 목록 및 본문 수집 테스트 (시간 단축을 위해 2개만)
        items = crawler.fetch_career_notices(limit=2)
        
        if items:
            print(f"\n✅ 수집 결과 ({len(items)}건):")
            for item in items:
                print(f"- 제목: {item['title']}")
                print(f"  날짜: {item['date']}")
                print(f"  내용 요약: {item['content'][:50]}...")
        else:
            print("\n⚠️ 수집된 데이터가 없습니다.")
    except Exception as e:
        print(f"❌ 에러 발생: {e}")

if __name__ == "__main__":
    main()
