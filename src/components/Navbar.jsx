import React, { useState } from 'react';
import { ShoppingCart, LayoutDashboard, Menu, X, Sun, Moon, Globe, Phone } from 'lucide-react';
import { t } from '../data/translations';

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  cartCount, 
  user, 
  lang, 
  setLang, 
  theme, 
  setTheme 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { id: 'home', label: lang === 'fr' ? 'ACCUEIL' : 'HOME' },
    { id: 'about', label: lang === 'fr' ? 'À PROPOS' : 'ABOUT' },
    { id: 'services', label: lang === 'fr' ? 'NOS RÉALISATIONS' : 'ACHIEVEMENTS' },
    { id: 'formations', label: lang === 'fr' ? 'FORMATIONS' : 'TRAININGS' },
    { id: 'catalog', label: lang === 'fr' ? 'PRODUITS' : 'PRODUCTS' },
    { id: 'ebooks', label: lang === 'fr' ? 'E-BOOKS' : 'E-BOOKS' },
    { id: 'contact', label: lang === 'fr' ? 'CONTACT' : 'CONTACT' },
  ];

  const handleAuthClick = (e) => {
    e.preventDefault();
    if (user) {
      if (user.role === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('client-dashboard');
      }
    } else {
      setCurrentPage('login'); // Redirect to unified login page
    }
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const toggleLang = () => {
    const nextLang = lang === 'fr' ? 'en' : 'fr';
    setLang(nextLang);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a 
          href="#home" 
          className="logo"
          onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setIsMenuOpen(false); }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img 
            src="/logo.jpg" 
            alt="BEVULTA" 
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
          />
        </a>

        {/* Desktop Navigation Menu */}
        <div className="nav-menu">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                if (link.id === 'formations') {
                  setCurrentPage('home');
                  setTimeout(() => {
                    document.getElementById('pillars-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  setCurrentPage(link.id);
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA & Controls Buttons */}
        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Custom sliding theme switch (interrupteur) */}
          <button 
            onClick={toggleTheme} 
            title={theme === 'light' ? (lang === 'fr' ? 'Activer le mode sombre' : 'Switch to dark mode') : (lang === 'fr' ? 'Activer le mode clair' : 'Switch to light mode')}
            style={{
              position: 'relative',
              width: '46px',
              height: '24px',
              borderRadius: '12px',
              backgroundColor: theme === 'light' ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              outline: 'none',
              marginRight: '2px'
            }}
          >
            {/* Faint background icons */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 6px',
              boxSizing: 'border-box',
              pointerEvents: 'none',
              opacity: 0.3
            }}>
              <Sun size={10} color={theme === 'light' ? 'var(--secondary)' : '#ffffff'} />
              <Moon size={10} color={theme === 'light' ? 'var(--secondary)' : '#ffffff'} />
            </div>

            {/* Sliding knob */}
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                transform: theme === 'light' ? 'translateX(0)' : 'translateX(22px)',
                transition: 'transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                color: theme === 'light' ? '#d97706' : '#2563eb'
              }}
            >
              {theme === 'light' ? <Sun size={10} fill="#d97706" color="#d97706" /> : <Moon size={10} fill="#2563eb" color="#2563eb" />}
            </div>
          </button>
          
          {/* Language Switcher with Circular SVG Flags */}
          <button 
            onClick={toggleLang} 
            className="lang-toggle" 
            title={lang === 'fr' ? 'English' : 'Français'}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {lang === 'fr' ? (
              <svg viewBox="0 0 36 36" width="16" height="16" style={{ borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' }}>
                <path d="M0 0h12v36H0z" fill="#002395"/>
                <path d="M12 0h12v36H12z" fill="#fff"/>
                <path d="M24 0h12v36H24z" fill="#ed2939"/>
              </svg>
            ) : (
              <svg viewBox="0 0 36 36" width="16" height="16" style={{ borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' }}>
                <path d="M0 0h36v36H0z" fill="#fff"/>
                <path d="M0 2h36v3H0zm0 6h36v3H0zm0 6h36v3H0zm0 6h36v3H0zm0 6h36v3H0zm0 6h36v3H0z" fill="#b22234"/>
                <path d="M0 0h16v16H0z" fill="#3c3b6e"/>
                <g fill="#fff">
                  <circle cx="3" cy="3" r="0.8"/><circle cx="7" cy="3" r="0.8"/><circle cx="11" cy="3" r="0.8"/><circle cx="15" cy="3" r="0.8"/>
                  <circle cx="5" cy="6" r="0.8"/><circle cx="9" cy="6" r="0.8"/><circle cx="13" cy="6" r="0.8"/>
                  <circle cx="3" cy="9" r="0.8"/><circle cx="7" cy="9" r="0.8"/><circle cx="11" cy="9" r="0.8"/><circle cx="15" cy="9" r="0.8"/>
                  <circle cx="5" cy="12" r="0.8"/><circle cx="9" cy="12" r="0.8"/><circle cx="13" cy="12" r="0.8"/>
                </g>
              </svg>
            )}
            <span style={{ fontSize: '0.74rem', fontWeight: '800' }}>
              {lang === 'fr' ? 'FR' : 'EN'}
            </span>
          </button>

          {/* Devis (Cart) Link - Icon Only */}
          <a
            href="#order"
            className="theme-toggle"
            style={{ position: 'relative' }}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('order');
            }}
            title={lang === 'fr' ? 'Mon Devis' : 'My Quotation'}
          >
            <ShoppingCart size={15} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--accent-orange)',
                color: 'white',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                fontSize: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </a>

          {/* Green Bordered Dashboard Access */}
          <a
            href="#login"
            className="btn-space"
            title={user ? t('navMySpace', lang) : t('navConnect', lang)}
            onClick={handleAuthClick}
          >
            <LayoutDashboard size={13} />
            <span>{lang === 'fr' ? 'Mon espace' : 'My space'}</span>
          </a>
        </div>

        {/* Mobile Menu Hamburger Toggle Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Glassmorphic Navigation Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-nav-menu" style={{ backgroundColor: 'var(--bg-card)' }}>
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`mobile-nav-link ${currentPage === link.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(link.id);
                setIsMenuOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile Theme & Language Controls in Hamburger Menu */}
          <div style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={toggleTheme} 
              className="btn btn-outline" 
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'light' ? (lang === 'fr' ? 'Sombre' : 'Dark') : (lang === 'fr' ? 'Clair' : 'Light')}</span>
            </button>
            <button 
              onClick={toggleLang} 
              className="btn btn-outline"
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <Globe size={18} />
              <span>{lang === 'fr' ? 'English (EN)' : 'Français (FR)'}</span>
            </button>
          </div>

          <div className="mobile-nav-cta">
            <a
              href="#order"
              className="btn btn-outline"
              style={{ position: 'relative', width: '100%' }}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('order');
                setIsMenuOpen(false);
              }}
            >
              <ShoppingCart size={18} />
              <span>{t('navDevis', lang)}</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'var(--accent-orange)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </a>

            <a
              href="#login"
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleAuthClick}
            >
              <LayoutDashboard size={18} />
              <span>{user ? t('navMySpace', lang) : t('navConnect', lang)}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
