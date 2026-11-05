import React from 'react';
import { X, Printer, ShieldCheck, Download, MapPin, Phone, Mail } from 'lucide-react';

export default function ProformaModal({ order, settings, isOpen, onClose, lang = 'fr' }) {
  if (!isOpen || !order) return null;
  const isEn = lang === 'en';

  const depositAmount = Math.round((order.totalFcfa || 0) * 0.5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="proforma-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div 
        className="proforma-modal-container"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Top Controls (Hidden when printing) */}
        <div 
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#ecfdf5',
              color: '#059669',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              {isEn ? "Official Document" : "Document Officiel"}
            </span>
            <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
              {isEn ? "Proforma Quotation" : "Devis Proforma"} · {order.id}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#166534',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(22, 101, 52, 0.3)'
              }}
            >
              <Printer size={16} />
              <span>{isEn ? "Print / Save as PDF" : "Imprimer / Enregistrer en PDF"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Sheet */}
        <div 
          style={{
            padding: '32px',
            overflowY: 'auto',
            background: '#ffffff'
          }}
        >
          <div className="print-invoice-sheet" style={{ textAlign: "left", backgroundColor: "#ffffff" }}>
            
            {/* Header / Brand block */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #166534", paddingBottom: "16px", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src="/logo.jpg"
                  alt="BEVULTA Logo"
                  style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid #166534" }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0b2c5c", margin: 0 }}>
                    {settings?.storeName || "BEVULTA"}
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#475569", margin: "2px 0 0 0", fontWeight: 600 }}>
                    {settings?.storeTagline || "Bureau d'Études et de Vulgarisation des Technologies Appropriées"}
                  </p>
                  <p style={{ fontSize: "0.74rem", color: "#64748b", margin: "2px 0 0 0" }}>
                    {settings?.atelierAddress || "C/3474 Agla Von FAN-MILK, Cotonou, Bénin"} • Tél : {settings?.contactPhone1 || "(+229) 97 69 91 78"}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "#f0fdf4",
                  color: "#166534",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  borderRadius: "6px",
                  border: "1px solid #bbf7d0",
                  letterSpacing: "0.04em"
                }}>
                  DEVIS PROFORMA
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>
                  N° {order.id}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Date d'émission : {order.date || new Date().toISOString().split('T')[0]}
                </div>
              </div>
            </div>

            {/* Client Info Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
              padding: "14px 16px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              marginBottom: "20px",
              fontSize: "0.85rem"
            }}>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Bénéficiaire / Client
                </div>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                  {order.clientName || order.name || "Client Partenaire"}
                </div>
                {order.company && (
                  <div style={{ color: "#475569", fontWeight: 600 }}>{order.company}</div>
                )}
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Coordonnées & Destination
                </div>
                <div style={{ color: "#0f172a" }}>
                  <strong>{order.phone}</strong> {order.email ? "• " + order.email : ""}
                </div>
                <div style={{ color: "#475569" }}>
                  {order.country} — {order.address || "Livraison en atelier / transporteur"}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="proforma-table-wrapper" style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1", fontSize: "0.76rem", color: "#475569", textTransform: "uppercase" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>Désignation Matériel / Prestation</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", width: "60px" }}>Qté</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", width: "140px" }}>Prix Unitaire</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", width: "160px" }}>Total (FCFA)</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{item.name}</div>
                        {item.specs && item.specs["Motorisation"] && (
                          <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>
                            Option : {item.specs["Motorisation"]}
                          </div>
                        )}
                        {item.motor && item.motor !== 'Standard' && (
                          <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>
                            Motorisation : {item.motor}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: "center", padding: "12px", fontWeight: 600, color: "#334155" }}>
                        {item.quantity}
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", color: "#475569" }}>
                        {item.priceFcfa ? item.priceFcfa.toLocaleString() : 0} F
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", fontWeight: 800, color: "#0f172a" }}>
                        {((item.priceFcfa || 0) * (item.quantity || 1)).toLocaleString()} F
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Financial Summary */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
              <div style={{ minWidth: "300px", background: "#f8fafc", borderRadius: "10px", padding: "16px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem", color: "#475569" }}>
                  <span>Sous-total Matériel :</span>
                  <span style={{ fontWeight: 600 }}>{(order.subtotalFcfa || order.totalFcfa || 0).toLocaleString()} FCFA</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem", color: "#475569" }}>
                  <span>Frais de conditionnement :</span>
                  <span style={{ color: "#166534", fontWeight: 600 }}>Inclus (Atelier)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #cbd5e1", paddingTop: "10px", marginTop: "6px" }}>
                  <span style={{ fontWeight: 900, color: "#0f172a", fontSize: "1rem" }}>Montant Total :</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, color: "#166534", fontSize: "1.2rem", fontFamily: "var(--font-heading)" }}>
                      {(order.totalFcfa || 0).toLocaleString()} FCFA
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      ≈ {(order.totalEur || Math.round((order.totalFcfa || 0) / 655.957)).toLocaleString()} €
                    </div>
                  </div>
                </div>

                {/* Deposit Reminder */}
                <div style={{
                  marginTop: "12px",
                  padding: "10px",
                  background: "#f0fdf4",
                  borderRadius: "6px",
                  border: "1px solid #bbf7d0",
                  fontSize: "0.8rem",
                  color: "#166534"
                }}>
                  <div style={{ fontWeight: 800 }}>Acompte 50% de lancement :</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 900 }}>{depositAmount.toLocaleString()} FCFA</div>
                  <div style={{ fontSize: "0.72rem", color: "#15803d", marginTop: "2px" }}>
                    Solde exigible à la mise à disposition / livraison.
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Signatures */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", fontSize: "0.75rem", color: "#64748b", lineHeight: 1.6 }}>
              <div>• Le présent devis proforma est valable <strong>30 jours</strong> à compter de sa date d'émission.</div>
              <div>• Modalités : <strong>50% d'acompte</strong> à la signature/validation pour lancement de fabrication, <strong>50%</strong> au contrôle final départ atelier.</div>
              <div>• Garantie : <strong>1 an pièces et main d'œuvre</strong> sur l'ensemble de la mécano-soudure et des assemblages.</div>
              <div>• Service Après-Vente : <strong>{settings?.contactPhone1 || "(+229) 97 69 91 78"}</strong> · <strong>{settings?.contactEmail || "contact@bevulta.com"}</strong></div>
            </div>

            {/* Cachet & Signature */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "16px", borderTop: "1px dashed #cbd5e1" }}>
              <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                <div>Bon pour accord et commande,</div>
                <div style={{ marginTop: "40px", fontStyle: "italic", color: "#94a3b8" }}>Signature du client :</div>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.78rem", color: "#475569" }}>
                <div>Pour la Direction Technique <strong>BEVULTA</strong>,</div>
                <div style={{ marginTop: "8px", fontWeight: 800, color: "#166534" }}>
                  Bureau d'Études & Usine Centrale
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Cotonou, République du Bénin</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

