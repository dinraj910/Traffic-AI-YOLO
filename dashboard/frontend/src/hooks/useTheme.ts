/**
 * Custom hook for theme management
 */
import { useEffect } from 'react';
import { useThemeStore } from '@/store';

export function useTheme() {
  const { theme, setTheme, getEffectiveTheme } = useThemeStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
  }, [theme, getEffectiveTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(effectiveTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    effectiveTheme: getEffectiveTheme(),
    isDark: getEffectiveTheme() === 'dark',
  };
}
