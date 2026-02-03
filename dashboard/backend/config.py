"""
Traffic AI Dashboard - Configuration Settings
"""
from pydantic_settings import BaseSettings
from pathlib import Path
from functools import lru_cache


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Application Info
    app_name: str = "Traffic AI Dashboard"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8000
    
    # CORS Settings
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Data Paths (relative to project root)
    data_dir: Path = Path(__file__).parent.parent.parent / "data"
    csv_file: str = "traffic_counts_per_minute.csv"
    video_file: str = "traffic_count_output.mp4"
    
    # Location Configuration
    location_name: str = "Vittal Mallya Road, Bengaluru"
    latitude: float = 12.9716
    longitude: float = 77.5946
    camera_id: str = "CAM-VMR-001"
    
    # Analysis Settings
    peak_threshold_percentile: int = 75  # Top 25% = peak hours
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Export settings instance
settings = get_settings()
