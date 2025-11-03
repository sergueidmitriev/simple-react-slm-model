import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Generic modal component with backdrop and centered dialog
 */
const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick} />
      
      <div className="modal-container" onClick={handleBackdropClick}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="modal-close-button"
              aria-label={t('settings.close')}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">{children}</div>

          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </>
  );
};

export default Modal;
