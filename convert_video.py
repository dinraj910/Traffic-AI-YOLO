"""
Convert AVI video to MP4 for web browser compatibility
"""
import cv2
from pathlib import Path

def convert_avi_to_mp4(input_path: str, output_path: str):
    """Convert AVI video to MP4 format"""
    # Read the video
    cap = cv2.VideoCapture(input_path)
    
    # Get video properties
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"Converting video...")
    print(f"Resolution: {width}x{height}")
    print(f"FPS: {fps}")
    print(f"Total frames: {total_frames}")
    
    # Define the codec and create VideoWriter object
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        out.write(frame)
        frame_count += 1
        
        # Progress indicator
        if frame_count % 100 == 0:
            print(f"Progress: {frame_count}/{total_frames} frames ({frame_count*100//total_frames}%)")
    
    # Release everything
    cap.release()
    out.release()
    
    print(f"✓ Conversion complete! Saved to: {output_path}")

if __name__ == "__main__":
    input_file = "data/traffic_count_output.avi"
    output_file = "data/traffic_count_output.mp4"
    
    if not Path(input_file).exists():
        print(f"Error: Input file not found: {input_file}")
    else:
        convert_avi_to_mp4(input_file, output_file)
