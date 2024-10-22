import React, { useEffect } from 'react';
import './Modal.css';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true 
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal modal--${size}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          {showCloseButton && (
            <button className="modal__close" onClick={onClose}>
              ×
            </button>
          )}
        </div>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};
