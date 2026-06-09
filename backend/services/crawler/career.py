from typing import List, Dict
from .base import BaseCrawler
from bs4 import BeautifulSoup
import time
import html2text
import re
from core.config import settings

class CareerCrawler(BaseCrawler):
    def __init__(self, department: str, target_url: str):
        super().__init__(target_url)
        self.department = department
        self.h2t = html2text.HTML2Text()
        self.h2t.ignore_links = False
        self.h2t.ignore_images = False
        self.h2t.body_width = 0

    def fetch_notices_with_page(self, page, limit: int = 5) -> List[Dict]:
        """
        이미 로그인된 page 객체를 사용하여 크롤링을 수행합니다.
        """
        results = []
        seen_ids = set()
        
        try:
            print(f"  📢 [{self.department}] 수집 접속: {self.url}")
            page.goto(self.url, wait_until="networkidle", timeout=30000)
            
            # 게시글 목록 대기
            try:
                page.wait_for_selector("table tbody tr", timeout=10000)
            except:
                print(f"    ⚠️ [{self.department}] 게시글이 없거나 로드 실패")
                return []
            
            soup = BeautifulSoup(page.content(), "html.parser")
            rows = soup.select("table tbody tr")
            
            temp_notices = []
            for row in rows:
                if len(temp_notices) >= limit: break
                
                subject_a = row.select_one("a[href*='artclView.do']") or row.select_one("a[href*='jf_combBbs_view']")
                if not subject_a: continue
                
                title = subject_a.get_text(strip=True)
                href = subject_a.get("href", "")
                
                # 다양한 URL 패턴 대응
                match = re.search(r"bbs/([^/]+)/(\d+)/(\d+)/artclView\.do", href)
                if not match: continue
                
                lang, config_no, data_no = match.groups()
                if data_no in seen_ids: continue
                seen_ids.add(data_no)
                
                date_td = row.select_one(".td-date") or (row.find_all("td")[2] if len(row.find_all("td")) > 2 else None)
                date = date_td.get_text(strip=True).rstrip(".").replace(".", "-") if date_td else "2026-06-09"
                
                # 상세 페이지 절대 경로 생성
                base_domain = self.url.split("/kr/")[0] if "/kr/" in self.url else "https://www.inhatc.ac.kr"
                detail_url = f"{base_domain}/bbs/{lang}/{config_no}/{data_no}/artclView.do"
                
                temp_notices.append({
                    "external_id": data_no,
                    "category": self.department,
                    "title": title,
                    "url": detail_url,
                    "date": date
                })

            # 상세 본문 수집
            for notice in temp_notices:
                try:
                    page.goto(notice['url'], wait_until="networkidle", timeout=20000)
                    page.wait_for_selector("._fnctWrap", timeout=5000)
                    
                    combined_html = page.evaluate("""
                        () => {
                            const selectors = ['.view-info', '.view-detail', '.view-con', '.view-file', '.artclViewCon'];
                            let html = '';
                            selectors.forEach(sel => {
                                const el = document.querySelector(sel);
                                if (el) {
                                    const clone = el.cloneNode(true);
                                    const excludes = clone.querySelectorAll('.sumUrl, button, script, style');
                                    excludes.forEach(ex => ex.remove());
                                    html += clone.outerHTML;
                                }
                            });
                            return html;
                        }
                    """)
                    
                    if combined_html:
                        notice["content"] = self.h2t.handle(combined_html).strip()
                        results.append(notice)
                        print(f"    ✅ [{self.department}] 수집 완료: {notice['title'][:15]}...")
                    
                    time.sleep(0.5) # 속도 향상을 위해 약간 단축
                except:
                    continue

        except Exception as e:
            print(f"  ❌ [{self.department}] 크롤링 에러: {e}")
                
        return results

    def fetch_career_notices(self, limit: int = 5) -> List[Dict]:
        """
        기존 인터페이스 유지를 위해 남겨둠 (하지만 내부적으로 새 세션을 여므로 비효율적)
        """
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()
            
            # (로그인 로직이 여기에 다시 필요하므로 사실상 fetch_notices_with_page 사용 권장)
            # 여기서는 간단히 빈 리스트를 리턴하거나 호환성을 위해 유지
            return []
