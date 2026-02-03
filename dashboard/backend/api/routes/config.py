"""
Configuration API Routes
"""
from fastapi import APIRouter

from config import settings
from api.models.schemas import LocationInfo

router = APIRouter()


@router.get("/location", response_model=LocationInfo)
async def get_location():
    """
    Get camera location information.
    
    Returns:
        LocationInfo with name, coordinates, and camera ID
    """
    return LocationInfo(
        name=settings.location_name,
        latitude=settings.latitude,
        longitude=settings.longitude,
        camera_id=settings.camera_id,
    )


@router.get("/settings")
async def get_public_settings():
    """
    Get public application settings.
    
    Returns:
        Non-sensitive configuration values
    """
    return {
        "app_name": settings.app_name,
        "app_version": settings.app_version,
        "location": {
            "name": settings.location_name,
            "latitude": settings.latitude,
            "longitude": settings.longitude,
            "camera_id": settings.camera_id,
        },
        "data": {
            "csv_file": settings.csv_file,
            "video_file": settings.video_file,
        },
    }
