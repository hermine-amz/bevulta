import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  BookOpen, 
  CreditCard, 
  ShoppingBag, 
  Globe, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';

export default function AdminHelpCenter({ 
  lang = 'fr', 
  settings = {}, 
  setActiveTab 
}) {
  const isEn = lang === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const categories = [
    { id: 'all', label: isEn ? 'All Topics' : 'Tous les sujets', icon: <HelpCircle size={16} /> },
    { id: 'products', label: isEn ? 'Machines & Products' : 'Machines & Catalogue', icon: <Package size={16} /> },
    { id: 'ebooks', label: isEn ? 'E-books & Guides' : 'E-books & Guides', icon: <BookOpen size={16} /> },
    { id: 'payments', label: isEn ? 'Payments & MoMo' : 'Paiements & Mobile Money', icon: <CreditCard size={16} /> },
    { id: 'orders', label: isEn ? 'Quotes & Orders' : 'Devis & Commandes', icon: <ShoppingBag size={16} /> },
    { id: 'landing', label: isEn ? 'Storefront & Content' : 'Vitrine & Landing Page', icon: <Globe size={16} /> },
    { id: 'security', label: isEn ? 'Security & Account' : 'Sécurité & Accès', icon: <ShieldCheck size={16} /> }
  ];

  const faqs = [
    // 1. PRODUCTS
    {
      id: 'prod-1',
      category: 'products',
      title: isEn ? "How to add a new machine to the catalog?" : "Comment ajouter une nouvelle machine au catalogue ?",
      answer: isEn
        ? "1. Go to the 'Products' tab in the left sidebar.\n2. Click on the green '+ Add a machine' button.\n3. Enter the machine name, industrial category, price in FCFA (Euro conversion is automatic), and technical specifications (Capacity, Dimensions, Engine, Material).\n4. Paste a photo URL and click 'Save'. The machine will appear instantly on the public website."
        : "1. Rendez-vous dans l'onglet « Produits » dans le menu de gauche.\n2. Cliquez sur le bouton vert « + Ajouter une machine ».\n3. Renseignez le nom, la catégorie industrielle (ex: Matériels de transformation de Karité), le prix en FCFA (la conversion en €uro est automatique), et les spécifications techniques (Capacité horaire, Dimensions, Moteur, Matériau).\n4. Ajoutez le lien d'une photo et cliquez sur « Enregistrer ». Votre équipement est immédiatement visible sur le site public.",
      quickAction: { label: isEn ? "Go to Products" : "Gérer les Produits", tab: 'products' }
    },
    {
      id: 'prod-2',
      category: 'products',
      title: isEn ? "Why are my changes saved permanently now?" : "Pourquoi mes modifications sont-elles désormais sauvegardées définitivement ?",
      answer: isEn
        ? "All updates to products, prices, and stock statuses are synchronized directly to your Supabase PostgreSQL cloud database, with an automatic local browser cache backup. Even if you refresh (F5), restart your computer, or open the dashboard on another day, all your updates are permanently preserved."
        : "Toutes vos modifications (noms, prix, motorisations, photos et disponibilites) sont sauvegardées immédiatement dans votre base de données Supabase et sécurisées par une réplication automatique dans le stockage local de votre navigateur. Même en rechargeant la page avec F5 ou en fermant votre navigateur, tout votre travail est conservé.",
      highlight: true
    },
    {
      id: 'prod-3',
      category: 'products',
      title: isEn ? "How to temporarily hide a machine without deleting it?" : "Comment masquer temporairement une machine sans la supprimer ?",
      answer: isEn
        ? "In the products table, simply click the Eye icon (Visibility toggle) next to the product. A hidden machine remains in your admin panel for later editing, but is completely invisible to visitors and search engines."
        : "Dans le tableau des produits, cliquez simplement sur l'icône Œil (Visibilité) sur la ligne de la machine. Un produit masqué reste dans votre espace administrateur pour que vous puissiez le réactiver quand vous le voulez, mais disparaît immédiatement du catalogue vu par les visiteurs."
    },
    {
      id: 'prod-4',
      category: 'products',
      title: isEn ? "How to manage engine and power options (Diesel vs Electric)?" : "Comment gérer les options de motorisation (Thermique Diesel vs Électrique) ?",
      answer: isEn
        ? "In the product specifications editor, indicate the motor options in the 'Motorisation' field (e.g., 'Thermique Diesel SIFANG 12 CV / Électrique 7.5 kW triphasé'). Clients can then select their preferred motor configuration when requesting a formal quotation."
        : "Dans l'éditeur de spécifications techniques de la machine, indiquez les options de moteur dans le champ « Motorisation » (ex: Thermique Diesel SIFANG 12 CV ou Électrique Triphasé 7.5 kW). Le client pourra choisir sa motorisation favorite directement sur la fiche machine lors de sa demande de devis proforma."
    },

    // 2. E-BOOKS
    {
      id: 'eb-1',
      category: 'ebooks',
      title: isEn ? "How to publish a new digital technical guide (e-book)?" : "Comment mettre en vente un nouveau guide technique ou e-book ?",
      answer: isEn
        ? "1. Open the 'E-books & Guides' tab.\n2. Click '+ Add an E-book'.\n3. Fill in the title, subtitle, author ('BEVULTA Engineering'), page count, and price in FCFA.\n4. Provide the downloadable PDF link (e.g. public cloud link or hosted file).\n5. Click 'Save E-book'. It is published immediately on the storefront."
        : "1. Ouvrez l'onglet « E-books & Guides » dans le menu de gauche.\n2. Cliquez sur « + Ajouter un E-book ».\n3. Renseignez le titre, le sous-titre, l'auteur (ex: Bureau d'Études BEVULTA), le nombre de pages et le prix en FCFA.\n4. Indiquez l'URL directe de votre fichier PDF (hébergé en ligne ou lien cloud public).\n5. Cliquez sur « Enregistrer ». Votre guide est immédiatement en vente.",
      quickAction: { label: isEn ? "Go to E-books" : "Gérer les E-books", tab: 'ebooks' }
    },
    {
      id: 'eb-2',
      category: 'ebooks',
      title: isEn ? "How does the anti-leak dynamic watermark work?" : "Comment fonctionne la protection par filigrane anti-fuite ?",
      answer: isEn
        ? "When a customer completes their order and clicks 'Download E-book', the BEVULTA PDF stamping engine automatically creates an official customized PDF. Every page is stamped across the center at 45° with the buyer's real email, verified phone number, and exact purchase timestamp. The customer sees a clean, professional download without alarmist warnings, but will be easily identified if they leak the file publicly."
        : "Dès qu'un client achète un e-book et clique sur « Télécharger », le moteur BEVULTA génère à la volée un PDF officiel unique. Chaque page reçoit un filigrane diagonal translucide au centre contenant l'e-mail de l'acheteur, son numéro de téléphone réel et la date/heure exacte. Le client a une expérience d'achat propre et sans message anxiogène, mais sait que le document est nominatif, ce qui dissuade toute fuite sur Internet ou WhatsApp.",
      highlight: true
    },
    {
      id: 'eb-3',
      category: 'ebooks',
      title: isEn ? "How to create an all-in-one discounted E-book Bundle (Pack)?" : "Comment créer un Pack d'e-books regroupant plusieurs guides ?",
      answer: isEn
        ? "In the e-book editor, check the box 'Ceci est un Pack groupé'. Check the individual guides included in this pack. Set an attractive bundled price in FCFA and set the badge to 'Pack Économique'. Customers get all guides in one transaction."
        : "Dans l'éditeur d'e-book, cochez simplement la case « Ceci est un Pack groupé ». Sélectionnez ensuite la liste des guides inclus dans ce pack. Définissez un prix global avantageux (avec éventuellement un prix barré) et le badge « Pack Économique »."
    },

    // 3. PAYMENTS
    {
      id: 'pay-1',
      category: 'payments',
      title: isEn ? "How to configure GeniusPay (Wave, MTN, Moov, Orange, Cards)?" : "Comment configurer GeniusPay (Wave, MTN, Moov, Orange, Cartes) ?",
      answer: isEn
        ? "1. Create your merchant account on https://pay.genius.ci.\n2. From your GeniusPay dashboard, copy your merchant payment link OR your public API key (pk_live_...).\n3. In BEVULTA Admin, go to 'Paiements & Mobile Money'.\n4. Select the 'GeniusPay' card, paste your link or key, and click 'Enregistrer'. Customers will be redirected with their order amount pre-filled."
        : "1. Créez votre compte marchand sur le site officiel https://pay.genius.ci.\n2. Dans votre espace GeniusPay, copiez votre lien de paiement marchand OU votre clé d'API publique (pk_live_...).\n3. Dans votre administration BEVULTA, ouvrez l'onglet « Paiements & Mobile Money ».\n4. Sélectionnez la carte « GeniusPay », collez votre lien ou votre clé, puis cliquez sur « Enregistrer les modifications ». Vos clients paieront directement par Wave, MoMo ou carte avec leur montant prérempli.",
      quickAction: { label: isEn ? "Configure Gateways" : "Paramètres Paiement", tab: 'settings' }
    },
    {
      id: 'pay-2',
      category: 'payments',
      title: isEn ? "What happens if no online payment gateway is connected?" : "Que se passe-t-il si aucune passerelle en ligne n'est configurée ?",
      answer: isEn
        ? "No problem at all! The site automatically falls back to 'Paiement Manuel Mobile Money'. The buyer sees your official receiving phone number (MTN MoMo or Moov Money) and can confirm their transfer instantly via a pre-filled WhatsApp message."
        : "Aucune commande n'est bloquée ! Le site bascule automatiquement et de manière transparente sur le mode « Paiement Manuel Mobile Money ». L'acheteur voit votre numéro officiel récepteur (MTN MoMo ou Moov) et dispose d'un bouton direct WhatsApp pour vous envoyer la capture de son transfert."
    },
    {
      id: 'pay-3',
      category: 'payments',
      title: isEn ? "What is the difference between 'Live' and 'Sandbox' mode?" : "Quelle est la différence entre le mode « Réel » et le mode « Test » ?",
      answer: isEn
        ? "• Mode Réel (Production) : Encaisse de l'argent réel sur vos comptes marchands via Wave, MoMo et Cartes.\n• Mode Test (Sandbox) : Permet de simuler des transactions sans prélever d'argent réel, idéal pour tester vos scénarios de commande."
        : "• Mode Réel (Production) : Encaisse de véritables fonds sur vos comptes marchands via Wave, MTN MoMo, Moov ou Cartes.\n• Mode Test (Sandbox) : Permet de simuler des paiements fictifs avec des numéros de test sans prélever de véritable argent, idéal pour tester vos processus avant un lancement."
    },

    // 4. ORDERS & QUOTES
    {
      id: 'ord-1',
      category: 'orders',
      title: isEn ? "Where do quotation requests and customer orders arrive?" : "Où arrivent les demandes de devis et les commandes clients ?",
      answer: isEn
        ? "Every request submitted by a client arrives instantly in the 'Commandes & Devis' tab. You see their full name, country, phone, requested machines, and total estimated budget."
        : "Chaque demande envoyée par un client arrive instantanément dans l'onglet « Commandes & Devis ». Vous y retrouvez son nom complet, son pays avec drapeau, son numéro de téléphone, la liste chiffrée des machines choisies et le montant total estimé.",
      quickAction: { label: isEn ? "View Orders" : "Consulter les Devis", tab: 'orders' }
    },
    {
      id: 'ord-2',
      category: 'orders',
      title: isEn ? "How to contact a customer on WhatsApp in one click?" : "Comment contacter un client sur WhatsApp en 1 clic avec son dossier ?",
      answer: isEn
        ? "On any order line in the table, click the green WhatsApp button. It opens a chat with the client with a ready-to-send message quoting their exact order ID and total amount."
        : "Sur chaque ligne de commande, cliquez sur le bouton vert WhatsApp. Une discussion s'ouvre automatiquement avec le client en intégrant déjà sa référence de dossier et la formule de politesse personnalisée pour valider son acompte."
    },
    {
      id: 'ord-3',
      category: 'orders',
      title: isEn ? "How to cleanly print or save the official proforma quote as PDF?" : "Comment imprimer proprement le devis proforma officiel ?",
      answer: isEn
        ? "When viewing the quote summary, click 'Imprimer le Devis Officiel'. All website controls, buttons, footers, and menus are automatically hidden. Only the clean, branded proforma sheet with BEVULTA logo and validity terms is printed or saved as PDF."
        : "Dans la page du devis, cliquez sur le bouton « Imprimer le Devis Officiel » (ou faites Ctrl + P). Le système masque automatiquement la barre de navigation, les boutons d'action et le pied de page du site web. Seule la feuille proforma officielle avec le logo BEVULTA, les coordonnées et les conditions de validité est imprimée ou enregistrée en PDF propre."
    },
    {
      id: 'ord-4',
      category: 'orders',
      title: isEn ? "What is the 'Panier Moyen' (Average Order Value) and how is it calculated?" : "Qu'est-ce que le « Panier Moyen » et comment est-il calculé ?",
      answer: isEn
        ? "The Average Order Value (AOV / Panier Moyen) measures the average amount generated per quotation or sale on BEVULTA.\n\n• Calculation formula: (Total Collected Revenue + Pending Quotes) ÷ Total Number of Orders.\n\n• Strategic importance: It reveals whether clients are buying single units or complete industrial processing lines (e.g., Peeler + Grater + Press + Roaster for cassava processing).\n\n• Tips to increase it:\n1. Propose turnkey machine bundles with spare parts.\n2. Cross-sell practical training and digital production guides.\n3. Recommend heavy-duty dual-energy engine options (Diesel + Electric)."
        : "Le « Panier Moyen » (ou valeur moyenne d'un devis) mesure le montant moyen dépensé par un client ou prospect lors d'une commande d'équipement sur BEVULTA.\n\n• Formule de calcul : (Total Chiffre d'Affaires Encaissé + Devis en cours) ÷ Nombre total de commandes enregistrées.\n\n• Pourquoi cet indicateur est capital : Il vous indique en temps réel si vos clients achètent des machines individuelles ou des unités complètes de transformation industrielle (ex: Éplucheuse + Râpeuse + Presse hydraulique + Fourneau inox pour le gari/manioc).\n\n• 3 leviers concrets pour augmenter votre Panier Moyen :\n1. Proposer des packs complets clé en main (machine + jeu de pièces d'usure d'avance).\n2. Associer systématiquement un guide technique ou un atelier de formation pratique à la commande d'une machine.\n3. Valoriser les motorisations professionnelles durables (Thermique Diesel SIFANG 12 CV / Électrique Triphasé).",
      highlight: true,
      quickAction: { label: isEn ? "View Revenue & Basket" : "Voir Trésorerie & Panier", tab: 'overview' }
    },

    // 5. LANDING PAGE & CUSTOMIZATION
    {
      id: 'land-1',
      category: 'landing',
      title: isEn ? "How to modify the workshop phone numbers, address, and headline?" : "Comment modifier les numéros de téléphone, l'adresse et le slogan ?",
      answer: isEn
        ? "Go to the 'Landing Page' tab. You can update your main workshop phone number, secondary number, WhatsApp hotline, workshop physical address in Cotonou, and banner headlines. Changes appear immediately across the site and in quote footers."
        : "Ouvrez l'onglet « Landing Page » dans le menu de gauche. Vous pouvez modifier le numéro de téléphone principal de l'atelier, le numéro secondaire, le contact WhatsApp, l'adresse physique à Cotonou et le slogan principal. Vos modifications sont immédiatement visibles sur le site et reportées sur les devis proforma.",
      quickAction: { label: isEn ? "Edit Landing Page" : "Modifier la Vitrine", tab: 'landing' }
    },
    {
      id: 'land-2',
      category: 'landing',
      title: isEn ? "How to toggle home page sections (e.g. show/hide map or audio)?" : "Comment masquer ou réactiver des blocs de la page d'accueil ?",
      answer: isEn
        ? "In the 'Landing Page' tab under 'Visibilité des blocs', toggle the switches for each section (e.g., Stats ribbon, Featured machines, Interactive map, Audio synthesizer, Bottom banner). You have 100% control over which sections appear to the public."
        : "Dans l'onglet « Landing Page » sous la section « Visibilité des blocs », activez ou désactivez les interrupteurs pour chaque bloc (Ruban de statistiques, Machines vedettes, Carte interactive des livraisons, Synthétiseur audio, Bannière de contact). Vous pilotez l'affichage public en direct."
    },

    // 6. SECURITY & SESSION
    {
      id: 'sec-1',
      category: 'security',
      title: isEn ? "Do I stay logged in when refreshing the browser?" : "Dois-je me reconnecter à chaque rechargement de page ?",
      answer: isEn
        ? "No! Your admin session is now automatically remembered in your browser. You can navigate between pages, refresh (F5), or reopen your browser without having to re-enter your password."
        : "Non ! Votre session administrateur est désormais maintenue automatiquement. Vous pouvez recharger la page (F5), changer d'onglet ou revenir plus tard sans avoir besoin de ressaisir vos identifiants.",
      highlight: true
    },
    {
      id: 'sec-2',
      category: 'security',
      title: isEn ? "What are the default login credentials?" : "Quels sont les identifiants administrateur par défaut ?",
      answer: isEn
        ? "• E-mail : admin@bevulta.com (or shortcut 'admin')\n• Password : admin12345 (or shortcut 'admin')\nAlways click 'Déconnexion' at the bottom of the sidebar if you are on a public computer."
        : "• E-mail : admin@bevulta.com (ou identifiant court « admin »)\n• Mot de passe : admin12345 (ou mot de passe court « admin »)\nN'oubliez pas de cliquer sur « Déconnexion » tout en bas du menu si vous utilisez un ordinateur partagé."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '90px' }}>
      
      {/* Top Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, #042f1a 0%, #166534 100%)',
        borderRadius: '20px',
        padding: '32px 28px',
        color: '#ffffff',
        boxShadow: '0 8px 24px rgba(4, 47, 26, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={14} color="#86efac" />
            <span>{isEn ? "Administrator Knowledge Base" : "Guide Complet & Réponses Administrateur"}</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            {isEn ? "How can we help you today?" : "Comment pouvons-nous vous aider aujourd'hui ?"}
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#bbf7d0', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            {isEn 
              ? "Find immediate answers to all common questions about products, e-books, payments, quotes, and store management without waiting for technical support." 
              : "Retrouvez toutes les réponses et procédures pas à pas pour piloter votre catalogue, vos e-books, vos passerelles Mobile Money et vos devis en toute autonomie."}
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '560px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search a question (e.g. products, watermark, GeniusPay, orders)..." : "Rechercher une réponse (ex: produits, filigrane, GeniusPay, devis)..."}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '12px',
                border: 'none',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.92rem',
                outline: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: isActive ? '1px solid #166534' : '1px solid #e2e8f0',
                background: isActive ? '#166534' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 6px rgba(22, 101, 52, 0.2)' : 'none'
              }}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAQs List Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredFaqs.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px 24px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
            <Info size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 6px 0' }}>
              {isEn ? "No matching answers found" : "Aucun guide ne correspond à votre recherche"}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
              {isEn ? "Try searching with other keywords or select 'All Topics'." : "Essayez avec d'autres mots-clés ou réinitialisez le filtre de recherche."}
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              {isEn ? "Clear Search" : "Réinitialiser la recherche"}
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: faq.highlight ? '1.5px solid #86efac' : '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s'
                }}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isExpanded ? '#f8fafc' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: faq.highlight ? '#dcfce7' : '#f1f5f9',
                      color: faq.highlight ? '#166534' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <HelpCircle size={18} />
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                      {faq.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    {faq.highlight && (
                      <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                        {isEn ? "ESSENTIAL" : "ESSENTIEL"}
                      </span>
                    )}
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Accordion Body Answer */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px 64px', animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ 
                      fontSize: '0.88rem', 
                      color: '#334155', 
                      lineHeight: 1.6, 
                      whiteSpace: 'pre-line',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '14px'
                    }}>
                      {faq.answer}
                    </div>

                    {faq.quickAction && setActiveTab && (
                      <div style={{ marginTop: '14px' }}>
                        <button
                          type="button"
                          onClick={() => setActiveTab(faq.quickAction.tab)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#166534',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Zap size={14} />
                          <span>{faq.quickAction.label} &rarr;</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Credentials & Diagnostics Helper Box */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {/* Box 1: Identifiants de secours */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#166534" />
            <span>{isEn ? "Admin Login Credentials" : "Identifiants d'Accès Rapides"}</span>
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px 0' }}>
            {isEn ? "Official credentials configured for workshop managers." : "Identifiants officiels configurés pour l'administration de l'atelier."}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
              <span>E-mail : <strong>admin@bevulta.com</strong></span>
              <button 
                type="button" 
                onClick={() => handleCopy('email', 'admin@bevulta.com')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#166534' }}
                title="Copier"
              >
                {copiedKey === 'email' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
              <span>Mot de passe : <strong>admin12345</strong></span>
              <button 
                type="button" 
                onClick={() => handleCopy('pass', 'admin12345')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#166534' }}
                title="Copier"
              >
                {copiedKey === 'pass' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Box 2: Atelier Contacts & Assistance */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} color="#2563eb" />
            <span>{isEn ? "Direct Hotline & WhatsApp" : "Hotline & Ligne Directe Atelier"}</span>
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px 0' }}>
            {isEn ? "Emergency direct line for custom orders and assistance." : "Ligne prioritaire pour assistance technique et urgences atelier."}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href={`https://wa.me/${(settings?.whatsappNumber || '22997699178').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                background: '#16a34a',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Atelier</span>
            </a>

            <a
              href={`tel:${settings?.contactPhone1 || '+22997699178'}`}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <Phone size={16} />
              <span>{settings?.contactPhone1 || "(+229) 97 69 91 78"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

