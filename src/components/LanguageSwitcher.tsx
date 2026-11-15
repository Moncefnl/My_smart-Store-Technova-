import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { SupportedLanguage } from '../i18n/types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'minimal' | 'button' | 'dropdown' | 'badge';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { language, setLanguage } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center p-1 bg-slate-100/80 rounded-2xl ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleSelect(lang.code)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              language === lang.code
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'badge') {
    const otherLang = SUPPORTED_LANGUAGES.find((l) => l.code !== language) || SUPPORTED_LANGUAGES[1];
    return (
      <button
        type="button"
        onClick={() => handleSelect(otherLang.code)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors ${className}`}
        title={`التبديل إلى ${otherLang.nativeName} / Switch to ${otherLang.name}`}
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600" />
        <span>{otherLang.flag}</span>
        <span>{otherLang.nativeName}</span>
      </button>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id="language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-all border border-slate-200/60"
        aria-label="تغيير اللغة"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600" />
        <span className="flex items-center gap-1">
          <span>{currentLangObj.flag}</span>
          <span>{currentLangObj.nativeName}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 mb-1">
            اللغة / Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({lang.dir.toUpperCase()})</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
