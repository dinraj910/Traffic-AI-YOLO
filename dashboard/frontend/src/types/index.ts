/**
 * Traffic AI Dashboard - TypeScript Type Definitions
 */

// API Response Types
export interface TrafficSummary {
  total_vehicles: number;
  total_cars: number;
  total_trucks: number;
  total_buses: number;
  total_motorcycles: number;
  total_other: number;
  peak_minute: number;
  peak_count: number;
  average_per_minute: number;
  duration_minutes: number;
  vehicle_categories: Record<string, number>;
}

export interface TimeSeriesPoint {
  minute: number;
  total: number;
  cars: number;
  trucks: number;
  buses: number;
  motorcycles: number;
}

export interface TimeSeriesResponse {
  data: TimeSeriesPoint[];
  total_minutes: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CategoriesResponse {
  categories: CategoryBreakdown[];
  total: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  minute?: number;
}

export interface HeatmapResponse {
  center: {
    lat: number;
    lng: number;
  };
  points: HeatmapPoint[];
  max_intensity: number;
  radius: number;
}

export interface LocationInfo {
  name: string;
  latitude: number;
  longitude: number;
  camera_id: string;
}

export interface PeakAnalysis {
  peak_minutes: number[];
  peak_threshold: number;
  morning_rush: {
    minutes: number[];
    total: number;
    average: number;
  };
  evening_rush: {
    minutes: number[];
    total: number;
    average: number;
  };
  off_peak: {
    total: number;
  };
}

export interface VideoInfo {
  available: boolean;
  filename?: string;
  path?: string;
  size_bytes?: number;
  size_mb?: number;
  alternative_videos?: string[];
  message?: string;
}

// UI State Types
export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export interface TimeRangeState {
  currentMinute: number;
  startMinute: number;
  endMinute: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setCurrentMinute: (minute: number) => void;
  setRange: (start: number, end: number) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
}

// Chart Configuration
export interface ChartConfig {
  dataKey: string;
  color: string;
  label: string;
}

// Navigation
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

// Dashboard Section
export type DashboardSection = 
  | 'overview' 
  | 'video' 
  | 'analytics' 
  | 'heatmap' 
  | 'export';
