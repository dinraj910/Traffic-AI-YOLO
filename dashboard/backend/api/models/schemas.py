"""
Pydantic Schemas for API Request/Response Models
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class LocationInfo(BaseModel):
    """Location metadata"""
    name: str = Field(..., description="Location name")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    camera_id: str = Field(..., description="Camera identifier")


class VehicleCount(BaseModel):
    """Single vehicle count record"""
    minute: int = Field(..., ge=0)
    vehicle: str = Field(..., description="Vehicle type")
    count: int = Field(..., ge=0)


class TrafficSummary(BaseModel):
    """Overall traffic statistics summary"""
    total_vehicles: int
    total_cars: int
    total_trucks: int
    total_buses: int
    total_motorcycles: int
    total_other: int
    peak_minute: int
    peak_count: int
    average_per_minute: float
    duration_minutes: int
    vehicle_categories: dict[str, int]
    
    
class TimeSeriesPoint(BaseModel):
    """Single point in time series"""
    minute: int
    total: int
    cars: int = 0
    trucks: int = 0
    buses: int = 0
    motorcycles: int = 0
    other: int = 0


class TimeSeriesResponse(BaseModel):
    """Time series response"""
    data: list[TimeSeriesPoint]
    total_minutes: int
    

class CategoryBreakdown(BaseModel):
    """Vehicle category breakdown"""
    category: str
    count: int
    percentage: float
    color: str


class CategoriesResponse(BaseModel):
    """Categories response"""
    categories: list[CategoryBreakdown]
    total: int


class HeatmapPoint(BaseModel):
    """Single heatmap data point"""
    lat: float
    lng: float
    intensity: float
    minute: Optional[int] = None


class HeatmapResponse(BaseModel):
    """Heatmap data response"""
    center: dict
    points: list[HeatmapPoint]
    max_intensity: float
    radius: int = 25


class PeakHourAnalysis(BaseModel):
    """Peak hour analysis data"""
    peak_minutes: list[int]
    peak_threshold: int
    morning_rush: dict
    evening_rush: dict
    off_peak: dict


class ExportMetadata(BaseModel):
    """Export file metadata"""
    filename: str
    format: str
    size_bytes: int
    generated_at: datetime
    records_count: int
