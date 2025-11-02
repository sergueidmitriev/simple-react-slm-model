import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <span className="text-xs">
        Switch style
      </span>
      <button
        type="button"
        onClick={toggleTheme}
        className="theme-toggle-button"
      >
        <span className="theme-toggle-slider" />
      </button>
    </div>
  );
};

export default ThemeToggle;
