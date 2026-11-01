import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { COUNTRIES, getCountryByCode } from '../data/countriesData';

export default function CountrySelect({
  value = 'BJ',
  onChange,
  lang = 'fr',
  placeholder = 'Sélectionner un pays...',
  className = '',
  required = false
}) {
  const isEn = lang === 'en';
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return getCountryByCode(value) || COUNTRIES[0];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (value) {
      // value could be code ('BJ') or name ('Bénin')
      const matched = COUNTRIES.find(c => 
        c.code.toLowerCase() === value.toLowerCase() || 
        c.name.toLowerCase() === value.toLowerCase() ||
        c.nameEn.toLowerCase() === value.toLowerCase()
      );
      if (matched) setSelectedCountry(matched);
    }
  }, [value]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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

  const handleSelect = (c) => {
    setSelectedCountry(c);
    setIsOpen(false);
    setSearchQuery('');
    if (onChange) onChange(c.name, c);
  };

  const filteredCountries = COUNTRIES.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`country-select-group ${className}`} style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 16px',
          border: '1px solid rgba(15, 23, 42, 0.15)',
          borderRadius: 'var(--radius-md, 10px)',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontSize: '0.95rem',
          cursor: 'pointer',
          textAlign: 'left',
          boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
          <span style={{ fontWeight: 600 }}>{isEn ? selectedCountry.nameEn : selectedCountry.name}</span>
        </div>
        <ChevronDown size={16} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input 
          type="text" 
          required 
          value={selectedCountry.name} 
          onChange={() => {}} 
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }} 
        />
      )}

      {/* Dropdown Menu */}
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
          {/* Search Box */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc' }}>
            <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder || (isEn ? "Search a country..." : "Rechercher un pays...")}
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

          {/* List of Countries */}
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
                    onClick={() => handleSelect(c)}
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
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{c.flag}</span>
                      <span style={{ fontWeight: isSelected ? 800 : 500, color: isSelected ? '#166534' : '#1e293b' }}>
                        {isEn ? c.nameEn : c.name}
                      </span>
                    </div>
                    {c.priority && (
                      <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                        {c.code}
                      </span>
                    )}
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
