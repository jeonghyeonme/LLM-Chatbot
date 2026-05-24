from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from core.supabase import supabase
from core.logger import logger

router = APIRouter(prefix="/api/mealPlan", tags=["mealPlan"])

# ──────────────────────────────────────────────────────────────────────────────
# 학생용 앱이므로 학생식당만 노출 (교직원식당 제외)
# ──────────────────────────────────────────────────────────────────────────────
TARGET_RESTAURANT = "학생식당"

# ──────────────────────────────────────────────────────────────────────────────
# 가격 매핑 (DB에 price 컬럼이 없어 여기서 산출). 변경하려면 이 dict 만 수정.
# DB 저장 구조:
#   - 조식 → meal_type='조식', menu_category='일반' (조식엔 종류 1개)
#   - 중식 일반식 → meal_type='중식', menu_category='일반'
#   - 중식 특식   → meal_type='중식', menu_category='특식'
#   - 간편식     → meal_type='중식', menu_category='간편식'
# ──────────────────────────────────────────────────────────────────────────────
PRICE_MAP: dict[tuple[str, str], str] = {
    ("조식", "일반"): "1,000원",
    ("중식", "일반"): "5,500원",
    ("중식", "특식"): "6,500원",
    ("중식", "간편식"): "1,000~5,000원",
}

DEFAULT_PRICE = "가격 미정"


def _resolve_price(meal_type: str, menu_category: Optional[str]) -> str:
    return PRICE_MAP.get((meal_type, menu_category or ""), DEFAULT_PRICE)


def _split_menu(menu_content: Optional[str]) -> list[str]:
    if not menu_content:
        return []
    # DB 는 줄바꿈(\n)으로 메뉴 구분
    return [line.strip() for line in menu_content.split("\n") if line.strip()]


@router.get("/meals")
async def get_meals(
    date: Optional[str] = Query(None, description="조회 일자 (YYYY-MM-DD)"),
    meal_type: Optional[str] = Query(None, description="조식 | 중식 | 간편식"),
    limit: int = Query(50, ge=1, le=200),
):
    try:
        query = (
            supabase.table("meals")
            .select("id,date,meal_type,menu_category,menu_content,restaurant_type")
            .eq("restaurant_type", TARGET_RESTAURANT)  # 학생식당만
            .order("date", desc=False)
            .limit(limit)
        )
        if date:
            query = query.eq("date", date)
        if meal_type:
            query = query.eq("meal_type", meal_type)
        result = query.execute()
    except Exception as e:
        logger.exception("Failed to fetch meals from Supabase")
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {e}")

    rows = result.data or []
    items = [
        {
            "id": r["id"],
            "date": r["date"],
            "meal_type": r["meal_type"],
            "menu_category": r.get("menu_category"),
            "restaurant_type": r.get("restaurant_type"),
            "menu_items": _split_menu(r.get("menu_content")),
            "price": _resolve_price(r["meal_type"], r.get("menu_category")),
        }
        for r in rows
    ]
    return {"items": items, "count": len(items)}
