/**
 * Theme Toggle Component
 */
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light' as const, icon: Sun, label: 'Light' },
    { id: 'dark' as const, icon: Moon, label: 'Dark' },
    { id: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`
            p-2 rounded-md transition-all duration-200
            ${theme === id 
              ? 'bg-white dark:bg-gray-700 shadow-sm text-traffic-primary' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }
          `}
          aria-label={`Switch to ${label} mode`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
