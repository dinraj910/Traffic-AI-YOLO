/**
 * Dashboard Footer Component
 */
import { Github, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ml-0 lg:ml-64 border-t border-gray-200 dark:border-traffic-dark-border bg-white dark:bg-traffic-dark-card">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} Traffic AI Dashboard.</span>
            <span className="hidden sm:inline">Built with</span>
            <Heart className="w-4 h-4 text-red-500 hidden sm:inline" />
            <span className="hidden sm:inline">for Smart Cities</span>
          </div>

          {/* Center Section - Tech Stack */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              YOLOv8
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              React
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              FastAPI
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              Leaflet
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dinraj910/Traffic-AI-YOLO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-traffic-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
