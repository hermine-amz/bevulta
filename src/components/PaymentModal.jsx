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
      const needsInfoFirst = isEbook && (!name.trim() || !email.trim());
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
    setFormError('');
    setStep('payment');
  };

  const handleWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `Bonjour BEVULTA, je viens d'effectuer le paiement de ${amountFcfa?.toLocaleString()} FCFA pour "${itemTitle}" au nom de ${buyerName || 'Client'} (${buyerEmail || 'Email non précisé'}) (Réf: ${orderId}). Pouvez-vous valider ma commande ? Merci.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    if (onConfirmPayment) onConfirmPayment();

    if (isEbookPurchase) {
      setStep('download');
    } else {
      onClose();
    }
  };

  const handlePaymentCompleted = () => {
    if (onConfirmPayment) onConfirmPayment();
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
                  ? (isEn ? "Ready for Download!" : "Téléchargement Immédiat")
                  : isEbookPurchase 
                    ? (isEn ? "E-book Purchase & License" : "Achat E-book & Licence Personnelle")
                    : (isEn ? "Mobile Money Payment" : "Règlement Mobile Money")}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {step === 'download'
                  ? (isEn ? "Secured with your personal watermark" : "Tatouage numérique anti-partage appliqué")
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

        {/* STEP 1: CUSTOMER INFO (Required for Ebook Anti-sharing Watermark) */}
        {step === 'form' && (
          <form onSubmit={handleValidateInfo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px', fontSize: '0.82rem', color: '#166534', lineHeight: 1.4, display: 'flex', gap: '10px' }}>
              <Lock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Sécurité anti-partage & Licence d'utilisation :</strong>
                <div>Votre nom et votre adresse e-mail seront gravés en filigrane permanent sur votre exemplaire officiel pour protéger vos droits d'accès.</div>
              </div>
            </div>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem' }}>
                {formError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {isEn ? "Full Name (for your license certificate) *" : "Nom & Prénom de l'acquéreur *"}
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
                {isEn ? "Email Address (for download & anti-piracy stamp) *" : "Adresse E-mail (pour le tatouage et la copie) *"}
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
                {isEn ? "Phone / WhatsApp (Optional)" : "Numéro WhatsApp / Téléphone"}
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="Ex: +229 97 00 00 00"
                  style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>
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
              {isEn ? "Payment Recorded Successfully!" : "Paiement Enregistré avec Succès !"}
            </h4>

            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              Votre exemplaire officiel a été certifié avec vos informations de licence et tatoué numériquement contre le partage non autorisé.
            </p>

            {/* Security Certificate Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '16px',
              textAlign: 'left',
              fontSize: '0.82rem',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, marginBottom: '8px' }}>
                <Lock size={16} />
                <span>Protection Anti-Partage Appliquée :</span>
              </div>
              <div style={{ color: '#334155', lineHeight: 1.6 }}>
                <div>• Titulaire : <strong>{buyerName || 'Client BEVULTA'}</strong></div>
                <div>• E-mail gravé : <strong>{buyerEmail || 'client@bevulta.com'}</strong></div>
                <div>• Référence d'achat : <strong>{orderId}</strong></div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                  Un filigrane diagonal avec votre e-mail et date est apposé sur chaque page du PDF.
                </div>
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
                  ? (isEn ? "Stamping and generating PDF..." : "Tatouage numérique & génération...")
                  : downloadSuccess
                    ? (isEn ? "Re-download E-book (PDF)" : "Télécharger à nouveau (PDF)")
                    : (isEn ? "Download My Secured E-book (PDF)" : "Télécharger mon E-book sécurisé (PDF)")
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
