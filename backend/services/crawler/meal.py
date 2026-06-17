import requests
import datetime
from typing import List, Dict
from .base import BaseCrawler
from bs4 import BeautifulSoup

class MealCrawler(BaseCrawler):
    def __init__(self):
        super().__init__("https://www.inhatc.ac.kr/haksa/kr/getHaksaFoodMenuList.do")
        self.headers = {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://www.inhatc.ac.kr',
            'Referer': 'https://www.inhatc.ac.kr/kr/485/subview.do',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }

    def fetch_all_meals(self) -> List[Dict]:
        """
        세션을 유지하며 API를 직접 호출하여 이번 달 전체의 식단 데이터를 고속 수집합니다.
        """
        import json
        now = datetime.datetime.now()
        year = now.year
        month = now.month
        
        import calendar
        _, last_day = calendar.monthrange(year, month)
        
        str_date = f"{year}{str(month).zfill(2)}01"
        end_date = f"{year}{str(month).zfill(2)}{str(last_day).zfill(2)}"
        
        payload = f"gubun=%ED%95%99%EC%83%9D&strDate={str_date}&endDate={end_date}"

        print(f"  🚀 식단 API 호출 시도... ({str_date} ~ {end_date})")
        
        session = requests.Session()
        try:
            # 1. 메인 페이지 접속 (쿠키 획득)
            main_url = "https://www.inhatc.ac.kr/kr/485/subview.do"
            session.get(main_url, headers=self.headers, timeout=10)
            
            # 2. API 호출
            response = session.post(self.url, data=payload, headers=self.headers, timeout=10)
            
            if response.status_code != 200:
                print(f"  ❌ API 호출 실패 (상태 코드: {response.status_code})")
                return []

            # 3. JSON 데이터 파싱
            try:
                data_list = json.loads(response.text)
                return self._parse_json_data(data_list)
            except json.JSONDecodeError:
                print("  ❌ JSON 파싱 실패. 응답 형식이 예상과 다릅니다.")
                return []
            
        except Exception as e:
            print(f"  ❌ 식단 수집 중 에러 발생: {e}")
            return []

    def _parse_json_data(self, data_list: List[Dict]) -> List[Dict]:
        """
        서버에서 반환된 JSON 리스트에서 식단 데이터를 추출하여 DB 형식으로 변환합니다.
        """
        meals = []
        
        for item in data_list:
            # 날짜 형식 변환: 20260601 -> 2026-06-01
            raw_date = item.get("date", "")
            if len(raw_date) == 8:
                date_val = f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:]}"
            else:
                continue

            # 필드 매핑 정의 (JSON 필드명, 식사종류, 카테고리)
            mappings = [
                ("breakfast", "조식", "일반"),
                ("lunchNormal", "중식", "일반"),
                ("lunchSpecial", "중식", "특식"),
                ("lunchFast", "중식", "간편식"),
                ("dinner", "석식", "일반")
            ]

            for field, meal_type, category in mappings:
                content = item.get(field)
                if content and isinstance(content, str):
                    cleaned_content = content.strip()
                    # 무의미한 텍스트 제외
                    if cleaned_content and "등록된 식단이 없습니다" not in cleaned_content:
                        meals.append({
                            "date": date_val,
                            "meal_type": meal_type,
                            "menu_category": category,
                            "menu_content": cleaned_content,
                            "restaurant_type": "학생식당"
                        })
                        print(f"    ✨ 추출 완료: {date_val} | {meal_type}({category})")

        return meals
