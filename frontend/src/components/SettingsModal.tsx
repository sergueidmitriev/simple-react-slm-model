import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '../contexts/PreferencesContext';
import Modal from './Modal';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';
import StreamingToggleSetting from './StreamingToggleSetting';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Settings modal for managing all user preferences
 */
const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = usePreferences();
  
  // Local state for form inputs
  const [localLanguage, setLocalLanguage] = useState(preferences.language);
  const [localTheme, setLocalTheme] = useState(preferences.theme);
  const [localStreaming, setLocalStreaming] = useState(preferences.streaming);

  // Sync local state with preferences when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalLanguage(preferences.language);
      setLocalTheme(preferences.theme);
      setLocalStreaming(preferences.streaming);
    }
  }, [isOpen, preferences]);

  const handleSave = () => {
    updatePreferences({
      language: localLanguage,
      theme: localTheme,
      streaming: localStreaming,
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset to current preferences
    setLocalLanguage(preferences.language);
    setLocalTheme(preferences.theme);
    setLocalStreaming(preferences.streaming);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t('settings.title')}
      footer={
        <>
          <button onClick={handleCancel} className="modal-button-secondary">
            {t('settings.cancel')}
          </button>
          <button onClick={handleSave} className="modal-button-primary">
            {t('settings.save')}
          </button>
        </>
      }
    >
      <LanguageSelector value={localLanguage} onChange={setLocalLanguage} />
      <ThemeSelector value={localTheme} onChange={setLocalTheme} />
      <StreamingToggleSetting value={localStreaming} onChange={setLocalStreaming} />
    </Modal>
  );
};

export default SettingsModal;
