import React from 'react';
import { motion } from 'motion/react';
import { Scale, FileCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function TermsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header */}
      <section className="px-6 lg:px-12 max-w-4xl mx-auto py-16 space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">{t('privacy.back')}</span>
        </button>

        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest"
          >
            <Scale size={18} />
            {t('terms.badge')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-headline font-black text-white"
          >
            {t('terms.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg leading-relaxed max-w-2xl font-medium"
          >
            {t('terms.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 lg:px-12 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container-low border border-white/5 rounded-[2.5rem] p-8 lg:p-12 space-y-12 shadow-2xl shadow-black/40"
        >
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <FileCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">1. Propriedade Intelectual</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Todo o conteúdo disponível na Memoo Livros, incluindo ebooks, áudios e imagens, é protegido por direitos de autor. A compra concede-lhe uma licença de uso pessoal e intransmissível. A partilha ilegal ou redistribuição é estritamente proibida.
            </p>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-secondary">
              <div className="p-3 bg-secondary/10 rounded-2xl">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">2. Responsabilidade</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              A Memoo Livros atua como uma plataforma de curadoria e venda. Embora façamos o máximo para garantir a qualidade dos conteúdos, não somos responsáveis pelo uso que o utilizador faz das informações ou estratégias contidas nos livros e cursos.
            </p>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 3 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">3. Reembolsos</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Devido à natureza digital dos nossos produtos (entrega imediata), os reembolsos são processados apenas em casos de erro técnico comprovado ou se o conteúdo não corresponder à descrição oficial, dentro do prazo de 14 dias após a compra.
            </p>
          </div>

          <div className="pt-8 text-center border-t border-white/5">
            <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold">
              Última atualização: 17 de Abril, 2026
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
