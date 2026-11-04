import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ShieldCheck, CheckCircle, FileText, CreditCard, Download, Wrench, MessageCircle, Home } from 'lucide-react';
import { initiatePayment } from '../services/paymentService';
import { downloadWatermarkedPdf } from '../services/pdfWatermarkService';
import PaymentModal from '../components/PaymentModal';
import PhoneInputWithCountry from '../components/PhoneInputWithCountry';
import CountrySelect from '../components/CountrySelect';
import { t } from '../data/translations';

export default function Order({ cart, updateQty, removeFromCart, clearCart, onSubmitOrder, lang, showAlert, showConfirm, settings = {}, onGoToTracking, setCurrentPage }) {
  const isEn = lang === 'en';

  const [paymentChoice, setPaymentChoice] = useState('deposit'); // 'deposit' (50%) or 'full' (100%)

  const handleClearCart = () => {
    if (showConfirm) {
      showConfirm(
        lang === 'fr' ? "Voulez-vous vraiment vider votre panier de devis ?" : "Do you really want to clear your quotation cart?",
        clearCart
      );
    } else {
      clearCart();
    }
  };

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    company: '',
    country: 'Bénin',
    address: '',
    notes: ''
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [downloadingEbookId, setDownloadingEbookId] = useState(null);

  const handleDownloadEbook = async (item) => {
    try {
      setDownloadingEbookId(item.id);
      await downloadWatermarkedPdf(item, {
        name: createdOrder?.clientName || 'Client BEVULTA',
        email: createdOrder?.email || 'client@bevulta.com',
        phone: createdOrder?.phone || '',
        orderId: createdOrder?.id || 'CMD-BEVULTA'
      });
      showAlert(
        lang === 'fr'
          ? `Téléchargement de "${item.name}" terminé !`
          : `E-book "${item.name}" downloaded!`
      );
    } catch (err) {
      console.error("Ebook download error:", err);
      showAlert(lang === 'fr' ? "Erreur lors du téléchargement." : "Download error.");
    } finally {
      setDownloadingEbookId(null);
    }
  };

  const handlePayOrder = (forcedAmount = null) => {
    if (!createdOrder) return;
    const hasEbooks = createdOrder.items.some(i => i.isEbook || i.category?.toLowerCase().includes('ebook'));
    const isOnlyEbooks = createdOrder.items.every(i => i.isEbook || i.category?.toLowerCase().includes('ebook'));
    
    // If machines are in the cart and deposit is chosen, calculate 50%
    const chosenDeposit = !isOnlyEbooks && paymentChoice === 'deposit';
    const amount = forcedAmount || (chosenDeposit ? Math.round(createdOrder.totalFcfa * 0.5) : createdOrder.totalFcfa);
    const title = chosenDeposit 
      ? `Acompte 50% Commande #${createdOrder.id}` 
      : `Paiement Intégral Commande #${createdOrder.id}`;

    initiatePayment({
      amountFcfa: amount,
      itemTitle: title,
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
        setPaymentModalData({
          ...data,
          amountFcfa: amount,
          itemTitle: title,
          isEbook: hasEbooks,
          ebook: hasEbooks ? createdOrder.items.find(i => i.isEbook || i.category?.toLowerCase().includes('ebook')) : null
        });
      }
    });
  };

  const getCountryLabel = (value) => {
    return value || (isEn ? 'Benin' : 'Bénin');
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
    sessionStorage.setItem('bevulta_last_order_id', newOrder.id);
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
    const isOnlyEbooks = createdOrder.items.every(i => i.isEbook || i.category?.toLowerCase().includes('ebook'));
    const depositAmt = Math.round(createdOrder.totalFcfa * 0.5);

    return (
      <>
        <div className="order-success-page">
          {/* Top Non-printable Congratulations */}
          <div className="no-print" style={{ marginBottom: "24px" }}>
            <CheckCircle size={56} style={{ color: "#16a34a", margin: "0 auto 16px" }} />
            <h2 className="order-success-title">
              {isEn ? "Quote Request Submitted Successfully!" : "Votre Demande de Devis a été Enregistrée !"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
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
            <h4 style={{ fontSize: "1.18rem", fontWeight: 900, color: "#166534", margin: "0 0 6px 0" }}>
              {isEn ? "Pay Online & Launch Manufacturing" : "Régler en ligne & Lancer la fabrication"}
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 16px 0" }}>
              {isEn ? "Fast and secure payment via MTN MoMo, Moov Money, Wave, or Bank Card." : "Réglez directement votre acompte ou commande par MTN MoMo, Moov Money, Wave ou Carte."}
            </p>

            {/* Payment Mode Selector if contains machines */}
            {!isOnlyEbooks && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', maxWidth: '520px', margin: '0 auto 18px', textAlign: 'left' }}>
                <div 
                  onClick={() => setPaymentChoice('deposit')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: paymentChoice === 'deposit' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: paymentChoice === 'deposit' ? '#ffffff' : '#f8fafc',
                    cursor: 'pointer',
                    boxShadow: paymentChoice === 'deposit' ? '0 2px 8px rgba(22,163,74,0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                    {isEn ? "Option 1 (Recommended)" : "Option 1 (Recommandée)"}
                  </div>
                  <div style={{ fontWeight: 900, color: '#166534', fontSize: '1rem', marginTop: '2px' }}>
                    {isEn ? "50% Production Deposit" : "Acompte 50% Atelier"}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {depositAmt.toLocaleString()} FCFA
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    {isEn ? "Balance due at delivery" : "Solde dû à la livraison"}
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentChoice('full')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: paymentChoice === 'full' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: paymentChoice === 'full' ? '#ffffff' : '#f8fafc',
                    cursor: 'pointer',
                    boxShadow: paymentChoice === 'full' ? '0 2px 8px rgba(22,163,74,0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                    {isEn ? "Option 2" : "Option 2"}
                  </div>
                  <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1rem', marginTop: '2px' }}>
                    {isEn ? "100% Full Payment" : "Paiement Intégral 100%"}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {createdOrder.totalFcfa.toLocaleString()} FCFA
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    {isEn ? "Complete settlement" : "Règlement complet"}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handlePayOrder()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 26px",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  background: "#16a34a",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)"
                }}
              >
                <CreditCard size={18} />
                <span>
                  {paymentChoice === 'deposit' && !isOnlyEbooks
                    ? `${isEn ? "Pay 50% Deposit" : "Payer l'Acompte 50%"} (${depositAmt.toLocaleString()} FCFA)`
                    : `${isEn ? "Pay Full Total" : "Payer la Totalité"} (${createdOrder.totalFcfa.toLocaleString()} FCFA)`}
                </span>
              </button>

              {onGoToTracking && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => onGoToTracking(createdOrder.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "13px 22px",
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                >
                  <Wrench size={18} color="#166534" />
                  <span>{isEn ? "Track Machine Manufacturing" : "Suivre la fabrication en direct"}</span>
                </button>
              )}
            </div>

            {/* Direct WhatsApp workshop confirmation */}
            <div style={{ marginTop: '16px' }}>
              <a
                href={`https://wa.me/${(settings?.whatsappNumber || '22997699178').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour BEVULTA, je viens d'enregistrer ma commande N° ${createdOrder.id} pour un montant de ${createdOrder.totalFcfa.toLocaleString()} FCFA (${createdOrder.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}). Destination : ${createdOrder.country}. Voici mon dossier.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#166534',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={15} />
                <span>{isEn ? "Transmit quotation to workshop via WhatsApp" : "Transmettre le devis à l'atelier par WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* E-books Direct Download Section (Anti-Sharing Watermarked) */}
          {createdOrder.items.some(i => i.isEbook || i.category?.toLowerCase().includes('ebook')) && (
            <div className="no-print" style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
              border: "2px solid #3b82f6",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "28px",
              textAlign: "left",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.08)"
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#dbeafe', color: '#1d4ed8', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a' }}>
                    {isEn ? "Direct E-Book Downloads" : "Téléchargement de vos E-books & Guides"}
                  </h4>
                  <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                    {isEn 
                      ? "Your digital guides are ready for download."
                      : "Vos manuels numériques officiels sont prêts au format PDF haute définition."}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {createdOrder.items.filter(i => i.isEbook || i.category?.toLowerCase().includes('ebook')).map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#ffffff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        📖 {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        Format : {item.format || 'PDF Haute Définition'}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={downloadingEbookId === item.id}
                      className="btn btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: downloadingEbookId === item.id ? 'not-allowed' : 'pointer',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                      }}
                      onClick={() => handleDownloadEbook(item)}
                    >
                      <Download size={16} />
                      <span>
                        {downloadingEbookId === item.id 
                          ? (isEn ? "Preparing PDF..." : "Préparation du PDF...") 
                          : (isEn ? "Download (PDF)" : "Télécharger (PDF)")}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Printable Quotation Sheet (Clean A4 standard, prints beautifully) */}
          <div className="print-invoice-sheet" style={{
            textAlign: "left",
            backgroundColor: "#ffffff",
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

            {/* Products Table with scrollable wrapper for mobile */}
            <div className="proforma-table-wrapper">
              <table className="proforma-table">
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
            </div>

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
          <div className="no-print order-success-actions">
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
        <h2 className="order-title">
          <ShoppingCart size={26} />
          <span>{t('orderTitle', lang)} ({cart.length} {isEn ? `item${cart.length > 1 ? 's' : ''}` : `article${cart.length > 1 ? 's' : ''}`})</span>
        </h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(22, 101, 52, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShoppingCart size={32} />
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1.2rem', fontWeight: 800 }}>{t('orderEmpty', lang)}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px', maxWidth: '420px', margin: '0 auto 28px' }}>{t('orderEmptySub', lang)}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setCurrentPage ? setCurrentPage('catalog') : (window.location.hash = '#catalog')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 22px', fontSize: '0.95rem', cursor: 'pointer' }}
              >
                <Plus size={18} />
                <span>{isEn ? "Add an item" : "Ajouter un article"}</span>
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setCurrentPage ? setCurrentPage('home') : (window.location.hash = '#home')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem', cursor: 'pointer' }}
              >
                <Home size={18} />
                <span>{isEn ? "Back to Home" : "Retour à l'accueil"}</span>
              </button>
            </div>
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
            <div className="order-items-list">
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
                    <div className="order-item-price">
                      {item.priceFcfa.toLocaleString()} FCFA <span className="order-item-price-eur">({item.priceEur} €)</span>
                    </div>
                  </div>

                  <div className="order-item-actions">
                    <div className="order-item-qty">
                      <button type="button" onClick={() => handleQtyChange(item.id, item.quantity - 1)} aria-label="Diminuer">
                        <Minus size={14} />
                      </button>
                      <span className="order-qty-count">{item.quantity}</span>
                      <button type="button" onClick={() => handleQtyChange(item.id, item.quantity + 1)} aria-label="Augmenter">
                        <Plus size={14} />
                      </button>
                    </div>

                    <button 
                      type="button"
                      className="order-item-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title={isEn ? "Remove" : "Retirer"}
                    >
                      <Trash2 size={16} />
                      <span className="order-remove-label">{isEn ? "Remove" : "Retirer"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setCurrentPage ? setCurrentPage('catalog') : (window.location.hash = '#catalog')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <Plus size={15} />
                  <span>{isEn ? "Add another item" : "Ajouter un article"}</span>
                </button>
                <button type="button" className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', fontSize: '0.85rem', cursor: 'pointer' }} onClick={handleClearCart}>
                  {t('orderClear', lang)}
                </button>
              </div>
              <div className="order-footer-total">
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t('orderSubtotal', lang)}</div>
                <div className="order-subtotal-val">
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
            <PhoneInputWithCountry
              value={formData.phone}
              onChange={(fullPhone) => setFormData({ ...formData, phone: fullPhone })}
              lang={lang}
              required
              placeholder={isEn ? "Phone / WhatsApp" : "Numéro de téléphone / WhatsApp"}
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
            <CountrySelect
              value={formData.country}
              onChange={(countryName) => setFormData({ ...formData, country: countryName })}
              lang={lang}
              required
            />
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
          <div className="order-summary-box">
            <div className="order-summary-total-row">
              <span>{t('orderTotalEst', lang)}</span>
              <span>{getSubtotal().toLocaleString()} FCFA</span>
            </div>
            <div className="order-summary-eur">
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
