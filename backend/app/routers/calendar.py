from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from backend.core.supabase import supabase
from backend.core.logger import logger

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

# title 에 이 키워드들이 포함되면 응답에서 제외
EXCLUDE_KEYWORDS = ("수업일수", "학기개시")

# title 에 이 키워드가 포함되면 'exam' (시험) 배지, 아니면 'info' (학사) 배지
EXAM_KEYWORD = "평가"


def _is_excluded(title: str) -> bool:
    return any(kw in title for kw in EXCLUDE_KEYWORDS)


def _classify(title: str) -> str:
    return "exam" if EXAM_KEYWORD in title else "info"


@router.get("/schedules")
async def get_schedules(
    start: Optional[str] = Query(None, description="조회 시작일 (YYYY-MM-DD)"),
    end: Optional[str] = Query(None, description="조회 종료일 (YYYY-MM-DD)"),
    limit: int = Query(100, ge=1, le=500),
):
    try:
        query = (
            supabase.table("schedules")
            .select("id,title,start_date,end_date")
            .order("start_date", desc=False)
            .limit(limit)
        )
        if start:
            query = query.gte("start_date", start)
        if end:
            query = query.lte("start_date", end)
        result = query.execute()
    except Exception as e:
        logger.exception("Failed to fetch schedules from Supabase")
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {e}")

    rows = result.data or []
    items = [
        {
            "id": r["id"],
            "title": r["title"],
            "start_date": r["start_date"],
            "end_date": r["end_date"],
            "type": _classify(r["title"]),
        }
        for r in rows
        if not _is_excluded(r.get("title", ""))
    ]
    return {"items": items, "count": len(items)}
