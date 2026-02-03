/**
 * Traffic AI Dashboard - Zustand Store
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardSection } from '@/types';

// Theme Store
interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      
      setTheme: (theme) => {
        set({ theme });
        // Apply to document
        const effectiveTheme = theme === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(effectiveTheme);
      },
      
      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'traffic-ai-theme',
    }
  )
);

// Time Range Store
interface TimeRangeStore {
  currentMinute: number;
  startMinute: number;
  endMinute: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setCurrentMinute: (minute: number) => void;
  setRange: (start: number, end: number) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  reset: () => void;
}

export const useTimeRangeStore = create<TimeRangeStore>((set) => ({
  currentMinute: 0,
  startMinute: 0,
  endMinute: 59,
  isPlaying: false,
  playbackSpeed: 1,
  
  setCurrentMinute: (minute) => set({ currentMinute: minute }),
  
  setRange: (start, end) => set({ 
    startMinute: start, 
    endMinute: end,
    currentMinute: start,
  }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  reset: () => set({ currentMinute: 0, isPlaying: false }),
}));

// Dashboard UI Store
interface DashboardStore {
  activeSection: DashboardSection;
  sidebarCollapsed: boolean;
  setActiveSection: (section: DashboardSection) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      activeSection: 'overview',
      sidebarCollapsed: false,
      
      setActiveSection: (section) => set({ activeSection: section }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'traffic-ai-dashboard',
    }
  )
);

// Video Settings Store
interface VideoStore {
  showBoundingBoxes: boolean;
  showCountingLine: boolean;
  isVideoPlaying: boolean;
  toggleBoundingBoxes: () => void;
  toggleCountingLine: () => void;
  setVideoPlaying: (playing: boolean) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  showBoundingBoxes: true,
  showCountingLine: true,
  isVideoPlaying: false,
  
  toggleBoundingBoxes: () => set((state) => ({ 
    showBoundingBoxes: !state.showBoundingBoxes 
  })),
  
  toggleCountingLine: () => set((state) => ({ 
    showCountingLine: !state.showCountingLine 
  })),
  
  setVideoPlaying: (playing) => set({ isVideoPlaying: playing }),
}));
