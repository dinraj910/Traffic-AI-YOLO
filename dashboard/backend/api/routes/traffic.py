"""
Traffic Data API Routes
"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional

from services.data_service import data_service
from api.models.schemas import (
    TrafficSummary,
    TimeSeriesResponse,
    CategoriesResponse,
    HeatmapResponse,
    PeakHourAnalysis,
)

router = APIRouter()


@router.get("/summary", response_model=TrafficSummary)
async def get_traffic_summary():
    """
    Get overall traffic statistics summary.
    
    Returns:
        TrafficSummary with total counts, peak info, and vehicle breakdown
    """
    if not data_service.is_loaded:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    return data_service.get_summary()


@router.get("/timeseries", response_model=TimeSeriesResponse)
async def get_timeseries(
    start: int = Query(0, ge=0, description="Start minute"),
    end: Optional[int] = Query(None, ge=0, description="End minute"),
):
    """
    Get time series data for charts.
    
    Args:
        start: Starting minute (inclusive)
        end: Ending minute (inclusive, optional)
    
    Returns:
        TimeSeriesResponse with per-minute vehicle counts
    """
    if not data_service.is_loaded:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    data = data_service.get_timeseries(start, end)
    
    return {
        "data": data,
        "total_minutes": len(data),
    }


@router.get("/categories", response_model=CategoriesResponse)
async def get_categories():
    """
    Get vehicle category breakdown.
    
    Returns:
        CategoriesResponse with category counts and percentages
    """
    if not data_service.is_loaded:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    return data_service.get_categories()


@router.get("/heatmap", response_model=HeatmapResponse)
async def get_heatmap_data(
    minute: Optional[int] = Query(None, ge=0, description="Specific minute for heatmap"),
):
    """
    Get heatmap data for GIS visualization.
    
    Args:
        minute: Specific minute to get heatmap for (optional)
    
    Returns:
        HeatmapResponse with geographic points and intensities
    """
    if not data_service.is_loaded:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    return data_service.get_heatmap_data(minute)


@router.get("/peak-analysis", response_model=PeakHourAnalysis)
async def get_peak_analysis():
    """
    Get peak hour analysis data.
    
    Returns:
        PeakHourAnalysis with rush hour breakdowns
    """
    if not data_service.is_loaded:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    return data_service.get_peak_analysis()


@router.get("/minute/{minute}")
async def get_minute_data(minute: int):
    """
    Get detailed data for a specific minute.
    
    Args:
        minute: The minute to get data for
    
    Returns:
        Detailed breakdown for the specified minute
    """
    if not data_service.is_loaded:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    df = data_service.df
    minute_data = df[df['minute'] == minute]
    
    if len(minute_data) == 0:
        raise HTTPException(status_code=404, detail=f"No data for minute {minute}")
    
    vehicle_counts = minute_data.groupby('vehicle')['count'].sum().to_dict()
    total = sum(vehicle_counts.values())
    
    return {
        "minute": minute,
        "total": total,
        "vehicles": vehicle_counts,
        "is_peak": total >= data_service.get_peak_analysis().get('peak_threshold', 0),
    }
