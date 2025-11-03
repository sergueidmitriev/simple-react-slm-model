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
    // Validate and clamp numeric values
    const validatedTemperature = Math.max(0, Math.min(2, localTemperature));
    const validatedTopP = Math.max(0.1, Math.min(1, localTopP));
    const validatedTopK = Math.max(1, Math.min(100, Math.round(localTopK)));

    updatePreferences({
      language: localLanguage,
      theme: localTheme,
      streaming: localStreaming,
      temperature: validatedTemperature,
      topP: validatedTopP,
      topK: validatedTopK,
    });
    onClose();
  };

  const handleTemperatureChange = (value: number) => {
    // Clamp between 0 and 2
    if (!isNaN(value)) {
      setLocalTemperature(Math.max(0, Math.min(2, value)));
    }
  };

  const handleTopPChange = (value: number) => {
    // Clamp between 0.1 and 1 (avoid 0 which breaks sampling)
    if (!isNaN(value)) {
      setLocalTopP(Math.max(0.1, Math.min(1, value)));
    }
  };

  const handleTopKChange = (value: number) => {
    // Clamp between 1 and 100, round to integer
    if (!isNaN(value)) {
      setLocalTopK(Math.max(1, Math.min(100, Math.round(value))));
    }
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
          tooltip={t('settings.language.tooltip')}
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
          tooltip={t('settings.theme.tooltip')}
          value={localTheme}
          onChange={(value) => setLocalTheme(value as Theme)}
          options={[
            { value: Theme.Modern, label: t('settings.theme.modern') },
            { value: Theme.Terminal, label: t('settings.theme.terminal') },
          ]}
        />
        
        <SettingRow
          type="select"
          label={t('settings.response.label')}
          tooltip={t('settings.response.tooltip')}
          value={localStreaming ? 'stream' : 'complete'}
          onChange={(value) => setLocalStreaming(value === 'stream')}
          options={[
            { value: 'complete', label: t('settings.response.complete') },
            { value: 'stream', label: t('settings.response.stream') },
          ]}
        />

        {/* Model Parameters Section */}
        <div className="settings-section-header">{t('settings.sections.model')}</div>
        
        <SettingRow
          type="number"
          label={t('settings.model.temperature.label')}
          tooltip={t('settings.model.temperature.tooltip')}
          value={localTemperature}
          onChange={handleTemperatureChange}
          min={0}
          max={2}
          step={0.1}
        />
        
        <SettingRow
          type="number"
          label={t('settings.model.topP.label')}
          tooltip={t('settings.model.topP.tooltip')}
          value={localTopP}
          onChange={handleTopPChange}
          min={0.1}
          max={1}
          step={0.05}
        />
        
        <SettingRow
          type="number"
          label={t('settings.model.topK.label')}
          tooltip={t('settings.model.topK.tooltip')}
          value={localTopK}
          onChange={handleTopKChange}
          min={1}
          max={100}
          step={1}
        />
      </div>
    </Modal>
  );
};

export default SettingsModal;
