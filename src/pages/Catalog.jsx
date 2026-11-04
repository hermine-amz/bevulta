import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, ArrowRightLeft, Check, X } from 'lucide-react';
import { CATEGORIES, CATEGORY_KEYS } from '../data/categories';
import { t } from '../data/translations';

export default function Catalog({ 
  products, 
  addToCart, 
  cart, 
  removeFromCart, 
  lang,
  showAlert,
  onViewDetail
}) {
  const [activeTab, setActiveTab] = useState('tous');
  const [activeSubcategory, setActiveSubcategory] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  
  // Specs comparison state
  const [comparedIds, setComparedIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const isEn = lang === 'en';


  // Reset subcategory when main category changes
  useEffect(() => {
    setActiveSubcategory('tous');
  }, [activeTab]);

  const getCategoryLabel = (catKey) => {
    if (!isEn) {
      if (catKey === 'tous') return 'Tous les matériels';
      return catKey;
    }
    
    switch (catKey) {
      case 'tous':
        return 'All Machinery';
      case "Matériels de transformation agro-alimentaire":
        return "Agro-food Processing Equipment";
      case "Matériels de BTP & Hôpitaux / Construction métallique":
        return "Construction & Metal Structures";
      case "Matériels de Menuiserie & Boulangerie":
        return "Carpentry & Bakery";
      case "Matériels de Spécialités":
        return "Specialty Equipment";
      default:
        return catKey;
    }
  };

  const getSubcategoryLabel = (subKey) => {
    if (!isEn) {
      if (subKey === 'tous') return 'Tout afficher';
      return subKey;
    }
    
    switch (subKey) {
      case 'tous':
        return 'Show All';
      // Agro-alimentaire subcategories
      case "Matériels de production d'Huile": return "Oil Production Equipment";
      case "Matériels de transformation de Manioc": return "Cassava Processing Equipment";
      case "Matériels de transformation de jus d'ananas": return "Pineapple Juice Equipment";
      case "Matériels de transformation d'Arachide": return "Peanut Processing Equipment";
      case "Matériels de transformation de Karité": return "Shea Butter Equipment";
      case "Matériels de transformation de Riz": return "Rice Processing Equipment";
      // BTP subcategories
      case "Matériels de BTP": return "BTP/Construction Machinery";
      case "Matériels des Hôpitaux": return "Hospital Equipment";
      case "Construction métallique": return "Metallic Construction";
      // Menuiserie/Boulangerie subcategories
      case "Matériels de Menuiserie": return "Carpentry Equipment";
      case "Matériels de Boulangerie": return "Bakery Machinery";
      // Spécialités subcategories
      case "Equipement de Bureaux": return "Office Equipment";
      case "Matériels de Transport & Divers": return "Transport & Misc Equipment";
      case "Matériels de provenderie": return "Feed Mill Equipment";
      case "Moto-presse de Jus de canne à sucre": return "Sugarcane Juice Moto-press";
      default:
        return subKey;
    }
  };

  const handleToggleCompare = (id) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter(item => item !== id));
    } else {
      if (comparedIds.length >= 3) {
        showAlert(isEn ? "You can compare a maximum of 3 machines." : "Vous pouvez comparer au maximum 3 machines simultanément.");
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const isInCart = (id) => cart.some(item => item.id === id);

  const handleCartClick = (product) => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  // Filter & Sort logic
  const filteredProducts = products.filter(product => {
    if (product.isVisible === false) return false;
    
    const matchesCategory = activeTab === 'tous' || product.category === activeTab;
    const matchesSubcategory = activeSubcategory === 'tous' || product.subcategory === activeSubcategory;
    
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      Object.values(product.specs || {}).some(val => val.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.priceFcfa - b.priceFcfa;
    if (sortOrder === 'price-desc') return b.priceFcfa - a.priceFcfa;
    if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
    return a.name.localeCompare(b.name); // name-asc
  });

  const comparedProducts = products.filter(p => comparedIds.includes(p.id));

  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap(p => Object.keys(p.specs || {})))
  );

  // Subcategories to render based on activeTab
  const subcategories = activeTab !== 'tous' ? CATEGORIES[activeTab] || [] : [];

  return (
    <div style={{ padding: '120px 24px 80px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      <div className="section-header">
        <h2>{t('catalogTitle', lang)}</h2>
        <p>{t('catalogDesc', lang)}</p>
      </div>

      {/* Catalog Filters Bar */}
      <div className="catalog-filters" style={{ marginBottom: '16px' }}>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeTab === 'tous' ? 'active' : ''}`}
            onClick={() => setActiveTab('tous')}
          >
            {getCategoryLabel('tous')}
          </button>
          {CATEGORY_KEYS.map(catKey => (
            <button
              key={catKey}
              className={`filter-tab ${activeTab === catKey ? 'active' : ''}`}
              onClick={() => setActiveTab(catKey)}
            >
              {getCategoryLabel(catKey)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder={t('searchPlaceholder', lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="form-input"
            style={{ width: '180px', padding: '10px 14px' }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="name-asc">{t('sortNameAsc', lang)}</option>
            <option value="name-desc">{t('sortNameDesc', lang)}</option>
            <option value="price-asc">{t('sortPriceAsc', lang)}</option>
            <option value="price-desc">{t('sortPriceDesc', lang)}</option>
          </select>
        </div>
      </div>

      {/* Subcategories Horizontal Pill Row */}
      {activeTab !== 'tous' && subcategories.length > 0 && (
        <div className="subcategory-scroll-container">
          <button
            className={`btn ${activeSubcategory === 'tous' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '20px' }}
            onClick={() => setActiveSubcategory('tous')}
          >
            {getSubcategoryLabel('tous')}
          </button>
          {subcategories.map(subKey => (
            <button
              key={subKey}
              className={`btn ${activeSubcategory === subKey ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '20px' }}
              onClick={() => setActiveSubcategory(subKey)}
            >
              {getSubcategoryLabel(subKey)}
            </button>
          ))}
        </div>
      )}


      {/* Floating Compare Action */}
      {comparedIds.length > 0 && (
        <div className="compare-floater">
          <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>
            {comparedIds.length} {t('compareSelected', lang)}
          </span>
          <button
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setShowComparison(!showComparison)}
          >
            <ArrowRightLeft size={16} />
            <span>{showComparison ? t('compareHideBtn', lang) : t('compareBtn', lang)}</span>
          </button>
          <button 
            style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={() => { setComparedIds([]); setShowComparison(false); }}
          >
            {t('compareResetBtn', lang)}
          </button>
        </div>
      )}

      {/* Specification Comparison Table */}
      {showComparison && comparedProducts.length > 0 && (
        <div className="compare-container" style={{ marginBottom: '40px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem' }}>{t('compareTitle', lang)}</h3>
            <button style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setShowComparison(false)}>×</button>
          </div>
          
          <div className="compare-grid">
            <div className="compare-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '16px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{t('specsTitle', lang).toUpperCase()}</span>
            </div>
            {comparedProducts.map(p => (
              <div key={p.id} className="compare-col">
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }} />
                <h3>{p.name}</h3>
                <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {p.priceFcfa.toLocaleString()} FCFA
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <div className="compare-row" style={{ fontWeight: 'bold', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ width: '30%', flexShrink: 0 }}>{t('specCategory', lang)}</span>
              {comparedProducts.map(p => (
                <span key={p.id} style={{ width: '30%', flexShrink: 0 }}>{getCategoryLabel(p.category)}</span>
              ))}
            </div>
            <div className="compare-row" style={{ fontWeight: 'bold' }}>
              <span style={{ width: '30%', flexShrink: 0 }}>{lang === 'en' ? "Subcategory" : "Sous-catégorie"}</span>
              {comparedProducts.map(p => (
                <span key={p.id} style={{ width: '30%', flexShrink: 0 }}>{getSubcategoryLabel(p.subcategory) || 'N/A'}</span>
              ))}
            </div>
            <div className="compare-row">
              <span style={{ width: '30%', flexShrink: 0 }}>{t('specAvailability', lang)}</span>
              {comparedProducts.map(p => (
                <span key={p.id} style={{ width: '30%', flexShrink: 0 }}>
                  {isEn ? (p.availability === 'En stock' ? 'In Stock' : 'On Demand') : p.availability}
                </span>
              ))}
            </div>
            {allSpecKeys.map(key => (
              <div key={key} className="compare-row">
                <span style={{ width: '30%', flexShrink: 0 }}>{key}</span>
                {comparedProducts.map(p => (
                  <span key={p.id} style={{ width: '30%', flexShrink: 0 }}>{p.specs[key] || 'N/A'}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog Grid */}
      {sortedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{t('catalogNoProducts', lang)}</p>
          <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => { setActiveTab('tous'); setSearchQuery(''); }}>
            {t('catalogResetFilters', lang)}
          </button>
        </div>
      ) : (
        <div className="grid grid-3">
          {sortedProducts.map(product => (
            <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div 
                className="product-img-wrapper" 
                style={{ cursor: 'pointer', height: '220px', position: 'relative' }}
                onClick={() => onViewDetail && onViewDetail(product, 'product')}
              >
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className={`product-category-tag badge ${
                  product.category === 'Matériels de transformation agro-alimentaire' ? 'badge-agro' :
                  product.category === 'Matériels de BTP & Hôpitaux / Construction métallique' ? 'badge-btp' :
                  product.category === 'Matériels de Menuiserie & Boulangerie' ? 'badge-menu' :
                  'badge-special'
                }`} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85%' }}>
                  {getSubcategoryLabel(product.subcategory) || getCategoryLabel(product.category)}
                </span>
              </div>
              <div className="product-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '18px' }}>
                <h3 
                  style={{ cursor: 'pointer', marginBottom: '8px', fontSize: '1.05rem', lineHeight: 1.3, fontWeight: 700 }} 
                  onClick={() => onViewDetail && onViewDetail(product, 'product')}
                >
                  {product.name}
                </h3>
                
                <div style={{ marginTop: 'auto' }}>
                  <div className="product-price" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem' }}>
                      {(product.promoPriceFcfa || product.priceFcfa).toLocaleString()} FCFA
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      (≈ {(product.promoPriceEur || product.priceEur).toLocaleString()} €)
                    </span>
                    {product.promoPriceFcfa && (
                      <span className="badge badge-special" style={{ fontSize: '0.6rem', padding: '1px 5px', textTransform: 'uppercase' }}>Promo</span>
                    )}
                  </div>

                  <div className="product-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => onViewDetail && onViewDetail(product, 'product')}
                      style={{ flexGrow: 1, padding: '8px 12px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <span>{isEn ? "View details" : "Voir détails"}</span>
                      <span>→</span>
                    </button>
                    <button
                      type="button"
                      className={`btn ${isInCart(product.id) ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleCartClick(product)}
                      style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title={isInCart(product.id) ? t('btnInQuote', lang) : t('btnRequestQuote', lang)}
                    >
                      {isInCart(product.id) ? <Check size={16} /> : <ShoppingCart size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
