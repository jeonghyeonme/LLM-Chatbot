import sys
import os

# 프로젝트 루트 디렉토리 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.services.crawler.notice import NoticeCrawler

def test_notice_crawler():
    print("🚀 공지사항 크롤러 테스트 시작...")
    
    # 460: 공지사항 메인, 2: 게시판 ID, '일반공지': 카테고리명
    crawler = NoticeCrawler("460", "2", "일반공지")
    
    # 첨부파일 있는 글을 찾기 위해 limit 상향
    notices = crawler.fetch_notices(limit=5)
    
    if not notices:
        print("❌ 공지사항을 가져오지 못했습니다.")
        return

    for notice in notices:
        print(f"\n📌 제목: {notice['title']}")
        print(f"👤 작성자: {notice['author']}")
        print(f"📅 날짜: {notice['date']}")
        print(f"📎 첨부파일 개수: {len(notice['attachments'])}")
        
        for file in notice['attachments']:
            print(f"  - 파일명: {file['name']}")
            # 다운로드 유효성 테스트
            is_downloadable = crawler.test_download(file['url'])
            if is_downloadable:
                print(f"  ✅ 다운로드 가능 확인!")
            else:
                print(f"  ⚠️ 다운로드 불가 혹은 접근 제한")

if __name__ == "__main__":
    test_notice_crawler()
