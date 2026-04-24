import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  logoUrl?: string;
}

export default function Layout({ children, logoUrl }: LayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface selection:bg-secondary/30">
      <Navbar logoUrl={logoUrl} />
      <main className="pt-16">
        {children}
      </main>
      <footer className="w-full py-16 px-8 bg-surface-container-lowest border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" translate="no" className="text-2xl font-extrabold text-on-surface tracking-tighter font-headline hover:text-primary transition-colors flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Memoo" className="h-8 w-auto object-contain" />
              ) : (
                <>Memoo<span className="text-primary"> Livros</span></>
              )}
            </Link>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          
          {[
            { 
              title: t('footer.explore'), 
              links: [
                { label: t('footer.marketplace'), path: "/marketplace" }, 
                { label: t('footer.digital_books'), path: "/livros" }, 
                { label: t('footer.audiobooks'), path: "/audiobooks" }, 
                { label: t('footer.music'), path: "/musica" }
              ] 
            },
            { 
              title: t('footer.company'), 
              links: [
                { label: t('footer.about'), path: "/sobre" }, 
                { label: t('footer.faqs'), path: "/faqs" }, 
                { label: t('footer.support'), path: "mailto:abraaomatondo118@gmail.com", isExternal: true },
                { label: t('footer.settings'), path: "/definicoes" }
              ] 
            },
            { 
              title: t('footer.legal'), 
              links: [
                { label: t('footer.privacy'), path: "/privacidade" }, 
                { label: t('footer.terms'), path: "/termos" }
              ] 
            },
            { 
              title: t('footer.support'), 
              content: (
                <div className="space-y-4">
                  <p className="text-on-surface-variant text-sm">
                    Para qualquer dúvida, sugestão ou suporte personalizado, contacte-nos diretamente:
                  </p>
                  <a 
                    href={`mailto:abraaomatondo118@gmail.com`}
                    className="text-primary font-bold hover:underline transition-all block break-all"
                  >
                    abraaomatondo118@gmail.com
                  </a>
                </div>
              )
            }
          ].map((col) => (
            <div key={col.title} className="space-y-6">
              <h4 className="text-on-surface font-bold whitespace-nowrap">{col.title}</h4>
              {col.links ? (
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link.label}>
                      {link.isExternal ? (
                        <a 
                          href={link.path}
                          className="text-on-surface-variant hover:text-secondary transition-colors text-sm block hover:translate-x-1 duration-300 whitespace-nowrap"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link 
                          to={link.path} 
                          className="text-on-surface-variant hover:text-secondary transition-colors text-sm block hover:translate-x-1 duration-300 whitespace-nowrap"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              ) : col.content}
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border text-center">
          <p className="text-on-surface-variant text-xs tracking-widest uppercase" translate="no">
            {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
