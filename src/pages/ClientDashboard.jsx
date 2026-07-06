import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Settings, LogOut, Clock, Wrench, Truck, CheckCircle2, MessageSquare, Home
} from 'lucide-react';
import { t } from '../data/translations';

export default function ClientDashboard({ 
  user, 
  orders, 
  messages = [],
  onLogout, 
  lang,
  goHome,
  showAlert
}) {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('bevulta_client_tab') || 'quotes';
  });

  useEffect(() => {
    sessionStorage.setItem('bevulta_client_tab', activeTab);
  }, [activeTab]);
  const [profileForm, setProfileForm] = useState({
    name: user.name || 'Demo Client',
    email: user.email || 'client@bevulta.com',
    phone: user.phone || '+229 97 12 34 56',
    company: user.company || 'Agro Cooperative',
    country: user.country || 'Bénin',
    address: user.address || 'Cotonou, Fidjrossè'
  });

  // Filter orders (quotes) belonging to this client by matching their email
  const clientOrders = orders.filter(
    (order) => order.email?.toLowerCase() === user.email?.toLowerCase()
  );

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showAlert(lang === 'fr' ? "Profil mis à jour (démo) !" : "Profile updated (demo)!");
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
    if (lang === 'fr') {
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
          <span>{user.name}</span>
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
          <button 
            className={`admin-menu-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={18} />
            <span>{lang === 'fr' ? 'Mes Messages' : 'My Messages'}</span>
            {messages.filter(m => m.status === 'replied').length > 0 && (
              <span style={{ backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}>
                {messages.filter(m => m.status === 'replied').length}
              </span>
            )}
          </button>
          <button 
            className={`admin-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>{lang === 'fr' ? 'Mon Profil' : 'My Profile'}</span>
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
            <h2>{t('dashWelcome', lang)}, {user.name}</h2>
          </div>
          <div className="admin-header-actions">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {t('dashConnected', lang)} ({user.email})
            </span>
          </div>
        </header>

        <div className="admin-content" style={{ padding: 0 }}>
          {/* TAB 1: QUOTES TRACKING */}
          {activeTab === 'quotes' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--secondary)' }}>
                {lang === 'fr' ? 'Mes demandes de devis et commandes' : 'My quote requests & orders'}
              </h3>

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
                    {lang === 'fr' 
                      ? "Vous n'avez pas encore soumis de demande de devis." 
                      : "You have not submitted any quote requests yet."}
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
                            {lang === 'fr' ? 'Soumis le : ' : 'Submitted: '} {order.date}
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
                          {lang === 'fr' ? 'Équipements demandés :' : 'Requested equipment:'}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                fontSize: '0.9rem',
                                padding: '8px 12px',
                                backgroundColor: 'rgba(15, 23, 42, 0.02)',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              <span>
                                <strong>{item.quantity}x</strong> {item.name}
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {(item.priceFcfa * item.quantity).toLocaleString()} FCFA
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom row summary & payment steps */}
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
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(245, 158, 11, 0.05)', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--warning)' }}>
                              <strong>{lang === 'fr' ? 'Prochaine étape : ' : 'Next step: '}</strong>
                              {lang === 'fr' 
                                ? "Veuillez effectuer le virement de validation ou envoyer le reçu par WhatsApp."
                                : "Please proceed with the validation payment or send the receipt via WhatsApp."}
                            </div>
                          )}
                          {order.status === 'manufacturing' && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--primary)' }}>
                              <strong>{lang === 'fr' ? 'Production : ' : 'Manufacturing: '}</strong>
                              {lang === 'fr'
                                ? "Votre machine est sur la ligne d'assemblage dans notre atelier de Cotonou."
                                : "Your machine is on the assembly line at our Cotonou workshop."}
                            </div>
                          )}
                          {order.status === 'shipped' && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(6, 182, 212, 0.05)', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--accent-cyan)' }}>
                              <strong>{lang === 'fr' ? 'Expédition : ' : 'Shipping: '}</strong>
                              {lang === 'fr'
                                ? "Le transporteur est en route. Livraison estimée dans la sous-région sous peu."
                                : "The carrier is on the way. Expected delivery in the sub-region shortly."}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                            {lang === 'fr' ? 'Estimation Totale' : 'Estimated Total'}
                          </span>
                          <strong style={{ fontSize: '1.3rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                            {order.totalFcfa.toLocaleString()} FCFA
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--secondary)' }}>
                {lang === 'fr' ? 'Mes Messages Envoyés' : 'My Sent Messages'}
              </h3>
              {messages.length === 0 ? (
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-subtle)', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'fr' ? "Vous n'avez pas encore envoyé de message." : "You haven't sent any messages yet."}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.map(msg => {
                    const statusConfig = {
                      unread: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: lang === 'fr' ? 'En attente' : 'Pending' },
                      read: { bg: 'rgba(107,114,128,0.1)', color: 'var(--text-muted)', label: lang === 'fr' ? 'Lu' : 'Read' },
                      'in-progress': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: lang === 'fr' ? 'En cours de traitement' : 'In Progress' },
                      resolved: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: lang === 'fr' ? 'Résolu' : 'Resolved' },
                      replied: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: lang === 'fr' ? 'Répondu' : 'Replied' },
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
                              ✉ {lang === 'fr' ? `Réponse de Bevulta (${msg.replyDate})` : `Reply from Bevulta (${msg.replyDate})`}
                            </p>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>{msg.adminReply}</p>
                          </div>
                        )}
                        {!msg.adminReply && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {lang === 'fr' ? '⏳ En attente de réponse de notre équipe...' : '⏳ Awaiting reply from our team...'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE EDITOR */}
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
                  {lang === 'fr' ? 'Mes Informations Personnelles' : 'My Personal Information'}
                </h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="crud-grid" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">{lang === 'fr' ? 'Nom complet' : 'Full Name'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{lang === 'fr' ? 'Adresse E-mail' : 'Email Address'}</label>
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
                      <label className="form-label">{lang === 'fr' ? 'Téléphone' : 'Phone'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={profileForm.phone} 
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{lang === 'fr' ? 'Entreprise' : 'Company'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={profileForm.company} 
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">{lang === 'fr' ? 'Pays de livraison' : 'Shipping Country'}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={profileForm.country} 
                      onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">{lang === 'fr' ? 'Adresse de livraison complète' : 'Full Delivery Address'}</label>
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
    </div>
  );
}
