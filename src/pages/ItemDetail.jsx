import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  MapPin, 
  Award, 
  Download, 
  BookOpen, 
  GraduationCap, 
  MessageCircle, 
  Share2, 
  Star, 
  CheckCircle2, 
  FileText, 
  Zap, 
  Layers, 
  ChevronRight,
  HelpCircle,
  Truck
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { downloadTrainingProgramPdf } from '../services/pdfWatermarkService';
import PhoneInputWithCountry from '../components/PhoneInputWithCountry';
import { defaultSettings } from '../data/defaultSettings';

export default function ItemDetail({
  detail,
  setCurrentPage,
  addToCart,
  cart = [],
  lang = 'fr',
  showAlert,
  settings = {},
  addOrder,
  onViewDetail,
  allProducts = [],
  allEbooks = []
}) {
  const isEn = lang === 'en';

  if (!detail || !detail.data) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '140px 20px', textAlign: 'center' }}>
        <h2>{isEn ? "Item not found" : "Article non trouvé"}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {isEn ? "The product or service requested is unavailable." : "Le produit ou la formation demandée n'est pas disponible."}
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => setCurrentPage('catalog')}
        >
          {isEn ? "Back to Catalog" : "Retour au Catalogue"}
        </button>
      </div>
    );
  }

  const { type, data: item } = detail;

  // Motor selection for machines
  const [selectedMotor, setSelectedMotor] = useState('Standard');
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specs' | 'faq' | 'delivery'
  const [paymentModalData, setPaymentModalData] = useState(null);

  // Formation enrollment modal
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [enrollStep, setEnrollStep] = useState('form');
  const [learnerName, setLearnerName] = useState('');
  const [learnerPhone, setLearnerPhone] = useState('');
  const [learnerEmail, setLearnerEmail] = useState('');
  const [trainingMode, setTrainingMode] = useState('Présentiel Atelier Cotonou');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mtn');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [formError, setFormError] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [item?.id]);

  const whatsappWorkshop = settings?.whatsappNumber || '22997699178';

  // Calculate machine price with motor
  const basePriceFcfa = item.promoPriceFcfa || item.priceFcfa || 0;
  const motorPriceIncrease = 
    selectedMotor.includes('5.5 kW') ? 150000 :
    selectedMotor.includes('8 CV') ? 250000 :
    selectedMotor.includes('13 CV') ? 300000 : 0;
  
  const currentPriceFcfa = basePriceFcfa + motorPriceIncrease;
  const currentPriceEur = Math.round(currentPriceFcfa / 655.957);

  const isItemInCart = cart.some(ci => 
    ci.id === item.id || 
    ci.id === `${item.id}-${selectedMotor.replace(/\s+/g, '-')}` ||
    ci.id === `ebook-${item.id}`
  );

  const handleAddToCart = () => {
    if (type === 'product') {
      const productWithMotor = {
        ...item,
        id: selectedMotor === 'Standard' ? item.id : `${item.id}-${selectedMotor.replace(/\s+/g, '-')}`,
        name: selectedMotor === 'Standard' ? item.name : `${item.name} (${selectedMotor})`,
        priceFcfa: currentPriceFcfa,
        priceEur: currentPriceEur,
        specs: {
          ...item.specs,
          "Motorisation": selectedMotor
        }
      };
      addToCart(productWithMotor);
      showAlert(isEn ? `"${productWithMotor.name}" added to quote!` : `"${productWithMotor.name}" ajouté à votre devis !`);
    } else if (type === 'ebook') {
      const ebookItem = {
        id: `ebook-${item.id}`,
        name: item.title,
        priceFcfa: item.promoPriceFcfa || item.priceFcfa,
        priceEur: item.promoPriceEur || item.priceEur,
        category: item.isPack ? "Pack E-books" : "E-book & Guide",
        image: item.coverImage,
        isEbook: true,
        downloadUrl: item.downloadUrl,
        pages: item.pages,
        quantity: 1
      };
      addToCart(ebookItem);
      showAlert(isEn ? `"${item.title}" added to quote!` : `"${item.title}" ajouté à votre commande !`);
    }
  };

  const handleDirectBuyEbook = () => {
    const modalData = {
      isEbook: true,
      type: 'ebook',
      ebook: item,
      itemTitle: item.title,
      amountFcfa: item.promoPriceFcfa || item.priceFcfa,
      amountEur: item.promoPriceEur || item.priceEur,
      orderId: `EBK-${Date.now().toString().slice(-6)}`,
      clientInfo: { name: '', email: '', phone: '' }
    };
    setPaymentModalData(modalData);
  };

  const handleConfirmFormationEnrollment = async () => {
    setIsProcessing(true);
    const orderId = `FORM-${Date.now().toString().slice(-6)}`;
    const priceFcfa = item.promoPriceFcfa || item.priceFcfa;
    const priceEur = item.promoPriceEur || item.priceEur;

    const orderData = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      clientName: learnerName.trim(),
      email: learnerEmail.trim() || 'apprenant@bevulta.com',
      phone: learnerPhone.trim(),
      country: 'Bénin',
      company: 'Apprenant Formation',
      address: `Formation BEVULTA (${trainingMode})`,
      notes: `Inscription Formation : ${item.title} [${trainingMode}] - Mode : ${selectedPaymentMethod.toUpperCase()}`,
      status: 'pending',
      subtotalFcfa: priceFcfa,
      totalFcfa: priceFcfa,
      totalEur: priceEur,
      items: [{
        id: `form-${item.id}`,
        name: `[Formation] ${item.title}`,
        quantity: 1,
        priceFcfa,
        priceEur
      }]
    };

    if (addOrder) addOrder(orderData);
    setCompletedOrder(orderData);

    try {
      await downloadTrainingProgramPdf(item, {
        name: learnerName.trim(),
        email: learnerEmail.trim(),
        phone: learnerPhone.trim(),
        orderId,
        mode: trainingMode
      });
    } catch (err) {
      console.error("PDF generation error:", err);
    }

    setIsProcessing(false);
    setEnrollStep('success');
    if (showAlert) {
      showAlert(isEn ? "Enrollment confirmed! Program delivered." : "Inscription validée ! Programme officiel délivré.");
    }
  };

  const getBackTarget = () => {
    if (type === 'ebook') return { id: 'ebooks', label: isEn ? "Back to E-books" : "Retour aux E-books" };
    if (type === 'formation') return { id: 'formations', label: isEn ? "Back to Trainings" : "Retour aux Formations" };
    return { id: 'catalog', label: isEn ? "Back to Machinery Catalog" : "Retour au Catalogue Machines" };
  };

  const backInfo = getBackTarget();

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '110px 20px 80px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Top Breadcrumb & Navigation Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          type="button"
          onClick={() => setCurrentPage(backInfo.id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ArrowLeft size={16} />
          <span>{backInfo.label}</span>
        </button>

        <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>Accueil</span>
          <ChevronRight size={14} />
          <span style={{ cursor: 'pointer' }} onClick={() => setCurrentPage(backInfo.id)}>{backInfo.id.toUpperCase()}</span>
          <ChevronRight size={14} />
          <strong style={{ color: '#0f172a' }}>{item.name || item.title}</strong>
        </div>
      </div>

      {/* Hero 2-Column Product Showcase */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '36px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
        marginBottom: '48px'
      }}>
        {/* Left Column : Image & Workshop Badges */}
        <div>
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            height: '420px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <img 
              src={item.image || item.coverImage} 
              alt={item.name || item.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                backdropFilter: 'blur(6px)',
                padding: '6px 14px',
                borderRadius: '30px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {item.category}
              </span>
              {item.badge && (
                <span style={{
                  background: '#d97706',
                  color: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
                }}>
                  {item.badge}
                </span>
              )}
            </div>

            {/* Verified manufacturing tag */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '10px 14px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#166534',
              fontWeight: 700
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} />
                <span>Fabrication Certifiée BEVULTA Atelier</span>
              </span>
              <span style={{ color: '#d97706' }}>Cotonou, Bénin</span>
            </div>
          </div>

          {/* Quick reassurance strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '16px'
          }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', textAlign: 'center' }}>
              <Wrench size={18} color="#15803d" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Garantie 1 An</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Pièces & Main d'œuvre</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', textAlign: 'center' }}>
              <Truck size={18} color="#d97706" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Livraison UEMOA</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Bénin, Togo, CI, BF, Niger</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', textAlign: 'center' }}>
              <Zap size={18} color="#2563eb" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>SAV & Pièces</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Disponibles en continu</div>
            </div>
          </div>
        </div>

        {/* Right Column : Title, Pricing, Config & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>5.0</span>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>· Matériel Professionnel Testé</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', 
            fontWeight: 800, 
            color: '#0f172a', 
            marginBottom: '10px',
            lineHeight: 1.2
          }}>
            {item.name || item.title}
          </h1>

          {item.subtitle && (
            <p style={{ fontSize: '0.98rem', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              {item.subtitle}
            </p>
          )}

          {/* Availability & Workshop Lead Time Badge (For Products) */}
          {type === 'product' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 700,
              marginBottom: '16px',
              backgroundColor: (item.availability && item.availability.toLowerCase().includes('en stock')) 
                ? 'rgba(22, 101, 52, 0.08)' 
                : 'rgba(217, 119, 6, 0.08)',
              color: (item.availability && item.availability.toLowerCase().includes('en stock'))
                ? '#166534'
                : '#b45309',
              border: `1px solid ${(item.availability && item.availability.toLowerCase().includes('en stock')) ? 'rgba(22, 101, 52, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`
            }}>
              <span style={{ fontSize: '0.95rem' }}>
                {(item.availability && item.availability.toLowerCase().includes('en stock')) ? '🟢' : '🟠'}
              </span>
              <span>
                {item.availability 
                  ? (item.availability.toLowerCase().includes('en stock') 
                      ? (isEn ? "In stock at workshop — Dispatched in 48h" : "En stock à l'atelier — Expédition sous 48h") 
                      : (isEn ? `Manufacturing on demand — ${item.availability}` : `Fabrication sur commande — ${item.availability}`))
                  : (isEn ? "Workshop lead time: 7 to 15 business days" : "Délai atelier : 7 à 15 jours ouvrés")}
              </span>
            </div>
          )}

          {/* Pricing Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
            border: '1px solid rgba(22, 101, 52, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              {type === 'product' && "Prix unitaire atelier (départ usine) :"}
              {type === 'ebook' && "Prix du guide numérique sécurisé :"}
              {type === 'formation' && "Frais d'inscription & Pédagogie complète :"}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#166534', fontFamily: 'var(--font-heading)' }}>
                {currentPriceFcfa.toLocaleString()} FCFA
              </span>
              <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>
                (≈ {currentPriceEur.toLocaleString()} €)
              </span>
              {item.promoPriceFcfa && selectedMotor === 'Standard' && (
                <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {item.priceFcfa?.toLocaleString()} FCFA
                </span>
              )}
            </div>

            {type === 'product' && (
              <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600, marginTop: '8px' }}>
                ✓ Possibilité de lancer la fabrication avec un acompte atelier de 50% ({Math.round(currentPriceFcfa * 0.5).toLocaleString()} FCFA).
              </div>
            )}
          </div>

          {/* Machine Motor Options Dropdown */}
          {type === 'product' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                ⚙️ Choisissez la Motorisation Adaptée à votre Activité :
              </label>
              <select
                value={selectedMotor}
                onChange={(e) => setSelectedMotor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '2px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <option value="Standard">Option 1 : Moteur Standard Électrique Monophasé 220V (Inclus)</option>
                <option value="Électrique Triphasé 5.5 kW (+150 000 FCFA)">Option 2 : Moteur Triphasé Industriel 380V - 5.5 kW (+150 000 FCFA)</option>
                <option value="Thermique Diesel 8 CV Sifang (+250 000 FCFA)">Option 3 : Moteur Diesel Robuste Sifang 8 CV Refroidi par Eau (+250 000 FCFA)</option>
                <option value="Thermique Essence 13 CV (+300 000 FCFA)">Option 4 : Moteur Essence 13 CV Puissant (+300 000 FCFA)</option>
              </select>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
                Le prix et la puissance s'ajustent automatiquement selon votre sélection.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
            
            {type === 'product' && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  style={{
                    flex: '1 1 240px',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isItemInCart ? '#0f172a' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  {isItemInCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                  <span>{isItemInCart ? (isEn ? "In Your Quote (Cart)" : "Déjà dans votre Devis") : (isEn ? "Add to Quote" : "Ajouter au Devis & Commander")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    setCurrentPage('order');
                  }}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: '1px solid #16a34a',
                    background: '#f0fdf4',
                    color: '#166534',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isEn ? "View Cart" : "Voir le Panier"}
                </button>
              </div>
            )}

            {type === 'ebook' && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDirectBuyEbook}
                  style={{
                    flex: '1 1 240px',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <Download size={18} />
                  <span>{isEn ? "Buy & Download PDF" : "Acheter & Télécharger (Mobile Money)"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {isEn ? "Add to Cart" : "Ajouter au Devis"}
                </button>
              </div>
            )}

            {type === 'formation' && (
              <button
                type="button"
                onClick={() => {
                  setShowFormationModal(true);
                  setEnrollStep('form');
                }}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                }}
              >
                <GraduationCap size={20} />
                <span>{isEn ? "Enroll & Get Official Syllabus (PDF)" : "S'inscrire & Obtenir le Programme Officiel (PDF)"}</span>
              </button>
            )}

            {/* Direct WhatsApp Consultation button */}
            <a
              href={`https://wa.me/${whatsappWorkshop}?text=${encodeURIComponent(
                `Bonjour Atelier BEVULTA, je m'intéresse à : "${item.name || item.title}" (Réf: ${item.id}). Pouvez-vous me donner plus de détails techniques et les modalités ? Merci.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
            >
              <MessageCircle size={18} color="#25D366" />
              <span>{isEn ? "Discuss with an Engineer on WhatsApp" : "Échanger avec un ingénieur d'atelier sur WhatsApp"}</span>
            </a>

          </div>

        </div>
      </div>

      {/* LOWER COMPREHENSIVE TABS & SPECIFICATIONS */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '36px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        marginBottom: '48px'
      }}>
        {/* Navigation Tabs Header */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'description' ? '#166534' : 'transparent',
              color: activeTab === 'description' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            {isEn ? "Full Description & Performance" : "Description & Avantages"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'specs' ? '#166534' : 'transparent',
              color: activeTab === 'specs' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            {type === 'product' && (isEn ? "Technical Specifications" : "Fiche Technique Complète")}
            {type === 'ebook' && (isEn ? "Table of Contents & Bonuses" : "Sommaire & Table des Matières")}
            {type === 'formation' && (isEn ? "Syllabus & Daily Schedule" : "Programme des 4 Modules & Calendrier")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('delivery')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'delivery' ? '#166534' : 'transparent',
              color: activeTab === 'delivery' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            {isEn ? "Warranty, SAV & Delivery" : "Garantie, SAV & Expédition"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'faq' ? '#166534' : 'transparent',
              color: activeTab === 'faq' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            {isEn ? "FAQ & Advice" : "Questions Fréquentes"}
          </button>
        </div>

        {/* TAB 1 : DESCRIPTION */}
        {activeTab === 'description' && (
          <div style={{ lineHeight: 1.7, color: '#334155', fontSize: '0.95rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
              Présentation détaillée
            </h3>
            <p style={{ marginBottom: '20px' }}>
              {item.description}
            </p>

            {type === 'formation' && item.targetAudience && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <strong style={{ color: '#0f172a' }}>Public cible & Débouchés :</strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>{item.targetAudience}</p>
                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#166534' }}>
                  <strong>Prérequis :</strong> {item.prerequisites || 'Aucun'}
                </div>
              </div>
            )}

            {type === 'ebook' && item.includedBooks && item.includedBooks.length > 0 && (
              <div style={{ background: '#fef3c7', padding: '18px', borderRadius: '12px', border: '1px solid #fde68a', marginBottom: '20px' }}>
                <div style={{ fontWeight: 800, color: '#b45309', marginBottom: '8px' }}>📚 Livres et Guides inclus dans ce pack :</div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#78350f' }}>
                  {item.includedBooks.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 : SPECS / MODULES / SOMMAIRE */}
        {activeTab === 'specs' && (
          <div>
            {type === 'product' && item.specs && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  Caractéristiques techniques d'usine
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {Object.entries(item.specs).map(([key, val]) => (
                    <div key={key} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>{key}</span>
                      <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{val}</strong>
                    </div>
                  ))}
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Châssis & Matériaux</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>Inox 304 Alimentaire / Acier Renforcé</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Lieu de Fabrication</span>
                    <strong style={{ color: '#166534', fontSize: '0.9rem' }}>Atelier BEVULTA, Cotonou</strong>
                  </div>
                </div>
              </div>
            )}

            {type === 'formation' && item.modules && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  Syllabus officiel des 4 modules pratiques
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {item.modules.map(mod => (
                    <div key={mod.number} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem' }}>
                          Module {mod.number} : {mod.title}
                        </div>
                        <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                          {mod.duration}
                        </span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                        {mod.points.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'ebook' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                  Détails du document & Contenu
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Volume :</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.pages || 'Manuel complet'}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Format de fichier :</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.fileFormat || 'PDF HD Téléchargeable'}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Langue :</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.language || 'Français'}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Auteur :</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.author || "Bureau d'Études BEVULTA"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3 : WARRANTY & SAV & DELIVERY */}
        {activeTab === 'delivery' && (
          <div style={{ lineHeight: 1.7, color: '#334155' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
              Modalités de Garantie, SAV & Expédition
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ color: '#166534', fontWeight: 800, margin: '0 0 8px' }}>🛡️ Garantie Constructeur 1 An</h4>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>
                  Tous nos équipements industriels bénéficient d'une garantie totale pièces et main d'œuvre de 12 mois. En cas de défaillance, notre atelier assure la réparation ou le remplacement rapide des organes défectueux.
                </p>
              </div>

              <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <h4 style={{ color: '#1d4ed8', fontWeight: 800, margin: '0 0 8px' }}>🚚 Expédition & Délais de Livraison</h4>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>
                  Fabrication sous 10 à 25 jours selon les options de motorisation. Expédition sécurisée par transporteur vers Lomé, Abidjan, Ouagadougou, Niamey et toutes les villes du Bénin avec suivi d'acheminement en direct sur notre site.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4 : FAQ */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Questions fréquemment posées
            </h3>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                Comment se déroule le paiement de l'acompte 50% ?
              </strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                Vous réglez 50% au lancement de la fabrication à l'atelier (par Mobile Money ou virement). Vous suivez l'usinage en direct sur le site avec votre numéro de devis. Les 50% restants sont réglés à la mise à disposition ou à la livraison de la machine.
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                Assurez-vous la formation des ouvriers sur site ?
              </strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                Oui, nos techniciens se déplacent pour l'installation, le calage moteur, les essais à vide et en charge, ainsi que la formation pratique de vos opérateurs à la maintenance de 1er niveau.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* SUGGESTED RELATED PRODUCTS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {isEn ? "Recommended Complementary Equipment" : "Équipements complémentaires recommandés"}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Optimisez votre chaîne de production avec des machines adaptées
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setCurrentPage('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isEn ? "View all catalog" : "Voir tout le catalogue"}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {allProducts.filter(p => p.id !== item.id).slice(0, 3).map(prod => (
            <div 
              key={prod.id}
              onClick={() => onViewDetail && onViewDetail(prod, 'product')}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ height: '160px', overflow: 'hidden' }}>
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {prod.subcategory || prod.category}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {prod.name}
                </h4>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534' }}>
                  {(prod.promoPriceFcfa || prod.priceFcfa).toLocaleString()} FCFA
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORMATION ENROLLMENT MODAL */}
      {showFormationModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <button 
              onClick={() => setShowFormationModal(false)}
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
              ×
            </button>

            {enrollStep === 'form' && (
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
                  <GraduationCap size={14} />
                  <span>Dossier d'Admission · Étape 1/2</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Inscription à la Formation
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
                  {item.title}
                </p>

                {formError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {formError}
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Nom & Prénom de l'apprenant *
                  </label>
                  <input 
                    type="text"
                    placeholder="Ex: Jean Kouassi"
                    value={learnerName}
                    onChange={(e) => setLearnerName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Numéro WhatsApp de contact (pour accès au groupe & suivi) *
                  </label>
                  <PhoneInputWithCountry 
                    value={learnerPhone}
                    onChange={(val) => setLearnerPhone(val)}
                    placeholder="Numéro WhatsApp de l'apprenant"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Adresse Email (pour envoi du programme & convocation)
                  </label>
                  <input 
                    type="email"
                    placeholder="Ex: jean.kouassi@email.com"
                    value={learnerEmail}
                    onChange={(e) => setLearnerEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Modalité de formation souhaitée
                  </label>
                  <select
                    value={trainingMode}
                    onChange={(e) => setTrainingMode(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.88rem' }}
                  >
                    <option value="Présentiel Atelier Cotonou">Présentiel à l'Atelier Central BEVULTA (Cotonou, Bénin)</option>
                    <option value="Mixte / Suivi à Distance">Mixte / Suivi à Distance (Supports vidéos + Coaching formateur)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!learnerName.trim()) {
                      setFormError("Veuillez entrer votre nom et prénom.");
                      return;
                    }
                    if (!learnerPhone.trim() || learnerPhone.trim().length < 6) {
                      setFormError("Veuillez entrer votre numéro WhatsApp.");
                      return;
                    }
                    setFormError('');
                    setEnrollStep('payment');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Continuer vers le règlement
                </button>
              </div>
            )}

            {enrollStep === 'payment' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  Règlement Mobile Money
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                  Total à régler : <strong style={{ color: '#166534', fontSize: '1.1rem' }}>{(item.promoPriceFcfa || item.priceFcfa).toLocaleString()} FCFA</strong>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                  {((Array.isArray(settings?.customPaymentGateways) && settings.customPaymentGateways.length > 0
                    ? settings.customPaymentGateways
                    : defaultSettings.customPaymentGateways || []
                  ).filter(g => g.isActive !== false)).map(gw => (
                    <div
                      key={gw.id}
                      onClick={() => setSelectedPaymentMethod(gw.name || gw.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: selectedPaymentMethod === (gw.name || gw.id) ? '2px solid #166534' : '1px solid #e2e8f0',
                        background: selectedPaymentMethod === (gw.name || gw.id) ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      <div>{gw.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                        {gw.type === 'link' ? '🔗 Lien direct' : gw.type === 'api' ? '⚡ Guichet direct' : '📱 Transfert Manuel'}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEnrollStep('form')}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmFormationEnrollment}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: isProcessing ? 'wait' : 'pointer'
                    }}
                  >
                    {isProcessing ? "Génération du programme..." : "Payer & Télécharger le Programme"}
                  </button>
                </div>
              </div>
            )}

            {enrollStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Félicitations {learnerName} !
                </h3>
                <p style={{ color: '#166534', fontWeight: 700, marginBottom: '20px' }}>
                  Votre inscription est confirmée et le programme officiel vous a été délivré.
                </p>
                <button
                  type="button"
                  onClick={() => downloadTrainingProgramPdf(item, {
                    name: learnerName,
                    email: learnerEmail,
                    phone: learnerPhone,
                    orderId: completedOrder?.id,
                    mode: trainingMode
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #16a34a',
                    background: '#ffffff',
                    color: '#166534',
                    fontWeight: 700,
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Re-télécharger le Programme (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormationModal(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* E-BOOK PAYMENT MODAL */}
      <PaymentModal
        isOpen={paymentModalData !== null}
        onClose={() => setPaymentModalData(null)}
        paymentData={paymentModalData}
        settings={settings}
        lang={lang}
        onConfirmPayment={(buyerData) => {
          if (addOrder && paymentModalData) {
            const ebookOrder = {
              id: paymentModalData.orderId || `EBK-${Date.now().toString().slice(-6)}`,
              date: new Date().toISOString().split('T')[0],
              clientName: buyerData?.buyerName || 'Client E-book',
              email: buyerData?.buyerEmail || '',
              phone: buyerData?.buyerPhone || '',
              country: 'Bénin',
              company: 'Particulier',
              address: 'Achat direct E-book (Mobile Money)',
              notes: `Achat direct E-book : ${paymentModalData.itemTitle} via ${buyerData?.method || 'Mobile Money'}`,
              status: 'pending',
              subtotalFcfa: paymentModalData.amountFcfa || 0,
              totalFcfa: paymentModalData.amountFcfa || 0,
              totalEur: paymentModalData.amountEur || 0,
              items: [{
                id: `ebook-${item.id}`,
                name: `[E-book] ${paymentModalData.itemTitle}`,
                quantity: 1,
                priceFcfa: paymentModalData.amountFcfa || 0,
                priceEur: paymentModalData.amountEur || 0
              }]
            };
            addOrder(ebookOrder);
          }
          showAlert(isEn ? "Payment received! Thank you!" : "Paiement en cours de vérification. Merci !");
        }}
      />

    </div>
  );
}

