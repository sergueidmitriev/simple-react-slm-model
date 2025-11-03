import { useState } from 'react';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import ConnectionStatus from './ConnectionStatus';
import SettingsModal from './SettingsModal';

interface ChatHeaderProps {
  isConnected: boolean;
}

const ChatHeader = ({ isConnected }: ChatHeaderProps) => {
  const { tt } = useThemedTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="chat-header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {tt('header.title')}
          </h1>
          <p className="text-sm mt-1 opacity-90">
            {tt('header.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionStatus isConnected={isConnected} />
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="settings-button"
            aria-label={tt('header.settings')}
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
