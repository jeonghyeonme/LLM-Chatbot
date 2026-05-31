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

tools = [get_campus_meals, get_campus_schedules, get_campus_location]
