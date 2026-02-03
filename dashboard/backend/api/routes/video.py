"""
Video Streaming API Routes
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from pathlib import Path
import os

from config import settings

router = APIRouter()


@router.get("/info")
async def get_video_info():
    """
    Get video file information.
    
    Returns:
        Video metadata including path, size, and availability
    """
    video_path = settings.data_dir / settings.video_file
    
    if not video_path.exists():
        # Check for alternative video files
        video_extensions = ['.avi', '.mp4', '.mov', '.mkv']
        available_videos = []
        for ext in video_extensions:
            for f in settings.data_dir.glob(f"*{ext}"):
                available_videos.append(f.name)
        
        return {
            "available": False,
            "configured_file": settings.video_file,
            "alternative_videos": available_videos,
            "message": "Configured video file not found",
        }
    
    file_size = video_path.stat().st_size
    
    return {
        "available": True,
        "filename": settings.video_file,
        "path": f"/static/{settings.video_file}",
        "size_bytes": file_size,
        "size_mb": round(file_size / (1024 * 1024), 2),
    }


@router.get("/stream")
async def stream_video():
    """
    Stream the processed video file.
    
    Returns:
        Video file stream
    """
    video_path = settings.data_dir / settings.video_file
    
    if not video_path.exists():
        # Try to find any available video
        for ext in ['.avi', '.mp4', '.mov']:
            for video in settings.data_dir.glob(f"*output*{ext}"):
                video_path = video
                break
            if video_path.exists():
                break
    
    if not video_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No video file available. Please ensure the processed video is in the data folder."
        )
    
    return FileResponse(
        path=str(video_path),
        media_type="video/x-msvideo",  # AVI format
        filename=video_path.name,
    )


@router.get("/list")
async def list_videos():
    """
    List all available video files.
    
    Returns:
        List of video files in the data directory
    """
    video_extensions = ['.avi', '.mp4', '.mov', '.mkv', '.webm']
    videos = []
    
    for ext in video_extensions:
        for video_file in settings.data_dir.glob(f"*{ext}"):
            file_stat = video_file.stat()
            videos.append({
                "filename": video_file.name,
                "path": f"/static/{video_file.name}",
                "size_bytes": file_stat.st_size,
                "size_mb": round(file_stat.st_size / (1024 * 1024), 2),
                "is_output": "output" in video_file.name.lower(),
            })
    
    return {
        "videos": videos,
        "count": len(videos),
        "primary": settings.video_file,
    }
