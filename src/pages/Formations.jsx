import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Download, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  X, 
  Search, 
  MessageCircle, 
  FileText, 
  Sparkles,
  Phone,
  Mail,
  CreditCard,
  Check
} from 'lucide-react';
import { initialFormations, FORMATION_CATEGORIES } from '../data/initialFormations';
import { downloadTrainingProgramPdf } from '../services/pdfWatermarkService';
import PhoneInputWithCountry from '../components/PhoneInputWithCountry';

export default function Formations({ 
  lang = 'fr', 
  showAlert, 
  settings = {}, 
  addOrder 
}) {
  const isEn = lang === 'en';
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormation, setSelectedFormation] = useState(null); // For detailed syllabus view
  const [enrollModalFormation, setEnrollModalFormation] = useState(null); // For checkout / payment

  // Enrollment Form State
  const [enrollStep, setEnrollStep] = useState('form'); // 'form' | 'payment' | 'success'
  const [learnerName, setLearnerName] = useState('');
  const [learnerPhone, setLearnerPhone] = useState('');
  const [learnerEmail, setLearnerEmail] = useState('');
  const [trainingMode, setTrainingMode] = useState('Présentiel Atelier Cotonou');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mtn');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [formError, setFormError] = useState('');

  const whatsappWorkshop = settings?.whatsappNumber || '22997699178';

  // Filter formations
  const filteredFormations = initialFormations.filter(f => {
    const matchCat = selectedCategory === "Tous" || f.category === selectedCategory;
    const matchQuery = searchQuery === "" || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleOpenEnroll = (formation, e) => {
    if (e) e.stopPropagation();
    setEnrollModalFormation(formation);
    setEnrollStep('form');
    setFormError('');
    setSelectedFormation(null);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!learnerName.trim()) {
      setFormError(isEn ? "Please enter your full name." : "Veuillez entrer votre nom et prénom.");
      return;
    }
    if (!learnerPhone.trim() || learnerPhone.trim().length < 6) {
      setFormError(isEn ? "Please enter your WhatsApp / mobile number." : "Veuillez entrer un numéro de téléphone / WhatsApp valide.");
      return;
    }
    setFormError('');
    setEnrollStep('payment');
  };

  const handleConfirmEnrollment = async () => {
    if (!enrollModalFormation) return;
    setIsProcessing(true);

    const priceFcfa = enrollModalFormation.promoPriceFcfa || enrollModalFormation.priceFcfa;
    const priceEur = enrollModalFormation.promoPriceEur || enrollModalFormation.priceEur;
    const orderId = `FORM-${Date.now().toString().slice(-6)}`;

    const orderData = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      clientName: learnerName.trim(),
      email: learnerEmail.trim() || 'apprenant@bevulta.com',
      phone: learnerPhone.trim(),
      country: 'Bénin',
      company: 'Apprenant Formation',
      address: `Formation BEVULTA (${trainingMode})`,
      notes: `Inscription Formation : ${enrollModalFormation.title} [${trainingMode}] - Mode de paiement : ${selectedPaymentMethod.toUpperCase()}`,
      status: 'pending',
      subtotalFcfa: priceFcfa,
      totalFcfa: priceFcfa,
      totalEur: priceEur,
      items: [{
        id: `form-${enrollModalFormation.id}`,
        name: `[Formation] ${enrollModalFormation.title}`,
        quantity: 1,
        priceFcfa: priceFcfa,
        priceEur: priceEur
      }]
    };

    // 1. Enregistrer dans le Dashboard Admin (Supabase + localStorage)
    if (addOrder) {
      addOrder(orderData);
    }

    setCompletedOrder(orderData);

    // 2. Déclencher automatiquement le téléchargement du programme officiel PDF
    try {
      await downloadTrainingProgramPdf(enrollModalFormation, {
        name: learnerName.trim(),
        email: learnerEmail.trim(),
        phone: learnerPhone.trim(),
        orderId,
        mode: trainingMode
      });
    } catch (err) {
      console.error("Failed to generate training PDF:", err);
    }

    setIsProcessing(false);
    setEnrollStep('success');

    if (showAlert) {
      showAlert(isEn 
        ? "Enrollment confirmed! Your official training program has been delivered." 
        : "Inscription validée ! Votre programme de formation officiel vous a été délivré."
      );
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '110px 20px 80px', animation: 'fadeIn 0.4s ease' }}>
      
      {/* Hero Header */}
      <div 
        className="glass-panel" 
        style={{
          borderRadius: 'var(--radius-lg, 20px)',
          padding: '48px 36px',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.08) 0%, rgba(217, 119, 6, 0.06) 50%, rgba(255, 255, 255, 0.95) 100%)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          boxShadow: '0 20px 40px -15px rgba(20, 83, 45, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 14px', 
            borderRadius: '30px', 
            background: 'rgba(20, 83, 45, 0.1)', 
            color: '#15803d', 
            fontSize: '0.82rem', 
            fontWeight: 700, 
            letterSpacing: '0.06em', 
            marginBottom: '16px' 
          }}>
            <GraduationCap size={16} />
            <span>{isEn ? "BEVULTA INDUSTRIAL ACADEMY" : "PÔLE FORMATION PROFESSIONNELLE & TECHNIQUE"}</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(1.9rem, 4vw, 2.7rem)', 
            color: 'var(--secondary, #0f172a)', 
            marginBottom: '16px', 
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.2
          }}>
            {isEn ? "Master African Industrial Transformation & Mechanics" : "Maîtrisez la Transformation Agro-Industrielle & la Mécanique"}
          </h1>

          <p style={{ 
            fontSize: '1.05rem', 
            color: 'var(--text-secondary, #475569)', 
            lineHeight: 1.6, 
            marginBottom: '28px' 
          }}>
            {isEn 
              ? "Hands-on, machine-intensive training courses designed for entrepreneurs, technicians, and cooperative managers. Pay securely online via Mobile Money and get your official syllabus & enrollment package delivered instantly."
              : "Formations 100% pratiques sur machines réelles en atelier. Conçues pour porteurs de projets, techniciens et coopératives. Réglez en ligne par Mobile Money et recevez immédiatement votre programme officiel avec convocation certifiée."}
          </p>

          {/* Quick Value Props */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <Award size={16} color="#15803d" />
              <span style={{ fontWeight: 600 }}>{isEn ? "Certified BEVULTA Attestation" : "Attestation Certifiée BEVULTA"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <Download size={16} color="#d97706" />
              <span style={{ fontWeight: 600 }}>{isEn ? "Instant Program Syllabus Delivery" : "Programme Officiel Délivré Immédiatement"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <Users size={16} color="#2563eb" />
              <span style={{ fontWeight: 600 }}>{isEn ? "Direct Workshop Trainer Access" : "Accès Direct Formateurs & Atelier"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {FORMATION_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                border: selectedCategory === cat ? '1px solid #166534' : '1px solid #e2e8f0',
                background: selectedCategory === cat ? '#166534' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder={isEn ? "Search a training..." : "Rechercher une formation..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Formations Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '28px',
        marginBottom: '60px' 
      }}>
        {filteredFormations.map(formation => {
          const effectivePriceFcfa = formation.promoPriceFcfa || formation.priceFcfa;
          const effectivePriceEur = formation.promoPriceEur || formation.priceEur;

          return (
            <div 
              key={formation.id}
              className="glass-card"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {/* Cover Image & Badges */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img 
                  src={formation.coverImage} 
                  alt={formation.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}>
                  {formation.category}
                </div>
                {formation.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#d97706',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
                  }}>
                    {formation.badge}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                  {formation.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                  {formation.subtitle}
                </p>

                {/* Practical Details Pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', fontSize: '0.82rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={15} color="#15803d" />
                    <span><strong>Durée :</strong> {formation.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="#d97706" />
                    <span><strong>Lieu :</strong> {formation.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="#2563eb" />
                    <span><strong>Session :</strong> {formation.nextSession}</span>
                  </div>
                </div>

                {/* Program Modules Summary */}
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  border: '1px solid #edf2f7',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    📚 Programme en 4 modules :
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#334155', lineHeight: 1.5 }}>
                    {formation.modules.slice(0, 3).map(m => (
                      <li key={m.number}><strong>Mod. {m.number}:</strong> {m.title}</li>
                    ))}
                    <li style={{ color: '#166534', fontWeight: 600 }}>+ Module 4 & Travaux Pratiques</li>
                  </ul>
                </div>

                {/* Pricing & CTA */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <div>
                      {formation.promoPriceFcfa ? (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>
                            {effectivePriceFcfa.toLocaleString()} FCFA
                          </span>
                          <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            {formation.priceFcfa.toLocaleString()} FCFA
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>
                          {effectivePriceFcfa.toLocaleString()} FCFA
                        </span>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Env. {effectivePriceEur} € · Matériel & Attestation inclus
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedFormation(formation)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {isEn ? "View Syllabus" : "Voir Programme"}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleOpenEnroll(formation, e)}
                      style={{
                        flex: 2,
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                      }}
                    >
                      <GraduationCap size={16} />
                      <span>{isEn ? "Enroll & Get Syllabus" : "S'inscrire & Payer"}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL : FULL SYLLABUS */}
      {selectedFormation && (
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
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <button 
              onClick={() => setSelectedFormation(null)}
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
              <X size={20} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
              <Award size={14} />
              <span>{selectedFormation.category} · {selectedFormation.badge}</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
              {selectedFormation.title}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
              {selectedFormation.subtitle}
            </p>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', fontSize: '0.88rem', lineHeight: 1.6, color: '#334155' }}>
              <p style={{ margin: 0 }}>{selectedFormation.description}</p>
            </div>

            {/* Modules detail */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              📖 Programme Pédagogique Détaillé :
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              {selectedFormation.modules.map(mod => (
                <div key={mod.number} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem' }}>
                      Module {mod.number} : {mod.title}
                    </div>
                    <span style={{ fontSize: '0.78rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
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

            {/* Included Perks */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              ✅ Tout ce qui est inclus dans votre inscription :
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '32px' }}>
              {selectedFormation.included.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#15803d', background: '#f0fdf4', padding: '10px 12px', borderRadius: '8px' }}>
                  <Check size={16} color="#16a34a" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Modal Bottom CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <div>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#166534' }}>
                  {(selectedFormation.promoPriceFcfa || selectedFormation.priceFcfa).toLocaleString()} FCFA
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '6px' }}>
                  ({selectedFormation.duration})
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEnroll(selectedFormation)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                }}
              >
                <GraduationCap size={18} />
                <span>{isEn ? "Proceed to Enrollment" : "Valider mon inscription"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLLMENT & PAYMENT MODAL */}
      {enrollModalFormation && (
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
              onClick={() => {
                setEnrollModalFormation(null);
                setEnrollStep('form');
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
              <X size={20} />
            </button>

            {/* STEP 1: PARTICIPANT FORM */}
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
                  {enrollModalFormation.title}
                </p>

                {formError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleProceedToPayment}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Nom & Prénom de l'apprenant *
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Jean Kouassi"
                      value={learnerName}
                      onChange={(e) => setLearnerName(e.target.value)}
                      required
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
                      className="form-input"
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
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Continuer vers le règlement</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD & FINAL CONFIRMATION */}
            {enrollStep === 'payment' && (
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
                  <CreditCard size={14} />
                  <span>Règlement des Frais de Formation · Étape 2/2</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  Paiement & Obtention Immédiate du Programme
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                  Dès confirmation, votre **programme complet avec convocation officielle** sera généré et téléchargé automatiquement.
                </p>

                {/* Amount to pay */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total à régler :</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534' }}>
                      {(enrollModalFormation.promoPriceFcfa || enrollModalFormation.priceFcfa).toLocaleString()} FCFA
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#475569' }}>
                    <div>Apprenant : <strong>{learnerName}</strong></div>
                    <div>WhatsApp : <strong>{learnerPhone}</strong></div>
                  </div>
                </div>

                {/* Mobile Money Options */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Sélectionnez votre moyen de paiement Mobile Money :
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'mtn', name: 'MTN Mobile Money', color: '#f59e0b', sub: '(Bénin, Côte d\'Ivoire, Togo)' },
                      { id: 'moov', name: 'Moov Africa Money', color: '#0284c7', sub: '(Bénin, Togo, CI, Burkina)' },
                      { id: 'wave', name: 'Wave Money', color: '#06b6d4', sub: '(Sénégal, CI)' },
                      { id: 'orange', name: 'Orange Money', color: '#ea580c', sub: '(Mali, Guinée, BF, CI)' }
                    ].map(method => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: selectedPaymentMethod === method.id ? '2px solid #166534' : '1px solid #e2e8f0',
                          background: selectedPaymentMethod === method.id ? '#f0fdf4' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{method.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{method.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions Box */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px', marginBottom: '24px', fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                  ⚡ <strong>Délivrance Immédiate :</strong> Dès validation, le programme complet officiel (PDF Haute Définition avec calendrier et consignes) est téléchargé sur votre appareil, et notre atelier est notifié pour votre accueil.
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEnrollStep('form')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Retour
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmEnrollment}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: isProcessing ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    {isProcessing ? (
                      <span>Génération du programme...</span>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Payer & Obtenir le Programme</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS & IMMEDIATE PROGRAM DELIVERY */}
            {enrollStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
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

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Félicitations {learnerName} !
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>
                  Votre inscription est validée & le programme officiel vous a été délivré.
                </p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
                  Dossier N° <strong>{completedOrder?.id}</strong> · Formation : <strong>{enrollModalFormation.title}</strong>
                </p>

                {/* Delivery confirmation badge */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>
                    <Download size={16} />
                    <span>Téléchargement automatique en cours</span>
                  </div>
                  <p style={{ color: '#475569', margin: '0 0 12px', lineHeight: 1.5 }}>
                    Si le téléchargement du programme ne s'est pas lancé automatiquement, cliquez sur le bouton ci-dessous pour l'enregistrer :
                  </p>
                  <button
                    type="button"
                    onClick={() => downloadTrainingProgramPdf(enrollModalFormation, {
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
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={15} />
                    <span>Re-télécharger le Programme & Convocation (PDF)</span>
                  </button>
                </div>

                {/* Direct WhatsApp Trainer link */}
                <a
                  href={`https://wa.me/${whatsappWorkshop}?text=${encodeURIComponent(
                    `Bonjour BEVULTA, je viens d'effectuer le règlement pour mon inscription à la "${enrollModalFormation.title}" au nom de ${learnerName} (Dossier N° ${completedOrder?.id}, Tél: ${learnerPhone}). J'ai bien reçu le programme officiel. Pouvez-vous m'ajouter au groupe de la promotion ? Merci !`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#25D366',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Rejoindre le Formateur sur WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setEnrollModalFormation(null);
                    setEnrollStep('form');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

