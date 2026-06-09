import httpx
from fastapi import APIRouter, Query
from core.supabase import SupabaseService
from core.config import settings
from typing import Optional, List

router = APIRouter(prefix="/api/data", tags=["data"])

@router.get("/directions")
async def get_directions(
    start: str = Query(..., description="출발지 좌표 (경도,위도)"),
    goal: str = Query(..., description="목적지 좌표 (경도,위도)"),
    option: str = Query("traoptimal", description="탐색 옵션")
):
    """
    네이버 Directions 5 API를 사용하여 경로 데이터를 가져옵니다.
    """
    url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving"
    headers = {
        "X-NCP-APIGW-API-KEY-ID": settings.NAVER_MAP_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": settings.NAVER_MAP_CLIENT_SECRET
    }
    params = {
        "start": start,
        "goal": goal,
        "option": option
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        return response.json()

@router.get("/schedules")
async def get_schedules(
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    limit: int = Query(100)
):
    """
    학사일정을 조회합니다.
    """
    schedules = SupabaseService.fetch_schedules(start_date=start, end_date=end)
    return schedules[:limit]

@router.get("/meals")
async def get_meals(
    date: Optional[str] = Query(None),
    meal_type: Optional[str] = Query(None),
    limit: int = Query(50)
):
    """
    식단표를 조회합니다.
    """
    meals = SupabaseService.fetch_meals(date=date, meal_type=meal_type)
    return meals[:limit]

@router.get("/facilities")
async def get_facilities(
    name: Optional[str] = Query(None),
    limit: int = Query(100)
):
    """
    캠퍼스 시설 정보를 조회합니다.
    """
    facilities = SupabaseService.fetch_facilities(name=name)
    return facilities[:limit]

@router.get("/careers")
async def get_careers(
    category: Optional[str] = Query(None, description="학과 이름"),
    limit: int = Query(20)
):
    """
    취업 정보를 조회합니다.
    """
    careers = SupabaseService.fetch_careers(limit=limit)
    if category and category != "전체":
        careers = [c for c in careers if c.get("category") == category]
    return careers

@router.get("/careers/categories")
async def get_career_categories():
    """
    취업 정보가 존재하는 학과(카테고리) 목록을 조회합니다.
    """
    if not SupabaseService.supabase:
        return ["전체"]
    
    try:
        # DISTINCT category 쿼리 수행
        response = SupabaseService.supabase.table("careers").select("category").execute()
        categories = sorted(list(set([item["category"] for item in response.data])))
        return ["전체"] + categories
    except Exception as e:
        print(f"Error fetching career categories: {e}")
        return ["전체"]
