import httpx
from fastapi import APIRouter, Query
from core.config import settings

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
