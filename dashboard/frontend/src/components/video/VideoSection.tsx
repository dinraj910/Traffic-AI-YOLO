/**
 * Video Analytics Section
 */
import { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  Settings,
  Eye,
  EyeOff,
  Video,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useVideoInfo, useTimeSeries, useCategories } from '@/hooks/useTrafficData';
import { useVideoStore } from '@/store';
import { videoApi } from '@/services/api';
import { formatNumber } from '@/utils/formatters';
import { PageLoading } from '@/components/common/LoadingSpinner';

export default function VideoSection() {
  const { data: videoInfo, isLoading, isError, refetch } = useVideoInfo();
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!isVideoPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

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
              {videoInfo?.available ? (
                <video
                  ref={videoRef}
                  src={videoApi.getStreamUrl()}
                  className="w-full h-full object-contain"
                  onPlay={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                  controls={false}
                  loop
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Video className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Video Not Available</p>
                  <p className="text-sm mt-2 text-center max-w-md">
                    {videoInfo?.message || 'The processed video file could not be found.'}
                  </p>
                  {videoInfo?.alternative_videos && videoInfo.alternative_videos.length > 0 && (
                    <div className="mt-4 text-sm">
                      <p className="text-gray-500">Available videos:</p>
                      <ul className="mt-1">
                        {videoInfo.alternative_videos.map((v) => (
                          <li key={v} className="text-traffic-primary">{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Video Overlay - Detection Info */}
              {videoInfo?.available && (
                <>
                  {/* Top Overlay - Info */}
                  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-medium">AI Detection Active</span>
                      </div>
                      <span className="text-sm">
                        YOLOv8 + ByteTrack
                      </span>
                    </div>
                  </div>

                  {/* Bottom Overlay - Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePlayPause}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          {isVideoPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handleFullscreen}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Maximize2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </>
              )}
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
                {videoInfo?.available && (
                  <span className="text-xs text-gray-500">
                    {videoInfo.size_mb?.toFixed(1)} MB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Video Info Alert */}
          {!videoInfo?.available && (
            <div className="card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100">
                    Video File Not Found
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Place your processed video file (traffic_count_output.avi) in the data folder and refresh.
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-2 inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 hover:underline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel - Live Stats */}
        <div className="space-y-4">
          {/* Live Count Panel */}
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
