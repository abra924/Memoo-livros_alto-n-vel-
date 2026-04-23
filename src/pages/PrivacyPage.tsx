import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPage() {
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold uppercase tracking-widest"
          >
            <ShieldCheck size={18} />
            {t('privacy.badge')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-headline font-black text-white"
          >
            {t('privacy.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg leading-relaxed max-w-2xl font-medium"
          >
            {t('privacy.subtitle')}
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
            <div className="flex items-center gap-4 text-secondary">
              <div className="p-3 bg-secondary/10 rounded-2xl">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">1. Recolha de Dados</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Recolhemos apenas as informações estritamente necessárias para proporcionar a melhor experiência de leitura e aprendizagem. Isto inclui o seu nome, endereço de e-mail e histórico de aquisições para garantir o acesso vitalício aos seus produtos digitais.
            </p>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">2. Transparência</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Nunca partilhamos, vendemos ou alugamos os seus dados pessoais a terceiros para fins de marketing. O seu utilizador é sagrado, e os seus hábitos de leitura pertencem apenas a si. Utilizamos cookies apenas para manter a sua sessão ativa e melhorar a navegação.
            </p>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 3 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-secondary">
              <div className="p-3 bg-secondary/10 rounded-2xl">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">3. Direitos do Utilizador</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              De acordo com o RGPD e as boas práticas internacionais, tem o direito de solicitar a exportação ou eliminação definitiva de todos os seus dados da nossa plataforma a qualquer momento. Para isso, basta contactar o nosso suporte dedicado.
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
