import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, FileText, Mail, Settings, LogOut, Lock, 
  User, Plus, Trash2, Edit, Check, Eye, Trash, RefreshCw, X, Sun, Moon, Globe, Home, Phone, MapPin, ChevronLeft, ChevronRight
} from 'lucide-react';
import { CATEGORIES, CATEGORY_KEYS } from '../data/categories';
import { t } from '../data/translations';
import ProductEditor from './ProductEditor';
import OrderEditor from './OrderEditor';

export default function AdminDashboard({ 
  products, addProduct, updateProduct, deleteProduct,
  orders, addOrder, updateOrderStatus, deleteOrder,
  messages, markMessageRead, deleteMessage, replyMessage, updateMessageStatus,
  logoutAdmin, settings, updateSettings,
  lang, setLang, theme, setTheme, goHome,
  showAlert, showConfirm, bulkUpdateProducts
}) {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('bevulta_admin_tab') || 'overview';
  });

  useEffect(() => {
    sessionStorage.setItem('bevulta_admin_tab', activeTab);
  }, [activeTab]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductEditor, setShowProductEditor] = useState(false);
  const [showOrderEditor, setShowOrderEditor] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productSelectionMode, setProductSelectionMode] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (previewProduct) {
      setPreviewImageIndex(0);
    }
  }, [previewProduct]);
  const [bulkAction, setBulkAction] = useState("");
  
  const [orderSearch, setOrderSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState('all'); // all | unread | in-progress | resolved | replied
  const [replyingTo, setReplyingTo] = useState(null); // message id being replied to
  const [replyText, setReplyText] = useState('');

  const isEn = lang === 'en';

  // Product Form State (kept for compatibility)
  const defaultCategory = "Matériels de transformation agro-alimentaire";

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Statistics calculation
  const totalRevenue = orders
    .filter(o => o.status === 'delivered' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.totalFcfa, 0);

  const pendingRevenue = orders
    .filter(o => o.status === 'pending' || o.status === 'manufacturing')
    .reduce((sum, o) => sum + o.totalFcfa, 0);

  const getVentesParPays = () => {
    const data = { 'Bénin': 0, 'Togo': 0, 'Burkina Faso': 0, 'Niger': 0, 'Côte d\'Ivoire': 0, 'Autre': 0 };
    orders.forEach(o => {
      if (data[o.country] !== undefined) {
        data[o.country] += o.totalFcfa;
      } else {
        data['Autre'] += o.totalFcfa;
      }
    });
    return data;
  };

  const getVentesParCategorie = () => {
    const data = {};
    CATEGORY_KEYS.forEach(key => {
      data[key] = 0;
    });
    
    orders.forEach(o => {
      o.items.forEach(item => {
        // Map old category keys to new keys if necessary
        let mappedCat = item.category;
        if (item.category === 'agro-alimentaire' || item.category === 'agro') {
          mappedCat = "Matériels de transformation agro-alimentaire";
        } else if (item.category === 'btp-construction' || item.category === 'btp') {
          mappedCat = "Matériels de BTP & Hôpitaux / Construction métallique";
        } else if (item.category === 'menuiserie-boulangerie' || item.category === 'menuiserie') {
          mappedCat = "Matériels de Menuiserie & Boulangerie";
        } else if (item.category === 'specialites' || item.category === 'special') {
          mappedCat = "Matériels de Spécialités";
        }
        
        if (data[mappedCat] !== undefined) {
          data[mappedCat] += item.priceFcfa * item.quantity;
        }
      });
    });
    return data;
  };

  const getVentesParSousCategorie = (category) => {
    const data = {};
    if (CATEGORIES[category]) {
      CATEGORIES[category].forEach(sub => {
        data[sub] = 0;
      });
    }
    data['Autre'] = 0;

    orders.forEach(o => {
      o.items.forEach(item => {
        let mappedCat = item.category;
        if (item.category === 'agro-alimentaire' || item.category === 'agro') {
          mappedCat = "Matériels de transformation agro-alimentaire";
        } else if (item.category === 'btp-construction' || item.category === 'btp') {
          mappedCat = "Matériels de BTP & Hôpitaux / Construction métallique";
        } else if (item.category === 'menuiserie-boulangerie' || item.category === 'menuiserie') {
          mappedCat = "Matériels de Menuiserie & Boulangerie";
        } else if (item.category === 'specialites' || item.category === 'special') {
          mappedCat = "Matériels de Spécialités";
        }
        
        if (mappedCat === category) {
          const sub = item.subcategory;
          if (data[sub] !== undefined) {
            data[sub] += item.priceFcfa * item.quantity;
          } else {
            data['Autre'] += item.priceFcfa * item.quantity;
          }
        }
      });
    });

    if (data['Autre'] === 0) delete data['Autre'];
    return data;
  };

  const handleProductSave = (payload) => {
    if (editingProduct) {
      updateProduct({ ...payload, id: editingProduct.id });
    } else {
      addProduct({ ...payload, id: Date.now() });
    }
    setEditingProduct(null);
    setShowProductEditor(false);
    showAlert(isEn ? "Product saved successfully!" : "Produit enregistré avec succès !");
  };

  const startEditProduct = (prod) => {
    setEditingProduct(prod);
    setShowProductEditor(true);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showAlert(isEn ? "Settings updated successfully!" : "Paramètres mis à jour avec succès !");
  };

  const getStatusLabel = (status) => {
    if (lang === 'fr') {
      switch (status) {
        case 'pending': return 'En attente de validation';
        case 'manufacturing': return 'En cours de fabrication';
        case 'shipped': return 'Expédié';
        case 'delivered': return 'Livré';
        default: return 'Inconnu';
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending Validation';
        case 'manufacturing': return 'In Manufacturing';
        case 'shipped': return 'Shipped';
        case 'delivered': return 'Delivered';
        default: return 'Unknown';
      }
    }
  };

  const getCategoryLabel = (catKey) => {
    if (!isEn) return catKey;
    switch (catKey) {
      case "Matériels de transformation agro-alimentaire":
        return "Agro-food Processing";
      case "Matériels de BTP & Hôpitaux / Construction métallique":
        return "BTP & Metal Structures";
      case "Matériels de Menuiserie & Boulangerie":
        return "Carpentry & Bakery";
      case "Matériels de Spécialités":
        return "Specialty Machinery";
      default:
        return catKey;
    }
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    let d;
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      d = new Date(`${year}-${month}-${day}`);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return dateStr;
    const formatted = d.toLocaleDateString(isEn ? 'en-US' : 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div className="admin-shell" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar navigation */}
      <aside className="admin-sidebar" style={{ overflowY: 'auto' }}>
        <div className="admin-logo">
          <span>ADMIN BEVULTA</span>
        </div>
        <nav className="admin-menu">
          <button 
            className="admin-menu-item"
            onClick={goHome}
          >
            <Home size={18} />
            <span>{t('navHome', lang)}</span>
          </button>
          <button 
            className={`admin-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} />
            <span>{t('dashOverview', lang)}</span>
          </button>
          <button 
            className={`admin-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FileText size={18} />
            <span>{t('dashOrders', lang)}</span>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span style={{ backgroundColor: 'var(--accent)', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}>
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
          <button 
            className={`admin-menu-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={18} />
            <span>{t('dashInventory', lang)}</span>
          </button>
          <button 
            className={`admin-menu-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <Mail size={18} />
            <span>{t('dashMessages', lang)}</span>
            {messages.filter(m => m.status === 'unread').length > 0 && (
              <span style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}>
                {messages.filter(m => m.status === 'unread').length}
              </span>
            )}
          </button>
          <button 
            className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>{t('dashSettings', lang)}</span>
          </button>
        </nav>
        <div className="admin-footer">
          <button 
            className="admin-menu-item" 
            style={{ color: 'var(--danger)', width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={logoutAdmin}
          >
            <LogOut size={18} />
            <span>{t('dashSignOut', lang)}</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="admin-main" style={{ overflow: 'hidden' }}>
        <header className="admin-header" style={{ flexShrink: 0 }}>
          <div className="admin-header-title">
            <h2>{t('dashAdmin', lang)}</h2>
          </div>
          <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Theme & Language Toggles for Admin */}
            <div className="nav-controls" style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                className="theme-toggle"
                style={{ cursor: 'pointer' }}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button 
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} 
                className="lang-toggle"
                style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
              >
                <Globe size={14} style={{ marginRight: '2px' }} />
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
            </div>


          </div>
        </header>

        <div className="admin-content">
          {/* TAB 1: OVERVIEW / ANALYTICS */}
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
              <div className="admin-stats-grid">
                <div className="stat-card">
                  <div className="stat-info">
                    <h4>{isEn ? "Revenue" : "Chiffre d'Affaires"}</h4>
                    <div className="stat-number">{(totalRevenue).toLocaleString()} FCFA</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{isEn ? "Shipped & Delivered" : "Livré & Expédié"}</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                    <Check size={22} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <h4>{isEn ? "Pending Validation" : "En attente / Fabrication"}</h4>
                    <div className="stat-number">{(pendingRevenue).toLocaleString()} FCFA</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>{isEn ? "Awaiting Payment" : "En attente de validation"}</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                    <RefreshCw size={22} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <h4>{isEn ? "Total Orders" : "Commandes Totales"}</h4>
                    <div className="stat-number">{orders.length}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isEn ? "Quotes received" : "Devis reçus"}</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                    <FileText size={22} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <h4>{isEn ? "Messages Received" : "Messages Reçus"}</h4>
                    <div className="stat-number">{messages.length}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--info)' }}>
                      {messages.filter(m => m.status === 'unread').length} {isEn ? "unread" : "non lus"}
                    </span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                    <Mail size={22} />
                  </div>
                </div>
              </div>

              {/* Analytics Custom SVG Charts Grid */}
              <div className="admin-charts-grid">
                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3 style={{ fontSize: '1.1rem' }}>{isEn ? "Revenue Share by Country (FCFA)" : "Répartition des ventes par pays (FCFA)"}</h3>
                  </div>
                  
                  {/* SVG Bar Chart representing revenue share per country */}
                  <div className="chart-wrapper">
                    {Object.entries(getVentesParPays()).map(([country, amt]) => {
                      const maxAmount = Math.max(...Object.values(getVentesParPays()), 1000000);
                      const barHeight = amt > 0 ? (amt / maxAmount) * 200 : 5;
                      return (
                        <div key={country} className="chart-bar-container">
                          <div className="chart-bar" style={{ height: `${barHeight}px` }}>
                            {amt > 0 && <span className="chart-bar-value">{(amt / 1000).toFixed(0)}k</span>}
                          </div>
                          <span className="chart-bar-label">{country}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3 style={{ fontSize: '1.1rem' }}>{isEn ? "Sales by Machine Category" : "Ventes par Catégorie de Machine"}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                    {Object.entries(getVentesParCategorie()).map(([category, val]) => {
                      const totalCat = Object.values(getVentesParCategorie()).reduce((a, b) => a + b, 0) || 1;
                      const percentage = Math.round((val / totalCat) * 100);
                      return (
                        <div key={category} style={{ fontSize: '0.9rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', cursor: 'pointer', alignItems: 'center' }} onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}>
                            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                              <ChevronRight size={14} style={{ marginRight: '4px', transform: expandedCategories[category] ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                              {getCategoryLabel(category)}
                            </span>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{percentage}%</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
                            {val.toLocaleString()} FCFA
                          </div>

                          {expandedCategories[category] && (
                            <div style={{ marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {Object.entries(getVentesParSousCategorie(category)).map(([sub, subVal]) => {
                                const subPercentage = val > 0 ? Math.round((subVal / val) * 100) : 0;
                                return (
                                  <div key={sub}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                      <span style={{ fontSize: '0.8rem' }}>{sub}</span>
                                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>{subPercentage}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-surface)', borderRadius: '2px', overflow: 'hidden' }}>
                                      <div style={{ width: `${subPercentage}%`, height: '100%', backgroundColor: 'var(--secondary)', borderRadius: '2px' }}></div>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
                                      {subVal.toLocaleString()} FCFA
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST */}
          {activeTab === 'orders' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', margin: 0, whiteSpace: 'nowrap' }}>
                    {isEn ? "Orders & Quotes" : "Commandes & Devis"}
                  </h3>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ width: '250px' }} 
                    placeholder={isEn ? "Search orders by client, ID..." : "Rechercher une commande (client, ref)..."} 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowOrderEditor(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} />
                  <span>{isEn ? "New Order" : "Nouvelle Commande"}</span>
                </button>
              </div>
              <div className="data-table-container" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>{isEn ? "Client" : "Client / Entreprise"}</th>
                    <th>{isEn ? "Country" : "Pays"}</th>
                    <th>Date</th>
                    <th>{isEn ? "Amount" : "Montant"}</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => 
                    o.clientName?.toLowerCase().includes(orderSearch.toLowerCase()) || 
                    o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.company?.toLowerCase().includes(orderSearch.toLowerCase())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {isEn ? "No quotation requests found." : "Aucune commande trouvée."}
                      </td>
                    </tr>
                  ) : (
                    orders.filter(o => 
                      o.clientName?.toLowerCase().includes(orderSearch.toLowerCase()) || 
                      o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      o.company?.toLowerCase().includes(orderSearch.toLowerCase())
                    ).map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 800 }}>{order.id}</td>
                        <td>
                          <div>{order.clientName}</div>
                          {order.company && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.company}</div>}
                        </td>
                        <td>{order.country}</td>
                        <td>{order.date}</td>
                        <td style={{ fontWeight: 700 }}>{order.totalFcfa.toLocaleString()} FCFA</td>
                        <td>
                          <span className={`status-pill status-${order.status}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => setViewingOrder(order)}
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                              onClick={() => deleteOrder(order.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* TAB 3: INVENTORY */}
          {activeTab === 'inventory' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', margin: 0, whiteSpace: 'nowrap' }}>
                    {isEn ? "Machinery Inventory" : "Catalogue des Équipements"} ({products.length})
                  </h3>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ width: '250px' }} 
                    placeholder={isEn ? "Search machinery..." : "Rechercher une machine..."} 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {!productSelectionMode ? (
                    <button 
                      className="btn btn-outline"
                      title={isEn ? "Select mode" : "Mode sélection"}
                      onClick={() => setProductSelectionMode(true)}
                      style={{ padding: '8px' }}
                    >
                      <Check size={18} />
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }} 
                        onClick={() => { setProductSelectionMode(false); setSelectedProductIds([]); }}
                      >
                        {isEn ? "Cancel" : "Annuler"}
                      </button>
                      {selectedProductIds.length > 0 && (
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }} 
                          onClick={() => setSelectedProductIds([])}
                        >
                          {isEn ? "Deselect all" : "Tout désélectionner"}
                        </button>
                      )}
                      {selectedProductIds.length > 0 && (
                        <>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', marginLeft: '8px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px' }}>
                            {selectedProductIds.length} {isEn ? 'selected' : 'sélectionné(s)'}
                          </span>
                          <select 
                            className="form-input" 
                            style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                          >
                        <option value="">{isEn ? "Actions..." : "Actions..."}</option>
                        <option value="show">{isEn ? "Show" : "Afficher"}</option>
                        <option value="hide">{isEn ? "Hide" : "Masquer"}</option>
                        <option value="stock">{isEn ? "In Stock" : "En stock"}</option>
                        <option value="order">{isEn ? "On Order" : "Sur commande"}</option>
                        <option value="delete">{isEn ? "Delete" : "Supprimer"}</option>
                      </select>
                      <button 
                        className="btn btn-outline"
                        style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                        disabled={!bulkAction}
                        onClick={() => {
                          if (!bulkAction) return;
                          if (bulkAction === 'delete') {
                            deleteProduct(selectedProductIds);
                            setSelectedProductIds([]);
                            setProductSelectionMode(false);
                            setBulkAction("");
                            showAlert(isEn ? "Products deleted successfully." : "Les machines ont été supprimées avec succès.");
                          } else {
                            let confirmMsg = "";
                            const count = selectedProductIds.length;
                            const isPlural = count > 1;

                            if (lang === 'fr') {
                              const text = isPlural ? `ces ${count} machines` : `cette machine`;
                              if (bulkAction === 'show') confirmMsg = `Voulez-vous vraiment afficher ${text} ?`;
                              if (bulkAction === 'hide') confirmMsg = `Voulez-vous vraiment masquer ${text} ?`;
                              if (bulkAction === 'stock') confirmMsg = `Marquer ${text} "En stock" ?`;
                              if (bulkAction === 'order') confirmMsg = `Marquer ${text} "Sur commande" ?`;
                            } else {
                              const text = isPlural ? `these ${count} machines` : `this machine`;
                              if (bulkAction === 'show') confirmMsg = `Are you sure you want to show ${text}?`;
                              if (bulkAction === 'hide') confirmMsg = `Are you sure you want to hide ${text}?`;
                              if (bulkAction === 'stock') confirmMsg = `Mark ${text} as "In Stock"?`;
                              if (bulkAction === 'order') confirmMsg = `Mark ${text} as "On Order"?`;
                            }

                            showConfirm(confirmMsg, () => {
                              if (bulkAction === 'show') {
                                bulkUpdateProducts(selectedProductIds, { isVisible: true });
                                showAlert(isEn ? "Products are now visible." : "Les machines sont maintenant visibles.");
                              } else if (bulkAction === 'hide') {
                                bulkUpdateProducts(selectedProductIds, { isVisible: false });
                                showAlert(isEn ? "Products are now hidden." : "Les machines sont maintenant masquées.");
                              } else if (bulkAction === 'stock') {
                                bulkUpdateProducts(selectedProductIds, { availability: 'En stock' });
                                showAlert(isEn ? "Products marked as in stock." : "Les machines ont été marquées En stock.");
                              } else if (bulkAction === 'order') {
                                bulkUpdateProducts(selectedProductIds, { availability: 'Sur commande' });
                                showAlert(isEn ? "Products marked as on order." : "Les machines ont été marquées Sur commande.");
                              }
                              setSelectedProductIds([]);
                              setProductSelectionMode(false);
                              setBulkAction("");
                            });
                          }
                        }}
                      >
                        {isEn ? "Apply" : "Appliquer"}
                      </button>
                    </>
                  )}
                </div>
              )}
              {!productSelectionMode && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductEditor(true);
                  }}
                >
                  <Plus size={18} />
                  <span>{isEn ? "Add machine" : "Ajouter une machine"}</span>
                </button>
              )}
            </div>
              </div>

              <div className="data-table-container" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      {productSelectionMode && (
                        <th style={{ width: '40px' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedProductIds.length === products.length && products.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds(products.map(p => p.id));
                              } else {
                                setSelectedProductIds([]);
                              }
                            }}
                          />
                        </th>
                      )}
                      <th>Image</th>
                      <th>{isEn ? "Name" : "Nom"}</th>
                      <th>{isEn ? "Category / Subcategory" : "Catégorie / Sous-catégorie"}</th>
                      <th>{isEn ? "Availability" : "Disponibilité"}</th>
                      <th>{isEn ? "Price FCFA" : "Prix FCFA"}</th>
                      <th>{isEn ? "Price EUR" : "Prix EUR"}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => 
                      p.name?.toLowerCase().includes(productSearch.toLowerCase()) || 
                      p.category?.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.subcategory?.toLowerCase().includes(productSearch.toLowerCase())
                    ).map(p => (
                      <tr key={p.id}>
                        {productSelectionMode && (
                          <td>
                            <input 
                              type="checkbox" 
                              checked={selectedProductIds.includes(p.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds([...selectedProductIds, p.id]);
                                } else {
                                  setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                                }
                              }}
                            />
                          </td>
                        )}
                        <td>
                          <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td style={{ fontWeight: 700 }}>
                          <div>{p.name}</div>
                          {p.isVisible === false && (
                            <span className="badge badge-special" style={{ background: 'var(--text-muted)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', marginTop: '4px', display: 'inline-block' }}>
                              {isEn ? 'Hidden' : 'Masqué'}
                            </span>
                          )}
                        </td>
                        <td>
                          <div><strong>{getCategoryLabel(p.category)}</strong></div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.subcategory || 'N/A'}</div>
                        </td>
                        <td>
                          <span className={`status-pill ${p.availability === 'En stock' ? 'status-delivered' : 'status-pending'}`}>
                            {p.availability}
                          </span>
                        </td>
                        <td>
                          {p.promoPriceFcfa ? (
                            <>
                              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.promoPriceFcfa.toLocaleString()} FCFA</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{p.priceFcfa.toLocaleString()} FCFA</div>
                            </>
                          ) : (
                            <div>{p.priceFcfa.toLocaleString()} FCFA</div>
                          )}
                        </td>
                        <td>
                          {p.promoPriceFcfa ? (
                            <>
                              <div style={{ fontWeight: 700 }}>{Math.round(p.promoPriceFcfa / 655.957).toLocaleString()} €</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{p.priceEur.toLocaleString()} €</div>
                            </>
                          ) : (
                            <div>{p.priceEur.toLocaleString()} €</div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              title={isEn ? "View details" : "Voir les détails"}
                              onClick={() => setPreviewProduct(p)}
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              title={isEn ? "Edit" : "Modifier"}
                              onClick={() => startEditProduct(p)}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                              title={isEn ? "Delete" : "Supprimer"}
                              onClick={() => deleteProduct(p.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT MESSAGES */}
          {activeTab === 'messages' && (() => {
            const quickReplies = isEn ? [
              "Thank you for your interest. We will contact you within 24 hours.",
              "We have received your quote request and will send you a detailed proposal.",
              "For after-sales service requests, please contact us at +229 97 69 91 78.",
              "Our team is currently working on your request. Please allow 2-3 business days.",
            ] : [
              "Merci pour votre intérêt. Nous vous contacterons dans les 24 heures.",
              "Nous avons bien reçu votre demande de devis et vous enverrons une proposition détaillée.",
              "Pour les demandes SAV, veuillez nous contacter au +229 97 69 91 78.",
              "Notre équipe travaille sur votre demande. Merci de nous accorder 2-3 jours ouvrables.",
            ];

            const statusColors = {
              unread: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: isEn ? 'Unread' : 'Non lu' },
              read: { bg: 'rgba(107,114,128,0.1)', color: 'var(--text-muted)', label: isEn ? 'Read' : 'Lu' },
              'in-progress': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: isEn ? 'In Progress' : 'En cours' },
              resolved: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: isEn ? 'Resolved' : 'Résolu' },
              replied: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: isEn ? 'Replied' : 'Répondu' },
            };

            const filteredMessages = messages.filter(m => {
              const matchSearch = m.name?.toLowerCase().includes(messageSearch.toLowerCase()) ||
                m.subject?.toLowerCase().includes(messageSearch.toLowerCase()) ||
                m.email?.toLowerCase().includes(messageSearch.toLowerCase());
              const matchFilter = messageFilter === 'all' || m.status === messageFilter;
              return matchSearch && matchFilter;
            });

            return (
              <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '12px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', margin: 0 }}>
                    {isEn ? 'Client Messages' : 'Messages Clients'}
                  </h3>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '230px' }}
                    placeholder={isEn ? 'Search by name, subject...' : 'Rechercher (nom, sujet)...'}
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                  />
                </div>

                {/* Status filter tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexShrink: 0, flexWrap: 'wrap' }}>
                  {['all', 'unread', 'read', 'in-progress', 'resolved', 'replied'].map(f => {
                    const count = f === 'all' ? messages.length : messages.filter(m => m.status === f).length;
                    const active = messageFilter === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setMessageFilter(f)}
                        style={{
                          padding: '4px 12px',
                          fontSize: '0.8rem',
                          borderRadius: '20px',
                          border: `1px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          background: active ? 'var(--primary)' : 'transparent',
                          color: active ? 'white' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {f === 'all' ? (isEn ? 'All' : 'Tous') : (statusColors[f]?.label || f)} {count > 0 && `(${count})`}
                      </button>
                    );
                  })}
                </div>

                {/* Table */}
                <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                  {filteredMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      <Mail size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                      <p>{isEn ? 'No messages found.' : 'Aucun message trouvé.'}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {filteredMessages.map(msg => {
                        const sc = statusColors[msg.status] || statusColors.read;
                        const isReplying = replyingTo === msg.id;
                        return (
                          <div key={msg.id} style={{
                            backgroundColor: 'var(--bg-card)',
                            border: `1px solid ${msg.status === 'unread' ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                            transition: 'box-shadow 0.2s',
                          }}>
                            {/* Message header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                                  {(msg.name || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: '0.95rem' }}>{msg.name}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{msg.email} · {msg.phone} · {msg.country}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.date}</span>
                                <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: sc.bg, color: sc.color }}>
                                  {sc.label}
                                </span>
                                <span className="badge badge-menu" style={{ fontSize: '0.72rem' }}>{msg.subject}</span>
                              </div>
                            </div>

                            {/* Message body */}
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 12px', padding: '10px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                              {msg.message}
                            </p>

                            {/* Admin reply display */}
                            {msg.adminReply && (
                              <div style={{ fontSize: '0.85rem', padding: '10px', borderLeft: '3px solid var(--primary)', backgroundColor: 'var(--primary-light)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: '12px' }}>
                                <strong style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>✉ {isEn ? 'Your reply' : 'Votre réponse'} ({msg.replyDate})</strong>
                                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{msg.adminReply}</p>
                              </div>
                            )}

                            {/* Reply form */}
                            {isReplying && (
                              <div style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                  {quickReplies.map((qr, i) => (
                                    <button key={i} onClick={() => setReplyText(qr)} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', border: '1px dashed var(--border-subtle)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                      ⚡ {qr.substring(0, 40)}...
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  className="form-input"
                                  rows={3}
                                  value={replyText}
                                  onChange={e => setReplyText(e.target.value)}
                                  placeholder={isEn ? 'Type your reply...' : 'Tapez votre réponse...'}
                                  style={{ fontSize: '0.9rem', marginBottom: '8px' }}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    className="btn btn-primary"
                                    style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                                    onClick={() => {
                                      if (!replyText.trim()) return;
                                      if (replyMessage) replyMessage(msg.id, replyText);
                                      showAlert(isEn ? 'Reply sent successfully.' : 'Réponse envoyée avec succès.');
                                      setReplyingTo(null);
                                      setReplyText('');
                                    }}
                                  >
                                    <Check size={14} /> {isEn ? 'Send Reply' : 'Envoyer'}
                                  </button>
                                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                                    {isEn ? 'Cancel' : 'Annuler'}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Action bar */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                              <button
                                className="btn btn-primary"
                                style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                                onClick={() => { setReplyingTo(isReplying ? null : msg.id); setReplyText(msg.adminReply || ''); }}
                              >
                                <Mail size={13} /> {isReplying ? (isEn ? 'Close' : 'Fermer') : (isEn ? 'Reply' : 'Répondre')}
                              </button>

                              {/* WhatsApp Contact Link (Option A) */}
                              <a
                                href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  isEn 
                                    ? `Hello ${msg.name}, this is Bevulta regarding your request about "${msg.subject}".` 
                                    : `Bonjour ${msg.name}, c'est l'équipe Bevulta au sujet de votre demande "${msg.subject}".`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ 
                                  padding: '5px 12px', 
                                  fontSize: '0.8rem', 
                                  color: '#25D366', 
                                  borderColor: 'rgba(37, 211, 102, 0.3)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  textDecoration: 'none'
                                }}
                                title={isEn ? "Reply via WhatsApp" : "Répondre par WhatsApp"}
                              >
                                💬 WhatsApp
                              </a>

                              {/* Status change dropdown */}
                              <select
                                className="form-input"
                                style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                                value={msg.status}
                                onChange={e => {
                                  if (updateMessageStatus) updateMessageStatus(msg.id, e.target.value);
                                  else markMessageRead(msg.id);
                                }}
                              >
                                <option value="unread">{isEn ? 'Unread' : 'Non lu'}</option>
                                <option value="read">{isEn ? 'Read' : 'Lu'}</option>
                                <option value="in-progress">{isEn ? 'In Progress' : 'En cours'}</option>
                                <option value="resolved">{isEn ? 'Resolved' : 'Résolu'}</option>
                                <option value="replied">{isEn ? 'Replied' : 'Répondu'}</option>
                              </select>

                              <button
                                className="btn btn-outline"
                                style={{ padding: '5px 10px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)', marginLeft: 'auto' }}
                                onClick={() => deleteMessage(msg.id)}
                                title={isEn ? 'Delete' : 'Supprimer'}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}



          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              maxWidth: '600px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>
                {isEn ? "Platform Configuration" : "Configuration de la Plateforme"}
              </h3>
              <form onSubmit={handleSaveSettings}>
                <div className="form-group">
                  <label className="form-label">{isEn ? "Workshop Phone" : "Téléphone de l'atelier"}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsForm.contactPhone1}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone1: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Pro</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsForm.contactPhone2}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone2: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{isEn ? "Company Email" : "Email de l'entreprise"}</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{isEn ? "Workshop Address" : "Adresse de l'atelier"}</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    value={settingsForm.atelierAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, atelierAddress: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  {t('btnSave', lang)}
                </button>
              </form>
            </div>
            </div>
          )}
        </div>
      </main>

      {/* VIEW ORDER DETAIL MODAL */}
      {viewingOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setViewingOrder(null)}>×</button>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              {isEn ? "Quote Details" : "Détails du Devis"} {viewingOrder.id}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', fontSize: '0.9rem', marginBottom: '24px', backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--primary)' }} />
                <span><strong>{isEn ? "Client:" : "Client :"}</strong> {viewingOrder.clientName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={16} style={{ color: 'var(--primary)' }} />
                <span><strong>{isEn ? "Company:" : "Compagnie :"}</strong> {viewingOrder.company || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} style={{ color: 'var(--success, #22c55e)' }} />
                <span>
                  <strong>{isEn ? "WhatsApp:" : "WhatsApp :"}</strong>{' '}
                  <a href={`https://wa.me/${viewingOrder.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                    {viewingOrder.phone}
                  </a>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                <span>
                  <strong>Email:</strong>{' '}
                  {viewingOrder.email ? (
                    <a href={`mailto:${viewingOrder.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{viewingOrder.email}</a>
                  ) : 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span><strong>{isEn ? "Address:" : "Adresse :"}</strong> {viewingOrder.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span><strong>Date:</strong> {formatFullDate(viewingOrder.date)}</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} />
                {isEn ? "Order Status" : "Statut de la commande"}
              </label>
              <select
                className="form-input"
                style={{ fontWeight: 'bold', color: 'var(--primary)' }}
                value={viewingOrder.status}
                onChange={(e) => {
                  updateOrderStatus(viewingOrder.id, e.target.value);
                  setViewingOrder({ ...viewingOrder, status: e.target.value });
                }}
              >
                <option value="pending">{isEn ? "Awaiting Payment Validation" : "En attente / Validation de paiement"}</option>
                <option value="manufacturing">{isEn ? "In Manufacturing" : "En cours de fabrication"}</option>
                <option value="shipped">{isEn ? "Shipped" : "Expédié"}</option>
                <option value="delivered">{isEn ? "Delivered" : "Livré"}</option>
              </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '24px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '2px solid var(--border-color)', fontWeight: 'bold' }}>
                  <th style={{ textAlign: 'left', padding: '12px' }}>{isEn ? "Machine" : "Machine"}</th>
                  <th style={{ textAlign: 'center', padding: '12px' }}>{isEn ? "Qty" : "Qté"}</th>
                  <th style={{ textAlign: 'right', padding: '12px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {viewingOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => {
                          const p = products.find(prod => prod.id === item.productId || prod.name === item.name);
                          if (p) {
                            setPreviewProduct(p);
                          } else {
                            showAlert(isEn ? "Product details not found." : "Les détails de cette machine ne sont plus disponibles.");
                          }
                        }}
                        style={{ 
                          background: 'none', border: 'none', color: 'var(--primary)', 
                          fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', padding: 0,
                          textDecoration: 'underline', textUnderlineOffset: '2px'
                        }}
                      >
                        {item.name}
                      </button>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{(item.priceFcfa * item.quantity).toLocaleString()} FCFA</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <td colSpan="2" style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>{isEn ? "Machinery Subtotal:" : "Sous-total machines :"}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>{viewingOrder.subtotalFcfa.toLocaleString()} FCFA</td>
                </tr>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderTop: '2px solid var(--border-color)', fontWeight: 800 }}>
                  <td colSpan="2" style={{ padding: '16px 12px', textAlign: 'right', fontSize: '1.1rem', color: 'var(--primary)' }}>{isEn ? "TOTAL QUOTE:" : "TOTAL DEVIS :"}</td>
                  <td style={{ padding: '16px 12px', textAlign: 'right', fontSize: '1.1rem', color: 'var(--primary)' }}>{viewingOrder.totalFcfa.toLocaleString()} FCFA</td>
                </tr>
              </tbody>
            </table>

            {viewingOrder.notes && (
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '24px' }}>
                <strong>{isEn ? "Special Notes:" : "Notes particulières :"}</strong> {viewingOrder.notes}
              </div>
            )}

            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setViewingOrder(null)}>
              {isEn ? "Close details" : "Fermer les détails"}
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW PRODUCT DETAIL MODAL FOR ADMIN */}
      {previewProduct && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.3s ease', zIndex: 400 }}>
          <div className="modal-content" style={{ maxWidth: '850px', padding: '32px' }}>
            <button 
              className="modal-close" 
              onClick={() => { setPreviewProduct(null); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }}
            >
              ×
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '32px', marginTop: '16px' }} className="crud-grid">
              {/* Product Image & Specs */}
              <div>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={previewProduct.mediaUrls && previewProduct.mediaUrls.length > 0 ? previewProduct.mediaUrls[previewImageIndex] : previewProduct.image} 
                    alt={previewProduct.name} 
                    style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} 
                  />
                  {previewProduct.mediaUrls && previewProduct.mediaUrls.length > 1 && (
                    <>
                      <button 
                        onClick={() => setPreviewImageIndex((prev) => (prev > 0 ? prev - 1 : previewProduct.mediaUrls.length - 1))}
                        style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => setPreviewImageIndex((prev) => (prev < previewProduct.mediaUrls.length - 1 ? prev + 1 : 0))}
                        style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '12px' }}>
                        {previewProduct.mediaUrls.map((_, i) => (
                          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === previewImageIndex ? 'white' : 'rgba(255,255,255,0.4)' }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
                    {lang === 'en' ? "Technical Specifications" : "Spécifications Techniques"}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '2px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                      <strong>{lang === 'en' ? "Category" : "Catégorie"}</strong>
                      <span style={{ textAlign: 'right', marginLeft: '12px' }}>{previewProduct.category}</span>
                    </div>
                    {previewProduct.subcategory && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '2px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                        <strong>{lang === 'en' ? "Subcategory" : "Sous-catégorie"}</strong>
                        <span style={{ textAlign: 'right', marginLeft: '12px' }}>{previewProduct.subcategory}</span>
                      </div>
                    )}
                    {Object.entries(previewProduct.specs || {}).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '2px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                        <strong>{key}</strong>
                        <span style={{ textAlign: 'right', marginLeft: '12px' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-agro" style={{ marginBottom: '12px' }}>
                    {previewProduct.subcategory || previewProduct.category}
                  </span>
                  
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', marginBottom: '12px' }}>{previewProduct.name}</h2>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                    {previewProduct.description}
                  </p>
                </div>

                <div>
                  {/* Dynamic Pricing display box */}
                  <div style={{ 
                    backgroundColor: 'var(--bg-surface)', 
                    padding: '12px 16px', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--border-subtle)', 
                    marginBottom: '16px' 
                  }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                      {lang === 'en' ? "Base Price" : "Prix de Base"}
                    </div>
                    {previewProduct.promoPriceFcfa && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '4px' }}>
                        {previewProduct.priceFcfa.toLocaleString()} FCFA ({previewProduct.priceEur.toLocaleString()} €)
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1.45rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                        {(previewProduct.promoPriceFcfa || previewProduct.priceFcfa).toLocaleString()} FCFA
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        (≈ {(previewProduct.promoPriceFcfa ? Math.round(previewProduct.promoPriceFcfa / 655.957) : previewProduct.priceEur).toLocaleString()} €)
                      </span>
                      {previewProduct.promoPriceFcfa && (
                        <span className="badge badge-special" style={{ fontSize: '0.62rem', padding: '1px 5px', textTransform: 'uppercase' }}>Promo</span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-outline" 
                    onClick={() => { setPreviewProduct(null); }}
                    style={{ width: '100%', padding: '10px 20px' }}
                  >
                    {lang === 'en' ? "Close" : "Fermer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderEditor && (
        <OrderEditor
          products={products}
          lang={lang}
          showAlert={showAlert}
          showConfirm={showConfirm}
          onClose={() => setShowOrderEditor(false)}
          onSave={(newOrder) => {
            if (addOrder) {
              addOrder(newOrder);
              showAlert(isEn ? "Order created successfully!" : "Commande créée avec succès !");
            } else {
              console.warn("addOrder function is missing");
            }
            setShowOrderEditor(false);
          }}
        />
      )}

      {/* ADD/EDIT PRODUCT FULL-PAGE EDITOR */}
      {showProductEditor && (
        <ProductEditor
          product={editingProduct}
          onSave={handleProductSave}
          onCancel={() => { setShowProductEditor(false); setEditingProduct(null); }}
          lang={lang}
          showAlert={showAlert}
          showConfirm={showConfirm}
        />
      )}
    </div>
  );
}

