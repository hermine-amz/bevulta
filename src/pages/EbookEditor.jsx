import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Layers, 
  BookOpen, 
  Plus, 
  Trash2, 
  Percent, 
  CheckCircle, 
  Image as ImageIcon, 
  FileText, 
  Download,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { EBOOK_CATEGORIES } from '../data/initialEbooks';

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

export default function EbookEditor({ ebook, onSave, onCancel, allEbooks = [], lang = 'fr' }) {
  const isEn = lang === 'en';
  const isEditing = Boolean(ebook && ebook.id);

  // Form State
  const [isPack, setIsPack] = useState(ebook?.isPack || false);
  const [title, setTitle] = useState(ebook?.title || '');
  const [subtitle, setSubtitle] = useState(ebook?.subtitle || '');
  const [category, setCategory] = useState(ebook?.category || (isPack ? "Packs Complets" : "Agro-alimentaire"));
  const [description, setDescription] = useState(ebook?.description || '');
  const [author, setAuthor] = useState(ebook?.author || "Bureau d'Études BEVULTA");
  const [pages, setPages] = useState(ebook?.pages || (isPack ? "Pack de 2 Volumes" : "200 pages"));
  const [fileFormat, setFileFormat] = useState(ebook?.fileFormat || "PDF Haute Définition");
  const [language, setLanguage] = useState(ebook?.language || "Français");
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
  const [downloadUrl, setDownloadUrl] = useState(ebook?.downloadUrl || '');
  const [paymentLink, setPaymentLink] = useState(ebook?.paymentLink || '');
  
  // Visibility & Featured
  const [isVisible, setIsVisible] = useState(ebook?.isVisible !== false);
  const [featured, setFeatured] = useState(Boolean(ebook?.featured));

  // Included books if Pack
  const [includedBooks, setIncludedBooks] = useState(
    ebook?.includedBooks && ebook.includedBooks.length > 0 
      ? ebook.includedBooks 
      : []
  );
  const [newBookItem, setNewBookItem] = useState('');

  // Auto-update EUR prices when FCFA changes
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

  // Add a book to pack
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
    e.preventDefault();
    if (!title.trim()) {
      alert(isEn ? "Please enter a title." : "Veuillez saisir un titre.");
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
      language: language.trim() || "Français",
      author: author.trim() || "BEVULTA",
      badge: badge.trim(),
      isVisible,
      featured
    };

    onSave(payload);
  };

  // Single books available to quickly pick into a pack
  const singleBooks = allEbooks.filter(b => !b.isPack);

  return (
    <div className="admin-editor-overlay" style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <button 
          type="button" 
          className="btn btn-outline" 
          onClick={onCancel}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} />
          <span>{isEn ? "Back to Dashboard" : "Retour à la liste"}</span>
        </button>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--secondary)', margin: 0 }}>
          {isEditing 
            ? (isEn ? `Edit ${isPack ? 'Pack' : 'E-book'}: "${ebook.title}"` : `Modifier ${isPack ? 'le Pack' : "l'E-book"} : "${ebook.title}"`)
            : (isEn ? `Add a New ${isPack ? 'Pack' : 'E-book'}` : `Ajouter un ${isPack ? "Pack d'E-books" : "nouvel E-book"}`)
          }
        </h2>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={handleSubmit}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={16} />
          <span>{isEn ? "Save & Publish" : "Enregistrer"}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px' }} className="crud-grid">
        
        {/* Form Inputs Column */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. Type Switcher: E-book vs Pack */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '12px', display: 'block' }}>
              {isEn ? "Product Type" : "Type d'offre numérique"}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handleTogglePack(false)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${!isPack ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: !isPack ? 'rgba(22, 101, 52, 0.08)' : 'var(--bg-surface)',
                  color: !isPack ? 'var(--primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontWeight: !isPack ? 700 : 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <BookOpen size={20} />
                <div style={{ textAlign: 'left' }}>
                  <div>{isEn ? "Single E-book" : "E-book Individuel"}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vente d'un livre unique</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTogglePack(true)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${isPack ? '#d97706' : 'var(--border-subtle)'}`,
                  background: isPack ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-surface)',
                  color: isPack ? '#d97706' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontWeight: isPack ? 700 : 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Layers size={20} />
                <div style={{ textAlign: 'left' }}>
                  <div>{isEn ? "Pack of E-books" : "Pack d'E-books (Bundle)"}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Offre groupée multi-livres</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Basic Information */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="var(--primary)" />
              {isEn ? "Title & Description" : "Informations Générales"}
            </h4>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">{isEn ? "Title *" : "Titre de l'E-book ou du Pack *"}</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder={isPack ? "Ex: Pack Intégral Agro-Industrie (4 E-books)" : "Ex: Guide Pratique de la Transformation Agro-alimentaire"}
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">{isEn ? "Subtitle / Tagline" : "Sous-titre / Accroche"}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Procédés industriels, ratios matières premières et rentabilité..."
                value={subtitle} 
                onChange={(e) => setSubtitle(e.target.value)} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">{isEn ? "Category" : "Catégorie"}</label>
                <select 
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {EBOOK_CATEGORIES.filter(c => c !== 'Tous').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{isEn ? "Badge (optional)" : "Badge / Mention (optionnel)"}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Bestseller, Promo -40%, Nouveau..."
                  value={badge} 
                  onChange={(e) => setBadge(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">{isEn ? "Detailed Description" : "Description détaillée"}</label>
              <textarea 
                className="form-input" 
                rows={4}
                placeholder="Présentez les objectifs pédagogiques, le public cible, et les compétences acquises..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">{isEn ? "Pages / Volume" : "Pagination / Volume"}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: 248 pages"
                  value={pages} 
                  onChange={(e) => setPages(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isEn ? "Format" : "Format du fichier"}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: PDF Haute Définition"
                  value={fileFormat} 
                  onChange={(e) => setFileFormat(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isEn ? "Author" : "Auteur / Équipe"}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* 3. Included Books in Pack (Only shown if isPack) */}
          {isPack && (
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #d97706' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#d97706', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} />
                {isEn ? "Books Included in this Pack" : "E-books inclus dans ce pack groupé"}
              </h4>

              {/* Quick Pick from existing single books */}
              {singleBooks.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Ajouter rapidement depuis vos e-books existants :
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {singleBooks.map(sb => {
                      const isAdded = includedBooks.includes(sb.title);
                      return (
                        <button
                          key={sb.id}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              setIncludedBooks(includedBooks.filter(t => t !== sb.title));
                            } else {
                              addIncludedBook(sb.title);
                            }
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '16px',
                            border: `1px solid ${isAdded ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            background: isAdded ? 'rgba(22, 101, 52, 0.15)' : 'var(--bg-surface)',
                            color: isAdded ? 'var(--primary)' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          {isAdded ? "✓ " : "+ "} {sb.title.substring(0, 32)}...
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom item input */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ou saisir le titre d'un livre inclus..."
                  value={newBookItem} 
                  onChange={(e) => setNewBookItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addIncludedBook(newBookItem);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => addIncludedBook(newBookItem)}
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* List of included books */}
              {includedBooks.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                  Aucun livre ajouté à ce pack pour l'instant. Ajoutez au moins 2 livres.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {includedBooks.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#d97706' }}>#{idx + 1}</span>
                        <span>{item}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeIncludedBook(idx)}
                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Pricing: Normal Price & Promo Price */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Percent size={16} color="var(--primary)" />
              {isEn ? "Pricing & Promotion" : "Tarification : Prix Normal & Prix Promo"}
            </h4>

            {/* Normal Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">{isEn ? "Normal Price (FCFA) *" : "Prix Normal (FCFA) *"}</label>
                <input 
                  type="number" 
                  className="form-input" 
                  required
                  min="0"
                  step="500"
                  value={priceFcfa} 
                  onChange={(e) => handlePriceFcfaChange(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isEn ? "Normal Price (EUR)" : "Prix Normal (EUR)"}</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="0"
                  value={priceEur} 
                  onChange={(e) => setPriceEur(Number(e.target.value))} 
                />
              </div>
            </div>

            {/* Promo Toggle Switch */}
            <div style={{ marginBottom: '16px', padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={hasPromo}
                  onChange={(e) => {
                    setHasPromo(e.target.checked);
                    if (e.target.checked && !promoPriceFcfa) {
                      // Suggest 30% discount by default
                      const discounted = Math.round(priceFcfa * 0.7);
                      setPromoPriceFcfa(discounted);
                      setPromoPriceEur(Math.round(discounted / 655.957));
                    }
                  }}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span>{isEn ? "Apply a Promotional Discount Price" : "Activer une promotion / tarif réduit"}</span>
              </label>

              {hasPromo && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#d97706', fontWeight: 700 }}>
                      {isEn ? "Promo Price (FCFA) *" : "Prix Promotionnel (FCFA) *"}
                    </label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="0"
                      step="500"
                      value={promoPriceFcfa} 
                      onChange={(e) => handlePromoPriceFcfaChange(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#d97706', fontWeight: 700 }}>
                      {isEn ? "Promo Price (EUR)" : "Prix Promotionnel (EUR)"}
                    </label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="0"
                      value={promoPriceEur} 
                      onChange={(e) => setPromoPriceEur(Number(e.target.value))} 
                    />
                  </div>
                </div>
              )}

              {/* Promo savings breakdown preview */}
              {hasPromo && promoPriceFcfa && Number(promoPriceFcfa) < Number(priceFcfa) && (
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                  ✓ Économie client : {(priceFcfa - promoPriceFcfa).toLocaleString()} FCFA ({Math.round(((priceFcfa - promoPriceFcfa) / priceFcfa) * 100)}% de réduction)
                </div>
              )}
            </div>
          </div>

          {/* 5. Media & Download links */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={16} color="var(--primary)" />
              {isEn ? "Cover Image & Download Link" : "Image de Couverture & Téléchargement"}
            </h4>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">{isEn ? "Cover Image URL" : "URL de la photo / couverture"}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="https://..."
                value={coverImage} 
                onChange={(e) => setCoverImage(e.target.value)} 
              />
            </div>

            {/* Presets buttons */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Couvertures recommandées par thème :
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      background: coverImage === preset.url ? 'var(--primary)' : 'var(--bg-surface)',
                      color: coverImage === preset.url ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{isEn ? "Digital File / Download URL" : "Lien de téléchargement sécurisé du fichier PDF"}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="https://bevulta.com/downloads/votre-guide.pdf"
                value={downloadUrl} 
                onChange={(e) => setDownloadUrl(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">{isEn ? "Direct Payment Link (Saspay / Wave / PayDunya - Optional)" : "Lien de paiement direct spécifique (Saspay / Wave / PayDunya - Optionnel)"}</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://saspay.me/... ou https://paydunya.com/p/..."
                value={paymentLink} 
                onChange={(e) => setPaymentLink(e.target.value)} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                {isEn ? "If filled, clicking 'Buy' will open this specific link instead of the store gateway." : "Si renseigné, le clic sur « Acheter » ouvrira directement ce lien spécifique plutôt que la passerelle globale."}
              </span>
            </div>
          </div>

          {/* 6. Visibility switches */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span>{isEn ? "Visible on Website" : "Visible sur le site public"}</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span>{isEn ? "Featured on Home" : "Mettre en avant sur la page d'accueil"}</span>
            </label>
          </div>

        </form>

        {/* Live Preview Card Column */}
        <div>
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isEn ? "Live Website Preview" : "Aperçu de la carte sur le site"}
            </div>

            {/* Render sample card */}
            <div 
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: isPack ? '2px solid rgba(217, 119, 6, 0.4)' : '1px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: '0 12px 30px -10px rgba(0,0,0,0.1)'
              }}
            >
              {isPack && (
                <div 
                  style={{
                    background: 'linear-gradient(90deg, #d97706 0%, #b45309 100%)',
                    color: '#ffffff',
                    padding: '6px 14px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={13} />
                    PACK COMPLET ({includedBooks.length} LIVRES)
                  </span>
                  {hasPromo && promoPriceFcfa && Number(promoPriceFcfa) < Number(priceFcfa) && (
                    <span style={{ background: '#ffffff', color: '#b45309', padding: '1px 6px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 800 }}>
                      -{Math.round(((priceFcfa - promoPriceFcfa) / priceFcfa) * 100)}%
                    </span>
                  )}
                </div>
              )}

              <div style={{ position: 'relative', height: '200px', background: 'var(--bg-surface)' }}>
                <img 
                  src={coverImage} 
                  alt={title || "Preview"} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = PRESET_COVERS[0].url; }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(0,0,0,0.8)', color: '#ffffff' }}>
                    {category}
                  </span>
                  {badge && (
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: isPack ? '#d97706' : 'var(--primary)', color: '#ffffff' }}>
                      {badge}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '6px' }}>
                  {title || (isPack ? "Titre du pack d'e-books" : "Titre de l'e-book")}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                  {subtitle || "Sous-titre et description courte du guide..."}
                </p>

                {isPack && includedBooks.length > 0 && (
                  <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '0.75rem' }}>
                    <strong style={{ color: '#d97706', display: 'block', marginBottom: '4px' }}>Inclus dans ce pack :</strong>
                    {includedBooks.map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                        <CheckCircle size={12} color="#16a34a" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price display */}
                <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                  {hasPromo && promoPriceFcfa ? (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {Number(priceFcfa).toLocaleString()} FCFA ({Number(priceEur).toLocaleString()} €)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <strong style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>
                          {Number(promoPriceFcfa).toLocaleString()} FCFA
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          (≈ {Number(promoPriceEur).toLocaleString()} €)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <strong style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>
                        {Number(priceFcfa).toLocaleString()} FCFA
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ({Number(priceEur).toLocaleString()} €)
                      </span>
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', background: isPack ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'var(--primary)' }}
                >
                  {isPack ? "Commander ce Pack" : "Ajouter au Devis"}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
