from playwright.sync_api import sync_playwright
from core.config import settings
import time
import random

class BaseCrawler:
    def __init__(self, url: str):
        self.url = url

    def get_page_content(self, wait_selector: str = None):
        """
        Playwright를 사용하여 브라우저를 띄우고 HTML 소스를 가져옵니다.
        """
        with sync_playwright() as p:
            # 브라우저 실행 (headless=True는 화면 안 띄움)
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            
            try:
                print(f"  🌐 브라우저 접속 중: {self.url}")
                page.goto(self.url, wait_until="networkidle")
                
                if wait_selector:
                    page.wait_for_selector(wait_selector, timeout=10000)
                
                # 랜덤 지연 (사람처럼 보이기 위함)
                time.sleep(random.uniform(1.5, 3.0))
                
                return page.content()
            except Exception as e:
                print(f"  ❌ 브라우저 실행 중 에러 발생: {e}")
                return None
            finally:
                browser.close()
