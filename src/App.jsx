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
import Ebooks from './pages/Ebooks';
import TrackOrder from './pages/TrackOrder';
import Formations from './pages/Formations';

// Initial Data
import { initialProducts } from './data/initialProducts';
import { initialEbooks } from './data/initialEbooks';
import { defaultSettings } from './data/defaultSettings';
import { Lock, User, LayoutDashboard, KeyRound, Globe, Sun, Moon, ShoppingCart } from 'lucide-react';
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
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const handleGoToTracking = (orderId) => {
    setTrackingOrderId(orderId);
    setCurrentPage('track');
  };
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
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bevulta_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [ebooks, setEbooks] = useState(() => {
    const saved = localStorage.getItem('bevulta_ebooks');
    return saved ? JSON.parse(saved) : initialEbooks;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bevulta_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('bevulta_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('bevulta_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
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

  // Restore authenticated session from Supabase on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const role = session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'client';
          const loggedUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || (role === 'admin' ? 'Administrator' : 'Client'),
            role: role
          };
          setUser(loggedUser);
          localStorage.setItem('bevulta_user', JSON.stringify(loggedUser));
        }
      } catch (err) {
        console.warn("Session restore error:", err);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const role = session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'client';
        const loggedUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || (role === 'admin' ? 'Administrator' : 'Client'),
          role: role
        };
        setUser(loggedUser);
        localStorage.setItem('bevulta_user', JSON.stringify(loggedUser));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('bevulta_user');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch all data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: prodData, error: prodErr } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (!prodErr && prodData && prodData.length > 0) {
          const mapped = prodData.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            subcategory: p.subcategory,
            description: p.description,
            priceFcfa: p.price_fcfa,
            priceEur: p.price_eur,
            availability: p.availability,
            image: p.image_url,
            specs: p.specs || {},
            isVisible: p.specs?._isVisible !== undefined ? p.specs._isVisible : true,
            promoPriceFcfa: p.specs?._promoPriceFcfa || null,
            promoPriceEur: p.specs?._promoPriceFcfa ? Math.round(Number(p.specs._promoPriceFcfa) / 655.957) : null,
          }));
          setProducts(mapped);
          localStorage.setItem('bevulta_products', JSON.stringify(mapped));
        } else if (prodErr) {
          console.warn("Supabase fetch failed for products, using cached products:", prodErr.message);
          const saved = localStorage.getItem('bevulta_products');
          if (saved) setProducts(JSON.parse(saved));
        }

        // Fetch orders and items with dual persistence
        const { data: ordData, error: ordErr } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        if (!ordErr && ordData && ordData.length > 0) {
          const mappedOrders = ordData.map(o => ({
            id: o.id,
            date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
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
            items: (o.order_items || []).map(item => ({
              id: item.product_id,
              name: "Product #" + item.product_id,
              quantity: item.quantity,
              priceFcfa: item.price_fcfa,
              priceEur: item.price_eur
            }))
          }));
          setOrders(mappedOrders);
          localStorage.setItem('bevulta_orders', JSON.stringify(mappedOrders));
        } else if (!ordErr && ordData && ordData.length === 0) {
          const saved = localStorage.getItem('bevulta_orders');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.length > 0) setOrders(parsed);
            } catch (e) {}
          }
        } else if (ordErr) {
          console.warn("Supabase fetch failed for orders:", ordErr.message);
          const saved = localStorage.getItem('bevulta_orders');
          if (saved) {
            try {
              setOrders(JSON.parse(saved));
            } catch (e) {
              setOrders(initialOrders);
            }
          } else {
            setOrders(initialOrders);
          }
        }

        // Fetch messages with dual persistence
        const { data: msgData, error: msgErr } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (!msgErr && msgData && msgData.length > 0) {
          const mappedMsgs = msgData.map(m => ({
            id: m.id,
            date: m.created_at ? m.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
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
          }));
          setMessages(mappedMsgs);
          localStorage.setItem('bevulta_messages', JSON.stringify(mappedMsgs));
        } else if (!msgErr && msgData && msgData.length === 0) {
          const saved = localStorage.getItem('bevulta_messages');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.length > 0) setMessages(parsed);
            } catch (e) {}
          }
        } else if (msgErr) {
          console.warn("Supabase fetch failed for messages:", msgErr.message);
          const saved = localStorage.getItem('bevulta_messages');
          if (saved) {
            try {
              setMessages(JSON.parse(saved));
            } catch (e) {
              setMessages(initialMessages);
            }
          } else {
            setMessages(initialMessages);
          }
        }

        // Fetch settings
        const { data: setData, error: setErr } = await supabase.from('settings').select('*');
        if (!setErr && setData && setData.length > 0) {
          setSettings(prev => {
            const updated = { ...prev };
            setData.forEach(s => {
              let val = s.value;
              if (val === 'true') val = true;
              if (val === 'false') val = false;
              updated[s.key] = val;
            });
            localStorage.setItem('bevulta_settings', JSON.stringify(updated));
            return updated;
          });
        }

        // Fetch ebooks
        const { data: ebData, error: ebErr } = await supabase.from('ebooks').select('*').order('id', { ascending: true });
        if (!ebErr && ebData && ebData.length > 0) {
          setEbooks(ebData.map(b => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            category: b.category,
            isPack: b.is_pack === true,
            includedBooks: b.included_books || [],
            priceFcfa: b.price_fcfa,
            priceEur: b.price_eur,
            promoPriceFcfa: b.promo_price_fcfa || null,
            promoPriceEur: b.promo_price_eur || null,
            pages: b.pages,
            fileFormat: b.file_format,
            language: b.language,
            author: b.author,
            badge: b.badge,
            coverImage: b.cover_image,
            downloadUrl: b.download_url,
            isVisible: b.is_visible !== false,
            featured: b.featured === true
          })));
        }

      } catch (err) {
        console.warn("Global fetch error:", err.message);
      }
    };
    fetchData();
  }, []);

  // Sync ebooks to localStorage
  useEffect(() => {
    localStorage.setItem('bevulta_ebooks', JSON.stringify(ebooks));
  }, [ebooks]);

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

  // Order Submission with local backup
  const handleSubmitOrder = async (newOrder) => {
    // Optimistic local update
    setOrders((prevOrders) => {
      const updated = [newOrder, ...prevOrders];
      localStorage.setItem('bevulta_orders', JSON.stringify(updated));
      return updated;
    });

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
      setOrders(prev => {
        const updated = prev.map(o => o.id === newOrder.id ? {
          ...newOrder,
          id: insertedOrder.id,
          date: insertedOrder.created_at.split('T')[0]
        } : o);
        localStorage.setItem('bevulta_orders', JSON.stringify(updated));
        return updated;
      });

    } catch (err) {
      console.error("Failed to sync order to Supabase (saved locally in browser):", err);
    }
  };

  // Message Submission with local backup
  const handleSendMessage = async (newMessage) => {
    setMessages((prevMessages) => {
      const updated = [newMessage, ...prevMessages];
      localStorage.setItem('bevulta_messages', JSON.stringify(updated));
      return updated;
    });
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

      setMessages(prev => {
        const updated = prev.map(m => m.id === newMessage.id ? {
          ...newMessage,
          id: insertedMsg.id,
          date: insertedMsg.created_at.split('T')[0]
        } : m);
        localStorage.setItem('bevulta_messages', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to sync message to Supabase (saved locally in browser):", err);
    }
  };

  // Product CRUD
  const addProduct = async (newProduct) => {
    // Determine a safe numeric ID
    const maxId = products.reduce((max, p) => (typeof p.id === 'number' && p.id > max ? p.id : max), 16);
    const assignedId = typeof newProduct.id === 'number' && newProduct.id < 100000 ? newProduct.id : maxId + 1;
    const finalProduct = { ...newProduct, id: assignedId };

    setProducts((prev) => {
      const next = [finalProduct, ...prev];
      localStorage.setItem('bevulta_products', JSON.stringify(next));
      return next;
    });

    try {
      const dbProduct = {
        id: assignedId,
        name: finalProduct.name,
        category: finalProduct.category,
        subcategory: finalProduct.subcategory || 'Matériels de transformation de Karité',
        description: finalProduct.description || '',
        price_fcfa: Number(finalProduct.priceFcfa) || 0,
        price_eur: finalProduct.priceEur || Math.round((Number(finalProduct.priceFcfa) || 0) / 655.957),
        availability: finalProduct.availability || 'Sur commande (15-30 jours)',
        image_url: finalProduct.image || '',
        specs: {
          ...(finalProduct.specs || {}),
          _isVisible: finalProduct.isVisible !== false,
          _promoPriceFcfa: finalProduct.promoPriceFcfa ? Number(finalProduct.promoPriceFcfa) : null,
        }
      };
      const { error } = await supabase.from('products').insert([dbProduct]);
      if (error) console.error("Failed to sync new product to Supabase:", error);
    } catch (err) {
      console.error("Failed to sync new product to Supabase:", err);
    }
  };

  const updateProduct = async (updatedProduct) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      localStorage.setItem('bevulta_products', JSON.stringify(next));
      return next;
    });

    try {
      const dbProduct = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        subcategory: updatedProduct.subcategory || 'Matériels de transformation de Karité',
        description: updatedProduct.description || '',
        price_fcfa: Number(updatedProduct.priceFcfa) || 0,
        price_eur: updatedProduct.priceEur || Math.round((Number(updatedProduct.priceFcfa) || 0) / 655.957),
        availability: updatedProduct.availability || 'Sur commande (15-30 jours)',
        image_url: updatedProduct.image || '',
        specs: {
          ...(updatedProduct.specs || {}),
          _isVisible: updatedProduct.isVisible !== false,
          _promoPriceFcfa: updatedProduct.promoPriceFcfa ? Number(updatedProduct.promoPriceFcfa) : null,
        }
      };
      const { error } = await supabase.from('products').update(dbProduct).eq('id', updatedProduct.id);
      if (error) console.error("Failed to sync updated product to Supabase:", error);
    } catch (err) {
      console.error("Failed to sync updated product to Supabase:", err);
    }
  };

  const bulkUpdateProducts = async (ids, updates) => {
    setProducts((prev) => {
      const next = prev.map((p) => (ids.includes(p.id) ? { ...p, ...updates } : p));
      localStorage.setItem('bevulta_products', JSON.stringify(next));
      return next;
    });

    try {
      for (const id of ids) {
        const prod = products.find(p => p.id === id);
        if (!prod) continue;
        const newAvailability = updates.availability !== undefined ? updates.availability : prod.availability;
        const newIsVisible = updates.isVisible !== undefined ? updates.isVisible : prod.isVisible;

        await supabase.from('products').update({
          availability: newAvailability,
          specs: {
            ...(prod.specs || {}),
            _isVisible: newIsVisible
          }
        }).eq('id', id);
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
        setProducts((prev) => {
          const next = prev.filter((p) => !idsArray.includes(p.id));
          localStorage.setItem('bevulta_products', JSON.stringify(next));
          return next;
        });
        try {
          const { error } = await supabase.from('products').delete().in('id', idsArray);
          if (error) console.error("Failed to sync deleted product to Supabase:", error);
        } catch (err) {
          console.error("Failed to sync deleted product to Supabase:", err);
        }
      }
    );
  };

  // E-books CRUD
  const addEbook = async (newEbook) => {
    setEbooks((prev) => [newEbook, ...prev]);
    try {
      const dbEbook = {
        id: newEbook.id,
        title: newEbook.title,
        subtitle: newEbook.subtitle,
        category: newEbook.category,
        is_pack: newEbook.isPack === true,
        included_books: newEbook.includedBooks || [],
        price_fcfa: newEbook.priceFcfa,
        price_eur: newEbook.priceEur,
        promo_price_fcfa: newEbook.promoPriceFcfa ? Number(newEbook.promoPriceFcfa) : null,
        promo_price_eur: newEbook.promoPriceEur ? Number(newEbook.promoPriceEur) : null,
        pages: newEbook.pages,
        file_format: newEbook.fileFormat,
        language: newEbook.language,
        author: newEbook.author,
        badge: newEbook.badge,
        cover_image: newEbook.coverImage,
        download_url: newEbook.downloadUrl,
        is_visible: newEbook.isVisible !== false,
        featured: Boolean(newEbook.featured)
      };
      await supabase.from('ebooks').insert([dbEbook]);
    } catch (err) {
      console.error("Failed to sync new ebook to Supabase:", err);
    }
  };

  const updateEbook = async (updatedEbook) => {
    setEbooks((prev) =>
      prev.map((b) => (b.id === updatedEbook.id ? updatedEbook : b))
    );
    try {
      const dbEbook = {
        title: updatedEbook.title,
        subtitle: updatedEbook.subtitle,
        category: updatedEbook.category,
        is_pack: updatedEbook.isPack === true,
        included_books: updatedEbook.includedBooks || [],
        price_fcfa: updatedEbook.priceFcfa,
        price_eur: updatedEbook.priceEur,
        promo_price_fcfa: updatedEbook.promoPriceFcfa ? Number(updatedEbook.promoPriceFcfa) : null,
        promo_price_eur: updatedEbook.promoPriceEur ? Number(updatedEbook.promoPriceEur) : null,
        pages: updatedEbook.pages,
        file_format: updatedEbook.fileFormat,
        language: updatedEbook.language,
        author: updatedEbook.author,
        badge: updatedEbook.badge,
        cover_image: updatedEbook.coverImage,
        download_url: updatedEbook.downloadUrl,
        is_visible: updatedEbook.isVisible !== false,
        featured: Boolean(updatedEbook.featured)
      };
      await supabase.from('ebooks').update(dbEbook).eq('id', updatedEbook.id);
    } catch (err) {
      console.error("Failed to sync updated ebook to Supabase:", err);
    }
  };

  const deleteEbook = async (ids) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    setEbooks((prev) => prev.filter((b) => !idsArray.includes(b.id)));
    try {
      await supabase.from('ebooks').delete().in('id', idsArray);
    } catch (err) {
      console.error("Failed to sync deleted ebook to Supabase:", err);
    }
  };

  const bulkUpdateEbooks = async (ids, updates) => {
    setEbooks((prev) =>
      prev.map((b) => (ids.includes(b.id) ? { ...b, ...updates } : b))
    );
    try {
      const dbUpdates = {};
      if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;
      if (Object.keys(dbUpdates).length > 0) {
        await supabase.from('ebooks').update(dbUpdates).in('id', ids);
      }
    } catch (err) {
      console.error("Failed to sync bulk updated ebooks to Supabase:", err);
    }
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
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem('bevulta_orders', JSON.stringify(updated));
      return updated;
    });
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
        setOrders((prev) => {
          const updated = prev.filter((o) => o.id !== orderId);
          localStorage.setItem('bevulta_orders', JSON.stringify(updated));
          return updated;
        });
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
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m));
      localStorage.setItem('bevulta_messages', JSON.stringify(updated));
      return updated;
    });
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
        setMessages((prev) => {
          const updated = prev.filter((m) => m.id !== id);
          localStorage.setItem('bevulta_messages', JSON.stringify(updated));
          return updated;
        });
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
    setMessages((prev) => {
      const updated = prev.map((m) => m.id === id ? { ...m, status: 'replied', adminReply: replyText, replyDate: formattedDate } : m);
      localStorage.setItem('bevulta_messages', JSON.stringify(updated));
      return updated;
    });
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
    setMessages((prev) => {
      const updated = prev.map((m) => m.id === id ? { ...m, status: newStatus } : m);
      localStorage.setItem('bevulta_messages', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('messages').update({ status: newStatus }).eq('id', id);
    } catch (err) {
      console.error("Failed to update message status in Supabase:", err);
    }
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('bevulta_settings', JSON.stringify(newSettings));
    try {
      const upserts = Object.keys(newSettings).map(key => ({
        key,
        value: typeof newSettings[key] === 'boolean' ? String(newSettings[key]) : (newSettings[key] ?? '')
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

    // 1. Try Supabase Auth first with automatic normalization
    try {
      const authEmail = (cleanId === 'admin' || cleanId === 'admin@bevulta.com') ? 'admin@bevulta.com' : cleanId;
      const authPass = (cleanId === 'admin' && cleanPass === 'admin') ? 'admin12345' : cleanPass;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPass
      });

      if (!error && data?.user) {
        const role = data.user.email?.toLowerCase().includes('admin') ? 'admin' : 'client';
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || (role === 'admin' ? 'Administrator' : 'Client'),
          role: role
        };
        setUser(loggedUser);
        localStorage.setItem('bevulta_user', JSON.stringify(loggedUser));
        setCurrentPage(role === 'admin' ? 'admin' : 'client-dashboard');
        setLoginIdentifier('');
        setLoginPassword('');
        showAlert(lang === 'fr' ? 'Connexion réussie !' : 'Logged in successfully!');
        return;
      }
    } catch (err) {
      console.warn("Supabase Auth error:", err.message);
    }

    // 2. Client demo fallback
    if ((cleanId === 'client' || cleanId === 'client@bevulta.com' || cleanId === 'm.toure@agroholding-tg.com') && cleanPass === 'client') {
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
      localStorage.setItem('bevulta_user', JSON.stringify(loggedUser));
      setCurrentPage('client-dashboard');
      setLoginIdentifier('');
      setLoginPassword('');
      return;
    }

    // 3. Fallback admin demo (offline/no network fallback)
    if ((cleanId === 'admin' || cleanId === 'admin@bevulta.com') && (cleanPass === 'admin' || cleanPass === 'admin12345')) {
      const loggedUser = { email: 'admin@bevulta.com', name: 'Administrator', role: 'admin' };
      setUser(loggedUser);
      localStorage.setItem('bevulta_user', JSON.stringify(loggedUser));
      setCurrentPage('admin');
      setLoginIdentifier('');
      setLoginPassword('');
      return;
    }

    showAlert(lang === 'fr' 
      ? `Identifiants incorrects. Pour tester :\n- admin / admin ou admin@bevulta.com / admin12345 (Admin)\n- client / client (Client)`
      : `Invalid credentials. For testing:\n- admin / admin (Admin)\n- client / client (Client)`);
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('bevulta_user');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Logout error:", err);
    }
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
          ebooks={ebooks}
          addEbook={addEbook}
          updateEbook={updateEbook}
          deleteEbook={deleteEbook}
          bulkUpdateEbooks={bulkUpdateEbooks}
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
            ebooks={ebooks}
            addToCart={addToCart}
            showAlert={showAlert}
            settings={settings}
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
        {currentPage === 'ebooks' && (
          <Ebooks 
            ebooks={ebooks} 
            addToCart={addToCart} 
            cart={cart}
            lang={lang} 
            showAlert={showAlert} 
            settings={settings}
            addOrder={handleSubmitOrder}
          />
        )}
        {currentPage === 'formations' && (
          <Formations 
            lang={lang} 
            showAlert={showAlert} 
            settings={settings} 
            addOrder={handleSubmitOrder} 
          />
        )}
        {currentPage === 'services' && <Services lang={lang} />}
        {currentPage === 'about' && <About lang={lang} />}
        {currentPage === 'contact' && <Contact onSendMessage={handleSendMessage} lang={lang} showAlert={showAlert} showConfirm={showConfirm} settings={settings} />}
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
            settings={settings}
            onGoToTracking={handleGoToTracking}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === 'track' && (
          <TrackOrder 
            orders={orders}
            lang={lang}
            settings={settings}
            showAlert={showAlert}
            setCurrentPage={setCurrentPage}
            initialTrackingId={trackingOrderId}
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

      <Footer setCurrentPage={setCurrentPage} lang={lang} settings={settings} />

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
