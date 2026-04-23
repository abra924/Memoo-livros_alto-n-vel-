import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ao';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.marketplace': 'Marketplace',
    'nav.books': 'Books',
    'nav.audiobooks': 'Audio Books',
    'nav.music': 'Music',
    'nav.videos': 'Videos',
    'nav.images': 'Images',
    'nav.about': 'About',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin Panel',
    'nav.search_placeholder': 'Search...',
    'nav.notifications': 'Notifications',
    'nav.hello': 'Hello',
    'footer.explore': 'Explore',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.marketplace': 'Marketplace',
    'footer.digital_books': 'Digital Books',
    'footer.audiobooks': 'Audio Books',
    'footer.music': 'Music & Beats',
    'footer.about': 'About Us',
    'footer.faqs': 'FAQs',
    'footer.settings': 'Settings',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.support': 'Support',
    'footer.description': 'The platform that transforms the way you read and learn. Digital curation for demanding minds.',
    'footer.rights': '© 2026 Memoo Livro Alto. Digital Curation.',
    'privacy.title': 'Privacy Policy',
    'privacy.back': 'Back',
    'privacy.badge': 'Privacy & Security',
    'privacy.subtitle': 'At Memoo Livro Alto, transparency is our main pillar. Learn how we protect your data and your identity.',
    'terms.title': 'Terms of Service',
    'terms.badge': 'Legal Agreements',
    'terms.subtitle': 'By using Memoo Livro Alto, you agree to the terms described below. These ensure the quality and security of all our curators.',
    'about.title': 'Transforming the way the world ',
    'about.title_highlight': 'learns',
    'about.badge': 'Our Story',
    'about.subtitle': 'Memoo Livro Alto was born from the need to filter digital noise and deliver only what really matters for your personal and professional evolution.',
    'hero.badge': 'Digital Curation',
    'hero.title': 'Knowledge that makes you evolve ',
    'hero.title_highlight': 'fast',
    'hero.subtitle': 'Discover books, music, templates and essential physical products. Intelligent curation that transforms the way you learn and create.',
    'hero.btn_books': 'Explore Books',
    'hero.btn_marketplace': 'View Marketplace',
    'newsletter.title': 'Receive ',
    'newsletter.title_highlight': 'fresh',
    'newsletter.title_suffix': ' knowledge',
    'newsletter.subtitle': 'Join our community of curious minds and receive exclusive recommendations every week.',
    'newsletter.placeholder': 'Your best email',
    'newsletter.button': 'Subscribe',
    'newsletter.success': 'Thanks for joining us!',
    'newsletter.subscribed': 'Subscribed!',
    'newsletter.error': 'An error occurred. Try again.',
  },
  ao: {
    'nav.home': 'Início',
    'nav.marketplace': 'Marketplace',
    'nav.books': 'Livros',
    'nav.audiobooks': 'Audio Book',
    'nav.music': 'Música',
    'nav.videos': 'Vídeos',
    'nav.images': 'Imagens',
    'nav.about': 'Sobre',
    'nav.login': 'Entrar',
    'nav.logout': 'Sair',
    'nav.profile': 'Meu Perfil',
    'nav.settings': 'Definições',
    'nav.admin': 'Painel Admin',
    'nav.search_placeholder': 'Procurar...',
    'nav.notifications': 'Novidades',
    'nav.hello': 'Olá',
    'footer.explore': 'Explorar',
    'footer.company': 'Empresa',
    'footer.legal': 'Legal',
    'footer.marketplace': 'Marketplace',
    'footer.digital_books': 'Livros Digitais',
    'footer.audiobooks': 'Audio Books',
    'footer.music': 'Música & Beats',
    'footer.about': 'Sobre nós',
    'footer.faqs': 'FAQs',
    'footer.settings': 'Definições',
    'footer.privacy': 'Privacidade',
    'footer.terms': 'Termos',
    'footer.support': 'Suporte',
    'footer.description': 'A plataforma que transforma a sua forma de ler e aprender. Curadoria digital para mentes exigentes.',
    'footer.rights': '© 2026 Memoo Livro Alto. Curadoria Digital.',
    'privacy.title': 'Política de Privacidade',
    'privacy.back': 'Voltar',
    'privacy.badge': 'Privacidade e Segurança',
    'privacy.subtitle': 'Na Memoo Livro Alto, a transparência é o nosso principal pilar. Saiba como protegemos os seus dados e a sua identidade.',
    'terms.title': 'Termos de Serviço',
    'terms.badge': 'Acordos Legais',
    'terms.subtitle': 'Ao utilizar a Memoo Livro Alto, concorda com os termos descritos abaixo. Estes asseguram a qualidade e a segurança de todos os nossos curadores.',
    'about.title': 'Transformando a forma como o mundo ',
    'about.title_highlight': 'aprende',
    'about.badge': 'A Nossa História',
    'about.subtitle': 'A Memoo Livro Alto nasceu da necessidade de filtrar o ruído digital e entregar apenas o que realmente importa para a tua evolução pessoal e profissional.',
    'hero.badge': 'Curadoria Memoo',
    'hero.title': 'Conhecimento que te faz subir ',
    'hero.title_highlight': 'rápido',
    'hero.subtitle': 'Descobre livros, músicas e produtos essenciais. A curadoria inteligente que transforma a tua forma de aprender.',
    'hero.btn_books': 'Ver Livros',
    'hero.btn_marketplace': 'Ver Marketplace',
    'newsletter.title': 'Receba conhecimento ',
    'newsletter.title_highlight': 'fresco',
    'newsletter.subtitle': 'Junta-te à nossa comunidade de mentes curiosas e recebe recomendações exclusivas todas as semanas.',
    'newsletter.placeholder': 'O teu melhor email',
    'newsletter.button': 'Subscrever',
    'newsletter.success': 'Estamos juntos! Obrigado por te juntares.',
    'newsletter.subscribed': 'Já está!',
    'newsletter.error': 'Deu bue de erro. Tenta outra vez.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ao');

  useEffect(() => {
    const saved = localStorage.getItem('memoo-lang') as Language;
    if (saved && (saved === 'en' || saved === 'ao')) {
      setLanguageState(saved);
    } else {
      // Migrate old 'pt' users to 'ao'
      setLanguageState('ao');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('memoo-lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
}
