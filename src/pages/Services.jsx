import React from 'react';
import { Truck, CreditCard, ShieldCheck, Wrench, RefreshCw, Clock } from 'lucide-react';
import { t } from '../data/translations';

export default function Services({ lang }) {
  const steps = [
    {
      icon: <CreditCard size={28} />,
      title: t('step1Title', lang),
      desc: t('step1Desc', lang)
    },
    {
      icon: <Clock size={28} />,
      title: t('step2Title', lang),
      desc: t('step2Desc', lang)
    },
    {
      icon: <Truck size={28} />,
      title: t('step3Title', lang),
      desc: t('step3Desc', lang)
    }
  ];

  return (
    <div style={{ padding: '120px 24px 80px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      <div className="section-header">
        <span className="badge badge-agro" style={{ marginBottom: '16px' }}>{t('servicesBadge', lang)}</span>
        <h2>{t('servicesTitle', lang)}</h2>
        <p>{t('servicesDesc', lang)}</p>
      </div>

      {/* Steps layout */}
      <div className="grid grid-3" style={{ marginBottom: '64px' }}>
        {steps.map((step, idx) => (
          <div key={idx} className="feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="feature-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              {step.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{step.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flexGrow: 1 }}>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* SAV Spotlight Card */}
      <div className="glass-panel sav-spotlight-card">

        <div>
          <span className="badge badge-agro" style={{ backgroundColor: 'var(--primary)', color: 'white', marginBottom: '16px' }}>
            {t('savBadge', lang)}
          </span>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--secondary)' }}>{t('savTitle', lang)}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.05rem' }}>
            {t('savDesc', lang)}
          </p>
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ShieldCheck size={24} className="text-accent" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--secondary)' }}>{t('savPoint1Title', lang)}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('savPoint1Desc', lang)}</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Wrench size={24} className="text-accent" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--secondary)' }}>{t('savPoint2Title', lang)}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('savPoint2Desc', lang)}</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <RefreshCw size={24} className="text-accent" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--secondary)' }}>{t('savPoint3Title', lang)}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('savPoint3Desc', lang)}</p>
              </div>
            </li>
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-cyan-glow) 0%, transparent 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Wrench size={80} className="text-accent" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>{t('supportTitle', lang)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('supportDesc', lang)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
