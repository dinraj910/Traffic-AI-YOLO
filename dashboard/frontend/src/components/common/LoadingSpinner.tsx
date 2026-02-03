/**
 * Loading Spinner Component
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-2 border-gray-200 dark:border-gray-700
          border-t-traffic-primary
          rounded-full animate-spin
        `}
      />
    </div>
  );
}

/**
 * Loading Card Skeleton
 */
export function LoadingCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Chart Skeleton
 */
export function LoadingChart() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

/**
 * Full Page Loading
 */
export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
    </div>
  );
}
