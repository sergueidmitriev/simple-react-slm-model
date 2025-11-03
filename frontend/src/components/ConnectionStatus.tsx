import { useThemedTranslation } from '../hooks/useThemedTranslation';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  const { tt } = useThemedTranslation();

  return (
    <div className="status-indicator tooltip-trigger">
      <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
      <span className="text-sm font-medium">
        {isConnected ? tt('status.online') : tt('status.offline')}
      </span>
      <div className="tooltip">
        {isConnected ? tt('status.connectedTooltip') : tt('status.disconnectedTooltip')}
      </div>
    </div>
  );
};

export default ConnectionStatus;
