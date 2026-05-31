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
    def upsert_schedules(schedules: List[Dict]):
        """
        학사일정 데이터를 업서트합니다.
        """
        if not supabase:
            return None

        if not schedules:
            return None

        try:
            response = supabase.table("schedules").upsert(
                schedules,
                on_conflict="start_date,end_date,title"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting schedules: {e}")
            return None

    @staticmethod
    def upsert_notices(notices: List[Dict]):
        """
        공지사항 및 취업 정보 데이터를 업서트합니다.
        """
        if not supabase or not notices:
            return None

        try:
            response = supabase.table("notices").upsert(
                notices,
                on_conflict="category,external_id"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting notices: {e}")
            return None

    @staticmethod
    def fetch_notices(category: Optional[str] = None, limit: int = 20):
        """
        공지사항 데이터를 조회합니다.
        """
        if not supabase:
            return []
        
        try:
            query = supabase.table("notices").select("*")
            if category:
                query = query.eq("category", category)
            
            response = query.order("date", desc=True).limit(limit).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching notices: {e}")
            return []

    @staticmethod
    def fetch_notice_by_id(id: str):
        """
        특정 ID의 공지사항 상세 내용을 조회합니다.
        """
        if not supabase:
            return None
        
        try:
            response = supabase.table("notices").select("*").eq("id", id).single().execute()
            return response.data
        except Exception as e:
            print(f"Error fetching notice by id: {e}")
            return None

    @staticmethod
    def delete_meals_by_date_range(start_date: str, end_date: str):
        """
        특정 기간의 식단 데이터를 삭제합니다.
        """
        if not supabase:
            return None
        try:
            response = supabase.table("meals").delete().gte("date", start_date).lte("date", end_date).execute()
            return response
        except Exception as e:
            print(f"Error deleting meals: {e}")
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

    @staticmethod
    def upsert_facilities(facilities: List[Dict]):
        """
        시설 및 장소 데이터를 업서트합니다.
        """
        if not supabase or not facilities:
            return None

        try:
            response = supabase.table("facilities").upsert(
                facilities,
                on_conflict="name"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting facilities: {e}")
            return None

    @staticmethod
    def fetch_facilities(category: Optional[str] = None, name: Optional[str] = None):
        """
        시설 정보를 조회합니다.
        """
        if not supabase:
            return []
        
        try:
            query = supabase.table("facilities").select("*")
            if category:
                query = query.eq("category", category)
            if name:
                query = query.ilike("name", f"%{name}%")
            
            response = query.order("name").execute()
            return response.data
        except Exception as e:
            print(f"Error fetching facilities: {e}")
            return []
