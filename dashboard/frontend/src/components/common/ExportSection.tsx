/**
 * Export Section Component
 */
import { 
  Download, 
  FileText, 
  FileJson, 
  FileSpreadsheet,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { exportApi } from '@/services/api';
import { useTrafficSummary, useCategories } from '@/hooks/useTrafficData';
import { formatNumber } from '@/utils/formatters';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  format: string;
  action: () => void;
}

export default function ExportSection() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: summary } = useTrafficSummary();
  const { data: categories } = useCategories();

  const handleDownload = async (id: string, action: () => void) => {
    setDownloading(id);
    try {
      action();
      setSuccess(id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  const exportOptions: ExportOption[] = [
    {
      id: 'csv',
      label: 'CSV Data Export',
      description: 'Raw traffic count data with timestamps',
      icon: FileSpreadsheet,
      format: '.csv',
      action: exportApi.downloadCsv,
    },
    {
      id: 'json',
      label: 'JSON Report',
      description: 'Complete data with metadata and analytics',
      icon: FileJson,
      format: '.json',
      action: exportApi.downloadJson,
    },
    {
      id: 'report',
      label: 'Analysis Report',
      description: 'Formatted markdown report with insights',
      icon: FileText,
      format: '.md',
      action: exportApi.downloadReport,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Export Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Download traffic analysis data in various formats
        </p>
      </div>

      {/* Export Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary ? formatNumber(summary.duration_minutes * Object.keys(summary.vehicle_categories).length) : '-'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Vehicles</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary ? formatNumber(summary.total_vehicles) : '-'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {categories ? categories.categories.length : '-'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary ? `${summary.duration_minutes} min` : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid gap-4 md:grid-cols-3">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isDownloading = downloading === option.id;
          const isSuccess = success === option.id;

          return (
            <div
              key={option.id}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-traffic-primary/10 rounded-xl">
                  <Icon className="w-6 h-6 text-traffic-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                  <span className="inline-block mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {option.format}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(option.id, option.action)}
                disabled={isDownloading}
                className={`
                  w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
                  font-medium transition-all duration-200
                  ${isSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-traffic-primary text-white hover:bg-blue-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Preparing...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* API Information */}
      <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              API Access Available
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You can also access this data programmatically via our REST API endpoints:
            </p>
            <div className="mt-3 space-y-1 font-mono text-xs text-blue-600 dark:text-blue-400">
              <p>GET /api/export/csv</p>
              <p>GET /api/export/json</p>
              <p>GET /api/traffic/summary</p>
              <p>GET /api/traffic/timeseries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
