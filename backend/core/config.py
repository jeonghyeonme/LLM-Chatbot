from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/ 폴더 절대경로 (config.py 위치: backend/core/config.py → 부모의 부모)
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inha-Bot API"
    OPENAI_API_KEY: str = ""

    # Supabase Settings
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""

    # Crawler Settings
    REQUEST_TIMEOUT: int = 10
    MAX_RETRIES: int = 3

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

settings = Settings()
