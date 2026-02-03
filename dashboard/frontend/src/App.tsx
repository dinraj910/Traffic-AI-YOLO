/**
 * Traffic AI Dashboard - Main Application Component
 */
import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useDashboardStore } from '@/store';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import Overview from '@/components/dashboard/Overview';
import VideoSection from '@/components/video/VideoSection';
import AnalyticsSection from '@/components/charts/AnalyticsSection';
import HeatmapSection from '@/components/maps/HeatmapSection';
import ExportSection from '@/components/common/ExportSection';

function App() {
  const { activeSection } = useDashboardStore();
  const { effectiveTheme } = useTheme();

  // Apply theme class on mount
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  // Render active section
  const renderSection = () => {
    switch (activeSection) {
      case 'video':
        return <VideoSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'heatmap':
        return <HeatmapSection />;
      case 'export':
        return <ExportSection />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-traffic-light-bg dark:bg-traffic-dark-bg transition-colors duration-300">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderSection()}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
