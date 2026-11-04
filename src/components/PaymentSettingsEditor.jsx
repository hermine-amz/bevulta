import React, { useState } from 'react';
import { 
  CreditCard, 
  Save, 
  CheckCircle, 
  Smartphone, 
  Globe, 
  Zap,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Star,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  Layers
} from 'lucide-react';
import { defaultSettings } from '../data/defaultSettings';

// Available presets for 1-click addition
const PRESET_GATEWAYS = [
  {
    id: 'cinetpay',
    name: 'CinetPay (10+ Pays d\'Afrique)',
    category: 'Afrique de l\'Ouest & Centrale',
    type: 'api',
    providerKey: 'cinetpay',
    networks: 'Orange Money, MTN, Moov, Wave, Cartes Visa / Mastercard',
    desc: 'Couverture panafricaine (Bénin, CI, Sénégal, Cameroun, Mali, Burkina, Togo, RDC).',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
    checkoutUrl: 'https://checkout.cinetpay.com',
    publicKey: '',
    secretKey: '',
    siteId: ''
  },
  {
    id: 'wave',
    name: 'Wave Direct / Wave Business',
    category: 'UEMOA & Instantané',
    type: 'link',
    providerKey: 'wave',
    networks: 'Wave Money (Bénin, Sénégal, Côte d\'Ivoire)',
    desc: 'Paiement sans frais et instantané par QR Code Wave ou lien direct marchand.',
    badgeBg: '#e0f2fe',
    badgeColor: '#0284c7',
    checkoutUrl: 'https://pay.wave.com/m/',
    publicKey: ''
  },
  {
    id: 'fedapay',
    name: 'FedaPay (MTN MoMo, Moov, Cartes)',
    category: 'Bénin & UEMOA',
    type: 'api',
    providerKey: 'fedapay',
    networks: 'MTN Mobile Money, Moov Money, Cartes Bancaires',
    desc: 'Passerelle de référence au Bénin & zone UEMOA. Guichet sécurisé sur votre site.',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
    checkoutUrl: '',
    publicKey: ''
  },
  {
    id: 'kkiapay',
    name: 'KKiaPay',
    category: 'Bénin & Togo',
    type: 'api',
    providerKey: 'kkiapay',
    networks: 'MTN MoMo, Moov Money, Carte Bancaire',
    desc: 'Validation instantanée par USSD ou notification push.',
    badgeBg: '#f3e8ff',
    badgeColor: '#7e22ce',
    checkoutUrl: '',
    publicKey: ''
  },
  {
    id: 'paytech',
    name: 'PayTech (Sénégal & UEMOA)',
    category: 'Sénégal & UEMOA',
    type: 'link',
    providerKey: 'paytech',
    networks: 'Wave, Orange Money, Free Money, E-Money, Cartes',
    desc: 'Agrégateur très populaire en Afrique de l\'Ouest avec lien de caisse ou API.',
    badgeBg: '#dcfce7',
    badgeColor: '#166534',
    checkoutUrl: 'https://paytech.sn/payment/checkout/',
    publicKey: ''
  },
  {
    id: 'ligdicash',
    name: 'LigdiCash (Burkina Faso & UEMOA)',
    category: 'Burkina Faso & UEMOA',
    type: 'link',
    providerKey: 'ligdicash',
    networks: 'Orange Money Burkina, Moov Money, Wave, Cartes',
    desc: 'Solution de paiement locale pour le Burkina Faso et la sous-région.',
    badgeBg: '#fee2e2',
    badgeColor: '#b91c1c',
    checkoutUrl: 'https://client.ligdicash.com/pay/',
    publicKey: ''
  },
  {
    id: 'paydunya',
    name: 'PayDunya',
    category: 'Sous-région & Wave',
    type: 'link',
    providerKey: 'paydunya',
    networks: 'Wave, Orange Money, MoMo, Free Money, Cartes',
    desc: 'Passerelle complète pour le Sénégal, la Côte d\'Ivoire et le Bénin.',
    badgeBg: '#fef3c7',
    badgeColor: '#d97706',
    checkoutUrl: 'https://paydunya.com/checkout/',
    publicKey: ''
  },
  {
    id: 'momo_manual',
    name: 'Paiement Manuel Direct (MTN / Moov)',
    category: '100% Direct Atelier',
    type: 'manual',
    providerKey: 'manual',
    networks: 'MTN MoMo, Moov Money, WhatsApp',
    desc: 'Affiche directement le numéro récepteur de l\'atelier avec confirmation WhatsApp.',
    badgeBg: '#f0fdf4',
    badgeColor: '#166534',
    phone: '+229 97 69 91 78',
    operator: 'MTN Mobile Money / Moov Money',
    instructions: 'Transférez le montant exact vers ce numéro avec la référence en motif puis confirmez sur WhatsApp.'
  },
  {
    id: 'custom_gateway',
    name: 'Nouvel Agrégateur Personnalisé',
    category: 'Personnalisé',
    type: 'link',
    providerKey: 'custom',
    networks: 'Mobile Money, Cartes Bancaires',
    desc: 'Ajoutez n\'importe quel autre agrégateur avec son lien de caisse ou sa clé API.',
    badgeBg: '#f1f5f9',
    badgeColor: '#475569',
    checkoutUrl: '',
    publicKey: ''
  }
];

export default function PaymentSettingsEditor({
  settings = {},
  updateSettings,
  lang = 'fr',
  showAlert,
  showConfirm
}) {
  const isEn = lang === 'en';

  // Load existing gateways or fallback to default
  const initialGateways = Array.isArray(settings.customPaymentGateways) && settings.customPaymentGateways.length > 0
    ? settings.customPaymentGateways
    : defaultSettings.customPaymentGateways || [];

  const [gateways, setGateways] = useState(initialGateways);
  const [paymentMode, setPaymentMode] = useState(settings.paymentMode || 'live');
  const [isSaving, setIsSaving] = useState(false);

  // Modal State for Adding / Editing
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeEditingGateway, setActiveEditingGateway] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Persist gateways to settings
  const saveGatewaysToSettings = async (updatedGateways, updatedMode = paymentMode) => {
    setIsSaving(true);
    try {
      await updateSettings({
        ...settings,
        customPaymentGateways: updatedGateways,
        paymentMode: updatedMode
      });
      setGateways(updatedGateways);
      showAlert(isEn ? "Payment gateways saved successfully!" : "Configuration des agrégateurs enregistrée avec succès !");
    } catch (err) {
      console.error("Save gateways error:", err);
      showAlert(isEn ? "Failed to save settings." : "Erreur lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle gateway active / inactive
  const handleToggleActive = async (id, e) => {
    if (e) e.stopPropagation();
    const updated = gateways.map(gw => {
      if (gw.id === id) {
        return { ...gw, isActive: !gw.isActive };
      }
      return gw;
    });
    await saveGatewaysToSettings(updated);
  };

  // Set gateway as default
  const handleSetDefault = async (id, e) => {
    if (e) e.stopPropagation();
    const updated = gateways.map(gw => ({
      ...gw,
      isDefault: gw.id === id
    }));
    await saveGatewaysToSettings(updated);
  };

  // Delete gateway
  const handleDeleteGateway = async (id) => {
    const updated = gateways.filter(gw => gw.id !== id);
    // If the deleted one was default, make the first active one default
    if (updated.length > 0 && !updated.some(g => g.isDefault)) {
      const firstActive = updated.find(g => g.isActive) || updated[0];
      firstActive.isDefault = true;
    }
    await saveGatewaysToSettings(updated);
    setDeleteConfirmId(null);
  };

  // Open modal to add
  const handleOpenAdd = () => {
    setActiveEditingGateway({
      id: `gw_${Date.now()}`,
      name: '',
      category: 'Afrique de l\'Ouest',
      type: 'link', // 'link' | 'api' | 'manual'
      providerKey: 'custom',
      networks: 'Wave, MTN MoMo, Moov, Orange, Carte',
      desc: 'Paiement sécurisé par Mobile Money et Carte.',
      badgeBg: '#eff6ff',
      badgeColor: '#1d4ed8',
      checkoutUrl: '',
      publicKey: '',
      secretKey: '',
      siteId: '',
      phone: '+229 97 69 91 78',
      operator: 'MTN Mobile Money / Moov Money',
      instructions: 'Effectuez le transfert vers ce numéro avec la référence en motif.',
      isActive: true,
      isDefault: gateways.length === 0
    });
    setModalMode('add');
  };

  // Open modal to edit
  const handleOpenEdit = (gw, e) => {
    if (e) e.stopPropagation();
    setActiveEditingGateway({ ...gw });
    setModalMode('edit');
  };

  // Apply preset to activeEditingGateway
  const handleSelectPreset = (presetId) => {
    const preset = PRESET_GATEWAYS.find(p => p.id === presetId);
    if (!preset) return;

    setActiveEditingGateway(prev => ({
      ...prev,
      name: preset.name,
      category: preset.category,
      type: preset.type,
      providerKey: preset.providerKey,
      networks: preset.networks,
      desc: preset.desc,
      badgeBg: preset.badgeBg,
      badgeColor: preset.badgeColor,
      checkoutUrl: preset.checkoutUrl || prev.checkoutUrl || '',
      publicKey: preset.publicKey || prev.publicKey || '',
      phone: preset.phone || prev.phone || '+229 97 69 91 78',
      operator: preset.operator || prev.operator || 'MTN Mobile Money / Moov Money',
      instructions: preset.instructions || prev.instructions || ''
    }));
  };

  // Save gateway from modal
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!activeEditingGateway.name.trim()) {
      showAlert(isEn ? "Please enter a gateway name." : "Veuillez entrer le nom de l'agrégateur.");
      return;
    }

    let updated;
    if (modalMode === 'add') {
      updated = [...gateways, activeEditingGateway];
      await saveGatewaysToSettings(updated);
      setModalMode(null);
      setActiveEditingGateway(null);
    } else {
      if (showConfirm) {
        showConfirm(
          isEn 
            ? `Save modifications to "${activeEditingGateway.name}"?` 
            : `Confirmez-vous les modifications apportées à l'agrégateur "${activeEditingGateway.name}" ?`,
          async () => {
            const up = gateways.map(g => g.id === activeEditingGateway.id ? activeEditingGateway : g);
            await saveGatewaysToSettings(up);
            setModalMode(null);
            setActiveEditingGateway(null);
          }
        );
      } else {
        updated = gateways.map(g => g.id === activeEditingGateway.id ? activeEditingGateway : g);
        await saveGatewaysToSettings(updated);
        setModalMode(null);
        setActiveEditingGateway(null);
      }
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '1160px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '24px 28px',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEn ? "Payment Aggregators & Gateways" : "Agrégateurs & Passerelles de Paiement"}
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', background: '#f1f5f9', color: '#475569' }}>
                {gateways.filter(g => g.isActive).length} actif(s) sur {gateways.length}
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '4px 0 0 0' }}>
              {isEn 
                ? "Add, remove, or configure any African payment provider without coding." 
                : "Ajoutez, supprimez et personnalisez vos agrégateurs (FedaPay, Wave, CinetPay, etc.) en totale autonomie."}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
              onClick={() => {
                setPaymentMode('live');
                saveGatewaysToSettings(gateways, 'live');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: paymentMode === 'live' ? '#166534' : 'transparent',
                color: paymentMode === 'live' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🟢 {isEn ? "Live" : "Production"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentMode('test');
                saveGatewaysToSettings(gateways, 'test');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: paymentMode === 'test' ? '#ea580c' : 'transparent',
                color: paymentMode === 'test' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🟠 {isEn ? "Sandbox (Test)" : "Mode Test"}
            </button>
          </div>

          {/* Add Gateway CTA */}
          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
            }}
          >
            <Plus size={18} />
            <span>{isEn ? "Add an Aggregator" : "Ajouter un agrégateur"}</span>
          </button>
        </div>
      </div>

      {/* Explanatory Info Card */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={22} color="#15803d" />
          <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.45 }}>
            <strong>Fonctionnement dynamique :</strong> Seuls les agrégateurs marqués comme <strong>Actifs (🟢)</strong> sont présentés à vos clients lors de la commande (E-books, Formations, Devis). Vous pouvez en supprimer ou en ajouter à tout moment.
          </div>
        </div>
      </div>

      {/* Aggregators Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {gateways.map((gw) => {
          const isLink = gw.type === 'link';
          const isApi = gw.type === 'api';
          const isManual = gw.type === 'manual';

          return (
            <div
              key={gw.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: gw.isDefault 
                  ? '2px solid #166534' 
                  : gw.isActive 
                    ? '1px solid #cbd5e1' 
                    : '1px solid #e2e8f0',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: gw.isDefault ? '0 8px 24px -6px rgba(22, 101, 52, 0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
                opacity: gw.isActive ? 1 : 0.72,
                transition: 'all 0.2s'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: gw.badgeBg || '#f1f5f9',
                    color: gw.badgeColor || '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isLink ? <Globe size={22} /> : isApi ? <Zap size={22} /> : <Smartphone size={22} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                      {gw.name}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {gw.category || 'Passerelle'}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    background: gw.isActive ? '#dcfce7' : '#f1f5f9',
                    color: gw.isActive ? '#166534' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: gw.isActive ? '#16a34a' : '#94a3b8' }} />
                    {gw.isActive ? 'Actif' : 'Inactif'}
                  </span>
                  {gw.isDefault && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      background: '#fef3c7',
                      color: '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <Star size={10} /> Par Défaut
                    </span>
                  )}
                </div>
              </div>

              {/* Description & Networks */}
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, marginBottom: '14px', flexGrow: 1 }}>
                {gw.desc || 'Agrégateur pour paiements sécurisés.'}
              </p>

              {/* Supported Networks Tag */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '8px 12px',
                border: '1px solid #f1f5f9',
                marginBottom: '16px',
                fontSize: '0.75rem',
                color: '#334155'
              }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>Réseaux acceptés :</strong>
                <span style={{ color: '#166534', fontWeight: 600 }}>{gw.networks || 'Mobile Money, Cartes'}</span>
              </div>

              {/* Integration Summary */}
              <div style={{ marginBottom: '18px', fontSize: '0.78rem', color: '#64748b' }}>
                {isLink && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Globe size={14} color="#0284c7" />
                    <span>Lien : <strong>{gw.checkoutUrl ? gw.checkoutUrl.substring(0, 32) + '...' : 'Non configuré'}</strong></span>
                  </div>
                )}
                {isApi && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#7e22ce" />
                    <span>Clé API : <strong>{gw.publicKey ? `${gw.publicKey.substring(0, 8)}...` : 'Non renseignée'}</strong></span>
                  </div>
                )}
                {isManual && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smartphone size={14} color="#15803d" />
                    <span>Numéro : <strong>{gw.phone || '+229 97 69 91 78'}</strong></span>
                  </div>
                )}
              </div>

              {/* Card Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: 'auto' }}>
                {/* Active Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleActive(gw.id, e)}
                  title={gw.isActive ? "Désactiver cet agrégateur" : "Activer cet agrégateur"}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: gw.isActive ? '#f0fdf4' : '#ffffff',
                    color: gw.isActive ? '#166534' : '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {gw.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  <span>{gw.isActive ? "Désactiver" : "Activer"}</span>
                </button>

                {/* Make default button */}
                {!gw.isDefault && gw.isActive && (
                  <button
                    type="button"
                    onClick={(e) => handleSetDefault(gw.id, e)}
                    title="Définir comme moyen de paiement favori / par défaut"
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ⭐ Favori
                  </button>
                )}

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={(e) => handleOpenEdit(gw, e)}
                  title="Configurer les clés et paramètres"
                  style={{
                    marginLeft: 'auto',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit3 size={14} />
                  <span>Modifier</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(gw.id)}
                  title="Supprimer définitivement cet agrégateur"
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Supprimer cet agrégateur ?
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
              Cet agrégateur ne sera plus proposé à vos clients. Vous pourrez toujours le rajouter plus tard si besoin.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteGateway(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Oui, Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT AGGREGATOR MODAL */}
      {modalMode && activeEditingGateway && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setModalMode(null);
                setActiveEditingGateway(null);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {modalMode === 'add' ? <Plus size={20} /> : <Edit3 size={20} />}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {modalMode === 'add' ? "Ajouter un nouvel agrégateur" : `Configurer ${activeEditingGateway.name}`}
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '22px' }}>
              Renseignez les coordonnées de la passerelle. Vos modifications s'appliquent immédiatement pour vos clients.
            </p>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Preset Selector if Add Mode */}
              {modalMode === 'add' && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ⚡ Modèle rapide à pré-remplir :
                  </label>
                  <select
                    onChange={(e) => handleSelectPreset(e.target.value)}
                    defaultValue=""
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    <option value="" disabled>-- Choisir parmi les agrégateurs populaires --</option>
                    {PRESET_GATEWAYS.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name & Category Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Nom de l'agrégateur * :
                  </label>
                  <input
                    type="text"
                    required
                    value={activeEditingGateway.name}
                    onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, name: e.target.value })}
                    placeholder="Ex: CinetPay, Wave, FedaPay..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Zone géographique / Badge :
                  </label>
                  <input
                    type="text"
                    value={activeEditingGateway.category || ''}
                    onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, category: e.target.value })}
                    placeholder="Ex: Bénin & UEMOA, Panafricain..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Integration Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Type d'intégration technique :
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'link', label: 'Lien Marchand', sub: 'Redirection / Caisse', icon: <Globe size={16} /> },
                    { id: 'api', label: 'Clé d\'API', sub: 'Guichet Direct', icon: <Zap size={16} /> },
                    { id: 'manual', label: 'Manuel MoMo', sub: 'Numéro + WhatsApp', icon: <Smartphone size={16} /> }
                  ].map(t => (
                    <div
                      key={t.id}
                      onClick={() => setActiveEditingGateway({ ...activeEditingGateway, type: t.id })}
                      style={{
                        border: activeEditingGateway.type === t.id ? '2px solid #166534' : '1px solid #cbd5e1',
                        background: activeEditingGateway.type === t.id ? '#f0fdf4' : '#ffffff',
                        padding: '12px 10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ color: activeEditingGateway.type === t.id ? '#166534' : '#64748b', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                        {t.icon}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{t.label}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Networks */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Moyens et réseaux acceptés (affiché aux clients) :
                </label>
                <input
                  type="text"
                  value={activeEditingGateway.networks || ''}
                  onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, networks: e.target.value })}
                  placeholder="Ex: Wave, MTN MoMo, Moov Money, Orange, Carte Visa..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Conditional Fields: Type === 'link' */}
              {activeEditingGateway.type === 'link' && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    🔗 URL ou Lien de Caisse de Paiement :
                  </label>
                  <input
                    type="url"
                    value={activeEditingGateway.checkoutUrl || ''}
                    onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, checkoutUrl: e.target.value })}
                    placeholder="https://pay.wave.com/m/... ou https://checkout.cinetpay.com/..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  <span style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                    💡 Le montant de la commande et la référence du client y seront transmis automatiquement.
                  </span>
                </div>
              )}

              {/* Conditional Fields: Type === 'api' */}
              {activeEditingGateway.type === 'api' && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      🔑 Clé Publique (API Key / Public Key) :
                    </label>
                    <input
                      type="text"
                      value={activeEditingGateway.publicKey || ''}
                      onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, publicKey: e.target.value })}
                      placeholder={paymentMode === 'live' ? 'pk_live_...' : 'pk_sandbox_...'}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Identifiant Marchand / Site ID (si requis par CinetPay / KKiaPay) :
                    </label>
                    <input
                      type="text"
                      value={activeEditingGateway.siteId || ''}
                      onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, siteId: e.target.value })}
                      placeholder="Ex: 584930 ou Site ID"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              )}

              {/* Conditional Fields: Type === 'manual' */}
              {activeEditingGateway.type === 'manual' && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Numéro de téléphone récepteur :
                      </label>
                      <input
                        type="text"
                        value={activeEditingGateway.phone || ''}
                        onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, phone: e.target.value })}
                        placeholder="+229 97 69 91 78"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Opérateur :
                      </label>
                      <input
                        type="text"
                        value={activeEditingGateway.operator || ''}
                        onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, operator: e.target.value })}
                        placeholder="MTN Mobile Money / Moov"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Instructions au client :
                    </label>
                    <textarea
                      rows={2}
                      value={activeEditingGateway.instructions || ''}
                      onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, instructions: e.target.value })}
                      placeholder="Transférez le montant vers ce numéro avec la référence en motif..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {/* Status & Default checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '8px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#0f172a', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={activeEditingGateway.isActive !== false}
                    onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#166534' }}
                  />
                  <span>Activer cet agrégateur immédiatement</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#0f172a', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(activeEditingGateway.isDefault)}
                    onChange={(e) => setActiveEditingGateway({ ...activeEditingGateway, isDefault: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#166534' }}
                  />
                  <span>Définir par défaut (favori)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '18px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setModalMode(null);
                    setActiveEditingGateway(null);
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? "Enregistrement..." : (modalMode === 'add' ? "Ajouter l'agrégateur" : "Enregistrer les modifications")}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
