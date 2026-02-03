# 🚦 Traffic AI Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet"/>
</p>

A professional, interactive web dashboard for visualizing outputs from an AI-based traffic monitoring system. Built for urban planners, traffic engineers, and smart city teams.

## 🎯 Features

### 📊 Landing Overview
- Project introduction and statistics
- Real-time traffic metrics cards
- Vehicle composition breakdown
- Traffic density indicator

### 🎥 Video Analytics
- Embedded AI-processed video playback
- Toggle bounding boxes and counting lines
- Real-time detection statistics panel
- YOLOv8 + ByteTrack integration info

### 📈 Charts & Analytics
- Interactive line/area charts (vehicles per minute)
- Category distribution bar charts
- Vehicle composition pie charts
- Peak traffic analysis with time-based insights
- Responsive charts with hover tooltips

### 🗺️ GIS Heatmap
- Interactive Leaflet map with OpenStreetMap
- Real-time heatmap overlay showing traffic intensity
- Camera location marker
- Color-coded density legend (Low → High)

### ⏱️ Time-Based Analysis
- Time slider for scrubbing through data
- Play/Pause animation controls
- Adjustable playback speed (0.5x - 4x)
- Morning/Evening rush hour visualization

### 📥 Data Export
- Download CSV data
- Export JSON reports
- Generate markdown analysis reports
- API access information

### 🎨 Modern UI/UX
- Dark & Light mode support
- Fully responsive design
- Clean dashboard-style layout
- Professional animations

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.9+ (for backend)
- **npm** or **yarn**

### 1️⃣ Backend Setup

```bash
cd dashboard/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000

API Documentation: http://localhost:8000/docs

### 2️⃣ Frontend Setup

```bash
cd dashboard/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

### 3️⃣ Using Docker (Optional)

```bash
cd dashboard

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📁 Project Structure

```
dashboard/
├── backend/                    # FastAPI Backend
│   ├── api/
│   │   ├── models/
│   │   │   └── schemas.py     # Pydantic models
│   │   └── routes/
│   │       ├── traffic.py     # Traffic data endpoints
│   │       ├── video.py       # Video streaming
│   │       ├── export.py      # Data export
│   │       └── config.py      # Configuration
│   ├── services/
│   │   └── data_service.py    # Data processing
│   ├── config.py              # App settings
│   ├── main.py                # Entry point
│   └── requirements.txt
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Header, Sidebar, Footer
│   │   │   ├── dashboard/     # Overview components
│   │   │   ├── charts/        # Recharts components
│   │   │   ├── video/         # Video player
│   │   │   ├── maps/          # Leaflet heatmap
│   │   │   └── common/        # Shared components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client
│   │   ├── store/             # Zustand state
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utilities
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── ARCHITECTURE.md
```

---

## 🔧 Configuration

### Backend Configuration

Edit `dashboard/backend/config.py`:

```python
# Location Settings
location_name: str = "Your Location Name"
latitude: float = 12.9716
longitude: float = 77.5946
camera_id: str = "CAM-001"

# Data Files
csv_file: str = "traffic_counts_per_minute.csv"
video_file: str = "traffic_count_output.avi"
```

### Environment Variables

Create `.env` file in backend folder:

```env
DEBUG=true
DATA_DIR=../../data
CORS_ORIGINS=["http://localhost:3000"]
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/traffic/summary` | Overall traffic statistics |
| GET | `/api/traffic/timeseries` | Per-minute vehicle counts |
| GET | `/api/traffic/categories` | Vehicle category breakdown |
| GET | `/api/traffic/heatmap` | GIS heatmap data |
| GET | `/api/traffic/peak-analysis` | Peak hour analysis |
| GET | `/api/video/stream` | Video file streaming |
| GET | `/api/export/csv` | Download CSV data |
| GET | `/api/export/json` | Download JSON report |
| GET | `/api/config/location` | Location metadata |

---

## 🚀 Deployment

### Vercel (Frontend)

1. Push frontend code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-api.com`

### Railway/Render (Backend)

1. Push backend code to GitHub
2. Create new service
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

### Docker Production

```bash
docker-compose --profile production up -d
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Recharts** - Data Visualization
- **Leaflet** - Interactive Maps
- **TanStack Query** - Server State
- **Zustand** - Client State
- **Lucide** - Icons

### Backend
- **FastAPI** - API Framework
- **Pandas** - Data Processing
- **Pydantic** - Data Validation
- **Uvicorn** - ASGI Server

---

## 📊 Data Format

### Input CSV Format

```csv
minute,vehicle,count
0,car,66
0,truck,8
1,car,72
1,truck,5
```

### Location Metadata

```json
{
  "location_name": "Vittal Mallya Road, Bengaluru",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "camera_id": "CAM-VMR-001"
}
```

---

## 📝 License

MIT License - See LICENSE file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

<p align="center">
  Built with ❤️ for Smart Cities
</p>
