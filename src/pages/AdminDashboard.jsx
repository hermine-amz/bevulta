import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Package, FileText, Mail, Settings, LogOut, Lock, 
  User, Plus, Trash2, Edit, Check, Eye, Trash, RefreshCw, X, Sun, Moon, Globe, Home, Phone, MapPin, ChevronLeft, ChevronRight,
  BookOpen, Layers, Copy,
  ShoppingBag, Users, CircleDollarSign, Megaphone, LayoutTemplate, Headphones,
  PanelLeftClose, PanelLeftOpen, ExternalLink, ChevronsUpDown,
  Info, MessageCircle, CreditCard, GraduationCap, Download, Calendar, Clock
} from 'lucide-react';
import { CATEGORIES, CATEGORY_KEYS } from '../data/categories';
import { t } from '../data/translations';
import ProductEditor from './ProductEditor';
import OrderEditor from './OrderEditor';
import EbookEditor from './EbookEditor';
import FormationEditor from './FormationEditor';
import LandingPageEditor from '../components/LandingPageEditor';
import PaymentSettingsEditor from '../components/PaymentSettingsEditor';
import AdminHelpCenter from '../components/AdminHelpCenter';

export default function AdminDashboard({ 
  products, addProduct, updateProduct, deleteProduct,
  ebooks = [], addEbook, updateEbook, deleteEbook, bulkUpdateEbooks,
  formations = [], addFormation, updateFormation, deleteFormation,
  orders, addOrder, updateOrderStatus, deleteOrder,
  messages, markMessageRead, deleteMessage, replyMessage, updateMessageStatus,
  logoutAdmin, settings, updateSettings,
  lang, setLang, theme, setTheme, goHome,
  showAlert, showConfirm, bulkUpdateProducts, onViewDetail
}) {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('bevulta_admin_tab') || 'overview';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('bevulta_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('bevulta_sidebar_collapsed', isSidebarCollapsed ? 'true' : 'false');
  }, [isSidebarCollapsed]);

  // Clients Directory Filter State
  const [clientSearch, setClientSearch] = useState('');
  const [clientCountryFilter, setClientCountryFilter] = useState('all');

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

  // Ebooks states
  const [editingEbook, setEditingEbook] = useState(null);
  const [showEbookEditor, setShowEbookEditor] = useState(false);
  const [ebookSearch, setEbookSearch] = useState("");
  const [ebookFilter, setEbookFilter] = useState("all"); // all | packs | single | promo | visible | hidden
  const [selectedEbookIds, setSelectedEbookIds] = useState([]);
  const [ebookSelectionMode, setEbookSelectionMode] = useState(false);
  const [ebookBulkAction, setEbookBulkAction] = useState("");

  // Formations states
  const [editingFormation, setEditingFormation] = useState(null);
  const [showFormationEditor, setShowFormationEditor] = useState(false);
  const [formationSearch, setFormationSearch] = useState("");
  const [formationFilter, setFormationFilter] = useState("Tous");

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

  // Revenue from the last 7 days
  const sevenDaysRevenue = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return orders
      .filter(o => {
        if (!o.date) return false;
        let d;
        if (o.date.includes('/')) {
          const [day, month, year] = o.date.split('/');
          d = new Date(`${year}-${month}-${day}`);
        } else {
          d = new Date(o.date);
        }
        return d >= sevenDaysAgo && (o.status === 'delivered' || o.status === 'shipped');
      })
      .reduce((sum, o) => sum + (o.totalFcfa || 0), 0);
  }, [orders]);

  // Clients Directory from orders and messages
  const clientsList = useMemo(() => {
    const clientsMap = {};
    orders.forEach(o => {
      const key = o.email || o.phone || o.clientName;
      if (!key) return;
      if (!clientsMap[key]) {
        clientsMap[key] = {
          id: key,
          name: o.clientName || 'Client',
          email: o.email || '',
          phone: o.phone || '',
          company: o.company || '',
          country: o.country || 'Bénin',
          ordersCount: 0,
          totalSpent: 0,
          lastDate: o.date || ''
        };
      }
      clientsMap[key].ordersCount += 1;
      if (o.status === 'delivered' || o.status === 'shipped') {
        clientsMap[key].totalSpent += (o.totalFcfa || 0);
      }
    });

    messages.forEach(m => {
      const key = m.email || m.phone || m.name;
      if (!key) return;
      if (!clientsMap[key]) {
        clientsMap[key] = {
          id: key,
          name: m.name || 'Prospect',
          email: m.email || '',
          phone: m.phone || '',
          company: '',
          country: m.country || 'Bénin',
          ordersCount: 0,
          totalSpent: 0,
          lastDate: m.date || ''
        };
      }
    });
    return Object.values(clientsMap);
  }, [orders, messages]);

  const totalClientsCount = clientsList.length;

  // Best Selling Products calculation
  const topSellingProducts = useMemo(() => {
    const productSalesMap = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const pId = item.id || item.productId;
        const pName = item.name;
        const key = pId ? `id-${pId}` : `name-${pName}`;
        if (!key) return;
        if (!productSalesMap[key]) {
          const matched = products.find(p => p.id === pId || p.name === pName);
          productSalesMap[key] = {
            id: pId,
            name: matched?.name || pName || 'Machine',
            category: matched?.category || item.category || 'Équipement',
            image: matched?.image || '/hero.png',
            unitsSold: 0,
            totalRevenue: 0,
            priceFcfa: matched?.priceFcfa || item.priceFcfa || 0
          };
        }
        productSalesMap[key].unitsSold += (item.quantity || 1);
        productSalesMap[key].totalRevenue += ((item.priceFcfa || 0) * (item.quantity || 1));
      });
    });
    return Object.values(productSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [orders, products]);

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

  // Ebooks Handlers
  const handleEbookSave = (payload) => {
    if (editingEbook) {
      updateEbook({ ...payload, id: editingEbook.id });
      showAlert(isEn ? "E-book / Pack updated successfully!" : "E-book ou pack mis à jour avec succès !");
    } else {
      addEbook({ ...payload, id: Date.now() });
      showAlert(isEn ? "E-book / Pack created successfully!" : "Nouvel e-book ou pack créé avec succès !");
    }
    setEditingEbook(null);
    setShowEbookEditor(false);
  };

  const startEditEbook = (bk) => {
    setEditingEbook(bk);
    setShowEbookEditor(true);
  };

  const duplicateEbook = (bk) => {
    const duplicated = {
      ...bk,
      id: Date.now(),
      title: `${bk.title} (Copie)`
    };
    addEbook(duplicated);
    showAlert(isEn ? "Duplicated successfully!" : "E-book dupliqué avec succès !");
  };

  // Formations Handlers
  const handleFormationSave = (payload) => {
    if (editingFormation) {
      if (updateFormation) updateFormation({ ...payload, id: editingFormation.id });
      showAlert(isEn ? "Formation updated successfully!" : "Formation mise à jour avec succès !");
    } else {
      if (addFormation) addFormation({ ...payload, id: Date.now() });
      showAlert(isEn ? "Formation created successfully!" : "Nouvelle formation créée avec succès !");
    }
    setEditingFormation(null);
    setShowFormationEditor(false);
  };

  const startEditFormation = (formItem) => {
    setEditingFormation(formItem);
    setShowFormationEditor(true);
  };

  const duplicateFormation = (formItem) => {
    const duplicated = {
      ...formItem,
      id: Date.now(),
      title: `${formItem.title} (Copie)`
    };
    if (addFormation) addFormation(duplicated);
    showAlert(isEn ? "Duplicated successfully!" : "Formation dupliquée avec succès !");
  };

  // CSV Export Handlers
  const handleExportOrdersCsv = () => {
    if (!orders || orders.length === 0) {
      showAlert(isEn ? "No orders to export." : "Aucune commande à exporter.");
      return;
    }
    const headers = [
      "ID Commande",
      "Date",
      "Nom Client",
      "Email",
      "Téléphone",
      "Entreprise",
      "Pays",
      "Ville/Adresse",
      "Statut",
      "Mode Paiement",
      "Montant Total (FCFA)",
      "Montant Total (EUR)",
      "Acompte 50% (FCFA)",
      "Articles / Équipements"
    ];

    const rows = orders.map(o => [
      o.id,
      o.date,
      o.clientName || o.name || '',
      o.email || '',
      o.phone || '',
      o.company || '',
      o.country || '',
      o.address || '',
      o.status || 'pending',
      o.paymentMethod || 'Acompte Atelier',
      o.totalFcfa || 0,
      o.totalEur || Math.round((o.totalFcfa || 0) / 655.957),
      Math.round((o.totalFcfa || 0) * 0.5),
      (o.items || []).map(i => `${i.quantity}x ${i.name}`).join(' | ')
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BEVULTA_Commandes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert(isEn ? "Orders exported successfully!" : "Fichier CSV des commandes généré avec succès !");
  };

  const handleExportClientsCsv = () => {
    if (!orders || orders.length === 0) {
      showAlert(isEn ? "No clients to export." : "Aucun client à exporter.");
      return;
    }
    const clientMap = new Map();
    orders.forEach(o => {
      const key = (o.email || o.phone || o.clientName || '').toLowerCase().trim();
      if (!key) return;
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          name: o.clientName || o.name || 'Client',
          email: o.email || '',
          phone: o.phone || '',
          company: o.company || '',
          country: o.country || '',
          address: o.address || '',
          orderCount: 1,
          totalSpentFcfa: o.totalFcfa || 0,
          lastOrderDate: o.date
        });
      } else {
        const c = clientMap.get(key);
        c.orderCount += 1;
        c.totalSpentFcfa += (o.totalFcfa || 0);
        c.lastOrderDate = o.date;
      }
    });

    const headers = [
      "Nom du Client",
      "Email",
      "Téléphone",
      "Entreprise",
      "Pays",
      "Adresse",
      "Nombre de Commandes",
      "Total Dépensé (FCFA)",
      "Dernière Commande"
    ];

    const rows = Array.from(clientMap.values()).map(c => [
      c.name,
      c.email,
      c.phone,
      c.company,
      c.country,
      c.address,
      c.orderCount,
      c.totalSpentFcfa,
      c.lastOrderDate
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BEVULTA_Clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert(isEn ? "Clients exported successfully!" : "Fichier CSV des clients généré avec succès !");
  };

  const toggleEbookVisibility = (bk) => {
    const updated = { ...bk, isVisible: bk.isVisible === false ? true : false };
    updateEbook(updated);
    showAlert(
      updated.isVisible 
        ? (isEn ? "E-book is now visible on site." : "L'e-book est maintenant visible sur le site.") 
        : (isEn ? "E-book is now hidden." : "L'e-book est maintenant masqué du site.")
    );
  };

  const handleDeleteEbook = (ids) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    showConfirm(
      lang === 'fr' 
        ? `Êtes-vous sûr de vouloir supprimer ${idsArray.length > 1 ? `ces ${idsArray.length} offres numériques` : 'cette offre numérique'} ?` 
        : `Are you sure you want to delete ${idsArray.length > 1 ? `these ${idsArray.length} items` : 'this item'}?`,
      () => {
        deleteEbook(idsArray);
        setSelectedEbookIds([]);
        showAlert(isEn ? "Item(s) deleted." : "Offre(s) supprimée(s).");
      }
    );
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (showConfirm) {
      showConfirm(
        isEn ? "Do you want to save the new store settings?" : "Voulez-vous enregistrer les modifications apportées aux paramètres de la boutique ?",
        () => {
          updateSettings(settingsForm);
          showAlert(isEn ? "Settings updated successfully!" : "Paramètres mis à jour avec succès !");
        }
      );
    } else {
      updateSettings(settingsForm);
      showAlert(isEn ? "Settings updated successfully!" : "Paramètres mis à jour avec succès !");
    }
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
      {/* Sidebar navigation (Chariow Style) */}
      <aside 
        className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} 
        style={{ 
          width: isSidebarCollapsed ? '76px' : '250px', 
          transition: 'width 0.25s ease', 
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Store Selector Pill at Top */}
        <div style={{ padding: '16px 12px', borderBottom: '1px solid #f1f5f9' }}>
          <div 
            className="store-selector-box"
            onClick={() => setActiveTab('landing_page')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              padding: '8px 10px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={settings?.storeName || 'Bevulta'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#facc15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                {(settings?.storeName || 'Bevulta').charAt(0).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {settings?.storeName || 'Bevulta'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {isEn ? "Online Store" : "Boutique en ligne"}
                  </span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <ChevronsUpDown size={14} color="#94a3b8" className="store-chevron" />
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-menu" style={{ padding: '16px 10px', gap: '4px', flexGrow: 1 }}>
          
          {/* 1. Accueil */}
          <button 
            className={`admin-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'overview' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'overview' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'overview' ? 700 : 500
            }}
            title={isEn ? "Home" : "Accueil"}
          >
            <Home size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Home" : "Accueil"}</span>}
          </button>

          {/* 2. Ventes */}
          <button 
            className={`admin-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'orders' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'orders' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'orders' ? 700 : 500
            }}
            title={isEn ? "Sales & Orders" : "Ventes"}
          >
            <ShoppingBag size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Sales" : "Ventes"}</span>}
            {!isSidebarCollapsed && orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="menu-badge" style={{ backgroundColor: '#ea580c', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', marginLeft: 'auto', fontWeight: 700 }}>
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>

          {/* 3. Produits */}
          <button 
            className={`admin-menu-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'inventory' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'inventory' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'inventory' ? 700 : 500
            }}
            title={isEn ? "Products" : "Produits"}
          >
            <Package size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Products" : "Produits"}</span>}
            {!isSidebarCollapsed && (
              <span className="menu-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', marginLeft: 'auto', fontWeight: 700 }}>
                {products.length}
              </span>
            )}
          </button>

          {/* 4. Clients */}
          <button 
            className={`admin-menu-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'clients' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'clients' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'clients' ? 700 : 500
            }}
            title={isEn ? "Customers" : "Clients"}
          >
            <Users size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Customers" : "Clients"}</span>}
            {!isSidebarCollapsed && totalClientsCount > 0 && (
              <span className="menu-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', marginLeft: 'auto', fontWeight: 700 }}>
                {totalClientsCount}
              </span>
            )}
          </button>

          {/* 5. Revenus */}
          <button 
            className={`admin-menu-item ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'revenue' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'revenue' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'revenue' ? 700 : 500
            }}
            title={isEn ? "Revenue" : "Revenus"}
          >
            <CircleDollarSign size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Revenue" : "Revenus"}</span>}
          </button>

          {/* 6. Analytiques */}
          <button 
            className={`admin-menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'analytics' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'analytics' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'analytics' ? 700 : 500
            }}
            title={isEn ? "Analytics" : "Analytiques"}
          >
            <BarChart3 size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Analytics" : "Analytiques"}</span>}
          </button>

          {/* 7. Marketing */}
          <button 
            className={`admin-menu-item ${activeTab === 'marketing' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketing')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'marketing' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'marketing' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'marketing' ? 700 : 500
            }}
            title={isEn ? "Marketing" : "Marketing"}
          >
            <Megaphone size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Marketing" : "Marketing"}</span>}
          </button>

          {/* 8. Landing Page Customizer */}
          <button 
            className={`admin-menu-item ${activeTab === 'landing_page' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing_page')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'landing_page' ? '#f0fdf4' : 'transparent',
              color: activeTab === 'landing_page' ? '#166534' : '#64748b',
              fontWeight: activeTab === 'landing_page' ? 800 : 500
            }}
            title={isEn ? "Landing Page Editor" : "Landing Page"}
          >
            <LayoutTemplate size={18} color={activeTab === 'landing_page' ? '#166534' : 'currentColor'} />
            {!isSidebarCollapsed && <span>{isEn ? "Landing Page" : "Landing Page"}</span>}
            {!isSidebarCollapsed && (
              <span className="menu-badge" style={{ backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', padding: '1px 6px', fontSize: '0.68rem', marginLeft: 'auto', fontWeight: 800 }}>
                Vitrine
              </span>
            )}
          </button>

          {/* 9. Passerelles de Paiement */}
          <button 
            className={`admin-menu-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'payments' ? '#f0fdf4' : 'transparent',
              color: activeTab === 'payments' ? '#166534' : '#64748b',
              fontWeight: activeTab === 'payments' ? 800 : 500
            }}
            title={isEn ? "Payment Gateways" : "Moyens de Paiement"}
          >
            <CreditCard size={18} color={activeTab === 'payments' ? '#166534' : 'currentColor'} />
            {!isSidebarCollapsed && <span>{isEn ? "Payments" : "Paiements"}</span>}
            {!isSidebarCollapsed && (
              <span className="menu-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px', padding: '1px 6px', fontSize: '0.68rem', marginLeft: 'auto', fontWeight: 800 }}>
                MoMo
              </span>
            )}
          </button>

          {/* 9. E-books & Formations */}
          <button 
            className={`admin-menu-item ${activeTab === 'ebooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('ebooks')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'ebooks' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'ebooks' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'ebooks' ? 700 : 500
            }}
            title={isEn ? "E-books & Guides" : "E-books & Formations"}
          >
            <BookOpen size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "E-books" : "E-books & Guides"}</span>}
            {!isSidebarCollapsed && ebooks.length > 0 && (
              <span className="menu-badge" style={{ backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#d97706', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', marginLeft: 'auto', fontWeight: 700 }}>
                {ebooks.length}
              </span>
            )}
          </button>

          {/* Formations & Ateliers */}
          <button 
            className={`admin-menu-item ${activeTab === 'formations' ? 'active' : ''}`}
            onClick={() => setActiveTab('formations')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'formations' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'formations' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'formations' ? 700 : 500
            }}
            title={isEn ? "Trainings & Sessions" : "Formations & Ateliers"}
          >
            <GraduationCap size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Trainings" : "Formations & Ateliers"}</span>}
            {!isSidebarCollapsed && formations.length > 0 && (
              <span className="menu-badge" style={{ backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', marginLeft: 'auto', fontWeight: 700 }}>
                {formations.length}
              </span>
            )}
          </button>

          {/* 10. Messages Clients */}
          <button 
            className={`admin-menu-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'messages' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'messages' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'messages' ? 700 : 500
            }}
            title={isEn ? "Messages" : "Messages Clients"}
          >
            <Mail size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Messages" : "Messages"}</span>}
            {!isSidebarCollapsed && messages.filter(m => m.status === 'unread').length > 0 && (
              <span className="menu-badge" style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', marginLeft: 'auto', fontWeight: 700 }}>
                {messages.filter(m => m.status === 'unread').length}
              </span>
            )}
          </button>

          {/* 11. Paramètres */}
          <button 
            className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'settings' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'settings' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'settings' ? 700 : 500
            }}
            title={isEn ? "Settings" : "Paramètres"}
          >
            <Settings size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Settings" : "Paramètres"}</span>}
          </button>

          {/* 12. Centre d'aide */}
          <button 
            className={`admin-menu-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
            style={{
              borderRadius: '10px',
              padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderLeft: 'none',
              background: activeTab === 'help' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'help' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'help' ? 700 : 500
            }}
            title={isEn ? "Help Center" : "Centre d'aide"}
          >
            <Headphones size={18} />
            {!isSidebarCollapsed && <span>{isEn ? "Help Center" : "Centre d'aide"}</span>}
          </button>

        </nav>

        {/* Sidebar Bottom Controls */}
        <div className="admin-footer" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', borderTop: '1px solid #f1f5f9' }}>
          {/* Collapse Toggle */}
          <button
            type="button"
            className="admin-menu-item"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              width: '100%',
              padding: isSidebarCollapsed ? '10px 0' : '10px 12px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '0.85rem'
            }}
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            title={isSidebarCollapsed ? (isEn ? "Expand menu" : "Agrandir le menu") : (isEn ? "Collapse menu" : "Réduire le menu")}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!isSidebarCollapsed && <span>{isEn ? "Collapse menu" : "Réduire le menu"}</span>}
          </button>

          {/* Sign Out */}
          <button 
            className="admin-menu-item" 
            style={{
              color: '#ef4444',
              width: '100%',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: isSidebarCollapsed ? '10px 0' : '10px 12px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}
            onClick={logoutAdmin}
            title={isEn ? "Sign out" : "Déconnexion"}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>{t('dashSignOut', lang)}</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="admin-main" style={{ overflow: 'hidden', background: '#f8fafc' }}>
        <header className="admin-header" style={{
          flexShrink: 0,
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {activeTab === 'overview' && (isEn ? "Dashboard Home" : "Accueil")}
              {activeTab === 'orders' && (isEn ? "Sales & Quotes" : "Ventes & Commandes")}
              {activeTab === 'inventory' && (isEn ? "Machinery Catalog" : "Catalogue des Machines")}
              {activeTab === 'clients' && (isEn ? "Customers Directory" : "Répertoire des Clients")}
              {activeTab === 'revenue' && (isEn ? "Revenue & Cashflow" : "Revenus & Trésorerie")}
              {activeTab === 'analytics' && (isEn ? "Analytics & Reports" : "Analytiques & Performance")}
              {activeTab === 'marketing' && (isEn ? "Marketing & Promotions" : "Marketing & Promotions")}
              {activeTab === 'landing_page' && (isEn ? "Landing Page Customizer" : "Personnalisation de la Vitrine")}
              {activeTab === 'payments' && (isEn ? "Payment Gateways & Mobile Money" : "Moyens de Paiement & Mobile Money")}
              {activeTab === 'ebooks' && (isEn ? "Digital Offers & E-books" : "Offres Numériques & E-books")}
              {activeTab === 'formations' && (isEn ? "Trainings & Practical Workshops" : "Formations & Ateliers Pratiques")}
              {activeTab === 'messages' && (isEn ? "Client Inquiries" : "Messages Clients")}
              {activeTab === 'settings' && (isEn ? "Store Settings" : "Paramètres Généraux")}
              {activeTab === 'help' && (isEn ? "Help Center & Documentation" : "Centre d'Aide")}
            </h2>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: '#dcfce7',
              color: '#166534',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              <span>{isEn ? "Store Online" : "Boutique en ligne"}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={goHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ExternalLink size={14} />
              <span>{isEn ? "View Live Store" : "Voir ma boutique"}</span>
            </button>

            {/* Theme & Language Toggles for Admin */}
            <div className="nav-controls" style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                className="theme-toggle"
                style={{ cursor: 'pointer' }}
                title={theme === 'light' ? "Mode sombre" : "Mode clair"}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button 
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} 
                className="lang-toggle"
                style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                title="Language / Langue"
              >
                <Globe size={14} style={{ marginRight: '2px' }} />
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {/* TAB 1: OVERVIEW / ACCUEIL (CHARIOW STYLE) */}
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
              
              {/* Top Stats Cards Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                {/* 1. Revenu total */}
                <div className="chariow-stat-card">
                  <div className="chariow-stat-value">
                    {totalRevenue.toLocaleString()} FCFA
                  </div>
                  <div className="chariow-stat-label">
                    <span>{isEn ? "Total revenue" : "Revenu total"}</span>
                    <span 
                      title={isEn ? "Total revenue from delivered and shipped orders" : "Chiffre d'affaires cumulé des commandes livrées et expédiées"}
                      style={{ cursor: 'help', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                    >
                      <Info size={14} />
                    </span>
                  </div>
                </div>

                {/* 2. 7 derniers jours */}
                <div className="chariow-stat-card">
                  <div className="chariow-stat-value">
                    {sevenDaysRevenue.toLocaleString()} FCFA
                  </div>
                  <div className="chariow-stat-label">
                    <span>{isEn ? "Last 7 days" : "7 derniers jours"}</span>
                    <span 
                      title={isEn ? "Total sales completed over the last 7 rolling days" : "Ventes réalisées au cours des 7 derniers jours glissants"}
                      style={{ cursor: 'help', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                    >
                      <Info size={14} />
                    </span>
                  </div>
                </div>

                {/* 3. Nombre total de clients */}
                <div className="chariow-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('clients')}>
                  <div className="chariow-stat-value">
                    {totalClientsCount}
                  </div>
                  <div className="chariow-stat-label">
                    <span>{isEn ? "Total customers" : "Nombre total de clients"}</span>
                    <span 
                      title={isEn ? "Total unique clients from orders and inquiries" : "Clients uniques ayant commandé ou contacté l'atelier"}
                      style={{ cursor: 'help', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                    >
                      <Info size={14} />
                    </span>
                  </div>
                </div>

                {/* 4. Total des commandes */}
                <div className="chariow-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('orders')}>
                  <div className="chariow-stat-value">
                    {orders.length}
                  </div>
                  <div className="chariow-stat-label">
                    <span>{isEn ? "Total quotes & orders" : "Total des commandes"}</span>
                    <span 
                      title={isEn ? "All quotes and orders recorded in the system" : "Total des devis et commandes enregistrés"}
                      style={{ cursor: 'help', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                    >
                      <Info size={14} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Section: Produits les plus vendus */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {isEn ? "Best-selling products" : "Produits les plus vendus"}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                      {isEn ? "Your best-selling products based on total sales volume" : "Vos produits les plus vendus basés sur le total des ventes"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isEn ? "View all" : "Voir tout"}
                  </button>
                </div>

                {topSellingProducts.length === 0 ? (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    padding: '48px 24px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.95rem',
                    fontWeight: 500
                  }}>
                    {isEn ? "No data available" : "Aucune donnée disponible"}
                  </div>
                ) : (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <th style={{ padding: '14px 20px' }}>Produit</th>
                          <th style={{ padding: '14px 20px' }}>Catégorie</th>
                          <th style={{ padding: '14px 20px', textAlign: 'center' }}>Unités Vendues</th>
                          <th style={{ padding: '14px 20px', textAlign: 'right' }}>Total Ventes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSellingProducts.slice(0, 5).map((prod, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                            <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                background: idx === 0 ? '#fef3c7' : '#f1f5f9',
                                color: idx === 0 ? '#b45309' : '#64748b',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                #{idx + 1}
                              </span>
                              <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>{prod.name}</span>
                            </td>
                            <td style={{ padding: '14px 20px', color: '#475569', fontSize: '0.85rem' }}>{prod.category}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700 }}>{prod.unitsSold}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#166534' }}>{prod.totalRevenue.toLocaleString()} FCFA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Section: Dernières Commandes & Devis Récents */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {isEn ? "Recent Quotes & Orders" : "Dernières Commandes & Devis Récents"}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                      {isEn ? "Latest machinery quotes received from buyers" : "Dernières demandes de devis et commandes enregistrées"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isEn ? "Manage all orders" : "Gérer toutes les commandes"}
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    padding: '48px 24px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.95rem'
                  }}>
                    {isEn ? "No order recorded yet." : "Aucune commande enregistrée pour le moment."}
                  </div>
                ) : (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <th style={{ padding: '14px 20px' }}>Réf & Date</th>
                          <th style={{ padding: '14px 20px' }}>Client</th>
                          <th style={{ padding: '14px 20px' }}>Pays</th>
                          <th style={{ padding: '14px 20px', textAlign: 'right' }}>Montant Total</th>
                          <th style={{ padding: '14px 20px', textAlign: 'center' }}>Statut</th>
                          <th style={{ padding: '14px 20px', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => {
                          const statusConfig = {
                            pending: { label: isEn ? 'Pending' : 'En attente', bg: '#fef3c7', text: '#b45309' },
                            manufacturing: { label: isEn ? 'Manufacturing' : 'Fabrication', bg: '#eff6ff', text: '#1d4ed8' },
                            shipped: { label: isEn ? 'Shipped' : 'Expédié', bg: '#f3e8ff', text: '#7e22ce' },
                            delivered: { label: isEn ? 'Delivered' : 'Livré', bg: '#dcfce7', text: '#166534' }
                          }[order.status] || { label: order.status, bg: '#f1f5f9', text: '#475569' };

                          return (
                            <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.88rem' }}>
                              <td style={{ padding: '14px 20px' }}>
                                <div style={{ fontWeight: 700, color: '#0f172a' }}>{order.id}</div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{order.date}</div>
                                {order.id?.startsWith('FORM-') || order.items?.some(it => String(it.id).startsWith('form-') || it.name?.toLowerCase().includes('formation')) ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#ede9fe', color: '#6d28d9', marginTop: '4px' }}>
                                    🎓 Formation
                                  </span>
                                ) : order.id?.startsWith('EBK-') || order.items?.some(it => String(it.id).startsWith('ebook-') || it.name?.toLowerCase().includes('e-book')) ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#fef3c7', color: '#b45309', marginTop: '4px' }}>
                                    📚 E-book
                                  </span>
                                ) : (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#166534', marginTop: '4px' }}>
                                    ⚙️ Machine
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '14px 20px' }}>
                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.clientName}</div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{order.phone}</div>
                              </td>
                              <td style={{ padding: '14px 20px', color: '#475569' }}>
                                {order.country}
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#166534' }}>
                                {order.totalFcfa.toLocaleString()} FCFA
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  background: statusConfig.bg,
                                  color: statusConfig.text,
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}>
                                  {statusConfig.label}
                                </span>
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => setViewingOrder(order)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    color: '#0f172a',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isEn ? "View details" : "Détails"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Section: Actions Rapides Administrateur */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {isEn ? "Administrator Quick Shortcuts" : "Raccourcis de Gestion Rapide"}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                    {isEn ? "Direct access to key workshop operations" : "Accédez rapidement aux opérations clés de votre atelier"}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px'
                }}>
                  {/* Shortcut 1: Nouvelle machine */}
                  <div
                    onClick={() => {
                      setEditingProduct(null);
                      setShowProductEditor(true);
                    }}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <Plus size={20} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      {isEn ? "+ Add a Machine" : "+ Ajouter une Machine"}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                      {isEn ? "Add an equipment to the public catalog" : "Publier un nouvel équipement sur votre catalogue"}
                    </p>
                  </div>

                  {/* Shortcut 2: Landing Page */}
                  <div
                    onClick={() => setActiveTab('landing_page')}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <LayoutTemplate size={20} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      {isEn ? "Customize Landing Page" : "Personnaliser la Vitrine"}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                      {isEn ? "Edit texts, key metrics, and visible sections" : "Modifier les textes, chiffres clés et sections"}
                    </p>
                  </div>

                  {/* Shortcut 3: Messages & Inquiries */}
                  <div
                    onClick={() => setActiveTab('messages')}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff7ed', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <Mail size={20} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      {isEn ? "Client Inquiries & Support" : "Demandes Clients & SAV"}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                      {messages.filter(m => m.status === 'unread').length} {isEn ? "unread messages to respond to" : "messages non lus en attente de réponse"}
                    </p>
                  </div>
                  {/* Shortcut 4: Payment Gateways */}
                  <div
                    onClick={() => setActiveTab('payments')}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <CreditCard size={20} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      {isEn ? "Payment Gateways & MoMo" : "Moyens de Paiement & MoMo"}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                      {isEn ? "Configure PayDunya, FedaPay, KKiaPay & Saspay" : "Configurer PayDunya, FedaPay, KKiaPay ou Saspay"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: LANDING PAGE CUSTOMIZER (KEY FEATURE REQUESTED) */}
          {activeTab === 'landing_page' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
              <LandingPageEditor
                settings={settings}
                updateSettings={updateSettings}
                lang={lang}
                showAlert={showAlert}
                showConfirm={showConfirm}
                goHome={goHome}
              />
            </div>
          )}

          {/* TAB: PAYMENT GATEWAYS (MOMO, FEDAPAY, PAYDUNYA, KKIAPAY, SASPAY) */}
          {activeTab === 'payments' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
              <PaymentSettingsEditor
                settings={settings}
                updateSettings={updateSettings}
                lang={lang}
                showAlert={showAlert}
                showConfirm={showConfirm}
              />
            </div>
          )}

          {/* TAB: CLIENTS DIRECTORY */}
          {activeTab === 'clients' && (() => {
            const filteredClients = clientsList.filter(c => {
              const matchesSearch = clientSearch === '' || 
                c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
                c.phone.includes(clientSearch) ||
                (c.company && c.company.toLowerCase().includes(clientSearch.toLowerCase()));
              const matchesCountry = clientCountryFilter === 'all' || c.country === clientCountryFilter;
              return matchesSearch && matchesCountry;
            });

            return (
              <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap', flexShrink: 0 }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {isEn ? "Customer & Inquirer Directory" : "Répertoire des Clients & Prospects"}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      {filteredClients.length} {isEn ? "registered contacts" : "contacts enregistrés"}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder={isEn ? "Search by name, email, phone..." : "Rechercher par nom, email, téléphone..."}
                      style={{
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        width: '260px',
                        background: '#ffffff'
                      }}
                    />

                    <select
                      value={clientCountryFilter}
                      onChange={(e) => setClientCountryFilter(e.target.value)}
                      style={{
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        background: '#ffffff'
                      }}
                    >
                      <option value="all">{isEn ? "All Countries" : "Tous les Pays"}</option>
                      <option value="Bénin">Bénin</option>
                      <option value="Togo">Togo</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Niger">Niger</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleExportClientsCsv}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Download size={15} />
                      <span>{isEn ? "Export (CSV)" : "Exporter (CSV)"}</span>
                    </button>
                  </div>
                </div>

                <div style={{ flexGrow: 1, overflowY: 'auto', background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  {filteredClients.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748b' }}>
                      {isEn ? "No client matches your search." : "Aucun client ne correspond à votre recherche."}
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>
                          <th style={{ padding: '14px 20px' }}>Client</th>
                          <th style={{ padding: '14px 20px' }}>Contact</th>
                          <th style={{ padding: '14px 20px' }}>Pays / Entreprise</th>
                          <th style={{ padding: '14px 20px', textAlign: 'center' }}>Commandes</th>
                          <th style={{ padding: '14px 20px', textAlign: 'right' }}>Total Acheté</th>
                          <th style={{ padding: '14px 20px', textAlign: 'center' }}>Actions Rapides</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map((client, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.88rem' }}>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: '#f1f5f9',
                                  color: '#0f172a',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.85rem'
                                }}>
                                  {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{client.name}</div>
                                  {client.company && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{client.company}</div>}
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 20px', color: '#334155' }}>
                              <div>{client.phone}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{client.email}</div>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                background: '#f1f5f9',
                                color: '#334155',
                                fontSize: '0.78rem',
                                fontWeight: 600
                              }}>
                                {client.country}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700 }}>
                              {client.ordersCount}
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#166534' }}>
                              {client.totalSpent.toLocaleString()} FCFA
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                {client.phone && (
                                  <button
                                    type="button"
                                    onClick={() => window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      background: '#dcfce7',
                                      color: '#166534',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="WhatsApp"
                                  >
                                    <MessageCircle size={13} />
                                    <span>WhatsApp</span>
                                  </button>
                                )}
                                {client.phone && (
                                  <button
                                    type="button"
                                    onClick={() => window.location.href = `tel:${client.phone}`}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '8px',
                                      border: '1px solid #cbd5e1',
                                      background: '#ffffff',
                                      color: '#334155',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      cursor: 'pointer'
                                    }}
                                    title="Appeler"
                                  >
                                    <Phone size={13} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB: REVENUS & TRÉSORERIE */}
          {activeTab === 'revenue' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {isEn ? "Financial Overview & Cashflow" : "Synthèse Financière & Trésorerie"}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  {isEn ? "Monitor your realized revenue, pending quotes, and country distributions." : "Suivez votre chiffre d'affaires encaissé, les devis en cours et la répartition géographique."}
                </p>
              </div>

              {/* 3 Financial Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="chariow-stat-card">
                  <div className="chariow-stat-value" style={{ color: '#166534' }}>
                    {totalRevenue.toLocaleString()} FCFA
                  </div>
                  <div className="chariow-stat-label">
                    <span>{isEn ? "Realized Revenue (Delivered/Shipped)" : "Chiffre d'Affaires Encaissé"}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '8px', fontWeight: 600 }}>
                    {orders.filter(o => o.status === 'delivered' || o.status === 'shipped').length} {isEn ? "completed orders" : "commandes honorées"}
                  </div>
                </div>

                <div className="chariow-stat-card">
                  <div className="chariow-stat-value" style={{ color: '#ea580c' }}>
                    {pendingRevenue.toLocaleString()} FCFA
                  </div>
                  <div className="chariow-stat-label">
                    <span>{isEn ? "Pending Pipeline (Quotes/Manufacturing)" : "Trésorerie en Attente / Fabrication"}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '8px', fontWeight: 600 }}>
                    {orders.filter(o => o.status === 'pending' || o.status === 'manufacturing').length} {isEn ? "quotes in progress" : "devis en cours"}
                  </div>
                </div>

                <div className="chariow-stat-card">
                  <div className="chariow-stat-value">
                    {orders.length > 0 ? Math.round((totalRevenue + pendingRevenue) / orders.length).toLocaleString() : 0} FCFA
                  </div>
                  <div className="chariow-stat-label">
                    <span>{isEn ? "Average Order Value (Basket)" : "Panier Moyen par Devis"}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
                    {orders.length} {isEn ? "orders considered" : "commandes analysées"}
                  </div>
                </div>
              </div>

              {/* Country Breakdown Chart */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
                  {isEn ? "Revenue Share by Country (FCFA)" : "Répartition du Chiffre d'Affaires par Pays (FCFA)"}
                </h4>
                <div className="chart-wrapper">
                  {Object.entries(getVentesParPays()).map(([country, amt]) => {
                    const maxAmount = Math.max(...Object.values(getVentesParPays()), 1000000);
                    const barHeight = amt > 0 ? (amt / maxAmount) * 200 : 5;
                    return (
                      <div key={country} className="chart-bar-container">
                        <div className="chart-bar" style={{ height: `${barHeight}px`, background: '#166534' }}>
                          {amt > 0 && <span className="chart-bar-value">{(amt / 1000).toFixed(0)}k</span>}
                        </div>
                        <span className="chart-bar-label">{country}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTIQUES */}
          {activeTab === 'analytics' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {isEn ? "Analytics & Machine Performance" : "Analytiques & Performance des Machines"}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  {isEn ? "Breakdown of equipment sales by category and subcategory." : "Analyse fine des ventes par catégorie et sous-catégorie d'équipement."}
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
                  {isEn ? "Sales by Equipment Category" : "Ventes par Catégorie d'Équipement"}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {Object.entries(getVentesParCategorie()).map(([category, val]) => {
                    const totalCat = Object.values(getVentesParCategorie()).reduce((a, b) => a + b, 0) || 1;
                    const percentage = Math.round((val / totalCat) * 100);
                    return (
                      <div key={category} style={{ fontSize: '0.9rem' }}>
                        <div 
                          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', cursor: 'pointer', alignItems: 'center' }} 
                          onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                        >
                          <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', color: '#0f172a' }}>
                            <ChevronRight size={15} style={{ marginRight: '6px', transform: expandedCategories[category] ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                            {getCategoryLabel(category)}
                          </span>
                          <span style={{ color: '#166534', fontWeight: 800 }}>{percentage}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#166534', borderRadius: '4px' }}></div>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
                          {val.toLocaleString()} FCFA
                        </div>

                        {expandedCategories[category] && (
                          <div style={{ marginTop: '14px', paddingLeft: '18px', borderLeft: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(getVentesParSousCategorie(category)).map(([sub, subVal]) => {
                              const subPercentage = val > 0 ? Math.round((subVal / val) * 100) : 0;
                              return (
                                <div key={sub}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.82rem', color: '#475569' }}>{sub}</span>
                                    <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.82rem' }}>{subPercentage}%</span>
                                  </div>
                                  <div style={{ width: '100%', height: '5px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${subPercentage}%`, height: '100%', backgroundColor: '#0284c7', borderRadius: '3px' }}></div>
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'right', marginTop: '2px' }}>
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
          )}

          {/* TAB: MARKETING */}
          {activeTab === 'marketing' && (
            <div style={{ animation: 'fadeIn 0.3s ease', overflowY: 'auto', height: '100%', paddingRight: '12px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {isEn ? "Marketing & Commercial Campaigns" : "Marketing & Campagnes Commerciales"}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  {isEn ? "Configure marketing banners, promotional e-book offers, and announcements." : "Gérez vos bandeaux promotionnels, vos packs d'e-books et vos annonces commerciales."}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Banner Promo Card */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Megaphone size={18} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {isEn ? "Announcement Banner" : "Bandeau d'Annonce Supérieur"}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                    {settings?.heroAnnouncement || "Aucune annonce définie actuellement."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('landing_page')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#166534',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isEn ? "Edit Announcement on Landing Page" : "Modifier sur la Landing Page"}
                  </button>
                </div>

                {/* Ebooks Packs Card */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={18} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {isEn ? "Digital Offers & Packs" : "Offres Numériques & E-books"}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                    {ebooks.length} {isEn ? "e-books and guides available for instant download." : "guides et e-books disponibles au téléchargement direct."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ebooks')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#d97706',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isEn ? "Manage E-books" : "Gérer les E-books & Formations"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CENTRE D'AIDE */}
          {activeTab === 'help' && (
            <AdminHelpCenter 
              lang={lang} 
              settings={settings} 
              setActiveTab={setActiveTab} 
            />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleExportOrdersCsv}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Download size={15} />
                    <span>{isEn ? "Export (CSV)" : "Exporter (CSV)"}</span>
                  </button>

                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowOrderEditor(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={16} />
                    <span>{isEn ? "New Order" : "Nouvelle Commande"}</span>
                  </button>
                </div>
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
                        <td style={{ fontWeight: 800 }}>
                          <div>{order.id}</div>
                          {order.id?.startsWith('FORM-') || order.items?.some(it => String(it.id).startsWith('form-') || it.name?.toLowerCase().includes('formation')) ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#ede9fe', color: '#6d28d9', marginTop: '4px' }}>
                              🎓 Formation
                            </span>
                          ) : order.id?.startsWith('EBK-') || order.items?.some(it => String(it.id).startsWith('ebook-') || it.name?.toLowerCase().includes('e-book')) ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#fef3c7', color: '#b45309', marginTop: '4px' }}>
                              📚 E-book
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#166534', marginTop: '4px' }}>
                              ⚙️ Machine
                            </span>
                          )}
                        </td>
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

          {/* TAB: E-BOOKS & PACKS */}
          {activeTab === 'ebooks' && (() => {
            const filteredEbooks = ebooks.filter(b => {
              const q = ebookSearch.toLowerCase();
              const matchSearch = !q || 
                b.title?.toLowerCase().includes(q) || 
                b.subtitle?.toLowerCase().includes(q) || 
                b.category?.toLowerCase().includes(q) ||
                b.includedBooks?.some(item => item.toLowerCase().includes(q));

              if (!matchSearch) return false;
              if (ebookFilter === 'packs') return b.isPack;
              if (ebookFilter === 'single') return !b.isPack;
              if (ebookFilter === 'promo') return Boolean(b.promoPriceFcfa);
              if (ebookFilter === 'visible') return b.isVisible !== false;
              if (ebookFilter === 'hidden') return b.isVisible === false;
              return true;
            });

            const totalPacks = ebooks.filter(e => e.isPack).length;
            const totalPromos = ebooks.filter(e => e.promoPriceFcfa).length;
            const totalSingles = ebooks.filter(e => !e.isPack).length;

            return (
              <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                
                {/* Header & Search */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '12px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', margin: '0 0 4px' }}>
                      {isEn ? "E-books & Complete Packs Management" : "Gestion des E-books & Packs Numériques"}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {isEn ? "Create, sell single e-books or bundle multiple books in packs with promo pricing." : "Créez et vendez des e-books à l'unité ou en packs multi-livres avec gestion des prix normaux et promo."}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder={isEn ? "Search e-books, packs..." : "Rechercher par titre, thème..."}
                        value={ebookSearch}
                        onChange={(e) => setEbookSearch(e.target.value)}
                        style={{ width: '240px', paddingRight: '28px' }}
                      />
                      {ebookSearch && (
                        <button 
                          onClick={() => setEbookSearch('')} 
                          style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <button
                      className="btn btn-outline"
                      style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                      onClick={() => {
                        setEbookSelectionMode(!ebookSelectionMode);
                        setSelectedEbookIds([]);
                      }}
                    >
                      {ebookSelectionMode ? (isEn ? "Exit Selection" : "Annuler sélection") : (isEn ? "Bulk Actions" : "Sélectionner")}
                    </button>

                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setEditingEbook(null);
                        setShowEbookEditor(true);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Plus size={16} />
                      <span>{isEn ? "Add E-book or Pack" : "Ajouter un E-book / Pack"}</span>
                    </button>
                  </div>
                </div>

                {/* Filter pills & KPI row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px', flexShrink: 0, flexWrap: 'wrap' }}>
                  
                  {/* Filter tabs */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: isEn ? `All (${ebooks.length})` : `Tous (${ebooks.length})` },
                      { id: 'packs', label: isEn ? `Packs (${totalPacks})` : `Packs Groupés (${totalPacks})` },
                      { id: 'single', label: isEn ? `Single Books (${totalSingles})` : `E-books Seuls (${totalSingles})` },
                      { id: 'promo', label: isEn ? `On Sale (${totalPromos})` : `En Promotion (${totalPromos})` },
                      { id: 'visible', label: isEn ? 'Visible' : 'Visibles' },
                      { id: 'hidden', label: isEn ? 'Hidden' : 'Masqués' }
                    ].map(f => {
                      const active = ebookFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setEbookFilter(f.id)}
                          style={{
                            padding: '5px 12px',
                            fontSize: '0.78rem',
                            borderRadius: '20px',
                            border: `1px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            background: active ? 'var(--primary)' : 'var(--bg-surface)',
                            color: active ? '#ffffff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontWeight: active ? 700 : 500,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bulk action buttons if selection mode */}
                  {ebookSelectionMode && selectedEbookIds.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{selectedEbookIds.length} sélectionné(s) :</span>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => {
                          selectedEbookIds.forEach(id => {
                            const found = ebooks.find(e => e.id === id);
                            if (found) updateEbook({ ...found, isVisible: true });
                          });
                          setSelectedEbookIds([]);
                          showAlert("Marqués comme visibles.");
                        }}
                      >
                        Rendre visible
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => {
                          selectedEbookIds.forEach(id => {
                            const found = ebooks.find(e => e.id === id);
                            if (found) updateEbook({ ...found, isVisible: false });
                          });
                          setSelectedEbookIds([]);
                          showAlert("Marqués comme masqués.");
                        }}
                      >
                        Masquer
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                        onClick={() => handleDeleteEbook(selectedEbookIds)}
                      >
                        Supprimer ({selectedEbookIds.length})
                      </button>
                    </div>
                  )}
                </div>

                {/* E-books Data Table */}
                <div className="data-table-container" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        {ebookSelectionMode && (
                          <th style={{ width: '40px' }}>
                            <input 
                              type="checkbox"
                              checked={selectedEbookIds.length === filteredEbooks.length && filteredEbooks.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEbookIds(filteredEbooks.map(b => b.id));
                                } else {
                                  setSelectedEbookIds([]);
                                }
                              }}
                            />
                          </th>
                        )}
                        <th style={{ width: '60px' }}>Couverture</th>
                        <th>{isEn ? "Offer / Title" : "Offre & Titre"}</th>
                        <th>Type</th>
                        <th>Catégorie</th>
                        <th>{isEn ? "Normal Price" : "Prix Normal"}</th>
                        <th>{isEn ? "Promo Price" : "Prix Promo"}</th>
                        <th>Volume</th>
                        <th>Statut</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEbooks.length === 0 ? (
                        <tr>
                          <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                            <BookOpen size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
                            <div>{isEn ? "No e-books or packs found." : "Aucun e-book ou pack correspondant."}</div>
                          </td>
                        </tr>
                      ) : (
                        filteredEbooks.map(bk => {
                          const hasPromo = Boolean(bk.promoPriceFcfa);
                          const discountPct = hasPromo ? Math.round(((bk.priceFcfa - bk.promoPriceFcfa) / bk.priceFcfa) * 100) : 0;

                          return (
                            <tr key={bk.id}>
                              {ebookSelectionMode && (
                                <td>
                                  <input 
                                    type="checkbox"
                                    checked={selectedEbookIds.includes(bk.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedEbookIds([...selectedEbookIds, bk.id]);
                                      } else {
                                        setSelectedEbookIds(selectedEbookIds.filter(id => id !== bk.id));
                                      }
                                    }}
                                  />
                                </td>
                              )}
                              <td>
                                <img 
                                  src={bk.coverImage} 
                                  alt={bk.title} 
                                  style={{ width: '44px', height: '58px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} 
                                />
                              </td>
                              <td>
                                <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                                  {bk.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '300px' }}>
                                  {bk.subtitle || bk.description?.substring(0, 80) + '...'}
                                </div>
                                {bk.isPack && bk.includedBooks && bk.includedBooks.length > 0 && (
                                  <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {bk.includedBooks.map((item, i) => (
                                      <span key={i} style={{ fontSize: '0.68rem', background: 'rgba(217, 119, 6, 0.1)', color: '#b45309', padding: '1px 6px', borderRadius: '3px' }}>
                                        ✓ {item.substring(0, 24)}...
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td>
                                {bk.isPack ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(90deg, #d97706, #b45309)', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                                    <Layers size={12} />
                                    PACK ({bk.includedBooks?.length || 2})
                                  </span>
                                ) : (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(22, 101, 52, 0.1)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                                    <BookOpen size={12} />
                                    E-BOOK SEUL
                                  </span>
                                )}
                              </td>
                              <td>
                                <span className="badge badge-agro" style={{ fontSize: '0.72rem' }}>
                                  {bk.category}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600, color: hasPromo ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: hasPromo ? 'line-through' : 'none', fontSize: '0.85rem' }}>
                                  {bk.priceFcfa.toLocaleString()} FCFA
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  ({bk.priceEur} €)
                                </div>
                              </td>
                              <td>
                                {hasPromo ? (
                                  <div>
                                    <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.9rem' }}>
                                      {bk.promoPriceFcfa.toLocaleString()} FCFA
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
                                      -{discountPct}% ({bk.promoPriceEur} €)
                                    </div>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    Standard
                                  </span>
                                )}
                              </td>
                              <td>
                                <div style={{ fontSize: '0.78rem' }}>{bk.pages}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PDF</div>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => toggleEbookVisibility(bk)}
                                  style={{
                                    border: 'none',
                                    background: bk.isVisible !== false ? 'rgba(22, 101, 52, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                    color: bk.isVisible !== false ? '#16a34a' : 'var(--text-muted)',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Cliquer pour basculer la visibilité"
                                >
                                  <Eye size={12} />
                                  <span>{bk.isVisible !== false ? "Visible" : "Masqué"}</span>
                                </button>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                  <button
                                    className="btn btn-outline"
                                    style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                                    title={isEn ? "Edit" : "Modifier"}
                                    onClick={() => startEditEbook(bk)}
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    className="btn btn-outline"
                                    style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                                    title={isEn ? "Duplicate" : "Dupliquer"}
                                    onClick={() => duplicateEbook(bk)}
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button
                                    className="btn btn-outline"
                                    style={{ padding: '5px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                                    title={isEn ? "Delete" : "Supprimer"}
                                    onClick={() => handleDeleteEbook(bk.id)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })()}

          {/* TAB: FORMATIONS & WORKSHOPS */}
          {activeTab === 'formations' && (() => {
            const filteredFormations = formations.filter(f => {
              const q = formationSearch.toLowerCase();
              const matchSearch = !q || 
                f.title?.toLowerCase().includes(q) || 
                f.subtitle?.toLowerCase().includes(q) || 
                f.category?.toLowerCase().includes(q) ||
                f.location?.toLowerCase().includes(q);

              if (!matchSearch) return false;
              if (formationFilter !== 'Tous' && f.category !== formationFilter) return false;
              return true;
            });

            return (
              <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                
                {/* Header & Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', width: '280px' }}>
                      <input
                        type="text"
                        placeholder={isEn ? "Search formations by title, theme..." : "Rechercher une formation..."}
                        value={formationSearch}
                        onChange={(e) => setFormationSearch(e.target.value)}
                        className="form-input"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                    </div>

                    {/* Filter categories */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                      {["Tous", "Agro-alimentaire", "Mécanique & Maintenance", "Élevage & Nutrition", "BTP & Matériaux"].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormationFilter(cat)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: 'none',
                            fontSize: '0.78rem',
                            fontWeight: formationFilter === cat ? 800 : 500,
                            background: formationFilter === cat ? '#166534' : '#f1f5f9',
                            color: formationFilter === cat ? '#ffffff' : '#475569',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setEditingFormation(null); setShowFormationEditor(true); }}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#166534',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Plus size={16} />
                    <span>{isEn ? "Add New Formation" : "+ Créer une Formation"}</span>
                  </button>
                </div>

                {/* Formations Table */}
                <div className="data-table-container" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>Visuel</th>
                        <th>Formation & Programme</th>
                        <th>Catégorie</th>
                        <th>Tarif (FCFA)</th>
                        <th>Durée & Lieu</th>
                        <th>Prochaine Session</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFormations.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                            {isEn ? "No formations found matching your search." : "Aucune formation trouvée avec ces critères."}
                          </td>
                        </tr>
                      ) : (
                        filteredFormations.map(f => (
                          <tr key={f.id}>
                            <td>
                              <img
                                src={f.coverImage}
                                alt={f.title}
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700'; }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                                {f.title}
                              </div>
                              {f.subtitle && (
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                  {f.subtitle}
                                </div>
                              )}
                              {f.badge && (
                                <span style={{
                                  display: 'inline-block',
                                  marginTop: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  color: '#059669',
                                  background: '#ecfdf5',
                                  padding: '2px 8px',
                                  borderRadius: '10px'
                                }}>
                                  {f.badge}
                                </span>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                                {f.category}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.92rem' }}>
                                {(f.promoPriceFcfa || f.priceFcfa).toLocaleString()} F
                              </div>
                              {f.promoPriceFcfa && (
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                  {f.priceFcfa.toLocaleString()} F
                                </div>
                              )}
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                ≈ {(f.promoPriceEur || f.priceEur)} €
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                                {f.duration}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                {f.location}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>
                                📅 {f.nextSession}
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onViewDetail) onViewDetail(f, 'formation');
                                  }}
                                  className="action-btn"
                                  title="Voir la fiche"
                                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                                >
                                  <Eye size={15} color="#475569" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => duplicateFormation(f)}
                                  className="action-btn"
                                  title="Dupliquer"
                                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                                >
                                  <Copy size={15} color="#475569" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startEditFormation(f)}
                                  className="action-btn"
                                  title="Modifier"
                                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                                >
                                  <Edit size={15} color="#2563eb" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const confirmMsg = isEn 
                                      ? `Delete formation "${f.title}"?`
                                      : `Êtes-vous sûr de vouloir supprimer définitivement la formation « ${f.title} » ?`;
                                    if (showConfirm) {
                                      showConfirm(confirmMsg, () => {
                                        if (deleteFormation) deleteFormation(f.id);
                                        showAlert(isEn ? "Formation deleted." : "Formation supprimée.");
                                      });
                                    } else {
                                      if (deleteFormation) deleteFormation(f.id);
                                    }
                                  }}
                                  className="action-btn"
                                  title="Supprimer"
                                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff' }}
                                >
                                  <Trash2 size={15} color="#dc2626" />
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
            );
          })()}

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
                                {msg.subject?.toLowerCase().includes('formation') || msg.subject?.toLowerCase().includes('training') ? (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: '#f3e8ff', color: '#7e22ce', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    🎓 {msg.subject}
                                  </span>
                                ) : (
                                  <span className="badge badge-menu" style={{ fontSize: '0.72rem' }}>{msg.subject}</span>
                                )}
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
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  className="form-input"
                  style={{ fontWeight: 'bold', color: 'var(--primary)', flex: '1 1 200px' }}
                  value={viewingOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    const statusLabels = {
                      pending: isEn ? "Awaiting Payment" : "En attente / Validation de paiement",
                      manufacturing: isEn ? "In Manufacturing" : "En cours de fabrication",
                      shipped: isEn ? "Shipped" : "Expédié",
                      delivered: isEn ? "Delivered" : "Livré"
                    };
                    if (showConfirm) {
                      showConfirm(
                        isEn 
                          ? `Are you sure you want to change order #${viewingOrder.id} status to "${statusLabels[newStatus] || newStatus}"?`
                          : `Confirmez-vous le changement de statut de la commande N° ${viewingOrder.id} vers "${statusLabels[newStatus] || newStatus}" ?`,
                        () => {
                          updateOrderStatus(viewingOrder.id, newStatus);
                          setViewingOrder({ ...viewingOrder, status: newStatus });
                          showAlert(isEn ? "Order status updated." : "Statut de la commande mis à jour.");
                        }
                      );
                    } else {
                      updateOrderStatus(viewingOrder.id, newStatus);
                      setViewingOrder({ ...viewingOrder, status: newStatus });
                    }
                  }}
                >
                  <option value="pending">{isEn ? "Awaiting Payment Validation" : "En attente / Validation de paiement"}</option>
                  <option value="manufacturing">{isEn ? "In Manufacturing" : "En cours de fabrication"}</option>
                  <option value="shipped">{isEn ? "Shipped" : "Expédié"}</option>
                  <option value="delivered">{isEn ? "Delivered" : "Livré"}</option>
                </select>

                {viewingOrder.phone && (
                  <a
                    href={`https://wa.me/${viewingOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      isEn
                        ? `Hello ${viewingOrder.clientName || 'Customer'}, your BEVULTA order #${viewingOrder.id} status is now: "${viewingOrder.status}". Live tracking: https://bevulta.com - Workshop (+229 97 69 91 78).`
                        : `Bonjour ${viewingOrder.clientName || 'Cher Client'}, votre commande BEVULTA N° ${viewingOrder.id} est désormais : "${
                            viewingOrder.status === 'manufacturing' ? 'En cours de fabrication à l atelier de Cotonou' :
                            viewingOrder.status === 'shipped' ? 'Expédié / Confié au transporteur' :
                            viewingOrder.status === 'delivered' ? 'Livré et Opérationnel' : 'En attente de validation'
                          }". Vous pouvez suivre son avancement en direct sur notre site. Atelier BEVULTA (+229) 97 69 91 78.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '11px 16px',
                      background: 'rgba(22, 163, 74, 0.1)',
                      color: '#166534',
                      borderColor: 'rgba(22, 163, 74, 0.3)',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}
                    title={isEn ? "Notify client via WhatsApp" : "Avertir le client par WhatsApp"}
                  >
                    <span>📲 {isEn ? "Notify Client" : "Avertir le client par WhatsApp"}</span>
                  </a>
                )}
              </div>
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

      {/* ADD/EDIT EBOOK FULL-PAGE EDITOR */}
      {showEbookEditor && (
        <EbookEditor
          ebook={editingEbook}
          onSave={handleEbookSave}
          onCancel={() => { setShowEbookEditor(false); setEditingEbook(null); }}
          allEbooks={ebooks}
          lang={lang}
          showAlert={showAlert}
          showConfirm={showConfirm}
        />
      )}

      {/* ADD/EDIT FORMATION FULL-PAGE EDITOR */}
      {showFormationEditor && (
        <FormationEditor
          formation={editingFormation}
          onSave={handleFormationSave}
          onCancel={() => { setShowFormationEditor(false); setEditingFormation(null); }}
          lang={lang}
          showAlert={showAlert}
          showConfirm={showConfirm}
        />
      )}
    </div>
  );
}

