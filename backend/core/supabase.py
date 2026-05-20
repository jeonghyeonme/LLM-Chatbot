from supabase import create_client, Client
from backend.core.config import settings

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_ANON_KEY

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set.")

supabase: Client = create_client(url, key)
