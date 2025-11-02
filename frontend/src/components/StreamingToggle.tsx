import { useTranslation } from 'react-i18next';
import { usePreferences } from '../contexts/PreferencesContext';

interface StreamingToggleProps {
  disabled?: boolean;
}

/**
 * Toggle button for enabling/disabling streaming mode
 */
export function StreamingToggle({ disabled = false }: StreamingToggleProps) {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = usePreferences();

  const toggleStreaming = () => {
    updatePreferences({ streaming: !preferences.streaming });
  };

  return (
    <div className="toggle-switch-container">
      <span className="toggle-title">{t('chat.streaming.title')}:</span>
      <div className="toggle-switch-wrapper">
        <span className="toggle-label-left">{t('chat.streaming.complete')}</span>
        <button
          type="button"
          onClick={toggleStreaming}
          disabled={disabled}
          className="streaming-toggle-button"
          aria-label={t('chat.streaming.toggle')}
          title={
            preferences.streaming
              ? t('chat.streaming.disableTooltip')
              : t('chat.streaming.enableTooltip')
          }
        >
          <span className={`streaming-toggle-slider ${preferences.streaming ? 'active' : ''}`} />
        </button>
        <span className="toggle-label-right">{t('chat.streaming.streaming')}</span>
      </div>
    </div>
  );
}
