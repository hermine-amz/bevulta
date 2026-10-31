import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ShieldCheck, CheckCircle, FileText, CreditCard } from 'lucide-react';
import { initiatePayment } from '../services/paymentService';
import PaymentModal from '../components/PaymentModal';
import { t } from '../data/translations';

export default function Order({ cart, updateQty, removeFromCart, clearCart, onSubmitOrder, lang, showAlert, settings = {} }) {
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
  const [paymentModalData, setPaymentModalData] = useState(null);

  const handlePayOrder = () => {
    if (!createdOrder) return;
    initiatePayment({
      amountFcfa: createdOrder.totalFcfa,
      itemTitle: `Commande #${createdOrder.id}`,
      orderId: createdOrder.id,
      clientInfo: createdOrder,
      settings,
      onSuccess: () => {
        showAlert(lang === "fr" ? "Paiement validé avec succès !" : "Payment processed successfully!");
      },
      onError: (err) => {
        showAlert(err.message || (lang === "fr" ? "Erreur de paiement." : "Payment error."));
      },
      onManualMoMo: (data) => {
        setPaymentModalData(data);
      }
    });
  };

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
      <>
        <div style={{ padding: "100px 24px 60px", maxWidth: "850px", margin: "0 auto", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
          {/* Top Non-printable Congratulations */}
          <div className="no-print" style={{ marginBottom: "24px" }}>
            <CheckCircle size={64} style={{ color: "#16a34a", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "2rem", color: "#0f172a", marginBottom: "8px", fontWeight: 800 }}>
              {isEn ? "Quote Request Submitted Successfully!" : "Votre Demande de Devis a été Enregistrée !"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", margin: 0 }}>
              {isEn ? "Your quotation reference is" : "Référence de votre dossier :"} <strong style={{ color: "#166534" }}>{createdOrder.id}</strong>
            </p>
          </div>

          {/* Interactive Payment CTA (Only visible on screen, HIDDEN on paper print) */}
          <div className="no-print" style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
            border: "2px solid #bbf7d0",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "28px",
            textAlign: "center",
            boxShadow: "0 4px 14px rgba(22, 101, 52, 0.08)"
          }}>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#166534", margin: "0 0 6px 0" }}>
              {isEn ? "Pay Online or by Mobile Money" : "Régler maintenant par Mobile Money / Carte"}
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 16px 0" }}>
              {isEn ? "Fast and secure payment via MTN MoMo, Moov Money, Wave, or Bank Card." : "Réglez directement votre acompte ou commande par MTN MoMo, Moov Money, Wave ou Carte."}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayOrder}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                fontSize: "0.95rem",
                fontWeight: 800,
                background: "#16a34a",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)"
              }}
            >
              <CreditCard size={18} />
              <span>{isEn ? "Pay Now" : "Payer Maintenant"} ({createdOrder.totalFcfa.toLocaleString()} FCFA)</span>
            </button>
          </div>

          {/* Official Printable Quotation Sheet (Clean A4 standard, prints beautifully) */}
          <div className="print-invoice-sheet" style={{
            textAlign: "left",
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: "28px"
          }}>
            {/* Header / Brand block */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #166534", paddingBottom: "16px", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src="/logo.jpg"
                  alt="BEVULTA Logo"
                  style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid #166534" }}
                />
                <div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0b2c5c", margin: 0 }}>
                    {settings?.storeName || "BEVULTA"}
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#475569", margin: "2px 0 0 0", fontWeight: 600 }}>
                    {settings?.storeTagline || "Bureau d'Études et de Vulgarisation des Technologies Appropriées"}
                  </p>
                  <p style={{ fontSize: "0.74rem", color: "#64748b", margin: "2px 0 0 0" }}>
                    {settings?.atelierAddress || "C/3474 Agla Von FAN-MILK, Cotonou, Bénin"} • Tél : {settings?.contactPhone1 || "(+229) 97 69 91 78"}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "#f0fdf4",
                  color: "#166534",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  borderRadius: "6px",
                  border: "1px solid #bbf7d0",
                  letterSpacing: "0.04em"
                }}>
                  DEVIS PROFORMA
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>
                  N° {createdOrder.id}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Date d'émission : {createdOrder.date}
                </div>
              </div>
            </div>

            {/* Client Info Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
              padding: "14px 16px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              marginBottom: "20px",
              fontSize: "0.85rem"
            }}>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Bénéficiaire / Client
                </div>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                  {createdOrder.clientName}
                </div>
                {createdOrder.company && (
                  <div style={{ color: "#475569", fontWeight: 600 }}>{createdOrder.company}</div>
                )}
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Coordonnées & Destination
                </div>
                <div style={{ color: "#0f172a" }}>
                  <strong>{createdOrder.phone}</strong> {createdOrder.email ? "• " + createdOrder.email : ""}
                </div>
                <div style={{ color: "#475569" }}>
                  {createdOrder.country} — {createdOrder.address}
                </div>
              </div>
            </div>

            {/* Products Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem", marginBottom: "20px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1", fontSize: "0.76rem", color: "#475569", textTransform: "uppercase" }}>
                  <th style={{ textAlign: "left", padding: "10px 12px" }}>Désignation Équipement / Guide</th>
                  <th style={{ textAlign: "center", padding: "10px 12px", width: "60px" }}>Qté</th>
                  <th style={{ textAlign: "right", padding: "10px 12px", width: "140px" }}>Prix Unitaire</th>
                  <th style={{ textAlign: "right", padding: "10px 12px", width: "160px" }}>Total (FCFA)</th>
                </tr>
              </thead>
              <tbody>
                {createdOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{item.name}</div>
                      {item.specs && item.specs["Motorisation"] && (
                        <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>Option : {item.specs["Motorisation"]}</div>
                      )}
                    </td>
                    <td style={{ textAlign: "center", padding: "12px", fontWeight: 700 }}>{item.quantity}</td>
                    <td style={{ textAlign: "right", padding: "12px" }}>{item.priceFcfa.toLocaleString()} FCFA</td>
                    <td style={{ textAlign: "right", padding: "12px", fontWeight: 800, color: "#0f172a" }}>
                      {(item.priceFcfa * item.quantity).toLocaleString()} FCFA
                    </td>
                  </tr>
                ))}
                <tr style={{ background: "#f8fafc", borderTop: "2px solid #0f172a" }}>
                  <td colSpan="3" style={{ padding: "14px 12px", textAlign: "right", fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                    MONTANT TOTAL ESTIMÉ :
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 900, fontSize: "1.2rem", color: "#166534" }}>
                    {createdOrder.totalFcfa.toLocaleString()} FCFA
                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                      (Soit env. {createdOrder.totalEur?.toLocaleString()} €)
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Official Terms & Workshop Notes */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>
              <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
                Conditions de validité & modalités d'atelier :
              </div>
              <div>• Le présent devis proforma est valable <strong>30 jours</strong> à compter de sa date d'émission.</div>
              <div>• Fabrication sur mesure : acompte de 50% à la commande, solde à la livraison ou mise à disposition en atelier.</div>
              <div>• Contact direct SAV & atelier : <strong>{settings?.contactPhone1 || "(+229) 97 69 91 78"}</strong> (Appels & WhatsApp) ou par e-mail à <strong>{settings?.contactEmail || "bevulta@gmail.com"}</strong>.</div>
            </div>
          </div>

          {/* Action Buttons (HIDDEN when printed) */}
          <div className="no-print" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.print()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <FileText size={18} />
              <span>{isEn ? "Print Official Quote" : "Imprimer le Devis Officiel"}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setOrderSuccess(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <span>{isEn ? "Return to Store" : "Retourner à la boutique"}</span>
            </button>
          </div>

          {/* Payment Modal inside Order Confirmation */}
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
      </>
    );
  }

  return (
    <>
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

      {/* Payment Modal */}
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
    </>
  );
}
