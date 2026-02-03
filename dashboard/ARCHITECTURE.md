# 🏗️ Traffic AI Dashboard - Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRAFFIC AI DASHBOARD                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐  │
│  │   AI PIPELINE │ ──▶│  DATA LAYER  │ ──▶│     VISUALIZATION LAYER      │  │
│  │   (YOLOv8)   │    │  (FastAPI)   │    │     (React + Recharts)       │  │
│  └──────────────┘    └──────────────┘    └──────────────────────────────┘  │
│         │                   │                         │                    │
│         ▼                   ▼                         ▼                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐  │
│  │ Processed    │    │ REST APIs    │    │ Interactive Charts           │  │
│  │ Video + CSV  │    │ WebSocket    │    │ GIS Heatmaps                 │  │
│  │ GIS Metadata │    │ Static Files │    │ Time-based Analysis          │  │
│  └──────────────┘    └──────────────┘    └──────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
dashboard/
├── backend/                    # FastAPI Backend
│   ├── main.py                 # Application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── traffic.py      # Traffic data endpoints
│   │   │   ├── video.py        # Video streaming endpoints
│   │   │   └── export.py       # Data export endpoints
│   │   └── models/
│   │       ├── __init__.py
│   │       └── schemas.py      # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── data_service.py     # CSV data processing
│   │   └── analytics.py        # Traffic analytics
│   ├── config.py               # Configuration settings
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   ├── TrafficOverview.tsx
│   │   │   │   └── QuickInsights.tsx
│   │   │   ├── charts/
│   │   │   │   ├── VehicleLineChart.tsx
│   │   │   │   ├── CategoryBarChart.tsx
│   │   │   │   ├── TrafficAreaChart.tsx
│   │   │   │   └── VehiclePieChart.tsx
│   │   │   ├── video/
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   └── VideoControls.tsx
│   │   │   ├── maps/
│   │   │   │   ├── TrafficMap.tsx
│   │   │   │   ├── HeatmapLayer.tsx
│   │   │   │   └── TimeSlider.tsx
│   │   │   └── common/
│   │   │       ├── ThemeToggle.tsx
│   │   │       ├── ExportButton.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   ├── useTrafficData.ts
│   │   │   ├── useTheme.ts
│   │   │   └── useTimeRange.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   └── trafficSlice.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── constants.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── data/                       # Symlink to parent data folder
├── docker-compose.yml          # Container orchestration
└── README.md                   # Setup instructions
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────────────┘

1. DATA INGESTION
   ┌────────────┐     ┌────────────┐     ┌────────────┐
   │ CSV Files  │ ──▶ │ Pandas     │ ──▶ │ In-Memory  │
   │ Video Files│     │ Processing │     │ Cache      │
   │ GIS JSON   │     │            │     │            │
   └────────────┘     └────────────┘     └────────────┘

2. API LAYER
   ┌────────────┐     ┌────────────┐     ┌────────────┐
   │ FastAPI    │ ◀──▶│ Pydantic   │ ◀──▶│ JSON       │
   │ Endpoints  │     │ Validation │     │ Response   │
   └────────────┘     └────────────┘     └────────────┘

3. FRONTEND CONSUMPTION
   ┌────────────┐     ┌────────────┐     ┌────────────┐
   │ React      │ ◀──▶│ TanStack   │ ◀──▶│ Zustand    │
   │ Components │     │ Query      │     │ Store      │
   └────────────┘     └────────────┘     └────────────┘
```

## Tech Stack Details

### Backend
- **FastAPI** - High-performance async API framework
- **Pandas** - Data manipulation and analytics
- **Uvicorn** - ASGI server
- **Python-Multipart** - File handling

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Recharts** - React charting library
- **Leaflet** - Interactive maps
- **Leaflet.heat** - Heatmap plugin
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Lucide React** - Icons

### DevOps
- **Docker** - Containerization
- **Nginx** - Production reverse proxy
- **Vercel/Netlify** - Frontend deployment

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/traffic/summary` | Overall traffic statistics |
| GET | `/api/traffic/timeseries` | Per-minute vehicle counts |
| GET | `/api/traffic/categories` | Vehicle category breakdown |
| GET | `/api/traffic/peak-hours` | Peak traffic analysis |
| GET | `/api/traffic/heatmap` | GIS heatmap data |
| GET | `/api/video/stream` | Video streaming |
| GET | `/api/export/csv` | Download CSV report |
| GET | `/api/export/pdf` | Download PDF report |
| GET | `/api/config/location` | Location metadata |

## Security Considerations

- CORS configuration for API access
- Rate limiting on endpoints
- Input validation with Pydantic
- Secure file serving

## Performance Optimizations

1. **Backend**
   - In-memory data caching
   - Async endpoint handlers
   - Streaming responses for large data

2. **Frontend**
   - Code splitting with React.lazy
   - Memoization with useMemo/useCallback
   - Virtual scrolling for large lists
   - Debounced slider updates
