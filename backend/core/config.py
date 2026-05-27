from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from dotenv import load_dotenv

# 현재 파일(config.py) 위치를 기준으로 backend 디렉토리 경로 계산
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

# .env 파일이 존재하는 경우 명시적으로 로드
if ENV_PATH.exists():
    load_dotenv(ENV_PATH)

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inha-Bot API"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Supabase Settings (Unified to SUPABASE_ANON_KEY)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")

    # Crawler Settings
    REQUEST_TIMEOUT: int = 20
    MAX_RETRIES: int = 3
    MIN_DELAY: float = 1.0
    MAX_DELAY: float = 3.0
    
    model_config = SettingsConfigDict(env_file=ENV_PATH, extra="ignore")

settings = Settings()
