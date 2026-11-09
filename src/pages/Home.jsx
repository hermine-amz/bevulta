import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  GraduationCap, 
  Microscope, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Music, 
  Play, 
  Pause, 
  Handshake, 
  Settings,
  BookOpen,
  Layers,
  Percent,
  Download,
  ShoppingCart
} from 'lucide-react';
import { t } from '../data/translations';
import { defaultSettings } from '../data/defaultSettings';

export default function Home({ 
  setCurrentPage, 
  lang, 
  products, 
  setSelectedProduct, 
  ebooks = [], 
  addToCart, 
  showAlert, 
  settings = defaultSettings,
  onViewDetail
}) {
  const activeSettings = { ...defaultSettings, ...(settings || {}) };
  const [selectedCountry, setSelectedCountry] = useState('benin');
  const isEn = lang === 'en';
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [
    activeSettings.heroImage1 || '/hero-machines.png',
    activeSettings.heroImage2 || '/hero-machines-2.png',
    activeSettings.heroImage3 || '/hero-machines-3.png'
  ];

  // Audio Synthesizer States (Web Audio API)
  const [playingTrack, setPlayingTrack] = useState(null);
  const [audioCtx, setAudioCtx] = useState(null);
  const [synthInterval, setSynthInterval] = useState(null);

  const startSynth = (trackName) => {
    stopSynth();

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    setAudioCtx(ctx);

    let step = 0;
    const tempo = 130; // BPM
    const stepDuration = 60 / tempo / 2; // 8th note

    // Pentatonic scale in G major (pleasant marimba / kalimba feel)
    const scale = [196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88]; // G3, A3, B3, D4, E4, G4, A4, B4

    const playStep = () => {
      if (!ctx || ctx.state === 'closed') return;
      const t = ctx.currentTime;

      // Soft bass / kick beat
      if (step % 4 === 0) {
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.connect(bassGain);
        bassGain.connect(ctx.destination);
        bass.frequency.setValueAtTime(80, t);
        bass.frequency.exponentialRampToValueAtTime(0.01, t + 0.25);
        bassGain.gain.setValueAtTime(0.4, t);
        bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        bass.start(t);
        bass.stop(t + 0.25);
      }

      // Marimba notes scheduler
      if (step % 2 === 0 || Math.random() > 0.5) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const freq = scale[Math.floor(Math.random() * scale.length)];
        osc.frequency.setValueAtTime(freq, t);
        
        // Kalimba/Marimba metallic pluck envelope
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        // Mix triangle and sine feel
        osc.type = 'triangle';
        osc.start(t);
        osc.stop(t + 0.4);
      }

      step = (step + 1) % 8;
    };

    playStep();
    const intervalId = setInterval(playStep, stepDuration * 1000);
    setSynthInterval(intervalId);
  };

  const stopSynth = () => {
    if (synthInterval) {
      clearInterval(synthInterval);
      setSynthInterval(null);
    }
    if (audioCtx) {
      audioCtx.close();
      setAudioCtx(null);
    }
  };

  const handleTrackClick = (track) => {
    if (playingTrack === track) {
      stopSynth();
      setPlayingTrack(null);
    } else {
      setPlayingTrack(track);
      startSynth(track);
    }
  };

  // Stop sound and slide timer if leaving page
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);

    return () => {
      stopSynth();
      clearInterval(slideTimer);
    };
  }, []);

  const countryInfo = lang === 'fr' ? {
    benin: {
      name: 'Bénin (Siège)',
      description: 'Le cœur historique de BEVULTA. Notre usine de fabrication principale et nos bureaux d\'études sont situés à Cotonou (Agla Von Fan-Milk / Houéyiho).',
      status: 'Livraison immédiate ou fabrication sous 15-30 jours. Support local et SAV direct.',
      stats: '1200+ machines installées'
    },
    togo: {
      name: 'Togo (Expansion)',
      description: 'Notre premier point de relais régional. Nous y fournissons des équipements de transformation de karité et de manioc aux coopératives agricoles.',
      status: 'Livraison sous 10 jours (depuis Cotonou) ou service de retrait à Lomé.',
      stats: '250+ machines installées'
    },
    burkina: {
      name: 'Burkina Faso (Secteur Agricole)',
      description: 'Forte demande pour nos complexes de karité et décortiqueuses d\'arachide. Nos techniciens interviennent régulièrement pour les installations.',
      status: 'Livraison sous 10-12 jours. Garantie de service après-vente complète.',
      stats: '180+ machines installées'
    },
    niger: {
      name: 'Niger (Secteur Agro-pastoral)',
      description: 'Nous fournissons d\'importants broyeurs-mélangeurs de provende pour l\'alimentation du bétail dans les zones pastorales.',
      status: 'Livraison sécurisée sous 12 jours. Assistance technique sur site.',
      stats: '110+ machines installées'
    },
    cotedivoire: {
      name: 'Côte d\'Ivoire (Nouveau Marché)',
      description: 'Expansion en cours avec des partenariats pour la transformation locale du café, du cacao et des jus de fruits.',
      status: 'Livraison sous 10 jours. Partenaires de maintenance agréés à Abidjan.',
      stats: 'Phase de déploiement actif'
    }
  } : {
    benin: {
      name: 'Benin (HQ)',
      description: 'The historical heart of BEVULTA. Our main manufacturing factory and engineering offices are located in Cotonou (Agla Von Fan-Milk / Houéyiho).',
      status: 'Immediate delivery or manufacturing in 15-30 days. Local support and direct after-sales service.',
      stats: '1200+ machines installed'
    },
    togo: {
      name: 'Togo (Expansion)',
      description: 'Our first regional relay point. We supply shea butter and cassava processing equipment to agricultural cooperatives.',
      status: 'Delivery within 10 days (from Cotonou) or pick-up service in Lomé.',
      stats: '250+ machines installed'
    },
    burkina: {
      name: 'Burkina Faso (Agricultural Sector)',
      description: 'High demand for our shea butter complexes and peanut shellers. Our technicians regularly intervene for installations.',
      status: 'Delivery within 10-12 days. Full after-sales service warranty.',
      stats: '180+ machines installed'
    },
    niger: {
      name: 'Niger (Agro-pastoral Sector)',
      description: 'We supply major feed mill grinders for livestock feed in pastoral areas.',
      status: 'Secure delivery within 12 days. On-site technical assistance.',
      stats: '110+ machines installed'
    },
    cotedivoire: {
      name: 'Ivory Coast (New Market)',
      description: 'Ongoing expansion with partnerships for local cocoa, coffee, and fruit juice processing.',
      status: 'Delivery within 10 days. Authorized maintenance partners in Abidjan.',
      stats: 'Active deployment phase'
    }
  };

  const featuredProducts = products ? products.filter(p => [1, 6, 8].includes(Number(p.id)) && p.isVisible !== false) : [];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      
      {/* Top Announcement Bar */}
      {activeSettings.showHeroAnnouncement !== false && activeSettings.heroAnnouncement && (
        <div style={{
          background: 'linear-gradient(90deg, #166534 0%, #0b2c5c 100%)',
          color: '#ffffff',
          padding: '10px 16px',
          fontSize: '0.86rem',
          fontWeight: 600,
          textAlign: 'center',
          letterSpacing: '0.01em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span>{activeSettings.heroAnnouncement}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content-wrapper">
          
          <div className="hero-panel">
            {activeSettings.heroBadge && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(22, 101, 52, 0.1)',
                color: 'var(--primary)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '12px',
                width: 'fit-content'
              }}>
                {activeSettings.heroBadge}
              </div>
            )}

            <h1>{activeSettings.storeName || "BEVULTA"}</h1>
            
            <h2>
              {activeSettings.heroTitle || (isEn 
                ? "Designer and Manufacturer of Agricultural and Industrial Machinery in West Africa"
                : "Concepteur et Fabricant de Machines Agricoles et Industrielles en Afrique de l'Ouest")}
            </h2>

            <div className="hero-divider"></div>
            
            <p>
              {activeSettings.heroSubtitle || (isEn
                ? "From our factory in Cotonou, we manufacture high-quality food processing machines (cassava, shea butter, juices) and robust construction equipment tailored to African markets."
                : "Depuis notre usine de Cotonou, nous concevons et fabriquons des machines de transformation agroalimentaire (manioc, karité, jus de fruits) et des équipements de BTP robustes adaptés aux exigences du continent.")}
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setCurrentPage('catalog')}
                style={{ backgroundColor: 'var(--primary)', backgroundImage: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Settings size={18} />
                <span>{activeSettings.heroCtaPrimary || (isEn ? "Discover Our Machines" : "Découvrir Nos Machines")}</span>
              </button>
              
              <button 
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setCurrentPage('formations')}
              >
                <GraduationCap size={18} />
                <span>{activeSettings.heroCtaSecondary || (isEn ? "Our Trainings" : "Nos Formations")}</span>
              </button>

              <button 
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(22, 101, 52, 0.05)', borderColor: 'rgba(22, 101, 52, 0.25)', color: '#166534' }}
                onClick={() => setCurrentPage('track')}
              >
                <Wrench size={18} />
                <span>{isEn ? "Track Order" : "Suivre ma Commande"}</span>
              </button>
            </div>
          </div>

          <div className="hero-visual" style={{ position: 'relative', width: '100%', height: '350px' }}>
            <div className="hero-visual-glow" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(22,101,52,0.06) 0%, transparent 70%)', zIndex: '1' }}></div>
            <div className="hero-img-card" style={{ position: 'relative', zIndex: '2', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(22, 101, 52, 0.15)', width: '100%', height: '350px' }}>
              {carouselImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`BEVULTA Machines ${idx + 1}`} 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    opacity: idx === currentSlide ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    zIndex: idx === currentSlide ? 2 : 1
                  }}
                />
              ))}
              
              {/* Carousel Indicators (Dots) */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '6px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(4px)'
              }}>
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: idx === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio / Musique Ribbon */}
      {activeSettings.showAudioSynthesizer !== false && (
        <div className="audio-ribbon">
          <div className="audio-title-block">
            <Music size={20} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '800', letterSpacing: '0.05em' }}>{isEn ? "BEVULTA MUSIC" : "MUSIQUES BEVULTA"}</span>
              <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>{isEn ? "Listen to our tracks" : "Écoutez et partagez nos titres"}</span>
            </div>
          </div>

          <div className="audio-tracks">
            {[
              { id: 'hymne', label: isEn ? 'Hymn BEVULTA' : 'Hymme BEVULTA' },
              { id: 'debout', label: isEn ? 'Afrique Debout' : 'Afrique Debout' },
              { id: 'consommons', label: isEn ? 'Consommons Africains' : 'Consommons Africains' },
              { id: 'construire', label: isEn ? 'Construire Afrique' : 'Construire Afrique' }
            ].map((track) => {
              const isPlaying = playingTrack === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackClick(track.id)}
                  className={`audio-track-btn ${isPlaying ? 'active' : ''}`}
                >
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  <span>{track.label}</span>
                </button>
              );
            })}
          </div>

          {/* Visualizer spectrum */}
          <div className="audio-visualizer-wrap">
            <div className={`visualizer-bar ${playingTrack ? 'playing' : ''}`}></div>
            <div className={`visualizer-bar ${playingTrack ? 'playing' : ''}`}></div>
            <div className={`visualizer-bar ${playingTrack ? 'playing' : ''}`}></div>
            <div className={`visualizer-bar ${playingTrack ? 'playing' : ''}`}></div>
            <div className={`visualizer-bar ${playingTrack ? 'playing' : ''}`}></div>
          </div>
        </div>
      )}

      {/* 4 Pillars Section */}
      {activeSettings.showPillarsSection !== false && (
        <section className="pillars-section" id="pillars-section">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>
              {isEn ? "Mechanization & Professional Technical Services" : "Notre Savoir-faire Technique et Industriel"}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              {isEn 
                ? "We support agricultural processors and industrial operators through four key technical and educational pillars."
                : "Nous accompagnons les transformateurs agricoles et les acteurs industriels à travers 4 piliers technologiques et pédagogiques."}
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Wrench size={24} />
              </div>
              <h3>{isEn ? "CONCEPTION & MANUFACTURING" : "CONCEPTION & FABRICATION"}</h3>
              <p>
                {isEn 
                  ? "Local manufacturing of robust agricultural machinery and customized food processing equipment adapted to West African resources."
                  : "Conception et fabrication locale de machines agricoles et d'équipements industriels de haute précision adaptés aux réalités africaines."}
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <GraduationCap size={24} />
              </div>
              <h3>{isEn ? "TECHNICAL TRAINING" : "FORMATION PROFESSIONNELLE"}</h3>
              <p>
                {isEn 
                  ? "Hands-on training in machine operation, industrial maintenance, and agricultural entrepreneurship to ensure local autonomy."
                  : "Formation technique pratique pour la maintenance de machines, la conduite d'équipements et l'entrepreneuriat agricole."}
              </p>
              <button 
                className="btn btn-outline" 
                style={{ marginTop: '14px', fontSize: '0.82rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} 
                onClick={() => setCurrentPage('formations')}
              >
                <span>{isEn ? "Explore Trainings & Syllabuses" : "Découvrir les Formations"}</span>
                <span>→</span>
              </button>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Microscope size={24} />
              </div>
              <h3>{isEn ? "RESEARCH & DEVELOPMENT" : "RECHERCHE & INNOVATION"}</h3>
              <p>
                {isEn 
                  ? "Continuous development of appropriate technologies, energy-efficient machines, and eco-friendly industrial systems."
                  : "Recherche et développement (R&D) de technologies appropriées, de machines peu énergivores et adaptées au climat local."}
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Users size={24} />
              </div>
              <h3>{isEn ? "TECHNICAL SUPPORT & SAV" : "ACCOMPAGNEMENT & SAV"}</h3>
              <p>
                {isEn 
                  ? "Reactive after-sales service, direct machine installation, technical assistance, and permanent spare parts supply in Africa."
                  : "Service après-vente (SAV) réactif, installation sur site, assistance technique de proximité et pièces de rechange disponibles."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stats Green Ribbon */}
      {activeSettings.showStatsRibbon !== false && (
        <section className="stats-green-ribbon">
          <div className="stats-green-grid">
            <div className="stat-green-item">
              <Handshake size={32} className="stat-green-icon" />
              <h4>{activeSettings.stat1Number || "30+"}</h4>
              <p>{activeSettings.stat1Label || (isEn ? "Years of experience" : "Années d'expérience")}</p>
            </div>
            
            <div className="stat-green-item">
              <Settings size={32} className="stat-green-icon" />
              <h4>{activeSettings.stat2Number || "100+"}</h4>
              <p>{activeSettings.stat2Label || (isEn ? "Machines manufactured" : "Machines fabriquées")}</p>
            </div>

            <div className="stat-green-item">
              <GraduationCap size={32} className="stat-green-icon" />
              <h4>{activeSettings.stat3Number || "5000+"}</h4>
              <p>{activeSettings.stat3Label || (isEn ? "Young technicians trained" : "Jeunes formés")}</p>
            </div>

            <div className="stat-green-item">
              <Globe size={32} className="stat-green-icon" />
              <h4>{activeSettings.stat4Number || "100%"}</h4>
              <p>{activeSettings.stat4Label || (isEn ? "Impact in Africa" : "Impact en Afrique")}</p>
            </div>
          </div>
        </section>
      )}

      {/* Domaines d'Intervention Section */}
      {activeSettings.showDomainsSection !== false && (
        <section className="domains-section">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>
              {isEn ? "Our Spheres of Action" : "Nos Domaines d'Intervention"}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              {isEn 
                ? "We engineer solutions across key economic sectors to drive sustainable development."
                : "Des technologies de pointe conçues pour dynamiser les secteurs clés de l'économie locale."}
            </p>
          </div>

          <div className="domains-grid">
            {[
              { 
                label: isEn ? "AGRO-FOOD" : "AGROALIMENTAIRE", 
                img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600",
                onClick: () => {
                  sessionStorage.setItem('bevulta_catalog_category', 'Matériels de transformation agro-alimentaire');
                  setCurrentPage('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              },
              { 
                label: isEn ? "AGRICULTURE" : "AGRICULTURE", 
                img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600",
                onClick: () => {
                  sessionStorage.setItem('bevulta_catalog_category', 'Matériels de transformation agro-alimentaire');
                  setCurrentPage('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              },
              { 
                label: isEn ? "BTP & CONSTRUCTION" : "BTP & CONSTRUCTION", 
                img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600",
                onClick: () => {
                  sessionStorage.setItem('bevulta_catalog_category', 'Matériels de BTP & Hôpitaux / Construction métallique');
                  setCurrentPage('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              },
              { 
                label: isEn ? "CARPENTRY" : "MENUISERIE & MÉTALLURGIE", 
                img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600",
                onClick: () => {
                  sessionStorage.setItem('bevulta_catalog_category', 'Matériels de Menuiserie & Boulangerie');
                  setCurrentPage('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              },
              { 
                label: isEn ? "RENEWABLE ENERGIES" : "ÉNERGIES RENOUVELABLES", 
                img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600",
                onClick: () => {
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            ].map((domain, index) => (
              <div 
                key={index} 
                className="domain-card"
                onClick={domain.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); domain.onClick(); } }}
                style={{ cursor: 'pointer', outline: 'none' }}
                title={isEn ? `Explore ${domain.label}` : `Explorer les équipements de ${domain.label}`}
              >
                <img src={domain.img} alt={domain.label} />
                <div className="domain-card-overlay" style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', paddingBottom: '16px' }}>
                  <div className="domain-card-label">{domain.label}</div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'rgba(0, 0, 0, 0.45)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(6px)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    <span>{isEn ? "View solutions" : "Voir les équipements"}</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {activeSettings.showMachinesVedettes !== false && (
      <section className="section" style={{ backgroundColor: 'rgba(22, 101, 52, 0.02)', borderRadius: 'var(--radius-lg)', padding: '60px 24px' }}>
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <h2>{isEn ? "Featured Industrial Solutions" : "Nos Machines Industrielles Vedettes"}</h2>
          <p>
            {isEn 
              ? "Explore our most requested high-durability machines designed specifically for West African agricultural processing." 
              : "Découvrez nos équipements phares les plus demandés, conçus pour la mécanisation durable en Afrique de l'Ouest."}
          </p>
        </div>

        <div className="grid grid-3">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div 
                className="product-img-wrapper" 
                style={{ cursor: 'pointer' }}
                onClick={() => onViewDetail ? onViewDetail(product, 'product') : (setSelectedProduct ? setSelectedProduct(product) : setCurrentPage('catalog'))}
              >
                <img src={product.image} alt={product.name} />
                <span className="product-category-tag badge badge-agro" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85%' }}>
                  {isEn ? "Featured" : "Vedette"}
                </span>
              </div>

              <div className="product-info">
                <h3 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => onViewDetail ? onViewDetail(product, 'product') : (setSelectedProduct ? setSelectedProduct(product) : setCurrentPage('catalog'))}
                >
                  {product.name}
                </h3>
                <p className="product-description">{product.description}</p>
                
                <div style={{ marginTop: 'auto' }}>
                  <div className="product-price" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {product.promoPriceFcfa ? (
                      <>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{product.promoPriceFcfa.toLocaleString()} FCFA</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            ({(product.promoPriceEur || Math.round(product.promoPriceFcfa / 655.957)).toLocaleString()} €)
                          </span>
                          <span className="badge badge-special" style={{ fontSize: '0.62rem', padding: '1px 5px', textTransform: 'uppercase' }}>Promo</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {product.priceFcfa.toLocaleString()} FCFA ({product.priceEur.toLocaleString()} €)
                        </div>
                      </>
                    ) : (
                      <div>
                        <span>{product.priceFcfa.toLocaleString()} FCFA </span>
                        <span className="product-price-alt">({product.priceEur.toLocaleString()} €)</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => onViewDetail ? onViewDetail(product, 'product') : (setSelectedProduct ? setSelectedProduct(product) : setCurrentPage('catalog'))}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center', marginTop: '12px' }}
                  >
                    <span>{isEn ? "Configure & View Details" : "Configurer & Voir Détails"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => setCurrentPage('catalog')}
          >
            <span>{isEn ? "View Complete Catalog" : "Voir tout le catalogue"}</span>
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </section>
      )}

      {/* Featured E-books & Packs Section */}
      {activeSettings.showFormationsEbooks !== false && (
      <section className="section" style={{ padding: '60px 24px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            <BookOpen size={15} />
            <span>{isEn ? "KNOW-HOW & PRACTICAL GUIDES" : "SAVOIR-FAIRE & GUIDES TECHNIQUES"}</span>
          </div>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--secondary)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            {isEn ? "E-books & Complete Packs on Sale" : "E-books & Packs Pratiques en Promotion"}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {isEn 
              ? "Industrial transformation procedures, diesel engine maintenance manuals and economical packs with up to 50% discount." 
              : "Maîtrisez les procédés de transformation agro-alimentaire, la maintenance de vos moteurs et profitez de nos packs groupés à tarif réduit."}
          </p>
        </div>

        {/* Ebooks Cards Row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {ebooks.filter(e => e.isVisible !== false).slice(0, 3).map((book) => {
            const hasPromo = Boolean(book.promoPriceFcfa);
            const discountPct = hasPromo ? Math.round(((book.priceFcfa - book.promoPriceFcfa) / book.priceFcfa) * 100) : 0;

            return (
              <div
                key={book.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: book.isPack ? '2px solid rgba(217, 119, 6, 0.4)' : '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: book.isPack ? '0 12px 30px -10px rgba(217, 119, 6, 0.15)' : '0 8px 24px -10px rgba(0,0,0,0.06)',
                  transition: 'transform 0.25s ease'
                }}
              >
                {/* Pack Header if Pack */}
                {book.isPack && (
                  <div 
                    style={{
                      background: 'linear-gradient(90deg, #d97706, #b45309)',
                      color: '#ffffff',
                      padding: '6px 14px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={13} />
                      PACK COMPLET ({book.includedBooks?.length || 2} LIVRES)
                    </span>
                    {discountPct > 0 && (
                      <span style={{ background: '#ffffff', color: '#b45309', padding: '1px 6px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 800 }}>
                        -{discountPct}% ÉCO
                      </span>
                    )}
                  </div>
                )}

                {/* Cover Image */}
                <div 
                  style={{ position: 'relative', height: '190px', background: 'var(--bg-surface)', cursor: 'pointer' }}
                  onClick={() => onViewDetail ? onViewDetail(book, 'ebook') : setCurrentPage('ebooks')}
                >
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(0,0,0,0.8)', color: '#ffffff' }}>
                      {book.category}
                    </span>
                    {book.badge && (
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: book.isPack ? '#d97706' : 'var(--primary)', color: '#ffffff' }}>
                        {book.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 
                    style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '6px', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => onViewDetail ? onViewDetail(book, 'ebook') : setCurrentPage('ebooks')}
                  >
                    {book.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px', flex: 1 }}>
                    {book.subtitle || book.description?.substring(0, 90) + '...'}
                  </p>

                  {/* Price Box */}
                  <div style={{ background: hasPromo ? 'rgba(217, 119, 6, 0.05)' : 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
                    {hasPromo ? (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {book.priceFcfa.toLocaleString()} FCFA ({book.priceEur} €)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <strong style={{ fontSize: '1.35rem', color: 'var(--primary)' }}>
                            {book.promoPriceFcfa.toLocaleString()} FCFA
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            (≈ {book.promoPriceEur || Math.round(book.promoPriceFcfa / 655.957)} €)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <strong style={{ fontSize: '1.35rem', color: 'var(--primary)' }}>
                          {book.priceFcfa.toLocaleString()} FCFA
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ({book.priceEur} €)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '8px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => onViewDetail ? onViewDetail(book, 'ebook') : setCurrentPage('ebooks')}
                    >
                      <span>Détails</span>
                      <span>→</span>
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', background: book.isPack ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'var(--primary)' }}
                      onClick={() => {
                        if (addToCart) {
                          addToCart({
                            id: `ebook-${book.id}`,
                            name: book.title,
                            priceFcfa: book.promoPriceFcfa || book.priceFcfa,
                            priceEur: book.promoPriceEur || book.priceEur,
                            category: book.isPack ? "Pack E-books" : "E-book & Guide",
                            image: book.coverImage,
                            isEbook: true,
                            isPack: book.isPack
                          });
                          if (showAlert) showAlert(`"${book.title}" ajouté à votre devis / commande !`);
                        } else {
                          setCurrentPage('ebooks');
                        }
                      }}
                    >
                      <ShoppingCart size={15} style={{ marginRight: '6px' }} />
                      <span>{book.isPack ? "Commander" : "Commander"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn btn-outline"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            onClick={() => setCurrentPage('ebooks')}
          >
            <span>{isEn ? "Explore all E-books and Packs" : "Voir tous les E-books et Packs"}</span>
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </section>
      )}

      {/* Interactive Map Section */}
      {activeSettings.showInteractiveMap !== false && (
      <section className="map-section" style={{ padding: '60px 24px' }}>
        <div className="map-container">
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', color: 'var(--secondary)' }}>{t('mapTitle', lang)}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              {t('mapDesc', lang)}
            </p>

            <div className="map-info-box">
              <h3>{countryInfo[selectedCountry].name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.95rem' }}>
                {countryInfo[selectedCountry].description}
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--primary)' }}>
                <CheckCircle size={16} />
                <strong>{t('mapStatus', lang)}</strong>
                <span>{countryInfo[selectedCountry].status}</span>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>{t('mapImpact', lang)}</strong> {countryInfo[selectedCountry].stats}
              </div>
            </div>
          </div>

          <div className="map-visual animate-fade-in">
            <svg viewBox="0 0 500 400" className="map-svg">
              <rect width="500" height="400" fill="var(--bg-app)" rx="16" stroke="var(--border-subtle)" strokeWidth="1" />
              
              <path d="M 50,150 L 150,100 L 250,80 L 350,120 L 420,200 L 380,300 L 320,330 L 260,330 L 220,320 L 180,300 L 140,280 L 80,240 Z" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="2" />
              
              {/* Côte d'Ivoire */}
              <path d="M 140,280 L 180,220 L 220,230 L 220,320 L 180,300 Z" 
                fill={selectedCountry === 'cotedivoire' ? 'rgba(22, 101, 52, 0.15)' : 'var(--bg-app)'} 
                stroke={selectedCountry === 'cotedivoire' ? 'var(--primary)' : 'var(--border-subtle)'} 
                strokeWidth="1.5" 
                style={{ transition: 'fill 0.3s, stroke 0.3s', cursor: 'pointer' }} 
                onClick={() => setSelectedCountry('cotedivoire')} 
                className="map-node" 
              />
              
              {/* Togo & Benin */}
              <path d="M 240,240 L 260,240 L 260,320 L 240,320 Z" 
                fill={selectedCountry === 'togo' ? 'rgba(22, 101, 52, 0.15)' : 'var(--bg-app)'} 
                stroke={selectedCountry === 'togo' ? 'var(--primary)' : 'var(--border-subtle)'} 
                strokeWidth="1.5" 
                style={{ transition: 'fill 0.3s, stroke 0.3s', cursor: 'pointer' }} 
                onClick={() => setSelectedCountry('togo')} 
                className="map-node" 
              />
              <path d="M 260,240 L 280,240 L 280,320 L 260,320 Z" 
                fill={selectedCountry === 'benin' ? 'rgba(22, 101, 52, 0.15)' : 'var(--bg-app)'} 
                stroke={selectedCountry === 'benin' ? 'var(--primary)' : 'var(--border-subtle)'} 
                strokeWidth="1.5" 
                style={{ transition: 'fill 0.3s, stroke 0.3s', cursor: 'pointer' }} 
                onClick={() => setSelectedCountry('benin')} 
                className="map-node" 
              />
              
              {/* Burkina */}
              <path d="M 180,220 L 280,180 L 280,240 L 220,230 Z" 
                fill={selectedCountry === 'burkina' ? 'rgba(22, 101, 52, 0.15)' : 'var(--bg-app)'} 
                stroke={selectedCountry === 'burkina' ? 'var(--primary)' : 'var(--border-subtle)'} 
                strokeWidth="1.5" 
                style={{ transition: 'fill 0.3s, stroke 0.3s', cursor: 'pointer' }} 
                onClick={() => setSelectedCountry('burkina')} 
                className="map-node" 
              />
              
              {/* Niger */}
              <path d="M 280,180 L 400,120 L 420,200 L 320,220 L 280,240 Z" 
                fill={selectedCountry === 'niger' ? 'rgba(22, 101, 52, 0.15)' : 'var(--bg-app)'} 
                stroke={selectedCountry === 'niger' ? 'var(--primary)' : 'var(--border-subtle)'} 
                strokeWidth="1.5" 
                style={{ transition: 'fill 0.3s, stroke 0.3s', cursor: 'pointer' }} 
                onClick={() => setSelectedCountry('niger')} 
                className="map-node" 
              />
              
              <line x1="270" y1="300" x2="250" y2="300" stroke="var(--accent-orange)" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
              <line x1="270" y1="300" x2="230" y2="210" stroke="var(--accent-orange)" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
              <line x1="270" y1="300" x2="330" y2="180" stroke="var(--accent-orange)" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
              <line x1="270" y1="300" x2="190" y2="280" stroke="var(--accent-orange)" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />

              {/* Benin Node (Cotonou) */}
              <g onClick={() => setSelectedCountry('benin')} className="map-node" style={{ cursor: 'pointer' }}>
                <circle cx="270" cy="300" r="16" fill="var(--accent-orange)" opacity="0.25" className="map-pulse" />
                <circle cx="270" cy="300" r="7" fill="var(--accent-orange)" stroke="white" strokeWidth="2" />
                <text x="285" y="304" fill="var(--text-primary)" fontSize="10" fontWeight="800" fontFamily="var(--font-heading)" letterSpacing="0.05em">COTONOU</text>
              </g>

              {/* Togo Node (Lomé) */}
              <g onClick={() => setSelectedCountry('togo')} className="map-node" style={{ cursor: 'pointer' }}>
                <circle cx="250" cy="300" r="5" fill={selectedCountry === 'togo' ? 'var(--accent-orange)' : 'white'} stroke="var(--secondary)" strokeWidth="1.5" />
                <text x="215" y="315" fill="var(--text-secondary)" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)">Lomé</text>
              </g>

              {/* Burkina Node (Ouagadougou) */}
              <g onClick={() => setSelectedCountry('burkina')} className="map-node" style={{ cursor: 'pointer' }}>
                <circle cx="230" cy="210" r="5" fill={selectedCountry === 'burkina' ? 'var(--accent-orange)' : 'white'} stroke="var(--secondary)" strokeWidth="1.5" />
                <text x="210" y="195" fill="var(--text-secondary)" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)">Ouagadougou</text>
              </g>

              {/* Niger Node (Niamey) */}
              <g onClick={() => setSelectedCountry('niger')} className="map-node" style={{ cursor: 'pointer' }}>
                <circle cx="330" cy="180" r="5" fill={selectedCountry === 'niger' ? 'var(--accent-orange)' : 'white'} stroke="var(--secondary)" strokeWidth="1.5" />
                <text x="340" y="184" fill="var(--text-secondary)" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)">Niamey</text>
              </g>

              {/* Côte d'Ivoire Node (Abidjan) */}
              <g onClick={() => setSelectedCountry('cotedivoire')} className="map-node" style={{ cursor: 'pointer' }}>
                <circle cx="190" cy="280" r="5" fill={selectedCountry === 'cotedivoire' ? 'var(--accent-orange)' : 'white'} stroke="var(--secondary)" strokeWidth="1.5" />
                <text x="175" y="265" fill="var(--text-secondary)" fontSize="9" fontWeight="600" fontFamily="var(--font-heading)">Abidjan</text>
              </g>
            </svg>
          </div>
        </div>
      </section>
      )}

      {/* CTA Section */}
      {activeSettings.showCtaBanner !== false && (
      <section className="section glass-panel cta-banner-card" style={{ textAlign: 'center', margin: '60px auto', padding: '60px 24px', maxWidth: '1200px' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--secondary)' }}>
          {activeSettings.ctaTitle || t('ctaTitle', lang)}
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 32px', color: 'var(--text-secondary)' }}>
          {activeSettings.ctaDesc || t('ctaDesc', lang)}
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => setCurrentPage('contact')}
          style={{ backgroundColor: 'var(--primary)', backgroundImage: 'none' }}
        >
          <span>{activeSettings.ctaBtn || t('ctaBtn', lang)}</span>
          <ArrowRight size={18} />
        </button>
      </section>
      )}
    </div>
  );
}
