"""
Traffic AI Dashboard - Main Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging

from config import settings
from api.routes import traffic, video, export, config as config_routes
from services.data_service import DataService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize data service
data_service = DataService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("🚀 Starting Traffic AI Dashboard Backend...")
    data_service.load_data()
    logger.info(f"📊 Loaded traffic data from {settings.data_dir}")
    yield
    # Shutdown
    logger.info("👋 Shutting down Traffic AI Dashboard Backend...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    ## Traffic AI Dashboard API
    
    Backend API for the Traffic AI Dashboard - An intelligent vehicle detection 
    and traffic analysis system powered by YOLOv8.
    
    ### Features
    - 📊 Real-time traffic statistics
    - 📈 Time-series analytics
    - 🗺️ GIS heatmap data
    - 🎥 Video streaming
    - 📥 Data export
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for video serving
try:
    app.mount("/static", StaticFiles(directory=str(settings.data_dir)), name="static")
except Exception as e:
    logger.warning(f"Could not mount static files: {e}")

# Include API routers
app.include_router(traffic.router, prefix="/api/traffic", tags=["Traffic Data"])
app.include_router(video.router, prefix="/api/video", tags=["Video"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])
app.include_router(config_routes.router, prefix="/api/config", tags=["Configuration"])


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API health check"""
    return {
        "status": "online",
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "data_loaded": data_service.is_loaded,
        "records_count": len(data_service.df) if data_service.is_loaded else 0,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
