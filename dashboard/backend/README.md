# Traffic AI Dashboard - Backend

## Setup Instructions

### 1. Create Virtual Environment
```bash
cd dashboard/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn main:app --reload --port 8000
```

### 4. Access API Documentation
Open http://localhost:8000/docs for Swagger UI

## API Endpoints

- `GET /api/traffic/summary` - Traffic statistics summary
- `GET /api/traffic/timeseries` - Time series data
- `GET /api/traffic/categories` - Vehicle categories breakdown
- `GET /api/traffic/heatmap` - Heatmap data for GIS
- `GET /api/video/stream` - Video file streaming
- `GET /api/export/csv` - Export data as CSV
- `GET /api/config/location` - Location metadata
