from langchain_core.tools import tool
from core.supabase import SupabaseService
from typing import Optional
from datetime import datetime

@tool
def get_campus_meals(date: Optional[str] = None, meal_type: Optional[str] = None):
    """
    인하공업전문대학의 식단 정보를 조회합니다.
    date: 조회할 날짜 (YYYY-MM-DD 형식). 지정하지 않으면 전체 식단을 조회합니다.
    meal_type: 식사 종류 (조식, 중식, 석식 중 하나).
    """
    meals = SupabaseService.fetch_meals(date=date, meal_type=meal_type)
    if not meals:
        return "조회된 식단 정보가 없습니다."
    
    result = []
    for m in meals:
        result.append(f"날짜: {m['date']}, 종류: {m['meal_type']}({m['menu_category']}), 메뉴: {m['menu_content']}")
    
    return "\n".join(result)

@tool
def get_campus_schedules(start_date: Optional[str] = None, end_date: Optional[str] = None):
    """
    인하공업전문대학의 학사일정을 조회합니다.
    start_date: 조회를 시작할 날짜 (YYYY-MM-DD 형식). 지정하지 않으면 오늘 이후의 일정을 조회합니다.
    end_date: 조회를 종료할 날짜 (YYYY-MM-DD 형식).
    """
    if not start_date:
        start_date = datetime.now().strftime("%Y-%m-%d")
        
    schedules = SupabaseService.fetch_schedules(start_date=start_date, end_date=end_date)
    if not schedules:
        return "조회된 학사일정 정보가 없습니다."
    
    result = []
    for s in schedules:
        result.append(f"일정: {s['title']}, 기간: {s['start_date']} ~ {s['end_date']}")
    
    return "\n".join(result)

@tool
def get_campus_location(building_name: str):
    """
    인하공업전문대학 내 건물의 위치(위도, 경도) 및 지도 링크를 조회합니다.
    building_name: 찾고자 하는 건물이나 장소의 이름 (예: '본관', '4호관', '학생식당' 등)
    """
    facilities = SupabaseService.fetch_facilities(name=building_name)
    if not facilities:
        return f"'{building_name}'에 대한 위치 정보를 찾을 수 없습니다."
    
    # 가장 유사한 첫 번째 결과 사용
    f = facilities[0]
    name = f['name']
    lat = f['latitude']
    lng = f['longitude']
    
    # 네이버맵 지도 링크 생성
    # 형식: https://map.naver.com/v5/search/장소명
    # 좌표를 포함한 더 정확한 링크: https://map.naver.com/v5/search/{name}?c={lng},{lat},15,0,0,0,dh
    map_link = f"https://map.naver.com/v5/search/{name}?c={lng},{lat},15,0,0,0,dh"
    
    return f"장소: {name}\n지도 링크: {map_link}\n좌표: {lat}, {lng}"

import google.generativeai as genai
import requests
from io import BytesIO
from PIL import Image

@tool
def analyze_notice_image(image_url: str):
    """
    공지사항 본문에 포함된 이미지 중 텍스트 정보가 핵심인 이미지(모집 포스터, 안내문, 시간표, 인포그래픽 등)를 분석합니다.
    
    [사용 지침]
    1. 본문의 이미지 마크다운 ![alt](url) 에서 alt 텍스트가 '안내문', '포스터', '공고' 등 정보를 암시할 때 사용하세요.
    2. 단순한 행사 현장 사진, 인물 사진, 풍경 사진 등 텍스트 정보가 없는 이미지에는 이 도구를 사용하지 마세요.
    3. 질문에 답하기 위해 이미지 속 구체적인 수치나 조건(날짜, 인원, 자격 등)이 꼭 필요할 때만 호출하세요.
    
    image_url: 분석할 이미지의 전체 URL
    """
    if not image_url.startswith("http"):
        # 상대 경로인 경우 기본 도메인 추가 (인하공전 기준)
        if image_url.startswith("/"):
            image_url = f"https://www.inhatc.ac.kr{image_url}"
        else:
            return "유효하지 않은 이미지 URL입니다."

    try:
        # 1. 이미지 다운로드
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            "Referer": "https://www.inhatc.ac.kr/"
        }
        response = requests.get(image_url, headers=headers, timeout=10)
        img = Image.open(BytesIO(response.content))

        # 2. Gemini 1.5 Flash를 이용한 멀티모달 분석
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = "이 이미지에 포함된 모든 텍스트 정보를 추출하고, 어떤 안내문인지 상세히 설명해줘. 만약 표나 일정이 있다면 구조화해서 알려줘."
        
        vision_res = model.generate_content([prompt, img])
        return vision_res.text
    except Exception as e:
        return f"이미지 분석 중 오류가 발생했습니다: {e}"

@tool
def search_campus_notices(keyword: str):
    """
    인하공업전문대학의 일반 공지사항(학사, 장학, 행사 등)을 검색합니다.
    keyword: 검색할 키워드 (예: '장학금', '수강신청', '축제' 등)
    """
    notices = SupabaseService.search_notices(keyword=keyword)
    if not notices:
        return f"'{keyword}'와(과) 관련된 공지사항을 찾지 못했덕."
    
    result = []
    for n in notices:
        # 본문은 너무 길 수 있으므로 앞부분만 요약해서 제공하거나 제목 위주로 정보 전달
        summary = (n['content'][:200] + "...") if n.get('content') else "본문 내용 없음"
        result.append(f"📌 [{n['category']}] {n['title']} ({n['date']})\n- 요약: {summary}\n- 원본 링크: {n['url']}")
    
    return "\n\n".join(result)

@tool
def search_career_info(keyword: str):
    """
    인하공업전문대학의 학과별 취업 정보 및 채용 공고를 검색합니다.
    keyword: 검색할 키워드 (예: '삼성전자', '현대자동차', '추천채용', '실습' 등)
    """
    careers = SupabaseService.search_careers(keyword=keyword)
    if not careers:
        return f"'{keyword}'와(과) 관련된 취업 정보를 찾지 못했덕."
    
    result = []
    for c in careers:
        summary = (c['content'][:200] + "...") if c.get('content') else "본문 내용 없음"
        result.append(f"💼 [{c['category']}] {c['title']} ({c['date']})\n- 요약: {summary}\n- 원본 링크: {c['url']}")
    
    return "\n\n".join(result)

tools = [get_campus_meals, get_campus_schedules, get_campus_location, analyze_notice_image, search_campus_notices, search_career_info]
