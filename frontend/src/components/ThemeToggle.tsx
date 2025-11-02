import React from 'react';
import { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-xs ${
        theme === Theme.Terminal ? 'text-green-500 font-mono' : 'text-white'
      }`}>
        Switch style
      </span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          theme === Theme.Terminal
            ? 'bg-green-600 focus:ring-green-500'
            : 'bg-blue-400 focus:ring-blue-500'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            theme === Theme.Terminal ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
