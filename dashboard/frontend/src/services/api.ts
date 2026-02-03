/**
 * Traffic AI Dashboard - API Service Layer
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/utils/constants';
import type {
  TrafficSummary,
  TimeSeriesResponse,
  CategoriesResponse,
  HeatmapResponse,
  PeakAnalysis,
  LocationInfo,
  VideoInfo,
} from '@/types';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

/**
 * Traffic Data API
 */
export const trafficApi = {
  /**
   * Get traffic summary statistics
   */
  getSummary: async (): Promise<TrafficSummary> => {
    const { data } = await apiClient.get<TrafficSummary>(API_ENDPOINTS.TRAFFIC_SUMMARY);
    return data;
  },

  /**
   * Get time series data
   */
  getTimeSeries: async (start = 0, end?: number): Promise<TimeSeriesResponse> => {
    const params: Record<string, number> = { start };
    if (end !== undefined) params.end = end;
    
    const { data } = await apiClient.get<TimeSeriesResponse>(
      API_ENDPOINTS.TRAFFIC_TIMESERIES,
      { params }
    );
    return data;
  },

  /**
   * Get vehicle categories breakdown
   */
  getCategories: async (): Promise<CategoriesResponse> => {
    const { data } = await apiClient.get<CategoriesResponse>(API_ENDPOINTS.TRAFFIC_CATEGORIES);
    return data;
  },

  /**
   * Get heatmap data for GIS visualization
   */
  getHeatmap: async (minute?: number): Promise<HeatmapResponse> => {
    const params = minute !== undefined ? { minute } : {};
    const { data } = await apiClient.get<HeatmapResponse>(
      API_ENDPOINTS.TRAFFIC_HEATMAP,
      { params }
    );
    return data;
  },

  /**
   * Get peak hour analysis
   */
  getPeakAnalysis: async (): Promise<PeakAnalysis> => {
    const { data } = await apiClient.get<PeakAnalysis>(API_ENDPOINTS.TRAFFIC_PEAK);
    return data;
  },
};

/**
 * Video API
 */
export const videoApi = {
  /**
   * Get video file information
   */
  getInfo: async (): Promise<VideoInfo> => {
    const { data } = await apiClient.get<VideoInfo>(API_ENDPOINTS.VIDEO_INFO);
    return data;
  },

  /**
   * Get video stream URL
   */
  getStreamUrl: (): string => {
    return `${API_BASE_URL}${API_ENDPOINTS.VIDEO_STREAM}`;
  },

  /**
   * List available videos
   */
  listVideos: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.VIDEO_LIST);
    return data;
  },
};

/**
 * Configuration API
 */
export const configApi = {
  /**
   * Get location information
   */
  getLocation: async (): Promise<LocationInfo> => {
    const { data } = await apiClient.get<LocationInfo>(API_ENDPOINTS.CONFIG_LOCATION);
    return data;
  },

  /**
   * Get public settings
   */
  getSettings: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.CONFIG_SETTINGS);
    return data;
  },
};

/**
 * Export API
 */
export const exportApi = {
  /**
   * Get CSV export URL
   */
  getCsvUrl: (): string => {
    return `${API_BASE_URL}${API_ENDPOINTS.EXPORT_CSV}`;
  },

  /**
   * Get JSON export URL
   */
  getJsonUrl: (): string => {
    return `${API_BASE_URL}${API_ENDPOINTS.EXPORT_JSON}`;
  },

  /**
   * Get report export URL
   */
  getReportUrl: (): string => {
    return `${API_BASE_URL}${API_ENDPOINTS.EXPORT_REPORT}`;
  },

  /**
   * Download CSV file
   */
  downloadCsv: () => {
    window.open(exportApi.getCsvUrl(), '_blank');
  },

  /**
   * Download JSON file
   */
  downloadJson: () => {
    window.open(exportApi.getJsonUrl(), '_blank');
  },

  /**
   * Download report
   */
  downloadReport: () => {
    window.open(exportApi.getReportUrl(), '_blank');
  },
};

// Export default API object
export default {
  traffic: trafficApi,
  video: videoApi,
  config: configApi,
  export: exportApi,
};
