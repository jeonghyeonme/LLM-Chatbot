from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.logger import logger

app = FastAPI(title=settings.PROJECT_NAME)

# CORS 설정: 프런트엔드 배포 주소 및 로컬 주소 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://induck-it.vercel.app", # 필요시 실제 Vercel 주소로 변경
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}

@app.get("/")
async def root():
    return {"message": "Welcome to Inha-Bot API (AI & Data Ingestion Ready)"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Inha-Bot API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
