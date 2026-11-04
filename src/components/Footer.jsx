import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { t } from '../data/translations';

export default function Footer({ setCurrentPage, lang, settings = {} }) {
  const isEn = lang === 'en';

  return (
    <footer className="footer" style={{ backgroundColor: '#042f1a', color: '#ffffff', padding: '60px 24px 30px' }}>
      <div className="footer-container footer-grid">
        
        {/* Brand Block */}
        <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="logo" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/logo.jpg" 
              alt="BEVULTA Logo" 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
            />
            <span style={{ fontWeight: '900', fontSize: '1.35rem', letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>BEVULTA</span>
          </div>
          <p style={{ color: '#a7f3d0', fontSize: '0.88rem', lineHeight: '1.5' }}>
            {isEn 
              ? "Bureau of Studies and Dissemination of Appropriate Technology. Designing and manufacturing tailored agricultural and industrial machinery for over 20 years."
              : "Bureau d'Études et de Vulgarisation des Technologies Appropriées. Conception et fabrication de machines agricoles et industrielles adaptées depuis plus de 20 ans."}
          </p>
        </div>

        {/* Navigation Block */}
        <div className="footer-col">
          <h3 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</h3>
          <ul className="footer-links" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>{t('navHome', lang)}</a></li>
            <li><a href="#catalog" onClick={(e) => { e.preventDefault(); setCurrentPage('catalog'); }} style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>{t('navCatalog', lang)}</a></li>
            <li><a href="#ebooks" onClick={(e) => { e.preventDefault(); setCurrentPage('ebooks'); }} style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>{t('navEbooks', lang)}</a></li>
            <li><a href="#track" onClick={(e) => { e.preventDefault(); setCurrentPage('track'); }} style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>{isEn ? 'Track Machine' : 'Suivre ma Machine'}</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); setCurrentPage('services'); }} style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>{isEn ? 'Achievements' : 'Nos Réalisations'}</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }} style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>{t('navAbout', lang)}</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); }} style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>{t('navContact', lang)}</a></li>
          </ul>
        </div>

        {/* Sectors Block */}
        <div className="footer-col">
          <h3 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isEn ? "Sectors of Activity" : "Nos Domaines"}</h3>
          <ul className="footer-links" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, color: '#a7f3d0', fontSize: '0.9rem' }}>
            <li>{isEn ? "Agro-food Processing" : "Agroalimentaire"}</li>
            <li>{isEn ? "Agriculture & Farming" : "Agriculture"}</li>
            <li>{isEn ? "BTP & Construction" : "BTP & Construction"}</li>
            <li>{isEn ? "Wood & Metal Carpentry" : "Menuiserie & Métallurgie"}</li>
            <li>{isEn ? "Renewable Energies" : "Énergies Renouvelables"}</li>
          </ul>
        </div>

        {/* Contact Block */}
        <div className="footer-col">
          <h3 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isEn ? "Contact Us" : "Nous Contacter"}</h3>
          <ul className="footer-links" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, fontSize: '0.9rem', color: '#a7f3d0' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span>{settings?.atelierAddress || (isEn ? "HQ: Agla, Cotonou - Benin" : "Siège : Agla, Cotonou - Bénin")}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span>{settings?.contactPhone1 || "+229 97 67 79 60 / 95 96 27 27"}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span>{settings?.contactEmail || "contact@bevulta.com"}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span>www.bevulta.com</span>
            </li>
          </ul>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '40px auto 20px', maxWidth: '1200px' }} />

      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#a7f3d0' }}>
        <p style={{ flexGrow: 1 }}>&copy; {new Date().getFullYear()} BEVULTA. {isEn ? "All rights reserved. Innovation at the service of transformation." : "Tous droits réservés. L'innovation au service de la transformation."}</p>
        
        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#a7f3d0' }} className="social-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#a7f3d0' }} className="social-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </a>
          <a href={settings?.youtubeUrl || "https://youtube.com"} target="_blank" rel="noreferrer" style={{ color: '#a7f3d0' }} className="social-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#a7f3d0' }} className="social-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
