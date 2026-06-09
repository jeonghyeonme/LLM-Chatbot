from typing import List, Dict
from .base import BaseCrawler
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time
import html2text
from core.config import settings

class CareerCrawler(BaseCrawler):
    def __init__(self, department: str, target_url: str):
        # 인하공전 학과별 취업 게시판 URL
        super().__init__(target_url)
        self.department = department
        self.login_url = "https://www.inhatc.ac.kr/subLogin/kr/view.do"
        self.h2t = html2text.HTML2Text()
        self.h2t.ignore_links = False
        self.h2t.ignore_images = False
        self.h2t.body_width = 0

    def _login(self, page):
        """
        포털 로그인을 수행합니다. (세션 유지를 위해 한 번만 수행하도록 context 재사용 권장)
        """
        # 이미 로그인 되어 있는지 확인 (로그아웃 버튼이나 내 정보 버튼 존재 여부)
        if page.query_selector(".btn_logout, .logout"):
            return True

        print(f"  🔐 [{self.department}] 로그인 시도 중...")
        try:
            page.goto(self.login_url, wait_until="networkidle")
            page.fill("#inputUserId", settings.CAMPUS_ID)
            page.fill("#inputUserPwd", settings.CAMPUS_PW)
            # ._loginSubmit 추가 (인하공전 로그인 버튼의 실제 클래스)
            page.click("._loginSubmit, .btn_login, #btnLogin, .login_btn, button[type='submit']")
            
            page.wait_for_load_state("networkidle")
            time.sleep(2)
            return True
        except Exception as e:
            print(f"  ❌ 로그인 실패: {e}")
            return False

    def fetch_career_notices(self, limit: int = 5) -> List[Dict]:
        """
        로그인 후 해당 학과의 취업 공지사항 목록 및 상세 내용을 수집합니다.
        """
        results = []
        seen_ids = set()
        
        if not settings.CAMPUS_ID or not settings.CAMPUS_PW:
            return []

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 1280, 'height': 800},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            
            try:
                if not self._login(page):
                    return []

                print(f"  📢 [{self.department}] 수집 접속: {self.url}")
                page.goto(self.url, wait_until="networkidle")
                
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
                    
                    import re
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
                        page.goto(notice['url'], wait_until="networkidle")
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
                        
                        time.sleep(1)
                    except:
                        continue

            except Exception as e:
                print(f"  ❌ [{self.department}] 크롤링 에러: {e}")
            finally:
                browser.close()
                
        return results
