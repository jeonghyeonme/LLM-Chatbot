from fastapi import FastAPI
from backend.core.config import settings
from backend.core.logger import logger

app = FastAPI(title=settings.PROJECT_NAME)

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
