/**
 * Analytics Section - Charts & Data Analysis
 */
import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { useTimeSeries, useCategories, usePeakAnalysis, useTrafficSummary } from '@/hooks/useTrafficData';
import { useTimeRange } from '@/hooks/useTimeRange';
import { PageLoading } from '@/components/common/LoadingSpinner';
import VehicleLineChart from '@/components/charts/VehicleLineChart';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import TrafficAreaChart from '@/components/charts/TrafficAreaChart';
import VehiclePieChart from '@/components/charts/VehiclePieChart';
import { formatNumber, formatClockTime } from '@/utils/formatters';

export default function AnalyticsSection() {
  const { data: timeseries, isLoading: timeseriesLoading } = useTimeSeries();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: peakAnalysis, isLoading: peakLoading } = usePeakAnalysis();
  const { data: summary } = useTrafficSummary();
  const { currentMinute, setCurrentMinute } = useTimeRange(
    timeseries?.total_minutes ? timeseries.total_minutes - 1 : 59
  );

  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  if (timeseriesLoading || categoriesLoading || peakLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Traffic Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed analysis and visualizations of traffic patterns
          </p>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setChartType('area')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'area'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-traffic-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Area Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-traffic-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Line Chart
          </button>
        </div>
      </div>

      {/* Main Traffic Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-traffic-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Traffic Flow Over Time
            </h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {timeseries?.total_minutes || 0} minutes of data
          </span>
        </div>

        {timeseries && (
          <div className="h-80">
            {chartType === 'area' ? (
              <TrafficAreaChart 
                data={timeseries.data} 
                height={320}
                highlightMinute={currentMinute}
              />
            ) : (
              <VehicleLineChart 
                data={timeseries.data} 
                height={320}
              />
            )}
          </div>
        )}

        {/* Time Scrubber */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Clock className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min={0}
              max={(timeseries?.total_minutes || 60) - 1}
              value={currentMinute}
              onChange={(e) => setCurrentMinute(parseInt(e.target.value))}
              className="time-slider flex-1"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[80px]">
              {formatClockTime(currentMinute)}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicle Distribution Bar Chart */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-traffic-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vehicle Distribution
            </h3>
          </div>
          {categories && (
            <CategoryBarChart 
              data={categories.categories} 
              height={280}
              layout="horizontal"
            />
          )}
        </div>

        {/* Vehicle Composition Pie Chart */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <PieChartIcon className="w-5 h-5 text-traffic-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vehicle Composition
            </h3>
          </div>
          {categories && (
            <VehiclePieChart 
              data={categories.categories} 
              height={280}
            />
          )}
        </div>
      </div>

      {/* Peak Analysis Section */}
      {peakAnalysis && summary && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-traffic-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Peak Traffic Analysis
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Morning Rush */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium text-amber-900 dark:text-amber-100">
                  Early Period
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {formatNumber(peakAnalysis.morning_rush.total)}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Avg: {peakAnalysis.morning_rush.average.toFixed(1)}/min
              </p>
            </div>

            {/* Peak Hour */}
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-medium text-red-900 dark:text-red-100">
                  Peak Traffic
                </span>
              </div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {formatNumber(summary.peak_count)}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                At minute {summary.peak_minute}
              </p>
            </div>

            {/* Evening Rush */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="font-medium text-purple-900 dark:text-purple-100">
                  Late Period
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatNumber(peakAnalysis.evening_rush.total)}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Avg: {peakAnalysis.evening_rush.average.toFixed(1)}/min
              </p>
            </div>
          </div>

          {/* Peak Minutes Visualization */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Peak minutes (above {peakAnalysis.peak_threshold} vehicles):
            </p>
            <div className="flex flex-wrap gap-2">
              {peakAnalysis.peak_minutes.map((minute) => (
                <span
                  key={minute}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium"
                >
                  {formatClockTime(minute)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
