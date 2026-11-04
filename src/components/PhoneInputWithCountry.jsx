import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { COUNTRIES, getCountryByCode, detectCountryFromPhone } from '../data/countriesData';

export default function PhoneInputWithCountry({
  value = '',
  onChange,
  defaultCountry = 'BJ',
  placeholder = 'Ex: 97 69 91 78',
  required = false,
  lang = 'fr',
  className = ''
}) {
  const isEn = lang === 'en';
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (value && value.startsWith('+')) {
      return detectCountryFromPhone(value);
    }
    return getCountryByCode(defaultCountry);
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localNumber, setLocalNumber] = useState(() => {
    if (value && value.startsWith('+')) {
      const detected = detectCountryFromPhone(value);
      return value.replace(detected.dialCode, '').trim();
    }
    return value;
  });

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync if external value changes
  useEffect(() => {
    if (value && value.startsWith('+')) {
      const detected = detectCountryFromPhone(value);
      setSelectedCountry(detected);
      setLocalNumber(value.replace(detected.dialCode, '').trim());
    } else if (value !== undefined) {
      setLocalNumber(value);
    }
  }, [value]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    const full = localNumber.trim() ? `${country.dialCode} ${localNumber.trim()}` : country.dialCode;
    if (onChange) onChange(full, country);
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value;
    // Allow numbers, spaces, and hyphens
    const cleaned = raw.replace(/[^\d\s-]/g, '');
    setLocalNumber(cleaned);
    const full = cleaned.trim() ? `${selectedCountry.dialCode} ${cleaned.trim()}` : '';
    if (onChange) onChange(full, selectedCountry);
  };

  const filteredCountries = COUNTRIES.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`phone-input-group ${className}`} style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        border: '1px solid rgba(15, 23, 42, 0.15)',
        borderRadius: 'var(--radius-md, 10px)',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}>
        {/* Country Flag & Dial Code Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 14px',
            background: 'rgba(15, 23, 42, 0.03)',
            border: 'none',
            borderRight: '1px solid rgba(15, 23, 42, 0.12)',
            cursor: 'pointer',
            fontSize: '0.92rem',
            color: '#0f172a',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            flexShrink: 0
          }}
          title={isEn ? "Select country code" : "Sélectionner l'indicatif pays"}
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary, #166534)' }}>{selectedCountry.dialCode}</span>
          <ChevronDown size={14} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {/* Local Phone Number Input Field */}
        <input
          type="tel"
          required={required}
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={placeholder}
          style={{
            flexGrow: 1,
            padding: '12px 14px',
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            color: 'var(--text-primary, #0f172a)',
            background: 'transparent',
            minWidth: '0'
          }}
        />
      </div>

      {/* Searchable Country Picker Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          zIndex: 10000,
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)',
          maxHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease'
        }}>
          {/* Search Header */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc' }}>
            <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search country or +code..." : "Rechercher pays ou indicatif..."}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                color: '#0f172a'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Countries List */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {filteredCountries.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                {isEn ? "No country found" : "Aucun pays trouvé"}
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      border: 'none',
                      background: isSelected ? 'rgba(22, 101, 52, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                      fontSize: '0.88rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      <span style={{ fontSize: '1.25rem', lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                      <span style={{ fontWeight: isSelected ? 800 : 500, color: isSelected ? '#166534' : '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {isEn ? c.nameEn : c.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginLeft: '12px', flexShrink: 0 }}>
                      {c.dialCode}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
