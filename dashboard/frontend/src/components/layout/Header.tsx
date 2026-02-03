/**
 * Dashboard Header Component
 */
import { 
  Menu, 
  Bell, 
  Settings, 
  MapPin,
  Activity
} from 'lucide-react';
import { useDashboardStore } from '@/store';
import { useLocation } from '@/hooks/useTrafficData';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Header() {
  const { toggleSidebar, sidebarCollapsed } = useDashboardStore();
  const { data: location } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-traffic-dark-card border-b border-gray-200 dark:border-traffic-dark-border z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-traffic-primary to-traffic-secondary">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Traffic AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart City Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Location */}
        {location && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MapPin className="w-4 h-4 text-traffic-primary" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {location.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
            </span>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Live Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              Live
            </span>
          </div>

          <ThemeToggle />
          
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
