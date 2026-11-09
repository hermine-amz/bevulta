import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Wrench, 
  Truck, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  MessageCircle, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';
import { initiatePayment } from '../services/paymentService';
import PaymentModal from '../components/PaymentModal';
import { supabase } from '../supabaseClient';
import { t } from '../data/translations';

export default function TrackOrder({
  orders = [],
  lang = 'fr',
  settings = {},
  showAlert,
  setCurrentPage,
  initialTrackingId = ''
}) {
  const isEn = lang === 'en';

  const [searchQuery, setSearchQuery] = useState(initialTrackingId || '');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState('deposit'); // 'deposit' (50%) or 'full' (100%)
  const [paymentModalData, setPaymentModalData] = useState(null);

  // Flexible multi-field matcher
  const matchOrderLocally = (orderList, query) => {
    if (!query || !query.trim() || !orderList || orderList.length === 0) return null;
    const cleanQuery = query.trim().toLowerCase();
    const cleanQueryAlpha = cleanQuery.replace(/[^0-9a-z]/g, '');
    const cleanQueryDigits = cleanQuery.replace(/[^0-9]/g, '');

    return orderList.find(o => {
      const oId = (o.id || '').toLowerCase();
      const oDbId = (o.dbId || '').toLowerCase();
      const oRef = (o.reference || '').toLowerCase();
      const oNotes = (o.notes || '').toLowerCase();
      const oEmail = (o.email || '').toLowerCase().trim();
      const oPhone = (o.phone || '').toLowerCase();
      const oPhoneDigits = oPhone.replace(/[^0-9]/g, '');

      // 1. Exact match on human ID, dbId (UUID) or reference
      if (oId === cleanQuery || oDbId === cleanQuery || oRef === cleanQuery) return true;

      // 2. Alphanumeric match (ignoring dashes and spaces, e.g. "dev123456")
      const oIdAlpha = oId.replace(/[^0-9a-z]/g, '');
      const oRefAlpha = oRef.replace(/[^0-9a-z]/g, '');
      if (cleanQueryAlpha) {
        if (oIdAlpha === cleanQueryAlpha || oRefAlpha === cleanQueryAlpha) return true;
        if (cleanQueryAlpha.length >= 4 && (oIdAlpha.includes(cleanQueryAlpha) || cleanQueryAlpha.includes(oIdAlpha))) return true;
      }

      // 3. Digits match on reference (e.g. user typed "849204" for "DEV-849204")
      if (cleanQueryDigits.length >= 4 && (oId.includes(cleanQueryDigits) || oNotes.includes(cleanQueryDigits))) return true;

      // 4. Notes check (e.g. [REF:DEV-XXXXXX])
      if (cleanQueryAlpha && oNotes.includes(cleanQueryAlpha)) return true;

      // 5. Email exact match
      if (cleanQuery.includes('@') && oEmail === cleanQuery) return true;

      // 6. Phone number match (matching last 8 digits or inclusion)
      if (cleanQueryDigits.length >= 6 && oPhoneDigits.length >= 6) {
        if (oPhoneDigits.includes(cleanQueryDigits) || cleanQueryDigits.includes(oPhoneDigits)) return true;
        if (cleanQueryDigits.slice(-8) === oPhoneDigits.slice(-8)) return true;
      }

      return false;
    });
  };

  const findAndSetOrder = async (query) => {
    setSearched(true);
    if (!query || !query.trim()) {
      setSelectedOrder(null);
      return;
    }

    // 1. Try local memory orders first (instant lookup)
    const localMatch = matchOrderLocally(orders, query);
    if (localMatch) {
      setSelectedOrder(localMatch);
      sessionStorage.setItem('bevulta_last_order_id', localMatch.id);
      return;
    }

    // 2. Query Supabase in real-time as a fallback
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedRemote = data.map(o => {
          const refMatch = (o.notes || '').match(/\[REF:([^\]]+)\]/);
          const cleanNotes = (o.notes || '').replace(/\[REF:[^\]]+\]\s*/, '').trim();
          const humanRef = refMatch 
            ? refMatch[1] 
            : (o.id && (o.id.startsWith('DEV-') || o.id.startsWith('FORM-') || o.id.startsWith('EBK-')) 
                ? o.id 
                : `DEV-${o.id ? o.id.replace(/[^0-9]/g, '').slice(0, 6) || o.id.slice(0, 6).toUpperCase() : '100000'}`);

          return {
            id: humanRef,
            dbId: o.id,
            date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            clientName: o.client_name,
            email: o.email,
            phone: o.phone,
            company: o.company,
            country: o.country,
            address: o.address,
            notes: cleanNotes,
            status: o.status,
            subtotalFcfa: o.subtotal_fcfa,
            totalFcfa: o.total_fcfa,
            totalEur: o.total_eur,
            items: (o.order_items || []).map(item => ({
              id: item.product_id,
              name: "Machine Industrielle #" + (item.product_id || ''),
              quantity: item.quantity,
              priceFcfa: item.price_fcfa,
              priceEur: item.price_eur
            }))
          };
        });

        const remoteMatch = matchOrderLocally(mappedRemote, query);
        if (remoteMatch) {
          setSelectedOrder(remoteMatch);
          sessionStorage.setItem('bevulta_last_order_id', remoteMatch.id);
          return;
        }
      }
    } catch (err) {
      console.warn("Supabase order tracking query error:", err);
    } finally {
      setIsSearching(false);
    }

    setSelectedOrder(null);
  };

  // Auto-load if initialTrackingId is provided or if stored in sessionStorage
  useEffect(() => {
    const idToSearch = initialTrackingId || sessionStorage.getItem('bevulta_last_order_id');
    if (idToSearch) {
      setSearchQuery(idToSearch);
      findAndSetOrder(idToSearch);
    }
  }, [initialTrackingId, orders]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    findAndSetOrder(searchQuery);
  };

  const getStepStatus = (currentStatus, stepIndex) => {
    // 0: pending, 1: manufacturing, 2: manufactured, 3: shipped, 4: delivered
    const statusMap = {
      pending: 0,
      manufacturing: 1,
      manufactured: 2,
      shipped: 3,
      delivered: 4
    };
    const currentIdx = statusMap[currentStatus] ?? 0;

    if (currentIdx > stepIndex) return 'completed';
    if (currentIdx === stepIndex) return 'current';
    return 'upcoming';
  };

  const handlePayOrder = (amount, paymentType) => {
    if (!selectedOrder) return;
    const hasEbooks = selectedOrder.items?.some(i => i.isEbook || i.category?.toLowerCase().includes('ebook'));
    const title = paymentType === 'deposit'
      ? `Acompte 50% Commande #${selectedOrder.id}`
      : `Paiement Intégral Commande #${selectedOrder.id}`;

    initiatePayment({
      amountFcfa: amount,
      itemTitle: title,
      orderId: selectedOrder.id,
      clientInfo: selectedOrder,
      settings,
      onSuccess: () => {
        if (showAlert) {
          showAlert(isEn ? "Payment registered successfully!" : "Paiement enregistré avec succès !");
        }
      },
      onError: (err) => {
        if (showAlert) {
          showAlert(err.message || (isEn ? "Payment error." : "Erreur de paiement."));
        }
      },
      onManualMoMo: (data) => {
        setPaymentModalData({
          ...data,
          amountFcfa: amount,
          itemTitle: title,
          isEbook: hasEbooks
        });
      }
    });
  };

  const getWhatsAppAtelierLink = (order) => {
    const atelierPhone = (settings?.whatsappNumber || settings?.contactPhone1 || '22997699178').replace(/[^0-9]/g, '');
    const itemsSummary = order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'Machines';
    const text = isEn
      ? `Hello BEVULTA, I am checking on my machine order #${order.id} (${itemsSummary}). Destination: ${order.country}. Thank you!`
      : `Bonjour BEVULTA, je souhaite un point d'avancement pour ma commande de machine N° ${order.id} (${itemsSummary}). Pays: ${order.country}. Merci !`;
    return `https://wa.me/${atelierPhone}?text=${encodeURIComponent(text)}`;
  };

  const depositAmount = selectedOrder ? Math.round(selectedOrder.totalFcfa * 0.5) : 0;
  const balanceDue = selectedOrder ? (selectedOrder.totalFcfa - depositAmount) : 0;

  const steps = [
    {
      title: isEn ? "Validation & Quote" : "Validation & Devis",
      desc: isEn 
        ? "Quote registered. Awaiting 50% production deposit or full payment." 
        : "Devis proforma émis. Attente de l'acompte de 50% pour ordonnancement.",
      icon: Clock,
      stepKey: 'pending'
    },
    {
      title: isEn ? "Workshop Manufacturing" : "Fabrication en Atelier",
      desc: isEn 
        ? "Precision metalwork, motor assembly, and mechanical testing at Cotonou." 
        : "Découpe laser/châssis, montage moteur et banc d'essai mécanique à Cotonou.",
      icon: Wrench,
      stepKey: 'manufacturing'
    },
    {
      title: isEn ? "Manufactured & Tested" : "Machine Fabriquée",
      desc: isEn 
        ? "Equipment completely manufactured and tested in workshop. Ready for dispatch or pickup." 
        : "Machine entièrement fabriquée et testée en atelier. Prête pour l'expédition ou le retrait.",
      icon: CheckCircle2,
      stepKey: 'manufactured'
    },
    {
      title: isEn ? "Shipping & Transit" : "Expédition & Transit",
      desc: isEn 
        ? "Equipment inspected and packed. In transit via regional freight carrier." 
        : "Machine contrôlée, emballée et prise en charge par le transporteur régional.",
      icon: Truck,
      stepKey: 'shipped'
    },
    {
      title: isEn ? "Delivered & Operational" : "Livré & Opérationnel",
      desc: isEn 
        ? "Delivered on site. Operational handover and 1-year warranty active." 
        : "Réceptionné par le client, mise en service et garantie atelier 12 mois active.",
      icon: CheckCircle2,
      stepKey: 'delivered'
    }
  ];

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '125px 20px 80px', animation: 'fadeIn 0.4s ease' }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(22, 101, 52, 0.08)',
          color: '#166534',
          borderRadius: '30px',
          fontSize: '0.85rem',
          fontWeight: 800,
          marginBottom: '14px',
          border: '1px solid rgba(22, 101, 52, 0.2)'
        }}>
          <Wrench size={16} />
          <span>{isEn ? "LIVE MACHINE PRODUCTION TRACKING" : "SUIVI DE FABRICATION & LIVRAISON EN DIRECT"}</span>
        </div>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--secondary, #0f172a)', margin: '0 0 10px 0' }}>
          {isEn ? "Track Your Machine Manufacturing" : "Suivre l'avancement de votre Machine"}
        </h1>
        <p style={{ color: 'var(--text-secondary, #475569)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
          {isEn 
            ? "Enter your quotation reference (e.g., DEV-749102) or phone number to see the live workshop status." 
            : "Entrez votre référence de devis (ex: DEV-749102) ou votre numéro de téléphone pour voir l'état d'usinage et d'expédition en temps réel."}
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="track-search-card" style={{
        maxWidth: '680px',
        margin: '0 auto 40px',
        padding: '10px 12px',
        borderRadius: '16px',
        border: '2px solid rgba(22, 101, 52, 0.2)',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', color: '#166534', flexGrow: 1 }}>
          <Search size={22} style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder={isEn ? "Enter quote # (DEV-123456), phone or email..." : "Entrez votre N° de devis (ex: DEV-123456), tél ou email..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#0f172a',
              background: 'transparent',
              fontWeight: 600
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="btn btn-primary"
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            opacity: isSearching ? 0.7 : 1,
            cursor: isSearching ? 'not-allowed' : 'pointer'
          }}
        >
          <span>{isSearching ? (isEn ? "Searching..." : "Recherche...") : (isEn ? "Track" : "Suivre")}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* NOT FOUND NOTIFICATION */}
      {searched && !selectedOrder && (
        <div style={{
          maxWidth: '680px',
          margin: '0 auto 40px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '14px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <AlertCircle size={36} color="#d97706" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#92400e', margin: '0 0 6px 0', fontWeight: 800 }}>
            {isEn ? "No order found for this reference" : "Aucun dossier trouvé pour cette référence"}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#b45309', margin: '0 0 16px 0' }}>
            {isEn 
              ? "Please verify the quotation number (DEV-XXXXXX) received upon checkout or your phone number." 
              : "Vérifiez le numéro de dossier figurant sur votre devis proforma (ex: DEV-123456) ou votre numéro de téléphone."}
          </p>
          <a
            href="https://wa.me/22997699178?text=Bonjour%20BEVULTA,%20je%20n'arrive%20pas%20%C3%A0%20retrouver%20mon%20num%C3%A9ro%20de%20devis"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <MessageCircle size={16} />
            <span>{isEn ? "Contact Workshop via WhatsApp" : "Aide Atelier par WhatsApp"}</span>
          </a>
        </div>
      )}

      {/* FOUND ORDER DISPLAY */}
      {selectedOrder && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          
          {/* Top Dossier Card */}
          <div className="track-details-card" style={{
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                    {selectedOrder.id}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: selectedOrder.status === 'delivered' ? '#dcfce7' : selectedOrder.status === 'shipped' ? '#e0f2fe' : selectedOrder.status === 'manufactured' ? '#d1fae5' : selectedOrder.status === 'manufacturing' ? '#dbeafe' : '#fef3c7',
                    color: selectedOrder.status === 'delivered' ? '#166534' : selectedOrder.status === 'shipped' ? '#0369a1' : selectedOrder.status === 'manufactured' ? '#065f46' : selectedOrder.status === 'manufacturing' ? '#1e40af' : '#b45309'
                  }}>
                    {selectedOrder.status === 'delivered' 
                      ? (isEn ? "Delivered" : "Livré & Installé")
                      : selectedOrder.status === 'shipped'
                      ? (isEn ? "Shipped" : "Expédié / En Transit")
                      : selectedOrder.status === 'manufactured'
                      ? (isEn ? "Manufactured" : "Fabriqué (Prêt)")
                      : selectedOrder.status === 'manufacturing'
                      ? (isEn ? "In Manufacturing" : "En cours de fabrication")
                      : (isEn ? "Pending Validation" : "En attente / Devis Émis")}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{isEn ? "Date:" : "Date émission :"} {selectedOrder.date}</span>
                  <span><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{selectedOrder.country} — {selectedOrder.address}</span>
                  <span><Phone size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{selectedOrder.phone}</span>
                </div>
              </div>

              {/* Atelier WhatsApp button */}
              <a
                href={getWhatsAppAtelierLink(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  color: '#166534',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(22, 163, 74, 0.2)'
                }}
              >
                <MessageCircle size={18} />
                <span>{isEn ? "Live Workshop WhatsApp" : "Échanger avec l'Atelier"}</span>
              </a>
            </div>

            {/* Stepper Timeline Visualizer */}
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
              {isEn ? "Manufacturing & Delivery Timeline" : "Cycle de Fabrication & Acheminement :"}
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              position: 'relative'
            }}>
              {steps.map((st, idx) => {
                const statusType = getStepStatus(selectedOrder.status, idx);
                const IconComp = st.icon;

                const isCompleted = statusType === 'completed';
                const isCurrent = statusType === 'current';

                const badgeBg = isCompleted 
                  ? '#16a34a' 
                  : isCurrent 
                  ? '#2563eb' 
                  : '#cbd5e1';

                const cardBorder = isCurrent 
                  ? '2px solid #3b82f6' 
                  : isCompleted 
                  ? '1px solid #86efac' 
                  : '1px solid #f1f5f9';

                const cardBg = isCurrent
                  ? 'rgba(59, 130, 246, 0.04)'
                  : isCompleted
                  ? 'rgba(22, 163, 74, 0.03)'
                  : '#f8fafc';

                return (
                  <div key={idx} style={{
                    padding: '18px',
                    borderRadius: '14px',
                    border: cardBorder,
                    background: cardBg,
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: badgeBg,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}>
                        {isCompleted ? <CheckCircle2 size={18} /> : <IconComp size={16} />}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isCurrent ? '#1d4ed8' : '#0f172a' }}>
                        {st.title}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45 }}>
                      {st.desc}
                    </p>
                    {isCurrent && (
                      <div style={{
                        marginTop: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'ping 1.5s infinite' }}></span>
                        {isEn ? "IN PROGRESS" : "EN COURS"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment & Payment Split Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            
            {/* Equipment List */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#166534" />
                <span>{isEn ? "Machinery & Equipment Ordered" : "Équipements en commande"}</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                        {item.quantity}x {item.name}
                      </div>
                      {item.specs && item.specs["Motorisation"] && (
                        <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>
                          Option : {item.specs["Motorisation"]}
                        </div>
                      )}
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        PU : {item.priceFcfa?.toLocaleString()} FCFA
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#166534', fontSize: '0.95rem' }}>
                      {((item.priceFcfa || 0) * (item.quantity || 1)).toLocaleString()} FCFA
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Quote Reprint */}
              <div style={{ marginTop: '20px', borderTop: '1px dashed #cbd5e1', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {isEn ? "Official Proforma Document:" : "Devis Proforma Officiel :"}
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={14} />
                  <span>{isEn ? "Print / Save PDF" : "Imprimer / PDF"}</span>
                </button>
              </div>
            </div>

            {/* Financial Summary & Direct Online Payment Card */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '2px solid #bbf7d0',
              padding: '24px',
              boxShadow: '0 4px 14px rgba(22, 101, 52, 0.08)'
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#166534', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} />
                <span>{isEn ? "Payment & Settlement" : "Règlement & Acompte Atelier"}</span>
              </h4>

              {/* Financial Ledger Breakdown */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #bbf7d0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#475569', marginBottom: '8px' }}>
                  <span>{isEn ? "Total Machine Value:" : "Montant Total Devis :"}</span>
                  <strong style={{ color: '#0f172a' }}>{selectedOrder.totalFcfa?.toLocaleString()} FCFA</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#166534', fontWeight: 700, marginBottom: '8px' }}>
                  <span>{isEn ? "Production Launch Deposit (50%):" : "Acompte de Lancement (50%) :"}</span>
                  <span>{depositAmount.toLocaleString()} FCFA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                  <span>{isEn ? "Remaining balance at delivery:" : "Solde restant dû à la livraison :"}</span>
                  <strong>{balanceDue.toLocaleString()} FCFA</strong>
                </div>
              </div>

              {/* Payment Actions if Pending */}
              {selectedOrder.status === 'pending' ? (
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '14px', lineHeight: 1.45 }}>
                    {isEn 
                      ? "To launch the manufacturing in workshop, you can pay either the 50% deposit or the full amount via Mobile Money or Bank Card."
                      : "Pour lancer immédiatement l'usinage en atelier, réglez l'acompte de 50% ou la totalité par MTN MoMo, Moov Money, Wave ou Carte."}
                  </div>

                  {/* Payment Mode Selector */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentChoice('deposit')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '10px',
                        border: paymentChoice === 'deposit' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        background: paymentChoice === 'deposit' ? '#ffffff' : '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        {isEn ? "Option 1 (Recommended)" : "Option 1 (Recommandé)"}
                      </div>
                      <div style={{ fontWeight: 900, color: '#166534', fontSize: '0.92rem', marginTop: '2px' }}>
                        Acompte 50%
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 700 }}>
                        {depositAmount.toLocaleString()} F
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentChoice('full')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '10px',
                        border: paymentChoice === 'full' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        background: paymentChoice === 'full' ? '#ffffff' : '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        {isEn ? "Option 2" : "Option 2"}
                      </div>
                      <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.92rem', marginTop: '2px' }}>
                        Totalité 100%
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 700 }}>
                        {selectedOrder.totalFcfa?.toLocaleString()} F
                      </div>
                    </button>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handlePayOrder(paymentChoice === 'deposit' ? depositAmount : selectedOrder.totalFcfa, paymentChoice)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: '#16a34a',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ffffff'
                    }}
                  >
                    <CreditCard size={18} />
                    <span>
                      {paymentChoice === 'deposit' 
                        ? `${isEn ? "Pay 50% Deposit" : "Payer l'Acompte"} (${depositAmount.toLocaleString()} FCFA)`
                        : `${isEn ? "Pay Full Total" : "Régler la Totalité"} (${selectedOrder.totalFcfa?.toLocaleString()} FCFA)`}
                    </span>
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #86efac',
                  textAlign: 'center'
                }}>
                  <ShieldCheck size={32} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem' }}>
                    {isEn ? "Validation Payment Confirmed" : "Acompte Validé par l'Atelier"}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {isEn 
                      ? "Your machine is registered on the production line. Remaining balance due on delivery." 
                      : "Votre machine est programmée sur la chaîne de production. Le solde sera réglé à la livraison."}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalData !== null}
        onClose={() => setPaymentModalData(null)}
        paymentData={paymentModalData}
        settings={settings}
        lang={lang}
        onConfirmPayment={() => {
          if (showAlert) {
            showAlert(isEn ? "Payment received for verification. Thank you!" : "Paiement reçu pour vérification par l'atelier. Merci !");
          }
        }}
      />
    </div>
  );
}
