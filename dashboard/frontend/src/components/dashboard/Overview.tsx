/**
 * Dashboard Overview Component - Landing Page
 */
import { 
  Car, 
  Truck, 
  Bus, 
  Bike, 
  TrendingUp, 
  Zap, 
  Clock,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useTrafficSummary, useCategories, useTimeSeries, useLocation } from '@/hooks/useTrafficData';
import { formatNumber, getTrafficDensity, getDensityColor } from '@/utils/formatters';
import { PageLoading, LoadingCard } from '@/components/common/LoadingSpinner';
import VehicleLineChart from '@/components/charts/VehicleLineChart';
import CategoryBarChart from '@/components/charts/CategoryBarChart';

export default function Overview() {
  const { data: summary, isLoading: summaryLoading, isError: summaryError } = useTrafficSummary();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: timeseries, isLoading: timeseriesLoading } = useTimeSeries();
  const { data: location } = useLocation();

  if (summaryLoading || categoriesLoading || timeseriesLoading) {
    return <PageLoading />;
  }

  if (summaryError || !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Activity className="w-12 h-12 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
        <p className="text-sm text-gray-400">Make sure the backend server is running</p>
      </div>
    );
  }

  const density = getTrafficDensity(summary.average_per_minute, 50);
  const densityColor = getDensityColor(density);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="card p-8 bg-gradient-to-r from-traffic-primary to-traffic-secondary text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Traffic AI Dashboard
            </h1>
            <p className="text-white/80 max-w-xl">
              Real-time traffic monitoring and analytics powered by YOLOv8 computer vision.
              Replacing manual traffic surveys with intelligent, scalable AI solutions.
            </p>
            {location && (
              <div className="mt-4 flex items-center gap-2 text-white/90">
                <Target className="w-4 h-4" />
                <span className="text-sm">{location.name}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur rounded-2xl">
            <span className="text-5xl font-bold">{formatNumber(summary.total_vehicles)}</span>
            <span className="text-white/80 text-sm mt-1">Total Vehicles Detected</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={<Car className="w-5 h-5" />}
          label="Cars"
          value={formatNumber(summary.total_cars)}
          color="blue"
          trend={summary.total_cars > 0 ? '+' : ''}
        />
        <StatCard
          icon={<Truck className="w-5 h-5" />}
          label="Trucks"
          value={formatNumber(summary.total_trucks)}
          color="amber"
        />
        <StatCard
          icon={<Bus className="w-5 h-5" />}
          label="Buses"
          value={formatNumber(summary.total_buses)}
          color="green"
        />
        <StatCard
          icon={<Bike className="w-5 h-5" />}
          label="Motorcycles"
          value={formatNumber(summary.total_motorcycles)}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg/Minute"
          value={summary.average_per_minute.toFixed(1)}
          color="cyan"
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Peak Count"
          value={formatNumber(summary.peak_count)}
          subtext={`Minute ${summary.peak_minute}`}
          color="red"
        />
      </div>

      {/* Traffic Density Indicator */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Traffic Density
          </h3>
          <span 
            className="px-3 py-1 rounded-full text-sm font-medium capitalize"
            style={{ 
              backgroundColor: `${densityColor}20`,
              color: densityColor 
            }}
          >
            {density}
          </span>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="w-1/4 bg-green-500" />
            <div className="w-1/4 bg-yellow-500" />
            <div className="w-1/4 bg-orange-500" />
            <div className="w-1/4 bg-red-500" />
          </div>
          <div 
            className="absolute top-0 w-2 h-full bg-white shadow-lg rounded-full transform -translate-x-1/2 transition-all duration-500"
            style={{ 
              left: `${Math.min((summary.average_per_minute / 100) * 100, 100)}%` 
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
          <span>Peak</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Traffic Timeline */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Traffic Flow Over Time
          </h3>
          {timeseries && (
            <VehicleLineChart data={timeseries.data} />
          )}
        </div>

        {/* Vehicle Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vehicle Distribution
          </h3>
          {categories && (
            <CategoryBarChart data={categories.categories} />
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <InsightCard
          title="Peak Traffic Time"
          value={`Minute ${summary.peak_minute}`}
          description={`${formatNumber(summary.peak_count)} vehicles detected`}
          icon={<Clock className="w-5 h-5" />}
          trend="up"
        />
        <InsightCard
          title="Most Common Vehicle"
          value="Cars"
          description={`${((summary.total_cars / summary.total_vehicles) * 100).toFixed(1)}% of total traffic`}
          icon={<Car className="w-5 h-5" />}
        />
        <InsightCard
          title="Monitoring Duration"
          value={`${summary.duration_minutes} Minutes`}
          description="Continuous AI-powered analysis"
          icon={<Activity className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color: 'blue' | 'amber' | 'green' | 'purple' | 'cyan' | 'red';
  trend?: string;
}

function StatCard({ icon, label, value, subtext, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="stat-card">
      <div className={`inline-flex p-2.5 rounded-xl mb-3 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  );
}

// Insight Card Component
interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

function InsightCard({ title, value, description, icon, trend }: InsightCardProps) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="p-3 bg-traffic-primary/10 rounded-xl text-traffic-primary">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      {trend && (
        <div className={`p-1 rounded ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? (
            <ArrowUpRight className="w-5 h-5" />
          ) : (
            <ArrowDownRight className="w-5 h-5" />
          )}
        </div>
      )}
    </div>
  );
}
