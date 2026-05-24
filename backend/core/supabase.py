from supabase import create_client, Client
from core.config import settings
from typing import List, Dict

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_ANON_KEY

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set.")

# 단일 클라이언트 인스턴스
supabase: Client = create_client(url, key)

class SupabaseService:
    @staticmethod
    def upsert_meals(meals: List[Dict]):
        """
        식단 데이터를 업서트합니다.
        """
        if not meals:
            return

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
        학사일정 데이터를 업서트합니다. (시작일, 종료일, 제목이 같으면 업데이트)
        """
        if not schedules:
            return

        try:
            response = supabase.table("schedules").upsert(
                schedules,
                on_conflict="start_date,end_date,title"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting schedules: {e}")
            return None
