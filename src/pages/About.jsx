import React from 'react';
import { Target, Users, Landmark, Award } from 'lucide-react';
import { t } from '../data/translations';

export default function About({ lang }) {
  return (
    <div style={{ padding: '120px 24px 80px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      <div className="section-header">
        <span className="badge badge-agro" style={{ marginBottom: '16px' }}>{t('aboutBadge', lang)}</span>
        <h2>{t('aboutTitle', lang)}</h2>
        <p>{t('aboutDesc', lang)}</p>
      </div>

      {/* History and Director Intro */}
      <div className="grid grid-2" style={{ alignItems: 'center', marginBottom: '64px' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--secondary)' }}>
            {t('aboutHistoryTitle', lang)}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '1.05rem' }}>
            {t('aboutText1', lang)}
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.05rem' }}>
            {t('aboutText2', lang)}
          </p>
          <div className="about-inner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', borderLeft: '3px solid var(--primary)', backgroundColor: 'var(--bg-surface)' }}>
              <h5 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t('aboutAtelier', lang)}</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>C/3474 Agla Von FAN-MILK, Cotonou, Bénin</p>
            </div>
            <div style={{ padding: '16px', borderLeft: '3px solid var(--accent)', backgroundColor: 'var(--bg-surface)' }}>
              <h5 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t('aboutSiege', lang)}</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>10 BP 170 Houéyiho, Cotonou, Bénin</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass-panel director-card">

            <img 
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600" 
              alt={t('directorName', lang)} 
              style={{ borderRadius: 'var(--radius-sm)', width: '100%', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
            />
            <h4 style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>{t('directorName', lang)}</h4>
            <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>{t('directorRole', lang)}</p>
            <blockquote style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              "{t('directorQuote', lang)}"
            </blockquote>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px' }}>
        <h3 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '40px' }}>{t('pillarsTitle', lang)}</h3>
        
        <div className="grid grid-4">
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <div className="feature-icon" style={{ margin: '0 auto 20px' }}><Target size={24} /></div>
            <h4>{t('pillar1Title', lang)}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {t('pillar1Desc', lang)}
            </p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <div className="feature-icon" style={{ margin: '0 auto 20px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}><Landmark size={24} /></div>
            <h4>{t('pillar2Title', lang)}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {t('pillar2Desc', lang)}
            </p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <div className="feature-icon" style={{ margin: '0 auto 20px' }}><Users size={24} /></div>
            <h4>{t('pillar3Title', lang)}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {t('pillar3Desc', lang)}
            </p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <div className="feature-icon" style={{ margin: '0 auto 20px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}><Award size={24} /></div>
            <h4>{t('pillar4Title', lang)}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {t('pillar4Desc', lang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
