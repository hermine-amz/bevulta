import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { t } from '../data/translations';

export default function Contact({ onSendMessage, lang, showAlert, settings = {} }) {
  const isEn = lang === 'en';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'benin',
    subject: isEn ? "Information request" : "Demande d'information",
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      showAlert(lang === 'fr' 
        ? "Veuillez remplir les champs obligatoires (Nom, Téléphone, Message)." 
        : "Please fill in the required fields (Name, Phone, Message).");
      return;
    }
    
    const ref = 'MSG-' + Date.now().toString().slice(-6);
    setTicketRef(ref);

    // Call props function to store in parent state/localStorage
    onSendMessage({
      id: Date.now(),
      date: new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US'),
      ...formData,
      status: 'unread',
      ticketRef: ref
    });

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      country: 'benin',
      subject: isEn ? "Information request" : "Demande d'information",
      message: ''
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 8000);
  };


  const countries = lang === 'fr' ? [
    { value: 'benin', label: 'Bénin' },
    { value: 'togo', label: 'Togo' },
    { value: 'burkina', label: 'Burkina Faso' },
    { value: 'niger', label: 'Niger' },
    { value: 'cotedivoire', label: 'Côte d\'Ivoire' },
    { value: 'other', label: 'Autre pays' }
  ] : [
    { value: 'benin', label: 'Benin' },
    { value: 'togo', label: 'Togo' },
    { value: 'burkina', label: 'Burkina Faso' },
    { value: 'niger', label: 'Niger' },
    { value: 'cotedivoire', label: 'Ivory Coast' },
    { value: 'other', label: 'Other country' }
  ];

  const subjects = lang === 'fr' ? [
    { value: "Demande d'information", label: "Demande d'information" },
    { value: "Demande de devis spécifique", label: "Demande de devis spécifique" },
    { value: "Service Après-Vente (SAV)", label: "Service Après-Vente (SAV)" },
    { value: "Autre", label: "Autre" }
  ] : [
    { value: "Information request", label: "Information request" },
    { value: "Specific quote request", label: "Specific quote request" },
    { value: "After-Sales Service (SAV)", label: "After-Sales Service (SAV)" },
    { value: "Other", label: "Other" }
  ];

  return (
    <div style={{ padding: '120px 24px 80px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      <div className="section-header">
        <h2>{t('contactTitle', lang)}</h2>
        <p>{t('contactDesc', lang)}</p>
      </div>

      <div className="grid grid-2" style={{ gap: '48px' }}>
        {/* Contact Info and Map */}
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '24px', color: 'var(--secondary)' }}>{t('contactDirectTitle', lang)}</h3>
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', listStyle: 'none' }}>
            <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div className="feature-icon" style={{ flexShrink: 0, width: '40px', height: '40px', marginBottom: 0, backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Phone size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>{t('contactPhones', lang)}</h4>
                <p style={{ color: 'var(--text-secondary)' }}>{settings?.contactPhone1 || '(+229) 97 69 91 78'}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{settings?.contactPhone2 || '(+229) 01 97 45 50 12 (WhatsApp Pro)'}</p>
              </div>
            </li>
            
            <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div className="feature-icon" style={{ flexShrink: 0, width: '40px', height: '40px', marginBottom: 0, backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Mail size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>{t('contactEmail', lang)}</h4>
                <p style={{ color: 'var(--text-secondary)' }}>{settings?.contactEmail || 'bevulta@gmail.com'}</p>
              </div>
            </li>

            <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div className="feature-icon" style={{ flexShrink: 0, width: '40px', height: '40px', marginBottom: 0, backgroundColor: 'var(--accent-cyan-light)', color: 'var(--accent)' }}>
                <MapPin size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>{t('contactAddresses', lang)}</h4>
                <p style={{ color: 'var(--text-secondary)' }}><strong>{t('contactMainAtelier', lang)}</strong> {settings?.atelierAddress || 'C/3474 Agla Von FAN-MILK, Cotonou, Bénin'}</p>
                <p style={{ color: 'var(--text-secondary)' }}><strong>{t('contactMainSiege', lang)}</strong> 10 BP 170 Houéyiho, Cotonou, Bénin</p>
              </div>
            </li>
          </ul>

          {/* Map Mockup (Light technical version) */}
          <div className="glass-panel" style={{
            height: '240px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            {/* Grid pattern mimicking map lines */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            {/* Roads visualization */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
              <line x1="0" y1="110" x2="500" y2="130" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="6" />
              <line x1="220" y1="0" x2="230" y2="300" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="4" />
              <circle cx="225" cy="120" r="14" fill="var(--accent)" opacity="0.3" className="map-pulse" />
              <circle cx="225" cy="120" r="6" fill="var(--accent)" stroke="white" strokeWidth="1.5" />
            </svg>

            <div className="glass-panel" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '20px 24px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(15, 23, 42, 0.08)', boxShadow: 'var(--shadow-md)' }}>
              <MapPin size={24} className="text-accent" style={{ margin: '0 auto 8px' }} />
              <h5 style={{ color: 'var(--secondary)', fontWeight: 800 }}>{t('mapMockTitle', lang)}</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>C/3474 Agla Von FAN-MILK, Cotonou</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '24px', color: 'var(--secondary)' }}>{t('contactFormTitle', lang)}</h3>

          {submitted && (
            <div style={{
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              color: 'var(--primary)',
              marginBottom: '24px',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <CheckCircle size={24} />
                <strong>{t('formSuccessTitle', lang)}</strong>
              </div>
              <p style={{ fontSize: '0.85rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                {t('formSuccessDesc', lang)}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--primary)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {isEn ? 'Your reference number:' : 'Votre numéro de référence :'}
                </span>
                <strong style={{ fontSize: '1rem', letterSpacing: '1px', fontFamily: 'monospace' }}>{ticketRef}</strong>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                {isEn ? 'Keep this reference to track your message in your client dashboard.' : 'Conservez cette référence pour suivre votre message dans votre espace client.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('formFullName', lang)}</label>
              <input
                type="text"
                className="form-input"
                placeholder={isEn ? "Your name" : "Votre nom"}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('formEmail', lang)}</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('formPhone', lang)}</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+229 97..."
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('formCountry', lang)}</label>
                <select
                  className="form-input"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  {countries.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('formSubject', lang)}</label>
                <select
                  className="form-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  {subjects.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('formMessage', lang)}</label>
              <textarea
                className="form-input"
                rows="5"
                placeholder={t('formMessagePlaceholder', lang)}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={18} />
              <span>{t('btnSendMessage', lang)}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
