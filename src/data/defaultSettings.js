export const defaultSettings = {
  storeName: 'Bevulta',
  storeTagline: 'Machines Industrielles & Agroalimentaires',
  contactPhone1: '(+229) 97 69 91 78',
  contactPhone2: '(+229) 01 97 45 50 12',
  contactEmail: 'bevulta@gmail.com',
  atelierAddress: 'C/3474 Agla Von FAN-MILK, Cotonou, Bénin',
  whatsappNumber: '+22997699178',
  youtubeUrl: 'https://youtube.com/@bevulta',
  whatsappCommunityUrl: 'https://chat.whatsapp.com/bevulta-community',
  hubCommunityUrl: 'https://community.bevulta.com',

  // Hero Section
  heroBadge: 'Fabrication Locale & Ingénierie Africaine',
  heroTitle: 'Concepteur et Fabricant de Machines Agricoles et Industrielles en Afrique de l\'Ouest',
  heroSubtitle: 'Depuis notre usine de Cotonou, nous concevons et fabriquons des machines de transformation agroalimentaire (manioc, karité, jus de fruits) et des équipements de BTP robustes adaptés aux exigences du continent.',
  heroCtaPrimary: 'Découvrir Nos Machines',
  heroCtaSecondary: 'Nos Formations',
  heroAnnouncement: '🚀 Nouveauté : Découvrez notre gamme de mini-usines et broyeurs industriels avec garantie constructeur !',
  showHeroAnnouncement: true,

  // Hero Visual Carousel Images
  heroImage1: '/hero-machines.png',
  heroImage2: '/hero-machines-2.png',
  heroImage3: '/hero-machines-3.png',

  // Green Ribbon Stats
  stat1Number: '30+',
  stat1Label: 'Années d\'expérience',
  stat2Number: '100+',
  stat2Label: 'Machines fabriquées',
  stat3Number: '5000+',
  stat3Label: 'Jeunes formés',
  stat4Number: '100%',
  stat4Label: 'Impact en Afrique',

  // Bottom CTA Banner
  ctaTitle: 'Un Projet Industriel ou une Commande Spécifique ?',
  ctaDesc: 'Nos ingénieurs et techniciens conçoivent votre unité de transformation clé en main avec dimensionnement sur mesure et formation technique complète.',
  ctaBtn: 'Demander une Étude & Devis Gratuit',

  // Section Visibilities
  showPillarsSection: true,
  showStatsRibbon: true,
  showDomainsSection: true,
  showMachinesVedettes: true,
  showFormationsEbooks: true,
  showInteractiveMap: true,
  showAudioSynthesizer: true,
  showCtaBanner: true,

  // Payment Gateway Settings
  paymentProvider: 'custom_link', // 'custom_link' | 'geniuspay' | 'fedapay' | 'kkiapay' | 'paydunya' | 'momo_manual'
  paymentMode: 'live', // 'live' | 'test'
  customPaymentLink: '',
  geniuspayApiKey: '',
  geniuspayPaymentLink: '',
  fedapayPublicKey: '',
  kkiapayPublicKey: '',
  paydunyaMasterKey: '',
  paydunyaPrivateKey: '',
  paydunyaToken: '',
  momoNumber: '+229 97 69 91 78',
  momoOperator: 'MTN Mobile Money / Moov Money',
  momoInstructions: 'Effectuez le transfert vers ce numéro avec la référence en motif, puis confirmez sur WhatsApp.',
  isPaymentActive: true,

  // Dynamic Aggregators List
  customPaymentGateways: [
    {
      id: 'fedapay',
      name: 'FedaPay (MTN MoMo, Moov, Cartes)',
      category: 'Bénin & UEMOA',
      type: 'api', // 'api' | 'link' | 'manual'
      providerKey: 'fedapay',
      publicKey: '',
      secretKey: '',
      checkoutUrl: '',
      isActive: true,
      isDefault: true,
      networks: 'MTN Mobile Money, Moov Money, Cartes Bancaires (Visa / Mastercard)',
      badgeBg: '#eff6ff',
      badgeColor: '#1d4ed8',
      desc: 'Passerelle de référence au Bénin & zone UEMOA. Guichet sécurisé sur votre site.'
    },
    {
      id: 'wave',
      name: 'Wave Direct / Wave Business',
      category: 'UEMOA & Rapide',
      type: 'link',
      providerKey: 'wave',
      publicKey: '',
      secretKey: '',
      checkoutUrl: '',
      isActive: true,
      isDefault: false,
      networks: 'Wave Money (Bénin, Sénégal, Côte d\'Ivoire)',
      badgeBg: '#e0f2fe',
      badgeColor: '#0284c7',
      desc: 'Paiement sans frais et instantané par QR Code Wave ou lien direct marchand.'
    },
    {
      id: 'cinetpay',
      name: 'CinetPay (10+ Pays d\'Afrique)',
      category: 'Afrique de l\'Ouest & Centrale',
      type: 'api',
      providerKey: 'cinetpay',
      publicKey: '',
      secretKey: '',
      siteId: '',
      checkoutUrl: '',
      isActive: true,
      isDefault: false,
      networks: 'Orange Money, MTN, Moov, Wave, Cartes UEMOA & CEMAC',
      badgeBg: '#fef3c7',
      badgeColor: '#b45309',
      desc: 'Couverture panafricaine (Bénin, CI, Sénégal, Cameroun, Mali, Burkina, Togo).'
    },
    {
      id: 'kkiapay',
      name: 'KKiaPay',
      category: 'Bénin & Togo',
      type: 'api',
      providerKey: 'kkiapay',
      publicKey: '',
      secretKey: '',
      checkoutUrl: '',
      isActive: true,
      isDefault: false,
      networks: 'MTN MoMo, Moov, Carte Bancaire',
      badgeBg: '#f3e8ff',
      badgeColor: '#7e22ce',
      desc: 'Validation instantanée par USSD ou notification push.'
    },
    {
      id: 'momo_manual',
      name: 'Paiement Manuel Direct (MTN / Moov)',
      category: '100% Direct Atelier',
      type: 'manual',
      providerKey: 'manual',
      phone: '+229 97 69 91 78',
      operator: 'MTN Mobile Money / Moov Money',
      instructions: 'Transférez le montant exact vers ce numéro. Indiquez la référence en motif puis validez sur WhatsApp.',
      isActive: true,
      isDefault: false,
      networks: 'MTN MoMo, Moov Money, WhatsApp',
      badgeBg: '#f0fdf4',
      badgeColor: '#166534',
      desc: 'Affiche directement le numéro marchand récepteur de l\'atelier avec confirmation WhatsApp.'
    }
  ]
};
