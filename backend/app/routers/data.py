from fastapi import APIRouter, Query
from core.supabase import SupabaseService
from typing import Optional, List

router = APIRouter(prefix="/api/data", tags=["data"])

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
