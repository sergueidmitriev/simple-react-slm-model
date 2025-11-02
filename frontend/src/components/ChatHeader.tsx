import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import ThemeToggle from './ThemeToggle';
import ConnectionStatus from './ConnectionStatus';
import LanguageToggle from './LanguageToggle';

interface ChatHeaderProps {
  isConnected: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const title = theme === Theme.Terminal ? t('header.titleTerminal') : t('header.title');
  const subtitle = theme === Theme.Terminal ? t('header.subtitleTerminal') : t('header.subtitle');

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
          <LanguageToggle />
          <ThemeToggle />
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
