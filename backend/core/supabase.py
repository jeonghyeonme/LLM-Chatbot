from supabase import create_client, Client
from core.config import settings
from typing import List, Dict, Optional

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_ANON_KEY

# 단일 클라이언트 인스턴스 (조건부 초기화)
supabase: Optional[Client] = None

if url and key:
    try:
        supabase = create_client(url, key)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
else:
    print("Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set. Database features will be disabled.")

class SupabaseService:
    @staticmethod
    def upsert_meals(meals: List[Dict]):
        """
        식단 데이터를 업서트합니다.
        """
        if not supabase:
            return None

        if not meals:
            return None

        try:
            response = supabase.table("meals").upsert(
                meals, 
                on_conflict="date,meal_type,menu_category,restaurant_type"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting meals: {e}")
            return None

    @staticmethod
    def fetch_meals(date: Optional[str] = None, meal_type: Optional[str] = None):
        """
        식단 데이터를 조회합니다.
        """
        if not supabase:
            return []
        
        try:
            query = supabase.table("meals").select("*")
            if date:
                query = query.eq("date", date)
            if meal_type:
                query = query.eq("meal_type", meal_type)
            
            response = query.order("date").execute()
            return response.data
        except Exception as e:
            print(f"Error fetching meals: {e}")
            return []

    @staticmethod
    def fetch_schedules(start_date: Optional[str] = None, end_date: Optional[str] = None):
        """
        학사일정 데이터를 조회합니다.
        """
        if not supabase:
            return []
        
        try:
            query = supabase.table("schedules").select("*")
            if start_date:
                query = query.gte("start_date", start_date)
            if end_date:
                query = query.lte("start_date", end_date)
            
            response = query.order("start_date").execute()
            return response.data
        except Exception as e:
            print(f"Error fetching schedules: {e}")
            return []
