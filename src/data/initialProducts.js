export const initialProducts = [
  {
    id: 1,
    name: "Complexe de Karité",
    category: "Matériels de transformation agro-alimentaire",
    subcategory: "Matériels de transformation de Karité",
    description: "Machine industrielle combinée intégrant un poste de concassage et un poste de broyage. Idéale pour les coopératives et usines produisant du beurre de karité de qualité supérieure.",
    priceFcfa: 1600000,
    priceEur: 2443,
    availability: "Sur commande (15-30 jours)",
    specs: {
      "Postes de travail": "Concassage + Broyage",
      "Motorisation": "Thermique Diesel 12 CV (SIFANG S1100GNM, 2000 trs/min)",
      "Système de démarrage": "Manuel ou Automatique (démarreur électrique avec batterie 12V)",
      "Matériau": "Acier mécano-soudé A33 renforcé",
      "Capacité Concassage": "500 kg / heure",
      "Capacité Broyage": "80 à 100 kg / heure",
      "Dimensions": "1.80m x 1.20m x 1.40m"
    },
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600"
  },
  {
    id: 2,
    name: "Baratteuse de Crème de Karité",
    category: "Matériels de transformation agro-alimentaire",
    subcategory: "Matériels de transformation de Karité",
    description: "Machine spécialement conçue pour le barattage mécanique de la crème de karité. Le barattage est obtenu de façon homogène par rotation de palettes profilées à l'intérieur du cylindre.",
    priceFcfa: 450000,
    priceEur: 688,
    availability: "En stock / Sur commande",
    specs: {
      "Capacité de charge": "25 kg de crème par cycle",
      "Motorisation": "Thermique 6 CV ou Électrique 3 CV (n=1500 trs/min)",
      "Matériau": "Acier structural A33 alimentaire ou inoxydable (sur option)",
      "Principe": "Rotation de palettes de barattage axiales",
      "Encombrement": "1.20m x 1.00m x 1.00m"
    },
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600"
  },
  {
    id: 3,
    name: "Torréfacteur à Tambour",
    category: "Matériels de transformation agro-alimentaire",
    subcategory: "Matériels de transformation de Karité",
    description: "Torréfacteur rotatif pour le traitement des amandes de karité, graines de soja, café, arachides, etc. Offre une cuisson uniforme et conserve les arômes grâce à sa vitesse de rotation optimisée.",
    priceFcfa: 600000,
    priceEur: 917,
    availability: "Sur commande (15 jours)",
    specs: {
      "Capacité de production": "150 à 200 kg / heure",
      "Motorisation": "Électrique 1.5 CV (n=1500 trs/min)",
      "Vitesse du tambour": "25 trs/min",
      "Combustible": "Bois, Charbon ou Coques recyclées",
      "Matériau": "Tôle d'acier thermo-résistante"
    },
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600"
  },
  {
    id: 4,
    name: "Moteur Diesel Sifang S1100GNM",
    category: "Matériels de Spécialités",
    subcategory: "Matériels de Transport & Divers",
    description: "Moteur diesel monocylindre à plat, réputé pour sa robustesse légendaire et sa grande efficacité énergétique. Idéal pour actionner broyeurs, moulins, alternateurs et pompes agricoles.",
    priceFcfa: 600000,
    priceEur: 916,
    availability: "En stock",
    specs: {
      "Marque / Modèle": "SIFANG S1100GNM",
      "Puissance continue": "12 CV (Vitesse : 2200 trs/min)",
      "Carburant": "Gazole (Diesel)",
      "Système de démarrage": "Manuel (manivelle de sécurité) ou Démarreur automatique 12V",
      "Poids net": "165 kg",
      "Encombrement": "920mm x 500mm x 600mm",
      "Accessoires inclus": "Valisette comprenant un joint de culasse supplémentaire"
    },
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600"
  },
  {
    id: 5,
    name: "Extracteur de Jus de Canne à Sucre",
    category: "Matériels de Spécialités",
    subcategory: "Moto-presse de Jus de canne à sucre",
    description: "Presse-extracteur à haut rendement pour l'extraction à froid de jus frais de canne à sucre. Facile à nettoyer, avec protection intégrée pour les opérateurs.",
    priceFcfa: 1000000,
    priceEur: 1527,
    availability: "Sur commande (20 jours)",
    specs: {
      "Capacité de pressage": "800 kg de canne à sucre / heure",
      "Motorisation": "Électrique 5 CV (1500 trs/min)",
      "Transmission": "Par engrenages robustes sous carter de sécurité",
      "Dimensions": "700mm x 700mm x 700mm",
      "Matériau galets": "Acier trempé haute dureté"
    },
    image: "https://images.unsplash.com/photo-1563865436874-9aef32095ffd?q=80&w=600"
  },
  {
    id: 6,
    name: "Broyeur Mélangeur de Provende",
    category: "Matériels de Spécialités",
    subcategory: "Matériels de provenderie",
    description: "Unité complète de provenderie pour concasser et mélanger de manière homogène les grains et nutriments destinés à l'alimentation du bétail et de la volaille.",
    priceFcfa: 1000000,
    priceEur: 1527,
    availability: "Sur commande (30 jours)",
    specs: {
      "Capacité de production": "1.5 Tonne de provende / heure",
      "Motorisation": "Deux moteurs électriques indépendants (7.5 CV pour le broyeur, 3 CV pour le mélangeur)",
      "Homogénéité de mélange": "Supérieure ou égale à 98%",
      "Grilles de calibrage": "Interchangeables fournies (6mm, 8mm, 10mm)",
      "Encombrement": "2450mm x 1300mm x 1800mm (hauteur)"
    },
    image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=600"
  },
  {
    id: 7,
    name: "Moulin à Condiments Professionnel",
    category: "Matériels de transformation agro-alimentaire",
    subcategory: "Matériels de production d'Huile",
    description: "Moulin de broyage humide spécialement conçu pour réduire en purée fine les piments, tomates, oignons et gingembre de manière extrêmement rapide.",
    priceFcfa: 125000,
    priceEur: 192,
    availability: "En stock",
    specs: {
      "Débit / Rendement": "1 bassine standard en 15 minutes",
      "Motorisation": "Thermique 5.5 CV ou Électrique 2.5 CV (1500 trs/min) au choix",
      "Système de broyage": "Dents de friction en fonte d'acier (Ø 180 mm)",
      "Entraxe de fixation": "120 mm avec 3 points",
      "Encombrement": "350mm x 500mm x 600mm"
    },
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=600"
  },
  {
    id: 8,
    name: "Décortiqueuse Vanneuse de Riz",
    category: "Matériels de transformation agro-alimentaire",
    subcategory: "Matériels de transformation de Riz",
    description: "Unité combinée permettant le décorticage rapide du riz paddy et l'élimination simultanée de la balle par un système de soufflerie intégré.",
    priceFcfa: 750000,
    priceEur: 1145,
    availability: "Sur commande (15 jours)",
    specs: {
      "Capacité horaire": "300 à 400 kg / heure",
      "Motorisation": "Électrique 4 CV ou Thermique Diesel 6.5 CV",
      "Taux de brisure": "Extrêmement faible (< 5%)",
      "Châssis": "Acier mécano-soudé renforcé anti-vibrations"
    },
    image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=80&w=600"
  },
  {
    id: 9,
    name: "Décortiqueuse Vanneuse d'Arachides",
    category: "Matériels de transformation agro-alimentaire",
    subcategory: "Matériels de transformation d'Arachide",
    description: "Machine haute performance pour écosser les arachides sèches. Le système de vannage souffle les coques légères et trie les graines entières.",
    priceFcfa: 650000,
    priceEur: 992,
    availability: "En stock / Sur commande",
    specs: {
      "Capacité de traitement": "500 kg / heure",
      "Motorisation": "Thermique Essence 6.5 CV ou Électrique 3 CV",
      "Taux de séparation": "Supérieur à 95%",
      "Grilles": "Ajustables selon le calibre des arachides"
    },
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=600"
  },
  {
    id: 10,
    name: "Pondeuse de Briques toutes gammes",
    category: "Matériels de BTP & Hôpitaux / Construction métallique",
    subcategory: "Matériels de BTP",
    description: "Presse vibrante pour la fabrication en série de briques de ciment, parpaings et pavés autobloquants. Simple d'utilisation et extrêmement durable.",
    priceFcfa: 1200000,
    priceEur: 1832,
    availability: "Sur commande (20 jours)",
    specs: {
      "Capacité de moulage": "1200 à 1500 blocs par journée de 8h",
      "Motorisation": "Vibrateur électrique industriel 2 CV ou Thermique 5 CV",
      "Moules fournis": "Moule standard pour parpaings 15x20x40 cm (interchangeable)",
      "Opérateurs requis": "2 à 3 personnes",
      "Matériau moule": "Acier anti-abrasion traité thermiquement"
    },
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600"
  },
  {
    id: 11,
    name: "Citerne Métallique (2000 Litres)",
    category: "Matériels de BTP & Hôpitaux / Construction métallique",
    subcategory: "Construction métallique",
    description: "Citerne de stockage cylindrique ou rectangulaire pour liquides (eau potable, gazole, huiles végétales). Traitement anticorrosion intérieur et extérieur.",
    priceFcfa: 250000,
    priceEur: 382,
    availability: "En stock",
    specs: {
      "Capacité nominale": "2000 Litres",
      "Épaisseur tôle": "Tôle d'acier A33 certifiée 30/10",
      "Dimensions": "2.00m de longueur x 1.00m de largeur x 1.00m de hauteur",
      "Équipements": "Trou d'homme Ø 450mm, robinet de vidange en laiton, vanne de sécurité et anneaux de levage"
    },
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600"
  },
  {
    id: 12,
    name: "Scie à Ruban Professionnelle",
    category: "Matériels de Menuiserie & Boulangerie",
    subcategory: "Matériels de Menuiserie",
    description: "Scie à ruban à haut rendement pour ateliers de menuiserie bois. Structure mécano-soudée assurant une excellente rigidité pour des coupes rectilignes ou courbes parfaites.",
    priceFcfa: 900000,
    priceEur: 1375,
    availability: "Sur commande (25 jours)",
    specs: {
      "Hauteur de coupe max": "400 mm",
      "Dimensions de la table": "1.20m x 0.75m (table inclinable en fonte)",
      "Motorisation": "Électrique Triphasé ou Monophasé 10 CV (1500 trs/min)",
      "Fréquence de service": "50 Hz",
      "Dimensions globales": "2.30m x 0.90m x 1.60m"
    },
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 13,
    name: "Raboteuse Simple d'Atelier",
    category: "Matériels de Menuiserie & Boulangerie",
    subcategory: "Matériels de Menuiserie",
    description: "Raboteuse industrielle conçue pour dresser le bois à des épaisseurs précises avec une avance automatique régulière.",
    priceFcfa: 850000,
    priceEur: 1300,
    availability: "Sur commande (30 jours)",
    specs: {
      "Largeur de rabotage": "500 mm avec arbre à 3 fers",
      "Hauteur de rabotage max": "250 mm",
      "Vitesse d'avance du bois": "7.5 mètres / minute",
      "Dimensions de la table": "800mm x 500mm",
      "Motorisation principale": "Électrique 5 CV (3000 trs/min)",
      "Motorisation entraîneuse": "Électrique 2.5 CV (1500 trs/min)",
      "Diamètre rouleau d'entraînement": "Ø 50 mm"
    },
    image: "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600"
  },
  {
    id: 14,
    name: "Raboteuse Dégauchisseuse Combinée",
    category: "Matériels de Menuiserie & Boulangerie",
    subcategory: "Matériels de Menuiserie",
    description: "Machine polyvalente deux-en-un pour les ateliers de menuiserie artisanale. Permet le dégauchissage (planéité) puis le rabotage (épaisseur) sur le même bâti.",
    priceFcfa: 900000,
    priceEur: 1375,
    availability: "Sur commande (30 jours)",
    specs: {
      "Hauteur max rabotage": "230 mm",
      "Profondeur de passe max": "4 mm",
      "Longueur de dégauchissage": "450 mm",
      "Arbre porte-outils": "Ø 90 mm",
      "Vitesse d'avance (débrayable)": "7.5 m/min",
      "Moteur de l'arbre": "Électrique 6 CV (5850 trs/min)",
      "Moteur d'entraînement": "Électrique 2.5 CV (1500 trs/min)",
      "Encombrement": "1.40m x 0.65m x 0.85m"
    },
    image: "https://images.unsplash.com/photo-1540206395-68808572332f?q=80&w=600"
  },
  {
    id: 15,
    name: "Vélo Tricycle Adapté",
    category: "Matériels de BTP & Hôpitaux / Construction métallique",
    subcategory: "Matériels des Hôpitaux",
    description: "Vélo à trois roues spécialement étudié pour les personnes dont les membres inférieurs sont défaillants. Entièrement actionnable par la force des bras, confortable et sûr.",
    priceFcfa: 200000,
    priceEur: 306,
    availability: "En stock",
    specs: {
      "Mécanisme de propulsion": "Système de pédalage manuel (manivelles ergonomiques) avec marche avant et arrière",
      "Configuration": "Châssis tubulaire acier haute résistance monté sur 3 roues pneumatiques robustes",
      "Assise": "Siège ergonomique en mousse épaisse recouvert d'un simili-cuir imperméable",
      "Système de freinage": "Frein manuel à blocage sur les roues arrière",
      "Dimensions": "1500mm x 1100mm x 750mm"
    },
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600"
  },
  {
    id: 16,
    name: "Four à Gâteau Professionnel",
    category: "Matériels de Menuiserie & Boulangerie",
    subcategory: "Matériels de Boulangerie",
    description: "Four professionnel conçu pour la cuisson uniforme de gâteaux, viennoiseries et pains artisanaux. Équipé d'une sole réfractaire et d'une régulation thermique optimisée.",
    priceFcfa: 700000,
    priceEur: 1068,
    availability: "Sur commande (15 jours)",
    specs: {
      "Alimentation": "Gaz GPL (détendeur standard) ou Électricité",
      "Plage de température": "50°C à 350°C",
      "Capacité de plaques": "3 niveaux (plaques 60x40 cm)",
      "Porte": "Vitrage thermorésistant avec poignée athermique",
      "Matériau carrosserie": "Acier inoxydable et tôle peinte au four"
    },
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600"
  }
];
