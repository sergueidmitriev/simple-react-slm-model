import { ReactNode } from 'react';

type SettingControlType = 'select' | 'number' | 'toggle' | 'custom';

interface BaseSettingRowProps {
  label: string;
  type: SettingControlType;
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
  const { label, type } = props;

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
      <div className="setting-row-label">{label}</div>
      <div className="setting-row-control">{renderControl()}</div>
    </div>
  );
};

export default SettingRow;
