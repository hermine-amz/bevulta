import React, { useState, useEffect } from 'react';
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
  const isEn = lang === 'en';

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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
      setCurrentPage('login');
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
        {/* Brand Logo */}
        <a 
          href="#home" 
          className="logo"
          onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setIsMenuOpen(false); }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img 
            src="/logo.jpg" 
            alt="BEVULTA" 
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
          />
        </a>

        {/* Desktop Navigation Menu (hidden on screens <= 1220px) */}
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

        {/* Desktop Controls (hidden on screens <= 1220px) */}
        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme switch toggle */}
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
          
          {/* Language Switcher */}
          <button 
            onClick={toggleLang} 
            className="lang-toggle" 
            title={lang === 'fr' ? 'English' : 'Français'}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: '800' }}>
              {lang === 'fr' ? 'FR' : 'EN'}
            </span>
          </button>

          {/* Cart Icon */}
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
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--accent-orange, #ea580c)',
                color: 'white',
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                fontSize: '0.62rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </a>

          {/* Mon Espace Link */}
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

        {/* Mobile Quick Action Buttons (ALWAYS visible on Mobile & Tablet <= 1220px) */}
        <div className="mobile-quick-bar">
          {/* Always accessible Cart Icon with Badge on mobile */}
          <a
            href="#order"
            className="mobile-quick-btn"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('order');
              setIsMenuOpen(false);
            }}
            title={lang === 'fr' ? 'Mon Devis' : 'My Quotation'}
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="mobile-cart-badge">
                {cartCount}
              </span>
            )}
          </a>

          {/* Language toggle on mobile */}
          <button
            type="button"
            onClick={toggleLang}
            className="mobile-quick-btn"
            title={lang === 'fr' ? 'Passer en Anglais' : 'Switch to French'}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              {lang === 'fr' ? 'FR' : 'EN'}
            </span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button 
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Zero Button Clipping, Responsive & Touch-friendly) */}
      {isMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="mobile-nav-drawer" 
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.jpg" alt="BEVULTA" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--secondary)' }}>BEVULTA</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Machines Agricoles & E-books</div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsMenuOpen(false)}
                className="mobile-drawer-close"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links List */}
            <div className="mobile-drawer-links">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`mobile-nav-link ${currentPage === link.id ? 'active' : ''}`}
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
                    setIsMenuOpen(false);
                  }}
                >
                  <span>{link.label}</span>
                  {link.id === 'ebooks' && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      background: 'linear-gradient(135deg, #d97706, #b45309)', 
                      color: '#ffffff', 
                      padding: '2px 8px', 
                      borderRadius: '10px', 
                      fontWeight: 800,
                      marginLeft: 'auto'
                    }}>
                      {isEn ? "NEW" : "NOUVEAU"}
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Mobile Drawer Footer with Full Actions */}
            <div className="mobile-drawer-footer">
              {/* Theme & Language row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button 
                  type="button"
                  onClick={toggleTheme} 
                  className="btn btn-outline" 
                  style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  <span>{theme === 'light' ? (lang === 'fr' ? 'Sombre' : 'Dark') : (lang === 'fr' ? 'Clair' : 'Light')}</span>
                </button>
                <button 
                  type="button"
                  onClick={toggleLang} 
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                >
                  <Globe size={16} />
                  <span>{lang === 'fr' ? 'English (EN)' : 'Français (FR)'}</span>
                </button>
              </div>

              {/* Mon Devis Main Button */}
              <a
                href="#order"
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 16px' }}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('order');
                  setIsMenuOpen(false);
                }}
              >
                <ShoppingCart size={18} />
                <span style={{ fontWeight: 700 }}>
                  {lang === 'fr' ? `Accéder à mon Devis (${cartCount})` : `View Quotation (${cartCount})`}
                </span>
              </a>

              {/* Mon Espace Button */}
              <a
                href="#login"
                className="btn btn-outline"
                style={{ width: '100%', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 16px' }}
                onClick={handleAuthClick}
              >
                <LayoutDashboard size={18} />
                <span style={{ fontWeight: 700 }}>
                  {user ? t('navMySpace', lang) : t('navConnect', lang)}
                </span>
              </a>

              {/* Direct WhatsApp hotline */}
              <a
                href="https://wa.me/22997699178?text=Bonjour%20BEVULTA,%20je%20souhaite%20des%20informations"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  color: '#166534',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Phone size={14} />
                <span>Atelier WhatsApp : (+229) 97 69 91 78</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
