import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const tooltipText = isConnected 
    ? t('status.connectedTooltip')
    : t('status.disconnectedTooltip');

  const statusText = isConnected 
    ? (theme === Theme.Terminal ? t('status.onlineTerminal') : t('status.online'))
    : t('status.offline');

  return (
    <div className="status-indicator tooltip-trigger">
      <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
      <span className="text-sm font-medium">
        {statusText}
      </span>
      <div className="tooltip">
        {tooltipText}
      </div>
    </div>
  );
};

export default ConnectionStatus;
