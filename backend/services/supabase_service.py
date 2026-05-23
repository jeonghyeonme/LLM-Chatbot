from supabase import create_client, Client
from core.config import settings
from typing import List, Dict

class SupabaseService:
    def __init__(self):
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    def upsert_meals(self, meals: List[Dict]):
        """
        식단 데이터를 업서트합니다.
        """
        if not meals:
            return

        try:
            response = self.supabase.table("meals").upsert(
                meals, 
                on_conflict="date,meal_type,menu_category,restaurant_type"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting meals: {e}")
            return None

    def upsert_schedules(self, schedules: List[Dict]):
        """
        학사일정 데이터를 업서트합니다. (시작일, 종료일, 제목이 같으면 업데이트)
        """
        if not schedules:
            return

        try:
            response = self.supabase.table("schedules").upsert(
                schedules,
                on_conflict="start_date,end_date,title"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting schedules: {e}")
            return None
