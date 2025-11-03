import { ReactNode } from 'react';

interface SettingGroupProps {
  label: string;
  children: ReactNode;
  htmlFor?: string;
}

/**
 * Reusable wrapper for settings with label and description
 */
const SettingGroup = ({ label, children, htmlFor }: SettingGroupProps) => {
  return (
    <div className="setting-group">
      <label htmlFor={htmlFor} className="setting-label">
        {label}
      </label>
      <div className="setting-input-wrapper">
        {children}
      </div>
    </div>
  );
};

export default SettingGroup;
