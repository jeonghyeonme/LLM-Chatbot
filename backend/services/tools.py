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
    keyword: 검색할 키워드 (예: '컴퓨터정보과', '삼성전자', '현대자동차', '추천채용', '실습' 등)
    """
    careers = SupabaseService.search_careers(keyword=keyword)
    if not careers:
        return f"'{keyword}'와(과) 관련된 취업 정보를 찾지 못했덕. 검색어를 '컴퓨터' 등으로 짧게 해서 다시 물어봐달덕!"
    
    result = [f"'{keyword}'에 대해 총 {len(careers)}건의 취업 정보를 찾았덕:"]
    for i, c in enumerate(careers[:5], 1): # 상위 5개만 집중 제공
        result.append(f"{i}. [{c['category']}] {c['title']}")
        result.append(f"   - 게시일: {c['date']}")
        result.append(f"   - 바로가기: {c['url']}")
    
    return "\n".join(result)

tools = [get_campus_meals, get_campus_schedules, get_campus_location, search_campus_notices, search_career_info]
