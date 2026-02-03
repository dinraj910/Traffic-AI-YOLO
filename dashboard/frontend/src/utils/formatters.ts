/**
 * Traffic AI Dashboard - Utility Functions
 */

// Format large numbers with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Format percentage
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Format time in minutes to readable format
export function formatMinute(minute: number): string {
  const hours = Math.floor(minute / 60);
  const mins = minute % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Format time as clock time (assuming start at 8:00 AM)
export function formatClockTime(minute: number, startHour = 8): string {
  const totalMinutes = startHour * 60 + minute;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

// Get traffic density level
export function getTrafficDensity(
  count: number, 
  average: number
): 'low' | 'moderate' | 'high' | 'peak' {
  const ratio = count / average;
  if (ratio < 0.5) return 'low';
  if (ratio < 1.0) return 'moderate';
  if (ratio < 1.5) return 'high';
  return 'peak';
}

// Get color for traffic density
export function getDensityColor(density: 'low' | 'moderate' | 'high' | 'peak'): string {
  const colors = {
    low: '#10B981',      // Green
    moderate: '#F59E0B', // Amber
    high: '#F97316',     // Orange
    peak: '#EF4444',     // Red
  };
  return colors[density];
}

// Vehicle type icons mapping
export const vehicleIcons: Record<string, string> = {
  car: '🚗',
  truck: '🚚',
  bus: '🚌',
  motorcycle: '🏍️',
  bicycle: '🚲',
  other: '🚙',
};

// Get vehicle icon
export function getVehicleIcon(type: string): string {
  return vehicleIcons[type.toLowerCase()] || '🚙';
}

// Calculate percentage change
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Classname merger (tw-merge alternative)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Download file helper
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate chart colors
export function generateChartColors(count: number): string[] {
  const baseColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#84CC16', // Lime
  ];
  
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}
