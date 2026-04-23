import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { useLanguage } from '../contexts/LanguageContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { t, language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este email já está subscrito!');
        }
        throw error;
      }

      setStatus('success');
      setMessage(t('newsletter.success'));
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error: any) {
      console.error('Erro na subscrição:', error);
      setStatus('error');
      setMessage(t('newsletter.error'));
      
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  return (
    <section className="px-6 lg:px-12 max-w-7xl mx-auto py-16 sm:py-24">
      <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-surface-container-highest p-8 sm:p-12 lg:p-20 text-center space-y-8 border border-border">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 space-y-4"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-on-surface-heading leading-tight px-2">
            {t('newsletter.title')}<span className="text-secondary">{t('newsletter.title_highlight')}</span>{language === 'en' ? t('newsletter.title_suffix') : ''}
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto text-sm sm:text-lg px-4">
            {t('newsletter.subtitle')}
          </p>
        </motion.div>
        
        <div className="relative z-10 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="email" 
                required
                placeholder={t('newsletter.placeholder')} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-surface-container-high px-6 py-4 rounded-full border border-border focus:outline-none focus:border-primary transition-all text-on-surface shadow-inner disabled:opacity-50"
              />
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
                  >
                    <CheckCircle2 size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="bg-secondary text-surface px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-secondary-dim transition-all active:scale-95 shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[140px]"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : status === 'success' ? (
                t('newsletter.subscribed')
              ) : (
                <>
                  {t('newsletter.button')}
                  <Send size={18} />
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "mt-4 text-sm font-bold flex items-center justify-center gap-2",
                  status === 'success' ? "text-secondary" : "text-error"
                )}
              >
                {status === 'error' && <AlertCircle size={16} />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// Utility for concatenating classes since we need it for conditional colors
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
