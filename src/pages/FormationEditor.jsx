import React, { useState } from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Layers, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Eye, 
  Sparkles,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Upload,
  Loader
} from 'lucide-react';
import { FORMATION_CATEGORIES } from '../data/initialFormations';
import { processImageUpload } from '../utils/imageUploadHelper';

const PRESET_COVERS = [
  { label: "Agro-alimentaire", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700" },
  { label: "Mécanique & Moteurs", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=700" },
  { label: "Provenderie & Élevage", url: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=700" },
  { label: "BTP & Briqueterie", url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=700" },
  { label: "Atelier Industriel", url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=700" },
  { label: "Formation Pratique", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=700" }
];

export default function FormationEditor({ 
  formation, 
  onSave, 
  onCancel, 
  lang = 'fr', 
  showConfirm, 
  showAlert 
}) {
  const isEn = lang === 'en';
  const isNew = !formation || !formation.id;

  // Basic Details
  const [title, setTitle] = useState(formation?.title || '');
  const [subtitle, setSubtitle] = useState(formation?.subtitle || '');
  const [category, setCategory] = useState(formation?.category || 'Agro-alimentaire');
  const [badge, setBadge] = useState(formation?.badge || 'Session Certifiante');
  const [duration, setDuration] = useState(formation?.duration || '3 Jours intensifs (24h pratiques)');
  const [format, setFormat] = useState(formation?.format || 'Présentiel Atelier (Cotonou) ou Mixte');
  const [location, setLocation] = useState(formation?.location || 'Atelier Central BEVULTA, Cotonou, Bénin');
  const [nextSession, setNextSession] = useState(formation?.nextSession || 'Chaque 1er et 3ème Lundi du mois');

  // Pricing
  const [priceFcfa, setPriceFcfa] = useState(formation?.priceFcfa || 35000);
  const [priceEur, setPriceEur] = useState(formation?.priceEur || Math.round((formation?.priceFcfa || 35000) / 655.957));
  const [hasPromo, setHasPromo] = useState(Boolean(formation?.promoPriceFcfa));
  const [promoPriceFcfa, setPromoPriceFcfa] = useState(formation?.promoPriceFcfa || '');
  const [promoPriceEur, setPromoPriceEur] = useState(formation?.promoPriceEur || '');

  // Media
  const [coverImage, setCoverImage] = useState(formation?.coverImage || PRESET_COVERS[0].url);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Pedagogical info
  const [description, setDescription] = useState(formation?.description || '');
  const [targetAudience, setTargetAudience] = useState(formation?.targetAudience || '');
  const [prerequisites, setPrerequisites] = useState(formation?.prerequisites || 'Aucun prérequis technique nécessaire.');

  // Included perks
  const [included, setIncluded] = useState(
    formation?.included && formation.included.length > 0 
      ? formation.included 
      : [
          "Attestation Officielle de Fin de Formation certifiée BEVULTA",
          "Support de cours relié et fiches de barèmes thermiques",
          "Kit de protection atelier (blouse + gants)",
          "Déjeuners et pauses-café inclus durant la formation",
          "Assistance et suivi technique post-formation WhatsApp pendant 3 mois"
        ]
  );
  const [newPerk, setNewPerk] = useState('');

  // Modules / Syllabus
  const [modules, setModules] = useState(
    formation?.modules && formation.modules.length > 0
      ? formation.modules
      : [
          {
            number: 1,
            title: "Matières premières & Normes de sécurité",
            duration: "Jour 1 (Matin)",
            points: ["Calibrage et sélection des intrants", "Hygiène et protocoles d'atelier"]
          },
          {
            number: 2,
            title: "Pratique sur Machines & Réglages industriels",
            duration: "Jour 1 (Après-midi)",
            points: ["Mise en route et calage mécanique", "Essais de production et cadences"]
          }
        ]
  );

  // UI Navigation states
  const [activeTab, setActiveTab] = useState('infos');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Auto calculate EUR
  const handlePriceFcfaChange = (val) => {
    const num = Number(val);
    setPriceFcfa(num);
    setPriceEur(Math.round(num / 655.957));
  };

  const handlePromoPriceFcfaChange = (val) => {
    const num = Number(val);
    setPromoPriceFcfa(val ? num : '');
    setPromoPriceEur(val ? Math.round(num / 655.957) : '');
  };

  // Add / remove perk
  const handleAddPerk = () => {
    if (!newPerk.trim()) return;
    setIncluded([...included, newPerk.trim()]);
    setNewPerk('');
  };

  const handleRemovePerk = (index) => {
    setIncluded(included.filter((_, idx) => idx !== index));
  };

  // Module helpers
  const handleAddModule = () => {
    const nextNumber = modules.length + 1;
    setModules([
      ...modules,
      {
        number: nextNumber,
        title: `Module ${nextNumber} : Nouveau Thème Pratique`,
        duration: "1 Demi-journée",
        points: ["Objectif 1 du module", "Pratique sur atelier"]
      }
    ]);
  };

  const handleRemoveModule = (index) => {
    const updated = modules.filter((_, idx) => idx !== index).map((m, idx) => ({
      ...m,
      number: idx + 1
    }));
    setModules(updated);
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const handleAddPointToModule = (moduleIdx, pointText) => {
    if (!pointText.trim()) return;
    const updated = [...modules];
    updated[moduleIdx].points = [...(updated[moduleIdx].points || []), pointText.trim()];
    setModules(updated);
  };

  const handleRemovePointFromModule = (moduleIdx, pointIdx) => {
    const updated = [...modules];
    updated[moduleIdx].points = updated[moduleIdx].points.filter((_, pIdx) => pIdx !== pointIdx);
    setModules(updated);
  };

  // Save handler
  const handleSaveClick = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      if (showAlert) showAlert(isEn ? "Please enter a formation title." : "Veuillez renseigner le titre de la formation.");
      return;
    }

    const payload = {
      id: formation?.id || Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      badge: badge.trim(),
      duration: duration.trim(),
      format: format.trim(),
      location: location.trim(),
      nextSession: nextSession.trim(),
      priceFcfa: Number(priceFcfa) || 0,
      priceEur: Number(priceEur) || 0,
      promoPriceFcfa: hasPromo && promoPriceFcfa ? Number(promoPriceFcfa) : null,
      promoPriceEur: hasPromo && promoPriceEur ? Number(promoPriceEur) : null,
      coverImage: coverImage.trim(),
      description: description.trim(),
      targetAudience: targetAudience.trim(),
      prerequisites: prerequisites.trim(),
      included,
      modules
    };

    const confirmMsg = isEn 
      ? `Confirm saving formation "${payload.title}"?`
      : `Confirmer l'enregistrement de la formation « ${payload.title} » ?`;

    if (showConfirm) {
      showConfirm(confirmMsg, () => {
        onSave(payload);
      });
    } else {
      onSave(payload);
    }
  };

  const handleCancelClick = () => {
    const confirmMsg = isEn 
      ? "Discard unsaved changes and return to dashboard?"
      : "Quitter sans enregistrer les modifications ?";
    if (showConfirm) {
      showConfirm(confirmMsg, () => {
        onCancel();
      });
    } else {
      onCancel();
    }
  };

  return (
    <div className="admin-shell" style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* Top Header Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={handleCancelClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>{isEn ? "Back" : "Retour"}</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                {isNew ? (isEn ? "New Formation" : "Nouvelle Formation") : (isEn ? "Edit Formation" : "Modifier la Formation")}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {category}
              </span>
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
              {title || (isEn ? "Untitled Formation" : "Formation sans titre")}
            </h1>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Eye size={16} />
            <span>{isEn ? "Live Preview" : "Aperçu Direct"}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#166534',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(22, 101, 52, 0.3)'
            }}
          >
            <Check size={16} />
            <span>{isEn ? "Save Formation" : "Enregistrer la Formation"}</span>
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'infos', label: isEn ? "General Details" : "Informations & Session", icon: <Sliders size={16} /> },
            { id: 'pricing', label: isEn ? "Fees & Logistics" : "Tarifs & Logistique", icon: <DollarSign size={16} /> },
            { id: 'modules', label: isEn ? "Syllabus & Modules" : "Programme & Modules (Syllabus)", icon: <Layers size={16} /> },
            { id: 'included', label: isEn ? "Included Kit & Perks" : "Kits & Avantages Inclus", icon: <ShieldCheck size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#166534' : '#64748b',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '0.88rem',
                borderBottom: activeTab === tab.id ? '3px solid #166534' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: GENERAL DETAILS */}
        {activeTab === 'infos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#166534" />
                <span>{isEn ? "Identity & Title" : "Identité de la Formation"}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Title *" : "Intitulé Officiel de la Formation *"}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Transformation Agroalimentaire & Pilotage d'Usine"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Subtitle / Equipment Covered" : "Sous-titre / Spécialités couvertes"}
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ex: Manioc (Gari, Farine), Beurre de Karité, Jus Tropicaux"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      {isEn ? "Category" : "Catégorie"}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                    >
                      {FORMATION_CATEGORIES.filter(c => c !== 'Tous').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      {isEn ? "Badge" : "Badge Mis en Avant"}
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="Ex: Bestseller Atelier, 100% Pratique"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Description & Objectives" : "Description Globale & Objectifs Pédagogiques"}
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez les compétences acquises par l'apprenant à l'issue de la formation..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Target Audience" : "Public Cible"}
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ex: Promoteurs d'usines, coopératives agricoles, techniciens, entrepreneurs"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Prerequisites" : "Prérequis d'accès"}
                  </label>
                  <input
                    type="text"
                    value={prerequisites}
                    onChange={(e) => setPrerequisites(e.target.value)}
                    placeholder="Ex: Aucun prérequis technique ou Notions de base"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Media & Visual */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} color="#166534" />
                <span>{isEn ? "Cover Image" : "Photo de Couverture"}</span>
              </h3>

              {/* Upload direct depuis la galerie ou les fichiers */}
              <div style={{ marginBottom: '16px', padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  {isEn ? "Upload photo from your device:" : "Téléverser depuis votre appareil (Galerie / Fichiers) :"}
                </label>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: '#166534',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: uploadingCover ? 'wait' : 'pointer',
                  boxShadow: '0 1px 4px rgba(22, 101, 52, 0.2)'
                }}>
                  {uploadingCover ? <Loader className="animate-spin" size={15} /> : <Upload size={15} />}
                  <span>{uploadingCover ? (isEn ? "Uploading..." : "Téléversement...") : (isEn ? "Select Photo (Files / Gallery)" : "Choisir une Photo (Galerie / Fichiers)")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={uploadingCover}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingCover(true);
                        const url = await processImageUpload(file, 'formations');
                        setCoverImage(url);
                        if (showAlert) showAlert(isEn ? "Formation photo updated!" : "Photo de formation mise à jour !");
                      } catch (err) {
                        if (showAlert) showAlert(err.message || "Erreur de téléversement", 'danger');
                      } finally {
                        setUploadingCover(false);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  {isEn ? "Or enter direct image URL:" : "Ou saisir une URL directe d'image :"}
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              {/* Preview Box */}
              <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                marginBottom: '16px',
                background: '#f1f5f9',
                position: 'relative'
              }}>
                <img
                  src={coverImage}
                  alt="Aperçu couverture"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = PRESET_COVERS[0].url; }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {badge || "Certifié"}
                </div>
              </div>

              {/* Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                  {isEn ? "Or choose from presets:" : "Ou choisir une photo prédéfinie :"}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: coverImage === preset.url ? '2px solid #166534' : '1px solid #e2e8f0',
                        background: coverImage === preset.url ? '#f0fdf4' : '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: coverImage === preset.url ? 800 : 500,
                        color: coverImage === preset.url ? '#166534' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRICING & LOGISTICS */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Pricing card */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="#166534" />
                <span>{isEn ? "Registration Fees" : "Frais de Participation"}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      {isEn ? "Price (FCFA) *" : "Prix Standard (FCFA) *"}
                    </label>
                    <input
                      type="number"
                      value={priceFcfa}
                      onChange={(e) => handlePriceFcfaChange(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, color: '#166534' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      {isEn ? "Price (EUR) (≈)" : "Équivalent (€uro) (≈)"}
                    </label>
                    <input
                      type="number"
                      value={priceEur}
                      onChange={(e) => setPriceEur(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 600, color: '#475569' }}
                    />
                  </div>
                </div>

                {/* Promotional toggle */}
                <div style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hasPromo}
                      onChange={(e) => setHasPromo(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#166534' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {isEn ? "Activate Promotional Price / Early Bird" : "Activer un tarif promotionnel (Early Bird / Réduction)"}
                    </span>
                  </label>

                  {hasPromo && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#d97706', marginBottom: '4px' }}>
                          Tarif Promo (FCFA)
                        </label>
                        <input
                          type="number"
                          value={promoPriceFcfa}
                          onChange={(e) => handlePromoPriceFcfaChange(e.target.value)}
                          placeholder="Ex: 25000"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f59e0b', fontSize: '0.92rem', fontWeight: 700, color: '#b45309' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#d97706', marginBottom: '4px' }}>
                          Tarif Promo (€uro)
                        </label>
                        <input
                          type="number"
                          value={promoPriceEur}
                          onChange={(e) => setPromoPriceEur(e.target.value)}
                          placeholder="Ex: 38"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f59e0b', fontSize: '0.92rem', fontWeight: 600 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logistics Card */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#166534" />
                <span>{isEn ? "Schedule & Location" : "Planning & Calendrier des Sessions"}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Duration" : "Durée Totale de la Formation"}
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ex: 3 Jours intensifs (24h pratiques)"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Training Format / Delivery Mode" : "Modalité de Formation"}
                  </label>
                  <input
                    type="text"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    placeholder="Ex: Présentiel Atelier (Cotonou), En Ligne ou Mixte"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Physical Location / Workshop" : "Lieu & Adresse de Formation"}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Atelier Central BEVULTA, Cotonou, Bénin"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {isEn ? "Next Session Date" : "Date de la Prochaine Session"}
                  </label>
                  <input
                    type="text"
                    value={nextSession}
                    onChange={(e) => setNextSession(e.target.value)}
                    placeholder="Ex: Chaque 1er et 3ème Lundi du mois ou 15 Novembre 2026"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MODULES / SYLLABUS */}
        {activeTab === 'modules' && (
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {isEn ? "Training Syllabus & Modules" : "Structure des Modules & Syllabus"}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  {isEn 
                    ? "These modules are printed on the official PDF program and presented on the public page."
                    : "Ces modules sont reportés sur le programme PDF officiel téléchargé par l'apprenant."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#f0fdf4',
                  color: '#166534',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                <span>{isEn ? "Add Module" : "+ Ajouter un Module"}</span>
              </button>
            </div>

            {/* Modules List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {modules.map((mod, modIdx) => (
                <div
                  key={modIdx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    background: '#f8fafc',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: '#166534',
                        color: '#ffffff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800
                      }}>
                        {mod.number || modIdx + 1}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                        Module {mod.number || modIdx + 1}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveModule(modIdx)}
                      disabled={modules.length <= 1}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        background: '#fff',
                        color: '#dc2626',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: modules.length <= 1 ? 'not-allowed' : 'pointer',
                        opacity: modules.length <= 1 ? 0.5 : 1
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Supprimer</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Titre du Module
                      </label>
                      <input
                        type="text"
                        value={mod.title || ''}
                        onChange={(e) => handleModuleChange(modIdx, 'title', e.target.value)}
                        placeholder="Ex: Conduite & Réglage des Machines"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, background: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Durée / Créneau
                      </label>
                      <input
                        type="text"
                        value={mod.duration || ''}
                        onChange={(e) => handleModuleChange(modIdx, 'duration', e.target.value)}
                        placeholder="Ex: Jour 1 (Matin) ou 4 Heures"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* Points / Subtopics of module */}
                  <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                      Points clés & Travaux pratiques abordés :
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                      {(mod.points || []).map((point, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem' }}>
                          <span style={{ color: '#334155' }}>• {point}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePointFromModule(modIdx, pIdx)}
                            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            title="Supprimer ce point"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add point input */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        id={`new-point-${modIdx}`}
                        placeholder="Ajouter un sous-thème (ex: Réglage de la courroie)..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPointToModule(modIdx, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById(`new-point-${modIdx}`);
                          if (el) {
                            handleAddPointToModule(modIdx, el.value);
                            el.value = '';
                          }
                        }}
                        style={{ padding: '7px 12px', borderRadius: '6px', border: 'none', background: '#e2e8f0', color: '#334155', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        + Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INCLUDED PERKS & KITS */}
        {activeTab === 'included' && (
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              {isEn ? "What's Included in the Fee" : "Avantages & Matériel Fourni à l'Apprenant"}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
              {isEn 
                ? "Items included with the training session (attestation, lunch, protective gear, WhatsApp support)."
                : "Indiquez les kits, déjeuners, attestations officielles et suivis inclus pour rassurer le participant."}
            </p>

            {/* List of perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {included.map((perk, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={16} color="#166534" />
                    <span style={{ color: '#0f172a', fontWeight: 500 }}>{perk}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePerk(idx)}
                    style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Perk Input */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newPerk}
                onChange={(e) => setNewPerk(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPerk();
                  }
                }}
                placeholder="Ex: Fiches de barèmes thermiques de pasteurisation offertes..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
              <button
                type="button"
                onClick={handleAddPerk}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#166534',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                + Ajouter
              </button>
            </div>
          </div>
        )}

      </div>

      {/* LIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', background: '#ecfdf5', padding: '4px 10px', borderRadius: '20px' }}>
                Aperçu Public
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <img
              src={coverImage}
              alt="Couverture"
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
            />

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {title || "Intitulé de la formation"}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
              {subtitle}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px', padding: '14px', background: '#f8fafc', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>
                {(hasPromo && promoPriceFcfa ? Number(promoPriceFcfa) : Number(priceFcfa)).toLocaleString()} FCFA
              </span>
              {hasPromo && promoPriceFcfa && (
                <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {Number(priceFcfa).toLocaleString()} FCFA
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', color: '#475569', marginBottom: '20px' }}>
              <div>📅 <strong>Session :</strong> {nextSession}</div>
              <div>⏱️ <strong>Durée :</strong> {duration}</div>
              <div>📍 <strong>Lieu :</strong> {location}</div>
              <div>🎓 <strong>Modules :</strong> {modules.length} modules pratiques</div>
            </div>

            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

