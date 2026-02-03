/**
 * Traffic Heatmap Section - GIS Visualization with Time Slider
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  MapPin,
  Thermometer,
  Clock,
  Info,
} from 'lucide-react';
import { useHeatmap, useLocation, useTimeSeries, useTrafficSummary } from '@/hooks/useTrafficData';
import { useTimeRange } from '@/hooks/useTimeRange';
import { PageLoading } from '@/components/common/LoadingSpinner';
import TrafficMap from '@/components/maps/TrafficMap';
import { formatClockTime, formatNumber } from '@/utils/formatters';
import { PLAYBACK_SPEEDS } from '@/utils/constants';

export default function HeatmapSection() {
  const { data: location, isLoading: locationLoading } = useLocation();
  const { data: timeseries, isLoading: timeseriesLoading } = useTimeSeries();
  const { data: summary } = useTrafficSummary();
  
  const maxMinute = timeseries?.total_minutes ? timeseries.total_minutes - 1 : 59;
  
  const {
    currentMinute,
    isPlaying,
    playbackSpeed,
    setCurrentMinute,
    togglePlay,
    setPlaybackSpeed,
    stepForward,
    stepBackward,
    goToStart,
    goToEnd,
    progress,
  } = useTimeRange(maxMinute);

  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap(currentMinute);

  // Get current minute data
  const currentData = timeseries?.data.find(d => d.minute === currentMinute);

  if (locationLoading || timeseriesLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Traffic Heatmap
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Interactive GIS visualization with time-based analysis
          </p>
        </div>

        {/* Current Stats */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-traffic-primary/10 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current: </span>
            <span className="font-bold text-traffic-primary">
              {formatClockTime(currentMinute)}
            </span>
          </div>
          <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Vehicles: </span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {currentData ? formatNumber(currentData.total) : 0}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map - 3 columns */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            {/* Map Container */}
            <div className="h-[500px] relative">
              {location && heatmapData && (
                <TrafficMap
                  center={[location.latitude, location.longitude]}
                  heatmapData={heatmapData}
                  currentMinute={currentMinute}
                />
              )}
              
              {/* Map Overlay - Legend */}
              <div className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Traffic Density
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-3 rounded" style={{
                    background: 'linear-gradient(to right, #10B981, #84CC16, #F59E0B, #F97316, #EF4444)'
                  }} />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Time Slider Controls */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={maxMinute}
                  value={currentMinute}
                  onChange={(e) => setCurrentMinute(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-traffic-primary
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-webkit-slider-thumb]:transition-transform"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 ${progress}%, #E5E7EB ${progress}%)`
                  }}
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>{formatClockTime(0)}</span>
                  <span>{formatClockTime(Math.floor(maxMinute / 2))}</span>
                  <span>{formatClockTime(maxMinute)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToStart}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Go to start"
                  >
                    <SkipBack className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={stepBackward}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Previous minute"
                  >
                    <Rewind className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-traffic-primary text-white hover:bg-blue-600 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={stepForward}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Next minute"
                  >
                    <FastForward className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={goToEnd}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Go to end"
                  >
                    <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Speed:</span>
                  <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          playbackSpeed === speed
                            ? 'bg-white dark:bg-gray-600 shadow-sm font-medium text-traffic-primary'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {formatClockTime(currentMinute)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Location Info */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-traffic-primary" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Camera Location
              </h3>
            </div>
            {location && (
              <div className="space-y-2 text-sm">
                <p className="text-gray-900 dark:text-white font-medium">
                  {location.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Camera: {location.camera_id}
                </p>
              </div>
            )}
          </div>

          {/* Current Minute Stats */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-traffic-primary" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Current Snapshot
              </h3>
            </div>
            {currentData && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-traffic-primary">
                    {currentData.total}
                  </p>
                  <p className="text-xs text-gray-500">Total Vehicles</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-blue-700 dark:text-blue-300 font-medium">{currentData.cars}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Cars</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="text-amber-700 dark:text-amber-300 font-medium">{currentData.trucks}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Trucks</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-green-700 dark:text-green-300 font-medium">{currentData.buses}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Buses</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="text-purple-700 dark:text-purple-300 font-medium">{currentData.motorcycles}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Motorcycles</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Peak Info */}
          {summary && (
            <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-900 dark:text-red-100">
                  Peak Traffic
                </span>
              </div>
              <p className="text-xs text-red-700 dark:text-red-300">
                Highest density at{' '}
                <span className="font-bold">{formatClockTime(summary.peak_minute)}</span>
                {' '}with{' '}
                <span className="font-bold">{formatNumber(summary.peak_count)}</span>
                {' '}vehicles
              </p>
              <button
                onClick={() => setCurrentMinute(summary.peak_minute)}
                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Jump to peak →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
