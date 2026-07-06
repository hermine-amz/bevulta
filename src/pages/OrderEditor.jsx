import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';

export default function OrderEditor({ products, onSave, onClose, lang }) {
  const isEn = lang === 'en';
  
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    company: '',
    country: 'Bénin',
    address: '',
    notes: '',
    status: 'pending' // default status
  });

  const [orderItems, setOrderItems] = useState([
    { productName: '', option: '', quantity: 1, unitPriceFcfa: 0 }
  ]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;

    // Auto-fill price if the product name matches a catalog product
    if (field === 'productName') {
      const matched = products.find(p => p.name.toLowerCase() === value.toLowerCase());
      if (matched) {
        newItems[index].unitPriceFcfa = matched.promoPriceFcfa || matched.priceFcfa;
      }
    }

    setOrderItems(newItems);
  };

  const addItem = () => {
    setOrderItems(prev => [...prev, { productName: '', option: '', quantity: 1, unitPriceFcfa: 0 }]);
  };

  const removeItem = (index) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => {
      const price = parseInt(item.unitPriceFcfa, 10) || 0;
      const qty = parseInt(item.quantity, 10) || 0;
      return sum + (price * qty);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.phone || !formData.country || !formData.address) {
      alert(isEn ? "Please fill in all required client fields." : "Veuillez remplir tous les champs obligatoires du client.");
      return;
    }

    const validItems = orderItems.filter(item => item.productName.trim() !== '' && item.quantity > 0);
    if (validItems.length === 0) {
      alert(isEn ? "Please add at least one product." : "Veuillez ajouter au moins un produit.");
      return;
    }

    const processedItems = validItems.map(item => {
      const matched = products.find(p => p.name.toLowerCase() === item.productName.toLowerCase());
      const id = matched ? matched.id : 'CUSTOM-' + Math.floor(Math.random()*100000);
      
      let fullName = item.productName;
      if (item.option.trim() !== '') {
        fullName += ` (${item.option})`;
      }

      const priceFcfa = parseInt(item.unitPriceFcfa, 10) || 0;
      const priceEur = Math.round(priceFcfa / 655.957);

      return {
        id: id,
        name: fullName,
        quantity: parseInt(item.quantity, 10),
        priceFcfa: priceFcfa,
        priceEur: priceEur
      };
    });

    const subtotalFcfa = processedItems.reduce((sum, item) => sum + (item.priceFcfa * item.quantity), 0);
    const totalEur = processedItems.reduce((sum, item) => sum + (item.priceEur * item.quantity), 0);

    const newOrder = {
      id: 'DEV-' + Math.floor(100000 + Math.random() * 900000), // Optimistic temporary ID
      date: new Date().toISOString().split('T')[0],
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      country: formData.country,
      address: formData.address,
      notes: formData.notes,
      items: processedItems,
      subtotalFcfa: subtotalFcfa,
      totalFcfa: subtotalFcfa, // In case taxes are added later
      totalEur: totalEur,
      status: formData.status
    };

    onSave(newOrder);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose} type="button">
          <X size={20} />
        </button>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          {isEn ? "Create New Quote/Order" : "Créer un Nouveau Devis/Commande"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* Client Information */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', color: 'var(--primary)', fontSize: '1.1rem' }}>
              {isEn ? "1. Client Information" : "1. Informations Client"}
            </h4>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{isEn ? "Full Name *" : "Nom Complet *"}</label>
                <input type="text" className="form-input" name="clientName" value={formData.clientName} onChange={handleFieldChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">{isEn ? "Company (Optional)" : "Compagnie (Optionnel)"}</label>
                <input type="text" className="form-input" name="company" value={formData.company} onChange={handleFieldChange} />
              </div>
              <div className="form-group">
                <label className="form-label">{isEn ? "WhatsApp / Phone *" : "WhatsApp / Téléphone *"}</label>
                <input type="text" className="form-input" name="phone" value={formData.phone} onChange={handleFieldChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">{isEn ? "Email (Optional)" : "Email (Optionnel)"}</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleFieldChange} />
              </div>
              <div className="form-group">
                <label className="form-label">{isEn ? "Country *" : "Pays *"}</label>
                <input type="text" className="form-input" name="country" value={formData.country} onChange={handleFieldChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">{isEn ? "Full Address *" : "Adresse Complète *"}</label>
                <input type="text" className="form-input" name="address" value={formData.address} onChange={handleFieldChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">{isEn ? "Internal Notes" : "Notes Internes"}</label>
                <textarea className="form-input" name="notes" value={formData.notes} onChange={handleFieldChange} rows="2"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">{isEn ? "Initial Status" : "Statut Initial"}</label>
                <select className="form-input" name="status" value={formData.status} onChange={handleFieldChange}>
                  <option value="pending">{isEn ? "Pending Validation" : "En attente / Validation de paiement"}</option>
                  <option value="manufacturing">{isEn ? "In Manufacturing" : "En cours de fabrication"}</option>
                  <option value="shipped">{isEn ? "Shipped" : "Expédié"}</option>
                  <option value="delivered">{isEn ? "Delivered" : "Livré"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ color: 'var(--primary)', fontSize: '1.1rem', margin: 0 }}>
                {isEn ? "2. Machinery / Products" : "2. Machines / Produits"}
              </h4>
              <button type="button" onClick={addItem} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                <Plus size={14} /> {isEn ? "Add Item" : "Ajouter Produit"}
              </button>
            </div>

            <datalist id="catalog-products">
              {products.map(p => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>

            {orderItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ flex: '2.5' }}>
                  <label className="form-label">{isEn ? "Product Name" : "Nom du Produit"}</label>
                  <input 
                    type="text"
                    className="form-input" 
                    list="catalog-products"
                    placeholder={isEn ? "Select or type custom product..." : "Sélectionner ou saisir..."}
                    value={item.productName} 
                    onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: '1.5' }}>
                  <label className="form-label">{isEn ? "Option / Variant" : "Option / Variante"}</label>
                  <input 
                    type="text"
                    className="form-input" 
                    placeholder={isEn ? "e.g. Moteur Électrique" : "ex: Moteur Diesel"}
                    value={item.option} 
                    onChange={(e) => handleItemChange(index, 'option', e.target.value)}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <label className="form-label">{isEn ? "Unit Price (FCFA)" : "Prix U. (FCFA)"}</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0"
                    value={item.unitPriceFcfa} 
                    onChange={(e) => handleItemChange(index, 'unitPriceFcfa', e.target.value)}
                    required
                  />
                </div>
                <div style={{ width: '70px' }}>
                  <label className="form-label">{isEn ? "Qty" : "Qté"}</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                {orderItems.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} style={{ marginTop: '28px', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '20px' }}>
              TOTAL: {subtotal.toLocaleString()} FCFA
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              {isEn ? "Cancel" : "Annuler"}
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{isEn ? "Create Order" : "Créer la Commande"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
