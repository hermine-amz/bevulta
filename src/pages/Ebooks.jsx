import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  CheckCircle, 
  Download, 
  Search, 
  ShoppingCart, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Percent, 
  CreditCard,
  X,
  FileText
} from 'lucide-react';
import { t } from '../data/translations';
import { EBOOK_CATEGORIES } from '../data/initialEbooks';
import PaymentModal from '../components/PaymentModal';

export default function Ebooks({ ebooks, addToCart, cart, lang, showAlert, settings = {} }) {
  const isEn = lang === 'en';
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyPromos, setOnlyPromos] = useState(false);
  const [onlyPacks, setOnlyPacks] = useState(false);
  const [sortBy, setSortBy] = useState("featured"); // featured | price-asc | price-desc | discount
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);

  // Filtered & sorted ebooks
  const filteredEbooks = ebooks.filter(book => {
    if (book.isVisible === false) return false;

    // Category filter
    if (selectedCategory === "Packs Complets") {
      if (!book.isPack) return false;
    } else if (selectedCategory !== "Tous") {
      if (book.category !== selectedCategory) return false;
    }

    // Toggle filters
    if (onlyPromos && !book.promoPriceFcfa) return false;
    if (onlyPacks && !book.isPack) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = book.title?.toLowerCase().includes(q);
      const matchSubtitle = book.subtitle?.toLowerCase().includes(q);
      const matchDesc = book.description?.toLowerCase().includes(q);
      const matchCategory = book.category?.toLowerCase().includes(q);
      const matchIncluded = book.includedBooks?.some(b => b.toLowerCase().includes(q));
      if (!matchTitle && !matchSubtitle && !matchDesc && !matchCategory && !matchIncluded) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    const priceA = a.promoPriceFcfa || a.priceFcfa;
    const priceB = b.promoPriceFcfa || b.priceFcfa;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'discount') {
      const discA = a.promoPriceFcfa ? (a.priceFcfa - a.promoPriceFcfa) : 0;
      const discB = b.promoPriceFcfa ? (b.priceFcfa - b.promoPriceFcfa) : 0;
      return discB - discA;
    }
    // featured: packs first, then featured items
    if (a.isPack && !b.isPack) return -1;
    if (!a.isPack && b.isPack) return 1;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const handleAddToCart = (book, e) => {
    if (e) e.stopPropagation();
    const effectivePriceFcfa = book.promoPriceFcfa || book.priceFcfa;
    const effectivePriceEur = book.promoPriceEur || book.priceEur;

    const cartItem = {
      id: `ebook-${book.id}`,
      name: book.title,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      priceFcfa: effectivePriceFcfa,
      priceEur: effectivePriceEur,
      category: book.isPack ? "Pack E-books" : "E-book & Guide",
      image: book.coverImage,
      isEbook: true,
      isPack: book.isPack,
      format: book.fileFormat,
      downloadUrl: book.downloadUrl
    };

    addToCart(cartItem);
    showAlert(
      isEn 
        ? `"${book.title}" added to your quote / cart!` 
        : `"${book.title}" a été ajouté à votre devis / commande !`
    );
  };

  const handleDirectBuy = (book, e) => {
    if (e) e.stopPropagation();
    const effectivePriceFcfa = book.promoPriceFcfa || book.priceFcfa;
    const effectivePriceEur = book.promoPriceEur || book.priceEur;

    const modalData = {
      isEbook: true,
      type: 'ebook',
      ebook: book,
      item: book,
      itemTitle: book.title,
      amountFcfa: effectivePriceFcfa,
      amountEur: effectivePriceEur,
      orderId: `EBK-${Date.now().toString().slice(-6)}`,
      clientInfo: {
        name: '',
        email: '',
        phone: ''
      }
    };

    setPaymentModalData(modalData);
  };

  const isAlreadyInCart = (bookId) => {
    return cart.some(item => item.id === `ebook-${bookId}` || item.id === bookId);
  };

  const calculateDiscountPercent = (normal, promo) => {
    if (!promo || promo >= normal) return 0;
    return Math.round(((normal - promo) / normal) * 100);
  };

  return (
    <div className="ebooks-page" style={{ padding: '40px 20px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Hero Banner Header */}
      <div 
        className="glass-panel" 
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: '48px 36px',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.08) 0%, rgba(217, 119, 6, 0.06) 50%, rgba(255, 255, 255, 0.95) 100%)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 20px 40px -15px rgba(22, 101, 52, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(22, 101, 52, 0.1)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '16px' }}>
            <BookOpen size={16} />
            <span>{t('ebooksBadge', lang)}</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', color: 'var(--secondary)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            {t('ebooksTitle', lang)}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
            {t('ebooksDesc', lang)}
          </p>

          {/* Quick value props pill row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
              <Download size={15} color="var(--primary)" />
              <span>{isEn ? "Instant PDF Download" : "Téléchargement Immédiat (PDF HD)"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
              <Percent size={15} color="var(--accent-orange)" />
              <span>{isEn ? "Up to 50% OFF on Packs" : "Jusqu'à -50% sur les Packs groupés"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
              <ShieldCheck size={15} color="var(--primary)" />
              <span>{isEn ? "Engineered by BEVULTA Experts" : "Conçu par le Bureau d'Études BEVULTA"}</span>
            </div>
          </div>
        </div>

        {/* Decorative corner graphic */}
        <div 
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            opacity: 0.12,
            pointerEvents: 'none',
            color: 'var(--primary)',
            transform: 'rotate(-10deg)'
          }}
        >
          <Layers size={280} />
        </div>
      </div>

      {/* Filter and Search Bar Toolbar */}
      <div 
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '420px' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px', width: '100%', height: '42px', borderRadius: 'var(--radius-sm)' }}
              placeholder={isEn ? "Search by title, theme, keywords..." : "Rechercher un guide, un pack, un mot-clé..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Toggles: Promos & Packs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setOnlyPromos(!onlyPromos)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                border: `1px solid ${onlyPromos ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                background: onlyPromos ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-surface)',
                color: onlyPromos ? 'var(--accent-orange)' : 'var(--text-secondary)',
                fontWeight: onlyPromos ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Percent size={14} />
              <span>{isEn ? "Promos Only" : "En Promo Uniquement"}</span>
            </button>

            <button
              onClick={() => setOnlyPacks(!onlyPacks)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                border: `1px solid ${onlyPacks ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: onlyPacks ? 'rgba(22, 101, 52, 0.12)' : 'var(--bg-surface)',
                color: onlyPacks ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: onlyPacks ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Layers size={14} />
              <span>{isEn ? "Packs Only" : "Packs Groupés Uniquement"}</span>
            </button>

            {/* Sort selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t('sortLabel', lang)}:</span>
              <select
                className="form-input"
                style={{ height: '38px', padding: '0 12px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">{isEn ? "Recommended" : "Recommandés / Packs"}</option>
                <option value="discount">{isEn ? "Highest Discount" : "Plus forte réduction"}</option>
                <option value="price-asc">{isEn ? "Price: Low to High" : "Prix croissant"}</option>
                <option value="price-desc">{isEn ? "Price: High to Low" : "Prix décroissant"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {EBOOK_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '30px',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(22, 101, 52, 0.25)' : 'none'
                }}
              >
                {cat === 'Tous' ? (isEn ? 'All Categories' : 'Tous') : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <strong>{filteredEbooks.length}</strong> {isEn ? "e-book(s) and pack(s) available" : "guide(s) et pack(s) disponibles"}
        </div>
      </div>

      {/* Ebooks Grid */}
      {filteredEbooks.length === 0 ? (
        <div 
          className="glass-panel" 
          style={{ padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}
        >
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '8px' }}>
            {isEn ? "No e-books matching your filters" : "Aucun guide ou pack ne correspond à votre recherche"}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {isEn ? "Try adjusting your search criteria or resetting filters." : "Essayez d'ajuster vos filtres de recherche ou réinitialisez les critères."}
          </p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSelectedCategory("Tous");
              setSearchQuery("");
              setOnlyPromos(false);
              setOnlyPacks(false);
              setSortBy("featured");
            }}
          >
            {isEn ? "Reset all filters" : "Réinitialiser tous les filtres"}
          </button>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px'
          }}
        >
          {filteredEbooks.map((book) => {
            const hasPromo = Boolean(book.promoPriceFcfa);
            const discountPct = calculateDiscountPercent(book.priceFcfa, book.promoPriceFcfa);
            const inCart = isAlreadyInCart(book.id);
            const activePriceEur = hasPromo ? (book.promoPriceEur || Math.round(book.promoPriceFcfa / 655.957)) : book.priceEur;

            return (
              <div
                key={book.id}
                className="ebook-card"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: book.isPack 
                    ? '2px solid rgba(217, 119, 6, 0.4)' 
                    : '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: book.isPack 
                    ? '0 12px 30px -10px rgba(217, 119, 6, 0.15)' 
                    : '0 8px 24px -10px rgba(0,0,0,0.06)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  position: 'relative'
                }}
              >
                {/* Pack Banner Header */}
                {book.isPack && (
                  <div 
                    style={{
                      background: 'linear-gradient(90deg, #d97706 0%, #b45309 100%)',
                      color: '#ffffff',
                      padding: '6px 16px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={14} />
                      PACK COMPLET ({book.includedBooks?.length || 2} LIVRES)
                    </span>
                    {discountPct > 0 && (
                      <span style={{ background: '#ffffff', color: '#b45309', padding: '1px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                        -{discountPct}% ÉCO
                      </span>
                    )}
                  </div>
                )}

                {/* Cover & Badges Section */}
                <div style={{ position: 'relative', height: '220px', background: 'var(--bg-surface)', overflow: 'hidden' }}>
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Gradient overlay for contrast */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
                      pointerEvents: 'none'
                    }} 
                  />

                  {/* Floating Badges */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span 
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {book.category}
                    </span>

                    {book.badge && (
                      <span 
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          backgroundColor: book.isPack ? '#d97706' : 'var(--primary)',
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {book.badge}
                      </span>
                    )}
                  </div>

                  {/* Format & Pages Floating Tag */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', fontSize: '0.78rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={13} />
                      {book.pages}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)', fontSize: '0.7rem' }}>
                      PDF Numérique HD
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <h3 
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--secondary)',
                      marginBottom: '8px',
                      lineHeight: 1.35,
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {book.title}
                  </h3>

                  <p 
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      flex: 1
                    }}
                  >
                    {book.subtitle || book.description?.substring(0, 110) + '...'}
                  </p>

                  {/* Included books list if Pack */}
                  {book.isPack && book.includedBooks && book.includedBooks.length > 0 && (
                    <div 
                      style={{
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px',
                        marginBottom: '16px',
                        border: '1px dashed var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', marginBottom: '8px', textTransform: 'uppercase' }}>
                        {t('ebookIncludedBooks', lang)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {book.includedBooks.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                            <CheckCircle size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Box */}
                  <div 
                    style={{
                      background: hasPromo ? 'rgba(217, 119, 6, 0.05)' : 'var(--bg-surface)',
                      border: `1px solid ${hasPromo ? 'rgba(217, 119, 6, 0.2)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 14px',
                      marginBottom: '16px'
                    }}
                  >
                    {hasPromo ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {book.priceFcfa.toLocaleString()} FCFA ({book.priceEur.toLocaleString()} €)
                          </span>
                          <span 
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            ÉCONOMIE {(book.priceFcfa - book.promoPriceFcfa).toLocaleString()} FCFA
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                            {book.promoPriceFcfa.toLocaleString()} FCFA
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            (≈ {activePriceEur.toLocaleString()} €)
                          </span>
                          <span className="badge badge-special" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                            {t('ebookPromoBadge', lang)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                          {book.priceFcfa.toLocaleString()} FCFA
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          ({book.priceEur.toLocaleString()} €)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title={isEn ? "View Details" : "Voir le sommaire et détails"}
                      onClick={() => setSelectedEbook(book)}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="btn btn-primary"
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                      }}
                      title={isEn ? "Direct Purchase & Instant Download" : "Paiement Mobile Money direct et téléchargement immédiat"}
                      onClick={(e) => handleDirectBuy(book, e)}
                    >
                      <CreditCard size={15} />
                      <span>{isEn ? "Buy" : "Acheter"}</span>
                    </button>

                    <button
                      className={`btn ${inCart ? 'btn-outline' : 'btn-outline'}`}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        padding: '10px 8px',
                        color: inCart ? 'var(--primary)' : 'inherit',
                        borderColor: inCart ? 'var(--primary)' : 'var(--border-color)'
                      }}
                      onClick={(e) => handleAddToCart(book, e)}
                    >
                      <ShoppingCart size={15} />
                      <span style={{ fontWeight: 600 }}>
                        {inCart 
                          ? (isEn ? "In Quote ✓" : "Au Devis ✓") 
                          : (isEn ? "+ Devis" : "+ Devis")
                        }
                      </span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global E-book Details & Preview Modal */}
      {selectedEbook && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.25s ease' }}>
          <div className="modal-content" style={{ maxWidth: '800px', padding: '32px' }}>
            <button
              className="modal-close"
              onClick={() => setSelectedEbook(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }}
            >
              ×
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', marginTop: '12px' }} className="crud-grid">
              {/* Left Column: Cover & Quick specs */}
              <div>
                <img 
                  src={selectedEbook.coverImage} 
                  alt={selectedEbook.title} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }} 
                />

                <div style={{ marginTop: '16px', background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Format :</span>
                    <strong>{selectedEbook.fileFormat}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Pages :</span>
                    <strong>{selectedEbook.pages}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Langue :</span>
                    <strong>{selectedEbook.language || 'Français'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Auteur :</span>
                    <strong>{selectedEbook.author || 'BEVULTA'}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Description, Packs breakdown, Pricing & CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-agro">{selectedEbook.category}</span>
                    {selectedEbook.isPack && (
                      <span className="badge badge-special" style={{ background: '#d97706', color: '#ffffff' }}>
                        Pack de {selectedEbook.includedBooks?.length || 2} E-books
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '8px', lineHeight: 1.3 }}>
                    {selectedEbook.title}
                  </h2>

                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>
                    {selectedEbook.subtitle}
                  </p>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    {selectedEbook.description}
                  </div>

                  {/* Included books breakdown if Pack */}
                  {selectedEbook.isPack && selectedEbook.includedBooks && (
                    <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#d97706', marginBottom: '10px', textTransform: 'uppercase' }}>
                        📚 Contenu détaillé de ce pack :
                      </h4>
                      <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.83rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {selectedEbook.includedBooks.map((item, idx) => (
                          <li key={idx}><strong>{item}</strong></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reassurance banner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(22, 101, 52, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '20px' }}>
                    <Zap size={16} />
                    <span>{t('ebookDigitalDeliveryNotice', lang)}</span>
                  </div>
                </div>

                {/* Bottom Pricing & Checkout button */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      {selectedEbook.promoPriceFcfa && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {selectedEbook.priceFcfa.toLocaleString()} FCFA ({selectedEbook.priceEur.toLocaleString()} €)
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <strong style={{ fontSize: '1.6rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                          {(selectedEbook.promoPriceFcfa || selectedEbook.priceFcfa).toLocaleString()} FCFA
                        </strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          (≈ {(selectedEbook.promoPriceEur || selectedEbook.priceEur).toLocaleString()} €)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-primary"
                        style={{
                          padding: '12px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: '#ffffff',
                          border: 'none',
                          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                        }}
                        onClick={() => {
                          const book = selectedEbook;
                          setSelectedEbook(null);
                          handleDirectBuy(book);
                        }}
                      >
                        <CreditCard size={18} />
                        <span style={{ fontWeight: 700 }}>
                          {isEn ? "Pay with Mobile Money" : "Payer par Mobile Money"}
                        </span>
                      </button>

                      <button
                        className="btn btn-outline"
                        style={{
                          padding: '12px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onClick={() => {
                          handleAddToCart(selectedEbook);
                          setSelectedEbook(null);
                        }}
                      >
                        <ShoppingCart size={18} />
                        <span style={{ fontWeight: 700 }}>
                          {selectedEbook.isPack ? (isEn ? "Add Pack to Quote" : "Ajouter au Devis") : (isEn ? "Add to Quote" : "Ajouter au Devis")}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Reassurance FAQ Section */}
      <div 
        className="glass-panel" 
        style={{
          marginTop: '60px',
          borderRadius: 'var(--radius-md)',
          padding: '36px',
          background: 'var(--bg-card)'
        }}
      >
        <h3 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '20px', textAlign: 'center' }}>
          {isEn ? "Frequently Asked Questions about our E-books" : "Comment fonctionne l'achat et la livraison des E-books BEVULTA ?"}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '6px' }}>
              ⚡ 1. Livraison Instantanée & Sécurisée
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Dès la validation de votre commande, vous recevez un lien de téléchargement direct par e-mail ainsi que sur votre espace client.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '6px' }}>
              💳 2. Modes de Paiement Flexibles
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Règlement facile par Mobile Money (MTN MoMo, Moov Money, Wave, Orange Money), carte bancaire ou virement.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '6px' }}>
              📖 3. Formats & Mises à Jour à Vie
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Fichiers PDF haute définition lisibles sur smartphone, tablette ou ordinateur. Vous bénéficiez des mises à jour gratuites.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Money Payment Modal */}
      <PaymentModal
        isOpen={paymentModalData !== null}
        onClose={() => setPaymentModalData(null)}
        paymentData={paymentModalData}
        settings={settings}
        lang={lang}
        onConfirmPayment={() => {
          showAlert(lang === "fr" ? "Paiement en cours de vérification. Merci !" : "Payment under verification. Thank you!");
        }}
      />
    </div>
  );
}
