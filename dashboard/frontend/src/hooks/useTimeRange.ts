/**
 * Custom hook for time range management with playback
 */
import { useEffect, useRef, useCallback } from 'react';
import { useTimeRangeStore } from '@/store';

export function useTimeRange(maxMinute = 59) {
  const {
    currentMinute,
    startMinute,
    endMinute,
    isPlaying,
    playbackSpeed,
    setCurrentMinute,
    setRange,
    togglePlay,
    setPlaybackSpeed,
    reset,
  } = useTimeRangeStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentMinute(
          useTimeRangeStore.getState().currentMinute >= endMinute
            ? startMinute
            : useTimeRangeStore.getState().currentMinute + 1
        );
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, startMinute, endMinute, setCurrentMinute]);

  // Initialize range based on max minute
  useEffect(() => {
    setRange(0, maxMinute);
  }, [maxMinute, setRange]);

  const stepForward = useCallback(() => {
    setCurrentMinute(Math.min(currentMinute + 1, endMinute));
  }, [currentMinute, endMinute, setCurrentMinute]);

  const stepBackward = useCallback(() => {
    setCurrentMinute(Math.max(currentMinute - 1, startMinute));
  }, [currentMinute, startMinute, setCurrentMinute]);

  const goToStart = useCallback(() => {
    setCurrentMinute(startMinute);
  }, [startMinute, setCurrentMinute]);

  const goToEnd = useCallback(() => {
    setCurrentMinute(endMinute);
  }, [endMinute, setCurrentMinute]);

  return {
    currentMinute,
    startMinute,
    endMinute,
    isPlaying,
    playbackSpeed,
    setCurrentMinute,
    setRange,
    togglePlay,
    setPlaybackSpeed,
    reset,
    stepForward,
    stepBackward,
    goToStart,
    goToEnd,
    progress: ((currentMinute - startMinute) / (endMinute - startMinute)) * 100,
  };
}
