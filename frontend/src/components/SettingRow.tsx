import { ReactNode, useState, useRef } from 'react';

type SettingControlType = 'select' | 'number' | 'toggle' | 'custom';

interface BaseSettingRowProps {
  label: string;
  type: SettingControlType;
  tooltip?: string;
}

interface SelectSettingRowProps extends BaseSettingRowProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

interface NumberSettingRowProps extends BaseSettingRowProps {
  type: 'number';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

interface ToggleSettingRowProps extends BaseSettingRowProps {
  type: 'toggle';
  value: boolean;
  onChange: (value: boolean) => void;
}

interface CustomSettingRowProps extends BaseSettingRowProps {
  type: 'custom';
  children: ReactNode;
}

type SettingRowProps = 
  | SelectSettingRowProps 
  | NumberSettingRowProps 
  | ToggleSettingRowProps 
  | CustomSettingRowProps;

/**
 * Compact spreadsheet-style setting row component
 * Renders a two-column layout: Label | Control
 */
const SettingRow = (props: SettingRowProps) => {
  const { label, type, tooltip } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    }
    setShowTooltip(true);
  };

  const renderControl = () => {
    switch (type) {
      case 'select': {
        const { value, onChange, options } = props as SelectSettingRowProps;
        return (
          <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="setting-control setting-select"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      case 'number': {
        const { value, onChange, min, max, step } = props as NumberSettingRowProps;
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="setting-control setting-number"
          />
        );
      }

      case 'toggle': {
        const { value, onChange } = props as ToggleSettingRowProps;
        return (
          <label className="setting-control setting-toggle">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              className="setting-toggle-input"
            />
            <span className="setting-toggle-slider"></span>
          </label>
        );
      }

      case 'custom': {
        const { children } = props as CustomSettingRowProps;
        return <div className="setting-control">{children}</div>;
      }

      default:
        return null;
    }
  };

  return (
    <div className="setting-row">
      <div className="setting-row-label">
        {label}
        {tooltip && (
          <>
            <button
              ref={iconRef}
              className="setting-info-icon"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => e.preventDefault()}
              type="button"
            >
              ⓘ
            </button>
            {showTooltip && (
              <div 
                className="setting-tooltip setting-tooltip-fixed"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                }}
              >
                {tooltip}
              </div>
            )}
          </>
        )}
      </div>
      <div className="setting-row-control">{renderControl()}</div>
    </div>
  );
};

export default SettingRow;
