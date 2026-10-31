import React, { useState } from 'react';
import { X, Check, Copy, MessageCircle, Smartphone, ShieldCheck } from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  paymentData,
  settings = {},
  lang = 'fr',
  onConfirmPayment
}) {
  const [copied, setCopied] = useState(false);
  const isEn = lang === 'en';

  if (!isOpen || !paymentData) return null;

  const { amountFcfa, itemTitle, orderId } = paymentData;
  const momoNumber = settings?.momoNumber || settings?.contactPhone1 || '+229 97 69 91 78';
  const momoOperator = settings?.momoOperator || 'MTN MoMo / Moov Money';
  const whatsappNumber = (settings?.whatsappNumber || '22997699178').replace(/[^0-9]/g, '');

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(momoNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `Bonjour BEVULTA, je viens d'effectuer le paiement de ${amountFcfa?.toLocaleString()} FCFA pour "${itemTitle}" (Réf: ${orderId}). Pouvez-vous valider ma commande ? Merci.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    if (onConfirmPayment) onConfirmPayment();
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ animation: 'fadeIn 0.25s ease', zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '520px', padding: '32px', borderRadius: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEn ? "Mobile Money Payment" : "Règlement Mobile Money"}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {momoOperator} (Bénin & Sous-région)
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

        {/* Order Details Card */}
        <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{isEn ? "Product / Order" : "Article / Commande"}</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{itemTitle}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{isEn ? "Total to pay" : "Montant à régler"}</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#166534' }}>
              {amountFcfa?.toLocaleString()} FCFA
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
            Réf: <strong>{orderId}</strong>
          </div>
        </div>

        {/* Direct Transfer Instructions */}
        <div style={{ marginBottom: '24px' }}>
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
              : "Effectuez le transfert depuis votre téléphone (MTN ou Moov). Mentionnez la référence de commande en motif.")}
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
            onClick={() => {
              if (onConfirmPayment) onConfirmPayment();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 20px',
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
            <span>{isEn ? "I have completed the payment" : "J'ai déjà effectué le paiement"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

