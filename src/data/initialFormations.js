export const initialFormations = [
  {
    id: 1,
    title: "Transformation Agroalimentaire & Pilotage de Lignes de Production",
    subtitle: "Manioc (Gari, Farine panifiable), Beurre de Karité, Jus Tropicaux et Huile d'Arachide",
    category: "Agro-alimentaire",
    badge: "Bestseller Atelier",
    duration: "3 Jours intensifs (24h pratiques)",
    format: "Présentiel Atelier (Cotonou) ou Mixte",
    location: "Atelier Central BEVULTA, Cotonou, Bénin",
    nextSession: "Chaque 1er et 3ème Lundi du mois",
    priceFcfa: 35000,
    priceEur: 53,
    promoPriceFcfa: 25000,
    promoPriceEur: 38,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=700",
    description: "Formation 100% orientée pratique en atelier sur nos machines de transformation. Vous apprendrez à régler les râpeuses industrielles, manipuler les presses hydrauliques, calibrer les torréfacteurs inox et pasteuriser les jus sans conservateurs chimiques.",
    targetAudience: "Promoteurs d'usines agro-industrielles, coopératives agricoles féminines, investisseurs et jeunes entrepreneurs.",
    prerequisites: "Aucun prérequis technique nécessaire. Formation accessible à tous niveaux.",
    included: [
      "Attestation Officielle de Fin de Formation certifiée BEVULTA",
      "Support de cours complet relié et fiches de barèmes thermiques",
      "Kit d'équipements de protection individuelle (blouse atelier + gants)",
      "Déjeuners et pauses-café inclus durant les 3 jours de formation",
      "Suivi technique post-formation WhatsApp pendant 3 mois"
    ],
    modules: [
      {
        number: 1,
        title: "Sélection des matières premières & Normes d'Hygiène HACCP",
        duration: "Jour 1 (Matin)",
        points: [
          "Calibrage des tubercules de manioc et amandes de karité de grade A",
          "Protocoles d'hygiène en milieu agroalimentaire et gestion des résidus",
          "Calcul des rendements matière et estimation des coûts de revient"
        ]
      },
      {
        number: 2,
        title: "Conduite & Réglage des Machines de Transformation du Manioc",
        duration: "Jour 1 (Après-midi)",
        points: [
          "Démarrage, sécurité et réglage de la finesse de râpage sur râpeuse inox",
          "Pressage hydraulique sous pression contrôlée (déshydratation optimale)",
          "Torréfaction mécanique homogène du gari et refroidissement rapide"
        ]
      },
      {
        number: 3,
        title: "Extraction des Huiles, Barattage du Karité & Pasteurisation des Jus",
        duration: "Jour 2",
        points: [
          "Torréfaction des amandes et barattage mécanique du beurre de karité",
          "Extraction de jus d'ananas, mangue et passion au broyeur-extracteur inox",
          "Barèmes de pasteurisation thermique pour une conservation de 12 mois sans additif"
        ]
      },
      {
        number: 4,
        title: "Conditionnement, Contrôle Qualité & Commercialisation",
        duration: "Jour 3",
        points: [
          "Soudure thermique sous vide, étiquetage réglementaire et traçabilité",
          "Contrôle d'acidité, taux d'humidité et tests organoleptiques",
          "Stratégie de vente locale, packaging attractif et circuits de distribution"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Maintenance, Diagnostic & Dépannage des Moteurs Diesel Industriels",
    subtitle: "Maîtrisez les moteurs monocylindres Sifang, Changchai, Yanmar et groupes électrogènes",
    category: "Mécanique & Maintenance",
    badge: "100% Pratique",
    duration: "2 Jours intensifs (16h atelier)",
    format: "Présentiel Atelier Mécanique",
    location: "Pôle Mécanique BEVULTA, Cotonou, Bénin",
    nextSession: "Chaque 2ème et 4ème Mardi du mois",
    priceFcfa: 30000,
    priceEur: 46,
    promoPriceFcfa: 20000,
    promoPriceEur: 31,
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=700",
    description: "Une formation technique indispensable pour supprimer les temps d'arrêt machine. Vous démonterez et remonterez un moteur thermique de A à Z : calage de pompe à injection, rodage des soupapes, remplacement de segments et diagnostic des bruits anormaux.",
    targetAudience: "Mécaniciens ruraux, chefs d'atelier, opérateurs de moulins et décortiqueuses, propriétaires d'engins agricoles.",
    prerequisites: "Notions de base en outillage manuel appréciées.",
    included: [
      "Certificat d'Aptitude Technique BEVULTA",
      "Manuel d'atelier avec schémas éclatés et couples de serrage",
      "Jeu de cales d'épaisseur pour réglage des soupapes offert",
      "Déjeuners et équipements de sécurité d'atelier fournis",
      "Assistance téléphonique d'urgence avec les ingénieurs BEVULTA"
    ],
    modules: [
      {
        number: 1,
        title: "Principe de Combustion Diesel & Circuit d'Alimentation",
        duration: "Jour 1 (Matin)",
        points: [
          "Fonctionnement du cycle 4-temps diesel sur moteur monocylindre",
          "Purge du circuit de gasoil, tarage et nettoyage des injecteurs",
          "Calage précis de l'avance à l'injection pour un démarrage au 1er coup"
        ]
      },
      {
        number: 2,
        title: "Haut-Moteur : Culasse, Soupapes & Compression",
        duration: "Jour 1 (Après-midi)",
        points: [
          "Démontage de la culasse et diagnostic d'étanchéité des soupapes",
          "Méthode de rodage à la pâte et réglage du jeu aux culbuteurs",
          "Détection des fuites de compression et remplacement du joint de culasse"
        ]
      },
      {
        number: 3,
        title: "Bas-Moteur : Bielle, Piston, Vilebrequin & Lubrification",
        duration: "Jour 2 (Matin)",
        points: [
          "Dépose du piston, tierçage des segments et contrôle d'ovalisation du cylindre",
          "Vérification des coussinets de bielle et pression d'huile",
          "Système de refroidissement par évaporation (hopper) et thermosiphon"
        ]
      },
      {
        number: 4,
        title: "Diagnostic Avancé des Pannes & Plan d'Entretien Préventif",
        duration: "Jour 2 (Après-midi)",
        points: [
          "Analyse des fumées (noire = suralimentation, blanche/bleue = huile/eau)",
          "Tableau d'intervention systématique (50h, 250h, 1000h)",
          "Stock minimal de pièces de rechange critiques à conserver sur site"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Création & Exploitation Rentable d'une Unité de Provenderie Locale",
    subtitle: "Formulation nutritionnelle volailles, bovins et porcs avec matières premières locales",
    category: "Élevage & Nutrition",
    badge: "Haute Rentabilité",
    duration: "3 Jours (20h formation)",
    format: "Présentiel ou Formation Mixte (En ligne + Stage)",
    location: "Unité Pilote BEVULTA, Cotonou, Bénin",
    nextSession: "Chaque 1er Samedi du mois",
    priceFcfa: 40000,
    priceEur: 61,
    promoPriceFcfa: 29000,
    promoPriceEur: 44,
    coverImage: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=700",
    description: "Maîtrisez la fabrication d'aliments complets pour bétail et volailles à bas coût. Apprenez à formuler des rations équilibrées avec le maïs, soja, tourteau de coton, son de blé et coquilles d'huîtres, tout en manipulant broyeurs et mélangeurs industriels.",
    targetAudience: "Éleveurs de volailles/porcs/ruminants, agronomes, vétérinaires, repreneurs d'exploitations agricoles.",
    prerequisites: "Savoir lire et effectuer des calculs de base (règle de trois).",
    included: [
      "Attestation de Qualification en Provenderie Professionnelle",
      "Tableur Excel officiel BEVULTA de calcul automatique de rations",
      "Fiches recettes prêtes à l'emploi (Démarrage, Croissance, Ponte)",
      "Déjeuners et échantillons de matières premières analysées",
      "Accompagnement pour le choix de votre équipement de provenderie"
    ],
    modules: [
      {
        number: 1,
        title: "Besoins Nutritionnels des Animaux & Matières Premières Africaines",
        duration: "Jour 1",
        points: [
          "Besoins en protéines, énergie, minéraux et acides aminés essentiels",
          "Inventaire et valeur nutritive des matières premières locales disponibles",
          "Gestion des facteurs anti-nutritionnels et contrôle de l'aflatoxine"
        ]
      },
      {
        number: 2,
        title: "Méthode de Formulation Économique sur Logiciel/Tableur",
        duration: "Jour 2 (Matin)",
        points: [
          "Utilisation du carré de Pearson et du tableur automatique de rations",
          "Équilibrage coût minimum vs performance de croissance optimale",
          "Formulations spécifiques poulets de chair, pondeuses, porcelets et embouche"
        ]
      },
      {
        number: 3,
        title: "Ligne de Fabrication : Broyage, Granulométrie & Mélange Homogène",
        duration: "Jour 2 (Après-midi)",
        points: [
          "Calibrage des grilles de broyage (farine fine vs brisures)",
          "Temps de mélange optimal sur mélangeur horizontal vs vertical",
          "Incorporation d'huile, mélasse et prémix vitaminé sans grumeaux"
        ]
      },
      {
        number: 4,
        title: "Stockage, Conditionnement & Rentabilité Commerciale",
        duration: "Jour 3",
        points: [
          "Prévention de l'humidité, moisissures et attaques d'insectes",
          "Calcul précis du coût de revient au sac de 50 kg et marge nette",
          "Stratégie de vente aux éleveurs de votre localité"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Préfabrication de Briques, Pavés et Hourdis Haute Résistance",
    subtitle: "Exploitation optimale des pondeuses vibrantes, dosages de ciment et accélération de cure",
    category: "BTP & Matériaux",
    badge: "Secteur BTP Porteur",
    duration: "2 Jours (14h pratiques)",
    format: "Présentiel sur Chantier École",
    location: "Plateforme BTP BEVULTA, Cotonou, Bénin",
    nextSession: "Chaque 3ème Samedi du mois",
    priceFcfa: 30000,
    priceEur: 46,
    promoPriceFcfa: 22000,
    promoPriceEur: 34,
    coverImage: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=700",
    description: "Apprenez à produire des agglomérés de béton respectant les normes de résistance mécanique avec une économie maximale de ciment. Pratique intensive sur pondeuses mobiles et tables vibrantes fixes.",
    targetAudience: "Entrepreneurs BTP, fabricants de matériaux, maçons, promoteurs immobiliers.",
    prerequisites: "Bonne condition physique requise pour les manipulations de chantier.",
    included: [
      "Certificat d'Aptitude aux Techniques de Préfabrication Béton",
      "Abaques de dosage ciment/agrégats plastifiées de chantier",
      "Équipements de protection (casque, gants renforcés, gilet)",
      "Déjeuners inclus et accès privilégié aux pièces de rechange des pondeuses"
    ],
    modules: [
      {
        number: 1,
        title: "Sélection des Agrégats, Granulométrie & Ratios de Ciment",
        duration: "Jour 1 (Matin)",
        points: [
          "Caractéristiques des sables lagunaires, sables concassés et gravillons",
          "Dosage optimal eau/ciment pour obtenir une plasticité de démoulage immédiat",
          "Utilisation d'adjuvants plastifiants et accélérateurs de prise"
        ]
      },
      {
        number: 2,
        title: "Conduite & Réglage des Pondeuses Vibrantes",
        duration: "Jour 1 (Après-midi)",
        points: [
          "Remplissage uniforme des alvéoles de moules (briques creuses de 15, 12, pavés)",
          "Réglage du contrepoids vibrant pour un compactage haute densité",
          "Maniement de la manette de démoulage sans effritement des parois"
        ]
      },
      {
        number: 3,
        title: "Pavés Autobloquants Décoratifs & Éléments Spéciaux",
        duration: "Jour 2 (Matin)",
        points: [
          "Technique de bicouche : béton de masse + couche d'usure colorée",
          "Dosage des pigments d'oxyde de fer pour une couleur durable",
          "Fabrication de hourdis d'entrevous légers pour planchers"
        ]
      },
      {
        number: 4,
        title: "Procédé de Cure à l'Eau, Contrôle Résistance & Rentabilité",
        duration: "Jour 2 (Après-midi)",
        points: [
          "Protocole d'arrosage et bâchage pour éviter la dessiccation prématurée",
          "Test d'écrasement sur chantier et détection des défauts de cure",
          "Calcul du seuil de rentabilité par sac de ciment (quantité produite/sac)"
        ]
      }
    ]
  }
];

export const FORMATION_CATEGORIES = [
  "Tous",
  "Agro-alimentaire",
  "Mécanique & Maintenance",
  "Élevage & Nutrition",
  "BTP & Matériaux"
];

