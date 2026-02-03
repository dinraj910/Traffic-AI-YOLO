/**
 * Vehicle Pie Chart Component
 */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CategoryBreakdown } from '@/types';
import { formatNumber } from '@/utils/formatters';

interface VehiclePieChartProps {
  data: CategoryBreakdown[];
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export default function VehiclePieChart({
  data,
  height = 300,
  showLegend = true,
  innerRadius = 60,
  outerRadius = 100,
}: VehiclePieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="count"
          nameKey="category"
          label={({ percentage }) => `${percentage}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {value}
              </span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

// Custom Tooltip
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload as CategoryBreakdown;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-semibold text-gray-900 dark:text-white">
          {data.category}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Count:</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {formatNumber(data.count)}
        </span>
        <span className="text-gray-500 dark:text-gray-400">Share:</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {data.percentage}%
        </span>
      </div>
    </div>
  );
}
