import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 프로젝트 루트 디렉토리(backend)를 path에 추가하여 core, app 등의 모듈을 찾을 수 있게 함
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import settings
from core.logger import logger
from app.routers import chat, data

app = FastAPI(title=settings.PROJECT_NAME)

# 라우터 등록
app.include_router(chat.router)
app.include_router(data.router)

# CORS 설정: 프런트엔드 배포 주소 및 로컬 주소 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://induck-it.vercel.app",
        "https://induck-c9yvelp87-park-n-chills-projects.vercel.app",
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
