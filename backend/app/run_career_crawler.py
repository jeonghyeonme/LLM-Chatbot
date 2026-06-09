import sys
import os
import json
import time
from playwright.sync_api import sync_playwright

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

    script_dir = os.path.dirname(os.path.abspath(__file__))
    map_path = os.path.join(script_dir, 'dept_career_map.json')
    if not os.path.exists(map_path):
        print(f"⚠️ 에러: {map_path} 파일이 없습니다. discover_depts.py를 먼저 실행하세요.")
        return

    with open(map_path, 'r', encoding='utf-8') as f:
        dept_map = json.load(f)

    total_count = 0

    # 2. 브라우저 세션 시작 (공통 세션 사용)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        # 로그인 수행 (최초 1회)
        print("🔐 전체 학과 수집을 위한 포털 로그인 시도 중...")
        login_url = "https://www.inhatc.ac.kr/subLogin/kr/view.do"
        try:
            page.goto(login_url, wait_until="networkidle")
            page.fill("#inputUserId", settings.CAMPUS_ID)
            page.fill("#inputUserPwd", settings.CAMPUS_PW)
            page.click("._loginSubmit, .btn_login, #btnLogin, .login_btn, button[type='submit']")
            page.wait_for_load_state("networkidle")
            time.sleep(3) # 확실한 로그인 완료 대기
            print("✅ 로그인 성공!")
        except Exception as e:
            print(f"❌ 초기 로그인 실패: {e}")
            browser.close()
            return

        # 3. 각 학과별 크롤링 수행
        for entry in dept_map:
            dept_name = entry['department']
            url = entry['career_url']
            
            if "job.inhatc.ac.kr" in url:
                print(f"  ⏭️ [{dept_name}] 중앙 취업 포털은 건너뜁니다.")
                continue

            try:
                # CareerCrawler 인스턴스 생성 (이미 열린 page 객체 전달)
                crawler = CareerCrawler(department=dept_name, target_url=url)
                # fetch_career_notices를 refactor하여 page를 인자로 받을 수 있게 수정해야 함
                # 일단은 스크립트 레벨에서 직접 호출하거나 crawler 구조를 변경
                items = crawler.fetch_notices_with_page(page, limit=5)
                
                if items:
                    print(f"    ✅ [{dept_name}] {len(items)}개 수집 완료")
                    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
                        SupabaseService.upsert_careers(items)
                        total_count += len(items)
                else:
                    print(f"    ⚠️ [{dept_name}] 새로운 정보가 없습니다.")
            except Exception as e:
                print(f"    ❌ [{dept_name}] 수집 중 오류: {e}")

        browser.close()

    print(f"🏁 모든 학과 수집 완료! (총 {total_count}건 적재)")

if __name__ == "__main__":
    main()
