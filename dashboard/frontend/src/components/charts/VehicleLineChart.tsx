/**
 * Vehicle Line Chart Component
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TimeSeriesPoint } from '@/types';
import { CHART_COLORS } from '@/utils/constants';
import { formatClockTime } from '@/utils/formatters';

interface VehicleLineChartProps {
  data: TimeSeriesPoint[];
  height?: number;
  showLegend?: boolean;
}

export default function VehicleLineChart({ 
  data, 
  height = 300,
  showLegend = true 
}: VehicleLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
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
        <Tooltip 
          content={<CustomTooltip />}
          cursor={{ stroke: 'rgba(59, 130, 246, 0.3)' }}
        />
        {showLegend && (
          <Legend 
            wrapperStyle={{ fontSize: 12 }}
            iconType="circle"
          />
        )}
        <Line
          type="monotone"
          dataKey="total"
          stroke={CHART_COLORS.total}
          strokeWidth={2}
          dot={false}
          name="Total"
        />
        <Line
          type="monotone"
          dataKey="cars"
          stroke={CHART_COLORS.car}
          strokeWidth={2}
          dot={false}
          name="Cars"
        />
        <Line
          type="monotone"
          dataKey="trucks"
          stroke={CHART_COLORS.truck}
          strokeWidth={2}
          dot={false}
          name="Trucks"
        />
        <Line
          type="monotone"
          dataKey="buses"
          stroke={CHART_COLORS.bus}
          strokeWidth={2}
          dot={false}
          name="Buses"
        />
        <Line
          type="monotone"
          dataKey="motorcycles"
          stroke={CHART_COLORS.motorcycle}
          strokeWidth={2}
          dot={false}
          name="Motorcycles"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Custom Tooltip Component
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">
        Minute {label} ({formatClockTime(label)})
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
