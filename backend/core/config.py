from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inha-Bot API"
    OPENAI_API_KEY: str = ""
    
    # Supabase Settings
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    
    # Crawler Settings
    REQUEST_TIMEOUT: int = 10
    MAX_RETRIES: int = 3
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
