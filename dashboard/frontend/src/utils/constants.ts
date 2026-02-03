/**
 * Traffic AI Dashboard - Constants
 */

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// API Endpoints
export const API_ENDPOINTS = {
  TRAFFIC_SUMMARY: '/api/traffic/summary',
  TRAFFIC_TIMESERIES: '/api/traffic/timeseries',
  TRAFFIC_CATEGORIES: '/api/traffic/categories',
  TRAFFIC_HEATMAP: '/api/traffic/heatmap',
  TRAFFIC_PEAK: '/api/traffic/peak-analysis',
  VIDEO_INFO: '/api/video/info',
  VIDEO_STREAM: '/api/video/stream',
  VIDEO_LIST: '/api/video/list',
  EXPORT_CSV: '/api/export/csv',
  EXPORT_JSON: '/api/export/json',
  EXPORT_REPORT: '/api/export/report',
  CONFIG_LOCATION: '/api/config/location',
  CONFIG_SETTINGS: '/api/config/settings',
} as const;

// Chart Colors
export const CHART_COLORS = {
  car: '#3B82F6',
  truck: '#F59E0B',
  bus: '#10B981',
  motorcycle: '#8B5CF6',
  bicycle: '#06B6D4',
  other: '#6B7280',
  total: '#EC4899',
} as const;

// Gradient definitions for charts
export const GRADIENT_DEFS = {
  blue: {
    id: 'colorBlue',
    startColor: 'rgba(59, 130, 246, 0.8)',
    endColor: 'rgba(59, 130, 246, 0.1)',
  },
  green: {
    id: 'colorGreen',
    startColor: 'rgba(16, 185, 129, 0.8)',
    endColor: 'rgba(16, 185, 129, 0.1)',
  },
} as const;

// Traffic density thresholds
export const DENSITY_THRESHOLDS = {
  LOW: 0.5,
  MODERATE: 1.0,
  HIGH: 1.5,
} as const;

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const;

// Heatmap configuration
export const HEATMAP_CONFIG = {
  RADIUS: 25,
  BLUR: 15,
  MAX_ZOOM: 17,
  GRADIENT: {
    0.0: '#10B981',  // Green - Low
    0.3: '#84CC16',  // Lime
    0.5: '#F59E0B',  // Amber - Moderate
    0.7: '#F97316',  // Orange
    1.0: '#EF4444',  // Red - High
  },
} as const;

// Animation durations (ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Playback speeds for time slider
export const PLAYBACK_SPEEDS = [0.5, 1, 2, 4] as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'traffic-ai-theme',
  SIDEBAR_COLLAPSED: 'traffic-ai-sidebar',
} as const;

// Dashboard navigation items
export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', path: '/' },
  { id: 'video', label: 'Video Analytics', icon: 'Video', path: '/video' },
  { id: 'analytics', label: 'Charts & Analytics', icon: 'BarChart3', path: '/analytics' },
  { id: 'heatmap', label: 'Traffic Heatmap', icon: 'Map', path: '/heatmap' },
  { id: 'export', label: 'Export Data', icon: 'Download', path: '/export' },
] as const;

// Stat card configurations
export const STAT_CARDS = [
  { key: 'total_vehicles', label: 'Total Vehicles', icon: 'Car', color: 'blue' },
  { key: 'total_cars', label: 'Cars', icon: 'Car', color: 'blue' },
  { key: 'total_trucks', label: 'Trucks', icon: 'Truck', color: 'amber' },
  { key: 'total_buses', label: 'Buses', icon: 'Bus', color: 'green' },
  { key: 'average_per_minute', label: 'Avg/Minute', icon: 'TrendingUp', color: 'purple' },
  { key: 'peak_count', label: 'Peak Count', icon: 'Zap', color: 'red' },
] as const;
