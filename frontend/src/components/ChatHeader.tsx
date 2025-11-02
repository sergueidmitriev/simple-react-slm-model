import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import ThemeToggle from './ThemeToggle';
import { StreamingToggle } from './StreamingToggle';
import ConnectionStatus from './ConnectionStatus';
import LanguageToggle from './LanguageToggle';

interface ChatHeaderProps {
  isConnected: boolean;
  isStreaming: boolean;
  onStreamingToggle: () => void;
}

const ChatHeader = ({ isConnected, isStreaming, onStreamingToggle }: ChatHeaderProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
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
        <div className="flex items-center space-x-4">
          <div className="flex flex-col gap-2">
            <ThemeToggle />
            <StreamingToggle 
              isStreaming={isStreaming}
              onToggle={onStreamingToggle}
              disabled={!isConnected}
            />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <ConnectionStatus isConnected={isConnected} />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
