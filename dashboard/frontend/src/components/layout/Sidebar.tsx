/**
 * Dashboard Sidebar Component
 */
import {
  LayoutDashboard,
  Video,
  BarChart3,
  Map,
  Download,
  ChevronLeft,
  HelpCircle,
  X,
} from 'lucide-react';
import { useDashboardStore } from '@/store';
import type { DashboardSection } from '@/types';

interface NavItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: LayoutDashboard,
    description: 'Dashboard summary'
  },
  { 
    id: 'video', 
    label: 'Video Analytics', 
    icon: Video,
    description: 'Processed video feed'
  },
  { 
    id: 'analytics', 
    label: 'Charts & Analytics', 
    icon: BarChart3,
    description: 'Traffic visualizations'
  },
  { 
    id: 'heatmap', 
    label: 'Traffic Heatmap', 
    icon: Map,
    description: 'GIS visualization'
  },
  { 
    id: 'export', 
    label: 'Export Data', 
    icon: Download,
    description: 'Download reports'
  },
];

export default function Sidebar() {
  const { 
    activeSection, 
    setActiveSection, 
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed 
  } = useDashboardStore();

  return (
    <>
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 
          bg-white dark:bg-traffic-dark-card 
          border-r border-gray-200 dark:border-traffic-dark-border
          transform transition-transform duration-300 ease-in-out z-40
          ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarCollapsed(true);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-traffic-primary/10 text-traffic-primary font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-traffic-primary' : ''}`} />
                  <div className="text-left">
                    <span className="block text-sm">{item.label}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-500">
                      {item.description}
                    </span>
                  </div>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-8 bg-traffic-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-traffic-dark-border">
            <div className="p-4 rounded-xl bg-gradient-to-br from-traffic-primary/10 to-traffic-secondary/10">
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="w-5 h-5 text-traffic-primary" />
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  Need Help?
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Check our documentation for detailed guides.
              </p>
              <a
                href="https://github.com/dinraj910/Traffic-AI-YOLO"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2 px-4 bg-traffic-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Docs
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
