import { useTranslation } from 'react-i18next';
import SettingGroup from './SettingGroup';

interface StreamingToggleSettingProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
}

/**
 * Streaming toggle for settings modal
 */
const StreamingToggleSetting = ({ value, onChange }: StreamingToggleSettingProps) => {
  const { t } = useTranslation();

  return (
    <SettingGroup
      label={t('settings.streaming.label')}
      htmlFor="streaming-select"
    >
      <select
        id="streaming-select"
        value={value ? 'streaming' : 'complete'}
        onChange={(e) => onChange(e.target.value === 'streaming')}
        className="setting-select"
      >
        <option value="complete">
          {t('settings.streaming.disabled')}
        </option>
        <option value="streaming">
          {t('settings.streaming.enabled')}
        </option>
      </select>
    </SettingGroup>
  );
};

export default StreamingToggleSetting;
