import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  MessageCircle, 
  Smartphone, 
  ShieldCheck, 
  Download, 
  BookOpen, 
  User, 
  Mail, 
  Phone,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { downloadWatermarkedPdf } from '../services/pdfWatermarkService';
import PhoneInputWithCountry from './PhoneInputWithCountry';

export default function PaymentModal({
  isOpen,
  onClose,
  paymentData,
  settings = {},
  lang = 'fr',
  onConfirmPayment
}) {
  const isEn = lang === 'en';

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState('payment');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (paymentData) {
      const name = paymentData.clientInfo?.name || paymentData.customer?.name || '';
      const email = paymentData.clientInfo?.email || paymentData.customer?.email || '';
      const phone = paymentData.clientInfo?.phone || paymentData.customer?.phone || '';
      setBuyerName(name);
      setBuyerEmail(email);
      setBuyerPhone(phone);
      setFormError('');
      setDownloadSuccess(false);

      const isEbook = Boolean(paymentData.isEbook || paymentData.type === 'ebook' || paymentData.ebook || paymentData.item?.isEbook);
      const needsInfoFirst = isEbook && (!name.trim() || !email.trim() || !phone.trim());
      setStep(needsInfoFirst ? 'form' : 'payment');
    }
  }, [paymentData]);

  if (!isOpen || !paymentData) return null;

  const { amountFcfa, itemTitle, orderId, isEbook, type, ebook, item } = paymentData;
  const isEbookPurchase = Boolean(isEbook || type === 'ebook' || ebook || item?.isEbook);
  const targetEbook = ebook || item || { title: itemTitle };

  const momoNumber = settings?.momoNumber || settings?.contactPhone1 || '+229 97 69 91 78';
  const momoOperator = settings?.momoOperator || 'MTN MoMo / Moov Money';
  const whatsappNumber = (settings?.whatsappNumber || '22997699178').replace(/[^0-9]/g, '');

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(momoNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleValidateInfo = (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setFormError(isEn ? "Please enter your full name." : "Veuillez entrer votre nom complet.");
      return;
    }
    if (!buyerEmail.trim() || !buyerEmail.includes('@')) {
      setFormError(isEn ? "Please enter a valid email address." : "Veuillez entrer une adresse e-mail valide.");
      return;
    }
    if (!buyerPhone.trim() || buyerPhone.trim().length < 6) {
      setFormError(isEn ? "Please enter your Mobile Money phone number." : "Veuillez entrer votre numéro de téléphone / Mobile Money.");
      return;
    }
    setFormError('');
    setStep('payment');
  };

  const handleWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `Bonjour BEVULTA, je viens d'effectuer le paiement de ${amountFcfa?.toLocaleString()} FCFA pour "${itemTitle}" au nom de ${buyerName || 'Client'} (${buyerEmail || 'Email non précisé'}, Tél: ${buyerPhone}) (Réf: ${orderId}). Pouvez-vous valider ma commande ? Merci.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    if (onConfirmPayment) onConfirmPayment({ buyerName, buyerEmail, buyerPhone, orderId, method: selectedMethod });

    if (isEbookPurchase) {
      setStep('download');
    } else {
      onClose();
    }
  };

  const handlePaymentCompleted = () => {
    if (onConfirmPayment) onConfirmPayment({ buyerName, buyerEmail, buyerPhone, orderId, method: selectedMethod });
    if (isEbookPurchase) {
      setStep('download');
    } else {
      onClose();
    }
  };

  const handleDirectDownload = async () => {
    setDownloading(true);
    try {
      await downloadWatermarkedPdf(targetEbook, {
        name: buyerName || 'Client BEVULTA',
        email: buyerEmail || 'client@bevulta.com',
        phone: buyerPhone || '',
        orderId: orderId || 'CMD-BEVULTA'
      });
      setDownloadSuccess(true);
    } catch (err) {
      console.error("Direct download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ animation: 'fadeIn 0.25s ease', zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '540px', padding: '32px', borderRadius: '24px' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: step === 'download' ? '#dcfce7' : '#ecfdf5', 
              color: step === 'download' ? '#166534' : '#15803d', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {step === 'download' ? (
                <CheckCircle2 size={24} />
              ) : isEbookPurchase ? (
                <BookOpen size={22} />
              ) : (
                <Smartphone size={22} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {step === 'download' 
                  ? (isEn ? "Your E-book is Ready!" : "Votre Guide est Prêt !")
                  : isEbookPurchase 
                    ? (isEn ? "E-book Order" : "Commande de l'E-book")
                    : (isEn ? "Mobile Money Payment" : "Règlement Mobile Money")}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {step === 'download'
                  ? (isEn ? "Format: High Definition PDF" : "Format : PDF Haute Définition")
                  : (momoOperator + ' • Réf: ' + orderId)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: CUSTOMER INFO */}
        {step === 'form' && (
          <form onSubmit={handleValidateInfo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
              Renseignez vos coordonnées pour recevoir votre confirmation et accéder immédiatement au téléchargement de votre guide.
            </div>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem' }}>
                {formError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {isEn ? "Full Name *" : "Nom & Prénom *"}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Ex: Hermine AMOUZOUN"
                  style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {isEn ? "Email Address (for receipt & download) *" : "Adresse E-mail (pour votre reçu et téléchargement) *"}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="Ex: amouzounhermine7@gmail.com"
                  style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {isEn ? "Mobile Money / WhatsApp Phone Number *" : "Numéro Mobile Money / WhatsApp *"}
              </label>
              <PhoneInputWithCountry
                value={buyerPhone}
                onChange={(full) => setBuyerPhone(full)}
                lang={lang}
                required
                placeholder={isEn ? "Phone / WhatsApp" : "Numéro Mobile Money / WhatsApp"}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                marginTop: '10px',
                padding: '13px 20px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 800,
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>{isEn ? "Continue to Payment" : "Continuer vers le Paiement"} ({amountFcfa?.toLocaleString()} FCFA)</span>
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT INSTRUCTIONS */}
        {step === 'payment' && (
          <div>
            {/* Order Details Card */}
            <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{isEn ? "Item" : "Article"}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{itemTitle}</span>
              </div>
              {buyerEmail && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: '#64748b' }}>Acquéreur :</span>
                  <span style={{ fontWeight: 600, color: '#166534' }}>{buyerName} ({buyerEmail})</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{isEn ? "Total to pay" : "Montant à régler"}</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#166534' }}>
                  {amountFcfa?.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {/* Direct Transfer Instructions */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {isEn ? "Transfer to Merchant Number" : "Numéro Marchand / Compte Récepteur :"}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value={momoNumber}
                  style={{
                    flexGrow: 1,
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    background: '#ffffff'
                  }}
                />
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: copied ? '#166534' : '#0f172a',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy" : "Copier")}</span>
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px', lineHeight: 1.4 }}>
                {settings?.momoInstructions || (isEn 
                  ? "Send the exact amount from your phone. Put your name or order reference in the description." 
                  : "Effectuez le transfert depuis votre téléphone (MTN ou Moov). Mentionnez votre nom ou la référence en motif.")}
              </p>
            </div>

            {/* Actions Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleWhatsAppConfirmation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                }}
              >
                <MessageCircle size={18} />
                <span>{isEn ? "Confirm on WhatsApp with receipt" : "Confirmer mon transfert sur WhatsApp"}</span>
              </button>

              <button
                type="button"
                onClick={handlePaymentCompleted}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={16} />
                <span>
                  {isEbookPurchase
                    ? (isEn ? "I have paid • Download My E-book" : "J'ai payé • Accéder au Téléchargement")
                    : (isEn ? "I have completed the payment" : "J'ai déjà effectué le paiement")}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DIRECT DOWNLOAD WITH ANTI-SHARING WATERMARK */}
        {step === 'download' && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              {isEn ? "Payment Successfully Recorded!" : "Paiement Enregistré avec Succès !"}
            </h4>

            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              {isEn 
                ? "Thank you for your purchase! You can download your official guide below." 
                : "Merci pour votre achat ! Votre guide est prêt, vous pouvez le télécharger dès maintenant."}
            </p>

            {/* Order Recap Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 20px',
              textAlign: 'left',
              fontSize: '0.85rem',
              marginBottom: '24px'
            }}>
              <div style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
                {isEn ? "Order Summary :" : "Récapitulatif de votre commande :"}
              </div>
              <div style={{ color: '#334155', lineHeight: 1.6 }}>
                <div>• Article : <strong>{itemTitle}</strong></div>
                <div>• Client : <strong>{buyerName}</strong></div>
                <div>• Email : <strong>{buyerEmail}</strong></div>
                <div>• Référence : <strong>{orderId}</strong></div>
              </div>
            </div>

            {/* Direct Download Button */}
            <button
              type="button"
              disabled={downloading}
              onClick={handleDirectDownload}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px 24px',
                borderRadius: '14px',
                border: 'none',
                background: downloadSuccess 
                  ? '#15803d' 
                  : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: downloading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.2s ease',
                marginBottom: '12px'
              }}
            >
              <Download size={20} />
              <span>
                {downloading 
                  ? (isEn ? "Preparing PDF file..." : "Préparation du fichier PDF...")
                  : downloadSuccess
                    ? (isEn ? "Re-download E-book (PDF)" : "Télécharger à nouveau (PDF)")
                    : (isEn ? "Download My E-book (PDF)" : "Télécharger mon E-book (PDF)")
                }
              </span>
            </button>

            {downloadSuccess && (
              <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700, marginBottom: '14px' }}>
                ✓ Téléchargement lancé avec succès ! Le fichier est sur votre appareil.
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 12px'
              }}
            >
              {isEn ? "Close" : "Fermer cette fenêtre"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
