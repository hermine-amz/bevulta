import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  Layers, 
  BookOpen, 
  Image as ImageIcon, 
  FileText, 
  Download,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  X,
  CreditCard,
  Sliders,
  ShieldCheck,
  Upload,
  Loader
} from 'lucide-react';
import { EBOOK_CATEGORIES } from '../data/initialEbooks';
import { processImageUpload } from '../utils/imageUploadHelper';

const PRESET_COVERS = [
  { label: "Agro-alimentaire", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700" },
  { label: "Karité / Usine", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=700" },
  { label: "Moteur Diesel / Mécanique", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=700" },
  { label: "Provenderie / Grains", url: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=700" },
  { label: "BTP / Matériaux", url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=700" },
  { label: "Pack Livres / Collection", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700" },
  { label: "Atelier / Industrie", url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=700" },
  { label: "Construction BTP", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=700" }
];

export default function EbookEditor({ ebook, onSave, onCancel, allEbooks = [], lang = 'fr', showConfirm, showAlert }) {
  const isEn = lang === 'en';

  // Form State
  const [isPack, setIsPack] = useState(ebook?.isPack || false);
  const [title, setTitle] = useState(ebook?.title || '');
  const [subtitle, setSubtitle] = useState(ebook?.subtitle || '');
  const [category, setCategory] = useState(ebook?.category || (isPack ? "Packs Complets" : "Agro-alimentaire"));
  const [description, setDescription] = useState(ebook?.description || '');
  const [author, setAuthor] = useState(ebook?.author || "Bureau d'Études BEVULTA");
  const [pages, setPages] = useState(ebook?.pages || (isPack ? "Pack de 2 Volumes" : "200 pages"));
  const [fileFormat, setFileFormat] = useState(ebook?.fileFormat || "PDF Haute Définition");
  const [badge, setBadge] = useState(ebook?.badge || (isPack ? "Pack Économique" : "Nouveau"));
  
  // Pricing
  const [priceFcfa, setPriceFcfa] = useState(ebook?.priceFcfa || 15000);
  const [priceEur, setPriceEur] = useState(ebook?.priceEur || Math.round((ebook?.priceFcfa || 15000) / 655.957));
  const [hasPromo, setHasPromo] = useState(Boolean(ebook?.promoPriceFcfa));
  const [promoPriceFcfa, setPromoPriceFcfa] = useState(ebook?.promoPriceFcfa || '');
  const [promoPriceEur, setPromoPriceEur] = useState(ebook?.promoPriceEur || '');

  // Media
  const [coverImage, setCoverImage] = useState(
    ebook?.coverImage || (isPack ? PRESET_COVERS[5].url : PRESET_COVERS[0].url)
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(ebook?.downloadUrl || '');
  const [paymentLink, setPaymentLink] = useState(ebook?.paymentLink || '');
  
  // Visibility & Featured
  const [isVisible, setIsVisible] = useState(ebook?.isVisible !== false);
  const [featured, setFeatured] = useState(Boolean(ebook?.featured));

  // Included books if Pack
  const [includedBooks, setIncludedBooks] = useState(
    ebook?.includedBooks && ebook.includedBooks.length > 0 ? ebook.includedBooks : []
  );
  const [newBookItem, setNewBookItem] = useState('');

  // UI Navigation states
  const [activeTab, setActiveTab] = useState('infos');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePriceFcfaChange = (val) => {
    const num = Number(val);
    setPriceFcfa(num);
    setPriceEur(Math.round(num / 655.957));
  };

  const handlePromoPriceFcfaChange = (val) => {
    if (!val) {
      setPromoPriceFcfa('');
      setPromoPriceEur('');
      return;
    }
    const num = Number(val);
    setPromoPriceFcfa(num);
    setPromoPriceEur(Math.round(num / 655.957));
  };

  const addIncludedBook = (titleToAdd) => {
    if (!titleToAdd || !titleToAdd.trim()) return;
    if (!includedBooks.includes(titleToAdd.trim())) {
      setIncludedBooks([...includedBooks, titleToAdd.trim()]);
    }
    setNewBookItem('');
  };

  const removeIncludedBook = (index) => {
    setIncludedBooks(includedBooks.filter((_, i) => i !== index));
  };

  const handleTogglePack = (packValue) => {
    setIsPack(packValue);
    if (packValue && category !== "Packs Complets") {
      setCategory("Packs Complets");
      if (!badge) setBadge("Pack Bestseller");
    } else if (!packValue && category === "Packs Complets") {
      setCategory("Agro-alimentaire");
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      if (showAlert) showAlert(isEn ? "Please enter a title." : "Veuillez saisir un titre.");
      else alert(isEn ? "Please enter a title." : "Veuillez saisir un titre.");
      return;
    }

    const payload = {
      id: ebook?.id || Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      isPack,
      includedBooks: isPack ? includedBooks : [],
      priceFcfa: Number(priceFcfa) || 0,
      priceEur: Number(priceEur) || Math.round((Number(priceFcfa) || 0) / 655.957),
      promoPriceFcfa: hasPromo && promoPriceFcfa ? Number(promoPriceFcfa) : null,
      promoPriceEur: hasPromo && promoPriceFcfa ? (Number(promoPriceEur) || Math.round(Number(promoPriceFcfa) / 655.957)) : null,
      coverImage: coverImage.trim() || PRESET_COVERS[0].url,
      downloadUrl: downloadUrl.trim(),
      paymentLink: paymentLink.trim(),
      pages: pages.trim() || (isPack ? "Pack de livres" : "200 pages"),
      fileFormat: fileFormat.trim() || "PDF Haute Définition",
      language: "Français",
      author: author.trim() || "BEVULTA",
      badge: badge.trim(),
      isVisible,
      featured
    };

    if (showConfirm) {
      showConfirm(
        isEn 
          ? (ebook ? "Do you want to save modifications to this e-book / pack?" : "Do you want to publish this new e-book / pack?")
          : (ebook ? "Voulez-vous enregistrer les modifications apportées à cet e-book / pack ?" : "Voulez-vous publier ce nouvel e-book / pack ?"),
        () => onSave(payload)
      );
    } else {
      onSave(payload);
    }
  };

  const handleCancelWithConfirm = () => {
    if (showConfirm) {
      showConfirm(
        isEn ? "Are you sure you want to exit? Any unsaved changes will be lost." : "Voulez-vous vraiment quitter l'éditeur ? Les modifications non enregistrées seront perdues.",
        onCancel
      );
    } else {
      onCancel();
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + `/#ebooks?search=${encodeURIComponent(title || '')}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const tabs = [
    { id: 'infos', label: isEn ? 'Information' : 'Informations', icon: <FileText size={18} /> },
    { id: 'pricing', label: isEn ? 'Pricing & Promo' : 'Tarification & Promo', icon: <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>$</span> },
    { id: 'files', label: isEn ? 'Files & PDF' : 'Fichiers & Téléchargement', icon: <Download size={18} /> },
    { id: 'description', label: isEn ? 'Description' : 'Description & Contenu', icon: <BookOpen size={18} /> },
    { id: 'media', label: isEn ? 'Cover & Design' : 'Couverture & Design', icon: <ImageIcon size={18} /> },
    { id: 'payment', label: isEn ? 'Payment Link' : 'Lien GeniusPay / Direct', icon: <CreditCard size={18} /> },
    { id: 'options', label: isEn ? 'Options' : 'Options & Visibilité', icon: <Sliders size={18} /> },
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
        {/* Left: Back + E-book Title + Copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <button
            type="button"
            onClick={handleCancelWithConfirm}
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
              {title || (isEn ? "Untitled E-book" : "Nouveau Guide Technique")}
            </h1>
            <button
              type="button"
              onClick={handleCopyLink}
              title={copiedLink ? "Copié !" : "Copier le lien e-book"}
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

          {/* Publier l'E-book (Gold button like screenshot) */}
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
              background: '#eab308',
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
                  <span>{isEn ? "Copy E-book Link" : "Copier le lien"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelWithConfirm}
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

      {/* ── TWO-COLUMN BODY ── */}
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
                  background: isActive ? '#1e293b' : 'transparent',
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
                  {isEn ? "E-Book Details" : "Détails du guide ou formation"}
                </h2>

                {/* Offer Type Selector Pill */}
                <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleTogglePack(false)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: !isPack ? '2px solid #166534' : '1px solid #cbd5e1',
                      background: !isPack ? '#f0fdf4' : '#ffffff',
                      color: !isPack ? '#166534' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      fontWeight: !isPack ? 800 : 500,
                    }}
                  >
                    <BookOpen size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.92rem' }}>E-book Individuel</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Vente d'un manuel unique</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePack(true)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: isPack ? '2px solid #d97706' : '1px solid #cbd5e1',
                      background: isPack ? '#fffbeb' : '#ffffff',
                      color: isPack ? '#b45309' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      fontWeight: isPack ? 800 : 500,
                    }}
                  >
                    <Layers size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.92rem' }}>Pack d'E-books (Bundle)</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Regroupement multi-livres</div>
                    </div>
                  </button>
                </div>

                {/* Titre */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    {isEn ? "Title *" : "Titre du livre ou du Pack *"}
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={isPack ? "Ex: Pack Intégral Agro-Industrie (4 E-books)" : "Ex: Guide Pratique de la Transformation de Karité"}
                      style={{
                        width: '100%',
                        padding: '13px 44px 13px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.94rem',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                    <div style={{ position: 'absolute', right: '12px', color: '#94a3b8' }}>
                      <Sparkles size={18} />
                    </div>
                  </div>
                </div>

                {/* Sous-titre */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    {isEn ? "Subtitle / Tagline :" : "Sous-titre / Accroche :"}
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ex: Procédés industriels, ratios matières premières et rentabilité financière"
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.94rem', outline: 'none' }}
                  />
                </div>

                {/* Catégorie & Auteur */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {isEn ? "Category *" : "Catégorie *"}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.94rem', outline: 'none', background: '#ffffff', cursor: 'pointer' }}
                    >
                      {EBOOK_CATEGORIES.filter(c => c !== 'Tous').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {isEn ? "Author / Department :" : "Auteur / Département :"}
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Bureau d'Études BEVULTA"
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.94rem' }}
                    />
                  </div>
                </div>

                {/* Pack Included Books Picker */}
                {isPack && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                      Livres inclus dans ce Pack ({includedBooks.length}) :
                    </h4>

                    {includedBooks.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                        {includedBooks.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}>
                            <span style={{ fontWeight: 600 }}>📖 {item}</span>
                            <button
                              type="button"
                              onClick={() => removeIncludedBook(idx)}
                              style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 700 }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={newBookItem}
                        onChange={(e) => setNewBookItem(e.target.value)}
                        placeholder="Ajouter un titre de livre inclus..."
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => addIncludedBook(newBookItem)}
                        style={{ padding: '10px 18px', background: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        + Ajouter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════ TAB 2: TARIFICATION ════════ */}
            {activeTab === 'pricing' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Pricing & Currency" : "Tarification & Promotion"}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {isEn ? "Price (FCFA) *" : "Prix Officiel de Vente (FCFA) *"}
                    </label>
                    <input
                      type="number"
                      required
                      value={priceFcfa}
                      onChange={(e) => handlePriceFcfaChange(e.target.value)}
                      placeholder="Ex: 15000"
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
                      value={priceEur}
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '1rem', fontWeight: 700 }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                      Calcul automatique pour les cartes bancaires internationales.
                    </span>
                  </div>
                </div>

                {/* Promotion Toggle Card */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Activer un prix promotionnel barré</span>
                      <span style={{ color: '#ea580c' }}>⚡</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                      Affiche l'ancien prix barré pour mettre en valeur la réduction.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasPromo}
                    onChange={(e) => setHasPromo(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#1e293b', cursor: 'pointer' }}
                  />
                </div>

                {hasPromo && (
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', animation: 'fadeIn 0.2s ease' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Prix promotionnel remisé (FCFA) :
                    </label>
                    <input
                      type="number"
                      value={promoPriceFcfa}
                      onChange={(e) => handlePromoPriceFcfaChange(e.target.value)}
                      placeholder="Ex: 10000"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ════════ TAB 3: FICHIERS & TÉLÉCHARGEMENT ════════ */}
            {activeTab === 'files' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Downloadable Files & Security" : "Fichiers & Sécurité Anti-Fuite"}
                </h2>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Lien direct de téléchargement du fichier PDF :
                  </label>
                  <input
                    type="url"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="https://drive.google.com/... ou lien direct du PDF"
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.94rem' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '6px' }}>
                    💡 Si laissé vide, le système génère un manuel d'ingénierie authentique signé BEVULTA avec filigrane nominatif.
                  </span>
                </div>

                {/* Watermark Security Notice Box */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#166534', margin: '0 0 4px 0' }}>
                      Protection dynamique anti-partage activée
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#14532d', lineHeight: 1.5, margin: 0 }}>
                      Chaque fichier téléchargé par un client est automatiquement marqué au centre de toutes les pages avec son e-mail, son numéro de téléphone réel et l'horodatage exact. Aucune alerte anxiogène n'est montrée au client : la protection est discrète et dissuasive.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ════════ TAB 4: DESCRIPTION & SOMMAIRE ════════ */}
            {activeTab === 'description' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Content & Curriculum" : "Présentation du guide & Sommaire"}
                </h2>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Description complète du guide ou de la formation :
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Détaillez les compétences enseignées, les plans techniques inclus, les procédés industriels et le retour sur investissement..."
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.94rem', lineHeight: 1.5 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Pagination / Volume :
                    </label>
                    <input
                      type="text"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="Ex: 180 pages + Plans DAO"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Format du document :
                    </label>
                    <input
                      type="text"
                      value={fileFormat}
                      onChange={(e) => setFileFormat(e.target.value)}
                      placeholder="PDF Haute Définition A4"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════════ TAB 5: COUVERTURE & DESIGN ════════ */}
            {activeTab === 'media' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Cover Image & Branding" : "Image de Couverture"}
                </h2>

                {/* Upload direct depuis la galerie ou les fichiers */}
                <div style={{ marginBottom: '24px', padding: '18px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    {isEn ? "Upload cover from your device (Gallery / File explorer):" : "Téléverser directement depuis votre appareil (Galerie / Fichiers) :"}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 20px',
                      borderRadius: '10px',
                      background: '#166534',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: uploadingCover ? 'wait' : 'pointer',
                      boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)'
                    }}>
                      {uploadingCover ? <Loader className="animate-spin" size={17} /> : <Upload size={17} />}
                      <span>{uploadingCover ? (isEn ? "Uploading..." : "Téléversement...") : (isEn ? "Select from Files / Gallery" : "Choisir une Photo (Galerie / Fichiers)")}</span>
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
                            const url = await processImageUpload(file, 'ebooks');
                            setCoverImage(url);
                            if (showAlert) showAlert(isEn ? "Cover updated successfully!" : "Couverture mise à jour avec succès !");
                          } catch (err) {
                            if (showAlert) showAlert(err.message || "Erreur de téléversement", 'danger');
                          } finally {
                            setUploadingCover(false);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      JPG, PNG, WEBP optimisé automatiquement
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    {isEn ? "Or enter direct image URL:" : "Ou saisir une URL directe d'image :"}
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.94rem' }}
                  />
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
                  Ou choisir une photo prédéfinie de l'atelier :
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                  {PRESET_COVERS.map((preset, idx) => {
                    const isSelected = coverImage === preset.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => setCoverImage(preset.url)}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: isSelected ? '3px solid #166534' : '1px solid #cbd5e1',
                          cursor: 'pointer',
                          position: 'relative',
                          aspectRatio: '3/4'
                        }}
                      >
                        <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.68rem', padding: '4px', textAlign: 'center', fontWeight: 700 }}>
                          {preset.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════════ TAB 6: PAIEMENT DIRECT ════════ */}
            {activeTab === 'payment' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Direct Payment Gateway Link" : "Lien de Paiement Direct (GeniusPay / Wave / Saspay)"}
                </h2>

                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0' }}>
                  Si vous disposez d'un lien de paiement spécifique pour cet e-book sur GeniusPay, Wave, Saspay ou Chariow, renseignez-le ici.
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Lien de paiement direct (Optionnel) :
                  </label>
                  <input
                    type="url"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="https://pay.genius.ci/... ou https://saspay.me/..."
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.94rem' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                    Si renseigné, le clic sur « Acheter » ouvrira ce lien direct plutôt que le panier général.
                  </span>
                </div>
              </div>
            )}

            {/* ════════ TAB 7: OPTIONS & VISIBILITÉ ════════ */}
            {activeTab === 'options' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  {isEn ? "Options & Display" : "Options & Visibilité"}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Toggle: Visibilité */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                        Afficher dans la boutique d'e-books
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                        {isVisible ? "Actuellement visible publiquement" : "Masqué de la boutique"}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#1e293b', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Toggle: Produit Vedette */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                        Mettre en vedette (Featured)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                        Affiche cet e-book en tête de liste et sur la page d'accueil.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#1e293b', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Badge personnalisé */}
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Badge personnalisé (ex: Bestseller, Pack Économique, Nouveau) :
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="Ex: Bestseller Atelier"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
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
            maxWidth: '440px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ height: '240px', position: 'relative' }}>
              <img
                src={coverImage || PRESET_COVERS[0].url}
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
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: '6px' }}>
                {category}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
                {title || "Titre de l'e-book"}
              </h3>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#166534', marginBottom: '16px' }}>
                {(Number(priceFcfa) || 0).toLocaleString()} FCFA
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
