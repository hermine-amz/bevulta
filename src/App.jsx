import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationModal from './components/NotificationModal';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';

// Initial Data
import { initialProducts } from './data/initialProducts';
import { Lock, User, LayoutDashboard, KeyRound, Globe, Sun, Moon } from 'lucide-react';
import { t } from './data/translations';
import { supabase } from './supabaseClient';

// Mock Initial Orders
const initialOrders = [
  {
    id: 'DEV-849204',
    date: '10/06/2026',
    clientName: 'Mamadou Touré',
    email: 'm.toure@agroholding-tg.com',
    phone: '+228 90 45 88 12',
    company: 'AgroHolding Togo',
    country: 'Togo',
    address: 'Lomé, Quartier Deckon, Rue des Hydrocarbures',
    notes: 'Prévoir alimentation triphasée 380V pour le broyeur',
    items: [
      { id: 1, name: 'Complexe de Karité', priceFcfa: 1600000, priceEur: 2443, quantity: 1, category: 'Matériels de transformation agro-alimentaire' },
      { id: 2, name: 'Baratteuse de Crème de Karité', priceFcfa: 450000, priceEur: 688, quantity: 2, category: 'Matériels de transformation agro-alimentaire' }
    ],
    subtotalFcfa: 2500000,
    totalFcfa: 2500000,
    totalEur: 3811,
    status: 'delivered'
  },
  {
    id: 'DEV-104928',
    date: '18/06/2026',
    clientName: 'Ibrahim Alassane',
    email: 'ibrahim.alassane@gmail.com',
    phone: '+227 96 11 00 24',
    company: 'Alimentation du Sahel',
    country: 'Niger',
    address: 'Niamey, Zone Industrielle, Route de Tillabéri',
    notes: 'Livraison par convoi sécurisé svp.',
    items: [
      { id: 6, name: 'Broyeur Mélangeur de Provende', priceFcfa: 1000000, priceEur: 1527, quantity: 1, category: 'Matériels de Spécialités' }
    ],
    subtotalFcfa: 1000000,
    totalFcfa: 1000000,
    totalEur: 1524,
    status: 'shipped'
  },
  {
    id: 'DEV-394029',
    date: '24/06/2026',
    clientName: 'Ablassé Ouédraogo',
    email: 'ablasse.oued@outlook.bf',
    phone: '+226 70 25 14 36',
    company: 'Coopérative Relwendé',
    country: 'Burkina Faso',
    address: 'Ouagadougou, Secteur 22, Route de Pô',
    notes: 'Moteur Diesel avec démarrage automatique si possible.',
    items: [
      { id: 3, name: 'Torréfacteur à Tambour', priceFcfa: 600000, priceEur: 917, quantity: 2, category: 'Matériels de transformation agro-alimentaire' }
    ],
    subtotalFcfa: 1200000,
    totalFcfa: 1200000,
    totalEur: 1830,
    status: 'manufacturing'
  }
];

// Mock Initial Messages
const initialMessages = [
  {
    id: 1,
    date: '15/06/2026',
    name: 'Sika Lawson',
    email: 'sika.lawson@yahoo.fr',
    phone: '+228 92 14 75 00',
    country: 'Togo',
    subject: 'Demande de devis spécifique',
    message: 'Bonjour, nous souhaiterions obtenir des informations concernant le prix d\'une décortiqueuse de riz avec une capacité de 1 tonne/heure. Fabriquez-vous des modèles plus grands que celui sur le catalogue ? Merci.',
    status: 'read'
  },
  {
    id: 2,
    date: '23/06/2026',
    name: 'Serge Gnonlonfoun',
    email: 'serge.gnon@gmail.com',
    phone: '+229 97 12 34 56',
    country: 'Bénin',
    subject: 'Service Après-Vente (SAV)',
    message: 'Bonjour, nous avons acheté un moteur Diesel Sifang l\'année dernière pour notre broyeur. Nous aurions besoin de remplacer le joint de culasse. En avez-vous en stock à votre atelier d\'Agla ? Cordialement.',
    status: 'unread'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return sessionStorage.getItem('bevulta_page') || 'home';
  });

  useEffect(() => {
    sessionStorage.setItem('bevulta_page', currentPage);
  }, [currentPage]);
  const [cart, setCart] = useState([]);
  
  // Translation & Theme states
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('bevulta_lang') || 'fr';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bevulta_theme') || 'light';
  });

  // Unified Session State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bevulta_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Database states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({
    contactPhone1: '(+229) 97 69 91 78',
    contactPhone2: '(+229) 01 97 45 50 12',
    contactEmail: 'bevulta@gmail.com',
    atelierAddress: 'C/3474 Agla Von FAN-MILK, Cotonou, Bénin',
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMotor, setSelectedMotor] = useState('Standard');

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    type: 'alert',
    onConfirm: null
  });
  const [notifications, setNotifications] = useState([]);

  // Show a toast notification (auto‑dismiss after 3 s)
  const showAlert = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type: 'info' }]);
    // Auto‑remove after timeout
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const showConfirm = (message, onConfirm) => {
    setModalState({ isOpen: true, message, type: 'confirm', onConfirm });
  };

  // Fetch all data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: prodData, error: prodErr } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (!prodErr && prodData && prodData.length > 0) {
          setProducts(prodData.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            subcategory: p.subcategory,
            description: p.description,
            priceFcfa: p.price_fcfa,
            priceEur: p.price_eur,
            availability: p.availability,
            image: p.image_url,
            specs: p.specs,
            isVisible: p.is_visible !== false,
            promoPriceFcfa: p.promo_price_fcfa || null,
            promoPriceEur: p.promo_price_eur || null,
          })));
        } else if (prodErr) {
          console.warn("Supabase fetch failed for products:", prodErr.message);
          setProducts(initialProducts); // fallback
        }

        // Fetch orders and items
        const { data: ordData, error: ordErr } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        if (!ordErr && ordData) {
          setOrders(ordData.map(o => ({
            id: o.id,
            date: o.created_at.split('T')[0],
            clientName: o.client_name,
            email: o.email,
            phone: o.phone,
            company: o.company,
            country: o.country,
            address: o.address,
            notes: o.notes,
            status: o.status,
            subtotalFcfa: o.subtotal_fcfa,
            totalFcfa: o.total_fcfa,
            totalEur: o.total_eur,
            items: o.order_items.map(item => ({
              id: item.product_id,
              name: "Product #" + item.product_id, // We'd ideally join with products, but this works for now or we map it from state
              quantity: item.quantity,
              priceFcfa: item.price_fcfa,
              priceEur: item.price_eur
            }))
          })));
        } else if (ordErr) {
          console.warn("Supabase fetch failed for orders:", ordErr.message);
          setOrders(initialOrders);
        }

        // Fetch messages
        const { data: msgData, error: msgErr } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (!msgErr && msgData) {
          setMessages(msgData.map(m => ({
            id: m.id,
            date: m.created_at.split('T')[0],
            name: m.name,
            email: m.email,
            phone: m.phone,
            country: m.country,
            subject: m.subject,
            message: m.message,
            status: m.status,
            ticketRef: m.ticket_ref,
            adminReply: m.admin_reply,
            replyDate: m.reply_date
          })));
        } else if (msgErr) {
          console.warn("Supabase fetch failed for messages:", msgErr.message);
          setMessages(initialMessages);
        }

        // Fetch settings
        const { data: setData, error: setErr } = await supabase.from('settings').select('*');
        if (!setErr && setData && setData.length > 0) {
          const newSettings = { ...settings };
          setData.forEach(s => {
            if (newSettings[s.key] !== undefined) newSettings[s.key] = s.value;
          });
          setSettings(newSettings);
        }

      } catch (err) {
        console.warn("Global fetch error:", err.message);
      }
    };
    fetchData();
  }, []);


  // Sync theme & lang
  useEffect(() => {
    localStorage.setItem('bevulta_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bevulta_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('bevulta_user', user ? JSON.stringify(user) : '');
  }, [user]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQty = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Order Submission
  const handleSubmitOrder = async (newOrder) => {
    // Optimistic local update
    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    try {
      const dbOrder = {
        client_name: newOrder.clientName,
        email: newOrder.email,
        phone: newOrder.phone,
        company: newOrder.company,
        country: newOrder.country,
        address: newOrder.address,
        notes: newOrder.notes,
        subtotal_fcfa: newOrder.subtotalFcfa,
        total_fcfa: newOrder.totalFcfa,
        total_eur: newOrder.totalEur,
        status: newOrder.status || 'pending',
      };

      if (user && user.id) {
        dbOrder.client_id = user.id;
      }

      // 1. Insert Order
      const { data: insertedOrder, error: orderError } = await supabase
        .from('orders')
        .insert([dbOrder])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Items
      if (insertedOrder && newOrder.items && newOrder.items.length > 0) {
        const itemsToInsert = newOrder.items.map(item => ({
          order_id: insertedOrder.id,
          product_id: typeof item.id === 'string' ? parseInt(item.id.split('-')[0]) || null : item.id,
          quantity: item.quantity,
          price_fcfa: item.priceFcfa,
          price_eur: item.priceEur
        }));
        const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      // Replace the local optimistic order with the real one to get correct UUID
      setOrders(prev => prev.map(o => o.id === newOrder.id ? {
        ...newOrder,
        id: insertedOrder.id,
        date: insertedOrder.created_at.split('T')[0]
      } : o));

    } catch (err) {
      console.error("Failed to sync order to Supabase:", err);
    }
  };

  // Message Submission
  const handleSendMessage = async (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    try {
      const dbMsg = {
        name: newMessage.name,
        email: newMessage.email,
        phone: newMessage.phone,
        country: newMessage.country,
        subject: newMessage.subject,
        message: newMessage.message,
        status: newMessage.status || 'unread',
        ticket_ref: newMessage.ticketRef
      };
      const { data: insertedMsg, error: msgError } = await supabase.from('messages').insert([dbMsg]).select().single();
      if (msgError) throw msgError;

      setMessages(prev => prev.map(m => m.id === newMessage.id ? {
        ...newMessage,
        id: insertedMsg.id,
        date: insertedMsg.created_at.split('T')[0]
      } : m));
    } catch (err) {
      console.error("Failed to sync message to Supabase:", err);
    }
  };

  // Product CRUD
  const addProduct = async (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    try {
      const dbProduct = {
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        description: newProduct.description,
        price_fcfa: newProduct.priceFcfa,
        price_eur: newProduct.priceEur,
        availability: newProduct.availability,
        image_url: newProduct.image,
        specs: newProduct.specs,
        is_visible: newProduct.isVisible !== false,
        promo_price_fcfa: newProduct.promoPriceFcfa ? Number(newProduct.promoPriceFcfa) : null,
        promo_price_eur: newProduct.promoPriceFcfa ? Math.round(Number(newProduct.promoPriceFcfa) / 655.957) : null,
      };
      await supabase.from('products').insert([dbProduct]);
    } catch (err) {
      console.error("Failed to sync new product to Supabase:", err);
    }
  };

  const updateProduct = async (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    try {
      const dbProduct = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        subcategory: updatedProduct.subcategory,
        description: updatedProduct.description,
        price_fcfa: updatedProduct.priceFcfa,
        price_eur: updatedProduct.priceEur,
        availability: updatedProduct.availability,
        image_url: updatedProduct.image,
        specs: updatedProduct.specs,
        is_visible: updatedProduct.isVisible !== false,
        promo_price_fcfa: updatedProduct.promoPriceFcfa ? Number(updatedProduct.promoPriceFcfa) : null,
        promo_price_eur: updatedProduct.promoPriceFcfa ? Math.round(Number(updatedProduct.promoPriceFcfa) / 655.957) : null,
      };
      await supabase.from('products').update(dbProduct).eq('id', updatedProduct.id);
    } catch (err) {
      console.error("Failed to sync updated product to Supabase:", err);
    }
  };

  const bulkUpdateProducts = async (ids, updates) => {
    setProducts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, ...updates } : p))
    );
    try {
      const dbUpdates = {};
      if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;
      if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
      
      if (Object.keys(dbUpdates).length > 0) {
        await supabase.from('products').update(dbUpdates).in('id', ids);
      }
    } catch (err) {
      console.error("Failed to sync bulk updated products to Supabase:", err);
    }
  };

  const deleteProduct = async (ids) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    showConfirm(
      lang === 'fr' 
        ? `Êtes-vous sûr de vouloir supprimer ${idsArray.length > 1 ? `ces ${idsArray.length} machines` : 'cette machine'} du catalogue ?` 
        : `Are you sure you want to delete ${idsArray.length > 1 ? `these ${idsArray.length} machines` : 'this machine'}?`,
      async () => {
        setProducts((prev) => prev.filter((p) => !idsArray.includes(p.id)));
        try {
          await supabase.from('products').delete().in('id', idsArray);
        } catch (err) {
          console.error("Failed to sync deleted product to Supabase:", err);
        }
      }
    );
  };

  const handleAddWithMotor = () => {
    if (!selectedProduct) return;
    const basePrice = selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa;
    const productWithMotor = {
      ...selectedProduct,
      id: selectedMotor === 'Standard' ? selectedProduct.id : `${selectedProduct.id}-${selectedMotor.replace(/\s+/g, '-')}`,
      name: selectedMotor === 'Standard' ? selectedProduct.name : `${selectedProduct.name} (${selectedMotor})`,
      priceFcfa: selectedMotor === 'Standard' ? basePrice :
                 selectedMotor.includes('5.5 kW') ? basePrice + 150000 :
                 selectedMotor.includes('8 CV') ? basePrice + 250000 :
                 selectedMotor.includes('13 CV') ? basePrice + 300000 :
                 basePrice,
      priceEur: Math.round((selectedMotor === 'Standard' ? basePrice :
                 selectedMotor.includes('5.5 kW') ? basePrice + 150000 :
                 selectedMotor.includes('8 CV') ? basePrice + 250000 :
                 selectedMotor.includes('13 CV') ? basePrice + 300000 :
                 basePrice) / 655.957),
      specs: {
        ...selectedProduct.specs,
        "Motorisation": selectedMotor
      }
    };
    addToCart(productWithMotor);
    setSelectedProduct(null);
    setSelectedMotor('Standard');
    showAlert(lang === 'en' ? "Product added to Quote!" : "Équipement configuré et ajouté au Devis !");
  };

  // Order status management
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    // Ignore local mock IDs starting with DEV- (if any got stuck)
    if (typeof orderId === 'string' && !orderId.startsWith('DEV-')) {
      try {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      } catch (err) {
        console.error("Failed to update order status:", err);
      }
    }
  };

  const deleteOrder = async (orderId) => {
    showConfirm(
      lang === 'fr' ? "Voulez-vous vraiment supprimer définitivement cette commande ?" : "Are you sure you want to delete this order?",
      async () => {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (typeof orderId === 'string' && !orderId.startsWith('DEV-')) {
          try {
            await supabase.from('orders').delete().eq('id', orderId);
          } catch (err) {
            console.error("Failed to delete order:", err);
          }
        }
      }
    );
  };

  // Message Actions
  const markMessageRead = async (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m))
    );
    if (typeof id === 'number' || (typeof id === 'string' && !id.startsWith('MSG-'))) {
      try {
        await supabase.from('messages').update({ status: 'read' }).eq('id', id);
      } catch (err) {
        console.error("Failed to mark message read in Supabase:", err);
      }
    }
  };

  const deleteMessage = async (id) => {
    showConfirm(
      lang === 'fr' ? "Supprimer ce message ?" : "Delete this message?",
      async () => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (typeof id === 'number' || (typeof id === 'string' && !id.startsWith('MSG-'))) {
          try {
            await supabase.from('messages').delete().eq('id', id);
          } catch (err) {
            console.error("Failed to delete message in Supabase:", err);
          }
        }
      }
    );
  };

  const replyMessage = async (id, replyText) => {
    const formattedDate = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: 'replied', adminReply: replyText, replyDate: formattedDate } : m)
    );
    try {
      await supabase.from('messages').update({ 
        status: 'replied', 
        admin_reply: replyText,
        reply_date: formattedDate
      }).eq('id', id);
    } catch (err) {
      console.error("Failed to save reply to Supabase:", err);
    }
  };

  const updateMessageStatus = async (id, newStatus) => {
    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: newStatus } : m)
    );
    try {
      await supabase.from('messages').update({ status: newStatus }).eq('id', id);
    } catch (err) {
      console.error("Failed to update message status in Supabase:", err);
    }
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      const upserts = Object.keys(newSettings).map(key => ({
        key,
        value: newSettings[key]
      }));
      await supabase.from('settings').upsert(upserts);
    } catch (err) {
      console.error("Failed to update settings in Supabase:", err);
    }
  };

  // Login Action
  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanId = loginIdentifier.trim();
    const cleanPass = loginPassword.trim();

    // 1. Check local demo credentials first for testing ease
    if (cleanId === 'admin@bevulta.com' && cleanPass === 'admin12345') {
      const loggedUser = { email: 'admin@bevulta.com', name: 'Administrator', role: 'admin' };
      setUser(loggedUser);
      setCurrentPage('admin');
      setLoginIdentifier('');
      setLoginPassword('');
      return;
    }

    if ((cleanId === 'client' || cleanId === 'client@bevulta.com' || cleanId === 'm.toure@agroholding-tg.com') && cleanPass === 'client') {
      // Set email to m.toure@agroholding-tg.com so they pull the matching mock orders
      const loggedUser = { 
        email: 'm.toure@agroholding-tg.com', 
        name: 'Mamadou Touré', 
        role: 'client',
        phone: '+228 90 45 88 12',
        company: 'AgroHolding Togo',
        country: 'Togo',
        address: 'Lomé, Quartier Deckon, Rue des Hydrocarbures'
      };
      setUser(loggedUser);
      setCurrentPage('client-dashboard');
      setLoginIdentifier('');
      setLoginPassword('');
      return;
    }

    // 2. Try Supabase Auth if credentials differ
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanId,
        password: cleanPass
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const role = data.user.email.toLowerCase().includes('admin') ? 'admin' : 'client';
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || (role === 'admin' ? 'Administrator' : 'Client'),
          role: role
        };
        setUser(loggedUser);
        setCurrentPage(role === 'admin' ? 'admin' : 'client-dashboard');
        setLoginIdentifier('');
        setLoginPassword('');
      }
    } catch (err) {
      console.warn("Supabase Auth failed or bypassed. Details:", err.message);
      showAlert(lang === 'fr' 
        ? `Identifiants incorrects. Pour tester, utilisez :\n- admin / admin (Admin)\n- client / client (Client)`
        : `Invalid credentials. For testing, please use:\n- admin / admin (Admin)\n- client / client (Client)`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bevulta_user');
    setCurrentPage('home');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Protected Admin Route bypass rendering
  if (currentPage === 'admin' && user?.role === 'admin') {
    return (
      <>
        <AdminDashboard
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          bulkUpdateProducts={bulkUpdateProducts}
          deleteProduct={deleteProduct}
          orders={orders}
          addOrder={handleSubmitOrder}
          updateOrderStatus={updateOrderStatus}
          deleteOrder={deleteOrder}
          messages={messages}
          markMessageRead={markMessageRead}
          deleteMessage={deleteMessage}
          replyMessage={replyMessage}
          updateMessageStatus={updateMessageStatus}
          logoutAdmin={handleLogout}
          settings={settings}
          updateSettings={updateSettings}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          showAlert={showAlert}
          showConfirm={showConfirm}
          goHome={() => setCurrentPage('home')}
        />
        <NotificationModal 
          isOpen={modalState.isOpen}
          message={modalState.message}
          type={modalState.type}
          onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
          onConfirm={modalState.onConfirm}
          lang={lang}
        />

        {/* TOAST NOTIFICATIONS – Admin */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
        }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              padding: '14px 18px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              border: '1px solid var(--border-subtle)',
              minWidth: '260px',
              maxWidth: '380px',
              fontSize: '0.9rem',
              fontWeight: '500',
              animation: 'slideInRight 0.3s ease',
            }}>
              <span style={{
                width: '10px', height: '10px',
                borderRadius: '50%',
                backgroundColor: n.type === 'error' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#22c55e',
                flexShrink: 0,
              }} />
              <span style={{ flex: 1 }}>{n.message}</span>
              <button
                onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1,
                  padding: '0 2px',
                }}
              >×</button>
            </div>
          ))}
        </div>
      </>
    );
  }


  // Unified login screen wrapper
  const renderLogin = () => {
    return (
      <div className="login-container" style={{ padding: '120px 24px 80px' }}>
        <div className="login-card">
          <div className="login-header">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <KeyRound size={28} />
            </div>
            <h2>{t('loginTitle', lang)}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              {t('loginSubtitle', lang)}
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">{t('loginIdentifier', lang)}</label>
              <input
                type="text"
                className="form-input"
                placeholder={lang === 'fr' ? "Ex: admin ou client@bevulta.com" : "Ex: admin or client@bevulta.com"}
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">{t('loginPassword', lang)}</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Lock size={16} />
              <span>{t('btnLogin', lang)}</span>
            </button>

            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => setCurrentPage('home')}
            >
              {t('loginReturn', lang)}
            </button>
          </form>

          <div style={{ marginTop: '24px', backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            {t('loginDemoTip', lang)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {currentPage !== 'admin' && (
        <>
          <div className="bg-decor-blob-1"></div>
          <div className="bg-decor-blob-2"></div>
        </>
      )}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        cartCount={cartCount}
        user={user}
        handleLogout={handleLogout}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        settings={settings}
      />
      <NotificationModal 
        isOpen={modalState.isOpen}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalState.onConfirm}
        lang={lang}
      />

      <main className="main-content" style={{ flexGrow: 1 }}>
        {currentPage === 'home' && (
          <Home 
            setCurrentPage={setCurrentPage} 
            lang={lang} 
            products={products} 
            setSelectedProduct={setSelectedProduct} 
          />
        )}
        {currentPage === 'catalog' && (
          <Catalog 
            products={products} 
            addToCart={addToCart} 
            removeFromCart={removeFromCart}
            cart={cart}
            lang={lang}
            setSelectedProduct={setSelectedProduct}
            setSelectedMotor={setSelectedMotor}
            showAlert={showAlert}
            showConfirm={showConfirm}
          />
        )}
        {currentPage === 'services' && <Services lang={lang} />}
        {currentPage === 'about' && <About lang={lang} />}
        {currentPage === 'contact' && <Contact onSendMessage={handleSendMessage} lang={lang} showAlert={showAlert} showConfirm={showConfirm} />}
        {currentPage === 'order' && (
          <Order 
            cart={cart} 
            updateQty={updateQty} 
            removeFromCart={removeFromCart} 
            clearCart={clearCart}
            onSubmitOrder={handleSubmitOrder}
            lang={lang}
            showAlert={showAlert}
            showConfirm={showConfirm}
          />
        )}
        {currentPage === 'login' && renderLogin()}
        {currentPage === 'client-dashboard' && user?.role === 'client' && (
          <ClientDashboard
            user={user}
            orders={orders}
            messages={messages.filter(m => m.email?.toLowerCase() === user?.email?.toLowerCase())}
            onLogout={handleLogout}
            lang={lang}
            goHome={() => setCurrentPage('home')}
            showAlert={showAlert}
            showConfirm={showConfirm}
          />
        )}
        {(currentPage === 'client-dashboard' && user?.role !== 'client') && renderLogin()}
      </main>

      {/* GLOBAL PRODUCT DETAILS CONFIGURATION MODAL */}
      {selectedProduct && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="modal-content" style={{ maxWidth: '850px', padding: '32px' }}>
            <button 
              className="modal-close" 
              onClick={() => { setSelectedProduct(null); setSelectedMotor('Standard'); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }}
            >
              ×
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '32px', marginTop: '16px' }} className="crud-grid">
              {/* Product Image & Specs */}
              <div>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} 
                />
                
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
                    {lang === 'en' ? "Technical Specifications" : "Spécifications Techniques"}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '2px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                      <strong>{lang === 'en' ? "Category" : "Catégorie"}</strong>
                      <span style={{ textAlign: 'right', marginLeft: '12px' }}>{selectedProduct.category}</span>
                    </div>
                    {selectedProduct.subcategory && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '2px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                        <strong>Subcategory</strong>
                        <span style={{ textAlign: 'right', marginLeft: '12px' }}>{selectedProduct.subcategory}</span>
                      </div>
                    )}
                    {Object.entries(selectedProduct.specs || {}).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '2px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                        <strong>{key}</strong>
                        <span style={{ textAlign: 'right', marginLeft: '12px' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Product Info & Cart Customization Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-agro" style={{ marginBottom: '12px' }}>
                    {selectedProduct.subcategory || selectedProduct.category}
                  </span>
                  
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', marginBottom: '12px' }}>{selectedProduct.name}</h2>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                    {selectedProduct.description}
                  </p>

                  {/* Motor Configuration Option dropdown selector */}
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {lang === 'en' ? "Select Motorization option" : "Configurer la Motorisation Optionnelle"}
                    </label>
                    <select 
                      className="form-input" 
                      value={selectedMotor}
                      onChange={(e) => setSelectedMotor(e.target.value)}
                      style={{ cursor: 'pointer', padding: '10px 14px', fontSize: '0.88rem' }}
                    >
                      <option value="Standard">{lang === 'en' ? "Standard / base configuration" : "Standard (Configuration de base)"}</option>
                      <option value="Moteur Électrique 5.5 kW">{lang === 'en' ? "Electric Motor 5.5 kW (+150,000 FCFA)" : "Moteur Électrique 5.5 kW (+150 000 FCFA)"}</option>
                      <option value="Moteur Diesel Sifang 8 CV">{lang === 'en' ? "Diesel Motor Sifang 8 HP (+250,000 FCFA)" : "Moteur Diesel Sifang 8 CV (+250 000 FCFA)"}</option>
                      <option value="Moteur Essence 13 CV">{lang === 'en' ? "Gasoline Motor 13 HP (+300,000 FCFA)" : "Moteur Essence 13 CV (+300 000 FCFA)"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  {/* Dynamic Pricing display box */}
                  <div style={{ 
                    backgroundColor: 'var(--bg-surface)', 
                    padding: '12px 16px', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--border-subtle)', 
                    marginBottom: '16px' 
                  }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                      {lang === 'en' ? "Estimated Price with Option" : "Estimation Prix avec Option"}
                    </div>
                    {selectedProduct.promoPriceFcfa && selectedMotor === 'Standard' && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '4px' }}>
                        {selectedProduct.priceFcfa.toLocaleString()} FCFA ({selectedProduct.priceEur.toLocaleString()} €)
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1.45rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                        {(
                          selectedMotor === 'Standard' ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) :
                          selectedMotor.includes('5.5 kW') ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) + 150000 :
                          selectedMotor.includes('8 CV') ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) + 250000 :
                          selectedMotor.includes('13 CV') ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) + 300000 :
                          (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa)
                        ).toLocaleString()} FCFA
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        (≈ {(
                          Math.round((
                            selectedMotor === 'Standard' ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) :
                            selectedMotor.includes('5.5 kW') ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) + 150000 :
                            selectedMotor.includes('8 CV') ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) + 250000 :
                            selectedMotor.includes('13 CV') ? (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa) + 300000 :
                            (selectedProduct.promoPriceFcfa || selectedProduct.priceFcfa)
                          ) / 655.957)
                        ).toLocaleString()} €)
                      </span>
                      {selectedProduct.promoPriceFcfa && (
                        <span className="badge badge-special" style={{ fontSize: '0.62rem', padding: '1px 5px', textTransform: 'uppercase' }}>Promo</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleAddWithMotor}
                      style={{ flexGrow: 1, padding: '10px 20px' }}
                    >
                      <ShoppingCart size={16} />
                      <span>{t('btnRequestQuote', lang)}</span>
                    </button>
                    
                    <button 
                      className="btn btn-outline" 
                      onClick={() => { setSelectedProduct(null); setSelectedMotor('Standard'); }}
                      style={{ padding: '10px 20px' }}
                    >
                      {lang === 'en' ? "Back" : "Retour"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer setCurrentPage={setCurrentPage} lang={lang} />

      {/* TOAST NOTIFICATIONS */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            padding: '14px 18px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            border: '1px solid var(--border-subtle)',
            minWidth: '260px',
            maxWidth: '380px',
            fontSize: '0.9rem',
            fontWeight: '500',
            animation: 'slideInRight 0.3s ease',
          }}>
            <span style={{
              width: '10px', height: '10px',
              borderRadius: '50%',
              backgroundColor: n.type === 'error' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#22c55e',
              flexShrink: 0,
            }} />
            <span style={{ flex: 1 }}>{n.message}</span>
            <button
              onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1,
                padding: '0 2px',
              }}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
