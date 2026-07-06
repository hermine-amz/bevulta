import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ArrowLeft, Save, Eye, Bold, Italic, Underline, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Type,
  Image as ImageIcon, Video, Plus, Trash2, Upload, Loader, Check,
  Palette, ShoppingCart, ArrowRightLeft, ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_KEYS } from '../data/categories';
import { supabase } from '../supabaseClient';

/* ──────────────────────────────────────────────────────────────────── */
/*  Rich-Text Toolbar                                                   */
/* ──────────────────────────────────────────────────────────────────── */
const FONT_COLORS = [
  '#0f172a','#334155','#64748b','#2563eb','#0891b2',
  '#16a34a','#dc2626','#d97706','#7c3aed','#db2777','#ffffff',
];

function RichTextToolbar({ editorRef, onUpdate }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput]     = useState(false);
  const [linkUrl, setLinkUrl]                 = useState('');

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
      type="button" title={title} onClick={onClick}
      style={{
        minWidth: '30px', height: '30px', border: 'none', borderRadius: '5px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', color: 'var(--text-secondary)', padding: '0 4px',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-app)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{children}</button>
  );

  const Sep = () => (
    <div style={{ width:'1px', height:'20px', background:'var(--border-subtle)', margin:'0 2px', flexShrink:0 }} />
  );

  return (
    <div style={{
      display:'flex', flexWrap:'wrap', gap:'2px', padding:'8px 10px',
      background:'var(--bg-surface)', borderRadius:'10px 10px 0 0',
      border:'1px solid var(--border-color)', borderBottom:'none', alignItems:'center',
      position:'relative',
    }}>
      {/* Format buttons */}
      <Btn title="Gras (Ctrl+B)" onClick={() => exec('bold')}><Bold size={14}/></Btn>
      <Btn title="Italique (Ctrl+I)" onClick={() => exec('italic')}><Italic size={14}/></Btn>
      <Btn title="Souligné (Ctrl+U)" onClick={() => exec('underline')}><Underline size={14}/></Btn>
      <Sep/>
      <Btn title="Aligner à gauche" onClick={() => exec('justifyLeft')}><AlignLeft size={14}/></Btn>
      <Btn title="Centrer" onClick={() => exec('justifyCenter')}><AlignCenter size={14}/></Btn>
      <Btn title="Aligner à droite" onClick={() => exec('justifyRight')}><AlignRight size={14}/></Btn>
      <Sep/>
      <Btn title="Liste à puces" onClick={() => exec('insertUnorderedList')}><List size={14}/></Btn>
      <Btn title="Liste numérotée" onClick={() => exec('insertOrderedList')}><ListOrdered size={14}/></Btn>
      <Sep/>

      {/* Heading shortcuts */}
      <Btn title="Titre H2" onClick={() => exec('formatBlock','h2')}><span style={{fontSize:'0.7rem',fontWeight:800}}>H2</span></Btn>
      <Btn title="Titre H3" onClick={() => exec('formatBlock','h3')}><span style={{fontSize:'0.7rem',fontWeight:800}}>H3</span></Btn>
      <Btn title="Paragraphe" onClick={() => exec('formatBlock','p')}><span style={{fontSize:'0.7rem'}}>P</span></Btn>
      <Sep/>

      {/* Font size */}
      <Btn title="Petit texte" onClick={() => exec('fontSize','1')}><span style={{fontSize:'0.62rem',fontWeight:700}}>A</span></Btn>
      <Btn title="Texte moyen" onClick={() => exec('fontSize','3')}><span style={{fontSize:'0.8rem',fontWeight:700}}>A</span></Btn>
      <Btn title="Grand texte" onClick={() => exec('fontSize','5')}><span style={{fontSize:'1rem',fontWeight:700}}>A</span></Btn>
      <Sep/>

      {/* Color picker */}
      <div style={{position:'relative'}}>
        <Btn title="Couleur du texte" onClick={() => { setShowColorPicker(v=>!v); setShowLinkInput(false); }}>
          <Palette size={14}/>
        </Btn>
        {showColorPicker && (
          <div style={{
            position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:200,
            background:'var(--bg-card)', border:'1px solid var(--border-color)',
            borderRadius:'8px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
            padding:'8px', display:'grid', gridTemplateColumns:'repeat(6,22px)', gap:'4px',
          }}>
            {FONT_COLORS.map(c => (
              <button key={c} type="button" onClick={() => { exec('foreColor', c); setShowColorPicker(false); }}
                style={{ width:'22px', height:'22px', borderRadius:'4px', border:'2px solid var(--border-subtle)', background:c, cursor:'pointer' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Link */}
      <div style={{position:'relative'}}>
        <Btn title="Insérer un lien" onClick={() => { setShowLinkInput(v=>!v); setShowColorPicker(false); }}>
          <LinkIcon size={14}/>
        </Btn>
        {showLinkInput && (
          <div style={{
            position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:200,
            background:'var(--bg-card)', border:'1px solid var(--border-color)',
            borderRadius:'8px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
            padding:'8px', display:'flex', gap:'6px', minWidth:'280px',
          }}>
            <input type="url" placeholder="https://..." value={linkUrl} onChange={e=>setLinkUrl(e.target.value)}
              style={{ flex:1, padding:'5px 8px', border:'1px solid var(--border-color)', borderRadius:'5px', fontSize:'0.8rem', background:'var(--bg-surface)', color:'var(--text-primary)' }}
            />
            <button type="button" onClick={insertLink}
              style={{ padding:'5px 10px', background:'var(--primary)', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'0.8rem', fontWeight:700 }}
            >OK</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section Card wrapper                                                */
/* ──────────────────────────────────────────────────────────────────── */
function SectionCard({ title, icon, children }) {
  return (
    <div style={{
      background:'var(--bg-card)', borderRadius:'var(--radius-md)',
      border:'1px solid var(--border-subtle)', overflow:'hidden',
    }}>
      <div style={{
        padding:'13px 20px', background:'var(--bg-surface)',
        borderBottom:'1px solid var(--border-subtle)',
        display:'flex', alignItems:'center', gap:'8px',
        fontSize:'0.9rem', fontWeight:700, color:'var(--secondary)',
      }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'16px' }}>
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Main ProductEditor Component                                        */
/* ──────────────────────────────────────────────────────────────────── */
const defaultCategory = "Matériels de transformation agro-alimentaire";
const defaultForm = {
  name: '',
  category: defaultCategory,
  subcategory: CATEGORIES[defaultCategory][0],
  description: '',
  descriptionHtml: '',
  priceFcfa: 0,
  promoPriceFcfa: '',
  availabilityType: 'stock',   // 'stock' | 'order' | 'both'
  availabilityDays: '',        // e.g. "15" (optional, only for 'order')
  image: '',
  mediaUrls: [],
  specs: {},
  isVisible: true,
};

export default function ProductEditor({ product, onSave, onCancel, lang, showAlert, showConfirm }) {
  const isEn = lang === 'en';
  const editingProduct = product;

  /* Parse existing availability into type+days */
  function parseAvailability(str) {
    if (!str) return { type: 'stock', days: '' };
    if (str === 'En stock') return { type: 'stock', days: '' };
    if (str === 'En stock / Sur commande') return { type: 'both', days: '' };
    // Sur commande (X jours) or Sur commande
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
  }));

  const [activeTab, setActiveTab]   = useState('infos');
  const [isDirty, setIsDirty]       = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [lightboxUrl, setLightboxUrl] = useState(null);
  /* Preview mode: 'card' = catalogue card, 'detail' = full product page */
  const [previewMode, setPreviewMode] = useState('card');

  const editorRef  = useRef(null);
  const fileInputRef = useRef(null);

  const updateForm = useCallback((patch) => {
    setForm(prev => ({ ...prev, ...patch }));
    setIsDirty(true);
  }, []);

  /* Build the availability string for storage */
  const buildAvailability = () => {
    if (form.availabilityType === 'stock') return 'En stock';
    if (form.availabilityType === 'both')  return 'En stock / Sur commande';
    // 'order'
    if (form.availabilityDays) return `Sur commande (${form.availabilityDays} jours)`;
    return 'Sur commande';
  };

  /* Rich-text update */
  useEffect(() => {
    if (activeTab === 'description' && editorRef.current) {
      if (editorRef.current.innerHTML !== form.descriptionHtml) {
        editorRef.current.innerHTML = form.descriptionHtml;
      }
    }
  }, [activeTab]);

  const handleDescriptionUpdate = useCallback(() => {
    if (editorRef.current) {
      updateForm({
        descriptionHtml: editorRef.current.innerHTML,
        description: editorRef.current.innerText,
      });
    }
  }, [updateForm]);

  /* Supabase Storage upload — with client-side validation */
  const MAX_SIZE_MB = 10;
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/quicktime', 'video/webm',
  ];

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadError('');

    const rejected = [];   // files that fail validation
    const valid    = [];   // files that pass

    /* ── Step 1: client-side validation ── */
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        rejected.push(
          isEn
            ? `ERROR: ${file.name} — unsupported type (${file.type})`
            : `ERROR: ${file.name} — type non supporté (${file.type})`
        );
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        rejected.push(
          isEn
            ? `ERROR: ${file.name} — too large (${sizeMB} MB, max ${MAX_SIZE_MB} MB)`
            : `ERROR: ${file.name} — trop lourd (${sizeMB} MB, max ${MAX_SIZE_MB} MB)`
        );
        continue;
      }
      valid.push(file);
    }

    /* ── Step 2: upload valid files ── */
    try {
      const uploaded = [];
      for (const file of valid) {
        const ext  = file.name.split('.').pop().toLowerCase();
        const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from('bevulta-media')
          .upload(path, file, { cacheControl: '3600', upsert: false });

        if (error) {
          rejected.push(
            isEn
              ? `ERROR: ${file.name} — upload failed: ${error.message}`
              : `ERROR: ${file.name} — échec upload : ${error.message}`
          );
          continue;
        }

        const { data } = supabase.storage.from('bevulta-media').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }

      /* Update form with newly uploaded URLs */
      if (uploaded.length > 0) {
        const updated = [...form.mediaUrls, ...uploaded];
        updateForm({ mediaUrls: updated, image: updated[0] || form.image });
      }

      /* ── Step 3: build summary message ── */
      const parts = [];
      if (uploaded.length > 0) {
        parts.push(
          isEn
            ? `SUCCESS: ${uploaded.length} file${uploaded.length > 1 ? 's' : ''} uploaded successfully`
            : `SUCCESS: ${uploaded.length} fichier${uploaded.length > 1 ? 's' : ''} uploadé${uploaded.length > 1 ? 's' : ''} avec succès`
        );
      }
      if (rejected.length > 0) {
        parts.push(...rejected);
      }
      if (parts.length > 0) {
        setUploadError(parts.join('\n'));
      }
    } catch (err) {
      console.error(err);
      setUploadError(
        isEn ? 'Unexpected error: ' + err.message : 'Erreur inattendue : ' + err.message
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeMedia = (idx) => {
    const updated = form.mediaUrls.filter((_, i) => i !== idx);
    updateForm({ mediaUrls: updated, image: updated[0] || '' });
  };

  const moveMedia = (idx, direction) => {
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= form.mediaUrls.length) return;
    const newMedia = [...form.mediaUrls];
    const temp = newMedia[idx];
    newMedia[idx] = newMedia[nextIdx];
    newMedia[nextIdx] = temp;
    updateForm({ mediaUrls: newMedia, image: newMedia[0] || form.image });
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    updateForm({ category: cat, subcategory: CATEGORIES[cat]?.[0] || '' });
  };

  const handleAddSpec = () => {
    if (!newSpecKey || !newSpecVal) return;
    updateForm({ specs: { ...form.specs, [newSpecKey]: newSpecVal } });
    setNewSpecKey(''); setNewSpecVal('');
  };

  const handleRemoveSpec = (key) => {
    const s = { ...form.specs };
    delete s[key];
    updateForm({ specs: s });
  };

  const handleSubmit = () => {
    if (!form.name || (!form.priceFcfa && !form.priceEur)) {
      showAlert(isEn ? 'Please fill in name and price.' : 'Veuillez saisir le nom et le prix de la machine.');
      return;
    }
    const payload = {
      ...form,
      priceFcfa:    Number(form.priceFcfa),
      priceEur:     Math.round(Number(form.priceFcfa) / 655.957),
      promoPriceFcfa: form.promoPriceFcfa ? Number(form.promoPriceFcfa) : null,
      promoPriceEur: form.promoPriceFcfa ? Math.round(Number(form.promoPriceFcfa) / 655.957) : null,
      isVisible:    form.isVisible !== false,
      availability: buildAvailability(),
      image:        form.mediaUrls[0] || form.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      description:  form.descriptionHtml || editorRef.current?.innerHTML || form.description || '',
      id:           editingProduct ? editingProduct.id : Date.now(),
    };
    if (showConfirm) {
      showConfirm(
        isEn ? "Are you sure you want to save these modifications?" : "Voulez-vous vraiment sauvegarder ces modifications ?",
        () => onSave(payload)
      );
    } else {
      onSave(payload);
    }
  };

  const handleCancel = () => {
    if (isDirty && showConfirm) {
      showConfirm(
        isEn ? "You have unsaved changes. Are you sure you want to exit without saving?" : "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?",
        () => onCancel()
      );
    } else {
      onCancel();
    }
  };

  /* ── derived display values ─────────── */
  const displayPrice    = Number(form.priceFcfa) || 0;
  const displayPriceEur = Math.round(displayPrice / 655.957);
  const previewImage    = form.mediaUrls[0] || form.image
    || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800';

  const badgeClass =
    form.category === 'Matériels de transformation agro-alimentaire'        ? 'badge-agro'   :
    form.category === 'Matériels de BTP & Hôpitaux / Construction métallique' ? 'badge-btp'  :
    form.category === 'Matériels de Menuiserie & Boulangerie'               ? 'badge-menu'   : 'badge-special';

  const availText = buildAvailability();
  const isInStock = form.availabilityType === 'stock' || form.availabilityType === 'both';

  /* Checklist & Navigation */
  const handleChecklistClick = (tabId, inputId) => {
    setActiveTab(tabId);
    if (inputId) {
      setTimeout(() => {
        const el = document.getElementById(inputId);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 80);
    }
  };

  const checks = [
    { id: 'name', tab: 'infos', inputId: 'editor-name', label: isEn ? 'Machine name' : 'Nom de la machine', done: !!form.name },
    { id: 'category', tab: 'infos', inputId: 'editor-category', label: isEn ? 'Category assigned' : 'Catégorie assignée', done: !!form.category },
    { id: 'description', tab: 'description', inputId: 'editor-description', label: isEn ? 'Description written' : 'Description rédigée', done: form.description?.length > 20 },
    { id: 'price', tab: 'infos', inputId: 'editor-price', label: isEn ? 'Price set' : 'Prix défini', done: displayPrice > 0 },
    { id: 'image', tab: 'media', inputId: null, label: isEn ? 'Image added' : 'Image ajoutée', done: form.mediaUrls.length > 0 || !!form.image },
    { id: 'specs', tab: 'specs', inputId: 'editor-spec-key', label: isEn ? 'Specs added' : 'Spécifications ajoutées', done: Object.keys(form.specs||{}).length > 0 },
  ];
  const completionPct = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

  /* ── TABS definition ─────────────────────── */
  const TABS = [
    { id:'infos',       label: isEn ? ' Informations' : ' Informations'   },
    { id:'description', label: isEn ? ' Description'  : ' Description'    },
    { id:'media',       label: isEn ? ' Photos/Vidéos': ' Photos/Vidéos' },
    { id:'specs',       label: isEn ? ' Tech Specs'   : ' Spécifications' },
  ];

  /* ═══════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:300,
      background:'var(--bg-app)', display:'flex', flexDirection:'column',
      animation:'fadeIn 0.2s ease',
    }}>
      {/* ── Top Bar ── */}
      <div style={{
        height:'60px', background:'var(--bg-card)',
        borderBottom:'1px solid var(--border-subtle)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px', flexShrink:0, boxShadow:'var(--shadow-sm)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <button type="button" onClick={handleCancel}
            style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 14px',
              border:'1px solid var(--border-subtle)', borderRadius:'8px', background:'transparent',
              cursor:'pointer', color:'var(--text-secondary)', fontSize:'0.875rem', fontWeight:600 }}>
            <ArrowLeft size={16}/>
            {isEn ? 'Back' : 'Retour'}
          </button>
          <div style={{ height:'24px', width:'1px', background:'var(--border-subtle)' }}/>
          <div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:'var(--secondary)', fontFamily:'var(--font-heading)' }}>
              {editingProduct ? (isEn ? ' Edit Machine' : ' Modifier la Machine') : (isEn ? ' New Machine' : ' Nouvelle Machine')}
            </div>
            {isDirty && <div style={{ fontSize:'0.7rem', color:'var(--warning)', fontWeight:600 }}>● Non sauvegardé</div>}
          </div>
        </div>

        {/* Completion + Save */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:600 }}>{completionPct}%</div>
            <div style={{ width:'80px', height:'6px', background:'var(--bg-surface)', borderRadius:'99px', overflow:'hidden' }}>
              <div style={{ width:`${completionPct}%`, height:'100%', background: completionPct === 100 ? 'var(--success)' : 'var(--primary)', borderRadius:'99px', transition:'width 0.4s' }}/>
            </div>
          </div>
          <button type="button" onClick={handleSubmit}
            style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 22px',
              background:'var(--primary)', color:'white', border:'none', borderRadius:'8px',
              cursor:'pointer', fontWeight:700, fontSize:'0.9rem',
              boxShadow:'0 4px 14px rgba(37,99,235,0.35)' }}>
            <Save size={16}/>
            {editingProduct ? (isEn ? 'Save' : 'Sauvegarder') : (isEn ? 'Publish' : 'Publier')}
          </button>
        </div>
      </div>

      {/* ── Split Body ── */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 400px', overflow:'hidden' }}>

        {/* ════════ LEFT: FORM ════════ */}
        <div style={{ overflowY:'auto', padding:'24px 28px', borderRight:'1px solid var(--border-subtle)' }}>

          {/* Tab bar */}
          <div style={{ display:'flex', gap:'4px', marginBottom:'24px', background:'var(--bg-surface)', padding:'4px', borderRadius:'10px' }}>
            {TABS.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                style={{
                  flex:1, padding:'8px 6px', border:'none', borderRadius:'7px', cursor:'pointer',
                  fontWeight:700, fontSize:'0.78rem', transition:'all 0.2s',
                  background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                  color:      activeTab === tab.id ? 'var(--primary)'  : 'var(--text-muted)',
                  boxShadow:  activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── TAB: INFOS ─── */}
          {activeTab === 'infos' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'20px', animation:'fadeIn 0.2s ease' }}>
              <SectionCard title={isEn ? "Machine Identity" : "Identité"} icon="">
                <div className="form-group">
                  <label className="form-label">{isEn ? 'Machine Name *' : 'Nom de la machine *'}</label>
                  <input type="text" className="form-input" required id="editor-name"
                    placeholder="Ex: Complexe de Karité Premium"
                    value={form.name} onChange={e => updateForm({ name: e.target.value })}/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'16px' }}>
                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Category' : 'Catégorie'}</label>
                    <select className="form-input" id="editor-category" value={form.subcategory} onChange={(e) => {
                      const sub = e.target.value;
                      const cat = CATEGORY_KEYS.find(k => CATEGORIES[k].includes(sub));
                      updateForm({ category: cat, subcategory: sub });
                    }}>
                      {CATEGORY_KEYS.map(cat => (
                        <optgroup key={cat} label={cat}>
                          {CATEGORIES[cat].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'4px' }}>
                  <input type="checkbox" id="editor-visible"
                    checked={form.isVisible !== false}
                    onChange={e => updateForm({ isVisible: e.target.checked })}
                    style={{ width:'18px', height:'18px', cursor:'pointer' }}/>
                  <label htmlFor="editor-visible" style={{ fontWeight:600, fontSize:'0.88rem', cursor:'pointer', color:'var(--text-primary)' }}>
                    {isEn ? 'Visible on the site' : 'Afficher sur le site (Visible)'}
                  </label>
                </div>
              </SectionCard>

              <SectionCard title={isEn ? "Pricing & Availability" : "Prix & Disponibilité"} icon="">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Normal Price FCFA *' : 'Prix Normal FCFA *'}</label>
                    <input type="number" className="form-input" required min="0" id="editor-price"
                      value={form.priceFcfa} onChange={e => updateForm({ priceFcfa: e.target.value })}/>
                    {displayPrice > 0 && (
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:'4px' }}>
                        ≈ {displayPriceEur.toLocaleString()} €
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Promo Price FCFA (Optional)' : 'Prix Promo FCFA (Optionnel)'}</label>
                    <input type="number" className="form-input" min="0" id="editor-promo-price"
                      placeholder={isEn ? "No promo" : "Pas de promo"}
                      value={form.promoPriceFcfa || ''} onChange={e => updateForm({ promoPriceFcfa: e.target.value })}/>
                    {Number(form.promoPriceFcfa) > 0 && (
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:'4px' }}>
                        ≈ {Math.round(Number(form.promoPriceFcfa) / 655.957).toLocaleString()} €
                      </div>
                    )}
                  </div>
                </div>

                {/* Simplified availability — 3 choices */}
                <div className="form-group">
                  <label className="form-label">{isEn ? 'Availability' : 'Disponibilité'}</label>
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    {[
                      { value:'stock', label: isEn ? 'In Stock' : 'En stock' },
                      { value:'order', label: isEn ? 'Made to Order' : 'Sur commande' },
                      { value:'both',  label: isEn ? 'In Stock / Made to Order' : 'En stock / Sur commande' },
                    ].map(opt => (
                      <label key={opt.value} style={{
                        display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px',
                        border:`2px solid ${form.availabilityType === opt.value ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        borderRadius:'8px', cursor:'pointer', fontWeight:600, fontSize:'0.88rem',
                        background: form.availabilityType === opt.value ? 'var(--primary-light)' : 'var(--bg-surface)',
                        color: form.availabilityType === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                        transition:'all 0.15s',
                      }}>
                        <input type="radio" name="availability" value={opt.value}
                          checked={form.availabilityType === opt.value}
                          onChange={() => updateForm({ availabilityType: opt.value })}
                          style={{ display:'none' }}/>
                        <div style={{
                          width:'16px', height:'16px', borderRadius:'50%', flexShrink:0,
                          border:`2px solid ${form.availabilityType === opt.value ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          background: form.availabilityType === opt.value ? 'var(--primary)' : 'transparent',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          {form.availabilityType === opt.value && <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'white' }}/>}
                        </div>
                        {opt.label}
                      </label>
                    ))}
                  </div>

                  {/* Optional days input — only for "Sur commande" */}
                  {form.availabilityType === 'order' && (
                    <div style={{ marginTop:'12px', animation:'fadeIn 0.2s ease' }}>
                      <label className="form-label" style={{ fontSize:'0.8rem' }}>
                        {isEn ? 'Delivery delay (optional)' : 'Délai de livraison (optionnel)'}
                      </label>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <input type="number" className="form-input" min="1" max="365"
                          placeholder={isEn ? 'e.g. 20' : 'ex: 20'}
                          value={form.availabilityDays}
                          onChange={e => updateForm({ availabilityDays: e.target.value })}
                          style={{ maxWidth:'100px' }}/>
                        <span style={{ fontSize:'0.85rem', color:'var(--text-muted)', fontWeight:600 }}>
                          {isEn ? 'days' : 'jours'}
                        </span>
                        {form.availabilityDays && (
                          <span style={{ fontSize:'0.8rem', color:'var(--warning)', fontWeight:700 }}>
                            → {isEn ? 'Made to Order' : 'Sur commande'} ({form.availabilityDays} {isEn ? 'days' : 'jours'})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ─── TAB: DESCRIPTION ─── */}
          {activeTab === 'description' && (
            <div style={{ animation:'fadeIn 0.2s ease' }}>
              <SectionCard title={isEn ? "Commercial Description" : "Description Commerciale"} icon="">
                <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'4px' }}>
                  {isEn ? 'Format your text using the toolbar below.' : 'Formatez votre texte avec la barre d\'outils ci-dessous.'}
                </p>
                <RichTextToolbar editorRef={editorRef} onUpdate={handleDescriptionUpdate}/>
                <div
                  ref={editorRef}
                  id="editor-description"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleDescriptionUpdate}
                  style={{
                    minHeight:'240px', padding:'16px',
                    border:'1px solid var(--border-color)', borderTop:'none',
                    borderRadius:'0 0 8px 8px',
                    background:'var(--bg-card)', color:'var(--text-primary)',
                    fontSize:'0.92rem', lineHeight:'1.75',
                    outline:'none',
                    /* Fix cursor/caret position — text always flows left-to-right */
                    direction:'ltr', textAlign:'left', unicodeBidi:'plaintext',
                    cursor:'text',
                  }}
                />
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', textAlign:'right', marginTop:'4px' }}>
                  {form.description?.length || 0} {isEn ? 'characters' : 'caractères'}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ─── TAB: MEDIA (real uploads) ─── */}
          {activeTab === 'media' && (
            <div style={{ animation:'fadeIn 0.2s ease' }}>
              <SectionCard title={isEn ? "Photos & Videos" : "Photos & Vidéos"} icon="">
                <p style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
                  {isEn
                    ? 'Upload your photos or videos directly. The first image becomes the main thumbnail.'
                    : 'Téléchargez vos photos ou vidéos directement. La 1ʳᵉ image devient la vignette principale.'}
                </p>

                {/* Drop zone / Upload button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border:`2px dashed ${uploading ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius:'12px', padding:'32px', textAlign:'center', cursor:'pointer',
                    background: uploading ? 'var(--primary-light)' : 'var(--bg-surface)',
                    transition:'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                  onMouseLeave={e => !uploading && (e.currentTarget.style.background = 'var(--bg-surface)')}
                >
                  {uploading ? (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
                      <Loader size={28} className="spin" color="var(--primary)"/>
                      <span style={{ fontWeight:600, color:'var(--primary)' }}>
                        {isEn ? 'Uploading to Supabase…' : 'Upload vers Supabase…'}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
                      <Upload size={28} color="var(--primary)"/>
                      <div style={{ fontWeight:700, color:'var(--secondary)', fontSize:'0.95rem' }}>
                        {isEn ? 'Click to upload photos or videos' : 'Cliquez pour uploader des photos ou vidéos'}
                      </div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
                        JPG, PNG, WebP, MP4, MOV — {isEn ? 'multiple files accepted' : 'plusieurs fichiers acceptés'}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef} type="file" multiple hidden
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                />

                {uploadError && (
                  <div style={{
                    padding:'12px 14px',
                    background: uploadError.startsWith('SUCCESS:') && !uploadError.includes('ERROR:')
                      ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${uploadError.startsWith('SUCCESS:') && !uploadError.includes('ERROR:')
                      ? 'rgba(16,185,129,0.4)' : 'var(--danger)'}`,
                    borderRadius:'8px', fontSize:'0.82rem',
                    color: uploadError.startsWith('SUCCESS:') && !uploadError.includes('ERROR:')
                      ? 'var(--success)' : 'var(--text-primary)',
                    whiteSpace: 'pre-line', lineHeight: '1.7',
                  }}>
                    {uploadError}
                  </div>
                )}

                {/* Media grid */}
                {form.mediaUrls.length > 0 && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:'12px', marginTop:'8px' }}>
                    {form.mediaUrls.map((url, idx) => (
                      <div key={url} style={{
                        position:'relative', borderRadius:'10px', overflow:'hidden',
                        border:'2px solid',
                        borderColor: idx === 0 ? 'var(--primary)' : 'var(--border-subtle)',
                        aspectRatio:'4/3', background:'var(--bg-surface)',
                        cursor: 'pointer',
                      }}>
                        {/* Media click opens lightbox */}
                        <div onClick={() => setLightboxUrl(url)} style={{ width:'100%', height:'100%' }}>
                          {url.match(/\.(mp4|mov|webm)/i) ? (
                            <video src={url} style={{ width:'100%', height:'100%', objectFit:'cover' }} muted/>
                          ) : (
                            <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                              onError={e => { e.target.src = 'https://via.placeholder.com/130x98?text=ERROR:'; }}/>
                          )}
                        </div>

                        {/* Badges and controls */}
                        {idx === 0 && (
                          <div style={{ position:'absolute', top:'8px', left:'8px', background:'var(--primary)', color:'white', fontSize:'0.6rem', fontWeight:800, padding:'3px 6px', borderRadius:'4px', pointerEvents:'none' }}>
                            {isEn ? 'MAIN' : 'PRINCIPAL'}
                          </div>
                        )}

                        {/* Top right: Delete button */}
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeMedia(idx); }}
                          style={{
                            position:'absolute', top:'8px', right:'8px', width:'26px', height:'26px',
                            borderRadius:'50%', border:'none', background:'rgba(239,68,68,0.95)',
                            color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                            boxShadow:'0 2px 6px rgba(0,0,0,0.15)', transition:'transform 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <Trash2 size={13}/>
                        </button>

                        {/* Bottom overlay: Move controls */}
                        <div style={{
                          position:'absolute', bottom:'6px', left:'50%', transform:'translateX(-50%)',
                          display:'flex', gap:'4px', background:'rgba(15,23,42,0.75)',
                          padding:'3px 6px', borderRadius:'20px', backdropFilter:'blur(4px)',
                        }} onClick={e => e.stopPropagation()}>
                          <button type="button" disabled={idx === 0}
                            onClick={() => moveMedia(idx, -1)}
                            style={{
                              background:'transparent', border:'none', color:'white', cursor: idx === 0 ? 'default' : 'pointer',
                              opacity: idx === 0 ? 0.3 : 1, display:'flex', alignItems:'center', justifyContent:'center',
                              padding:'2px',
                            }}>
                            <ChevronLeft size={16}/>
                          </button>
                          <div style={{ width:'1px', background:'rgba(255,255,255,0.2)', margin:'0 2px' }}/>
                          <button type="button" disabled={idx === form.mediaUrls.length - 1}
                            onClick={() => moveMedia(idx, 1)}
                            style={{
                              background:'transparent', border:'none', color:'white', cursor: idx === form.mediaUrls.length - 1 ? 'default' : 'pointer',
                              opacity: idx === form.mediaUrls.length - 1 ? 0.3 : 1, display:'flex', alignItems:'center', justifyContent:'center',
                              padding:'2px',
                            }}>
                            <ChevronRight size={16}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {form.mediaUrls.length === 0 && !uploading && (
                  <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.82rem', fontStyle:'italic' }}>
                    {isEn ? 'No media uploaded yet.' : 'Aucun média uploadé pour l\'instant.'}
                  </div>
                )}


              </SectionCard>
            </div>
          )}

          {/* ─── TAB: SPECS ─── */}
          {activeTab === 'specs' && (
            <div style={{ animation:'fadeIn 0.2s ease' }}>
              <SectionCard title={isEn ? "Technical Specifications" : "Spécifications Techniques"} icon="">
                <p style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
                  {isEn
                    ? 'Key-value specs shown in the product card and comparison table.'
                    : 'Les specs clé-valeur s\'affichent dans la fiche produit et le comparateur.'}
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {Object.entries(form.specs || {}).map(([key, val]) => (
                    <div key={key} style={{
                      display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'8px', alignItems:'center',
                      padding:'10px 14px', background:'var(--bg-surface)', borderRadius:'8px', border:'1px solid var(--border-subtle)',
                    }}>
                      <span style={{ fontWeight:700, fontSize:'0.85rem', color:'var(--secondary)' }}>{key}</span>
                      <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{val}</span>
                      <button type="button" onClick={() => handleRemoveSpec(key)}
                        style={{ color:'var(--danger)', border:'none', background:'none', cursor:'pointer', padding:'2px' }}>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))}
                  {Object.keys(form.specs || {}).length === 0 && (
                    <div style={{ textAlign:'center', padding:'16px', color:'var(--text-muted)', fontSize:'0.85rem' }}>
                      {isEn ? 'No specifications yet.' : 'Aucune spécification.'}
                    </div>
                  )}
                </div>
                {/* Add spec */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'10px', alignItems:'flex-end' }}>
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label className="form-label" style={{ fontSize:'0.75rem' }}>{isEn ? 'Spec Name' : 'Caractéristique'}</label>
                    <input type="text" className="form-input" placeholder={isEn ? "Ex: Power" : "Ex: Puissance"} id="editor-spec-key"
                      value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}/>
                  </div>
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label className="form-label" style={{ fontSize:'0.75rem' }}>{isEn ? 'Value' : 'Valeur'}</label>
                    <input type="text" className="form-input" placeholder={isEn ? "Ex: 12 HP" : "Ex: 12 CV"} id="editor-spec-val"
                      value={newSpecVal} onChange={e => setNewSpecVal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}/>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleAddSpec} style={{ padding:'10px 14px' }}>
                    <Plus size={16}/>
                  </button>
                </div>
              </SectionCard>
            </div>
          )}
        </div>

        {/* ════════ RIGHT: COMPLETENESS SIDEBAR ════════ */}
        <div style={{
          background:'var(--bg-surface)', display:'flex', flexDirection:'column',
          borderLeft:'1px solid var(--border-subtle)',
        }}>
          {/* Header */}
          <div style={{
            padding:'16px 20px', background:'var(--bg-card)',
            borderBottom:'1px solid var(--border-subtle)', flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                {isEn ? 'Completeness' : 'Complétude'}
              </div>
              <div style={{ fontSize:'1rem', fontWeight:900, color: completionPct === 100 ? 'var(--success)' : 'var(--primary)' }}>
                {completionPct}%
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height:'8px', background:'var(--bg-app)', borderRadius:'99px', overflow:'hidden' }}>
              <div style={{
                width:`${completionPct}%`, height:'100%', borderRadius:'99px',
                background: completionPct === 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), #7c3aed)',
                transition:'width 0.5s ease',
              }}/>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:'8px' }}>
            {checks.map(({ label, done, tab, inputId }) => (
              <div
                key={label}
                className="checklist-item"
                onClick={() => handleChecklistClick(tab, inputId)}
                style={{
                  display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px',
                  borderRadius:'10px', border:`1px solid ${done ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`,
                  background: done ? 'rgba(16,185,129,0.07)' : 'var(--bg-card)',
                  transition:'all 0.25s ease',
                }}
              >
                <div style={{
                  width:'22px', height:'22px', borderRadius:'50%', flexShrink:0,
                  background: done ? 'var(--success)' : 'var(--bg-surface)',
                  border:`2px solid ${done ? 'var(--success)' : 'var(--border-subtle)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.25s ease',
                }}>
                  {done && <Check size={12} color="white" strokeWidth={3}/>}
                </div>
                <span style={{
                  fontSize:'0.83rem', fontWeight: done ? 600 : 500,
                  color: done ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>{label}</span>
              </div>
            ))}

            {/* Encouragement message */}
            {completionPct === 100 && (
              <div style={{
                marginTop:'8px', padding:'14px', borderRadius:'10px', textAlign:'center',
                background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)',
              }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'4px' }}></div>
                <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--success)' }}>
                  {isEn ? 'Ready to publish!' : 'Prêt à publier !'}
                </div>
              </div>
            )}
            {completionPct < 100 && (
              <div style={{
                marginTop:'8px', padding:'12px', borderRadius:'10px',
                background:'var(--bg-card)', border:'1px solid var(--border-subtle)',
                fontSize:'0.78rem', color:'var(--text-muted)', lineHeight:1.6, textAlign:'center',
              }}>
                {isEn
                  ? `${checks.filter(c => !c.done).length} item${checks.filter(c => !c.done).length > 1 ? 's' : ''} remaining before publishing.`
                  : `${checks.filter(c => !c.done).length} élément${checks.filter(c => !c.done).length > 1 ? 's' : ''} restant${checks.filter(c => !c.done).length > 1 ? 's' : ''} avant la publication.`
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position:'fixed', inset:0, zIndex:500,
            background:'rgba(15,23,42,0.95)', display:'flex',
            alignItems:'center', justifyContent:'center',
            padding:'20px', animation:'fadeIn 0.2s ease',
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            style={{
              position:'absolute', top:'20px', right:'20px',
              background:'rgba(255,255,255,0.1)', border:'none',
              borderRadius:'50%', width:'40px', height:'40px',
              color:'white', fontSize:'1.2rem', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ✕
          </button>
          <div style={{ maxWidth:'90vw', maxHeight:'85vh', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={e => e.stopPropagation()}>
            {lightboxUrl.match(/\.(mp4|mov|webm)/i) ? (
              <video src={lightboxUrl} style={{ maxWidth:'100%', maxHeight:'85vh', borderRadius:'8px', boxShadow:'0 12px 40px rgba(0,0,0,0.5)' }} controls autoPlay/>
            ) : (
              <img src={lightboxUrl} alt="" style={{ maxWidth:'100%', maxHeight:'85vh', objectFit:'contain', borderRadius:'8px', boxShadow:'0 12px 40px rgba(0,0,0,0.5)' }}/>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .checklist-item {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .checklist-item:hover {
          border-color: var(--primary) !important;
          background: var(--bg-surface) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
