import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe, Save, Loader2, CheckCircle2, AlertCircle, Laptop } from 'lucide-react';
import { supabase } from '../supabase';
import { useTheme } from '../lib/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('pt');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchUserAndSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch profile settings
        const { data: profile } = await supabase
          .from('profiles')
          .select('settings')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.settings) {
          setNotifications(profile.settings.notifications ?? true);
          setLanguage(profile.settings.language ?? 'pt');
        }
      }
      setFetching(false);
    };

    fetchUserAndSettings();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: {
            notifications,
            language
          }
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Definições guardadas com sucesso!' });
      
      // Auto-hide success message
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erro ao guardar definições.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest animate-pulse">A carregar definições...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
              <div className="p-6 bg-error/10 rounded-[2.5rem] text-error flex items-center justify-center">
                <AlertCircle size={64} />
              </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-black text-on-surface">Acesso Restrito</h1>
          <p className="text-on-surface-variant max-w-sm">Deverá iniciar sessão para personalizar a sua experiência e guardar o seu tema preferido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 lg:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-primary/10 text-primary rounded-3xl mb-4">
            <SettingsIcon size={32} />
          </div>
          <h1 className="text-4xl lg:text-7xl font-headline font-black text-primary">Definições</h1>
          <p className="text-on-surface-variant text-lg font-medium">Personaliza a tua interface e notificações.</p>
        </div>

        <div className="bg-surface-container-low rounded-[3rem] p-8 lg:p-12 border border-border space-y-12 shadow-2xl shadow-shadow">
          {/* Theme Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-on-surface font-bold px-2">
              <Sun size={20} className="text-primary" />
              Tema Visual
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Claro', icon: <Sun size={18} /> },
                { id: 'dark', label: 'Escuro', icon: <Moon size={18} /> },
                { id: 'system', label: 'Sistema', icon: <Laptop size={18} /> }
              ].map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`
                    flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold border transition-all
                    ${theme === t.id 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-surface-container-high border-border text-on-surface-variant hover:bg-surface-container-highest hover:border-primary/20'
                    }
                  `}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* Notifications Section */}
          <div className="flex items-center justify-between p-6 bg-surface-container-high rounded-[2rem] border border-border group hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-secondary/10 text-secondary rounded-2xl group-hover:scale-110 transition-transform">
                <Bell size={24} />
              </div>
              <div>
                <h4 className="text-on-surface font-bold">Notificações</h4>
                <p className="text-xs text-on-surface-variant font-medium">Alertas sobre novidades e promoções.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${notifications ? 'bg-secondary shadow-[0_0_15px_rgba(0,252,64,0.3)]' : 'bg-surface-container-highest'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Language Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-on-surface font-bold px-2">
              <Globe size={20} className="text-primary" />
              Idioma da App
            </div>
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-container-high border border-border rounded-2xl px-6 py-5 text-on-surface font-bold focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="pt">🇵🇹 &nbsp; Português (Portugal)</option>
                <option value="en">🇺🇸 &nbsp; English (US)</option>
                <option value="ao">🇦🇴 &nbsp; Português (Angola)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <Globe size={18} />
              </div>
            </div>
          </div>

          {/* Feedback & Save Area */}
          <div className="pt-4 space-y-6">
            <AnimatePresence>
              {message && (
                <motion.div 
                  key="settings-message"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center gap-3 p-5 rounded-2xl shadow-xl ${
                    message.type === 'success' 
                      ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                      : 'bg-error/10 text-error border border-error/20'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  <span className="text-sm font-bold">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:bg-primary-dim hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Save size={24} />
                  Guardar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
