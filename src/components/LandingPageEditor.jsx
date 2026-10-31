import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  RotateCcw, 
  Layout, 
  Type, 
  Phone, 
  Sliders, 
  Sparkles, 
  CheckCircle,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { defaultSettings } from '../data/defaultSettings';

const YoutubeIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill={color} />
  </svg>
);

export default function LandingPageEditor({ 
  settings, 
  updateSettings, 
  lang, 
  showAlert, 
  showConfirm,
  goHome 
}) {
  const [formData, setFormData] = useState({
    ...defaultSettings,
    ...(settings || {})
  });
  const [activeSubTab, setActiveSubTab] = useState('hero'); // 'hero' | 'stats' | 'contact' | 'sections'
  const [isSaving, setIsSaving] = useState(false);

  const isEn = lang === 'en';

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      showAlert(isEn ? "Landing page updated successfully!" : "Page d'accueil mise à jour avec succès !");
    } catch (err) {
      console.error("Save error:", err);
      showAlert(isEn ? "Failed to save settings." : "Erreur lors de l'enregistrement des modifications.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    showConfirm(
      isEn ? "Reset all landing page content to default values?" : "Réinitialiser tous les contenus de la landing page aux valeurs par défaut ?",
      () => {
        setFormData(defaultSettings);
        updateSettings(defaultSettings);
        showAlert(isEn ? "Reset to defaults." : "Contenus réinitialisés aux valeurs par défaut.");
      }
    );
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Banner / Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f0fdf4',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layout size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEn ? "Landing Page Customizer" : "Personnalisation de la Landing Page"}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                {isEn 
                  ? "Modify texts, key stats, contact info, and visible sections on your public site." 
                  : "Modifiez en direct les textes, les chiffres clés, les coordonnées et les sections de votre vitrine."}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title={isEn ? "Reset to initial defaults" : "Rétablir les valeurs par défaut"}
          >
            <RotateCcw size={15} />
            <span>{isEn ? "Reset Defaults" : "Réinitialiser"}</span>
          </button>

          <button
            type="button"
            onClick={goHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#0f172a',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Eye size={15} />
            <span>{isEn ? "View Live Site" : "Voir le site en direct"}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#166534',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(22, 101, 52, 0.2)'
            }}
          >
            <Save size={16} />
            <span>{isSaving ? (isEn ? "Saving..." : "Enregistrement...") : (isEn ? "Save Changes" : "Enregistrer")}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '8px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveSubTab('hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeSubTab === 'hero' ? '#f1f5f9' : 'transparent',
            color: activeSubTab === 'hero' ? '#0f172a' : '#64748b',
            fontWeight: activeSubTab === 'hero' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Type size={16} />
          <span>{isEn ? "Hero & Titles" : "Bannière & Titres"}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stats')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeSubTab === 'stats' ? '#f1f5f9' : 'transparent',
            color: activeSubTab === 'stats' ? '#0f172a' : '#64748b',
            fontWeight: activeSubTab === 'stats' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={16} />
          <span>{isEn ? "Key Stats (Green Ribbon)" : "Chiffres Clés (Ruban)"}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeSubTab === 'contact' ? '#f1f5f9' : 'transparent',
            color: activeSubTab === 'contact' ? '#0f172a' : '#64748b',
            fontWeight: activeSubTab === 'contact' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Phone size={16} />
          <span>{isEn ? "Contact & Social Hub" : "Coordonnées & Réseaux"}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sections')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeSubTab === 'sections' ? '#f1f5f9' : 'transparent',
            color: activeSubTab === 'sections' ? '#0f172a' : '#64748b',
            fontWeight: activeSubTab === 'sections' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Sliders size={16} />
          <span>{isEn ? "Section Toggles" : "Sections Actives (ON/OFF)"}</span>
        </button>
      </div>

      {/* SUB-TAB 1: HERO & TITLES */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          
          {/* Announcement Bar Settings */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {isEn ? "Top Announcement Bar" : "Bandeau d'Annonce Supérieur"}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  {isEn ? "Displays a highlighted message or promo at the top of the landing page." : "Affiche un message défilant ou une offre spéciale au sommet de votre site."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('showHeroAnnouncement')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: 'none',
                  background: formData.showHeroAnnouncement ? '#dcfce7' : '#f1f5f9',
                  color: formData.showHeroAnnouncement ? '#166534' : '#64748b',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {formData.showHeroAnnouncement ? (
                  <>
                    <CheckCircle size={14} />
                    <span>{isEn ? "Active" : "Activé"}</span>
                  </>
                ) : (
                  <span>{isEn ? "Hidden" : "Masqué"}</span>
                )}
              </button>
            </div>

            {formData.showHeroAnnouncement && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "Announcement Text" : "Texte du message d'annonce"}
                </label>
                <input
                  type="text"
                  value={formData.heroAnnouncement || ''}
                  onChange={(e) => handleChange('heroAnnouncement', e.target.value)}
                  placeholder="🚀 Nouveauté : Découvrez notre gamme de mini-usines..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Main Hero Elements */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
              {isEn ? "Hero Section Content" : "Contenu de la Bannière Principale (Hero)"}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "Store / Company Name" : "Nom de la Marque / Atelier"}
                </label>
                <input
                  type="text"
                  value={formData.storeName || ''}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  placeholder="BEVULTA"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "Badge above Title" : "Badge d'Accroche Supérieur"}
                </label>
                <input
                  type="text"
                  value={formData.heroBadge || ''}
                  onChange={(e) => handleChange('heroBadge', e.target.value)}
                  placeholder="Fabrication Locale & Ingénierie Africaine"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                {isEn ? "Main Headline (H1)" : "Grand Titre Principal"}
              </label>
              <textarea
                rows={2}
                value={formData.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="Concepteur et Fabricant de Machines Agricoles et Industrielles en Afrique de l'Ouest"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                {isEn ? "Subtitle / Pitch Description" : "Texte d'Introduction / Description"}
              </label>
              <textarea
                rows={3}
                value={formData.heroSubtitle || ''}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                placeholder="Depuis notre usine de Cotonou, nous concevons et fabriquons des machines..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "Primary Button Label (CTA 1)" : "Bouton Principal (CTA 1)"}
                </label>
                <input
                  type="text"
                  value={formData.heroCtaPrimary || ''}
                  onChange={(e) => handleChange('heroCtaPrimary', e.target.value)}
                  placeholder="Découvrir Nos Machines"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "Secondary Button Label (CTA 2)" : "Bouton Secondaire (CTA 2)"}
                </label>
                <input
                  type="text"
                  value={formData.heroCtaSecondary || ''}
                  onChange={(e) => handleChange('heroCtaSecondary', e.target.value)}
                  placeholder="Nos Formations"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Hero Carousel Images */}
            <div style={{ marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                {isEn ? "Hero Carousel Images (3 slides)" : "Images du Carrousel d'Accueil (3 visuels)"}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
                {isEn ? "Define the image paths or URLs for the animated hero slideshow." : "Définissez les chemins ou URLs des images pour le diaporama dynamique en haut de page."}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {[1, 2, 3].map(num => {
                  const key = `heroImage${num}`;
                  const defaultImg = num === 1 ? '/hero-machines.png' : `/hero-machines-${num}.png`;
                  const currentImg = formData[key] || defaultImg;
                  return (
                    <div key={num} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <img 
                          src={currentImg} 
                          alt={`Aperçu Slide ${num}`} 
                          style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                          onError={(e) => { e.currentTarget.src = '/hero.png'; }}
                        />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Slide {num}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Image {num}</div>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={formData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={defaultImg}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Call-to-Action (CTA Banner) Section Customization */}
            <div style={{ marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                {isEn ? "Final Call-to-Action Banner" : "Bannière d'Appel à l'Action Finale (Bas de Page)"}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
                {isEn ? "Customize the text of the large final block before the footer." : "Personnalisez les textes de la grande carte d'invitation au devis avant le pied de page."}
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "CTA Headline" : "Titre de la Bannière Finale"}
                </label>
                <input
                  type="text"
                  value={formData.ctaTitle || ''}
                  onChange={(e) => handleChange('ctaTitle', e.target.value)}
                  placeholder="Un Projet Industriel ou une Commande Spécifique ?"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '14px' }}
                />

                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "CTA Description" : "Texte Descriptif"}
                </label>
                <textarea
                  rows={2}
                  value={formData.ctaDesc || ''}
                  onChange={(e) => handleChange('ctaDesc', e.target.value)}
                  placeholder="Nos ingénieurs et techniciens conçoivent votre unité de transformation clé en main..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '14px', resize: 'vertical' }}
                />

                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "CTA Button Text" : "Intitulé du Bouton"}
                </label>
                <input
                  type="text"
                  value={formData.ctaBtn || ''}
                  onChange={(e) => handleChange('ctaBtn', e.target.value)}
                  placeholder="Demander une Étude & Devis Gratuit"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Live Mini Preview Box */}
            <div style={{
              marginTop: '28px',
              padding: '20px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {isEn ? "Real-time Hero Preview" : "Aperçu Visuel en Direct"}
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                padding: '24px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <span style={{
                  display: 'inline-block',
                  background: '#dcfce7',
                  color: '#166534',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  marginBottom: '10px'
                }}>
                  {formData.heroBadge || "Badge"}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0b2c5c', margin: '0 0 8px 0' }}>
                  {formData.storeName || "BEVULTA"} - {formData.heroTitle || "Titre de la boutique"}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  {formData.heroSubtitle || "Description du hero..."}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" style={{ background: '#166534', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                    {formData.heroCtaPrimary || "Bouton 1"}
                  </button>
                  <button type="button" style={{ background: 'white', color: '#0f172a', padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.85rem' }}>
                    {formData.heroCtaSecondary || "Bouton 2"}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: KEY STATS (GREEN RIBBON) */}
      {activeSubTab === 'stats' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                {isEn ? "Green Ribbon Key Metrics" : "Statistiques Clés du Ruban Vert"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                {isEn ? "The 4 key credibility indicators shown prominently on the home page." : "Les 4 chiffres d'impact et de crédibilité mis en valeur sur votre vitrine."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('showStatsRibbon')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                background: formData.showStatsRibbon ? '#dcfce7' : '#f1f5f9',
                color: formData.showStatsRibbon ? '#166534' : '#64748b',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {formData.showStatsRibbon ? (
                <>
                  <CheckCircle size={14} />
                  <span>{isEn ? "Ribbon Active" : "Ruban Activé"}</span>
                </>
              ) : (
                <span>{isEn ? "Hidden" : "Masqué"}</span>
              )}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {/* Stat 1 */}
            <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginBottom: '10px' }}>STATISTIQUE 1</div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Chiffre / Valeur</label>
              <input
                type="text"
                value={formData.stat1Number || ''}
                onChange={(e) => handleChange('stat1Number', e.target.value)}
                placeholder="30+"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 700 }}
              />
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Libellé</label>
              <input
                type="text"
                value={formData.stat1Label || ''}
                onChange={(e) => handleChange('stat1Label', e.target.value)}
                placeholder="Années d'expérience"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Stat 2 */}
            <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginBottom: '10px' }}>STATISTIQUE 2</div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Chiffre / Valeur</label>
              <input
                type="text"
                value={formData.stat2Number || ''}
                onChange={(e) => handleChange('stat2Number', e.target.value)}
                placeholder="100+"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 700 }}
              />
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Libellé</label>
              <input
                type="text"
                value={formData.stat2Label || ''}
                onChange={(e) => handleChange('stat2Label', e.target.value)}
                placeholder="Machines fabriquées"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Stat 3 */}
            <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginBottom: '10px' }}>STATISTIQUE 3</div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Chiffre / Valeur</label>
              <input
                type="text"
                value={formData.stat3Number || ''}
                onChange={(e) => handleChange('stat3Number', e.target.value)}
                placeholder="5000+"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 700 }}
              />
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Libellé</label>
              <input
                type="text"
                value={formData.stat3Label || ''}
                onChange={(e) => handleChange('stat3Label', e.target.value)}
                placeholder="Jeunes formés"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Stat 4 */}
            <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginBottom: '10px' }}>STATISTIQUE 4</div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Chiffre / Valeur</label>
              <input
                type="text"
                value={formData.stat4Number || ''}
                onChange={(e) => handleChange('stat4Number', e.target.value)}
                placeholder="100%"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 700 }}
              />
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Libellé</label>
              <input
                type="text"
                value={formData.stat4Label || ''}
                onChange={(e) => handleChange('stat4Label', e.target.value)}
                placeholder="Impact en Afrique"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CONTACT & SOCIAL HUB */}
      {activeSubTab === 'contact' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
            {isEn ? "Contact Information & Social Links" : "Coordonnées de l'Atelier & Réseaux Sociaux"}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
            {isEn ? "These details appear in the header, footer, contact modal, and community cards." : "Ces informations sont utilisées dans l'en-tête, le pied de page, les boutons WhatsApp et la communauté."}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                <Phone size={14} color="#166534" />
                <span>{isEn ? "Primary Phone" : "Téléphone Principal (Appels)"}</span>
              </label>
              <input
                type="text"
                value={formData.contactPhone1 || ''}
                onChange={(e) => handleChange('contactPhone1', e.target.value)}
                placeholder="(+229) 97 69 91 78"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                <Phone size={14} color="#166534" />
                <span>{isEn ? "Secondary Phone / SAV" : "Téléphone Secondaire / SAV"}</span>
              </label>
              <input
                type="text"
                value={formData.contactPhone2 || ''}
                onChange={(e) => handleChange('contactPhone2', e.target.value)}
                placeholder="(+229) 01 97 45 50 12"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                <MessageCircle size={14} color="#16a34a" />
                <span>{isEn ? "WhatsApp Direct Number" : "Numéro WhatsApp Direct"}</span>
              </label>
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+22997699178"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                <Mail size={14} color="#0284c7" />
                <span>{isEn ? "Contact Email" : "Email Officiel"}</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="bevulta@gmail.com"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              <MapPin size={14} color="#ea580c" />
              <span>{isEn ? "Workshop / Factory Physical Address" : "Adresse Physique de l'Atelier / Siège"}</span>
            </label>
            <input
              type="text"
              value={formData.atelierAddress || ''}
              onChange={(e) => handleChange('atelierAddress', e.target.value)}
              placeholder="C/3474 Agla Von FAN-MILK, Cotonou, Bénin"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {/* Social Links */}
          <div style={{ marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              {isEn ? "Community & Social Links (Community Hub Cards)" : "Liens Communauté & Réseaux Sociaux"}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  <YoutubeIcon size={14} color="#ef4444" />
                  <span>{isEn ? "YouTube Channel Link" : "Lien Chaîne YouTube"}</span>
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/@bevulta"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  <MessageCircle size={14} color="#16a34a" />
                  <span>{isEn ? "WhatsApp Group / Channel Link" : "Lien Canal WhatsApp Officiel"}</span>
                </label>
                <input
                  type="url"
                  value={formData.whatsappCommunityUrl || ''}
                  onChange={(e) => handleChange('whatsappCommunityUrl', e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  <Globe size={14} color="#0284c7" />
                  <span>{isEn ? "Community Hub / Forum URL" : "Lien Communauté Hub"}</span>
                </label>
                <input
                  type="url"
                  value={formData.hubCommunityUrl || ''}
                  onChange={(e) => handleChange('hubCommunityUrl', e.target.value)}
                  placeholder="https://community.bevulta.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SECTION TOGGLES */}
      {activeSubTab === 'sections' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
            {isEn ? "Landing Page Sections Visibility" : "Gestion de l'Affichage des Sections sur la Page d'Accueil"}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
            {isEn ? "Turn sections on or off to adapt your homepage according to your current priorities." : "Activez ou désactivez les blocs de contenu selon vos campagnes et priorités du moment."}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {[
              { key: 'showPillarsSection', label: 'Les 4 Piliers d\'Excellence', desc: 'Ingénierie, Fabrication, Formation, SAV & Accompagnement' },
              { key: 'showStatsRibbon', label: 'Ruban Vert des Chiffres Clés', desc: 'Bandeau vert mettant en avant les années d\'expérience et l\'impact' },
              { key: 'showDomainsSection', label: 'Nos Domaines d\'Intervention', desc: 'Agroalimentaire, Agriculture, BTP, Menuiserie & Métallurgie' },
              { key: 'showMachinesVedettes', label: 'Machines Industrielles Vedettes', desc: 'Carrousel et sélection des équipements en vedette' },
              { key: 'showFormationsEbooks', label: 'Offres Numériques & E-books', desc: 'Section dédiée aux guides techniques, formations et packs' },
              { key: 'showInteractiveMap', label: 'Carte Interactive de Présence', desc: 'Carte montrant les pays livrés et clients en Afrique' },
              { key: 'showAudioSynthesizer', label: 'Synthétiseur Sonore Marimba', desc: 'Module musical interactif Web Audio API en bas de page' },
              { key: 'showCtaBanner', label: 'Bannière d\'Appel à l\'Action Finale', desc: 'Grande carte finale invitant à commander un devis ou nous contacter' },
            ].map(sec => {
              const active = formData[sec.key] !== false;
              return (
                <div
                  key={sec.key}
                  onClick={() => handleToggle(sec.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: active ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${active ? '#bbf7d0' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ paddingRight: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: active ? '#166534' : '#475569' }}>
                      {sec.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {sec.desc}
                    </div>
                  </div>
                  <div style={{ color: active ? '#16a34a' : '#94a3b8', flexShrink: 0 }}>
                    {active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Bar with Save */}
      <div style={{
        position: 'sticky',
        bottom: '20px',
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '14px 24px',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#475569' }}>
          {isEn ? "Changes are saved immediately to database and storage." : "Vos modifications sont appliquées instantanément sur votre boutique en direct."}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={goHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Eye size={15} />
            <span>{isEn ? "Preview Site" : "Aperçu du site"}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#166534',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save size={16} />
            <span>{isSaving ? (isEn ? "Saving..." : "Enregistrement...") : (isEn ? "Save Changes" : "Enregistrer les modifications")}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
