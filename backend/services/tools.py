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

tools = [get_campus_meals, get_campus_schedules]
