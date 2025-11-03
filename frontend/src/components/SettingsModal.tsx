import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '../contexts/PreferencesContext';
import { Language } from '../types/language';
import { Theme } from '../types/theme';
import Modal from './Modal';
import SettingRow from './SettingRow';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Settings modal for managing all user preferences in a compact, spreadsheet-style layout
 */
const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = usePreferences();
  
  // Local state for form inputs
  const [localLanguage, setLocalLanguage] = useState(preferences.language);
  const [localTheme, setLocalTheme] = useState(preferences.theme);
  const [localStreaming, setLocalStreaming] = useState(preferences.streaming);
  const [localTemperature, setLocalTemperature] = useState(preferences.temperature);
  const [localTopP, setLocalTopP] = useState(preferences.topP);
  const [localTopK, setLocalTopK] = useState(preferences.topK);

  // Sync local state with preferences when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalLanguage(preferences.language);
      setLocalTheme(preferences.theme);
      setLocalStreaming(preferences.streaming);
      setLocalTemperature(preferences.temperature);
      setLocalTopP(preferences.topP);
      setLocalTopK(preferences.topK);
    }
  }, [isOpen, preferences]);

  const handleSave = () => {
    updatePreferences({
      language: localLanguage,
      theme: localTheme,
      streaming: localStreaming,
      temperature: localTemperature,
      topP: localTopP,
      topK: localTopK,
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset to current preferences
    setLocalLanguage(preferences.language);
    setLocalTheme(preferences.theme);
    setLocalStreaming(preferences.streaming);
    setLocalTemperature(preferences.temperature);
    setLocalTopP(preferences.topP);
    setLocalTopK(preferences.topK);
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
      <div className="settings-table">
        {/* UI Preferences Section */}
        <div className="settings-section-header">{t('settings.sections.ui')}</div>
        
        <SettingRow
          type="select"
          label={t('settings.language.label')}
          value={localLanguage}
          onChange={(value) => setLocalLanguage(value as Language)}
          options={[
            { value: Language.English, label: t('settings.language.english') },
            { value: Language.French, label: t('settings.language.french') },
          ]}
        />
        
        <SettingRow
          type="select"
          label={t('settings.theme.label')}
          value={localTheme}
          onChange={(value) => setLocalTheme(value as Theme)}
          options={[
            { value: Theme.Modern, label: t('settings.theme.modern') },
            { value: Theme.Terminal, label: t('settings.theme.terminal') },
          ]}
        />
        
        <SettingRow
          type="toggle"
          label={t('settings.streaming.label')}
          value={localStreaming}
          onChange={setLocalStreaming}
        />

        {/* Model Parameters Section */}
        <div className="settings-section-header">{t('settings.sections.model')}</div>
        
        <SettingRow
          type="number"
          label={t('settings.model.temperature.label')}
          value={localTemperature}
          onChange={setLocalTemperature}
          min={0}
          max={2}
          step={0.1}
        />
        
        <SettingRow
          type="number"
          label={t('settings.model.topP.label')}
          value={localTopP}
          onChange={setLocalTopP}
          min={0}
          max={1}
          step={0.05}
        />
        
        <SettingRow
          type="number"
          label={t('settings.model.topK.label')}
          value={localTopK}
          onChange={setLocalTopK}
          min={1}
          max={100}
          step={1}
        />
      </div>
    </Modal>
  );
};

export default SettingsModal;
