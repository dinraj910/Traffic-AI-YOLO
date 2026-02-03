/**
 * Video Analytics Section - Static Video Loading
 */
import { useState, useRef } from 'react';
import { Settings } from 'lucide-react';
import { useTimeSeries, useCategories } from '@/hooks/useTrafficData';
import { useVideoStore } from '@/store';
import { formatNumber } from '@/utils/formatters';

// Static video path - directly from public folder
const VIDEO_PATH = '/traffic_count_output.mp4';

export default function VideoSection() {
  const { data: timeseries } = useTimeSeries();
  const { data: categories } = useCategories();
  const {
    showBoundingBoxes,
    showCountingLine,
    toggleBoundingBoxes,
    toggleCountingLine,
    isVideoPlaying,
    setVideoPlaying,
  } = useVideoStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Video Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          AI-processed video with real-time vehicle detection and tracking
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Player - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden">
            {/* Video Container */}
            <div className="relative aspect-video bg-gray-900">
              <video
                ref={videoRef}
                src={VIDEO_PATH}
                className="w-full h-full object-contain"
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                controls
                loop
              >
                Your browser does not support video playback.
              </video>

              {/* Top Overlay - Info */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-medium">AI Detection Active</span>
                  </div>
                  <span className="text-sm">YOLOv8 + ByteTrack</span>
                </div>
              </div>
            </div>

            {/* Video Controls Panel */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Options:
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBoundingBoxes}
                      onChange={toggleBoundingBoxes}
                      className="rounded border-gray-300 text-traffic-primary focus:ring-traffic-primary"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Bounding Boxes
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCountingLine}
                      onChange={toggleCountingLine}
                      className="rounded border-gray-300 text-traffic-primary focus:ring-traffic-primary"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Counting Line
                    </span>
                  </label>
                </div>
                <span className="text-xs text-gray-500">28.16 MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel - Stats */}
        <div className="space-y-4">
          {/* Detection Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detection Summary
            </h3>

            {/* Total Count */}
            <div className="text-center p-6 bg-traffic-primary/10 rounded-xl mb-4">
              <p className="text-4xl font-bold text-traffic-primary">
                {timeseries ? formatNumber(timeseries.data.reduce((sum, d) => sum + d.total, 0)) : '0'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total Vehicles Detected
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                By Category
              </h4>
              {categories?.categories.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {cat.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(cat.count)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detection Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Detection Info
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Model</span>
                <span className="font-medium text-gray-900 dark:text-white">YOLOv8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tracker</span>
                <span className="font-medium text-gray-900 dark:text-white">ByteTrack</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Duration</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {timeseries?.total_minutes || 0} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Classes</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {categories?.categories.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
