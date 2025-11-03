import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import ConnectionStatus from './ConnectionStatus';
import SettingsModal from './SettingsModal';

interface ChatHeaderProps {
  isConnected: boolean;
}

const ChatHeader = ({ isConnected }: ChatHeaderProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Memoize title and subtitle to prevent recalculation
  const title = useMemo(
    () => theme === Theme.Terminal ? t('header.titleTerminal') : t('header.title'),
    [theme, t]
  );

  const subtitle = useMemo(
    () => theme === Theme.Terminal ? t('header.subtitleTerminal') : t('header.subtitle'),
    [theme, t]
  );

  return (
    <div className="chat-header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {title}
          </h1>
          <p className="text-sm mt-1 opacity-90">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionStatus isConnected={isConnected} />
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="settings-button"
            aria-label={t('header.settings')}
          >
            ⚙️
          </button>
        </div>
      </div>
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default ChatHeader;
