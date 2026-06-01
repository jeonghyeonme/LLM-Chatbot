from typing import List, Dict
from .base import BaseCrawler
from playwright.sync_api import sync_playwright
import time

class CampusCrawler(BaseCrawler):
    def __init__(self):
        super().__init__("https://www.inhatc.ac.kr/kr/103/subview.do")

    def fetch_building_markers(self) -> List[Dict]:
        """
        캠퍼스 지도 페이지에서 각 건물의 마커 좌표(위도, 경도)를 수집합니다.
        """
        marker_data = []
        
        with sync_playwright() as p:
            print(f"  🌐 캠퍼스 맵 접속 중: {self.url}")
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            
            try:
                page.goto(self.url, wait_until="networkidle")
                
                # 건물 리스트 링크들 추출
                links = page.query_selector_all('a[href*="jf_mapChange"]')
                print(f"    📍 발견된 건물/장소: {len(links)}개")
                
                for link in links:
                    name = link.inner_text().strip()
                    href = link.get_attribute('href')
                    script = href.replace('javascript:', '')
                    
                    # 탭 클릭/스크립트 실행
                    page.evaluate(script)
                    time.sleep(0.5) # 좌표 업데이트 대기
                    
                    # 마커 좌표 추출
                    coords = page.evaluate('''() => {
                        return {
                            lat: document.getElementById("firstLatitude")?.value,
                            lng: document.getElementById("firstLongitude")?.value
                        }
                    }''')
                    
                    if coords['lat'] and coords['lng']:
                        marker_data.append({
                            "name": name,
                            "latitude": float(coords['lat']),
                            "longitude": float(coords['lng'])
                        })
                        print(f"      ✨ {name} 좌표 수집 완료")
                
            except Exception as e:
                print(f"  ❌ 캠퍼스 맵 크롤링 중 에러: {e}")
            finally:
                browser.close()
                
        return marker_data
