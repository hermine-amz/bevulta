import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ArrowLeft, Eye, Bold, Italic, Underline, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  Image as ImageIcon, Upload, Loader, Check,
  Palette, ChevronDown, Copy, Sparkles,
  CheckCircle2, X, Settings, Sliders
} from 'lucide-react';
import { CATEGORIES, CATEGORY_KEYS } from '../data/categories';
import { supabase } from '../supabaseClient';

/* ──────────────────────────────────────────────────────────────────── */
/*  Rich-Text Toolbar for Product Description                           */
/* ──────────────────────────────────────────────────────────────────── */
const FONT_COLORS = [
  '#0f172a', '#334155', '#64748b', '#2563eb', '#0891b2',
  '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#db2777', '#ffffff',
];

function RichTextToolbar({ editorRef, onUpdate }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    onUpdate();
  };

  const insertLink = () => {
    if (!linkUrl) return;
    exec('createLink', linkUrl.startsWith('http') ? linkUrl : 'https://' + linkUrl);
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const Btn = ({ onClick, title, children }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        minWidth: '28px',
        height: '28px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        color: '#475569',
        padding: '0 4px',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      padding: '8px 12px',
      background: '#f8fafc',
      borderRadius: '12px 12px 0 0',
      border: '1px solid #e2e8f0',
      borderBottom: 'none',
      alignItems: 'center',
      position: 'relative',
    }}>
      <Btn title="Gras (Ctrl+B)" onClick={() => exec('bold')}><Bold size={14} /></Btn>
      <Btn title="Italique (Ctrl+I)" onClick={() => exec('italic')}><Italic size={14} /></Btn>
      <Btn title="Souligné (Ctrl+U)" onClick={() => exec('underline')}><Underline size={14} /></Btn>
      <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' }} />

      <Btn title="Aligner à gauche" onClick={() => exec('justifyLeft')}><AlignLeft size={14} /></Btn>
      <Btn title="Centrer" onClick={() => exec('justifyCenter')}><AlignCenter size={14} /></Btn>
      <Btn title="Aligner à droite" onClick={() => exec('justifyRight')}><AlignRight size={14} /></Btn>
      <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' }} />

      <Btn title="Liste à puces" onClick={() => exec('insertUnorderedList')}><List size={14} /></Btn>
      <Btn title="Liste numérotée" onClick={() => exec('insertOrderedList')}><ListOrdered size={14} /></Btn>
      <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' }} />

      <Btn title="Titre H2" onClick={() => exec('formatBlock', 'h2')}><span style={{ fontSize: '0.72rem', fontWeight: 800 }}>H2</span></Btn>
      <Btn title="Titre H3" onClick={() => exec('formatBlock', 'h3')}><span style={{ fontSize: '0.72rem', fontWeight: 800 }}>H3</span></Btn>
      <Btn title="Paragraphe" onClick={() => exec('formatBlock', 'p')}><span style={{ fontSize: '0.72rem' }}>P</span></Btn>
      <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' }} />

      {/* Color picker */}
      <div style={{ position: 'relative' }}>
        <Btn title="Couleur du texte" onClick={() => { setShowColorPicker(v => !v); setShowLinkInput(false); }}>
          <Palette size={14} />
        </Btn>
        {showColorPicker && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 200,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '8px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 22px)',
            gap: '4px',
          }}>
            {FONT_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => { exec('foreColor', c); setShowColorPicker(false); }}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '4px',
                  background: c,
                  border: c === '#ffffff' ? '1px solid #cbd5e1' : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Link button */}
      <div style={{ position: 'relative' }}>
        <Btn title="Insérer un lien" onClick={() => { setShowLinkInput(v => !v); setShowColorPicker(false); }}>
          <LinkIcon size={14} />
        </Btn>
        {showLinkInput && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 200,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '8px',
            display: 'flex',
            gap: '6px',
            width: '260px',
          }}>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              style={{ flex: 1, padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
            <button
              type="button"
              onClick={insertLink}
              style={{ padding: '4px 10px', background: '#166534', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Main ProductEditor Component (Chariow / Gumroad Sleek Style)        */
/* ──────────────────────────────────────────────────────────────────── */
const defaultForm = {
  name: '',
  category: 'Matériels de transformation agro-alimentaire',
  subcategory: 'Matériels de transformation de Karité',
  description: '',
  descriptionHtml: '',
  priceFcfa: '',
  priceEur: '',
  promoPriceFcfa: '',
  promoPriceEur: '',
  availabilityType: 'stock', // 'stock' | 'order' | 'both'
  availabilityDays: '',
  image: '',
  mediaUrls: [],
  specs: {},
  isVisible: true,
  ctaText: 'Demander un Devis Proforma',
  postPurchaseNotes: '',
};

export default function ProductEditor({ product, onSave, onCancel, lang = 'fr', showAlert, showConfirm }) {
  const isEn = lang === 'en';
  const editingProduct = product;

  function parseAvailability(str) {
    if (!str) return { type: 'stock', days: '' };
    if (str === 'En stock') return { type: 'stock', days: '' };
    if (str === 'En stock / Sur commande') return { type: 'both', days: '' };
    const match = str.match(/(\d+)/);
    return { type: 'order', days: match ? match[1] : '' };
  }

  const initialAvail = parseAvailability(editingProduct?.availability);

  const [form, setForm] = useState(() => ({
    ...defaultForm,
    ...(editingProduct || {}),
    descriptionHtml: editingProduct?.description || '',
    availabilityType: initialAvail.type,
    availabilityDays: initialAvail.days,
    mediaUrls: editingProduct?.image ? [editingProduct.image] : [],
    specs: editingProduct?.specs || {},
    ctaText: editingProduct?.ctaText || 'Demander un Devis Proforma',
  }));

  const [activeTab, setActiveTab] = useState('infos');
  const [isDirty, setIsDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New spec inputs
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Feature Toggles state
  const [enableDiscount, setEnableDiscount] = useState(Boolean(editingProduct?.promoPriceFcfa));
  const [enableCustomCta, setEnableCustomCta] = useState(Boolean(editingProduct?.ctaText && editingProduct.ctaText !== 'Demander un Devis Proforma'));
  const [enablePostPurchase, setEnablePostPurchase] = useState(Boolean(editingProduct?.postPurchaseNotes));

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const updateForm = useCallback((patch) => {
    setForm(prev => ({ ...prev, ...patch }));
    setIsDirty(true);
  }, []);

  const buildAvailability = () => {
    if (form.availabilityType === 'stock') return 'En stock';
    if (form.availabilityType === 'both') return 'En stock / Sur commande';
    if (form.availabilityDays) return `Sur commande (${form.availabilityDays} jours)`;
    return 'Sur commande';
  };

  useEffect(() => {
    if (activeTab === 'description' && editorRef.current) {
      if (editorRef.current.innerHTML !== form.descriptionHtml) {
        editorRef.current.innerHTML = form.descriptionHtml || '';
      }
    }
  }, [activeTab, form.descriptionHtml]);

  const handleDescriptionUpdate = useCallback(() => {
    if (editorRef.current) {
      updateForm({
        descriptionHtml: editorRef.current.innerHTML,
        description: editorRef.current.innerText,
      });
    }
  }, [updateForm]);

  // Upload to Supabase Storage
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploaded = [];
      for (const file of files) {
        const ext = file.name.split('.').pop().toLowerCase();
        const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from('bevulta-media')
          .upload(path, file, { cacheControl: '3600', upsert: false });

        if (!error) {
          const { data } = supabase.storage.from('bevulta-media').getPublicUrl(path);
          uploaded.push(data.publicUrl);
        }
      }

      if (uploaded.length > 0) {
        const updated = [...form.mediaUrls, ...uploaded];
        updateForm({ mediaUrls: updated, image: updated[0] || form.image });
        showAlert(isEn ? "Photo uploaded successfully!" : "Photo ajoutée avec succès !");
      }
    } catch (err) {
      console.error(err);
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeMedia = (idx) => {
    const updated = form.mediaUrls.filter((_, i) => i !== idx);
    updateForm({ mediaUrls: updated, image: updated[0] || '' });
  };

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    updateForm({ specs: { ...form.specs, [newSpecKey.trim()]: newSpecVal.trim() } });
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpec = (key) => {
    const s = { ...form.specs };
    delete s[key];
    updateForm({ specs: s });
  };

  const handleSubmit = () => {
    if (!form.name || (!form.priceFcfa && !form.priceEur)) {
      showAlert(isEn ? 'Please fill in product name and price.' : 'Veuillez saisir le nom et le prix du produit.');
      return;
    }
    const payload = {
      ...form,
      priceFcfa: Number(form.priceFcfa) || 0,
      priceEur: Math.round((Number(form.priceFcfa) || 0) / 655.957),
      promoPriceFcfa: enableDiscount && form.promoPriceFcfa ? Number(form.promoPriceFcfa) : null,
      promoPriceEur: enableDiscount && form.promoPriceFcfa ? Math.round(Number(form.promoPriceFcfa) / 655.957) : null,
      isVisible: form.isVisible !== false,
      availability: buildAvailability(),
      image: form.mediaUrls[0] || form.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600',
      description: form.descriptionHtml || editorRef.current?.innerHTML || form.description || '',
      id: editingProduct ? editingProduct.id : Date.now(),
      ctaText: enableCustomCta ? form.ctaText : 'Demander un Devis Proforma',
      postPurchaseNotes: enablePostPurchase ? form.postPurchaseNotes : '',
    };

    if (showConfirm) {
      showConfirm(
        isEn ? "Do you want to publish these changes?" : "Voulez-vous publier ces modifications sur la boutique ?",
        () => onSave(payload)
      );
    } else {
      onSave(payload);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + `/#catalog?search=${encodeURIComponent(form.name || '')}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const tabs = [
    { id: 'infos', label: isEn ? 'Information' : 'Informations', icon: <Sliders size={18} /> },
    { id: 'pricing', label: isEn ? 'Pricing' : 'Tarification', icon: <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>$</span> },
    { id: 'media', label: isEn ? 'Media & Photos' : 'Fichiers & Photos', icon: <ImageIcon size={18} /> },
    { id: 'description', label: isEn ? 'Description' : 'Description', icon: <AlignLeft size={18} /> },
    { id: 'specs', label: isEn ? 'Tech Specs' : 'Fiche Technique', icon: <Settings size={18} /> },
    { id: 'advanced', label: isEn ? 'Advanced' : 'Avancé', icon: <Sliders size={18} /> },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#0f172a',
      overflow: 'hidden'
    }}>
      
      {/* ── TOP HEADER (Sleek Chariow / Gumroad Style) ── */}
      <header style={{
        height: '68px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {/* Left: Back + Product Title + Copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <button
            type="button"
            onClick={onCancel}
            title={isEn ? "Back" : "Retour"}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              transition: 'all 0.15s'
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <h1 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '480px'
            }}>
              {form.name || (isEn ? "Untitled Product" : "Nouvelle Machine Industrielle")}
            </h1>
            <button
              type="button"
              onClick={handleCopyLink}
              title={copiedLink ? "Copié !" : "Copier le lien produit"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: copiedLink ? '#16a34a' : '#94a3b8',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Right: Actions [Voir] [Publier] [Plus] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Voir preview button */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            <Eye size={16} />
            <span>{isEn ? "View" : "Voir"}</span>
          </button>

          {/* Publier / Enregistrer (Warm Gold / Green) */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 24px',
              borderRadius: '10px',
              border: 'none',
              background: '#eab308', // Warm vibrant gold like screenshot
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(234, 179, 8, 0.25)',
              transition: 'transform 0.1s'
            }}
          >
            <span>{isEn ? "Publish" : "Publier"}</span>
          </button>

          {/* Plus dropdown menu */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowMoreMenu(v => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <span>{isEn ? "More" : "Plus"}</span>
              <ChevronDown size={14} />
            </button>

            {showMoreMenu && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                padding: '6px',
                minWidth: '180px',
                zIndex: 100
              }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Copy size={14} />
                  <span>{isEn ? "Copy Product Link" : "Copier le lien"}</span>
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <X size={14} />
                  <span>{isEn ? "Close without saving" : "Quitter sans sauvegarder"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── TWO-COLUMN BODY (LEFT: TABS PILLS, RIGHT: CLEAN MAIN CANVAS) ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Vertical Menu */}
        <aside style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#1e293b' : 'transparent', // Dark slate active pill like screenshot
                  color: isActive ? '#ffffff' : '#475569',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                  {tab.icon}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Main Content Panel */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '36px 48px',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '820px', animation: 'fadeIn 0.2s ease' }}>
            
            {/* ════════ TAB 1: INFORMATIONS ════════ */}
            {activeTab === 'infos' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Product Details" : "Détails du produit"}
                </h2>

                {/* Nom du produit */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    {isEn ? "Product name *" : "Nom du produit *"}
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                      placeholder={isEn ? "e.g., Shea Butter Combined Processing Plant" : "Ex: Complexe de Karité (Concassage & Broyage)"}
                      style={{
                        width: '100%',
                        padding: '13px 44px 13px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.94rem',
                        outline: 'none',
                        background: '#ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                    />
                    <div style={{ position: 'absolute', right: '12px', color: '#94a3b8' }}>
                      <Sparkles size={18} />
                    </div>
                  </div>
                </div>

                {/* Catégorie */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    {isEn ? "Category *" : "Catégorie *"}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      updateForm({ category: cat, subcategory: CATEGORIES[cat]?.[0] || '' });
                    }}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.94rem',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    {CATEGORY_KEYS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sous-catégorie */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    {isEn ? "Subcategory / Technical Domain *" : "Sous-catégorie / Domaine technique *"}
                  </label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => updateForm({ subcategory: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.94rem',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    {(CATEGORIES[form.category] || []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* ── TOGGLE CARDS (Like Screenshot) ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                  
                  {/* Toggle 1: Réduction automatique / Promo */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{isEn ? "Automated Discount & Special Offer" : "Réduction & Prix promotionnel"}</span>
                        <span style={{ color: '#ea580c' }}>⚡</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {isEn ? "Display a strikethrough price and limited-time offer badge." : "Affichez un prix barré et une remise spéciale pour booster les commandes."}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableDiscount}
                      onChange={(e) => setEnableDiscount(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#1e293b', cursor: 'pointer' }}
                    />
                  </div>

                  {enableDiscount && (
                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', marginLeft: '12px', marginTop: '-4px', animation: 'fadeIn 0.2s ease' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {isEn ? "Discounted Promotional Price (FCFA) :" : "Prix promotionnel remisé (FCFA) :"}
                      </label>
                      <input
                        type="number"
                        value={form.promoPriceFcfa}
                        onChange={(e) => updateForm({ promoPriceFcfa: e.target.value })}
                        placeholder="Ex: 1450000"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  {/* Toggle 2: Disponibilité & Délais */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                        {isEn ? "Workshop Availability & Lead Time" : "Disponibilité & Délais de fabrication"}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {form.availabilityType === 'stock' ? 'En stock (Prêt à l\'expédition)' : 'Sur commande (Délais de fabrication sur-mesure)'}
                      </div>
                    </div>
                    <select
                      value={form.availabilityType}
                      onChange={(e) => updateForm({ availabilityType: e.target.value })}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <option value="stock">En stock</option>
                      <option value="order">Sur commande</option>
                      <option value="both">Mixte (Stock / Commande)</option>
                    </select>
                  </div>

                  {form.availabilityType === 'order' && (
                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', marginLeft: '12px', marginTop: '-4px', animation: 'fadeIn 0.2s ease' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {isEn ? "Manufacturing lead time (in days) :" : "Délai moyen de fabrication (jours) :"}
                      </label>
                      <input
                        type="text"
                        value={form.availabilityDays}
                        onChange={(e) => updateForm({ availabilityDays: e.target.value })}
                        placeholder="Ex: 15-30"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  {/* Toggle 3: Visibilité sur le site public */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                        {isEn ? "Public Storefront Visibility" : "Visibilité sur la boutique publique"}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {form.isVisible ? "Visible par tous les visiteurs du site" : "Masqué du catalogue public"}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.isVisible !== false}
                      onChange={(e) => updateForm({ isVisible: e.target.checked })}
                      style={{ width: '20px', height: '20px', accentColor: '#1e293b', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Toggle 4: Texte du bouton d'action */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                        {isEn ? "Custom Action Button Label" : "Texte du bouton d'achat / devis"}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {isEn ? "Customize the text of the button on the machine page." : "Personnalisez le libellé du bouton (ex: Demander un Devis, Commander)."}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableCustomCta}
                      onChange={(e) => setEnableCustomCta(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#1e293b', cursor: 'pointer' }}
                    />
                  </div>

                  {enableCustomCta && (
                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', marginLeft: '12px', marginTop: '-4px', animation: 'fadeIn 0.2s ease' }}>
                      <input
                        type="text"
                        value={form.ctaText}
                        onChange={(e) => updateForm({ ctaText: e.target.value })}
                        placeholder="Ex: Demander mon Devis Proforma"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════ TAB 2: TARIFICATION ════════ */}
            {activeTab === 'pricing' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Pricing & Currency" : "Tarification & Monnaies"}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {isEn ? "Official Price (FCFA) *" : "Prix Officiel Atelier (FCFA) *"}
                    </label>
                    <input
                      type="number"
                      required
                      value={form.priceFcfa}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateForm({
                          priceFcfa: val,
                          priceEur: Math.round(val / 655.957)
                        });
                      }}
                      placeholder="Ex: 1600000"
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {isEn ? "Equivalent Price (€uro) :" : "Équivalent en €uro :"}
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={Math.round((Number(form.priceFcfa) || 0) / 655.957)}
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '1rem', fontWeight: 700 }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                      Calcul automatique au cours officiel de 1 € = 655.957 FCFA.
                    </span>
                  </div>
                </div>

                {/* Acompte recommandé */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>
                      Acompte de 50% à la commande
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#14532d', marginTop: '2px' }}>
                      Soit environ <strong>{Math.round((Number(form.priceFcfa) || 0) / 2).toLocaleString()} FCFA</strong> à régler pour lancer la mise en fabrication.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════ TAB 3: PHOTOS & FICHIERS ════════ */}
            {activeTab === 'media' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Media & Machine Photos" : "Photos & Médias de l'Atelier"}
                </h2>

                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0' }}>
                  Ajoutez les photos réelles de la machine prises en atelier ou en situation d'exploitation.
                </p>

                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '16px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    marginBottom: '24px',
                    transition: 'border-color 0.15s'
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    {uploading ? <Loader className="animate-spin" size={24} /> : <Upload size={24} />}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    {uploading ? "Téléversement en cours..." : "Cliquez pour sélectionner des photos"}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    JPG, PNG ou WEBP jusqu'à 10 Mo par photo
                  </div>
                </div>

                {uploadError && (
                  <div style={{ padding: '12px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', marginBottom: '20px' }}>
                    {uploadError}
                  </div>
                )}

                {/* URL Directe */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Ou saisir une URL directe d'image :
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => updateForm({ image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (form.image) {
                          updateForm({ mediaUrls: [form.image, ...form.mediaUrls] });
                        }
                      }}
                      style={{ padding: '10px 18px', background: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Photos List Grid */}
                {form.mediaUrls.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
                      Photos enregistrées ({form.mediaUrls.length}) :
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                      {form.mediaUrls.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1', aspectRatio: '4/3' }}>
                          <img src={url} alt="machine" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              Principale
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeMedia(idx)}
                            style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', background: '#dc2626', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════ TAB 4: DESCRIPTION ════════ */}
            {activeTab === 'description' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Product Description" : "Description & Argumentaire de Vente"}
                </h2>

                <RichTextToolbar editorRef={editorRef} onUpdate={handleDescriptionUpdate} />
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleDescriptionUpdate}
                  style={{
                    minHeight: '260px',
                    padding: '16px',
                    borderRadius: '0 0 12px 12px',
                    border: '1px solid #cbd5e1',
                    borderTop: 'none',
                    outline: 'none',
                    fontSize: '0.94rem',
                    lineHeight: 1.6,
                    background: '#ffffff'
                  }}
                />
              </div>
            )}

            {/* ════════ TAB 5: SPÉCIFICATIONS TECHNIQUES ════════ */}
            {activeTab === 'specs' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Technical Specifications" : "Fiche Technique & Motorisation"}
                </h2>

                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0' }}>
                  Définissez les caractéristiques mécaniques et électriques pour le devis proforma.
                </p>

                {/* Add new spec box */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <input
                    type="text"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Caractéristique (ex: Motorisation, Matériau...)"
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  <input
                    type="text"
                    value={newSpecVal}
                    onChange={(e) => setNewSpecVal(e.target.value)}
                    placeholder="Valeur (ex: Moteur Diesel 12 CV)"
                    style={{ flex: 1.5, padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    style={{ padding: '10px 18px', background: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Ajouter
                  </button>
                </div>

                {/* Existing Specs Table */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                        <th style={{ padding: '12px 16px' }}>Caractéristique</th>
                        <th style={{ padding: '12px 16px' }}>Spécification</th>
                        <th style={{ padding: '12px 16px', width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(form.specs || {}).filter(k => !k.startsWith('_')).map(key => (
                        <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#334155' }}>{key}</td>
                          <td style={{ padding: '12px 16px', color: '#0f172a' }}>{form.specs[key]}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpec(key)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ════════ TAB 6: AVANCÉ & NOTES ════════ */}
            {activeTab === 'advanced' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Advanced Settings" : "Paramètres Avancés"}
                </h2>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Instructions particulières pour le client après devis :
                  </label>
                  <textarea
                    rows={4}
                    value={form.postPurchaseNotes}
                    onChange={(e) => updateForm({ postPurchaseNotes: e.target.value })}
                    placeholder="Ex: Prévoir une arrivée électrique triphasée 380V sur site. Montage et mise en service assurés par notre technicien."
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.92rem', lineHeight: 1.5 }}
                  />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ── PREVIEW MODAL (When clicking 'Voir') ── */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ height: '220px', position: 'relative' }}>
              <img
                src={form.mediaUrls[0] || form.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600'}
                alt="Aperçu"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' }}>
                {form.category}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
                {form.name || "Titre de la machine"}
              </h3>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#166534', marginBottom: '16px' }}>
                {(Number(form.priceFcfa) || 0).toLocaleString()} FCFA
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
