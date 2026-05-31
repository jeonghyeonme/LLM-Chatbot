from typing import List, Dict
from .base import BaseCrawler
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time
import requests

class NoticeCrawler(BaseCrawler):
    def __init__(self, menu_id: str, bbs_id: str, category_name: str):
        # 인하공전 게시판 공통 URL 구조
        base_url = f"https://www.inhatc.ac.kr/kr/{menu_id}/subview.do"
        super().__init__(base_url)
        self.menu_id = menu_id
        self.bbs_id = bbs_id
        self.category_name = category_name

    def fetch_notices(self, limit: int = 10) -> List[Dict]:
        """
        공지사항 목록과 상세 내용을 크롤링합니다.
        """
        results = []
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 1280, 'height': 800},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            
            try:
                print(f"  📢 [{self.category_name}] 목록 페이지 접속 중... ({self.url})")
                # load 이벤트를 기다린 후 추가 지연 시간을 가짐
                page.goto(self.url, wait_until="load", timeout=30000)
                time.sleep(3) # 자바스크립트 기반 컨텐츠 로딩 대기
                
                # 여러 셀렉터 중 하나라도 나타날 때까지 대기
                selectors = ["table", ".board-table", "._fnctWrap", ".board-list"]
                found_selector = None
                for sel in selectors:
                    try:
                        if page.locator(sel).is_visible():
                            found_selector = sel
                            break
                    except:
                        continue
                
                if not found_selector:
                    # 실패 시 현재 페이지 상태 기록
                    title = page.title()
                    print(f"    ⚠️ 목록을 찾을 수 없음 (현재 페이지 제목: {title})")
                    # 에러 페이지 여부 확인
                    if "Inform" in page.content() or "not find" in page.content():
                        print(f"    ❌ 접근 제한 혹은 잘못된 메뉴 ID입니다.")
                    return []

                soup = BeautifulSoup(page.content(), "html.parser")
                rows = soup.select("table tbody tr")
                
                if not rows:
                    print(f"    ⚠️ 게시글 행(tr)이 발견되지 않았습니다.")
                    return []
                
                # 공지사항 목록 순회
                count = 0
                for row in rows:
                    if count >= limit: break
                    
                    subject_a = row.select_one(".td-subject a")
                    if not subject_a: continue
                    
                    title = subject_a.get_text(strip=True)
                    date_td = row.select_one(".td-date")
                    # 2026.05.29. -> 2026-05-29
                    date = date_td.get_text(strip=True).rstrip(".").replace(".", "-") if date_td else ""
                    
                    access_td = row.select_one(".td-access")
                    views_text = access_td.get_text(strip=True) if access_td else "0"
                    views = int(views_text) if views_text.isdigit() else 0
                    
                    # nttId 추출 (상세 페이지 접근을 위함)
                    href = subject_a.get("href", "")
                    import re
                    
                    # 1. 새로운 하이퍼링크 형식 대응: /bbs/kr/33/108412/artclView.do
                    # 2. 기존 자바스크립트 형식 대응: jf_combBbs_view('kr','2','11','108533');
                    bbs_config_no = ""
                    bbs_data_no = ""
                    
                    # 패턴 A: 하이퍼링크형
                    link_match = re.search(r"/bbs/[^/]+/(\d+)/(\d+)/artclView\.do", href)
                    # 패턴 B: 자바스크립트형
                    js_match = re.search(r"jf_combBbs_view\s*\(\s*['\"]?[^'\"]+['\"]?\s*,\s*['\"]?[^'\"]+['\"]?\s*,\s*['\"]?(\d+)['\"]?\s*,\s*['\"]?(\d+)['\"]?\s*\)", href)
                    
                    if link_match:
                        bbs_config_no = link_match.group(1)
                        bbs_data_no = link_match.group(2)
                    elif js_match:
                        bbs_config_no = js_match.group(1)
                        bbs_data_no = js_match.group(2)
                    else:
                        print(f"    ⚠️ 매칭 실패 (알 수 없는 링크 형식): {href}")
                        continue
                    
                    print(f"    🔍 상세 내용 수집 중 ({bbs_data_no}): {title[:20]}...")
                    
                    # 상세 페이지 클릭 (href 속성 기반으로 정확히 클릭)
                    try:
                        # 특수문자가 포함된 href를 위해 escape 처리 혹은 부분 매칭 사용
                        page.click(f"a[href*='{bbs_data_no}']", timeout=5000)
                    except:
                        # 클릭 실패 시 URL 직접 이동 시도 (Fallback)
                        detail_url = f"https://www.inhatc.ac.kr/bbs/kr/{bbs_config_no}/{bbs_data_no}/artclView.do"
                        print(f"    🔗 클릭 실패로 URL 직접 이동 시도: {bbs_data_no}")
                        page.goto(detail_url, wait_until="load")
                    # 정보 영역이 로드될 때까지 대기
                    try:
                        page.wait_for_selector(".board-view-info", timeout=10000)
                    except:
                        print(f"    ⚠️ 상세 페이지 로드 지연: {title[:20]}")
                    
                    time.sleep(2) # 안정적인 로딩 대기
                    
                    detail_soup = BeautifulSoup(page.content(), "html.parser")
                    
                    # 본문 내용 추출
                    content_div = detail_soup.select_one(".board-view-content")
                    content_text = content_div.get_text(separator="\n", strip=True) if content_div else ""
                    
                    # 작성자(부서) 추출 - 없을 수 있으므로 기본값 설정
                    author = "관리자"
                    info_dls = detail_soup.select(".board-view-info dl")
                    for dl in info_dls:
                        dt = dl.select_one("dt")
                        if dt and "작성자" in dt.get_text():
                            author = dl.select_one("dd").get_text(strip=True)
                            break
                    
                    # 첨부파일 추출
                    attachments = []
                    file_links = detail_soup.select(".view-file dd.insert ul li a")
                    for flink in file_links:
                        f_name = flink.get_text(strip=True)
                        f_url = flink["href"]
                        if f_url.startswith("/"):
                            f_url = "https://www.inhatc.ac.kr" + f_url
                        
                        attachments.append({
                            "name": f_name,
                            "url": f_url
                        })
                    
                    results.append({
                        "external_id": bbs_data_no,
                        "category": self.category_name,
                        "title": title,
                        "content": content_text,
                        "author": author,
                        "date": date,
                        "views": views,
                        "attachments": attachments
                    })
                    
                    # 다시 목록으로 돌아가기 (뒤로가기)
                    page.go_back(wait_until="networkidle")
                    count += 1
                    
            except Exception as e:
                import traceback
                print(f"  ❌ 크롤링 중 에러: {e}")
                traceback.print_exc()
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
