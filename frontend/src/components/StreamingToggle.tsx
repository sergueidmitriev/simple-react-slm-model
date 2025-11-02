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
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`
        flex items-center justify-center
        px-3 py-2 rounded-lg
        transition-all duration-200
        ${
          isStreaming
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={t('chat.streaming.toggle')}
      title={
        isStreaming
          ? t('chat.streaming.disableTooltip')
          : t('chat.streaming.enableTooltip')
      }
    >
      {/* Streaming icon (waves/signal) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isStreaming ? (
          // Streaming active icon (animated waves)
          <>
            <path d="M3 12h3" />
            <path d="M9 12h3" />
            <path d="M15 12h3" />
            <path d="M21 12h0" />
          </>
        ) : (
          // Streaming inactive icon (pause/static)
          <>
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
          </>
        )}
      </svg>
      <span className="ml-2 text-sm font-medium">
        {isStreaming ? t('chat.streaming.on') : t('chat.streaming.off')}
      </span>
    </button>
  );
};
