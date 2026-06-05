from typing import List, Dict
from .base import BaseCrawler
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time
import requests

class NoticeCrawler(BaseCrawler):
    def __init__(self, menu_id: str, category_name: str):
        # 인하공전 게시판 공통 URL 구조
        base_url = f"https://www.inhatc.ac.kr/kr/{menu_id}/subview.do"
        super().__init__(base_url)
        self.menu_id = menu_id
        self.category_name = category_name

    def fetch_notices(self, limit: int = 20) -> List[Dict]:
        """
        공지사항 목록에서 직접 정보를 수집합니다. (상세 페이지 방문 안함)
        """
        results = []
        seen_ids = set() # 중복(공지글) 제거용
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 1280, 'height': 800},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            
            try:
                print(f"  📢 [{self.category_name}] 수집 시작... ({self.url})")
                page.goto(self.url, wait_until="networkidle", timeout=30000)
                
                # 테이블 로딩 대기
                try:
                    page.wait_for_selector("table tbody tr", timeout=10000)
                except:
                    print(f"    ⚠️ {self.category_name}: 게시글 목록 로드 지연 또는 데이터 없음")
                
                soup = BeautifulSoup(page.content(), "html.parser")
                rows = soup.select("table tbody tr")
                
                for row in rows:
                    if len(results) >= limit: break
                    
                    # 제목 및 링크가 있는 모든 <a> 태그 탐색 (더 유연하게)
                    subject_a = row.select_one("a[href*='artclView.do']") or row.select_one("a[href*='jf_combBbs_view']")
                    if not subject_a: continue
                    
                    title = subject_a.get_text(strip=True)
                    href = subject_a.get("href", "")
                    
                    # URL 및 ID 추출 (더 견고한 정규식)
                    import re
                    # config_no와 data_no를 뽑아냄
                    link_match = re.search(r"bbs/([^/]+)/(\d+)/(\d+)/artclView\.do", href)
                    js_match = re.search(r"jf_combBbs_view\s*\(\s*['\"]?([^'\"]+)['\"]?\s*,\s*['\"]?([^'\"]+)['\"]?\s*,\s*['\"]?(\d+)['\"]?\s*,\s*['\"]?(\d+)['\"]?\s*\)", href)
                    
                    lang = "kr"
                    bbs_config_no = ""
                    bbs_data_no = ""
                    
                    if link_match:
                        lang, bbs_config_no, bbs_data_no = link_match.group(1), link_match.group(2), link_match.group(3)
                    elif js_match:
                        # js_match groups: 0: lang, 1: ?, 2: config, 3: data
                        lang, bbs_config_no, bbs_data_no = js_match.group(1), js_match.group(3), js_match.group(4)
                    else:
                        continue
                        
                    # 중복 제거
                    if bbs_data_no in seen_ids:
                        continue
                    seen_ids.add(bbs_data_no)
                    
                    # 날짜 및 조회수 추출
                    date_td = row.select_one(".td-date") or row.find_all("td")[2] if len(row.find_all("td")) > 2 else None
                    date = date_td.get_text(strip=True).rstrip(".").replace(".", "-") if date_td else "2026-06-06"
                    
                    access_td = row.select_one(".td-access") or row.find_all("td")[3] if len(row.find_all("td")) > 3 else None
                    views_text = access_td.get_text(strip=True) if access_td else "0"
                    views = int(views_text) if views_text.isdigit() else 0
                    
                    # 데이터 구성
                    detail_url = f"https://www.inhatc.ac.kr/bbs/{lang}/{bbs_config_no}/{bbs_data_no}/artclView.do"
                    results.append({
                        "external_id": bbs_data_no,
                        "category": self.category_name,
                        "title": title,
                        "url": detail_url,
                        "date": date,
                        "views": views
                    })
                    print(f"    ✅ 수집 완료: {title[:25]}...")
                    
            except Exception as e:
                print(f"  ❌ 크롤링 중 에러: {e}")
            finally:
                browser.close()
                
        return results

    @staticmethod
    def test_download(url: str) -> bool:
        """
        첨부파일 URL이 유효한지(다운로드 가능한지) 테스트합니다.
        """
        try:
            # 학교 서버의 경우 Referer나 User-Agent가 중요할 수 있음
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "Referer": "https://www.inhatc.ac.kr/"
            }
            # 실제 파일을 다 받지 않고 헤더만 확인 (stream=True)
            response = requests.get(url, headers=headers, stream=True, timeout=10)
            
            # 200 OK이거나 Content-Disposition이 있으면 다운로드 가능으로 판단
            is_valid = response.status_code == 200
            content_type = response.headers.get("Content-Type", "")
            
            print(f"    📥 다운로드 테스트: {url[:50]}... | 상태: {response.status_code} | 타입: {content_type}")
            return is_valid
        except Exception as e:
            print(f"    ❌ 다운로드 테스트 실패: {e}")
            return False
