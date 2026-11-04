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

export default function Ebooks({ ebooks, addToCart, cart, lang, showAlert, settings = {}, addOrder, onViewDetail }) {
  const isEn = lang === 'en';
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyPromos, setOnlyPromos] = useState(false);
  const [onlyPacks, setOnlyPacks] = useState(false);
  const [sortBy, setSortBy] = useState("featured"); // featured | price-asc | price-desc | discount
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
    <div className="ebooks-page" style={{ padding: '120px 20px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      
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
                  borderRadius: '16px',
                  border: book.isPack 
                    ? '2px solid rgba(217, 119, 6, 0.4)' 
                    : '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Image Section */}
                <div 
                  style={{ position: 'relative', height: '180px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => onViewDetail && onViewDetail(book, 'ebook')}
                >
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#ffffff' }}>
                      {book.category}
                    </span>
                    {book.badge && (
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#d97706', color: '#ffffff' }}>
                        {book.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--secondary)',
                      marginBottom: '8px',
                      lineHeight: 1.35,
                      cursor: 'pointer'
                    }}
                    onClick={() => onViewDetail && onViewDetail(book, 'ebook')}
                  >
                    {book.title}
                  </h3>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                        {(book.promoPriceFcfa || book.priceFcfa).toLocaleString()} FCFA
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        (≈ {(book.promoPriceEur || book.priceEur).toLocaleString()} €)
                      </span>
                      {hasPromo && (
                        <span className="badge badge-special" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase' }}>Promo</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => onViewDetail && onViewDetail(book, 'ebook')}
                      >
                        <span>{isEn ? "View details" : "Voir détails"}</span>
                        <span>→</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          padding: '8px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        onClick={(e) => handleDirectBuy(book, e)}
                        title={isEn ? "Buy now" : "Acheter maintenant"}
                      >
                        <CreditCard size={15} />
                        <span>{isEn ? "Buy" : "Acheter"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
        onConfirmPayment={(buyerData) => {
          if (addOrder && paymentModalData) {
            const ebookOrder = {
              id: paymentModalData.orderId || `EBK-${Date.now().toString().slice(-6)}`,
              date: new Date().toISOString().split('T')[0],
              clientName: buyerData?.buyerName || 'Client E-book',
              email: buyerData?.buyerEmail || '',
              phone: buyerData?.buyerPhone || '',
              country: 'Bénin',
              company: 'Particulier / Auto-entrepreneur',
              address: 'Achat direct E-book (Mobile Money)',
              notes: `Achat direct E-book : ${paymentModalData.itemTitle} (${buyerData?.method || 'Mobile Money'})`,
              status: 'pending',
              subtotalFcfa: paymentModalData.amountFcfa || 0,
              totalFcfa: paymentModalData.amountFcfa || 0,
              totalEur: paymentModalData.amountEur || 0,
              items: [{
                id: `ebook-${paymentModalData.ebook?.id || 1}`,
                name: `[E-book] ${paymentModalData.itemTitle}`,
                quantity: 1,
                priceFcfa: paymentModalData.amountFcfa || 0,
                priceEur: paymentModalData.amountEur || 0
              }]
            };
            addOrder(ebookOrder);
          }
          showAlert(lang === "fr" ? "Paiement en cours de vérification. Votre commande a été transmise à l'atelier !" : "Payment under verification. Your order has been sent to the workshop!");
        }}
      />
    </div>
  );
}
