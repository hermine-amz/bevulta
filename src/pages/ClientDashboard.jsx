import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  LogOut, 
  Clock, 
  Wrench, 
  Truck, 
  CheckCircle2, 
  MessageSquare, 
  Home,
  Printer,
  Download,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import PhoneInputWithCountry from '../components/PhoneInputWithCountry';
import CountrySelect from '../components/CountrySelect';
import ProformaModal from '../components/ProformaModal';
import { downloadWatermarkedPdf, downloadTrainingProgramPdf } from '../services/pdfWatermarkService';
import { t } from '../data/translations';

export default function ClientDashboard({ 
  user, 
  orders = [], 
  messages = [], 
  ebooks = [],
  formations = [],
  settings = {},
  onLogout, 
  lang = 'fr',
  goHome,
  onGoToTracking,
  showAlert
}) {
  const isEn = lang === 'en';

  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('bevulta_client_tab') || 'quotes';
  });

  useEffect(() => {
    sessionStorage.setItem('bevulta_client_tab', activeTab);
  }, [activeTab]);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Client BEVULTA',
    email: user?.email || '',
    phone: user?.phone || '+229 97 12 34 56',
    company: user?.company || '',
    country: user?.country || 'Bénin',
    address: user?.address || 'Cotonou, Bénin'
  });

  // State for Proforma Modal & PDF download loading
  const [selectedProformaOrder, setSelectedProformaOrder] = useState(null);
  const [downloadingItemId, setDownloadingItemId] = useState(null);

  // Filter orders (quotes) belonging to this client by matching their email
  const clientOrders = orders.filter(
    (order) => order.email?.toLowerCase() === user?.email?.toLowerCase()
  );

  // Extract all purchased digital items across client orders
  const purchasedDigitalItems = clientOrders.flatMap(order => {
    return (order.items || []).filter(item => {
      const name = (item.name || '').toLowerCase();
      const id = String(item.id || '');
      return (
        item.isEbook ||
        item.isFormation ||
        name.includes('[e-book]') ||
        name.includes('[formation]') ||
        name.includes('guide') ||
        id.startsWith('ebook-') ||
        id.startsWith('form-')
      );
    }).map(item => ({
      ...item,
      orderId: order.id,
      orderDate: order.date,
      orderStatus: order.status
    }));
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (showAlert) {
      showAlert(isEn ? "Profile updated successfully!" : "Profil mis à jour avec succès !");
    }
  };

  // Re-download handler for Ebooks or Formations
  const handleDownloadDigitalItem = async (item) => {
    setDownloadingItemId(item.id);
    try {
      const isFormation = item.isFormation || item.name?.toLowerCase().includes('formation') || String(item.id).startsWith('form-');
      if (isFormation) {
        const cleanName = item.name.replace('[Formation]', '').trim();
        const found = (formations || []).find(f => f.title?.toLowerCase().includes(cleanName.toLowerCase())) || {
          title: cleanName,
          subtitle: "Programme Pratique de Formation Continue",
          duration: "3 Jours intensifs",
          location: "Atelier Central BEVULTA, Cotonou, Bénin",
          nextSession: "Session Mensuelle",
          modules: []
        };
        await downloadTrainingProgramPdf(found, {
          name: user?.name || profileForm.name,
          email: user?.email || profileForm.email,
          phone: user?.phone || profileForm.phone,
          orderId: item.orderId || 'CONF-NUM',
          mode: 'Présentiel Atelier'
        });
        if (showAlert) {
          showAlert(isEn ? "Training program downloaded successfully!" : "Programme de formation téléchargé avec succès !");
        }
      } else {
        const cleanName = item.name.replace('[E-book]', '').replace('[Pack]', '').trim();
        const found = (ebooks || []).find(b => b.title?.toLowerCase().includes(cleanName.toLowerCase())) || {
          title: cleanName,
          subtitle: "Guide Professionnel BEVULTA",
          pages: "150 pages",
          author: "Bureau d'Études BEVULTA",
          fileFormat: "PDF Haute Définition",
          category: "Agro-alimentaire"
        };
        await downloadWatermarkedPdf(found, {
          name: user?.name || profileForm.name,
          email: user?.email || profileForm.email,
          phone: user?.phone || profileForm.phone
        });
        if (showAlert) {
          showAlert(isEn ? "Secured personalized e-book downloaded!" : "E-book officiel sécurisé téléchargé avec succès !");
        }
      }
    } catch (err) {
      console.error("Download error:", err);
      if (showAlert) {
        showAlert(isEn ? "Failed to generate document. Please try again." : "Erreur de génération du document. Veuillez réessayer.");
      }
    } finally {
      setDownloadingItemId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-warning" />;
      case 'manufacturing':
        return <Wrench size={20} className="text-primary" />;
      case 'shipped':
        return <Truck size={20} style={{ color: 'var(--accent-cyan)' }} />;
      case 'delivered':
        return <CheckCircle2 size={20} className="text-success" />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusLabel = (status) => {
    if (!isEn) {
      switch (status) {
        case 'pending': return 'En attente de validation';
        case 'manufacturing': return 'En cours de fabrication';
        case 'shipped': return 'Expédié / En transit';
        case 'delivered': return 'Livré';
        default: return 'Inconnu';
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending Validation';
        case 'manufacturing': return 'In Manufacturing';
        case 'shipped': return 'Shipped / In Transit';
        case 'delivered': return 'Delivered';
        default: return 'Unknown';
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'manufacturing': return 'status-manufacturing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };

  return (
    <div className="admin-shell" style={{ minHeight: '85vh' }}>
      
      {/* Sidebar navigation */}
      <aside className="admin-sidebar" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="admin-logo" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 800 }}>{user?.name || 'Client BEVULTA'}</span>
          <small style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
            {t('dashClient', lang)}
          </small>
        </div>

        <nav className="admin-menu">
          <button 
            className="admin-menu-item"
            onClick={goHome}
          >
            <Home size={18} />
            <span>{t('navHome', lang)}</span>
          </button>

          {/* Quotes & Orders Tab */}
          <button 
            className={`admin-menu-item ${activeTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quotes')}
          >
            <FileText size={18} />
            <span>{t('dashOrders', lang)}</span>
            {clientOrders.length > 0 && (
              <span style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                borderRadius: '50%', 
                padding: '2px 8px', 
                fontSize: '0.75rem', 
                marginLeft: 'auto' 
              }}>
                {clientOrders.length}
              </span>
            )}
          </button>

          {/* Digital Purchases Tab */}
          <button 
            className={`admin-menu-item ${activeTab === 'digital' ? 'active' : ''}`}
            onClick={() => setActiveTab('digital')}
          >
            <BookOpen size={18} />
            <span>{isEn ? "E-books & Trainings" : "Mes E-books & Formations"}</span>
            {purchasedDigitalItems.length > 0 && (
              <span style={{ 
                backgroundColor: '#166534', 
                color: 'white', 
                borderRadius: '50%', 
                padding: '2px 8px', 
                fontSize: '0.75rem', 
                marginLeft: 'auto' 
              }}>
                {purchasedDigitalItems.length}
              </span>
            )}
          </button>

          {/* Messages Tab */}
          <button 
            className={`admin-menu-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={18} />
            <span>{isEn ? 'My Messages' : 'Mes Messages'}</span>
            {messages.filter(m => m.status === 'replied').length > 0 && (
              <span style={{ backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}>
                {messages.filter(m => m.status === 'replied').length}
              </span>
            )}
          </button>

          {/* Profile Tab */}
          <button 
            className={`admin-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>{isEn ? 'My Profile' : 'Mon Profil'}</span>
          </button>
        </nav>

        <div className="admin-footer">
          <button 
            className="admin-menu-item" 
            style={{ color: 'var(--danger)', width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>{t('dashSignOut', lang)}</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="admin-main" style={{ padding: '24px' }}>
        <header className="admin-header" style={{ marginBottom: '24px', padding: '16px 24px', borderRadius: 'var(--radius-md)' }}>
          <div className="admin-header-title">
            <h2>{t('dashWelcome', lang)}, {user?.name || 'Partenaire'}</h2>
          </div>
          <div className="admin-header-actions">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {t('dashConnected', lang)} ({user?.email})
            </span>
          </div>
        </header>

        <div className="admin-content" style={{ padding: 0 }}>
          
          {/* TAB 1: QUOTES & ORDERS TRACKING */}
          {activeTab === 'quotes' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', margin: 0 }}>
                  {isEn ? 'My Quotes and Machinery Orders' : 'Mes demandes de devis et commandes'}
                </h3>
              </div>

              {clientOrders.length === 0 ? (
                <div style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px dashed var(--border-subtle)', 
                  padding: '40px', 
                  borderRadius: 'var(--radius-md)', 
                  textAlign: 'center' 
                }}>
                  <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {isEn 
                      ? "You have not submitted any quote requests yet." 
                      : "Vous n'avez pas encore soumis de demande de devis."}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {clientOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: '24px', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-card)'
                      }}
                    >
                      {/* Quote card header */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'wrap',
                        gap: '12px',
                        borderBottom: '1px solid var(--border-subtle)',
                        paddingBottom: '12px',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>
                            {order.id}
                          </strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                            {isEn ? 'Submitted: ' : 'Soumis le : '} {order.date}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusIcon(order.status)}
                          <span className={`status-pill ${getStatusClass(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          {isEn ? 'Requested items / machinery:' : 'Équipements & Prestations :' }
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(order.items || []).map((item, idx) => (
                            <div 
                              key={idx} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                fontSize: '0.9rem',
                                padding: '10px 14px',
                                backgroundColor: 'rgba(15, 23, 42, 0.02)',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              <span>
                                <strong>{item.quantity}x</strong> {item.name}
                                {item.specs?.["Motorisation"] && (
                                  <span style={{ fontSize: '0.78rem', color: '#166534', marginLeft: '8px' }}>
                                    ({item.specs["Motorisation"]})
                                  </span>
                                )}
                              </span>
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                                {((item.priceFcfa || 0) * (item.quantity || 1)).toLocaleString()} FCFA
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary info */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-end', 
                        flexWrap: 'wrap', 
                        gap: '16px',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '16px'
                      }}>
                        <div style={{ maxWidth: '500px' }}>
                          {order.status === 'pending' && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(245, 158, 11, 0.05)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--warning)' }}>
                              <strong>{isEn ? 'Next step: ' : 'Prochaine étape : '}</strong>
                              {isEn 
                                ? "Please proceed with the 50% deposit payment or transmit the Mobile Money receipt via WhatsApp."
                                : "Veuillez effectuer l'acompte de 50% ou envoyer la capture du virement par WhatsApp pour lancer la fabrication."}
                            </div>
                          )}
                          {order.status === 'manufacturing' && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                              <strong>{isEn ? 'Manufacturing: ' : 'Production Atelier : '}</strong>
                              {isEn
                                ? "Your machine is on the assembly line at our Cotonou workshop."
                                : "Votre machine est actuellement en cours d'usinage et d'assemblage dans notre atelier de Cotonou."}
                            </div>
                          )}
                          {order.status === 'shipped' && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(6, 182, 212, 0.05)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
                              <strong>{isEn ? 'Shipping: ' : 'Expédition : '}</strong>
                              {isEn
                                ? "The carrier is on the way. Delivery in your region soon."
                                : "Votre matériel a été expédié par transporteur sécurisé vers votre localité."}
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                            {isEn ? 'Estimated Total' : 'Montant Total'}
                          </span>
                          <strong style={{ fontSize: '1.3rem', color: '#166534', fontFamily: 'var(--font-heading)' }}>
                            {(order.totalFcfa || 0).toLocaleString()} FCFA
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                            ≈ {(order.totalEur || Math.round((order.totalFcfa || 0) / 655.957)).toLocaleString()} €
                          </span>
                        </div>
                      </div>

                      {/* Action Bar for this order */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginTop: '16px',
                        paddingTop: '14px',
                        borderTop: '1px dashed var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {/* Button: Official Proforma Quote */}
                          <button
                            type="button"
                            onClick={() => setSelectedProformaOrder(order)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: '1px solid #166534',
                              background: '#f0fdf4',
                              color: '#166534',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Printer size={15} />
                            <span>{isEn ? "Print Proforma Quote (PDF)" : "Imprimer le Devis Proforma (PDF)"}</span>
                          </button>

                          {/* Button: Workshop Tracking */}
                          {onGoToTracking && (
                            <button
                              type="button"
                              onClick={() => onGoToTracking(order.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#334155',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                              }}
                            >
                              <Truck size={15} />
                              <span>{isEn ? "Live Tracking" : "Suivre en direct"}</span>
                            </button>
                          )}
                        </div>

                        {/* Direct digital download buttons if order has ebooks or formations */}
                        {order.items && order.items.some(i => i.isEbook || i.isFormation || i.name?.toLowerCase().includes('guide') || i.name?.toLowerCase().includes('formation')) && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {order.items.filter(i => i.isEbook || i.isFormation || i.name?.toLowerCase().includes('guide') || i.name?.toLowerCase().includes('formation')).map((dItem, dIdx) => (
                              <button
                                key={dIdx}
                                type="button"
                                disabled={downloadingItemId === dItem.id}
                                onClick={() => handleDownloadDigitalItem({ ...dItem, orderId: order.id })}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: '#2563eb',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  cursor: downloadingItemId === dItem.id ? 'not-allowed' : 'pointer',
                                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                                }}
                              >
                                <Download size={14} />
                                <span>
                                  {downloadingItemId === dItem.id 
                                    ? (isEn ? "Generating PDF..." : "Préparation du PDF...") 
                                    : (isEn ? `Download ${dItem.name.split(' ')[0]}` : `Télécharger ${dItem.name.slice(0, 22)}...`)}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIGITAL PURCHASES (E-BOOKS & FORMATIONS) */}
          {activeTab === 'digital' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', margin: '0 0 6px 0' }}>
                  {isEn ? "My Digital Library & Training Programs" : "Mes Guides Numériques & Formations"}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                  {isEn 
                    ? "Access your watermarked PDF e-books and official training syllabus anytime."
                    : "Retrouvez et téléchargez à tout moment vos e-books sécurisés et vos convocations de formation."}
                </p>
              </div>

              {purchasedDigitalItems.length === 0 ? (
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px dashed var(--border-subtle)',
                  padding: '40px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    {isEn 
                      ? "You haven't ordered any e-books or training sessions yet." 
                      : "Vous n'avez pas encore commandé d'e-book ou de formation continue."}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {purchasedDigitalItems.map((item, idx) => {
                    const isFormation = item.isFormation || item.name?.toLowerCase().includes('formation') || String(item.id).startsWith('form-');
                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: '14px',
                          border: '1px solid var(--border-subtle)',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{
                            background: isFormation ? '#ecfdf5' : '#eff6ff',
                            color: isFormation ? '#059669' : '#2563eb',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}>
                            {isFormation ? (isEn ? "Training Program" : "Formation Continue") : (isEn ? "E-Book Guide" : "Guide Numérique")}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            Réf: {item.orderId}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>
                          {item.name}
                        </h4>

                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={15} color="#166534" />
                          <span>{isFormation ? "Convocation officielle & Syllabus inclus" : "Filigrane anti-piratage nominatif"}</span>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                          <button
                            type="button"
                            disabled={downloadingItemId === item.id}
                            onClick={() => handleDownloadDigitalItem(item)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: isFormation ? '#166534' : '#2563eb',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: downloadingItemId === item.id ? 'not-allowed' : 'pointer',
                              boxShadow: isFormation 
                                ? '0 2px 8px rgba(22, 101, 52, 0.25)' 
                                : '0 2px 8px rgba(37, 99, 235, 0.25)'
                            }}
                          >
                            <Download size={16} />
                            <span>
                              {downloadingItemId === item.id 
                                ? (isEn ? "Generating Document..." : "Génération du PDF...") 
                                : (isEn ? "Download PDF Document" : "Télécharger mon PDF")}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MESSAGES */}
          {activeTab === 'messages' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--secondary)' }}>
                {isEn ? 'My Sent Messages' : 'Mes Messages Envoyés'}
              </h3>
              {messages.length === 0 ? (
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-subtle)', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {isEn ? "You haven't sent any messages yet." : "Vous n'avez pas encore envoyé de message."}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.map(msg => {
                    const statusConfig = {
                      unread: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: isEn ? 'Pending' : 'En attente' },
                      read: { bg: 'rgba(107,114,128,0.1)', color: 'var(--text-muted)', label: isEn ? 'Read' : 'Lu' },
                      'in-progress': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: isEn ? 'In Progress' : 'En cours de traitement' },
                      resolved: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: isEn ? 'Resolved' : 'Résolu' },
                      replied: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: isEn ? 'Replied' : 'Répondu' },
                    };
                    const sc = statusConfig[msg.status] || statusConfig.unread;
                    return (
                      <div key={msg.id} className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: `1px solid ${msg.status === 'replied' ? 'rgba(59,130,246,0.3)' : 'var(--border-subtle)'}`, backgroundColor: 'var(--bg-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                          <div>
                            <span className="badge badge-menu">{msg.subject}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '10px' }}>{msg.date}</span>
                          </div>
                          <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, backgroundColor: sc.bg, color: sc.color }}>
                            {sc.label}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, backgroundColor: 'var(--bg-surface)', padding: '10px', borderRadius: 'var(--radius-sm)', margin: '0 0 12px' }}>
                          {msg.message}
                        </p>
                        {msg.adminReply && (
                          <div style={{ padding: '12px', borderLeft: '3px solid #3b82f6', backgroundColor: 'rgba(59,130,246,0.05)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', marginBottom: '6px' }}>
                              ✉ {isEn ? `Reply from Bevulta (${msg.replyDate})` : `Réponse de Bevulta (${msg.replyDate})`}
                            </p>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>{msg.adminReply}</p>
                          </div>
                        )}
                        {!msg.adminReply && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {isEn ? '⏳ Awaiting reply from our team...' : '⏳ En attente de réponse de notre équipe...'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE EDITOR */}
          {activeTab === 'profile' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '32px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)',
                  maxWidth: '650px'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--secondary)' }}>
                  {isEn ? 'My Personal Information' : 'Mes Informations Personnelles'}
                </h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="crud-grid" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Full Name' : 'Nom complet'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Email Address' : 'Adresse E-mail'}</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={profileForm.email} 
                        disabled 
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div className="crud-grid" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Phone' : 'Téléphone'}</label>
                      <PhoneInputWithCountry 
                        value={profileForm.phone} 
                        onChange={(fullPhone) => setProfileForm({ ...profileForm, phone: fullPhone })}
                        lang={lang}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Company' : 'Entreprise'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={profileForm.company} 
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">{isEn ? 'Shipping Country' : 'Pays de livraison'}</label>
                    <CountrySelect
                      value={profileForm.country}
                      onChange={(countryName) => setProfileForm({ ...profileForm, country: countryName })}
                      lang={lang}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">{isEn ? 'Full Delivery Address' : 'Adresse de livraison complète'}</label>
                    <textarea 
                      className="form-input" 
                      rows={3} 
                      value={profileForm.address} 
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} 
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    {t('btnSave', lang)}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Official Proforma Modal for Printing / PDF Export */}
      <ProformaModal
        isOpen={selectedProformaOrder !== null}
        order={selectedProformaOrder}
        settings={settings}
        lang={lang}
        onClose={() => setSelectedProformaOrder(null)}
      />

    </div>
  );
}
