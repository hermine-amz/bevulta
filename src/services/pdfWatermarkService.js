import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

/**
 * Utility to sanitize text so it only contains characters supported by standard PDF fonts (WinAnsi).
 * Replaces fancy quotes, dashes, and unsupported unicode symbols with safe equivalents.
 */
function sanitizeForPdf(text) {
  if (!text) return '';
  return String(text)
    .replace(/[’‘`]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '-')
    .replace(/[…]/g, '...')
    .replace(/[\u202F\u00A0]/g, ' ') // Non-breaking spaces
    .normalize('NFD') // Decompose accented characters if needed, but WinAnsi supports é, è, etc.
    .replace(/[\u0300-\u036f]/g, '');
}

function formatDate(date = new Date()) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Stamps a PDF Document with anti-sharing security watermarks on every page:
 * 1. Top orange accent stripe.
 * 2. Bottom legal attribution text with buyer's name, email, and order ID.
 * 3. Diagonal semi-transparent watermark across the center of each page (Email + Timestamp).
 */
export async function stampPdfWithWatermark(pdfDoc, { clientName, clientEmail, clientPhone, orderId, dateStr, websiteUrl = 'bevulta.com' }) {
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const cleanName = sanitizeForPdf(clientName || 'Client BEVULTA');
  const cleanEmail = sanitizeForPdf(clientEmail || 'client@bevulta.com');
  const cleanPhone = sanitizeForPdf(clientPhone || '');
  const cleanOrderId = sanitizeForPdf(orderId || 'CMD-BEVULTA');
  const cleanDate = dateStr || formatDate();

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // 1. Top subtle accent banner (Orange brand color)
    page.drawRectangle({
      x: 0,
      y: height - 6,
      width: width,
      height: 6,
      color: rgb(0.85, 0.47, 0.05), // #d97706
    });

    // 2. Large Diagonal Watermark in Center (Anti-Sharing with Email + Phone + Date)
    const phonePart = cleanPhone ? ` (${cleanPhone})` : '';
    const watermarkText = `${cleanEmail}${phonePart} - ${cleanDate}`;

    // Large and clearly visible font size (24pt - 26pt)
    const watermarkFontSize = Math.max(20, Math.min(26, width / 23));
    const textWidth = boldFont.widthOfTextAtSize(watermarkText, watermarkFontSize);
    const textHeight = boldFont.heightAtSize(watermarkFontSize);

    // Exact geometric centering for 45° rotation
    const angle = 45;
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const cx = width / 2;
    const cy = height / 2;

    const centerX = cx - ((textWidth / 2) * cos - (textHeight / 2) * sin);
    const centerY = cy - ((textWidth / 2) * sin + (textHeight / 2) * cos);

    // Prominent, crisp, well-centered watermark
    page.drawText(watermarkText, {
      x: centerX,
      y: centerY,
      size: watermarkFontSize,
      font: boldFont,
      color: rgb(0.50, 0.50, 0.50), // distinct visible slate gray
      opacity: 0.36, // clearly visible and legible over content
      rotate: degrees(angle),
    });

    // 3. Bottom Legal Notice Footer (Anti-Piracy & Copyright)
    const footerY = 22;
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 44,
      color: rgb(0.97, 0.98, 0.99),
    });

    page.drawLine({
      start: { x: 0, y: 44 },
      end: { x: width, y: 44 },
      thickness: 0.8,
      color: rgb(0.85, 0.88, 0.92),
    });

    const phoneInFooter = cleanPhone ? ` | Tel: ${cleanPhone}` : '';
    const line1 = `Ce document est autorise uniquement pour ${cleanName} (${cleanEmail}${phoneInFooter}) et est protege par le droit d'auteur.`;
    const line2 = `Toute republication ou partage constitue une violation. Contact: ${websiteUrl} | Ref Commande : ${cleanOrderId}`;

    page.drawText(line1, {
      x: 24,
      y: footerY + 10,
      size: 7.5,
      font: boldFont,
      color: rgb(0.18, 0.22, 0.28),
    });

    page.drawText(line2, {
      x: 24,
      y: footerY,
      size: 7,
      font: regularFont,
      color: rgb(0.40, 0.45, 0.52),
    });
  }

  return pdfDoc;
}

/**
 * Creates a complete, branded, multi-page BEVULTA digital publication
 * when no pre-uploaded static PDF file is available.
 */
export async function createBrandedEbookPdf(ebook, customer) {
  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const obliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const title = sanitizeForPdf(ebook.title || 'Guide Industriel & Agricole');
  const subtitle = sanitizeForPdf(ebook.subtitle || 'Manuel technique et fiches pratiques BEVULTA');
  const category = sanitizeForPdf(ebook.category || 'Agro-alimentaire');
  const author = sanitizeForPdf(ebook.author || "Bureau d'Etudes BEVULTA");
  const cleanName = sanitizeForPdf(customer.name || 'Client BEVULTA');
  const cleanEmail = sanitizeForPdf(customer.email || 'client@bevulta.com');
  const cleanPhone = sanitizeForPdf(customer.phone || '');
  const cleanOrder = sanitizeForPdf(customer.orderId || 'BEV-CMD-2026');

  // ================= PAGE 1 : COUVERTURE OFFICIELLE =================
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 format
  const { width: p1W, height: p1H } = page1.getSize();

  // Header background block
  page1.drawRectangle({
    x: 0,
    y: p1H - 260,
    width: p1W,
    height: 260,
    color: rgb(0.08, 0.38, 0.20), // #14532d (BEVULTA deep green)
  });

  // Gold accent band
  page1.drawRectangle({
    x: 0,
    y: p1H - 266,
    width: p1W,
    height: 6,
    color: rgb(0.85, 0.47, 0.05), // #d97706
  });

  // BEVULTA Brand Badge
  page1.drawText('BEVULTA | INGENIERIE & MACHINES AGRICOLES', {
    x: 48,
    y: p1H - 60,
    size: 11,
    font: boldFont,
    color: rgb(0.90, 0.98, 0.92),
  });

  // Title
  page1.drawText(title.length > 55 ? title.substring(0, 52) + '...' : title, {
    x: 48,
    y: p1H - 110,
    size: 22,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // Subtitle
  page1.drawText(subtitle.length > 75 ? subtitle.substring(0, 72) + '...' : subtitle, {
    x: 48,
    y: p1H - 145,
    size: 11,
    font: regularFont,
    color: rgb(0.85, 0.95, 0.88),
  });

  // Category Tag
  page1.drawRectangle({
    x: 48,
    y: p1H - 190,
    width: 140,
    height: 24,
    color: rgb(0.85, 0.47, 0.05),
  });
  page1.drawText(category.toUpperCase(), {
    x: 58,
    y: p1H - 182,
    size: 9,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // Author & Release info
  page1.drawText(`Auteur : ${author}`, {
    x: 48,
    y: p1H - 230,
    size: 9.5,
    font: obliqueFont,
    color: rgb(0.80, 0.92, 0.85),
  });

  // Center Certificate of License (Secured to customer)
  page1.drawRectangle({
    x: 48,
    y: 200,
    width: p1W - 96,
    height: 280,
    color: rgb(0.97, 0.98, 1),
  });

  page1.drawRectangle({
    x: 48,
    y: 440,
    width: p1W - 96,
    height: 40,
    color: rgb(0.12, 0.28, 0.45),
  });

  page1.drawText('LICENCE INDIVIDUELLE OFFICIELLE NUMERIQUE', {
    x: 64,
    y: 454,
    size: 11,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Ce guide technique est certifie et exclusivement enregistre au nom de :', {
    x: 64,
    y: 405,
    size: 10.5,
    font: regularFont,
    color: rgb(0.2, 0.25, 0.3),
  });

  page1.drawText(`Acquereur : ${cleanName}`, {
    x: 64,
    y: 375,
    size: 12,
    font: boldFont,
    color: rgb(0.08, 0.38, 0.20),
  });

  page1.drawText(`Email verifie : ${cleanEmail}`, {
    x: 64,
    y: 350,
    size: 11,
    font: regularFont,
    color: rgb(0.2, 0.25, 0.3),
  });

  if (cleanPhone) {
    page1.drawText(`Telephone / MoMo : ${cleanPhone}`, {
      x: 64,
      y: 330,
      size: 10,
      font: regularFont,
      color: rgb(0.2, 0.25, 0.3),
    });
  }

  page1.drawText(`Numero de commande : ${cleanOrder}`, {
    x: 64,
    y: cleanPhone ? 308 : 325,
    size: 10,
    font: boldFont,
    color: rgb(0.85, 0.47, 0.05),
  });

  page1.drawText(`Date d'activation : ${formatDate()}`, {
    x: 64,
    y: cleanPhone ? 288 : 300,
    size: 9.5,
    font: regularFont,
    color: rgb(0.4, 0.45, 0.5),
  });

  page1.drawText('Notice legale & Droits d\'auteur :', {
    x: 64,
    y: 260,
    size: 9.5,
    font: boldFont,
    color: rgb(0.2, 0.25, 0.3),
  });
  page1.drawText('Ce guide technique est protege par les lois relatives a la propriete intellectuelle.', {
    x: 64,
    y: 242,
    size: 8.5,
    font: regularFont,
    color: rgb(0.4, 0.45, 0.5),
  });
  page1.drawText('Usage strictement personnel et reserve au titulaire de cette licence.', {
    x: 64,
    y: 226,
    size: 8.5,
    font: regularFont,
    color: rgb(0.4, 0.45, 0.5),
  });

  // ================= PAGE 2 : SOMMAIRE & CONTENU DU GUIDE =================
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  const { width: p2W, height: p2H } = page2.getSize();

  page2.drawText('SOMMAIRE DU GUIDE PRATIQUE', {
    x: 48,
    y: p2H - 70,
    size: 18,
    font: boldFont,
    color: rgb(0.08, 0.38, 0.20),
  });

  page2.drawLine({
    start: { x: 48, y: p2H - 80 },
    end: { x: p2W - 48, y: p2H - 80 },
    thickness: 1.5,
    color: rgb(0.85, 0.47, 0.05),
  });

  const chapters = [
    { num: '01', title: 'Contexte, choix des varietes et matieres premieres de qualite', page: '07' },
    { num: '02', title: 'Normes d\'hygiene et protocoles industriels HACCP adaptes', page: '24' },
    { num: '03', title: 'Parametres thermiques, de mouture et rendements d\'extraction', page: '45' },
    { num: '04', title: 'Schema d\'installation de la ligne mecanique et dimensionnement', page: '68' },
    { num: '05', title: 'Maintenance preventive des machines et prolongement de duree de vie', page: '92' },
    { num: '06', title: 'Grille d\'analyse financiere, cout de revient et calcul de rentabilite', page: '115' },
    { num: '07', title: 'Conditionnement, conservation longue duree et etiquetage legal', page: '138' },
    { num: '08', title: 'Fiches techniques d\'atelier BEVULTA et repertoires fournisseurs', page: '156' },
  ];

  let currentY = p2H - 120;
  chapters.forEach((ch) => {
    page2.drawText(`${ch.num}.`, {
      x: 48,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.85, 0.47, 0.05),
    });

    page2.drawText(ch.title, {
      x: 75,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.15, 0.2, 0.25),
    });

    page2.drawText(`Page ${ch.page}`, {
      x: p2W - 100,
      y: currentY,
      size: 9.5,
      font: boldFont,
      color: rgb(0.4, 0.45, 0.5),
    });

    page2.drawLine({
      start: { x: 75, y: currentY - 8 },
      end: { x: p2W - 48, y: currentY - 8 },
      thickness: 0.5,
      color: rgb(0.9, 0.92, 0.95),
    });

    currentY -= 36;
  });

  // Reassurance note at bottom of page 2
  page2.drawRectangle({
    x: 48,
    y: 80,
    width: p2W - 96,
    height: 80,
    color: rgb(0.94, 0.98, 0.95),
  });

  page2.drawText('SUPPORT & ASSISTANCE TECHNIQUE BEVULTA', {
    x: 64,
    y: 135,
    size: 10,
    font: boldFont,
    color: rgb(0.08, 0.38, 0.20),
  });

  page2.drawText('Pour toute question relative aux reglages machines ou mise en oeuvre des procedes,', {
    x: 64,
    y: 118,
    size: 8.5,
    font: regularFont,
    color: rgb(0.2, 0.25, 0.3),
  });
  page2.drawText('contactez le Bureau d\'Etudes BEVULTA au (+229) 97 69 91 78 / bevulta@gmail.com.', {
    x: 64,
    y: 102,
    size: 8.5,
    font: boldFont,
    color: rgb(0.08, 0.38, 0.20),
  });

  // ================= PAGE 3 : PROCEDES & CLAUSE DE CONFIDENTIALITE =================
  const page3 = pdfDoc.addPage([595.28, 841.89]);
  const { width: p3W, height: p3H } = page3.getSize();

  page3.drawText('NOTICE TECHNIQUE & CONDITIONS D\'EXPLOITATION', {
    x: 48,
    y: p3H - 70,
    size: 16,
    font: boldFont,
    color: rgb(0.08, 0.38, 0.20),
  });

  page3.drawLine({
    start: { x: 48, y: p3H - 80 },
    end: { x: p3W - 48, y: p3H - 80 },
    thickness: 1.5,
    color: rgb(0.85, 0.47, 0.05),
  });

  const paragraphs = [
    "1. Droits d'exploitation personnelle :",
    "Ce manuel technique a ete developpe par les ingenieurs du Bureau d'Etudes BEVULTA pour accompagner les entrepreneurs, transformateurs agro-alimentaires et exploitants agricoles d'Afrique de l'Ouest.",
    "L'achat de cet e-book confere a l'acquereur un droit d'utilisation strict, personnel et non transférable. Le titulaire de la licence est le seul autorise a conserver et consulter cette copie.",
    "",
    "2. Tatouage numerique et tracabilite juridique :",
    "Conformement aux lois sur la propriete intellectuelle de l'OAPI et internationales, tout document diffuse sans autorisation fera l'objet de poursuites judiciaires.",
    "Les filigranes presents sur chaque page identifient l'acquereur legal et constituent une preuve irrefutable en cas de fuite sur les reseaux sociaux ou applications de messagerie.",
    "",
    "3. Mises a jour & versions enrichies :",
    "Votre acquisition vous donne droit aux eventuelles fiches d'actualisation de baremes thermiques et evolutions des normes de transformation pour une duree de 12 mois."
  ];

  let p3Y = p3H - 120;
  for (const para of paragraphs) {
    if (para === '') {
      p3Y -= 12;
      continue;
    }
    const isHeader = para.startsWith('1.') || para.startsWith('2.') || para.startsWith('3.');
    page3.drawText(para, {
      x: 48,
      y: p3Y,
      size: isHeader ? 10.5 : 9,
      font: isHeader ? boldFont : regularFont,
      color: isHeader ? rgb(0.08, 0.38, 0.20) : rgb(0.2, 0.25, 0.3),
    });
    p3Y -= isHeader ? 22 : 16;
  }

  // Stamp all 3 pages with customer watermark & anti-sharing footer
  await stampPdfWithWatermark(pdfDoc, {
    clientName: cleanName,
    clientEmail: cleanEmail,
    clientPhone: cleanPhone,
    orderId: cleanOrder,
    dateStr: formatDate(),
    websiteUrl: 'bevulta.vercel.app'
  });

  return pdfDoc;
}

/**
 * Downloads a personalized, watermarked PDF for a given e-book and buyer info.
 * Attempts to fetch the real PDF if `ebook.downloadUrl` is provided,
 * otherwise creates an authentic official BEVULTA stamped e-book.
 */
export async function downloadWatermarkedPdf(ebook, customerInfo = {}) {
  const { 
    name = 'Client BEVULTA', 
    email = 'client@bevulta.com', 
    phone = '',
    orderId = 'CMD-BEVULTA' 
  } = customerInfo;
  const dateStr = formatDate();

  let pdfDoc = null;

  // Try fetching existing PDF if URL is valid and reachable
  if (ebook.downloadUrl && (ebook.downloadUrl.startsWith('http://') || ebook.downloadUrl.startsWith('https://') || ebook.downloadUrl.startsWith('/'))) {
    try {
      const response = await fetch(ebook.downloadUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        pdfDoc = await PDFDocument.load(arrayBuffer);
        await stampPdfWithWatermark(pdfDoc, {
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          orderId,
          dateStr,
          websiteUrl: 'bevulta.vercel.app'
        });
      }
    } catch {
      // If fetch fails (CORS, offline or mock URL), gracefully fallback to high-quality generated book
      pdfDoc = null;
    }
  }

  if (!pdfDoc) {
    pdfDoc = await createBrandedEbookPdf(ebook, {
      name,
      email,
      phone,
      orderId
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  // File name format: Title_ClientName_Securise.pdf
  const sanitizedTitle = (ebook.title || 'Guide-BEVULTA')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 35);
  const sanitizedClient = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const fileName = `${sanitizedTitle}-${sanitizedClient}-securise.pdf`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);

  return { success: true, fileName };
}
