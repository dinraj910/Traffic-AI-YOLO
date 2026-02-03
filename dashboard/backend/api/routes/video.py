"""
Video Streaming API Routes
"""
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import FileResponse, StreamingResponse
from pathlib import Path
import os
import mimetypes

from config import settings

router = APIRouter()

# MIME types for video formats
VIDEO_MIME_TYPES = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
}


def get_video_path() -> Path | None:
    """Find the best available video file."""
    # First try configured file
    video_path = settings.data_dir / settings.video_file
    if video_path.exists():
        return video_path
    
    # Try browser-compatible formats first (mp4, webm, mov)
    priority_order = ['.mp4', '.webm', '.mov', '.avi', '.mkv']
    for ext in priority_order:
        for video in settings.data_dir.glob(f"*{ext}"):
            return video
    
    return None


@router.get("/info")
async def get_video_info():
    """
    Get video file information.
    
    Returns:
        Video metadata including path, size, and availability
    """
    video_path = get_video_path()
    
    if not video_path or not video_path.exists():
        # Check for alternative video files
        video_extensions = ['.avi', '.mp4', '.mov', '.mkv', '.webm']
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
    ext = video_path.suffix.lower()
    
    return {
        "available": True,
        "filename": video_path.name,
        "path": f"/static/{video_path.name}",
        "size_bytes": file_size,
        "size_mb": round(file_size / (1024 * 1024), 2),
        "format": ext,
        "mime_type": VIDEO_MIME_TYPES.get(ext, 'video/mp4'),
    }


@router.get("/stream")
async def stream_video(request: Request):
    """
    Stream the video file with range request support for seeking.
    
    Returns:
        Video file stream with proper headers for browser playback
    """
    video_path = get_video_path()
    
    if not video_path or not video_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No video file available. Please ensure a video is in the data folder."
        )
    
    file_size = video_path.stat().st_size
    ext = video_path.suffix.lower()
    media_type = VIDEO_MIME_TYPES.get(ext, 'video/mp4')
    
    # Handle range requests for video seeking
    range_header = request.headers.get('range')
    
    if range_header:
        # Parse range header
        range_match = range_header.replace('bytes=', '').split('-')
        start = int(range_match[0]) if range_match[0] else 0
        end = int(range_match[1]) if range_match[1] else file_size - 1
        
        # Ensure valid range
        start = max(0, start)
        end = min(end, file_size - 1)
        chunk_size = end - start + 1
        
        def iter_file():
            with open(video_path, 'rb') as f:
                f.seek(start)
                remaining = chunk_size
                while remaining > 0:
                    read_size = min(8192, remaining)
                    data = f.read(read_size)
                    if not data:
                        break
                    remaining -= len(data)
                    yield data
        
        headers = {
            'Content-Range': f'bytes {start}-{end}/{file_size}',
            'Accept-Ranges': 'bytes',
            'Content-Length': str(chunk_size),
            'Content-Type': media_type,
        }
        
        return StreamingResponse(
            iter_file(),
            status_code=206,
            headers=headers,
            media_type=media_type,
        )
    
    # Full file response
    return FileResponse(
        path=str(video_path),
        media_type=media_type,
        filename=video_path.name,
        headers={'Accept-Ranges': 'bytes'},
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
