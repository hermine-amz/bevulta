/**
 * Comprehensive World Countries dataset with ISO code, French name, English name,
 * dial code (indicatif téléphonique), and flag emoji.
 * Prioritizes West and Central Africa (BEVULTA core zone) at the top,
 * followed by all other countries sorted alphabetically.
 */

export const COUNTRIES = [
  // --- Zone Prioritaire UEMOA & Afrique de l'Ouest ---
  { code: 'BJ', name: 'Bénin', nameEn: 'Benin', dialCode: '+229', flag: '🇧🇯', priority: 1 },
  { code: 'TG', name: 'Togo', nameEn: 'Togo', dialCode: '+228', flag: '🇹🇬', priority: 1 },
  { code: 'CI', name: "Côte d'Ivoire", nameEn: 'Ivory Coast', dialCode: '+225', flag: '🇨🇮', priority: 1 },
  { code: 'BF', name: 'Burkina Faso', nameEn: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', priority: 1 },
  { code: 'SN', name: 'Sénégal', nameEn: 'Senegal', dialCode: '+221', flag: '🇸🇳', priority: 1 },
  { code: 'NE', name: 'Niger', nameEn: 'Niger', dialCode: '+227', flag: '🇳🇪', priority: 1 },
  { code: 'ML', name: 'Mali', nameEn: 'Mali', dialCode: '+223', flag: '🇲🇱', priority: 1 },
  { code: 'GN', name: 'Guinée', nameEn: 'Guinea', dialCode: '+224', flag: '🇬🇳', priority: 1 },
  { code: 'GH', name: 'Ghana', nameEn: 'Ghana', dialCode: '+233', flag: '🇬🇭', priority: 1 },
  { code: 'NG', name: 'Nigéria', nameEn: 'Nigeria', dialCode: '+234', flag: '🇳🇬', priority: 1 },
  
  // --- Afrique Centrale & CEMAC ---
  { code: 'CM', name: 'Cameroun', nameEn: 'Cameroon', dialCode: '+237', flag: '🇨🇲', priority: 2 },
  { code: 'GA', name: 'Gabon', nameEn: 'Gabon', dialCode: '+241', flag: '🇬🇦', priority: 2 },
  { code: 'CD', name: 'RD Congo', nameEn: 'DR Congo', dialCode: '+243', flag: '🇨🇩', priority: 2 },
  { code: 'CG', name: 'Congo-Brazzaville', nameEn: 'Republic of the Congo', dialCode: '+242', flag: '🇨🇬', priority: 2 },
  { code: 'TD', name: 'Tchad', nameEn: 'Chad', dialCode: '+235', flag: '🇹🇩', priority: 2 },
  { code: 'CF', name: 'Centrafrique', nameEn: 'Central African Republic', dialCode: '+236', flag: '🇨🇫', priority: 2 },
  { code: 'GQ', name: 'Guinée Équatoriale', nameEn: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶', priority: 2 },

  // --- Reste de l'Afrique ---
  { code: 'DZ', name: 'Algérie', nameEn: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'AO', name: 'Angola', nameEn: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'BW', name: 'Botswana', nameEn: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'BI', name: 'Burundi', nameEn: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'CV', name: 'Cap-Vert', nameEn: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'KM', name: 'Comores', nameEn: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
  { code: 'DJ', name: 'Djibouti', nameEn: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
  { code: 'EG', name: 'Égypte', nameEn: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'ET', name: 'Éthiopie', nameEn: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { code: 'GM', name: 'Gambie', nameEn: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GW', name: 'Guinée-Bissau', nameEn: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'KE', name: 'Kenya', nameEn: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'LR', name: 'Libéria', nameEn: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
  { code: 'LY', name: 'Libye', nameEn: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { code: 'MG', name: 'Madagascar', nameEn: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', nameEn: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
  { code: 'MA', name: 'Maroc', nameEn: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'MU', name: 'Maurice', nameEn: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
  { code: 'MR', name: 'Mauritanie', nameEn: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { code: 'MZ', name: 'Mozambique', nameEn: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibie', nameEn: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
  { code: 'RW', name: 'Rwanda', nameEn: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
  { code: 'ST', name: 'Sao Tomé-et-Principe', nameEn: 'Sao Tome and Principe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'SC', name: 'Seychelles', nameEn: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', nameEn: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'SO', name: 'Somalie', nameEn: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
  { code: 'ZA', name: 'Afrique du Sud', nameEn: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'SS', name: 'Soudan du Sud', nameEn: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
  { code: 'SD', name: 'Soudan', nameEn: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
  { code: 'TZ', name: 'Tanzanie', nameEn: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { code: 'TN', name: 'Tunisie', nameEn: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { code: 'UG', name: 'Ouganda', nameEn: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'ZM', name: 'Zambie', nameEn: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', nameEn: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },

  // --- Europe & Diaspora ---
  { code: 'FR', name: 'France', nameEn: 'France', dialCode: '+33', flag: '🇫🇷', priority: 3 },
  { code: 'BE', name: 'Belgique', nameEn: 'Belgium', dialCode: '+32', flag: '🇧🇪', priority: 3 },
  { code: 'CH', name: 'Suisse', nameEn: 'Switzerland', dialCode: '+41', flag: '🇨🇭', priority: 3 },
  { code: 'CA', name: 'Canada', nameEn: 'Canada', dialCode: '+1', flag: '🇨🇦', priority: 3 },
  { code: 'US', name: 'États-Unis', nameEn: 'United States', dialCode: '+1', flag: '🇺🇸', priority: 3 },
  { code: 'GB', name: 'Royaume-Uni', nameEn: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', priority: 3 },
  { code: 'DE', name: 'Allemagne', nameEn: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italie', nameEn: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', nameEn: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', nameEn: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'NL', name: 'Pays-Bas', nameEn: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'LU', name: 'Luxembourg', nameEn: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { code: 'SE', name: 'Suède', nameEn: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', nameEn: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', nameEn: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', nameEn: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'IE', name: 'Irlande', nameEn: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'AT', name: 'Autriche', nameEn: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'PL', name: 'Pologne', nameEn: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'RO', name: 'Roumanie', nameEn: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'TR', name: 'Turquie', nameEn: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'RU', name: 'Russie', nameEn: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', nameEn: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },

  // --- Moyen-Orient & Asie ---
  { code: 'AE', name: 'Émirats Arabes Unis', nameEn: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Arabie Saoudite', nameEn: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', nameEn: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'CN', name: 'Chine', nameEn: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'Inde', nameEn: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'JP', name: 'Japon', nameEn: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corée du Sud', nameEn: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'ID', name: 'Indonésie', nameEn: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaisie', nameEn: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thaïlande', nameEn: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', nameEn: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'SG', name: 'Singapour', nameEn: 'Singapore', dialCode: '+65', flag: '🇸🇬' },

  // --- Amériques & Océanie ---
  { code: 'BR', name: 'Brésil', nameEn: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexique', nameEn: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentine', nameEn: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chili', nameEn: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombie', nameEn: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'HT', name: 'Haïti', nameEn: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
  { code: 'AU', name: 'Australie', nameEn: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nouvelle-Zélande', nameEn: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
];

/**
 * Find country by code (e.g. 'BJ', 'TG', 'CI')
 */
export function getCountryByCode(code) {
  if (!code) return COUNTRIES[0];
  const upper = code.toUpperCase();
  return COUNTRIES.find(c => c.code === upper) || COUNTRIES[0];
}

/**
 * Find country by dial code or detect from phone string (e.g. '+229', '+228')
 */
export function detectCountryFromPhone(phone) {
  if (!phone || typeof phone !== 'string') return COUNTRIES[0];
  const clean = phone.trim().replace(/\s+/g, '');
  if (!clean.startsWith('+')) return COUNTRIES[0];
  
  // Sort by dial code length descending so +229 matches before +20
  const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
  const match = sorted.find(c => clean.startsWith(c.dialCode));
  return match || COUNTRIES[0];
}
