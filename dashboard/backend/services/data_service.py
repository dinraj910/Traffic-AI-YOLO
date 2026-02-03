"""
Data Service - CSV Data Processing and Analytics
"""
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Optional
import logging

from config import settings

logger = logging.getLogger(__name__)


class DataService:
    """Service for loading and processing traffic data"""
    
    _instance: Optional['DataService'] = None
    
    def __new__(cls):
        """Singleton pattern to ensure single data instance"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        self.df: Optional[pd.DataFrame] = None
        self.is_loaded: bool = False
        self._initialized = True
    
    def load_data(self) -> bool:
        """Load CSV data from configured path"""
        try:
            csv_path = settings.data_dir / settings.csv_file
            logger.info(f"Loading data from: {csv_path}")
            
            if not csv_path.exists():
                logger.warning(f"CSV file not found at {csv_path}")
                self._create_sample_data()
                return True
            
            self.df = pd.read_csv(csv_path)
            self._normalize_data()
            self.is_loaded = True
            logger.info(f"Loaded {len(self.df)} records successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            self._create_sample_data()
            return True
    
    def _create_sample_data(self):
        """Create sample data for demonstration"""
        logger.info("Creating sample demonstration data...")
        
        # Generate realistic traffic patterns
        data = []
        vehicle_types = ['car', 'truck', 'bus', 'motorcycle']
        
        # Traffic pattern: morning rush, midday, evening rush
        for minute in range(60):  # 1 hour of data
            # Base traffic varies by time
            if minute < 15:  # Early morning buildup
                base_multiplier = 0.5 + (minute / 30)
            elif minute < 30:  # Morning rush
                base_multiplier = 1.5 + np.random.uniform(-0.2, 0.2)
            elif minute < 45:  # Midday
                base_multiplier = 0.8 + np.random.uniform(-0.1, 0.1)
            else:  # Evening buildup
                base_multiplier = 1.2 + (minute - 45) / 30
            
            # Vehicle distribution
            car_count = int(np.random.poisson(50 * base_multiplier))
            truck_count = int(np.random.poisson(8 * base_multiplier))
            bus_count = int(np.random.poisson(3 * base_multiplier))
            motorcycle_count = int(np.random.poisson(15 * base_multiplier))
            
            data.extend([
                {'minute': minute, 'vehicle': 'car', 'count': car_count},
                {'minute': minute, 'vehicle': 'truck', 'count': truck_count},
                {'minute': minute, 'vehicle': 'bus', 'count': bus_count},
                {'minute': minute, 'vehicle': 'motorcycle', 'count': motorcycle_count},
            ])
        
        self.df = pd.DataFrame(data)
        self.is_loaded = True
        logger.info(f"Created sample data with {len(self.df)} records")
    
    def _normalize_data(self):
        """Normalize column names and data types"""
        # Standardize column names
        self.df.columns = self.df.columns.str.lower().str.strip()
        
        # Ensure required columns exist
        if 'minute' not in self.df.columns:
            if 'time_sec' in self.df.columns:
                self.df['minute'] = (self.df['time_sec'] / 60).astype(int)
        
        # Normalize vehicle types
        if 'vehicle' in self.df.columns:
            self.df['vehicle'] = self.df['vehicle'].str.lower().str.strip()
    
    def get_summary(self) -> dict:
        """Get traffic summary statistics"""
        if not self.is_loaded:
            return {}
        
        # Aggregate by vehicle type
        vehicle_totals = self.df.groupby('vehicle')['count'].sum().to_dict()
        
        # Aggregate by minute for peak detection
        minute_totals = self.df.groupby('minute')['count'].sum()
        peak_minute = minute_totals.idxmax()
        peak_count = minute_totals.max()
        
        total = int(self.df['count'].sum())
        duration = int(self.df['minute'].nunique())
        
        return {
            'total_vehicles': total,
            'total_cars': int(vehicle_totals.get('car', 0)),
            'total_trucks': int(vehicle_totals.get('truck', 0)),
            'total_buses': int(vehicle_totals.get('bus', 0)),
            'total_motorcycles': int(vehicle_totals.get('motorcycle', 0)),
            'total_other': total - sum([
                int(vehicle_totals.get('car', 0)),
                int(vehicle_totals.get('truck', 0)),
                int(vehicle_totals.get('bus', 0)),
                int(vehicle_totals.get('motorcycle', 0)),
            ]),
            'peak_minute': int(peak_minute),
            'peak_count': int(peak_count),
            'average_per_minute': round(total / max(duration, 1), 2),
            'duration_minutes': duration,
            'vehicle_categories': {k: int(v) for k, v in vehicle_totals.items()},
        }
    
    def get_timeseries(self, start_minute: int = 0, end_minute: Optional[int] = None) -> list[dict]:
        """Get time series data for charts"""
        if not self.is_loaded:
            return []
        
        # Filter by time range
        df = self.df.copy()
        if end_minute is not None:
            df = df[(df['minute'] >= start_minute) & (df['minute'] <= end_minute)]
        else:
            df = df[df['minute'] >= start_minute]
        
        # Pivot to get vehicles as columns
        pivot = df.pivot_table(
            index='minute',
            columns='vehicle',
            values='count',
            aggfunc='sum',
            fill_value=0
        ).reset_index()
        
        # Calculate totals and format response
        result = []
        for _, row in pivot.iterrows():
            point = {
                'minute': int(row['minute']),
                'cars': int(row.get('car', 0)),
                'trucks': int(row.get('truck', 0)),
                'buses': int(row.get('bus', 0)),
                'motorcycles': int(row.get('motorcycle', 0)),
            }
            point['total'] = sum([point['cars'], point['trucks'], point['buses'], point['motorcycles']])
            result.append(point)
        
        return sorted(result, key=lambda x: x['minute'])
    
    def get_categories(self) -> dict:
        """Get vehicle category breakdown"""
        if not self.is_loaded:
            return {'categories': [], 'total': 0}
        
        totals = self.df.groupby('vehicle')['count'].sum()
        total = totals.sum()
        
        # Color mapping for charts
        colors = {
            'car': '#3B82F6',      # Blue
            'truck': '#F59E0B',     # Amber
            'bus': '#10B981',       # Green
            'motorcycle': '#8B5CF6', # Purple
            'other': '#6B7280',     # Gray
        }
        
        categories = []
        for vehicle, count in totals.items():
            categories.append({
                'category': vehicle.title(),
                'count': int(count),
                'percentage': round(count / total * 100, 1) if total > 0 else 0,
                'color': colors.get(vehicle, '#6B7280'),
            })
        
        # Sort by count descending
        categories.sort(key=lambda x: x['count'], reverse=True)
        
        return {
            'categories': categories,
            'total': int(total),
        }
    
    def get_heatmap_data(self, minute: Optional[int] = None) -> dict:
        """Generate heatmap data for GIS visualization"""
        if not self.is_loaded:
            return {
                'center': {'lat': settings.latitude, 'lng': settings.longitude},
                'points': [],
                'max_intensity': 0,
            }
        
        # Filter by minute if specified
        if minute is not None:
            df = self.df[self.df['minute'] == minute]
        else:
            df = self.df
        
        # Get intensity based on total vehicles
        if len(df) > 0:
            intensity = df['count'].sum()
            max_intensity = self.df.groupby('minute')['count'].sum().max()
        else:
            intensity = 0
            max_intensity = 100
        
        # Generate heatmap points around the camera location
        # Simulate traffic distribution in the area
        points = []
        base_lat, base_lng = settings.latitude, settings.longitude
        
        # Create a realistic spread of traffic intensity points
        np.random.seed(42)  # Consistent generation
        for i in range(20):
            # Random offset within ~200m radius
            lat_offset = np.random.uniform(-0.002, 0.002)
            lng_offset = np.random.uniform(-0.002, 0.002)
            
            # Intensity decreases with distance from center
            distance = np.sqrt(lat_offset**2 + lng_offset**2)
            point_intensity = intensity * (1 - distance / 0.003) * np.random.uniform(0.5, 1.0)
            point_intensity = max(0, point_intensity)
            
            points.append({
                'lat': base_lat + lat_offset,
                'lng': base_lng + lng_offset,
                'intensity': round(point_intensity, 2),
                'minute': minute,
            })
        
        # Add camera location as highest intensity point
        points.append({
            'lat': base_lat,
            'lng': base_lng,
            'intensity': float(intensity),
            'minute': minute,
        })
        
        return {
            'center': {'lat': base_lat, 'lng': base_lng},
            'points': points,
            'max_intensity': float(max_intensity),
            'radius': 25,
        }
    
    def get_peak_analysis(self) -> dict:
        """Analyze peak traffic periods"""
        if not self.is_loaded:
            return {}
        
        minute_totals = self.df.groupby('minute')['count'].sum()
        threshold = minute_totals.quantile(settings.peak_threshold_percentile / 100)
        peak_minutes = minute_totals[minute_totals >= threshold].index.tolist()
        
        # Categorize time periods (assuming 60-minute data starting from 0)
        total_minutes = self.df['minute'].max() + 1
        
        # Define rush hours based on available data
        morning_range = range(0, min(20, total_minutes))
        evening_range = range(max(0, total_minutes - 20), total_minutes)
        
        morning_total = self.df[self.df['minute'].isin(morning_range)]['count'].sum()
        evening_total = self.df[self.df['minute'].isin(evening_range)]['count'].sum()
        off_peak_total = self.df[~self.df['minute'].isin(list(morning_range) + list(evening_range))]['count'].sum()
        
        return {
            'peak_minutes': peak_minutes,
            'peak_threshold': int(threshold),
            'morning_rush': {
                'minutes': list(morning_range),
                'total': int(morning_total),
                'average': round(morning_total / max(len(morning_range), 1), 2),
            },
            'evening_rush': {
                'minutes': list(evening_range),
                'total': int(evening_total),
                'average': round(evening_total / max(len(evening_range), 1), 2),
            },
            'off_peak': {
                'total': int(off_peak_total),
            },
        }


# Singleton instance
data_service = DataService()
