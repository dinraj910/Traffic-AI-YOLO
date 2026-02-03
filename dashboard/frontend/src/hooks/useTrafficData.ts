/**
 * Traffic AI Dashboard - Custom React Hooks
 */
import { useQuery } from '@tanstack/react-query';
import { trafficApi, videoApi, configApi } from '@/services/api';

/**
 * Hook for fetching traffic summary data
 */
export function useTrafficSummary() {
  return useQuery({
    queryKey: ['traffic', 'summary'],
    queryFn: trafficApi.getSummary,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

/**
 * Hook for fetching time series data
 */
export function useTimeSeries(start = 0, end?: number) {
  return useQuery({
    queryKey: ['traffic', 'timeseries', start, end],
    queryFn: () => trafficApi.getTimeSeries(start, end),
    staleTime: 30000,
  });
}

/**
 * Hook for fetching vehicle categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['traffic', 'categories'],
    queryFn: trafficApi.getCategories,
    staleTime: 30000,
  });
}

/**
 * Hook for fetching heatmap data
 */
export function useHeatmap(minute?: number) {
  return useQuery({
    queryKey: ['traffic', 'heatmap', minute],
    queryFn: () => trafficApi.getHeatmap(minute),
    staleTime: 10000,
  });
}

/**
 * Hook for fetching peak analysis
 */
export function usePeakAnalysis() {
  return useQuery({
    queryKey: ['traffic', 'peak-analysis'],
    queryFn: trafficApi.getPeakAnalysis,
    staleTime: 60000,
  });
}

/**
 * Hook for fetching video information
 */
export function useVideoInfo() {
  return useQuery({
    queryKey: ['video', 'info'],
    queryFn: videoApi.getInfo,
    staleTime: 60000,
  });
}

/**
 * Hook for fetching location configuration
 */
export function useLocation() {
  return useQuery({
    queryKey: ['config', 'location'],
    queryFn: configApi.getLocation,
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Hook for all dashboard data
 */
export function useDashboardData() {
  const summary = useTrafficSummary();
  const categories = useCategories();
  const timeseries = useTimeSeries();
  const location = useLocation();
  
  return {
    summary,
    categories,
    timeseries,
    location,
    isLoading: summary.isLoading || categories.isLoading || timeseries.isLoading,
    isError: summary.isError || categories.isError || timeseries.isError,
  };
}
