import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '../types';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-white/10 dark:bg-black/20 backdrop-blur-md p-1 rounded-full border border-white/20 dark:border-white/10 shadow-sm z-50">
      {(['light', 'dark', 'system'] as Theme[]).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`p-2 rounded-full transition-all ${
            theme === t
              ? 'bg-white shadow-md text-gray-900 dark:bg-gray-800 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-black/30'
          }`}
          aria-label={`Set theme to ${t}`}
          title={`Set theme to ${t}`}
        >
          {t === 'light' && <Sun size={18} />}
          {t === 'dark' && <Moon size={18} />}
          {t === 'system' && <Monitor size={18} />}
        </button>
      ))}
    </div>
  );
};
