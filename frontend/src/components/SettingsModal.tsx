import { useTranslation } from 'react-i18next';
import { usePreferences } from '../contexts/PreferencesContext';
import { Language } from '../types/language';
import { Theme } from '../types/theme';
import { ResponseMode } from '../types/response';
import { useFormState } from '../hooks/useFormState';
import { validateTemperature, validateTopP, validateTopK, validateModelParameters } from '../utils/validation';
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
  
  // Use custom hook for form state management
  const { formState, updateField, reset } = useFormState(preferences, isOpen);

  const handleSave = () => {
    // Validate and clamp numeric values
    const validated = validateModelParameters({
      temperature: formState.temperature,
      topP: formState.topP,
      topK: formState.topK,
    });

    updatePreferences({
      ...formState,
      ...validated,
    });
    onClose();
  };

  const handleCancel = () => {
    reset();
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
          value={formState.language}
          onChange={(value) => updateField('language', value as Language)}
          options={[
            { value: Language.English, label: t('settings.language.english') },
            { value: Language.French, label: t('settings.language.french') },
          ]}
        />
        
        <SettingRow
          type="select"
          label={t('settings.theme.label')}
          tooltip={t('settings.theme.tooltip')}
          value={formState.theme}
          onChange={(value) => updateField('theme', value as Theme)}
          options={[
            { value: Theme.Modern, label: t('settings.theme.modern') },
            { value: Theme.Terminal, label: t('settings.theme.terminal') },
          ]}
        />
        
        <SettingRow
          type="select"
          label={t('settings.response.label')}
          tooltip={t('settings.response.tooltip')}
          value={formState.streaming ? ResponseMode.Stream : ResponseMode.Complete}
          onChange={(value) => updateField('streaming', value === ResponseMode.Stream)}
          options={[
            { value: ResponseMode.Complete, label: t('settings.response.complete') },
            { value: ResponseMode.Stream, label: t('settings.response.stream') },
          ]}
        />

        {/* Model Parameters Section */}
        <div className="settings-section-header">{t('settings.sections.model')}</div>
        
        <SettingRow
          type="number"
          label={t('settings.model.temperature.label')}
          tooltip={t('settings.model.temperature.tooltip')}
          value={formState.temperature}
          onChange={(value) => updateField('temperature', validateTemperature(value))}
          min={0}
          max={2}
          step={0.1}
        />
        
        <SettingRow
          type="number"
          label={t('settings.model.topP.label')}
          tooltip={t('settings.model.topP.tooltip')}
          value={formState.topP}
          onChange={(value) => updateField('topP', validateTopP(value))}
          min={0.1}
          max={1}
          step={0.05}
        />
        
        <SettingRow
          type="number"
          label={t('settings.model.topK.label')}
          tooltip={t('settings.model.topK.tooltip')}
          value={formState.topK}
          onChange={(value) => updateField('topK', validateTopK(value))}
          min={1}
          max={100}
          step={1}
        />
      </div>
    </Modal>
  );
};

export default SettingsModal;
