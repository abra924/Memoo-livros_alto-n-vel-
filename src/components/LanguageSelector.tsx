import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { id: 'ao', label: 'AO', flag: '🇦🇴' },
  { id: 'en', label: 'EN', flag: '🇺🇸' },
] as const;

export default function LanguageSelector({ mobile }: { mobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleSelect = (id: 'en' | 'ao') => {
    setLanguage(id);
    setIsOpen(false);
  };

  const currentOption = languages.find(l => l.id === language);

  if (mobile) {
    return (
      <div className="space-y-4 px-2 sm:px-6 py-4">
        <div className="flex items-center gap-3 text-on-surface-variant font-bold text-xs sm:text-sm uppercase tracking-widest px-2">
          <Globe size={18} />
          Idioma da App
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id as any)}
              className={cn(
                "flex items-center sm:flex-col justify-between sm:justify-center gap-3 sm:gap-2 p-4 rounded-2xl border transition-all active:scale-95",
                language === lang.id
                   ? "bg-primary/10 border-primary text-primary"
                   : "bg-surface-container-high border-border text-on-surface-variant hover:border-primary/20"
              )}
            >
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2">
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-xs sm:text-[10px] font-black uppercase tracking-tighter">{lang.label}</span>
              </div>
              {language === lang.id && <Check size={16} className="sm:hidden" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-primary transition-all active:scale-95 group"
      >
        <span className="text-lg leading-none">{currentOption?.flag}</span>
        <span className="text-xs font-black uppercase hidden lg:inline tracking-widest">{currentOption?.id}</span>
        <ChevronDown 
          size={14} 
          className={cn("transition-transform duration-300 opacity-50 group-hover:opacity-100", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="language-selector-dropdown-container"
            className="absolute right-0 top-full mt-2 z-[70]"
          >
            {/* Overlay to close when clicking outside */}
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="w-48 bg-surface-container-highest rounded-2xl shadow-2xl border border-white/5 p-2 overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleSelect(lang.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all",
                    language === lang.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {language === lang.id && <Check size={16} />}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
