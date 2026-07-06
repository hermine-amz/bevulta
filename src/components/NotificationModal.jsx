import React from 'react';

const NotificationModal = ({ isOpen, message, type, onClose, onConfirm, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%',
        textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.25rem' }}>
          {type === 'confirm' ? (lang === 'fr' ? 'Confirmation' : 'Confirmation') : (lang === 'fr' ? 'Information' : 'Information')}
        </h3>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {type === 'confirm' && (
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)' }}
            >
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
          )}
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', border: 'none', backgroundColor: 'var(--primary-color)', color: '#fff', fontWeight: 'bold' }}
          >
            {type === 'confirm' ? (lang === 'fr' ? 'Confirmer' : 'Confirm') : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
