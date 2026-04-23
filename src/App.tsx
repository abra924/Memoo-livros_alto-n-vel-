import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import DigitalProductsPage from './pages/DigitalProductsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductPage from './pages/ProductPage';
import AudiobooksPage from './pages/AudiobooksPage';
import MusicPage from './pages/MusicPage';
import ImagesPage from './pages/ImagesPage';
import VideosPage from './pages/VideosPage';
import MarketplacePage from './pages/MarketplacePage';
import AuthCallback from './pages/AuthCallback';
import LoginPopup from './pages/LoginPopup';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ThemeProvider } from './lib/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import CheckoutPage from './pages/CheckoutPage';

// Component to track page views on route change
const AnalyticsTracker = ({ measurementId, user }: { measurementId: string, user: User | null }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Google Analytics
    const id = measurementId || 'G-7N8DBYDT0T'; // Default fallback
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', id, {
        page_path: location.pathname + location.search,
      });
    }

    // 2. Internal Tracking (Referrers) - Improved for Realness
    const trackVisit = async () => {
      try {
        const referrer = document.referrer;
        const currentPath = location.pathname;
        const hostname = window.location.hostname;
        
        // Detect development environment (AI Studio)
        const isDevEnv = 
          hostname.includes('ais-dev-') || 
          hostname.includes('ais-pre-') || 
          hostname.includes('localhost') ||
          referrer.includes('aistudio.google.com');

        // Store in session to keep the "is_dev" status throughout the navigation
        if (isDevEnv) {
          sessionStorage.setItem('memoo_dev_session', 'true');
        }

        const isDevSession = sessionStorage.getItem('memoo_dev_session') === 'true';

        // ONLY track if it's NOT a dev session and NOT an admin path
        if (isDevSession || currentPath.startsWith('/painel-admin') || currentPath.startsWith('/admin')) {
          return;
        }

        // Avoid duplicate tracking in same session for same path (anti-refresh)
        const sessionKey = `tracked_${currentPath}`;
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, 'true');

        // Check if user is a client (has purchased anything)
        let isClient = false;
        if (user) {
          const { count } = await supabase
            .from('library')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          isClient = (count || 0) > 0;
        }

        await supabase.from('page_visits').insert({
          path: currentPath,
          referrer: referrer || 'Direto / Bookmark',
          user_id: user?.id || null,
          is_client: isClient
        });
      } catch (err) {
        console.error('Error tracking visit:', err);
      }
    };

    trackVisit();
  }, [location, measurementId, user]);

  return null;
};

// Component to track referrals from URL
const ReferralTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      // Store referrer ID in local storage to use during sign up or purchase
      localStorage.setItem('memoo_referrer_id', ref);
      console.log('Referrer ID captured:', ref);
    }
  }, [location]);

  return null;
};

const PlaceholderPage = ({ title }: { title: string }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-12">
      <h1 className="text-4xl font-headline font-extrabold text-white mb-4">{title}</h1>
      <p className="text-on-surface-variant max-w-md">Esta página está em desenvolvimento. Em breve teremos novidades incríveis aqui!</p>
    </div>
  );
};

// Component to ensure user profile exists
const ProfileSync = ({ user }: { user: User | null }) => {
  useEffect(() => {
    if (!user) return;

    const syncProfile = async () => {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (!profile) {
        // Create profile if missing
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          photo_url: user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        });

        // Handle referral link if this is a new profile
        const referrerId = localStorage.getItem('memoo_referrer_id');
        if (referrerId && referrerId !== user.id) {
          try {
            await supabase.from('referrals').insert({
              referrer_id: referrerId,
              referred_user_id: user.id,
              status: 'pending'
            });
            // Clear used referrer
            localStorage.removeItem('memoo_referrer_id');
          } catch (err) {
            console.error('Erro ao registar referência:', err);
          }
        }
      }
    };

    syncProfile();
  }, [user]);

  return null;
};

function AppContent({ gaId, logoUrl, initialPayPalOptions, user }: { gaId: string, logoUrl: string, initialPayPalOptions: any, user: User | null }) {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-surface" translate="no">
      <ThemeProvider>
        <PayPalScriptProvider options={initialPayPalOptions}>
        <Router>
          <AnalyticsTracker measurementId={gaId} user={user} />
          <ReferralTracker />
          <ProfileSync user={user} />
          <Layout logoUrl={logoUrl} key={language}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/livros" element={<BooksPage />} />
              <Route path="/audiobooks" element={<AudiobooksPage />} />
              <Route path="/musica" element={<MusicPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/imagens" element={<ImagesPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/digital" element={<DigitalProductsPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/definicoes" element={<SettingsPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/painel-admin" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/fisico" element={<PlaceholderPage title="Produtos Físicos" />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              <Route path="/login-popup" element={<LoginPopup />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/termos" element={<TermsPage />} />
            </Routes>
          </Layout>
        </Router>
      </PayPalScriptProvider>
    </ThemeProvider>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [gaId, setGaId] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [faviconUrl, setFaviconUrl] = useState<string>('');

  const initialPayPalOptions = {
    clientId: (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "EUR",
    intent: "capture",
  };

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    // Fetch GA ID
    const fetchConfig = async () => {
      try {
        const { data } = await supabase.from('config').select('*').eq('id', 'analytics').single();
        if (data) {
          if (data.measurementId) setGaId(data.measurementId);
          if (data.logo_url) setLogoUrl(data.logo_url);
          if (data.favicon_url) setFaviconUrl(data.favicon_url);
        }
      } catch (error) {
        // Silently fail if table doesn't exist yet
      }
    };
    fetchConfig();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(newLink);
      }
    }
  }, [faviconUrl]);
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-extrabold text-white tracking-tighter font-headline"
          translate="no"
        >
          Memoo<span className="text-primary"> Livro Alto</span>
        </motion.div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <CartProvider>
        <AppContent gaId={gaId} logoUrl={logoUrl} initialPayPalOptions={initialPayPalOptions} user={user} />
      </CartProvider>
    </LanguageProvider>
  );
}
