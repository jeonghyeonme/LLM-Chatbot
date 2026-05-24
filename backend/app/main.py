from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.logger import logger
from app.routers import calendar, mealPlan

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calendar.router)
app.include_router(mealPlan.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}

@app.get("/")
async def root():
    return {"message": "Welcome to Inha-Bot API"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Inha-Bot API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
