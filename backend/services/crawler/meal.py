from typing import List, Dict
from .base import BaseCrawler
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import datetime
import time

class MealCrawler(BaseCrawler):
    def __init__(self):
        # 다시 원래의 사용자 친화적 URL로 변경 (브라우저가 알아서 렌더링하므로)
        super().__init__("https://www.inhatc.ac.kr/kr/485/subview.do")

    def fetch_all_meals(self) -> List[Dict]:
        """
        Playwright 브라우저를 띄워 학생식당과 교직원식당 데이터를 긁어옵니다.
        """
        all_meals = []
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 1280, 'height': 800},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            
            try:
                print(f"  🌐 식단 페이지 접속 중...")
                page.goto(self.url, wait_until="networkidle")
                
                # 1. 학생식당 긁기
                print("  🍱 [학생식당] 데이터 수집 중...")
                # 학생식당 버튼 클릭 (이미 선택되어 있을 수 있지만 명시적으로 클릭)
                page.click("a:has-text('학생식당')")
                time.sleep(2) # 렌더링 대기
                all_meals.extend(self._parse_current_page(page.content(), "학생식당"))
                
                # 2. 교직원식당 긁기
                print("  🍱 [교직원식당] 데이터 수집 중...")
                page.click("a:has-text('교직원식당')")
                time.sleep(2) # 렌더링 대기
                all_meals.extend(self._parse_current_page(page.content(), "교직원식당"))
                
            except Exception as e:
                print(f"  ❌ 식단 크롤링 중 에러: {e}")
            finally:
                browser.close()
                
        return all_meals

    def _parse_current_page(self, html: str, restaurant_name: str) -> List[Dict]:
        """
        현재 브라우저에 렌더링된 HTML에서 식단 데이터를 파싱합니다.
        """
        soup = BeautifulSoup(html, "html.parser")
        meals = []
        
        # 사용자가 알려준 본문 ID 사용
        tbody = soup.select_one("#menuTableBody")
        if not tbody:
            return []
            
        rows = tbody.find_all("tr")
        
        # 헤더 정보 (일자, 요일, 조식, 중식...)
        # 사용자 제공 경로: div.table_1.table_m > table > thead > tr
        thead = soup.select_one("div.table_1.table_m > table > thead > tr")
        if not thead:
            # fallback
            thead = soup.find("thead")
            
        headers = [th.get_text(strip=True) for th in thead.find_all(["th", "td"])] if thead else []

        for row in rows:
            cols = row.find_all("td")
            if len(cols) < 3: continue
            
            date_raw = cols[0].get_text(strip=True)
            import re
            nums = re.findall(r'\d+', date_raw)
            if len(nums) >= 3:
                date_val = f"{nums[0]}-{nums[1].zfill(2)}-{nums[2].zfill(2)}"
            else:
                continue

            for i in range(2, len(cols)):
                if i >= len(headers): break
                header = headers[i]
                
                meal_type = header
                menu_category = "일반"
                
                if "(" in header:
                    parts = header.split("(")
                    meal_type = parts[0]
                    menu_category = parts[1].replace(")", "")
                
                # 교직원 식당 보정
                if restaurant_name == "교직원식당" and "중식" in header:
                    meal_type = "중식"
                    menu_category = "일반"

                menu_content = cols[i].get_text(separator="\n", strip=True)
                
                if menu_content and len(menu_content) > 1 and menu_content not in ["-", "등록된 식단이 없습니다."]:
                    print(f"    ✨ 발견: {date_val} | {meal_type}({menu_category}) | {restaurant_name}")
                    meals.append({
                        "date": date_val,
                        "meal_type": meal_type,
                        "menu_category": menu_category,
                        "menu_content": menu_content,
                        "restaurant_type": restaurant_name
                    })
        return meals
