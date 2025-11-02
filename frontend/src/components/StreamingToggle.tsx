import { useTranslation } from 'react-i18next';

interface StreamingToggleProps {
  isStreaming: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * Toggle button for enabling/disabling streaming mode
 */
export const StreamingToggle: React.FC<StreamingToggleProps> = ({
  isStreaming,
  onToggle,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="toggle-switch-container">
      <span className="toggle-title">{t('chat.streaming.title')}:</span>
      <div className="toggle-switch-wrapper">
        <span className="toggle-label-left">{t('chat.streaming.complete')}</span>
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="streaming-toggle-button"
          aria-label={t('chat.streaming.toggle')}
          title={
            isStreaming
              ? t('chat.streaming.disableTooltip')
              : t('chat.streaming.enableTooltip')
          }
        >
          <span className={`streaming-toggle-slider ${isStreaming ? 'active' : ''}`} />
        </button>
        <span className="toggle-label-right">{t('chat.streaming.streaming')}</span>
      </div>
    </div>
  );
};
