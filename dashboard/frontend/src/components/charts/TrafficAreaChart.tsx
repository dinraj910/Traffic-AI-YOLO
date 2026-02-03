/**
 * Traffic Area Chart Component
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TimeSeriesPoint } from '@/types';
import { formatClockTime } from '@/utils/formatters';

interface TrafficAreaChartProps {
  data: TimeSeriesPoint[];
  height?: number;
  highlightMinute?: number;
}

export default function TrafficAreaChart({ 
  data, 
  height = 300,
  highlightMinute
}: TrafficAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorCars" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700"
        />
        <XAxis 
          dataKey="minute"
          tickFormatter={(minute) => `${minute}m`}
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-gray-500"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-gray-500"
        />
        <Tooltip content={<CustomTooltip highlightMinute={highlightMinute} />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#3B82F6"
          fillOpacity={1}
          fill="url(#colorTotal)"
          strokeWidth={2}
          name="Total Vehicles"
        />
        <Area
          type="monotone"
          dataKey="cars"
          stroke="#10B981"
          fillOpacity={1}
          fill="url(#colorCars)"
          strokeWidth={2}
          name="Cars"
        />
        {/* Highlight line for current time */}
        {highlightMinute !== undefined && (
          <rect
            x={`${(highlightMinute / (data.length || 1)) * 100}%`}
            y={0}
            width={2}
            height="100%"
            fill="#EF4444"
            opacity={0.7}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Custom Tooltip
function CustomTooltip({ active, payload, label, highlightMinute }: any) {
  if (!active || !payload) return null;

  const isHighlighted = label === highlightMinute;

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border ${
      isHighlighted 
        ? 'border-red-400 dark:border-red-500' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <p className="font-semibold text-gray-900 dark:text-white mb-2">
        {formatClockTime(label)}
        {isHighlighted && (
          <span className="ml-2 text-xs text-red-500">Current</span>
        )}
      </p>
      <div className="space-y-1">
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.name}
              </span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
