import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ShieldCheck, Landmark, CheckCircle, FileText } from 'lucide-react';
import { t } from '../data/translations';

export default function Order({ cart, updateQty, removeFromCart, clearCart, onSubmitOrder, lang, showAlert }) {
  const isEn = lang === 'en';

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    company: '',
    country: 'benin',
    address: '',
    notes: ''
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const countries = lang === 'fr' ? [
    { value: 'benin', label: 'Bénin' },
    { value: 'togo', label: 'Togo' },
    { value: 'burkina', label: 'Burkina Faso' },
    { value: 'niger', label: 'Niger' },
    { value: 'cotedivoire', label: 'Côte d\'Ivoire' },
    { value: 'other', label: 'Autre sous-région' }
  ] : [
    { value: 'benin', label: 'Benin' },
    { value: 'togo', label: 'Togo' },
    { value: 'burkina', label: 'Burkina Faso' },
    { value: 'niger', label: 'Niger' },
    { value: 'cotedivoire', label: 'Ivory Coast' },
    { value: 'other', label: 'Other sub-region' }
  ];

  const getCountryLabel = (value) => {
    const matched = countries.find(c => c.value === value);
    return matched ? matched.label : value;
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.priceFcfa * item.quantity), 0);
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      updateQty(id, newQty);
    }
  };

  const handleCountryChange = (e) => {
    setFormData({ ...formData, country: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showAlert(lang === 'fr' ? "Votre panier de devis est vide." : "Your quotation cart is empty.");
      return;
    }
    if (!formData.clientName || !formData.email || !formData.phone || !formData.country || !formData.address) {
      showAlert(lang === 'fr' 
        ? "Veuillez remplir tous les champs obligatoires (*) avant de soumettre." 
        : "Please fill in all mandatory fields (*) before submitting.");
      return;
    }

    const subtotal = getSubtotal();
    const totalFcfa = subtotal;
    
    // FCFA to EUR estimation (rate: 655.957)
    const totalEur = Math.round(totalFcfa / 655.957);

    const newOrder = {
      id: 'DEV-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US'),
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      country: getCountryLabel(formData.country),
      address: formData.address,
      notes: formData.notes,
      items: cart,
      subtotalFcfa: subtotal,
      totalFcfa: totalFcfa,
      totalEur: totalEur,
      status: 'pending' // pending, manufacturing, shipped, delivered
    };

    onSubmitOrder(newOrder);
    setCreatedOrder(newOrder);
    setOrderSuccess(true);
    clearCart();
    
    // Reset form
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      company: '',
      country: 'benin',
      address: '',
      notes: ''
    });
  };

  if (orderSuccess && createdOrder) {
    return (
      <div style={{ padding: '120px 24px 80px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
        <div className="glass-panel" style={{ padding: '48px' }}>
          <CheckCircle size={72} className="text-accent" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '2.2rem', color: 'var(--secondary)', marginBottom: '16px' }}>{t('orderSuccessTitle', lang)}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px' }}>
            {t('orderSuccessDesc', lang)} <strong>{createdOrder.id}</strong>.
          </p>

          {/* Printable Invoice Summary */}
          <div className="glass-panel" style={{
            textAlign: 'left',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <FileText size={18} />
              <span>{t('orderRecapTitle', lang)} {createdOrder.id}</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <div><strong>{t('orderRecapClient', lang)}</strong> {createdOrder.clientName}</div>
              <div><strong>{t('orderRecapDate', lang)}</strong> {createdOrder.date}</div>
              <div><strong>{t('orderRecapPhone', lang)}</strong> {createdOrder.phone}</div>
              <div><strong>{t('orderRecapCountry', lang)}</strong> {createdOrder.country}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>{t('orderRecapAddress', lang)}</strong> {createdOrder.address}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '8px' }}>{t('orderTableProduct', lang)}</th>
                  <th style={{ textAlign: 'center', paddingBottom: '8px' }}>{t('orderTableQty', lang)}</th>
                  <th style={{ textAlign: 'right', paddingBottom: '8px' }}>{t('orderTablePrice', lang)}</th>
                  <th style={{ textAlign: 'right', paddingBottom: '8px' }}>{t('orderTableTotal', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {createdOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '8px 0' }}>{item.name}</td>
                    <td style={{ textAlign: 'center', padding: '8px 0' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{item.priceFcfa.toLocaleString()} FCFA</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{(item.priceFcfa * item.quantity).toLocaleString()} FCFA</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{t('orderRecapSubtotal', lang)}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{createdOrder.subtotalFcfa.toLocaleString()} FCFA</td>
                </tr>
                <tr style={{ borderTop: '2px solid var(--border-color)' }}>
                  <td colSpan="3" style={{ padding: '8px 0', textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>{t('orderRecapTotal', lang)}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                    {createdOrder.totalFcfa.toLocaleString()} FCFA <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({createdOrder.totalEur.toLocaleString()} €)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment & Next Steps */}
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', marginBottom: '12px' }}>
              <Landmark size={20} className="text-primary" />
              <span>{t('orderRecapModalitiesTitle', lang)}</span>
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {t('orderRecapModalitiesDesc', lang)}
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><strong>{t('orderRecapWire', lang).split(':')[0]} :</strong> {t('orderRecapWire', lang).split(':')[1]}</li>
              <li><strong>{t('orderRecapWU', lang).split(':')[0]} :</strong> {t('orderRecapWU', lang).split(':')[1]}</li>
            </ul>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              {t('orderRecapInstructions', lang)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => window.print()}>
              {t('btnPrintInvoice', lang)}
            </button>
            <button className="btn btn-primary" onClick={() => setOrderSuccess(false)}>
              {t('btnReturnSite', lang)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      {/* Main Cart Area */}
      <div className="order-main">
        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingCart size={28} />
          <span>{t('orderTitle', lang)} ({cart.length} {isEn ? `item${cart.length > 1 ? 's' : ''}` : `article${cart.length > 1 ? 's' : ''}`})</span>
        </h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem' }}>{t('orderEmpty', lang)}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{t('orderEmptySub', lang)}</p>
            <a href="#catalog" className="btn btn-primary" onClick={(e) => { e.preventDefault(); window.location.hash = '#catalog'; }}>
              {t('orderCatalogBtn', lang)}
            </a>
          </div>
        ) : (
          <div>
            {cart.some(item => item.isEbook || item.isPack) && (
              <div style={{ backgroundColor: 'rgba(22, 101, 52, 0.08)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} />
                <span>
                  {isEn 
                    ? "Digital E-books & Packs included: Instant secure download links will be delivered by email upon confirmation."
                    : "E-books & Packs numériques inclus : Vos liens de téléchargement sécurisés vous seront délivrés par e-mail dès confirmation."
                  }
                </span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-img" />
                  
                  <div className="order-item-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0 }}>{item.name}</h4>
                      {(item.isEbook || item.isPack) && (
                        <span className="badge badge-special" style={{ fontSize: '0.65rem', background: item.isPack ? '#d97706' : 'var(--primary)', color: '#ffffff' }}>
                          {item.isPack ? "Pack E-books" : "E-book"}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t('orderCategory', lang)} : {item.category}</p>
                    <div style={{ marginTop: '8px', fontWeight: 700, color: 'var(--primary)' }}>
                      {item.priceFcfa.toLocaleString()} FCFA <span style={{ fontWeight: 500, fontSize: '0.75rem', color: 'var(--text-muted)' }}>({item.priceEur} €)</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div className="order-item-qty">
                      <button onClick={() => handleQtyChange(item.id, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => handleQtyChange(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <button 
                      style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', padding: '8px', border: 'none', background: 'none', cursor: 'pointer' }} 
                      onClick={() => removeFromCart(item.id)}
                      title={isEn ? "Remove" : "Retirer"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={clearCart}>
                {t('orderClear', lang)}
              </button>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('orderSubtotal', lang)}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  {getSubtotal().toLocaleString()} FCFA
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Checkout Info */}
      <div className="order-sidebar">
        <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--secondary)' }}>{t('orderFinalTitle', lang)}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('orderClientName', lang)}</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Koffi Mensah"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('orderClientPhone', lang)}</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Ex: +229 97..."
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('orderClientEmail', lang)}</label>
            <input
              type="email"
              className="form-input"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('orderClientCompany', lang)}</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Coopérative Karité Bénin"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('orderClientCountry', lang)}</label>
            <select
              className="form-input"
              value={formData.country}
              onChange={handleCountryChange}
            >
              {countries.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('orderClientAddress', lang)}</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder={isEn ? "City, neighborhood, physical references..." : "Ville, quartier, repères physiques..."}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">{t('orderClientNotes', lang)}</label>
            <textarea
              className="form-input"
              rows="2"
              placeholder={isEn ? "Ex: Single-phase power supply preferred..." : "Ex: Alimentation électrique monophasée souhaitée..."}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          {/* Pricing Recap Box */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
              <span>{t('orderTotalEst', lang)}</span>
              <span>{getSubtotal().toLocaleString()} FCFA</span>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {isEn ? "Approx. " : "Soit environ "} {Math.round(getSubtotal() / 655.957).toLocaleString()} €
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-accent" 
            style={{ width: '100%' }}
            disabled={cart.length === 0}
          >
            <ShieldCheck size={18} />
            <span>{t('orderBtnValidate', lang)}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
