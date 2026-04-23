import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Target, Rocket, Heart, ShieldCheck, Zap, X, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  
  const values = [
    {
      icon: <BookOpen className="text-primary" size={32} />,
      title: 'Conhecimento Acessível',
      description: 'Acreditamos que o conhecimento de alta qualidade deve estar ao alcance de todos, de forma rápida e digerível.'
    },
    {
      icon: <Users className="text-secondary" size={32} />,
      title: 'Comunidade Primeiro',
      description: 'Construímos para e com a nossa comunidade de leitores e criadores apaixonados.'
    },
    {
      icon: <Target className="text-primary" size={32} />,
      title: 'Curadoria de Elite',
      description: 'Não queremos quantidade, queremos qualidade. Cada item na nossa plataforma passa por um rigoroso processo de seleção.'
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase"
          >
            {t('about.badge')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-headline font-extrabold text-on-surface leading-tight"
          >
            {t('about.title')}<span className="text-primary">{t('about.title_highlight')}</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-on-surface-variant leading-relaxed"
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Stats Section Removed (Simulation) */}

      {/* Mission & Vision */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-headline font-extrabold text-on-surface">A nossa missão é simples: acelerar o teu crescimento.</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Num mundo onde a informação é infinita, o tempo é o recurso mais escasso. A Memoo Livros atua como o teu filtro inteligente, selecionando os melhores livros, músicas e ferramentas digitais para que possas focar no que realmente interessa: a tua evolução.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <Rocket size={20} />
              </div>
              <div>
                <h4 className="text-on-surface font-bold">Visão 2030</h4>
                <p className="text-on-surface-variant text-sm">Ser o ecossistema digital de referência para a aprendizagem contínua na lusofonia.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Heart size={20} />
              </div>
              <div>
                <h4 className="text-on-surface font-bold">Paixão pelo que fazemos</h4>
                <p className="text-on-surface-variant text-sm">Cada resumo, cada template e cada beat é criado com atenção obsessiva aos detalhes.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl bg-surface-container-high border border-white/5 flex items-center justify-center p-12"
        >
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
               <Zap size={64} className="text-primary" />
            </div>
            <p className="text-xs uppercase font-black tracking-[0.3em] text-on-surface-variant opacity-50">Equipa MemooLivros</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-headline font-extrabold text-on-surface">Os nossos valores fundamentais</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">O que nos guia todos os dias na criação da melhor experiência para ti.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface p-10 rounded-[2.5rem] border border-white/5 space-y-6 hover:border-primary/20 transition-colors group"
              >
                <div className="p-4 bg-surface-container-high rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-on-surface">{value.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold">
          <ShieldCheck size={20} />
          Plataforma Segura e Verificada
        </div>
        <h2 className="text-4xl font-headline font-extrabold text-on-surface">Junta-te a milhares de mentes curiosas.</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
          A tua jornada de evolução começa aqui. Explora o nosso catálogo e descobre por que somos a escolha número um para quem nunca para de aprender.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/marketplace')}
            className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all"
          >
            Explorar Catálogo
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSupportModalOpen(true)}
            className="w-full sm:w-auto border border-white/10 text-on-surface px-10 py-4 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
          >
            Contactar Suporte
          </motion.button>
        </div>
      </section>

      {/* Support Modal */}
      <AnimatePresence>
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSupportModalOpen(false)}
              className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-highest rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-white">Centro de Ajuda</h3>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-black opacity-50">Suporte MemooLivros</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSupportModalOpen(false)}
                  className="p-3 hover:bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid gap-6">
                  <div className="p-6 bg-surface rounded-3xl border border-white/5 space-y-2">
                    <h4 className="text-primary font-bold">Como recebo o meu produto?</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Assim que o pagamento for confirmado, os teus produtos digitais (Ebooks, Música, Vídeos) aparecem instantaneamente no teu **Perfil &gt; Minha Biblioteca**. Podes descarregar ou ver online a qualquer momento.
                    </p>
                  </div>

                  <div className="p-6 bg-surface rounded-3xl border border-white/5 space-y-2">
                    <h4 className="text-secondary font-bold">Quais são os métodos de pagamento?</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Aceitamos **PayPal** para pagamentos automáticos internacionais. Para o mercado angolano, podes usar **Transferência/IBAN ou Multicaixa Express** contactando o nosso bot de vendas via WhatsApp.
                    </p>
                  </div>

                  <div className="p-6 bg-surface rounded-3xl border border-white/5 space-y-2">
                    <h4 className="text-on-surface font-bold">Posso partilhar a minha conta?</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      A tua conta é pessoal e intransmissível. A partilha de acessos pode resultar na suspensão da conta para garantir a segurança dos teus dados e direitos dos autores.
                    </p>
                  </div>
                </div>

                {/* Contact Footer */}
                <div className="pt-8 border-t border-white/5 text-center space-y-6">
                  <p className="text-on-surface-variant text-sm italic">
                    Ainda tens dúvidas? Estamos aqui para te ouvir.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="mailto:abraaomatondo118@gmail.com"
                      className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-gray-200 transition-all shadow-lg"
                    >
                      <Mail size={18} />
                      Enviar Email
                    </a>
                    <a 
                      href="https://wa.me/244923000000" // Placeholder phone, user can update in dashboard config
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#25D366]/20"
                    >
                      <MessageCircle size={18} />
                      Falar no WhatsApp
                    </a>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/50 uppercase font-black tracking-widest pt-4">
                    Para mais informações — Email: <span className="text-primary select-all">abraaomatondo118@gmail.com</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
