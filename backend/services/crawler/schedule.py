from typing import List, Dict
from .base import BaseCrawler
from bs4 import BeautifulSoup
import re
from datetime import datetime

class ScheduleCrawler(BaseCrawler):
    def __init__(self):
        super().__init__("https://www.inhatc.ac.kr/kr/123/subview.do")

    def fetch_schedules(self) -> List[Dict]:
        """
        Playwright로 로딩된 페이지에서 학사일정을 추출합니다.
        """
        print(f"  - 학사일정 브라우저 로딩 중... ({self.url})")
        html = self.get_page_content(wait_selector=".yearSchdulWrap")
        if not html:
            return []

        soup = BeautifulSoup(html, "html.parser")
        schedules = []
        wraps = soup.select(".yearSchdulWrap")
        
        current_year = datetime.now().year

        for idx, wrap in enumerate(wraps):
            wrap_text = wrap.get_text()
            year_match = re.search(r"(\d{4})", wrap_text)
            if year_match:
                year_val = int(year_match.group(1))
                if 2020 <= year_val <= 2030:
                    current_year = year_val

            ul = wrap.find("ul")
            if not ul: continue

            rows = ul.find_all("li")
            valid_rows_count = 0

            for row in rows:
                text = row.get_text(separator='|', strip=True)
                parts = [p.strip() for p in text.split('|') if p.strip()]
                if len(parts) < 2: continue
                
                title = parts[-1]
                date_range_str = " ".join(parts[:-1])

                if not re.search(r'\d+', date_range_str): continue

                start_date, end_date = self._parse_date_range(current_year, date_range_str)
                if start_date:
                    print(f"      ✨ 일정 발견: {start_date} ~ {end_date} | {title}")
                    schedules.append({
                        "start_date": start_date,
                        "end_date": end_date,
                        "title": title
                    })
                    valid_rows_count += 1
            
            if valid_rows_count > 0:
                print(f"    [{idx+1}] 월별 데이터 수집 완료 ({current_year}년)")

        return schedules

    def _parse_date_range(self, year: int, date_range_str: str) -> (str, str):
        parts = date_range_str.split("~")
        start_part = parts[0].strip()
        end_part = parts[1].strip() if len(parts) > 1 else start_part

        def extract_date(part):
            match = re.search(r"(\d{1,2})\s*\.\s*(\d{1,2})", part)
            if match:
                m, d = match.groups()
                return f"{year}-{int(m):02d}-{int(d):02d}"
            return None

        return extract_date(start_part), extract_date(end_part)
