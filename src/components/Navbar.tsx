import { motion, AnimatePresence } from 'motion/react';
import { Search, LogIn, LogOut, User as UserIcon, X, Menu, Settings as SettingsIcon, LayoutDashboard, Bell, Heart, Package, Globe, CheckCircle, ShoppingBag, Moon, Sun } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../lib/ThemeContext';

interface NavbarProps {
  logoUrl?: string;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ display_name: string | null; photo_url: string | null }>({ display_name: null, photo_url: null });
  const location = useLocation();
  const { language, t } = useLanguage();
  const { cart } = useCart();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch and listen to Profile data
  useEffect(() => {
    if (!user) {
      setProfile({ display_name: null, photo_url: null });
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, photo_url')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile({
          display_name: data.display_name,
          photo_url: data.photo_url
        });
      }
    };

    fetchProfile();

    // Listener para alterações em tempo real no perfil
    const channel = supabase
      .channel(`navbar-profile-${user.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, (payload: any) => {
        if (payload.new) {
          setProfile({
            display_name: payload.new.display_name,
            photo_url: payload.new.photo_url
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Listener para mensagens de sucesso do pop-up de login
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        // Forçamos um refresh para garantir a sincronização total da sessão
        window.location.reload();
      } else if (event.data?.type === 'OAUTH_ERROR') {
        setAuthError(event.data.error || 'Erro na autenticação externa.');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogin = async (email?: any) => {
    setAuthError(null);
    try {
      const targetEmail = typeof email === 'string' ? email : undefined;

      if (targetEmail) {
        const { error } = await supabase.auth.signInWithOtp({
          email: targetEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth-callback`,
          }
        });
        if (error) throw error;
        alert('Verifica o teu email! Enviamos um link de acesso.');
      } else {
        // Engenharia Premium: Abrir o Google DIRETAMENTE no Pop-up
        // No AI Studio, abrir rotas do container em popups falha.
        // Abrimos o URL da Google diretamente para autorização máxima.
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth-callback`,
            skipBrowserRedirect: true,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });

        if (error) {
          console.error("Supabase OAuth Error:", error);
          setAuthError(`Erro Técnico: ${error.message}. Dica: Verifica se o Client ID e o Secret estão corretamente guardados no teu painel do Supabase em Authentication -> Providers.`);
          return;
        }

        if (data?.url) {
          const width = 600;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          
          const popup = window.open(
            data.url,
            'google_login_popup',
            `width=${width},height=${height},left=${left},top=${top}`
          );

          if (!popup) {
            alert('O teu navegador bloqueou o pop-up de login. Por favor, permite pop-ups para este site.');
          }
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setAuthError(error.message || 'Ocorreu um erro ao iniciar sessão.');
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, fetchNotifications)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: 'user_id=is.null'
      }, fetchNotifications)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.marketplace'), path: '/marketplace' },
    { label: t('nav.books'), path: '/livros' },
    { label: t('nav.audiobooks'), path: '/audiobooks' },
    { label: t('nav.music'), path: '/musica' },
    { label: t('nav.videos'), path: '/videos' },
    { label: t('nav.images'), path: '/imagens' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-2 left-[48%] -translate-x-1/2 w-[95%] max-w-7xl rounded-full px-3 sm:px-6 py-1.5 sm:py-2 glass-effect flex justify-between items-center z-[100] shadow-2xl shadow-shadow border border-border"
    >
      <Link to="/" translate="no" className="text-xl lg:text-2xl font-extrabold text-on-surface tracking-tighter font-headline hover:text-primary transition-colors shrink-0 px-2 flex items-center gap-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Memoo" className="h-8 lg:h-10 w-auto object-contain" />
        ) : (
          <>Memoo<span className="text-primary truncate"> Livros</span></>
        )}
      </Link>
      
      <div className="hidden xl:flex gap-2 xl:gap-3 items-center flex-1 justify-center mx-2">
        {navItems.map((item) => (
          <Link 
            key={item.label}
            to={item.path} 
            className={cn(
              "text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-full whitespace-nowrap lg:max-content",
              item.path === '/livros' 
                ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" 
                : location.pathname === item.path 
                  ? "text-primary" 
                  : "text-on-surface-variant hover:text-primary hover:bg-white/5"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 lg:gap-4 shrink-0">
        <div className="flex items-center">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                key="navbar-search"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'clamp(140px, 30vw, 240px)', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden bg-surface-container-high rounded-full flex items-center mr-2"
              >
                <input 
                  type="text" 
                  placeholder={t('nav.search_placeholder')} 
                  className="bg-transparent border-none focus:ring-0 text-xs sm:text-sm px-4 py-2 w-full text-on-surface placeholder:text-on-surface-variant"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsNotificationsOpen(false);
              setIsMenuOpen(false);
            }}
            className={cn(
              "p-2 transition-colors rounded-full",
              isSearchOpen ? "text-primary bg-surface-container-high" : "text-on-surface-variant hover:text-primary"
            )}
          >
            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-on-surface-variant hover:text-primary transition-all rounded-full active:scale-95"
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link 
            to="/checkout"
            className={cn(
              "p-2 transition-all rounded-full relative group",
              location.pathname === '/checkout' ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-primary active:scale-95"
            )}
          >
            <ShoppingBag size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-shadow pulse-custom">
                {cart.length}
              </span>
            )}
          </Link>

          {user && (
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsSearchOpen(false);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "p-2 transition-colors rounded-full relative group",
                  isNotificationsOpen ? "text-primary bg-surface-container-high" : "text-on-surface-variant hover:text-primary"
                )}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-surface shadow-sm" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    key="notifications-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface-container-highest rounded-2xl shadow-2xl border border-border p-4 z-[110] origin-top-right overflow-hidden shadow-primary/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-on-surface font-bold text-sm">{t('nav.notifications')}</h4>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] font-black uppercase tracking-tighter text-primary hover:text-primary-dim transition-colors"
                        >
                          Marcar tudo como lido
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                            className={cn(
                              "p-3 rounded-xl transition-all cursor-pointer relative group",
                              n.is_read ? "bg-surface-container-low opacity-60" : "bg-surface-container-high border border-primary/10"
                            )}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h5 className={cn("text-xs font-bold leading-tight", n.is_read ? "text-on-surface-variant" : "text-on-surface")}>
                                {n.title}
                              </h5>
                              {!n.is_read && <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1" />}
                            </div>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">{n.message}</p>
                            <span className="text-[9px] text-on-surface-variant/50 mt-2 block">
                              {new Date(n.created_at).toLocaleDateString()}
                            </span>
                            
                            {!n.is_read && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(n.id);
                                }}
                                className="absolute top-2 right-2 p-1 bg-primary/10 text-primary rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Marcar como lido"
                              >
                                <CheckCircle size={12} />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-xs text-on-surface-variant">Nenhuma notificação por aqui.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button 
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              setIsSearchOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="xl:hidden p-2 text-on-surface-variant hover:text-primary transition-colors h-10 w-10 flex items-center justify-center rounded-full active:bg-white/5"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
          <div className="relative z-[110]">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 bg-surface-container-highest p-1 pr-3 rounded-full hover:bg-surface-container-high transition-colors border border-border active:scale-95 transition-all"
                >
                  {profile.photo_url || user.user_metadata?.avatar_url ? (
                    <img src={profile.photo_url || user.user_metadata.avatar_url} alt={profile.display_name || ''} className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-dim flex items-center justify-center text-white text-xs font-bold">
                      {(profile.display_name || user.email)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-on-surface hidden sm:inline" translate="no">
                    {t('nav.hello')}, {(profile.display_name || user.user_metadata?.full_name || user.email)?.split(' ').filter((n: string) => !/mambo/i.test(n))[0] || 'Aventureiro'}
                  </span>
                  {user.email === 'abraaomatondo118@gmail.com' && (
                    <span className="ml-1 px-2 py-0.5 bg-primary/20 border border-primary/30 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter animate-pulse" translate="no">
                      Admin
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      key="user-menu-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-surface-container-highest rounded-2xl shadow-2xl border border-white/5 p-2 overflow-hidden z-[120] origin-top-right shadow-primary/5"
                    >
                      <Link 
                        to="/perfil"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                      >
                        <UserIcon size={18} />
                        {t('nav.profile')}
                      </Link>
                      {user.email === 'abraaomatondo118@gmail.com' && (
                        <Link 
                          to="/painel-admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface-container-high rounded-xl transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          {t('nav.admin')}
                        </Link>
                      )}
                      <Link 
                        to="/definicoes"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                      >
                        <SettingsIcon size={18} />
                        {t('nav.settings')}
                      </Link>
                      <div className="h-px bg-border my-1.5 opacity-50" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-error hover:bg-surface-container-high rounded-xl transition-colors"
                      >
                        <LogOut size={18} />
                        {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
            <button 
              onClick={handleLogin}
              className="bg-primary-dim hover:bg-primary text-white px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <LogIn size={18} />
              {t('nav.login')}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden absolute top-full left-0 w-full bg-surface-container-highest border-t border-border overflow-hidden z-50"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-bold transition-all px-6 py-4 rounded-2xl flex items-center gap-3 active:scale-95",
                    item.path === '/livros' 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : location.pathname === item.path 
                        ? "text-primary bg-surface-container-high" 
                        : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-lg font-bold text-on-surface-variant">Tema</span>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-xl text-primary font-bold transition-all active:scale-95"
                >
                  {theme === 'dark' ? (
                    <><Sun size={18} /> Modo Claro</>
                  ) : (
                    <><Moon size={18} /> Modo Escuro</>
                  )}
                </button>
              </div>

              <LanguageSelector mobile />

              {user && (
                <>
                  <div className="h-px bg-border my-2" />
                  <Link 
                    to="/perfil" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold text-on-surface-variant hover:text-primary flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-surface-container-high transition-all"
                  >
                    <UserIcon size={24} />
                    {t('nav.profile')}
                  </Link>
                  {user.email === 'abraaomatondo118@gmail.com' && (
                    <Link 
                      to="/painel-admin" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold text-primary flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-surface-container-high transition-all"
                    >
                      <LayoutDashboard size={24} />
                      {t('nav.admin')}
                    </Link>
                  )}
                  <Link 
                    to="/definicoes" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold text-on-surface-variant hover:text-primary flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-surface-container-high transition-all"
                  >
                    <SettingsIcon size={24} />
                    {t('nav.settings')}
                  </Link>
                </>
              )}
              {!user && (
                <button 
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-primary-dim text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <LogIn size={20} />
                  {t('nav.login')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Auth Error Toast */}
      <AnimatePresence>
        {authError && (
          <motion.div 
            key="auth-error-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 bg-error text-white rounded-2xl shadow-2xl z-[70] flex items-center gap-3 w-full max-w-sm mx-4"
          >
            <SettingsIcon size={20} className="shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold">Erro de Autenticação</p>
              <p className="text-xs opacity-90">{authError}</p>
            </div>
            <button onClick={() => setAuthError(null)} className="p-1 hover:bg-white/10 rounded-full">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
