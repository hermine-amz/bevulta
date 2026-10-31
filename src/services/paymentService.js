/**
 * Universal Adaptive Payment Service for Bevulta
 * Supports:
 * 1. Custom Payment Links (Saspay, Wave, KKiaPay Me, PayDunya, etc.)
 * 2. FedaPay (MTN MoMo, Moov Money Bénin / Togo / Côte d'Ivoire)
 * 3. KKiaPay (Bénin, Togo, UEMOA Mobile Money & Cards)
 * 4. PayDunya (Sénégal, Bénin, CI, Burkina, Wave, Orange Money)
 * 5. Manual Mobile Money (Direct transfer with WhatsApp confirmation)
 */

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      }
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.loaded = 'false';
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Initiates payment according to configured gateway and settings
 * @param {Object} options
 * @param {number} options.amountFcfa
 * @param {string} options.itemTitle
 * @param {string} options.itemId
 * @param {string} options.orderId
 * @param {Object} options.clientInfo { name, email, phone, country }
 * @param {string} [options.itemPaymentLink] Specific link defined on product/ebook
 * @param {Object} options.settings Store settings from Supabase
 * @param {Function} options.onSuccess Called on successful payment
 * @param {Function} options.onError Called on payment failure
 * @param {Function} options.onManualMoMo Called when manual MoMo transfer modal is needed
 */
export async function initiatePayment({
  amountFcfa,
  itemTitle,
  itemId,
  orderId = `CMD-${Date.now().toString().slice(-6)}`,
  clientInfo = {},
  itemPaymentLink = '',
  settings = {},
  onSuccess,
  onError,
  onManualMoMo
}) {
  const provider = settings.paymentProvider || 'custom_link';
  const isSandbox = settings.paymentMode !== 'live';

  // 1. Direct item override link
  if (itemPaymentLink && itemPaymentLink.trim() !== '') {
    let targetUrl = itemPaymentLink.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (onSuccess) onSuccess({ type: 'redirect', targetUrl });
    return;
  }

  // 2. Custom global link (Saspay, Wave, Paydunya direct link, KKiaPay Me...)
  if (provider === 'custom_link') {
    let globalLink = (settings.customPaymentLink || '').trim();
    if (!globalLink) {
      if (onManualMoMo) {
        onManualMoMo({ amountFcfa, itemTitle, orderId, clientInfo });
      } else {
        if (onError) onError(new Error("Aucun lien de paiement ou passerelle configuré."));
      }
      return;
    }

    if (!globalLink.startsWith('http://') && !globalLink.startsWith('https://')) {
      globalLink = 'https://' + globalLink;
    }

    // Append standard parameters if supported
    try {
      const url = new URL(globalLink);
      if (!url.searchParams.has('amount')) url.searchParams.set('amount', amountFcfa);
      if (!url.searchParams.has('ref')) url.searchParams.set('ref', orderId);
      if (clientInfo.name && !url.searchParams.has('name')) url.searchParams.set('name', clientInfo.name);
      if (clientInfo.email && !url.searchParams.has('email')) url.searchParams.set('email', clientInfo.email);
      if (clientInfo.phone && !url.searchParams.has('phone')) url.searchParams.set('phone', clientInfo.phone);
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
      if (onSuccess) onSuccess({ type: 'custom_link', url: url.toString() });
    } catch {
      window.open(globalLink, '_blank', 'noopener,noreferrer');
      if (onSuccess) onSuccess({ type: 'custom_link', url: globalLink });
    }
    return;
  }

  // 3. FedaPay Integration (MTN MoMo, Moov Money, Carte)
  if (provider === 'fedapay') {
    const publicKey = (settings.fedapayPublicKey || '').trim();
    if (!publicKey) {
      if (onError) onError(new Error("Clé publique FedaPay non configurée dans le Dashboard."));
      return;
    }

    try {
      await loadExternalScript('https://cdn.fedapay.com/checkout.js/v1.js');
      if (typeof window.FedaPay === 'undefined') {
        throw new Error("Impossible de charger le composant FedaPay.");
      }

      const widget = window.FedaPay.init({
        public_key: publicKey,
        environment: isSandbox ? 'sandbox' : 'live',
        transaction: {
          amount: Math.round(amountFcfa),
          description: `Paiement ${itemTitle || 'BEVULTA'} (#${orderId})`
        },
        customer: {
          firstname: (clientInfo.name || 'Client').split(' ')[0] || 'Client',
          lastname: (clientInfo.name || '').split(' ').slice(1).join(' ') || 'BEVULTA',
          email: clientInfo.email || settings.contactEmail || 'client@bevulta.com',
          phone_number: {
            number: (clientInfo.phone || '').replace(/[^0-9]/g, '') || '97000000',
            country: 'bj'
          }
        },
        onComplete: (resp) => {
          if (resp && (resp.status === 'approved' || resp.status === 'transferred')) {
            if (onSuccess) onSuccess({ type: 'fedapay', transactionId: resp.id, response: resp });
          } else {
            if (onError) onError(new Error("Paiement FedaPay interrompu ou non validé."));
          }
        }
      });

      widget.open();
    } catch (err) {
      console.error("FedaPay error:", err);
      if (onError) onError(err);
    }
    return;
  }

  // 4. KKiaPay Integration
  if (provider === 'kkiapay') {
    const publicKey = (settings.kkiapayPublicKey || '').trim();
    if (!publicKey) {
      if (onError) onError(new Error("Clé API KKiaPay non configurée dans le Dashboard."));
      return;
    }

    try {
      await loadExternalScript('https://cdn.kkiapay.me/k.js');
      if (typeof window.openKkiapayWidget === 'undefined') {
        throw new Error("Impossible de charger le widget KKiaPay.");
      }

      window.openKkiapayWidget({
        amount: Math.round(amountFcfa),
        key: publicKey,
        sandbox: isSandbox,
        position: "center",
        theme: "#166534",
        name: clientInfo.name || "Client BEVULTA",
        email: clientInfo.email || "",
        phone: (clientInfo.phone || "").replace(/[^0-9]/g, ''),
        data: {
          orderId,
          itemId,
          itemTitle
        }
      });

      // KKiaPay global event listener
      const handleKKiaPaySuccess = (response) => {
        window.removeEventListener('success:kkiapay', handleKKiaPaySuccess);
        if (onSuccess) onSuccess({ type: 'kkiapay', transactionId: response.transactionId, response });
      };
      window.addEventListener('success:kkiapay', handleKKiaPaySuccess);

    } catch (err) {
      console.error("KKiaPay error:", err);
      if (onError) onError(err);
    }
    return;
  }

  // 5. PayDunya Integration
  if (provider === 'paydunya') {
    const masterKey = (settings.paydunyaMasterKey || '').trim();
    const paydunyaToken = (settings.paydunyaToken || '').trim();
    
    // If admin set a custom direct checkout URL for Paydunya
    if (settings.customPaymentLink && settings.customPaymentLink.includes('paydunya')) {
      window.open(settings.customPaymentLink, '_blank', 'noopener,noreferrer');
      if (onSuccess) onSuccess({ type: 'paydunya_link' });
      return;
    }

    if (!masterKey && !paydunyaToken) {
      if (onError) onError(new Error("Clés PayDunya non configurées. Renseignez votre MasterKey dans le Dashboard."));
      return;
    }

    // Direct redirect to Paydunya checkout or fallback to manual MoMo modal with instructions
    if (onManualMoMo) {
      onManualMoMo({
        amountFcfa,
        itemTitle,
        orderId,
        clientInfo,
        note: `PayDunya (${isSandbox ? 'Test' : 'Live'})`
      });
    }
    return;
  }

  // 6. Manual Mobile Money transfer modal
  if (provider === 'momo_manual' || provider === 'manual') {
    if (onManualMoMo) {
      onManualMoMo({ amountFcfa, itemTitle, orderId, clientInfo });
    }
    return;
  }

  // Default fallback: Manual MoMo modal
  if (onManualMoMo) {
    onManualMoMo({ amountFcfa, itemTitle, orderId, clientInfo });
  } else if (onSuccess) {
    onSuccess({ type: 'offline', orderId });
  }
}

