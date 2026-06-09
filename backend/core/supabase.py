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
        if not supabase or not meals:
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
        if not supabase or not schedules:
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
        공지사항 데이터를 업서트합니다.
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
    def upsert_careers(careers: List[Dict]):
        """
        취업 및 추천채용 데이터를 업서트합니다.
        """
        if not supabase or not careers:
            return None

        try:
            response = supabase.table("careers").upsert(
                careers,
                on_conflict="category,external_id"
            ).execute()
            return response
        except Exception as e:
            print(f"Error upserting careers: {e}")
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
        식단 데이터를 조회합니다. (챗봇 툴에서 사용)
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
        학사일정 데이터를 조회합니다. (챗봇 툴에서 사용)
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
        시설 정보를 조회합니다. (챗봇 툴에서 사용)
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

    @staticmethod
    def search_notices(keyword: str, limit: int = 5):
        """
        공지사항을 키워드로 검색합니다. (제목 또는 본문)
        """
        if not supabase or not keyword:
            return []
        
        try:
            # 제목 또는 본문에 키워드가 포함된 데이터 검색
            response = supabase.table("notices").select("*").or_(f"title.ilike.%{keyword}%,content.ilike.%{keyword}%").order("date", desc=True).limit(limit).execute()
            return response.data
        except Exception as e:
            print(f"Error searching notices: {e}")
            return []

    @staticmethod
    def search_careers(keyword: str, limit: int = 5):
        """
        취업 정보를 키워드로 검색합니다. (제목 또는 본문)
        """
        if not supabase or not keyword:
            return []
        
        try:
            response = supabase.table("careers").select("*").or_(f"title.ilike.%{keyword}%,content.ilike.%{keyword}%").order("date", desc=True).limit(limit).execute()
            return response.data
        except Exception as e:
            print(f"Error searching careers: {e}")
            return []

    @staticmethod
    def save_chat_message(session_id: str, role: str, content: str):
        """
        대화 메시지를 저장합니다.
        """
        if not supabase or not session_id or not content:
            return None
            
        try:
            response = supabase.table("chat_history").insert({
                "session_id": session_id,
                "role": role,
                "content": content
            }).execute()
            return response
        except Exception as e:
            print(f"Error saving chat message: {e}")
            return None

    @staticmethod
    def get_chat_history(session_id: str, limit: int = 20):
        """
        특정 세션의 최근 대화 기록을 조회합니다.
        """
        if not supabase or not session_id:
            return []
            
        try:
            # 최근 대화를 가져오기 위해 내림차순 정렬 후 다시 오름차순으로 뒤집어야 하지만,
            # 여기서는 클라이언트가 전체 컨텍스트를 주는 구조일 경우 보조적인 용도로 사용됨.
            # 서버에서 컨텍스트를 주입하려면 오름차순으로 가져오는 것이 편함.
            response = supabase.table("chat_history").select("*").eq("session_id", session_id).order("created_at", desc=False).limit(limit).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching chat history: {e}")
            return []
