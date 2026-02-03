/**
 * Category Bar Chart Component
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CategoryBreakdown } from '@/types';
import { formatNumber } from '@/utils/formatters';

interface CategoryBarChartProps {
  data: CategoryBreakdown[];
  height?: number;
  layout?: 'horizontal' | 'vertical';
}

export default function CategoryBarChart({ 
  data, 
  height = 300,
  layout = 'vertical' 
}: CategoryBarChartProps) {
  if (layout === 'horizontal') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
          />
          <XAxis 
            dataKey="category"
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-gray-500"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-gray-500"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700"
          horizontal={true}
          vertical={false}
        />
        <XAxis 
          type="number"
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-gray-500"
        />
        <YAxis 
          type="category"
          dataKey="category"
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-gray-500"
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
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
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-semibold text-gray-900 dark:text-white">
          {data.category}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-gray-600 dark:text-gray-300">
          Count: <span className="font-medium text-gray-900 dark:text-white">{formatNumber(data.count)}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Share: <span className="font-medium text-gray-900 dark:text-white">{data.percentage}%</span>
        </p>
      </div>
    </div>
  );
}
