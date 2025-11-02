import React from 'react';
import { Theme } from '../types';
import { getThemeClasses, cn } from '../utils/themeStyles';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={cn(
        'text-xs',
        getThemeClasses(theme, {
          modern: 'text-white',
          terminal: 'text-green-500 font-mono'
        })
      )}>
        Switch style
      </span>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          getThemeClasses(theme, {
            modern: 'bg-blue-400 focus:ring-blue-500',
            terminal: 'bg-green-600 focus:ring-green-500'
          })
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
            getThemeClasses(theme, {
              modern: 'translate-x-1',
              terminal: 'translate-x-6'
            })
          )}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
