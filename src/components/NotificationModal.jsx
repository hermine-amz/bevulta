import React, { useEffect } from 'react';
import { AlertTriangle, HelpCircle, Info, ShieldAlert, Check } from 'lucide-react';

const NotificationModal = ({ isOpen, message, type, onClose, onConfirm, lang = 'fr' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEn = lang === 'en';
  const isDelete = typeof message === 'string' && (
    message.toLowerCase().includes('supprim') || 
    message.toLowerCase().includes('delet') ||
    message.toLowerCase().includes('vider') ||
    message.toLowerCase().includes('retirer') ||
    message.toLowerCase().includes('remove')
  );

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        padding: '20px',
        animation: 'fadeIn 0.15s ease'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          padding: '28px 24px',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeIn 0.2s ease-out',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Icon Badge */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isDelete ? '#fee2e2' : '#f0fdf4',
          color: isDelete ? '#dc2626' : '#166534',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          {isDelete ? <AlertTriangle size={28} /> : type === 'confirm' ? <HelpCircle size={28} /> : <Info size={28} />}
        </div>

        <h3 style={{ marginBottom: '8px', color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
          {type === 'confirm' 
            ? (isDelete 
                ? (isEn ? 'Confirmation of deletion' : 'Confirmation de suppression') 
                : (isEn ? 'Confirm Action' : 'Confirmer la modification'))
            : (isEn ? 'Notice' : 'Information')}
        </h3>

        <p style={{ marginBottom: '24px', color: '#475569', fontSize: '0.92rem', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {type === 'confirm' && (
            <button 
              type="button"
              className="btn btn-secondary" 
              onClick={onClose}
              style={{
                flex: 1,
                padding: '11px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.15s'
              }}
            >
              {isEn ? 'Cancel' : 'Annuler'}
            </button>
          )}

          <button 
            type="button"
            className="btn btn-primary" 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '11px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: isDelete ? '#dc2626' : '#16a34a',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              boxShadow: isDelete ? '0 4px 12px rgba(220, 38, 38, 0.25)' : '0 4px 12px rgba(22, 163, 74, 0.25)',
              transition: 'all 0.15s'
            }}
          >
            {type === 'confirm' 
              ? (isDelete ? (isEn ? 'Yes, Delete' : 'Oui, Supprimer') : (isEn ? 'Yes, Confirm' : 'Confirmer'))
              : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
