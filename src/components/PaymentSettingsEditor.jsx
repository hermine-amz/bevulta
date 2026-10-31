import React, { useState } from 'react';
import { 
  CreditCard, 
  Save, 
  CheckCircle, 
  Smartphone, 
  Globe, 
  Zap
} from 'lucide-react';

export default function PaymentSettingsEditor({
  settings = {},
  updateSettings,
  lang = 'fr',
  showAlert
}) {
  const isEn = lang === 'en';

  const [formData, setFormData] = useState({
    paymentProvider: settings.paymentProvider || 'custom_link',
    paymentMode: settings.paymentMode || 'live',
    customPaymentLink: settings.customPaymentLink || '',
    fedapayPublicKey: settings.fedapayPublicKey || '',
    kkiapayPublicKey: settings.kkiapayPublicKey || '',
    paydunyaMasterKey: settings.paydunyaMasterKey || '',
    paydunyaPrivateKey: settings.paydunyaPrivateKey || '',
    paydunyaToken: settings.paydunyaToken || '',
    momoNumber: settings.momoNumber || settings.contactPhone1 || '+229 97 69 91 78',
    momoOperator: settings.momoOperator || 'MTN Mobile Money / Moov Money',
    momoInstructions: settings.momoInstructions || 'Transférez le montant exact vers ce numéro. Indiquez la référence de commande en motif du transfert.',
    isPaymentActive: settings.isPaymentActive !== false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        ...settings,
        ...formData
      });
      showAlert(
        isEn 
          ? "Payment gateway settings updated successfully!" 
          : "Configuration des paiements enregistrée avec succès !"
      );
    } catch (err) {
      console.error("Save payment settings error:", err);
      showAlert(
        isEn 
          ? "Failed to save payment settings." 
          : "Erreur lors de l'enregistrement des paramètres de paiement."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const providers = [
    {
      id: 'custom_link',
      title: 'Lien direct (Saspay / Wave / KKiaPay Me)',
      badge: 'Recommandé No-Code',
      badgeColor: '#166534',
      badgeBg: '#dcfce7',
      desc: 'Idéal si vous ne voulez manipuler aucune clé API. Collez simplement le lien de votre page de paiement ou de votre compte marchand.',
      icon: <Globe size={24} color="#0284c7" />
    },
    {
      id: 'fedapay',
      title: 'FedaPay (MTN MoMo, Moov, Carte)',
      badge: 'Bénin & UEMOA',
      badgeColor: '#1d4ed8',
      badgeBg: '#eff6ff',
      desc: 'La passerelle de référence au Bénin. Ouvre un guichet sécurisé sur votre site pour MTN Mobile Money, Moov et cartes bancaires.',
      icon: <CreditCard size={24} color="#2563eb" />
    },
    {
      id: 'kkiapay',
      title: 'KKiaPay',
      badge: 'Bénin & Togo',
      badgeColor: '#7e22ce',
      badgeBg: '#f3e8ff',
      desc: 'Guichet de paiement Mobile Money fluide avec validation immédiate par code USSD ou notification push.',
      icon: <Zap size={24} color="#9333ea" />
    },
    {
      id: 'paydunya',
      title: 'PayDunya',
      badge: 'Sous-région & Wave',
      badgeColor: '#b45309',
      badgeBg: '#fef3c7',
      desc: 'Solution pour le Sénégal, la Côte d\'Ivoire, le Bénin et le Burkina (Wave, Orange Money, MoMo, Free Money).',
      icon: <Smartphone size={24} color="#d97706" />
    },
    {
      id: 'momo_manual',
      title: 'Paiement Manuel Mobile Money',
      badge: '100% Direct',
      badgeColor: '#475569',
      badgeBg: '#f1f5f9',
      desc: 'Affiche directement votre numéro de téléphone récepteur (MTN / Moov) avec un bouton de confirmation immédiat sur WhatsApp.',
      icon: <Smartphone size={24} color="#16a34a" />
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {isEn ? "Payment Gateways & Mobile Money" : "Passerelles de Paiement & Mobile Money"}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              {isEn 
                ? "Configure your payment providers without writing any code. Changes apply immediately." 
                : "Configurez vos encaissements MTN MoMo, Moov, Wave et Cartes en toute autonomie sans coder."}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => handleChange('paymentMode', 'live')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: formData.paymentMode === 'live' ? '#166534' : 'transparent',
                color: formData.paymentMode === 'live' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🟢 {isEn ? "Live (Real Money)" : "Production (Réel)"}
            </button>
            <button
              type="button"
              onClick={() => handleChange('paymentMode', 'test')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: formData.paymentMode === 'test' ? '#ea580c' : 'transparent',
                color: formData.paymentMode === 'test' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🟠 {isEn ? "Sandbox (Test)" : "Mode Test"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: '#166534',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(22, 101, 52, 0.2)'
            }}
          >
            <Save size={16} />
            <span>{isSaving ? (isEn ? "Saving..." : "Enregistrement...") : (isEn ? "Save Gateway" : "Enregistrer")}</span>
          </button>
        </div>
      </div>

      {/* Provider Selection Grid */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          {isEn ? "1. Select Active Payment Solution" : "1. Choisissez la solution de paiement active"}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {providers.map(p => {
            const isSelected = formData.paymentProvider === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleChange('paymentProvider', p.id)}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #166534' : '1px solid #e5e7eb',
                  padding: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 14px rgba(22, 101, 52, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isSelected ? '#dcfce7' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: p.badgeBg,
                    color: p.badgeColor
                  }}>
                    {p.badge}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {p.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  {p.desc}
                </p>

                {isSelected && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>
                    <CheckCircle size={14} />
                    <span>Actuellement sélectionné</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Configuration Form Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* OPTION 1: CUSTOM LINK (SASPAY / WAVE / KKIPAY ME / PAYDUNYA) */}
        {formData.paymentProvider === 'custom_link' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Globe size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Configuration du Lien Direct de Paiement
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Collez l'URL de votre page de paiement réutilisable ou compte marchand. Les clients seront automatiquement redirigés vers ce lien lors de la validation.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Lien de Paiement Global (Saspay / Wave / KKiaPay Me / PayDunya Checkout) :
              </label>
              <input
                type="url"
                value={formData.customPaymentLink}
                onChange={(e) => handleChange('customPaymentLink', e.target.value)}
                placeholder="https://saspay.me/votre-boutique ou https://me.kkiapay.me/bevulta"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                💡 Le montant de la commande et la référence seront automatiquement ajoutés à ce lien.
              </span>
            </div>
          </div>
        )}

        {/* OPTION 2: FEDAPAY */}
        {formData.paymentProvider === 'fedapay' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CreditCard size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Configuration FedaPay (MTN MoMo & Moov Money)
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Connectez votre compte FedaPay Bénin. Vous trouverez vos clés dans votre tableau de bord FedaPay &gt; Paramètres &gt; Clés d'API.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Clé Publique FedaPay ({formData.paymentMode === 'live' ? 'Mode Réel - pk_live_...' : 'Mode Test - pk_sandbox_...'}) :
              </label>
              <input
                type="text"
                value={formData.fedapayPublicKey}
                onChange={(e) => handleChange('fedapayPublicKey', e.target.value)}
                placeholder={formData.paymentMode === 'live' ? 'pk_live_...' : 'pk_sandbox_...'}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.92rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>
        )}

        {/* OPTION 3: KKIAPAY */}
        {formData.paymentProvider === 'kkiapay' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Zap size={20} color="#9333ea" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Configuration KKiaPay
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Entrez votre clé publique KKiaPay (disponible sur votre espace développeur KKiaPay).
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Clé Publique KKiaPay (API Key) :
              </label>
              <input
                type="text"
                value={formData.kkiapayPublicKey}
                onChange={(e) => handleChange('kkiapayPublicKey', e.target.value)}
                placeholder="Ex: 4a8f9b2c..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.92rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>
        )}

        {/* OPTION 4: PAYDUNYA */}
        {formData.paymentProvider === 'paydunya' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Smartphone size={20} color="#d97706" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Configuration PayDunya
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Saisissez vos identifiants d'API PayDunya ou votre lien direct PayDunya Checkout.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  PayDunya MasterKey :
                </label>
                <input
                  type="text"
                  value={formData.paydunyaMasterKey}
                  onChange={(e) => handleChange('paydunyaMasterKey', e.target.value)}
                  placeholder="MasterKey..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  PayDunya Token :
                </label>
                <input
                  type="text"
                  value={formData.paydunyaToken}
                  onChange={(e) => handleChange('paydunyaToken', e.target.value)}
                  placeholder="Token..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Lien de Caisse PayDunya Direct (Optionnel) :
              </label>
              <input
                type="url"
                value={formData.customPaymentLink}
                onChange={(e) => handleChange('customPaymentLink', e.target.value)}
                placeholder="https://paydunya.com/pay/votre-compte"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        )}

        {/* OPTION 5: MANUAL MOMO */}
        {formData.paymentProvider === 'momo_manual' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Smartphone size={20} color="#16a34a" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Configuration du Paiement Manuel par Transfert Mobile Money
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Le client verra votre numéro et cliquera sur un bouton WhatsApp avec le reçu pré-rempli.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Numéro Marchand / Récepteur Mobile Money :
                </label>
                <input
                  type="text"
                  value={formData.momoNumber}
                  onChange={(e) => handleChange('momoNumber', e.target.value)}
                  placeholder="+229 97 69 91 78"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Réseau / Opérateur :
                </label>
                <input
                  type="text"
                  value={formData.momoOperator}
                  onChange={(e) => handleChange('momoOperator', e.target.value)}
                  placeholder="MTN Mobile Money / Moov Money"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Instructions affichées au client :
              </label>
              <textarea
                rows={2}
                value={formData.momoInstructions}
                onChange={(e) => handleChange('momoInstructions', e.target.value)}
                placeholder="Effectuez le transfert vers ce numéro avec le nom du produit comme référence..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Bottom Save Bar inside form */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 26px',
              borderRadius: '10px',
              border: 'none',
              background: '#166534',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save size={16} />
            <span>{isSaving ? "Enregistrement en cours..." : "Enregistrer cette configuration"}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
