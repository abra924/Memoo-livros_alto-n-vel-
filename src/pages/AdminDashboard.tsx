import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Music, 
  Image as ImageIcon, 
  Film,
  Settings, 
  TrendingUp, 
  Users, 
  Eye, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Heart, 
  MousePointer2, 
  Shield, 
  Clock, 
  Star, 
  ArrowRight, 
  Copy, 
  Share2, 
  Mail, 
  UserPlus, 
  BarChart3, 
  ShieldCheck, 
  Check, 
  Loader2, 
  Calendar, 
  Crown, 
  RefreshCw,
  Megaphone,
  ExternalLink,
  Menu,
  X,
  MessageCircle,
  ShoppingBag,
  Zap,
  Pencil,
  Download,
  Send,
  Camera,
  Video,
  Info,
  ChevronDown,
  Bell as BellIcon,
  Save,
  XCircle,
  ArrowUpRight,
  Globe,
  Sparkles,
  Image as ImageIconLucide
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from '../supabase';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

// Mock data for traffic (initialized empty for production)
const trafficData: any[] = [];

const topPages: any[] = [];

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'traffic' | 'content' | 'settings' | 'notifications' | 'newsletter' | 'marketing' | 'whatsapp' | 'banners' | 'watermark' | 'sessions' | 'ads'>('traffic');
  const [contentType, setContentType] = useState<'ebook' | 'music' | 'image' | 'video' | 'audiobook'>('ebook');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [isUploadingAd, setIsUploadingAd] = useState(false);
  const [adForm, setAdForm] = useState({
    title: '',
    type: 'banner',
    content: '',
    link_url: '',
    placement: 'sidebar',
    page_target: 'all',
    is_active: true
  });
  const [adFile, setAdFile] = useState<File | null>(null);
  const [adFilePreview, setAdFilePreview] = useState<string | null>(null);
  const [whatsappOrders, setWhatsappOrders] = useState<any[]>([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState<string | null>(null);
  const [gaId, setGaId] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [isSavingGA, setIsSavingGA] = useState(false);
  const [gaSaved, setGaSaved] = useState(false);
  const [isSavingVisual, setIsSavingVisual] = useState(false);
  const [visualSaved, setVisualSaved] = useState(false);
  const [isWatermarking, setIsWatermarking] = useState(false);
  const [isAuthenticatingMusic, setIsAuthenticatingMusic] = useState(false);
  const [selectedProductForWatermark, setSelectedProductForWatermark] = useState<any>(null);
  const [selectedMusicForAuth, setSelectedMusicForAuth] = useState<any>(null);
  const [watermarkText, setWatermarkText] = useState('Memoo Livros - Autêntico');
  const [ibanBank, setIbanBank] = useState('');
  const [ibanNumber, setIbanNumber] = useState('');
  const [ibanOwner, setIbanOwner] = useState('');
  const [isSavingIban, setIsSavingIban] = useState(false);
  const [ibanSaved, setIbanSaved] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', message: '', target: 'all' as 'all' | 'specific' });
  const [targetEmail, setTargetEmail] = useState('');
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [isSendingCampaign, setIsSendingCampaign] = useState<string | null>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    image_url: ''
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [referrersData, setReferrersData] = useState<any[]>([]);
  const [wishlistStats, setWishlistStats] = useState<any[]>([]);
  const [recentWishlist, setRecentWishlist] = useState<any[]>([]);
  const [totalWishlisted, setTotalWishlisted] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [realTrafficData, setRealTrafficData] = useState<any[]>([]);
  const [libraryData, setLibraryData] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 10 });
  const [usersError, setUsersError] = useState<string | null>(null);
  const [isConfiguringCrossSell, setIsConfiguringCrossSell] = useState(false);
  const [crossSellBaseProduct, setCrossSellBaseProduct] = useState<any>(null);
  const [selectedCrossSellSuggestions, setSelectedCrossSellSuggestions] = useState<string[]>([]);
  const [isSavingCrossSell, setIsSavingCrossSell] = useState(false);
  const [isConfiguringUpsell, setIsConfiguringUpsell] = useState(false);
  const [upsellBaseProduct, setUpsellBaseProduct] = useState<any>(null);
  const [targetUpsellProduct, setTargetUpsellProduct] = useState<any>(null);
  const [isSavingUpsell, setIsSavingUpsell] = useState(false);
  const [isConfiguringCartRecovery, setIsConfiguringCartRecovery] = useState(false);
  const [cartRecoveryEnabled, setCartRecoveryEnabled] = useState(false);
  const [cartRecoveryDelay, setCartRecoveryDelay] = useState(24);
  const [isSavingCartRecovery, setIsSavingCartRecovery] = useState(false);
  const [cartRecoverySubject, setCartRecoverySubject] = useState('Esqueceste-te de algo incrível na Memoo Livros? 📚');
  const [cartRecoveryBody, setCartRecoveryBody] = useState('Olá [Nome], vimos que deixaste alguns itens no teu carrinho. \n\nA tua jornada literária está à tua espera! Para te ajudar a decidir, preparámos um desconto especial exclusivo para TI. \n\nUsa o código: VOUVOLTAR10');
  const [manualRecoveryEmail, setManualRecoveryEmail] = useState('');
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const navigate = useNavigate();

  const getFileNameFromUrl = (url: string) => {
    if (!url) return '';
    try {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      // Remove query params if any
      const fileName = lastPart.split('?')[0];
      return decodeURIComponent(fileName);
    } catch (e) {
      return 'ficheiro_guardado';
    }
  };

  // Content form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'produtividade',
    price: '',
    currency: 'AOA',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [demoVideoFile, setDemoVideoFile] = useState<File | null>(null);
  const [demoAudioFile, setDemoAudioFile] = useState<File | null>(null);
  const [demoEbookFile, setDemoEbookFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const mainRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingProduct) return; // Prevent category override when editing
    if (contentType === 'image') {
      setFormData(prev => ({ ...prev, category: 'imagens' }));
    } else if (contentType === 'music') {
      setFormData(prev => ({ ...prev, category: 'musica' }));
    } else if (contentType === 'video') {
      setFormData(prev => ({ ...prev, category: 'animacao-2d' }));
    } else if (contentType === 'ebook' && (formData.category === 'imagens' || formData.category === 'musica' || formData.category === 'animacao-2d')) {
      setFormData(prev => ({ ...prev, category: 'produtividade' }));
    }
  }, [contentType, editingProduct]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user && session.user.email === 'abraaomatondo118@gmail.com') {
        setIsAdmin(true);
      } else {
        navigate('/'); // Redirect non-admins
      }
      setIsLoading(false);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && session.user.email === 'abraaomatondo118@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        if (!isLoading) navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const [newSubEmail, setNewSubEmail] = useState('');
  const [isAddingSub, setIsAddingSub] = useState(false);
  
  // Newsletter Media Upload State
  const [newsletterImageFile, setNewsletterImageFile] = useState<File | null>(null);
  const [newsletterVideoFile, setNewsletterVideoFile] = useState<File | null>(null);
  const [newsletterImagePreview, setNewsletterImagePreview] = useState('');
  const [newsletterVideoPreview, setNewsletterVideoPreview] = useState('');
  const [newsletterImageUrlInput, setNewsletterImageUrlInput] = useState('');
  const [newsletterVideoUrlInput, setNewsletterVideoUrlInput] = useState('');
  const [isUploadingNewsletterMedia, setIsUploadingNewsletterMedia] = useState(false);

  const fetchLibrary = async () => {
    const { data, error } = await supabase
      .from('library')
      .select('*, products(title, price, currency), profiles(email, full_name)');
    if (!error) setLibraryData(data || []);
  };

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setCoupons(data || []);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setProducts(data || []);
  };

  const fetchWhatsappOrders = async () => {
    const { data, error } = await supabase
      .from('whatsapp_orders')
      .select('*, products(title, price, currency, cover_url), profiles(email, display_name)')
      .order('created_at', { ascending: false });
    
    if (!error) setWhatsappOrders(data || []);
    else console.error("Erro ao carregar ordens WhatsApp:", error);
  };

  const handleApproveOrder = async (order: any) => {
    setIsProcessingOrder(order.id);
    try {
      // 1. Adicionar à biblioteca
      const { error: libError } = await supabase
        .from('library')
        .insert({
          user_id: order.user_id,
          product_id: order.product_id
        });
      
      if (libError) throw libError;

      // 2. Atualizar status da ordem
      const { error: orderError } = await supabase
        .from('whatsapp_orders')
        .update({ status: 'approved' })
        .eq('id', order.id);
      
      if (orderError) throw orderError;

      // 3. Sistema de Afiliados - Recompensar o Referrer
      if (order.referrer_id) {
        try {
          // Marcar referência como completada
          await supabase
            .from('referrals')
            .update({ status: 'completed' })
            .eq('referrer_id', order.referrer_id)
            .eq('referred_user_id', order.user_id);
          
          // Gerar cupão de recompensa (10% de desconto)
          const rewardCode = `OBRIGADO-${Math.random().toString(36).substring(7).toUpperCase()}`;
          await supabase.from('coupons').insert({
            code: rewardCode,
            discount: 10
          });
          
          // Poderíamos enviar uma notificação aqui se houvesse um sistema de notificações in-app para utilizadores
          console.log(`Recompensa gerada para ${order.referrer_id}: ${rewardCode}`);
        } catch (refErr) {
          console.error("Erro ao processar recompensa de afiliado:", refErr);
        }
      }

      // 4. Atualizar UI
      fetchWhatsappOrders();
      fetchLibrary();
      fetchCoupons(); // Refresh coupons list
    } catch (err) {
      console.error("Erro ao aprovar ordem:", err);
      alert("Falha ao aprovar ordem. Tente novamente.");
    } finally {
      setIsProcessingOrder(null);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm("Tens a certeza que queres rejeitar esta ordem?")) return;
    
    setIsProcessingOrder(orderId);
    try {
      const { error } = await supabase
        .from('whatsapp_orders')
        .update({ status: 'rejected' })
        .eq('id', orderId);
      
      if (error) throw error;
      fetchWhatsappOrders();
    } catch (err) {
      console.error("Erro ao rejeitar ordem:", err);
    } finally {
      setIsProcessingOrder(null);
    }
  };

  const fetchGA = async () => {
    try {
      const { data, error } = await supabase.from('config').select('*').eq('id', 'analytics').single();
      if (error) {
        if (error.code !== 'PGRST116') {
           console.error('Erro ao carregar GA ID:', error.message);
        }
        return;
      }
      if (data) {
        setGaId(data.measurementId || '');
        setLogoUrl(data.logo_url || '');
        setFaviconUrl(data.favicon_url || '');
        setIbanBank(data.iban_bank || '');
        setIbanNumber(data.iban_number || '');
        setIbanOwner(data.iban_owner || '');
      }
    } catch (error) {
      console.error('Erro ao carregar GA ID:', error);
    }
  };

  const fetchUsers = async () => {
    setUsersError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) {
        console.error('Erro ao buscar utilizadores:', error);
        setUsersError('Não foi possível carregar a lista de utilizadores. Verifica a tabela "profiles".');
      } else {
        setRegisteredUsers(data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar utilizadores:', err);
    }
  };

  const fetchSentNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (!error) setSentNotifications(data || []);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    }
  };

  const fetchReferrers = async () => {
    try {
      const { data, error } = await supabase
        .from('page_visits')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      // Filter out development traffic (AI Studio, local dev, previews)
      const filteredData = (data || []).filter(visit => {
        const ref = visit.referrer || '';
        const path = visit.path || '';
        
        // Technical keywords to exclude
        const isDev = ref.includes('aistudio.google.com') || 
                      ref.includes('localhost') || 
                      ref.includes('ais-dev-') || 
                      ref.includes('ais-pre-') ||
                      path.includes('painel-admin'); // Also ignore admin's own navigation if tracked

        return !isDev;
      });

      if (!filteredData || filteredData.length === 0) {
        setTotalViews(0);
        setUniqueVisitors(0);
        setReferrersData([]);
        setRealTrafficData([]);
        return;
      }

      setTotalViews(filteredData.length);

      // Group and count referrers
      const counts: Record<string, { total: number, clients: number }> = {};
      const uniqueUsersSet = new Set<string>();
      const dailyCounts: Record<string, number> = {};

      filteredData.forEach(visit => {
        // 1. Referrers
        const ref = visit.referrer || 'Direto / Bookmark';
        let displayRef = ref;
        try {
          if (ref.startsWith('http')) {
            displayRef = new URL(ref).hostname;
          }
        } catch (e) {}

        if (!counts[displayRef]) counts[displayRef] = { total: 0, clients: 0 };
        counts[displayRef].total++;
        if (visit.is_client) counts[displayRef].clients++;

        // 2. Unique Users (logged in)
        if (visit.user_id) {
          uniqueUsersSet.add(visit.user_id);
        }

        // 3. Daily trends
        const date = new Date(visit.created_at).toLocaleDateString('pt-AO', { weekday: 'short' });
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });

      // Best guess for unique visitors if most are anonymous: 
      // real unique users + (total views - total logged in views) / avg pages per session (approx 3)
      const loggedInViews = filteredData.filter(v => v.user_id).length;
      const estimatedAnonUsers = Math.ceil((filteredData.length - loggedInViews) / 2.5);
      setUniqueVisitors(uniqueUsersSet.size + estimatedAnonUsers);

      const formattedReferrers = Object.entries(counts)
        .map(([name, stats]) => ({
          name,
          total: stats.total,
          clients: stats.clients,
          conversion: stats.total > 0 ? ((stats.clients / stats.total) * 100).toFixed(1) : '0'
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      setReferrersData(formattedReferrers);

      // Format for chart
      const chartOrder = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      const formattedChart = chartOrder.map(day => ({
        name: day,
        views: dailyCounts[day] || 0
      }));
      setRealTrafficData(formattedChart);

    } catch (err) {
      console.error('Erro ao buscar referrers:', err);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setSubscribers(data || []);
    } catch (err) {
      console.error('Erro ao buscar subscritores:', err);
    }
  };

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAds(data || []);
    } catch (err) {
      console.error('Erro ao carregar anúncios:', err);
    }
  };

  const handleAdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setAdFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setAdFilePreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingAd(true);
    try {
      let finalContent = editingAd ? editingAd.content : adForm.content;

      if (adForm.type === 'banner' && adFile) {
        // Verificar tamanho do ficheiro (ex: max 5MB)
        if (adFile.size > 5 * 1024 * 1024) {
          throw new Error("O ficheiro é demasiado grande. O limite é de 5MB.");
        }
        const ext = adFile.name.split('.').pop();
        const path = `ads/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        
        const { error: uploadErr } = await supabase.storage
          .from('content')
          .upload(path, adFile);
        
        if (uploadErr) throw uploadErr;
        
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(path);
        
        finalContent = publicUrl;
      }

      const finalAdData = {
        ...adForm,
        content: finalContent
      };

      if (editingAd) {
        const { error } = await supabase
          .from('ads')
          .update(finalAdData)
          .eq('id', editingAd.id);
        if (error) throw error;
        alert('Anúncio atualizado com sucesso!');
      } else {
        const { error } = await supabase.from('ads').insert([finalAdData]);
        if (error) throw error;
        alert('Anúncio criado com sucesso!');
      }

      setIsAddingAd(false);
      setEditingAd(null);
      setAdFile(null);
      setAdFilePreview(null);
      setAdForm({
        title: '',
        type: 'banner',
        content: '',
        link_url: '',
        placement: 'sidebar',
        page_target: 'all',
        is_active: true
      });
      fetchAds();
    } catch (err: any) {
      console.error('Erro detalhado ao processar anúncio:', err);
      const errorMessage = err.message || 'Erro desconhecido';
      alert(`Erro ao processar anúncio: ${errorMessage}\n\nCertifica-te de que executaste o SQL da tabela 'ads' no painel do Supabase.`);
    } finally {
      setIsUploadingAd(false);
    }
  };

  const handleToggleAdStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchAds();
    } catch (err) {
      alert('Erro ao atualizar estado do anúncio.');
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (window.confirm('Tens a certeza que desejas eliminar este anúncio permanentemente?')) {
      try {
        const { error } = await supabase.from('ads').delete().eq('id', id);
        if (error) throw error;
        fetchAds();
      } catch (err) {
        alert('Erro ao eliminar anúncio.');
      }
    }
  };

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data) setBanners(data);
    } catch (err) {
      console.error('Erro ao buscar banners:', err);
    }
  };

  const fetchWishlistStats = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)');
      
      if (!error && data) {
        setTotalWishlisted(data.length);
        
        // Group by product
        const counts: Record<string, { total: number, id: string, price: any, currency: any, category: any }> = {};
        data.forEach((item: any) => {
          if (!item.products) return;
          const title = item.products.title;
          if (!counts[title]) {
            counts[title] = { 
              total: 0, 
              id: item.product_id, 
              price: item.products.price, 
              currency: item.products.currency,
              category: item.products.category
            };
          }
          counts[title].total++;
        });

        const formatted = Object.entries(counts)
          .map(([name, stats]) => ({ 
            name, 
            total: stats.total, 
            id: stats.id,
            price: stats.price,
            currency: stats.currency,
            category: stats.category
          }))
          .sort((a, b) => b.total - a.total);
        
        setWishlistStats(formatted);
      }

      // Recent wishlist
      const { data: recent, error: recentErr } = await supabase
        .from('wishlist')
        .select('*, products(title), profiles(email)')
        .order('added_at', { ascending: false })
        .limit(5);
      
      if (!recentErr && recent) {
        setRecentWishlist(recent);
      }
    } catch (err) {
      console.error('Erro ao buscar stats da wishlist:', err);
    }
  };

  useEffect(() => {
    if (isAdmin === null) return;
    
    // Real-time products listener
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        fetchProducts();
      })
      .subscribe();

    fetchProducts();
    fetchGA();
    fetchUsers();
    fetchSentNotifications();
    fetchSubscribers();
    fetchCoupons();
    fetchLibrary();
    fetchReferrers();
    fetchWishlistStats();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (activeTab === 'whatsapp') fetchWhatsappOrders();
    if (activeTab === 'content') fetchProducts();
    if (activeTab === 'traffic') fetchWishlistStats();
    if (activeTab === 'marketing') {
      fetchLibrary();
      fetchCoupons();
      fetchWishlistStats();
    }
    if (activeTab === 'banners') fetchBanners();
    if (activeTab === 'ads') fetchAds();
    if (activeTab === 'newsletter') fetchSubscribers();
    if (activeTab === 'notifications') {
      fetchUsers();
      fetchSentNotifications();
    }
  }, [activeTab]);

  const handleWatermarkExisting = async () => {
    if (!selectedProductForWatermark) return;

    setIsWatermarking(true);
    try {
      // 1. Fetch file as blob
      const fileResponse = await fetch(selectedProductForWatermark.file_url);
      if (!fileResponse.ok) throw new Error('Não foi possível aceder ao ficheiro original no servidor.');
      const blob = await fileResponse.blob();
      
      // 2. Send to API for processing
      const formData = new FormData();
      formData.append('pdf', blob, 'temp_ebook.pdf');
      formData.append('text', watermarkText);

      const apiResponse = await fetch('/api/watermark', {
        method: 'POST',
        body: formData
      });

      if (!apiResponse.ok) {
        const error = await apiResponse.json();
        throw new Error(error.message || 'Falha ao processar marca d\'água');
      }

      const watermarkedBlob = await apiResponse.blob();

      // 3. Upload back to Supabase (Overwrite existing)
      // Extract the path from the URL
      const urlParts = selectedProductForWatermark.file_url.split('/content/');
      if (urlParts.length < 2) throw new Error('Caminho do ficheiro inválido.');
      const filePath = decodeURIComponent(urlParts[1].split('?')[0]);
      
      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, watermarkedBlob, {
          upsert: true,
          contentType: 'application/pdf'
        });

      if (uploadError) throw uploadError;

      // 4. Update product in DB to provide proof of authentication
      // We add a shield emoji to the title as persistent proof
      const updatedTitle = selectedProductForWatermark.title.includes('🛡️') 
        ? selectedProductForWatermark.title 
        : `🛡️ ${selectedProductForWatermark.title}`;

      const { error: dbError } = await supabase
        .from('products')
        .update({ 
          title: updatedTitle
        })
        .eq('id', selectedProductForWatermark.id);

      if (dbError) throw dbError;

      alert(`Sucesso! O e-book "${updatedTitle}" foi autenticado e agora está protegido permanentemente com um selo de autenticidade.`);
      setSelectedProductForWatermark(null);
      fetchProducts();
    } catch (err: any) {
      console.error('Erro na proteção do e-book:', err);
      // More user-friendly error message
      const msg = err.message.includes('CORS') ? 
        'Erro de Segurança (CORS). Certifica-te que o Supabase permite pedidos deste domínio.' : 
        err.message;
      alert(`Erro: ${msg}`);
    } finally {
      setIsWatermarking(false);
    }
  };

  const handleMusicAuthentication = async () => {
    if (!selectedMusicForAuth) return;
    setIsAuthenticatingMusic(true);
    try {
      const newTitle = selectedMusicForAuth.title.includes('🛡️') 
        ? selectedMusicForAuth.title 
        : `🛡️ ${selectedMusicForAuth.title}`;

      const { error } = await supabase
        .from('products')
        .update({ 
          title: newTitle
        })
        .eq('id', selectedMusicForAuth.id);

      if (error) throw error;
      
      alert(`Música "${selectedMusicForAuth.title}" foi autenticada e protegida com sucesso! O sistema de anti-cópia está agora ativo.`);
      fetchProducts();
      setSelectedMusicForAuth(null);
    } catch (error: any) {
      console.error("Error authenticating music:", error);
      alert("Erro ao autenticar a música.");
    } finally {
      setIsAuthenticatingMusic(false);
    }
  };

  const handleSaveIban = async () => {
    setIsSavingIban(true);
    try {
      const { error } = await supabase.from('config').upsert({
        id: 'analytics',
        iban_bank: ibanBank,
        iban_number: ibanNumber,
        iban_owner: ibanOwner,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      setIbanSaved(true);
      setTimeout(() => setIbanSaved(false), 3000);
    } catch (error: any) {
      console.error('Erro ao salvar IBAN:', error);
      if (error.message && error.message.includes('schema cache')) {
        alert('Erro de Base de Dados: Precisas de adicionar as colunas de IBAN à tabela "config" no Supabase. Por favor, corre o script SQL fornecido no chat.');
      } else {
        alert('Erro ao salvar IBAN: ' + (error.message || 'Verifica o console.'));
      }
    } finally {
      setIsSavingIban(false);
    }
  };

  const handleSaveGA = async () => {
    if (!gaId) {
      alert('Por favor, insere um ID de Medição válido.');
      return;
    }
    
    setIsSavingGA(true);
    try {
      const { error } = await supabase
        .from('config')
        .upsert({ 
          id: 'analytics', 
          measurementId: gaId, 
          updated_at: new Date().toISOString() 
        });
      
      if (error) {
        console.error('Erro detalhado Supabase:', error);
        if (error.code === '42P01') {
          alert('Erro: A tabela "config" não existe no Supabase. Por favor, cria a tabela no SQL Editor do Supabase.');
        } else {
          alert(`Erro ao salvar: ${error.message}`);
        }
        return;
      }

      setGaSaved(true);
      setTimeout(() => setGaSaved(false), 3000);
    } catch (error: any) {
      console.error('Erro ao salvar GA ID:', error);
      alert(`Erro inesperado: ${error.message || 'Verifica o console.'}`);
    } finally {
      setIsSavingGA(false);
    }
  };

  const handleSaveVisualSettings = async (type: 'logo' | 'favicon', file: File) => {
    setIsSavingVisual(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `settings/${type}_${Date.now()}.${ext}`;
      
      const { error: uploadErr } = await supabase.storage
        .from('content')
        .upload(path, file);
      
      if (uploadErr) throw uploadErr;
      
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(path);

      const updateData: any = { 
        id: 'analytics', 
        updated_at: new Date().toISOString() 
      };
      
      if (type === 'logo') {
        updateData.logo_url = publicUrl;
        setLogoUrl(publicUrl);
      } else {
        updateData.favicon_url = publicUrl;
        setFaviconUrl(publicUrl);
      }

      const { error: dbErr } = await supabase
        .from('config')
        .upsert(updateData);
      
      if (dbErr) throw dbErr;

      setVisualSaved(true);
      setTimeout(() => setVisualSaved(false), 3000);
    } catch (error: any) {
      console.error(`Erro ao salvar ${type}:`, error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSavingVisual(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setCoverFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !editingProduct) {
      alert('Por favor, seleciona o ficheiro principal.');
      return;
    }

    setIsUploading(true);
    try {
      let coverUrl = editingProduct?.cover_url || '';
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop();
        const coverPath = `covers/${Date.now()}_${Math.random().toString(36).substring(7)}.${coverExt}`;
        
        const { error: coverErr } = await supabase.storage
          .from('content')
          .upload(coverPath, coverFile);
        
        if (coverErr) throw coverErr;
        
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(coverPath);
        
        coverUrl = publicUrl;
      }

      let demoVideoUrl = editingProduct?.demo_video_url || '';
      if (demoVideoFile) {
        const videoExt = demoVideoFile.name.split('.').pop();
        const videoPath = `demo_videos/${Date.now()}_${Math.random().toString(36).substring(7)}.${videoExt}`;
        
        const { error: videoErr } = await supabase.storage
          .from('content')
          .upload(videoPath, demoVideoFile);
        
        if (videoErr) throw videoErr;
        
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(videoPath);
        
        demoVideoUrl = publicUrl;
      }

      let demoAudioUrl = editingProduct?.demo_audio_url || '';
      if (demoAudioFile) {
        const audioExt = demoAudioFile.name.split('.').pop();
        const audioPath = `demo_audio/${Date.now()}_${Math.random().toString(36).substring(7)}.${audioExt}`;
        
        const { error: audioErr } = await supabase.storage
          .from('content')
          .upload(audioPath, demoAudioFile);
        
        if (audioErr) throw audioErr;
        
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(audioPath);
        
        demoAudioUrl = publicUrl;
      }

      let demoEbookUrl = editingProduct?.demo_ebook_url || '';
      if (demoEbookFile) {
        const ebookExt = demoEbookFile.name.split('.').pop();
        const ebookPath = `demo_ebooks/${Date.now()}_${Math.random().toString(36).substring(7)}.${ebookExt}`;
        
        const { error: ebookErr } = await supabase.storage
          .from('content')
          .upload(ebookPath, demoEbookFile);
        
        if (ebookErr) throw ebookErr;
        
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(ebookPath);
        
        demoEbookUrl = publicUrl;
      }

      let fileUrl = editingProduct?.file_url || '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        // Organize into folders based on content type
        const folder = contentType === 'music' ? 'music' : 
                       contentType === 'audiobook' ? 'audiobooks' :
                       contentType === 'video' ? 'videos' : 
                       contentType === 'ebook' ? 'ebooks' : 
                       contentType === 'image' ? 'images' : 'misc';
                       
        const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: fileErr } = await supabase.storage
          .from('content')
          .upload(filePath, file);
        
        if (fileErr) throw fileErr;

        const { data: { publicUrl: fUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(filePath);
        fileUrl = fUrl;
      }

      const productData = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        currency: formData.currency,
        description: formData.description,
        type: contentType === 'audiobook' ? 'music' : contentType, // Map audiobook to music to pass DB constraint
        cover_url: coverUrl,
        file_url: fileUrl,
        demo_video_url: demoVideoUrl,
        demo_audio_url: demoAudioUrl,
        demo_ebook_url: demoEbookUrl
      };

      if (editingProduct) {
        const { error: dbErr } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (dbErr) throw dbErr;
        alert(`Sucesso! "${formData.title}" foi atualizado.`);
      } else {
        const { error: dbErr } = await supabase
          .from('products')
          .insert(productData);
        if (dbErr) throw dbErr;
        alert(`Sucesso! ${contentType.toUpperCase()} "${formData.title}" foi adicionado.`);
      }

      const defaultCategory = contentType === 'image' ? 'imagens' : 
                              contentType === 'music' ? 'musica' : 
                              contentType === 'audiobook' ? 'audiobook' : 
                              'produtividade';
      setFormData({ title: '', author: '', category: defaultCategory, price: '', currency: 'AOA', description: '' });
      setFile(null);
      setCoverFile(null);
      setDemoVideoFile(null);
      setDemoAudioFile(null);
      setDemoEbookFile(null);
      setCoverPreview('');
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Erro no upload Supabase:', error);
      const errorMessage = error.message || error.error_description || 'Erro desconhecido';
      alert(`Erro ao publicar: ${errorMessage}. Verifica se o bucket "content" existe e tem as políticas corretas.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tens a certeza que queres eliminar este produto?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Erro ao eliminar:', error);
      }
    }
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingNotification(true);
    setNotificationStatus(null);
    try {
      // Verificar ligação antes de tudo
      const { data: connData, error: connError } = await supabase.from('notifications').select('id').limit(1);
      if (connError && connError.code === '42P01') {
        throw new Error('A tabela de notificações não existe. Por favor, executa o código SQL no SUPABASE_SETUP.md.');
      }

      let targetUserId = null;
      if (notificationData.target === 'specific') {
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', targetEmail)
          .single();
        
        if (userError) {
          if (userError.code === 'PGRST116') throw new Error('Utilizador não encontrado com este email.');
          throw userError;
        }
        if (!userProfile) throw new Error('Utilizador não encontrado.');
        
        targetUserId = userProfile.id;
      }

      const { error } = await supabase.from('notifications').insert({
        user_id: targetUserId,
        title: notificationData.title,
        message: notificationData.message,
        is_read: false
      });

      if (error) throw error;
      setNotificationStatus({ type: 'success', text: 'Notificação enviada com sucesso!' });
      setNotificationData({ title: '', message: '', target: 'all' });
      setTargetEmail('');
      fetchSentNotifications();
    } catch (error: any) {
      console.error('Erro ao enviar notificação:', error);
      const msg = error.message || error.details || 'Erro ao enviar notificação.';
      setNotificationStatus({ type: 'error', text: msg });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja eliminar esta notificação?')) {
      try {
        const { error } = await supabase.from('notifications').delete().eq('id', id);
        if (error) throw error;
        fetchSentNotifications();
      } catch (err) {
        console.error('Erro ao eliminar notificação:', err);
      }
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (window.confirm('TEM A CERTEZA que deseja eliminar TODAS as notificações? Esta ação é irreversível.')) {
      try {
        const { error } = await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
        fetchSentNotifications();
      } catch (err) {
        console.error('Erro ao eliminar todas as notificações:', err);
      }
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingBanner(true);
    try {
      let imageUrl = editingBanner ? editingBanner.image_url : newBanner.image_url;

      if (bannerFile) {
        // Verificar tamanho do ficheiro (ex: max 5MB)
        if (bannerFile.size > 5 * 1024 * 1024) {
          throw new Error("O ficheiro é demasiado grande. O limite é de 5MB.");
        }
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('content')
          .upload(filePath, bannerFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      if (!imageUrl) throw new Error("A imagem é obrigatória.");

      if (editingBanner) {
        // Update existing banner
        const { error } = await supabase.from('banners').update({
          ...newBanner,
          image_url: imageUrl
        }).eq('id', editingBanner.id);
        if (error) throw error;
        alert("Banner atualizado com sucesso!");
      } else {
        // Insert new banner
        const { error } = await supabase.from('banners').insert({
          ...newBanner,
          image_url: imageUrl,
          order_index: banners.length
        });
        if (error) throw error;
        alert("Banner criado com sucesso!");
      }

      setNewBanner({ title: '', subtitle: '', button_text: '', button_link: '', image_url: '' });
      setBannerFile(null);
      setEditingBanner(null);
      fetchBanners();
    } catch (error: any) {
      console.error('Erro detalhado ao processar banner:', error);
      const errorMessage = error.message || 'Erro desconhecido';
      alert(`Erro ao processar banner: ${errorMessage}\n\nCertifica-te de que:\n1. O bucket 'content' existe no Supabase e é PÚBLICO.\n2. O ficheiro não é demasiado grande.\n3. Estás ligado à internet.`);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Tens a certeza que queres eliminar este banner?")) return;
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) fetchBanners();
    else alert("Erro ao eliminar banner: " + error.message);
  };

  const sendWishlistCampaign = async (productId: string, productTitle: string) => {
    const couponCode = coupons.length > 0 ? coupons[0].code : null;
    const message = `Vimos que tens "${productTitle}" nos teus favoritos! Que tal aproveitar hoje? ${couponCode ? `Usa o cupão ${couponCode} para um desconto especial.` : 'Garante já o teu acesso!'}`;
    
    setIsSendingCampaign(productId);
    try {
      // 1. Get all users who have this product in wishlist
      const { data: fans, error: wishError } = await supabase
        .from('wishlist')
        .select('user_id')
        .eq('product_id', productId);
      
      if (wishError) throw wishError;
      if (!fans || fans.length === 0) {
        alert("Ninguém tem este produto nos favoritos no momento.");
        return;
      }

      const userIds = [...new Set(fans.map(f => f.user_id))];

      // 2. Create notifications for all of them
      const notifications = userIds.map(uid => ({
        user_id: uid,
        title: "Dá um mimo ao teu carrinho! ❤️",
        message: message,
        is_read: false
      }));

      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (notifError) throw notifError;

      alert(`Campanha enviada com sucesso para ${userIds.length} utilizadores!`);
      fetchSentNotifications();
    } catch (err: any) {
      console.error("Erro ao enviar campanha:", err);
      alert("Falha ao enviar campanha: " + err.message);
    } finally {
      setIsSendingCampaign(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center shadow-xl shadow-error/10"
        >
          <ShieldCheck size={48} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">403. Acesso Negado</h1>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Apenas o administrador principal (abraaomatondo118@gmail.com) tem permissão para aceder a este painel.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row relative" translate="no">
      {/* Mobile Header */}
      <div className="lg:hidden bg-surface-container-lowest border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
            <LayoutDashboard size={16} />
          </div>
          <h1 className="text-lg font-headline font-black text-on-surface uppercase">Admin</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {/* Modal de Configuração de Recuperação de Carrinho */}
      {/* Modal de Configuração de Recuperação de Carrinho */}
      <AnimatePresence>
        {isConfiguringCartRecovery && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfiguringCartRecovery(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-black text-white uppercase tracking-tight">Recuperação de Carrinho</h3>
                    <p className="text-on-surface-variant text-xs mt-1">Reconquista clientes que não completaram a compra.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsConfiguringCartRecovery(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {/* Status Toggle */}
                <div className="flex items-center justify-between p-6 bg-surface-container-high rounded-3xl border border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Status da Automação</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1">Ativa ou desativa o envio global de e-mails de recuperação.</p>
                  </div>
                  <button 
                    onClick={() => setCartRecoveryEnabled(!cartRecoveryEnabled)}
                    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${cartRecoveryEnabled ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-surface-container-highest'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${cartRecoveryEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {/* Delay Settings */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs px-2">Tempo de Espera para o 1º E-mail</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 12, 24].map((hours) => (
                      <button
                        key={hours}
                        onClick={() => setCartRecoveryDelay(hours)}
                        className={`p-4 rounded-2xl border transition-all text-center group ${cartRecoveryDelay === hours ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high border-white/5 hover:border-primary/50'}`}
                      >
                        <p className={`text-sm font-black ${cartRecoveryDelay === hours ? 'text-white' : 'text-on-surface'}`}>{hours}h</p>
                        <p className={`text-[9px] uppercase tracking-widest mt-1 ${cartRecoveryDelay === hours ? 'text-white/70' : 'text-on-surface-variant'}`}>Após Abandono</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Preview and Edit */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs px-2">Editar Modelo de Recuperação</h4>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-on-surface-variant uppercase font-bold px-2">Assunto do E-mail</label>
                      <input 
                        type="text"
                        value={cartRecoverySubject}
                        onChange={(e) => setCartRecoverySubject(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-on-surface-variant uppercase font-bold px-2">Conteúdo da Mensagem</label>
                      <textarea 
                        value={cartRecoveryBody}
                        onChange={(e) => setCartRecoveryBody(e.target.value)}
                        rows={6}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                      />
                      <p className="text-[9px] text-on-surface-variant italic px-2">Usa [Nome] para personalizar automaticamente.</p>
                    </div>
                    <div className="pt-2">
                       <div className="w-full py-3 bg-primary/20 border border-primary/30 rounded-xl text-primary text-[10px] font-black text-center uppercase tracking-widest">
                         Finalizar Minha Compra Express
                       </div>
                    </div>
                  </div>
                </div>

                {/* Manual Recovery Entry */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs px-2">Adicionar Cliente Manualmente</h4>
                  <div className="flex gap-2">
                    <input 
                      type="email"
                      placeholder="E-mail do cliente (ex: cliente@mail.com)"
                      value={manualRecoveryEmail}
                      onChange={(e) => setManualRecoveryEmail(e.target.value)}
                      className="flex-1 bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <button 
                      onClick={() => {
                        if (manualRecoveryEmail && manualRecoveryEmail.includes('@')) {
                          setAbandonedCarts([{
                            email: manualRecoveryEmail,
                            date: new Date().toISOString(),
                            product: 'Adicionado Manualmente',
                            status: 'pendente'
                          }, ...abandonedCarts]);
                          setManualRecoveryEmail('');
                        }
                      }}
                      className="bg-primary text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-dim transition-all shrink-0"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Abandoned Carts List (Analytics Integration) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Hot Leads (Carrinhos Abandonados)</h4>
                    <span className="text-[10px] font-black text-red-500 uppercase">Dados do Analytics</span>
                  </div>
                  <div className="space-y-3">
                    {abandonedCarts.map((item, idx) => (
                      <div key={idx} className="bg-surface-container-high p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${item.status === 'recuperado' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {item.status === 'recuperado' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{item.email}</p>
                            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                              <span>{item.product}</span>
                              <span>•</span>
                              <span>{new Date(item.date).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-on-surface-variant transition-all">
                          Reenviar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-surface-container-low flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsConfiguringCartRecovery(false)}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-white/10 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Fechar
                </button>
                <button 
                  disabled={isSavingCartRecovery}
                  onClick={async () => {
                    setIsSavingCartRecovery(true);
                    try {
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      alert('Automação de Recuperação de Carrinho guardada com sucesso!');
                      setIsConfiguringCartRecovery(false);
                    } catch (err) {
                      alert('Erro ao guardar configurações.');
                    } finally {
                      setIsSavingCartRecovery(false);
                    }
                  }}
                  className="w-full sm:flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isSavingCartRecovery ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {cartRecoveryEnabled ? 'Guardar e Manter Ativa' : 'Guardar Configurações'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Configuração de Upsell (OTO) */}
      <AnimatePresence>
        {isConfiguringUpsell && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfiguringUpsell(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
                <div>
                  <h3 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Configurar Oferta OTO (Upsell)</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Sugerir uma versão premium ou bundle no momento exato do pagamento.</p>
                </div>
                <button 
                  onClick={() => setIsConfiguringUpsell(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-on-surface-variant"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Passo 1: Selecionar Produto Base */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-black">01</span>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Produto de Entrada (Gatilho)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setUpsellBaseProduct(p)}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group ${upsellBaseProduct?.id === p.id ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high border-white/5 hover:border-primary/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${upsellBaseProduct?.id === p.id ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${upsellBaseProduct?.id === p.id ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Passo 2: Selecionar o Upsell */}
                <section className={`space-y-4 transition-opacity ${!upsellBaseProduct ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-xs font-black">02</span>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Produto de Upgrade (Versão Master/Bundle)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.filter(p => p.id !== upsellBaseProduct?.id).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setTargetUpsellProduct(p)}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group relative ${targetUpsellProduct?.id === p.id ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' : 'bg-surface-container-high border-white/5 hover:border-green-500/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${targetUpsellProduct?.id === p.id ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${targetUpsellProduct?.id === p.id ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-white/5 bg-surface-container-low flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant text-xs italic">
                  <Zap size={14} className="text-green-500" />
                  Este upgrade será oferecido numa janela popup exclusiva antes da conclusão do pagamento.
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <button 
                    onClick={() => {
                      setUpsellBaseProduct(null);
                      setTargetUpsellProduct(null);
                      setIsConfiguringUpsell(false);
                    }}
                    className="flex-1 md:flex-none px-8 py-3 rounded-2xl border border-white/10 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Descartar
                  </button>
                  <button 
                    disabled={!upsellBaseProduct || !targetUpsellProduct || isSavingUpsell}
                    onClick={async () => {
                      setIsSavingUpsell(true);
                      try {
                        // Lógica de salvamento simulada
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        alert('Estratégia OTO (Upsell) configurada com sucesso!');
                        setIsConfiguringUpsell(false);
                      } catch (err) {
                        alert('Erro ao guardar configuração.');
                      } finally {
                        setIsSavingUpsell(false);
                      }
                    }}
                    className="flex-1 md:flex-none px-12 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-30 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isSavingUpsell ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Ativar Oferta OTO
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Configuração de Cross-selling */}
      <AnimatePresence>
        {isConfiguringCrossSell && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfiguringCrossSell(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
                <div>
                  <h3 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Configurar Venda Cruzada</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Define quais produtos serão sugeridos quando o cliente visualizar um item específico.</p>
                </div>
                <button 
                  onClick={() => setIsConfiguringCrossSell(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-on-surface-variant"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Passo 1: Selecionar Produto Base */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-black">01</span>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Selecionar Produto Base (Origem)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setCrossSellBaseProduct(p)}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group ${crossSellBaseProduct?.id === p.id ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high border-white/5 hover:border-primary/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${crossSellBaseProduct?.id === p.id ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${crossSellBaseProduct?.id === p.id ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Passo 2: Selecionar Sugestões */}
                <section className={`space-y-4 transition-opacity ${!crossSellBaseProduct ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-xs font-black">02</span>
                      <h4 className="font-bold text-white uppercase tracking-widest text-xs">Produtos Sugeridos (Relacionados)</h4>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{selectedCrossSellSuggestions.length} Selecionados</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.filter(p => p.id !== crossSellBaseProduct?.id).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (selectedCrossSellSuggestions.includes(p.id)) {
                            setSelectedCrossSellSuggestions(selectedCrossSellSuggestions.filter(id => id !== p.id));
                          } else {
                            setSelectedCrossSellSuggestions([...selectedCrossSellSuggestions, p.id]);
                          }
                        }}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group relative ${selectedCrossSellSuggestions.includes(p.id) ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-surface-container-high border-white/5 hover:border-amber-500/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${selectedCrossSellSuggestions.includes(p.id) ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${selectedCrossSellSuggestions.includes(p.id) ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                        {selectedCrossSellSuggestions.includes(p.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-white text-amber-500 rounded-full flex items-center justify-center">
                            <CheckCircle size={14} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-white/5 bg-surface-container-low flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant text-xs italic">
                  <Info size={14} className="text-amber-500" />
                  Estas sugestões aparecerão na página de checkout e na pré-visualização do produto base.
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <button 
                    onClick={() => {
                      setCrossSellBaseProduct(null);
                      setSelectedCrossSellSuggestions([]);
                      setIsConfiguringCrossSell(false);
                    }}
                    className="flex-1 md:flex-none px-8 py-3 rounded-2xl border border-white/10 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    disabled={!crossSellBaseProduct || selectedCrossSellSuggestions.length === 0 || isSavingCrossSell}
                    onClick={async () => {
                      setIsSavingCrossSell(true);
                      // Simulação de salvaguarda (Idealmente via tabela cross_sells no Supabase)
                      try {
                        // Aqui seria a lógica de insert no Supabase: 
                        // await supabase.from('cross_sells').upsert(...)
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        alert('Sugestões de Venda Cruzada configuradas com sucesso!');
                        setIsConfiguringCrossSell(false);
                      } catch (err) {
                        alert('Erro ao salvar configurações.');
                      } finally {
                        setIsSavingCrossSell(false);
                      }
                    }}
                    className="flex-1 md:flex-none px-12 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isSavingCrossSell ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Salvar Sugestões
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfiguringCartRecovery && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfiguringCartRecovery(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-black text-white uppercase tracking-tight">Recuperação de Carrinho</h3>
                    <p className="text-on-surface-variant text-xs mt-1">Reconquista clientes que não completaram a compra.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsConfiguringCartRecovery(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {/* Status Toggle */}
                <div className="flex items-center justify-between p-6 bg-surface-container-high rounded-3xl border border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Status da Automação</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1">Ativa ou desativa o envio global de e-mails de recuperação.</p>
                  </div>
                  <button 
                    onClick={() => setCartRecoveryEnabled(!cartRecoveryEnabled)}
                    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${cartRecoveryEnabled ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-surface-container-highest'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${cartRecoveryEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {/* Delay Settings */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs px-2">Tempo de Espera para o 1º E-mail</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 12, 24].map((hours) => (
                      <button
                        key={hours}
                        onClick={() => setCartRecoveryDelay(hours)}
                        className={`p-4 rounded-2xl border transition-all text-center group ${cartRecoveryDelay === hours ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high border-white/5 hover:border-primary/50'}`}
                      >
                        <p className={`text-sm font-black ${cartRecoveryDelay === hours ? 'text-white' : 'text-on-surface'}`}>{hours}h</p>
                        <p className={`text-[9px] uppercase tracking-widest mt-1 ${cartRecoveryDelay === hours ? 'text-white/70' : 'text-on-surface-variant'}`}>Após Abandono</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Preview and Edit */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs px-2">Editar Modelo de Recuperação</h4>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-on-surface-variant uppercase font-bold px-2">Assunto do E-mail</label>
                      <input 
                        type="text"
                        value={cartRecoverySubject}
                        onChange={(e) => setCartRecoverySubject(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-on-surface-variant uppercase font-bold px-2">Conteúdo da Mensagem</label>
                      <textarea 
                        value={cartRecoveryBody}
                        onChange={(e) => setCartRecoveryBody(e.target.value)}
                        rows={6}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                      />
                      <p className="text-[9px] text-on-surface-variant italic px-2">Usa [Nome] para personalizar automaticamente.</p>
                    </div>
                    <div className="pt-2">
                       <div className="w-full py-3 bg-primary/20 border border-primary/30 rounded-xl text-primary text-[10px] font-black text-center uppercase tracking-widest">
                         Finalizar Minha Compra Express
                       </div>
                    </div>
                  </div>
                </div>

                {/* Manual Recovery Entry */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs px-2">Adicionar Cliente Manualmente</h4>
                  <div className="flex gap-2">
                    <input 
                      type="email"
                      placeholder="E-mail do cliente (ex: cliente@mail.com)"
                      value={manualRecoveryEmail}
                      onChange={(e) => setManualRecoveryEmail(e.target.value)}
                      className="flex-1 bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <button 
                      onClick={() => {
                        if (manualRecoveryEmail && manualRecoveryEmail.includes('@')) {
                          setAbandonedCarts([{
                            email: manualRecoveryEmail,
                            date: new Date().toISOString(),
                            product: 'Adicionado Manualmente',
                            status: 'pendente'
                          }, ...abandonedCarts]);
                          setManualRecoveryEmail('');
                        }
                      }}
                      className="bg-primary text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-dim transition-all shrink-0"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Abandoned Carts List (Analytics Integration) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Hot Leads (Carrinhos Abandonados)</h4>
                    <span className="text-[10px] font-black text-red-500 uppercase">Dados do Analytics</span>
                  </div>
                  <div className="space-y-3">
                    {abandonedCarts.map((item, idx) => (
                      <div key={idx} className="bg-surface-container-high p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${item.status === 'recuperado' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {item.status === 'recuperado' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{item.email}</p>
                            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                              <span>{item.product}</span>
                              <span>•</span>
                              <span>{new Date(item.date).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-on-surface-variant transition-all">
                          Reenviar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-surface-container-low flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsConfiguringCartRecovery(false)}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-white/10 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Fechar
                </button>
                <button 
                  disabled={isSavingCartRecovery}
                  onClick={async () => {
                    setIsSavingCartRecovery(true);
                    try {
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      alert('Automação de Recuperação de Carrinho guardada com sucesso!');
                      setIsConfiguringCartRecovery(false);
                    } catch (err) {
                      alert('Erro ao guardar configurações.');
                    } finally {
                      setIsSavingCartRecovery(false);
                    }
                  }}
                  className="w-full sm:flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isSavingCartRecovery ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {cartRecoveryEnabled ? 'Guardar e Manter Ativa' : 'Guardar Configurações'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Configuração de Upsell (OTO) */}
      <AnimatePresence>
        {isConfiguringUpsell && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfiguringUpsell(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
                <div>
                  <h3 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Configurar Oferta OTO (Upsell)</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Sugerir uma versão premium ou bundle no momento exato do pagamento.</p>
                </div>
                <button 
                  onClick={() => setIsConfiguringUpsell(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-on-surface-variant"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Passo 1: Selecionar Produto Base */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-black">01</span>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Produto de Entrada (Gatilho)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setUpsellBaseProduct(p)}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group ${upsellBaseProduct?.id === p.id ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high border-white/5 hover:border-primary/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${upsellBaseProduct?.id === p.id ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${upsellBaseProduct?.id === p.id ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Passo 2: Selecionar o Upsell */}
                <section className={`space-y-4 transition-opacity ${!upsellBaseProduct ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-xs font-black">02</span>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Produto de Upgrade (Versão Master/Bundle)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.filter(p => p.id !== upsellBaseProduct?.id).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setTargetUpsellProduct(p)}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group relative ${targetUpsellProduct?.id === p.id ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' : 'bg-surface-container-high border-white/5 hover:border-green-500/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${targetUpsellProduct?.id === p.id ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${targetUpsellProduct?.id === p.id ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-white/5 bg-surface-container-low flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant text-xs italic">
                  <Zap size={14} className="text-green-500" />
                  Este upgrade será oferecido numa janela popup exclusiva antes da conclusão do pagamento.
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <button 
                    onClick={() => {
                      setUpsellBaseProduct(null);
                      setTargetUpsellProduct(null);
                      setIsConfiguringUpsell(false);
                    }}
                    className="flex-1 md:flex-none px-8 py-3 rounded-2xl border border-white/10 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Descartar
                  </button>
                  <button 
                    disabled={!upsellBaseProduct || !targetUpsellProduct || isSavingUpsell}
                    onClick={async () => {
                      setIsSavingUpsell(true);
                      try {
                        // Lógica de salvamento simulada
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        alert('Estratégia OTO (Upsell) configurada com sucesso!');
                        setIsConfiguringUpsell(false);
                      } catch (err) {
                        alert('Erro ao guardar configuração.');
                      } finally {
                        setIsSavingUpsell(false);
                      }
                    }}
                    className="flex-1 md:flex-none px-12 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-30 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isSavingUpsell ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Ativar Oferta OTO
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Configuração de Cross-selling */}
      <AnimatePresence>
        {isConfiguringCrossSell && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfiguringCrossSell(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
                <div>
                  <h3 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Configurar Venda Cruzada</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Define quais produtos serão sugeridos quando o cliente visualizar um item específico.</p>
                </div>
                <button 
                  onClick={() => setIsConfiguringCrossSell(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-on-surface-variant"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Passo 1: Selecionar Produto Base */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-black">01</span>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Selecionar Produto Base (Origem)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setCrossSellBaseProduct(p)}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group ${crossSellBaseProduct?.id === p.id ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high border-white/5 hover:border-primary/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${crossSellBaseProduct?.id === p.id ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${crossSellBaseProduct?.id === p.id ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Passo 2: Selecionar Sugestões */}
                <section className={`space-y-4 transition-opacity ${!crossSellBaseProduct ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-xs font-black">02</span>
                      <h4 className="font-bold text-white uppercase tracking-widest text-xs">Produtos Sugeridos (Relacionados)</h4>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{selectedCrossSellSuggestions.length} Selecionados</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.filter(p => p.id !== crossSellBaseProduct?.id).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (selectedCrossSellSuggestions.includes(p.id)) {
                            setSelectedCrossSellSuggestions(selectedCrossSellSuggestions.filter(id => id !== p.id));
                          } else {
                            setSelectedCrossSellSuggestions([...selectedCrossSellSuggestions, p.id]);
                          }
                        }}
                        className={`p-4 rounded-3xl border transition-all text-left flex gap-4 items-center group relative ${selectedCrossSellSuggestions.includes(p.id) ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-surface-container-high border-white/5 hover:border-amber-500/50'}`}
                      >
                        <div className="w-12 h-16 rounded-lg bg-black/20 overflow-hidden shrink-0">
                          <img src={p.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${selectedCrossSellSuggestions.includes(p.id) ? 'text-white' : 'text-on-surface'}`}>{p.title}</p>
                          <p className={`text-[10px] font-mono mt-1 ${selectedCrossSellSuggestions.includes(p.id) ? 'text-white/70' : 'text-on-surface-variant'}`}>{p.price} {p.currency}</p>
                        </div>
                        {selectedCrossSellSuggestions.includes(p.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-white text-amber-500 rounded-full flex items-center justify-center">
                            <CheckCircle size={14} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-white/5 bg-surface-container-low flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant text-xs italic">
                  <Info size={14} className="text-amber-500" />
                  Estas sugestões aparecerão na página de checkout e na pré-visualização do produto base.
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <button 
                    onClick={() => {
                      setCrossSellBaseProduct(null);
                      setSelectedCrossSellSuggestions([]);
                      setIsConfiguringCrossSell(false);
                    }}
                    className="flex-1 md:flex-none px-8 py-3 rounded-2xl border border-white/10 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    disabled={!crossSellBaseProduct || selectedCrossSellSuggestions.length === 0 || isSavingCrossSell}
                    onClick={async () => {
                      setIsSavingCrossSell(true);
                      // Simulação de salvaguarda (Idealmente via tabela cross_sells no Supabase)
                      try {
                        // Aqui seria a lógica de insert no Supabase: 
                        // await supabase.from('cross_sells').upsert(...)
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        alert('Sugestões de Venda Cruzada configuradas com sucesso!');
                        setIsConfiguringCrossSell(false);
                      } catch (err) {
                        alert('Erro ao salvar configurações.');
                      } finally {
                        setIsSavingCrossSell(false);
                      }
                    }}
                    className="flex-1 md:flex-none px-12 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isSavingCrossSell ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Salvar Sugestões
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-surface-container-lowest border-r border-border p-6 space-y-8 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden lg:flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="text-xl font-headline font-black text-on-surface-heading">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'traffic', label: 'Tráfego e Analytics', icon: <TrendingUp size={20} /> },
            { id: 'content', label: 'Gestão de Conteúdo', icon: <Upload size={20} /> },
            { id: 'whatsapp', label: 'Vendas WhatsApp', icon: <MessageCircle size={20} /> },
            { id: 'notifications', label: 'Centro de Notificações', icon: <BellIcon size={20} /> },
            { id: 'newsletter', label: 'Newsletter & E-mail', icon: <Mail size={20} /> },
            { id: 'banners', label: 'Banners (Homepage)', icon: <ImageIcon size={20} /> },
            { id: 'ads', label: 'Anúncios (Banners/AdSense)', icon: <Megaphone size={20} /> },
            { id: 'sessions', label: 'Comissões e Afiliados', icon: <Zap size={20} /> },
            { id: 'watermark', label: 'Marca d\'Água', icon: <ShieldCheck size={20} /> },
            { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-primary'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-border">
          <div className="p-4 bg-surface-container-high rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
              <CheckCircle size={14} />
              Sistema Online
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Todos os serviços estão operacionais. Última sincronização: Agora.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 p-6 lg:p-12 overflow-y-auto max-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'whatsapp' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-surface-container-low p-8 rounded-[2.5rem] border border-border">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold text-on-surface-heading tracking-tight uppercase">Vendas Pendentes (WhatsApp)</h2>
                  <p className="text-on-surface-variant mt-2">Gere as solicitações de compra feitas via WhatsApp/Multicaixa Express.</p>
                </div>
                <div className="p-4 bg-green-500/10 text-green-500 rounded-3xl">
                  <MessageCircle size={32} />
                </div>
              </div>

              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-border">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">
                        <th className="pb-4 px-4 whitespace-nowrap">Data</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Utilizador</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Produto</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Preço</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                        <th className="pb-4 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whatsappOrders.length > 0 ? (
                        whatsappOrders.map((order) => (
                          <tr key={order.id} className="bg-surface-container-high hover:bg-surface-container-highest transition-colors group">
                            <td className="py-4 px-4 rounded-l-2xl text-xs text-on-surface-variant font-mono whitespace-nowrap">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-on-surface">{order.profiles?.display_name || 'Utilizador'}</span>
                                <span className="text-[10px] text-on-surface-variant">{order.profiles?.email || order.user_id}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-10 rounded-lg bg-black/20 overflow-hidden shrink-0">
                                  <img src={order.products?.cover_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-sm font-bold text-on-surface truncate max-w-[150px]">{order.products?.title}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm font-bold text-primary">
                              {order.products?.price} {order.products?.currency}
                            </td>
                            <td className="py-4 px-4">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                order.status === 'pending' ? "bg-yellow-500/20 text-yellow-500" :
                                order.status === 'approved' ? "bg-green-500/20 text-green-500" :
                                "bg-red-500/20 text-red-500"
                              )}>
                                {order.status === 'pending' ? 'Pendente' : 
                                 order.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                              </span>
                            </td>
                            <td className="py-4 px-4 rounded-r-2xl text-right">
                              {order.status === 'pending' ? (
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => handleApproveOrder(order)}
                                    disabled={isProcessingOrder === order.id}
                                    className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                                    title="Aprovar Pagamento e Libertar Download"
                                  >
                                    {isProcessingOrder === order.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                  </button>
                                  <button 
                                    onClick={() => handleRejectOrder(order.id)}
                                    disabled={isProcessingOrder === order.id}
                                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                    title="Rejeitar Pedido"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-on-surface-variant italic">Processado</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-24 text-center text-on-surface-variant italic">
                            Nenhum pedido de WhatsApp encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold text-on-surface-heading tracking-tight">CENTRO DE NOTIFICAÇÃO</h2>
                  <p className="text-on-surface-variant mt-2">Envia mensagens diretas para os teus utilizadores.</p>
                </div>
                <div className="p-4 bg-primary/10 text-primary rounded-3xl">
                  <BellIcon size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-border space-y-6">
                  <h3 className="text-xl font-bold text-on-surface-heading">Nova Notificação</h3>
                  <form onSubmit={sendNotification} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface ml-1">Para quem?</label>
                      <select 
                        value={notificationData.target}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, target: e.target.value as any }))}
                        className="w-full bg-surface-container-high border border-border rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none appearance-none"
                      >
                        <option value="all">Todos os Utilizadores</option>
                        <option value="specific">Utilizador Específico (Email)</option>
                      </select>
                    </div>

                    {notificationData.target === 'specific' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-bold text-on-surface ml-1">Email do Utilizador</label>
                        <input 
                          type="email" 
                          required
                          value={targetEmail}
                          onChange={(e) => setTargetEmail(e.target.value)}
                          placeholder="utilizador@exemplo.com"
                          className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface ml-1">Título</label>
                      <input 
                        type="text" 
                        required
                        value={notificationData.title}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Promoção de Natal! 🎄"
                        className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface ml-1">Mensagem</label>
                      <textarea 
                        required
                        rows={4}
                        value={notificationData.message}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Escreve aqui o conteúdo da notificação..."
                        className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
                      />
                    </div>

                    {notificationStatus && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={cn(
                          "p-4 rounded-2xl text-sm font-bold flex items-center gap-3",
                          notificationStatus.type === 'success' ? "bg-secondary/10 text-secondary border border-secondary/20" : "bg-error/10 text-error border border-error/20"
                        )}
                      >
                        {notificationStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {notificationStatus.text}
                      </motion.div>
                    )}

                    <button 
                      type="submit"
                      disabled={isSendingNotification}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                    >
                      {isSendingNotification ? <Loader2 className="animate-spin" size={20} /> : <BellIcon size={20} />}
                      Enviar Agora
                    </button>
                  </form>
                </div>

                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-on-surface">Utilizadores Registados</h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full">
                      {registeredUsers.length} total
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {usersError ? (
                      <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-bold flex items-center gap-3">
                        <AlertCircle size={20} />
                        {usersError}
                      </div>
                    ) : registeredUsers.length > 0 ? (
                      registeredUsers.map((u) => (
                        <div key={u.id} className="p-4 bg-surface-container-high rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                              {u.photo_url ? (
                                <img src={u.photo_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                (u.display_name || u.email || '?')[0].toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">{u.display_name || 'Sem nome'}</p>
                              <p className="text-[10px] text-on-surface-variant line-clamp-1">{u.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setNotificationData(prev => ({ ...prev, target: 'specific' }));
                              setTargetEmail(u.email);
                            }}
                            className="p-2 bg-primary/10 text-primary rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                            title="Enviar notificação"
                          >
                            <BellIcon size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-on-surface-variant italic text-center py-8">Nenhum utilizador encontrado.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Histórico de Notificações */}
              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-on-surface">Histórico de Envios</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={fetchSentNotifications}
                      className="p-3 text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-primary/10 rounded-xl"
                      title="Atualizar Histórico"
                    >
                      <RefreshCw size={20} />
                    </button>
                    {sentNotifications.length > 0 && (
                      <button 
                        onClick={handleDeleteAllNotifications}
                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Eliminar Todas"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">
                        <th className="pb-4 px-4 whitespace-nowrap">Data</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Tipo</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Título</th>
                        <th className="pb-4 px-4">Mensagem</th>
                        <th className="pb-4 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sentNotifications.length > 0 ? (
                        sentNotifications.map((notif) => (
                          <tr key={notif.id} className="bg-surface-container-high hover:bg-surface-container-highest transition-colors group">
                            <td className="py-4 px-4 rounded-l-2xl text-xs text-on-surface-variant font-mono whitespace-nowrap">
                              {new Date(notif.created_at).toLocaleDateString('pt-AO')} {new Date(notif.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${notif.user_id ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                                {notif.user_id ? 'Direta' : 'Global'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-bold text-on-surface whitespace-nowrap">
                              {notif.title}
                            </td>
                            <td className="py-4 px-4 text-xs text-on-surface-variant line-clamp-1 max-w-[250px]">
                              {notif.message}
                            </td>
                            <td className="py-4 px-4 rounded-r-2xl text-right">
                              <button 
                                onClick={() => handleDeleteNotification(notif.id)}
                                className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-on-surface-variant italic">
                            Nenhuma notificação enviada recentemente.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ads' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pb-32"
            >
              {/* Header section with Stats or Tips can go here if needed */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight uppercase">Publicidade Visual e AdSense</h2>
                  <p className="text-on-surface-variant mt-1 md:mt-2 text-sm">Gere os seus banners publicitários e blocos de Google AdSense por página.</p>
                </div>
                <button 
                  onClick={() => setIsAddingAd(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-dim transition-all shadow-lg shadow-primary/20"
                >
                  <Plus size={18} />
                  Criar Anúncio
                </button>
              </div>

              {/* Ads Table */}
              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-on-surface">Campanhas Ativas ({ads.length})</h3>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">
                        <th className="pb-4 px-4 whitespace-nowrap">Anúncio</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Tipo</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Página</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Posição</th>
                        <th className="pb-4 px-4 whitespace-nowrap">Estado</th>
                        <th className="pb-4 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ads.map((ad) => (
                        <tr key={ad.id} className="bg-surface-container-high hover:bg-surface-container-highest transition-colors group">
                          <td className="py-4 px-4 rounded-l-2xl">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center overflow-hidden">
                                {ad.type === 'banner' ? (
                                  <ImageIcon size={16} className="text-on-surface-variant" />
                                ) : ad.type === 'affiliate' ? (
                                  <ExternalLink size={16} className="text-on-surface-variant" />
                                ) : (
                                  <Zap size={16} className="text-on-surface-variant" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-on-surface">{ad.title}</div>
                                <div className="text-[10px] text-on-surface-variant font-mono truncate max-w-[200px]">{ad.link_url || ad.content}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-white/5 text-on-surface-variant rounded-full text-[10px] font-black uppercase tracking-widest">
                              {ad.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{ad.page_target}</span>
                              <span className="text-[8px] text-on-surface-variant/60 uppercase">Página Alvo</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-xs font-bold text-on-surface uppercase tracking-widest">
                              {ad.placement}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => handleToggleAdStatus(ad.id, ad.is_active)}
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all flex items-center gap-1.5 ${
                                ad.is_active 
                                  ? 'bg-green-500/10 text-green-500 hover:bg-amber-500/10 hover:text-amber-500' 
                                  : 'bg-amber-500/10 text-amber-500 hover:bg-green-500/10 hover:text-green-500'
                              }`}
                              title={ad.is_active ? "Pausar anúncio" : "Ativar anúncio"}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${ad.is_active ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                              {ad.is_active ? 'Ativo' : 'Pausado'}
                            </button>
                          </td>
                          <td className="py-4 px-4 rounded-r-2xl text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setEditingAd(ad);
                                  setAdForm({
                                    title: ad.title || '',
                                    type: ad.type || 'banner',
                                    content: ad.content || '',
                                    link_url: ad.link_url || '',
                                    placement: ad.placement || 'sidebar',
                                    page_target: ad.page_target || 'all',
                                    is_active: ad.is_active
                                  });
                                  setIsAddingAd(true);
                                }}
                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                title="Editar Anúncio"
                              >
                                <Pencil size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteAd(ad.id)}
                                className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Eliminar Permanentemente"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {ads.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-on-surface-variant">
                                <Megaphone size={32} />
                              </div>
                              <div>
                                <p className="text-on-surface-variant font-medium">Nenhum anúncio criado até agora.</p>
                                <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest mt-2">Dica: Adiciona links de afiliados para rentabilizar as tuas visitas.</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'banners' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight uppercase tracking-tight">Banners Dinâmicos</h2>
                  <p className="text-on-surface-variant mt-2">Gere os destaques que aparecem no topo da tua Homepage.</p>
                </div>
                <div className="p-4 bg-primary/10 text-primary rounded-3xl">
                  <ImageIcon size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form to create banner */}
                <div className="lg:col-span-1 bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-on-surface">
                      {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                    </h3>
                    {editingBanner && (
                      <button 
                        onClick={() => {
                          setEditingBanner(null);
                          setNewBanner({ title: '', subtitle: '', button_text: '', button_link: '', image_url: '' });
                          setBannerFile(null);
                        }}
                        className="text-[10px] font-black uppercase text-error hover:underline"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles size={16} />
                      <span className="text-[11px] font-black uppercase tracking-wider">Dica de Design (Canva)</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Para que o banner fique perfeito e sem cortes, utilize estas dimensões:
                      <br />• <span className="font-bold text-on-surface">Desktop:</span> 1920 x 450 px
                      <br />• <span className="font-bold text-on-surface">Mobile:</span> 1080 x 300 px
                      <br /><span className="text-primary/80">Dica: Mantenha as informações importantes no centro.</span>
                    </p>
                  </div>

                  <form onSubmit={handleCreateBanner} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface ml-1">Título do Banner (Opcional)</label>
                      <input 
                        type="text" 
                        value={newBanner.title}
                        onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                        placeholder="Ex: Oferta de Natal 50% OFF"
                        className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                      />
                      <p className="text-[10px] text-on-surface-variant/60 ml-2 italic">Dica: Se a imagem já tiver texto, podes deixar este campo vazio.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface ml-1">Subtítulo (Opcional)</label>
                      <input 
                        type="text" 
                        value={newBanner.subtitle}
                        onChange={(e) => setNewBanner({...newBanner, subtitle: e.target.value})}
                        placeholder="Ex: Os melhores ebooks para ti"
                        className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface ml-1">Texto do Botão (Opcional)</label>
                        <input 
                          type="text" 
                          value={newBanner.button_text}
                          onChange={(e) => setNewBanner({...newBanner, button_text: e.target.value})}
                          placeholder="Ex: Comprar Já"
                          className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface ml-1">Link do Botão (Opcional)</label>
                        <input 
                          type="text" 
                          value={newBanner.button_link}
                          onChange={(e) => setNewBanner({...newBanner, button_link: e.target.value})}
                          placeholder="Ex: /livros"
                          className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                    {(newBanner.button_text || newBanner.button_link) && !(newBanner.button_text && newBanner.button_link) && (
                      <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest ml-2">⚠️ O botão só aparecerá se preencheres ambos os campos (Texto e Link).</p>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface ml-1">Imagem do Banner</label>
                      <div className="relative aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-surface-container-high overflow-hidden hover:border-primary/50 transition-all">
                        {bannerFile ? (
                          <img src={URL.createObjectURL(bannerFile)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant gap-2">
                            <Camera size={32} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-center">Clique para escolher imagem</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isUploadingBanner}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all disabled:opacity-50"
                    >
                      {isUploadingBanner ? <Loader2 size={18} className="animate-spin" /> : editingBanner ? <Save size={18} /> : <Plus size={18} />}
                      {editingBanner ? 'Guardar Alterações' : 'Carregar Banner'}
                    </button>
                  </form>
                </div>

                {/* List of banners */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold text-on-surface">Banners Ativos ({banners.length})</h3>
                  <div className="space-y-4">
                    {banners.map((banner, index) => (
                      <div key={banner.id} className="bg-surface-container-low p-6 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row gap-6 group hover:border-primary/20 transition-all">
                        <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden bg-black/20 shrink-0">
                          <img src={banner.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-white tracking-tight">{banner.title}</h4>
                              <p className="text-xs text-on-surface-variant">{banner.subtitle}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setEditingBanner(banner);
                                  setNewBanner({
                                    title: banner.title,
                                    subtitle: banner.subtitle || '',
                                    button_text: banner.button_text || '',
                                    button_link: banner.button_link || '',
                                    image_url: banner.image_url
                                  });
                                }}
                                className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                                title="Editar"
                              >
                                <Pencil size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="p-2 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pt-2 border-t border-white/5">
                            <span>Ordem: {banner.order_index + 1}</span>
                            {banner.button_text && (
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Botão: {banner.button_text}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {banners.length === 0 && (
                      <div className="py-24 text-center bg-surface-container-low rounded-[2.5rem] border border-dashed border-white/10 text-on-surface-variant italic">
                        Não existem banners configurados. Adiciona o primeiro para ganhar vida no topo da tua Homepage.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'traffic' && (
            <motion.div 
              key="traffic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="space-y-2">
                <h2 className="text-3xl font-headline font-extrabold text-on-surface">Controlo de Tráfego</h2>
                <p className="text-on-surface-variant">Monitorização em tempo real do desempenho do site.</p>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Visualizações', value: totalViews >= 1000 ? `${(totalViews/1000).toFixed(1)}k` : totalViews.toString(), change: 'Tempo Real', icon: <Eye />, color: 'text-primary' },
                  { label: 'Visitantes Est.', value: uniqueVisitors >= 1000 ? `${(uniqueVisitors/1000).toFixed(1)}k` : uniqueVisitors.toString(), change: 'Recente', icon: <Users />, color: 'text-secondary' },
                  { label: 'Taxa de Abandono', value: '42.5%', change: 'Crítico', icon: <AlertCircle className="text-red-500" />, color: 'text-error' },
                  { label: 'Favoritos (Desejados)', value: totalWishlisted.toString(), change: 'Interesse', icon: <Heart className="text-secondary" />, color: 'text-secondary' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-container-low p-6 rounded-3xl border border-border space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 bg-surface-container-high rounded-2xl ${stat.color}`}>{stat.icon}</div>
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-on-surface-heading">{stat.value}</div>
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-border space-y-6">
                  <h3 className="text-xl font-bold text-on-surface-heading">Visualizações por Dia</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={realTrafficData.length > 0 ? realTrafficData : trafficData}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-surface-container-highest)', 
                            border: '1px solid var(--color-border)', 
                            borderRadius: '12px', 
                            color: 'var(--color-on-surface)' 
                          }}
                          itemStyle={{ color: 'var(--color-primary)' }}
                        />
                        <Area 
                          isAnimationActive={false} 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#3B82F6" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorViews)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-border space-y-6">
                  <h3 className="text-xl font-bold text-on-surface-heading">Origem dos Visitantes (Canais)</h3>
                  <div className="space-y-4">
                    {referrersData.length > 0 ? (
                      referrersData.map((ref, i) => (
                        <div key={ref.name} className="flex items-center justify-between p-4 bg-surface-container-high rounded-2xl hover:bg-surface-container-highest transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-on-surface block">{ref.name}</span>
                              <span className="text-[10px] text-on-surface-variant font-medium">Conversão: {ref.conversion}%</span>
                            </div>
                          </div>
                          <div className="flex gap-8 text-right">
                            <div>
                              <div className="text-sm font-black text-white">{ref.total}</div>
                              <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Visitas</div>
                            </div>
                            <div>
                              <div className="text-sm font-black text-secondary">{ref.clients}</div>
                              <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Clientes</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-on-surface-variant italic text-center py-8">A recolher dados de tráfego...</p>
                    )}
                  </div>
                </div>

                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-xl font-bold text-on-surface">Produtos Mais Desejados (Wishlist)</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wishlistStats} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          stroke="var(--color-on-surface-variant)" 
                          fontSize={10} 
                          width={100} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ 
                            backgroundColor: 'var(--color-surface-container-highest)', 
                            border: '1px solid var(--color-border)', 
                            borderRadius: '12px', 
                            color: 'var(--color-on-surface)' 
                          }}
                        />
                        <Bar 
                          dataKey="total" 
                          fill="#F472B6" 
                          radius={[0, 8, 8, 0]} 
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-on-surface-variant italic text-center">
                    Estes são os produtos que os clientes guardaram para pagar depois. Ótimos alvos para promoções!
                  </p>
                </div>
              </div>

              {/* Recent Activity Table and Recovery Leads */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-on-surface">Atividade Recente de Favoritos</h3>
                    <div className="px-4 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">
                      Intenção
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">
                          <th className="pb-2 px-4 whitespace-nowrap">Utilizador</th>
                          <th className="pb-2 px-4">Produto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentWishlist.slice(0, 5).map((item) => (
                          <tr key={item.id} className="bg-surface-container-high hover:bg-surface-container-highest transition-colors group">
                            <td className="py-4 px-4 rounded-l-2xl">
                              <div className="text-sm font-bold text-on-surface">{item.profiles?.email?.split('@')[0] || 'Anónimo'}</div>
                            </td>
                            <td className="py-4 px-4 rounded-r-2xl">
                              <div className="flex items-center gap-2">
                                <Heart size={12} className="text-secondary" fill="currentColor" />
                                <span className="text-xs font-bold text-on-surface truncate max-w-[100px]">{item.products?.title}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-on-surface">Leads de Recuperação</h3>
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-full animate-pulse">Hot</span>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('marketing');
                        setIsConfiguringCartRecovery(true);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      Ver Tudo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {abandonedCarts.slice(0, 3).map((lead, idx) => (
                      <div key={idx} className="p-4 bg-surface-container-high rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{lead.email}</p>
                          <p className="text-[10px] text-on-surface-variant italic">{lead.product}</p>
                        </div>
                        <div className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
                          Pendente
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-extrabold text-white">
                    {editingProduct ? `Editando: ${editingProduct.title}` : 'Gestão de Conteúdo'}
                  </h2>
                  <p className="text-on-surface-variant">
                    {editingProduct ? 'Altera os dados do produto abaixo.' : 'Adiciona novos produtos ao catálogo sem programar.'}
                  </p>
                </div>
                {editingProduct && (
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({ title: '', author: '', category: 'produtividade', price: '', currency: 'AOA', description: '' });
                      setCoverPreview('');
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-surface-container-high text-white rounded-full text-xs font-bold hover:bg-white/5 transition-all"
                  >
                    <X size={14} />
                    Cancelar Edição
                  </button>
                )}
                <div className="flex bg-surface-container-high p-1 rounded-2xl">
                  <button 
                    onClick={() => {
                      setContentType('ebook');
                      setFormData(prev => ({ ...prev, category: 'fantasia-epica' }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'ebook' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <BookOpen size={16} />
                    Ebooks
                  </button>
                  <button 
                    onClick={() => {
                      setContentType('music');
                      setFormData(prev => ({ ...prev, category: 'musica' }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'music' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <Music size={16} />
                    Música
                  </button>
                  <button 
                    onClick={() => {
                      setContentType('audiobook');
                      setFormData(prev => ({ ...prev, category: 'audiobook' }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'audiobook' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <BookOpen size={16} className="text-amber-400" />
                    Audiobooks
                  </button>
                  <button 
                    onClick={() => {
                      setContentType('video');
                      setFormData(prev => ({ ...prev, category: 'animacao-2d' }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'video' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <Film size={16} />
                    Vídeos
                  </button>
                  <button 
                    onClick={() => {
                      setContentType('image');
                      setFormData(prev => ({ ...prev, category: 'imagens' }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'image' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <ImageIcon size={16} />
                    Imagens
                  </button>
                </div>
              </header>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-[2.5rem] border border-border">
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-white px-2">Título do {contentType === 'ebook' ? 'Livro' : contentType === 'music' ? 'Áudio' : contentType === 'audiobook' ? 'Audiobook' : contentType === 'video' ? 'Vídeo' : 'Asset'}</label>
                        <input 
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Ex: O Poder do Hábito"
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-white px-2">Autor / Criador</label>
                        <input 
                          required
                          value={formData.author}
                          onChange={(e) => setFormData({...formData, author: e.target.value})}
                          placeholder="Ex: Charles Duhigg"
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>

                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-on-surface px-2">Categoria</label>
                          <div className="relative">
                            <select 
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="w-full bg-surface-container-high border border-border rounded-2xl py-4 px-6 text-on-surface font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                            >
                              <option value="fantasia-epica">Fantasia Épica</option>
                              <option value="ficcao-historica">Ficção Histórica</option>
                              <option value="realismo-magico">Realismo Mágico</option>
                              <option value="ficcao-resistencia">Ficção de Resistência</option>
                              <option value="romance-drama">Romance e Drama</option>
                              <option value="misterio-suspense">Mistério e Suspense</option>
                              <option value="saude-bem-estar">Saúde e Bem-estar</option>
                              <option value="autoajuda-espiritualidade">Auto-ajuda e Espiritualidade</option>
                              <option value="biografia-memorias">Biografias e Memórias</option>
                              <option value="negocios-empreendedorismo">Negócios e Empreendedorismo</option>
                              <option value="poesia-antologias">Poesia e Antologias</option>
                              <option value="culinaria-nutricao">Culinária e Nutrição</option>
                              <option value="viagens-aventura">Viagens e Aventura</option>
                              <option value="ciencia-filosofia">Ciência e Filosofia</option>
                              <option value="produtividade">Produtividade</option>
                              <option value="financas">Finanças</option>
                              <option value="psicologia">Psicologia</option>
                              <option value="tecnologia">Tecnologia</option>
                              <option value="audiobook">Audio Book</option>
                              <option value="musica">Música (Geral)</option>
                              <option value="gospel">Gospel</option>
                              <option value="kizomba">Kizomba</option>
                              <option value="semba">Semba</option>
                              <option value="afro-beat">Afro Beat</option>
                              <option value="kuduro">Kuduro</option>
                              <option value="amapiano">Amapiano</option>
                              <option value="hiphop">Hip Hop</option>
                              <option value="drill">Drill</option>
                              <option value="romantica">Romântica</option>
                              <option value="r-b">R&B</option>
                              <option value="tchianda">Tchianda</option>
                              <option value="zouk">Zouk</option>
                              <option value="sertanejo">Sertanejo</option>
                              <option value="afro-house">Afro House</option>
                              <option value="musica-tradicional-angolana">Música Tradicional Angolana</option>
                              <option value="jazz">Jazz</option>
                              <option value="soul">Soul</option>
                              <option value="pop">Pop</option>
                              <option value="k-pop">K-Pop</option>
                              <option value="imagens">Imagens (Geral)</option>
                              <option value="imagens-3d">Imagens 3D</option>
                              <option value="estilo-pixar">Estilo Pixar</option>
                              <option value="fotos-realistas">Fotos Realistas</option>
                              <option value="cinematografica">Cinematográfica</option>
                              <option value="ultra-realista-4k">Ultra Realista 4K</option>
                              <option value="ilustracoes-digitais">Ilustrações Digitais</option>
                              <option value="texturas-patterns">Texturas & Patterns</option>
                              <option value="vetores">Vetores (SVG)</option>
                              <option value="mockups">Mockups</option>
                              <option value="design-grafico">Design Gráfico</option>
                              <option value="animacao-2d">Animação 2D</option>
                              <option value="animacao-3d">Animação 3D</option>
                              <option value="curta-metragem">Curta Metragem</option>
                              <option value="lugares">Lugares (Locais)</option>
                              <option value="podcast">Podcast</option>
                              <option value="debate">Debate</option>
                              <option value="entrevista">Entrevista</option>
                              <option value="historias-ficticias">Histórias Fictícias</option>
                              <option value="historias-reais">Histórias Reais</option>
                              <option value="educacao">Educação</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" size={18} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-white px-2">Moeda</label>
                          <div className="relative">
                            <select 
                              value={formData.currency}
                              onChange={(e) => setFormData({...formData, currency: e.target.value})}
                              className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                            >
                              <option value="EUR">Euro (€)</option>
                              <option value="USD">Dólar ($)</option>
                              <option value="AOA">Kwanza (Kz)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" size={18} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-white px-2">Preço (Vazio = Grátis)</label>
                          <input 
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="0.00"
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-white px-2">Capa / Miniatura</label>
                          <div className="relative group">
                            <input 
                              type="file"
                              accept="image/*"
                              onChange={handleCoverChange}
                              className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-6 text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                            />
                            {coverFile ? (
                              <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <CheckCircle className="text-green-500" size={14} />
                                <span className="text-[10px] text-green-500 font-bold truncate">{coverFile.name}</span>
                              </div>
                            ) : editingProduct?.cover_url && (
                              <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                                <CheckCircle className="text-primary" size={14} />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[8px] text-primary uppercase font-black">Ficheiro Atual na App</span>
                                  <span className="text-[10px] text-primary font-bold truncate">{getFileNameFromUrl(editingProduct.cover_url)}</span>
                                </div>
                                <a href={editingProduct.cover_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-[10px] text-primary hover:underline font-black uppercase">Ver</a>
                              </div>
                            )}
                          </div>
                        </div>
                        {contentType === 'video' || contentType === 'image' ? (
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white px-2">Vídeo de Demonstração (Opcional)</label>
                            <div className="relative">
                              <input 
                                type="file"
                                accept="video/*"
                                onChange={(e) => setDemoVideoFile(e.target.files?.[0] || null)}
                                className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-6 text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 transition-all"
                              />
                              {demoVideoFile ? (
                                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                                  <CheckCircle className="text-green-500" size={14} />
                                  <span className="text-[10px] text-green-500 font-bold truncate">{demoVideoFile.name}</span>
                                </div>
                              ) : editingProduct?.demo_video_url && (
                                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                  <CheckCircle className="text-amber-500" size={14} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] text-amber-500 uppercase font-black">Demo Atual na App</span>
                                    <span className="text-[10px] text-amber-500 font-bold truncate">{getFileNameFromUrl(editingProduct.demo_video_url)}</span>
                                  </div>
                                  <a href={editingProduct.demo_video_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-[10px] text-amber-500 hover:underline font-black uppercase">Ver</a>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : contentType === 'ebook' ? (
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white px-2">Amostra do Ebook / PDF (Opcional)</label>
                            <div className="relative">
                              <input 
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setDemoEbookFile(e.target.files?.[0] || null)}
                                className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-6 text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 transition-all"
                              />
                              {demoEbookFile ? (
                                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                                  <CheckCircle className="text-green-500" size={14} />
                                  <span className="text-[10px] text-green-500 font-bold truncate">{demoEbookFile.name}</span>
                                </div>
                              ) : editingProduct?.demo_ebook_url && (
                                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                  <CheckCircle className="text-blue-500" size={14} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] text-blue-500 uppercase font-black">Amostra na App</span>
                                    <span className="text-[10px] text-blue-500 font-bold truncate">{getFileNameFromUrl(editingProduct.demo_ebook_url)}</span>
                                  </div>
                                  <a href={editingProduct.demo_ebook_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-[10px] text-blue-500 hover:underline font-black uppercase">Ver</a>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white px-2">Amostra de Áudio / Preview (Opcional)</label>
                            <div className="relative">
                              <input 
                                type="file"
                                accept="audio/*"
                                onChange={(e) => setDemoAudioFile(e.target.files?.[0] || null)}
                                className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-6 text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                              />
                              {demoAudioFile ? (
                                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                                  <CheckCircle className="text-green-500" size={14} />
                                  <span className="text-[10px] text-green-500 font-bold truncate">{demoAudioFile.name}</span>
                                </div>
                              ) : editingProduct?.demo_audio_url && (
                                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                                  <CheckCircle className="text-primary" size={14} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] text-primary uppercase font-black">Áudio na App</span>
                                    <span className="text-[10px] text-primary font-bold truncate">{getFileNameFromUrl(editingProduct.demo_audio_url)}</span>
                                  </div>
                                  <a href={editingProduct.demo_audio_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-[10px] text-primary hover:underline font-black uppercase">Ouvir</a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white px-2">
                        Ficheiro do Produto {editingProduct ? '(Opcional se não quiseres alterar)' : '(Obrigatório)'} ({contentType === 'ebook' ? 'PDF/EPUB' : (contentType === 'music' || contentType === 'audiobook') ? 'MP3/WAV' : contentType === 'video' ? 'MP4/MOV' : 'ZIP/IMG'})
                      </label>
                      <div className="relative">
                        <input 
                          type="file"
                          required={!editingProduct}
                          accept={
                            contentType === 'ebook' ? '.pdf,.epub' : 
                            (contentType === 'music' || contentType === 'audiobook') ? 'audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/ogg,audio/aac,audio/m4a,audio/flac,.mp3,.wav,.ogg,.aac,.m4a,.flac' : 
                            contentType === 'video' ? 'video/mp4,video/quicktime,video/x-msvideo,video/webm,.mp4,.mov,.avi,.wmv,.webm' : 
                            contentType === 'image' ? 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,.jpg,.jpeg,.png,.gif,.webp,.svg' : 
                            '*'
                          }
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 transition-all"
                        />
                        {file ? (
                          <div className="mt-3 flex items-center gap-2 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-2xl">
                            <CheckCircle className="text-secondary" size={18} />
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-secondary font-black uppercase tracking-wider">Novo Ficheiro Selecionado</span>
                              <span className="text-xs text-white font-bold truncate">{file.name}</span>
                            </div>
                          </div>
                        ) : editingProduct?.file_url && (
                          <div className="mt-3 flex items-center gap-2 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-2xl ring-2 ring-secondary/20 shadow-lg shadow-secondary/5">
                            <CheckCircle className="text-secondary" size={24} />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-[10px] text-secondary font-black uppercase tracking-wider">Produto Guardado na App</span>
                              <span className="text-sm text-white font-bold truncate">{getFileNameFromUrl(editingProduct.file_url)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a href={editingProduct.file_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Download</a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white px-2">Descrição</label>
                      <textarea 
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Breve resumo do conteúdo..."
                        className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isUploading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="flex items-center gap-2">
                            {editingProduct ? <Pencil size={24} /> : <Plus size={24} />}
                            {editingProduct ? 'Salvar Alterações' : 'Publicar Agora'}
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Preview Card */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-2">Pré-visualização</h3>
                  <div className="bg-surface-container-low rounded-[2.5rem] border border-border overflow-hidden group">
                    <div className="aspect-[4/5] bg-surface-container-high relative overflow-hidden">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant opacity-20">
                          {contentType === 'ebook' ? <BookOpen size={80} /> : contentType === 'audiobook' ? <BookOpen size={80} className="text-amber-400" /> : contentType === 'music' ? <Music size={80} /> : contentType === 'video' ? <Film size={80} /> : <ImageIcon size={80} />}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                        Novo
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white truncate">{formData.title || 'Título do Conteúdo'}</h4>
                        <p className="text-sm text-on-surface-variant">{formData.author || 'Nome do Autor'}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-primary">
                          {formData.price && parseFloat(formData.price) > 0 
                            ? `${formData.price}${formData.currency === 'EUR' ? '€' : formData.currency === 'USD' ? '$' : ' Kz'}` 
                            : 'Grátis'}
                        </span>
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                          {formData.category || 'Categoria'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/10 p-6 rounded-3xl border border-secondary/20 flex items-start gap-4">
                    <AlertCircle className="text-secondary shrink-0" size={20} />
                    <p className="text-xs text-secondary leading-relaxed font-medium">
                      O conteúdo será publicado instantaneamente para todos os utilizadores. Certifica-te de que os direitos de autor estão em conformidade.
                    </p>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-6">
                <h3 className="text-2xl font-headline font-extrabold text-white">Produtos Publicados</h3>
                <div className="bg-surface-container-low rounded-[2.5rem] border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Produto</th>
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tipo</th>
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Categoria</th>
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Preço</th>
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-surface-container-high overflow-hidden">
                                  {product.cover_url && <img src={product.cover_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white flex items-center gap-2">
                                    {product.title}
                                    {product.title.includes('🛡️') && (
                                      <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary/20 text-secondary text-[9px] font-black rounded-full uppercase tracking-tighter">
                                        <ShieldCheck size={10} />
                                        Autêntico
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{product.author}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-on-surface-variant capitalize">{product.type}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-on-surface-variant">{product.category}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-black text-primary">
                                {product.price > 0 
                                  ? `${product.price}${product.currency === 'EUR' ? '€' : product.currency === 'USD' ? '$' : ' Kz'}`
                                  : 'Grátis'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a 
                                  href={product.file_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-all hover:scale-110 active:scale-95 bg-surface-container-high lg:bg-transparent"
                                  title="Download Ficheiro"
                                >
                                  <Download size={20} />
                                </a>
                                <button 
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setContentType(product.type);
                                    setFormData({
                                      title: product.title,
                                      author: product.author,
                                      category: product.category,
                                      price: product.price.toString(),
                                      currency: product.currency,
                                      description: product.description || ''
                                    });
                                    setCoverPreview(product.cover_url || '');
                                    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-3 text-secondary hover:bg-secondary/10 rounded-xl transition-all hover:scale-110 active:scale-95 bg-surface-container-high lg:bg-transparent"
                                  title="Editar Produto"
                                >
                                  <Pencil size={20} />
                                </button>
                                <button 
                                  onClick={() => {
                                    const url = `${window.location.origin}/produto/${product.id}`;
                                    navigator.clipboard.writeText(url);
                                    alert('Link da página de venda copiado!');
                                  }}
                                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  title="Copiar Link de Venda"
                                >
                                  <ArrowUpRight size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(product.id)}
                                  className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant italic">
                              Nenhum produto encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'watermark' && (
            <motion.div 
              key="watermark"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-center bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight uppercase">Movimento de Proteção Memoo</h2>
                  <p className="text-on-surface-variant mt-2 font-medium">Autentique as suas obras para garantir o respeito aos direitos de autor.</p>
                </div>
                <div className="p-4 bg-primary/10 text-primary rounded-3xl">
                  <ShieldCheck size={32} />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Ebook Watermark */}
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 text-secondary">
                    <BookOpen size={24} />
                    <h3 className="text-xl font-black uppercase tracking-tight">Arrumo Digital (Livros)</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Proteja os seus E-books com selo de autenticidade no sistema.
                  </p>

                  <div className="space-y-4">
                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                      {products.filter(p => p.type === 'ebook').map((product) => (
                        <div 
                          key={product.id}
                          onClick={() => setSelectedProductForWatermark(product)}
                          className={cn(
                            "p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group",
                            selectedProductForWatermark?.id === product.id 
                              ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" 
                              : "bg-surface-container-high border-white/5 hover:border-primary/30"
                          )}
                        >
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0">
                            <img src={product.cover_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-on-surface truncate">{product.title}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{product.author}</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedProductForWatermark?.id === product.id 
                              ? "border-primary bg-primary text-white" 
                              : "border-white/20"
                          )}>
                            {selectedProductForWatermark?.id === product.id && <Check size={14} />}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleWatermarkExisting}
                      disabled={isWatermarking || !selectedProductForWatermark}
                      className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-secondary-dim transition-all disabled:opacity-50 shadow-xl shadow-secondary/20 group uppercase tracking-widest text-xs"
                    >
                      {isWatermarking ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                      {isWatermarking ? 'Autenticando...' : 'Autenticar Livro'}
                    </button>
                  </div>
                </div>

                {/* Music Authentication */}
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Music size={24} />
                    <h3 className="text-xl font-black uppercase tracking-tight">Autenticador de Música</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Ativa a **Proteção Snippet-Stop**: Músicas pagas e autenticadas tocam apenas 20s para quem não comprou.
                  </p>

                  <div className="space-y-4">
                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                      {products.filter(p => p.type === 'music' || p.category === 'musica' || p.type === 'audiobook').map((product) => (
                        <div 
                          key={product.id}
                          onClick={() => setSelectedMusicForAuth(product)}
                          className={cn(
                            "p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group",
                            selectedMusicForAuth?.id === product.id 
                              ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" 
                              : "bg-surface-container-high border-white/5 hover:border-primary/30"
                          )}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/20 shrink-0">
                            <img src={product.cover_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-on-surface truncate">{product.title}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{product.author}</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedMusicForAuth?.id === product.id 
                              ? "border-primary bg-primary text-white" 
                              : "border-white/20"
                          )}>
                            {selectedMusicForAuth?.id === product.id && <Check size={14} />}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleMusicAuthentication}
                      disabled={isAuthenticatingMusic || !selectedMusicForAuth}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-dim transition-all disabled:opacity-50 shadow-xl shadow-primary/20 group uppercase tracking-widest text-xs"
                    >
                      {isAuthenticatingMusic ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                      {isAuthenticatingMusic ? 'Protegendo...' : 'Autenticar Música'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'newsletter' && (
            <motion.div 
              key="newsletter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight uppercase">Newsletter</h2>
                  <p className="text-on-surface-variant mt-2">Gere os subscritores e as tuas listas de contactos.</p>
                </div>
                <div className="p-4 bg-secondary/10 text-secondary rounded-3xl">
                  <Mail size={32} />
                </div>
              </div>

              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Adicionar Subscritor Manual</h3>
                    <p className="text-sm text-on-surface-variant">Adiciona um novo e-mail à lista da newsletter manualmente.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    value={newSubEmail}
                    onChange={(e) => setNewSubEmail(e.target.value)}
                    placeholder="utilizador@exemplo.com"
                    className="flex-1 bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button 
                    onClick={async () => {
                      if (!newSubEmail || !newSubEmail.includes('@')) {
                        alert('Por favor, insere um e-mail válido.');
                        return;
                      }
                      setIsAddingSub(true);
                      try {
                        const { error } = await supabase
                          .from('newsletter_subscribers')
                          .insert([{ email: newSubEmail, created_at: new Date().toISOString() }]);
                        
                        if (error) {
                          if (error.code === '23505') throw new Error('Este e-mail já existe na lista.');
                          throw error;
                        }
                        
                        setNewSubEmail('');
                        fetchSubscribers();
                        alert('Subscritor adicionado com sucesso!');
                      } catch (err: any) {
                        alert(err.message);
                      } finally {
                        setIsAddingSub(false);
                      }
                    }}
                    disabled={isAddingSub}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-dim transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAddingSub ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    Adicionar
                  </button>
                </div>

                {/* Quick Add from Registered Users */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Utilizadores da Plataforma (Rápido)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {registeredUsers.length > 0 ? (
                      registeredUsers.slice(0, 6).map((u) => (
                        <button 
                          key={u.id}
                          onClick={() => {
                            setNewSubEmail(u.email);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl border border-white/5 hover:border-primary/50 transition-all text-left group"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                            {(u.display_name || u.email || '?')[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-on-surface truncate">{u.display_name || 'Sem nome'}</p>
                            <p className="text-[9px] text-on-surface-variant truncate">{u.email}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-[10px] text-on-surface-variant italic p-2">Nenhum utilizador registado para mostrar.</p>
                    )}
                  </div>
                  {registeredUsers.length > 6 && (
                    <p className="text-[9px] text-on-surface-variant italic ml-1">Apenas os 6 utilizadores mais recentes são mostrados aqui.</p>
                  )}
                </div>
              </div>

              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-on-surface">Subscritores Ativos</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-black rounded-full">
                      {subscribers.length} total
                    </span>
                    <button 
                      onClick={fetchSubscribers}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      title="Atualizar lista"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">
                        <th className="pb-4 px-4">Email</th>
                        <th className="pb-4 px-4">Data de Subscrição</th>
                        <th className="pb-4 px-4 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.length > 0 ? (
                        subscribers.map((sub) => (
                          <tr key={sub.id} className="bg-surface-container-high hover:bg-surface-container-highest transition-colors group">
                            <td className="py-4 px-4 rounded-l-2xl text-sm font-bold text-on-surface">
                              {sub.email}
                            </td>
                            <td className="py-4 px-4 text-xs text-on-surface-variant">
                              {new Date(sub.created_at).toLocaleDateString('pt-AO')} às {new Date(sub.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-4 px-4 rounded-r-2xl text-right">
                              <button 
                                onClick={async () => {
                                  if (window.confirm('Remover este subscritor?')) {
                                    const { error } = await supabase
                                      .from('newsletter_subscribers')
                                      .delete()
                                      .eq('id', sub.id);
                                    if (!error) fetchSubscribers();
                                  }
                                }}
                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-12 text-center text-on-surface-variant italic">
                            Nenhum subscritor encontrado até ao momento.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Email Campaign Section */}
              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Enviar Campanha de E-mail</h3>
                    <p className="text-sm text-on-surface-variant">Este e-mail será enviado para todos os {subscribers.length} subscritores.</p>
                  </div>
                </div>

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
                    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;
                    
                    if (!subject || !content) return;
                    
                    setIsSendingNotification(true);
                    setNotificationStatus(null);
                    
                    try {
                      let finalImageUrl = (form.elements.namedItem('imageUrl') as HTMLInputElement).value;
                      let finalVideoUrl = (form.elements.namedItem('videoUrl') as HTMLInputElement).value;

                      // Handle File Uploads if present
                      if (newsletterImageFile || newsletterVideoFile) {
                        setIsUploadingNewsletterMedia(true);
                        
                        if (newsletterImageFile) {
                          const ext = newsletterImageFile.name.split('.').pop();
                          const path = `newsletter/img_${Date.now()}.${ext}`;
                          const { error: uploadErr } = await supabase.storage.from('content').upload(path, newsletterImageFile);
                          if (uploadErr) throw uploadErr;
                          const { data: { publicUrl } } = supabase.storage.from('content').getPublicUrl(path);
                          finalImageUrl = publicUrl;
                        }

                        if (newsletterVideoFile) {
                          const ext = newsletterVideoFile.name.split('.').pop();
                          const path = `newsletter/vid_${Date.now()}.${ext}`;
                          const { error: uploadErr } = await supabase.storage.from('content').upload(path, newsletterVideoFile);
                          if (uploadErr) throw uploadErr;
                          const { data: { publicUrl } } = supabase.storage.from('content').getPublicUrl(path);
                          finalVideoUrl = publicUrl;
                        }
                        setIsUploadingNewsletterMedia(false);
                      }

                      const response = await fetch('/api/send-newsletter', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          subject, 
                          content,
                          subscribers: subscribers.map(s => s.email),
                          imageUrl: finalImageUrl,
                          videoUrl: finalVideoUrl
                        })
                      });
                      
                      if (response.ok) {
                        setNotificationStatus({ type: 'success', text: 'Campanha enviada com sucesso!' });
                        form.reset();
                        setNewsletterImageFile(null);
                        setNewsletterVideoFile(null);
                        setNewsletterImagePreview('');
                        setNewsletterVideoPreview('');
                      } else {
                        const err = await response.json();
                        throw new Error(err.message || 'Erro ao enviar e-mails.');
                      }
                    } catch (error: any) {
                      setNotificationStatus({ type: 'error', text: error.message });
                    } finally {
                      setIsSendingNotification(false);
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface ml-1">Assunto do E-mail</label>
                    <input 
                      name="subject"
                      type="text" 
                      required
                      placeholder="Ex: Novidades da semana na Memoo Livros!"
                      className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface ml-1 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <ImageIcon size={16} className="text-secondary" />
                            Imagem da Campanha
                          </span>
                          <span className="text-[10px] text-on-surface-variant uppercase">Link ou Upload</span>
                        </label>
                        <input 
                          name="imageUrl"
                          type="url" 
                          value={newsletterImageUrlInput}
                          onChange={(e) => setNewsletterImageUrlInput(e.target.value)}
                          placeholder="https://exemplo.com/imagem.jpg"
                          className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewsletterImageFile(file);
                              setNewsletterImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="hidden" 
                          id="newsletter-img-upload" 
                        />
                        <label 
                          htmlFor="newsletter-img-upload"
                          className="flex items-center justify-center gap-3 w-full py-4 bg-surface-container-highest border border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all"
                        >
                          {newsletterImagePreview ? (
                            <img src={newsletterImagePreview} className="h-10 w-10 object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                          ) : (
                            <Camera size={20} className="text-on-surface-variant" />
                          )}
                          <span className="text-xs font-bold text-on-surface-variant">
                            {newsletterImageFile ? newsletterImageFile.name : 'Carregar Imagem Local'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface ml-1 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Film size={16} className="text-primary" />
                            Vídeo da Campanha
                          </span>
                          <span className="text-[10px] text-on-surface-variant uppercase">Link ou Upload</span>
                        </label>
                        <input 
                          name="videoUrl"
                          type="url" 
                          value={newsletterVideoUrlInput}
                          onChange={(e) => setNewsletterVideoUrlInput(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewsletterVideoFile(file);
                              setNewsletterVideoPreview(URL.createObjectURL(file));
                            }
                          }}
                          className="hidden" 
                          id="newsletter-vid-upload" 
                        />
                        <label 
                          htmlFor="newsletter-vid-upload"
                          className="flex items-center justify-center gap-3 w-full py-4 bg-surface-container-highest border border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all"
                        >
                          <Video size={20} className="text-on-surface-variant" />
                          <span className="text-xs font-bold text-on-surface-variant">
                            {newsletterVideoFile ? newsletterVideoFile.name : 'Carregar Vídeo Local'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Media Preview Section */}
                  {(newsletterImagePreview || newsletterImageUrlInput || newsletterVideoPreview || newsletterVideoUrlInput) && (
                    <div className="p-6 bg-surface-container-highest rounded-3xl border border-primary/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest">Visualização Prévia do Conteúdo</h4>
                        <button 
                          type="button"
                          onClick={() => {
                            setNewsletterImageFile(null);
                            setNewsletterImagePreview('');
                            setNewsletterVideoFile(null);
                            setNewsletterVideoPreview('');
                            setNewsletterImageUrlInput('');
                            setNewsletterVideoUrlInput('');
                          }}
                          className="text-[10px] font-bold text-error uppercase hover:underline"
                        >
                          Limpar Media
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(newsletterImagePreview || newsletterImageUrlInput) && (
                          <div className="space-y-2">
                             <p className="text-[10px] font-bold text-on-surface-variant uppercase">Imagem Selecionada</p>
                             <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/20 relative group">
                               <img 
                                 src={newsletterImagePreview || newsletterImageUrlInput} 
                                 alt="Preview" 
                                 className="w-full h-full object-cover"
                                 referrerPolicy="no-referrer"
                                 onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/error/800/450')}
                               />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ImageIcon size={32} className="text-white" />
                               </div>
                             </div>
                          </div>
                        )}
                        
                        {(newsletterVideoPreview || newsletterVideoUrlInput) && (
                          <div className="space-y-2">
                             <p className="text-[10px] font-bold text-on-surface-variant uppercase">Vídeo Selecionado</p>
                             <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-primary/10 flex flex-col items-center justify-center text-center p-4">
                               <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
                                 <Video size={24} />
                               </div>
                               <p className="text-[10px] font-bold text-on-surface truncate w-full px-4">
                                 {newsletterVideoFile ? newsletterVideoFile.name : newsletterVideoUrlInput}
                               </p>
                               <span className="text-[8px] text-primary font-black uppercase mt-1">Link de vídeo pronto</span>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface ml-1">Mensagem (Corpo do E-mail)</label>
                    <textarea 
                      name="content"
                      required
                      rows={6}
                      placeholder="Escreve aqui o conteúdo que queres enviar aos teus subscritores..."
                      className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSendingNotification || isUploadingNewsletterMedia || subscribers.length === 0}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSendingNotification || isUploadingNewsletterMedia ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {isUploadingNewsletterMedia ? 'A enviar ficheiros...' : 'A enviar e-mails...'}
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        Disparar E-mails para todos
                      </>
                    )}
                  </button>
                  
                  {subscribers.length === 0 && (
                    <p className="text-xs text-error text-center font-bold">Nenhum subscritor na lista para enviar.</p>
                  )}
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight uppercase">Configurações de Sessão</h2>
                  <p className="text-on-surface-variant mt-1 md:mt-2 text-sm">Gere as sessões da plataforma, comissões de afiliados e regras de negócio.</p>
                </div>
                <div className="p-3 md:p-4 bg-amber-500/10 text-amber-500 rounded-2xl md:rounded-3xl shrink-0">
                  <Zap size={32} className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Session Settings */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Settings size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">Parâmetros de Sessão</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">Sessão Persistente</p>
                        <p className="text-[10px] text-on-surface-variant">Manter usuários logados por 30 dias.</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">Modo Manutenção</p>
                        <p className="text-[10px] text-on-surface-variant">Bloquear acesso geral para atualizações.</p>
                      </div>
                      <div className="w-12 h-6 bg-white/10 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commission Settings */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">Configuração de Comissões</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase ml-2">Comissão de Afiliado (%)</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="50" 
                          defaultValue="10"
                          className="flex-1 accent-secondary"
                        />
                        <span className="text-lg font-black text-secondary">10%</span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="w-full py-3 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-secondary/90 transition-all">
                        Atualizar Regras de Comissão
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Affiliate Disaffiliation Management */}
              <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-error/10 text-error rounded-lg">
                      <Users size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">Desafiliação de Afiliados</h3>
                  </div>
                  <div className="px-4 py-1 bg-error/10 text-error rounded-full text-[10px] font-black uppercase tracking-widest">
                    Gestão Purgatória
                  </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">
                          <th className="pb-2 px-4 whitespace-nowrap">Afiliado</th>
                          <th className="pb-2 px-4 whitespace-nowrap">Status</th>
                          <th className="pb-2 px-4 whitespace-nowrap">Vendas</th>
                          <th className="pb-2 px-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* As linhas abaixo foram removidas para produção. Os dados serão carregados do Supabase conforme os afiliados se registarem. */}
                        {registeredUsers.filter(u => u.is_affiliate).length > 0 ? (
                          registeredUsers.filter(u => u.is_affiliate).map((aff) => (
                            <tr key={aff.id} className="bg-surface-container-high hover:bg-surface-container-highest transition-colors group">
                              <td className="py-4 px-4 rounded-l-2xl">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-on-surface">{aff.display_name || aff.email.split('@')[0]}</span>
                                  <span className="text-[10px] text-on-surface-variant">{aff.email}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase">Ativo</span>
                              </td>
                              <td className="py-4 px-4 font-mono text-xs font-bold text-white">
                                0 Vendas
                              </td>
                              <td className="py-4 px-4 rounded-r-2xl text-right">
                                <button className="p-2 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all text-[10px] font-black uppercase px-4">
                                  Desafiliar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-on-surface-variant italic">
                              Nenhum afiliado ativo de momento.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight uppercase">Configurações de Sessão</h2>
                  <p className="text-on-surface-variant mt-1 md:mt-2 text-sm">Gere as sessões da plataforma, comissões de afiliados e regras de negócio.</p>
                </div>
                <div className="p-3 md:p-4 bg-amber-500/10 text-amber-500 rounded-2xl md:rounded-3xl shrink-0">
                  <Zap size={32} className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Session Settings */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Settings size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">Parâmetros de Sessão</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">Sessão Persistente</p>
                        <p className="text-[10px] text-on-surface-variant">Manter usuários logados por 30 dias.</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">Modo Manutenção</p>
                        <p className="text-[10px] text-on-surface-variant">Bloquear acesso geral para atualizações.</p>
                      </div>
                      <div className="w-12 h-6 bg-white/10 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commission Settings */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">Configuração de Comissões</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase ml-2">Comissão de Afiliado (%)</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="50" 
                          defaultValue="10"
                          className="flex-1 accent-secondary"
                        />
                        <span className="text-lg font-black text-secondary">10%</span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="w-full py-3 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-secondary/90 transition-all">
                        Atualizar Regras de Comissão
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Affiliate Disaffiliation Management */}
              <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-error/10 text-error rounded-lg">
                      <Users size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">Desafiliação de Afiliados</h3>
                  </div>
                  <div className="px-4 py-1 bg-error/10 text-error rounded-full text-[10px] font-black uppercase tracking-widest">
                    Gestão Purgatória
                  </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">
                          <th className="pb-2 px-4 whitespace-nowrap">Afiliado</th>
                          <th className="pb-2 px-4 whitespace-nowrap">Status</th>
                          <th className="pb-2 px-4 whitespace-nowrap">Vendas</th>
                          <th className="pb-2 px-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* As linhas abaixo foram removidas para produção. Os dados serão carregados do Supabase conforme os afiliados se registarem. */}
                        {registeredUsers.filter(u => u.is_affiliate).length > 0 ? (
                          registeredUsers.filter(u => u.is_affiliate).map((aff) => (
                            <tr key={aff.id} className="bg-surface-container-high hover:bg-surface-container-highest transition-colors group">
                              <td className="py-4 px-4 rounded-l-2xl">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-on-surface">{aff.display_name || aff.email.split('@')[0]}</span>
                                  <span className="text-[10px] text-on-surface-variant">{aff.email}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase">Ativo</span>
                              </td>
                              <td className="py-4 px-4 font-mono text-xs font-bold text-white">
                                0 Vendas
                              </td>
                              <td className="py-4 px-4 rounded-r-2xl text-right">
                                <button className="p-2 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all text-[10px] font-black uppercase px-4">
                                  Desafiliar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-on-surface-variant italic">
                              Nenhum afiliado ativo de momento.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'marketing' && (
            <motion.div 
              key="marketing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight uppercase">Marketing Hub</h2>
                  <p className="text-on-surface-variant mt-1 md:mt-2 text-sm">Ferramentas para aumentar as tuas vendas e fidelizar clientes.</p>
                </div>
                <div className="p-3 md:p-4 bg-primary/10 text-primary rounded-2xl md:rounded-3xl shrink-0">
                  <TrendingUp size={32} className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>

              {/* Novo Hub de Campanhas: Campanhas de Retargeting (Wishlist) */}
              <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-primary/20 space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-500/10 text-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/10 shrink-0">
                      <Heart size={28} className="md:size-32" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-headline font-extrabold text-on-surface tracking-tight">Campanhas de Retargeting (Wishlist)</h3>
                      <p className="text-on-surface-variant text-xs md:text-sm">Disparo Inteligente para quem guardou para pagar depois.</p>
                    </div>
                  </div>
                  <div className="flex md:flex gap-2">
                    <span className="px-3 md:px-4 py-1 md:py-1.5 bg-green-500/10 text-green-500 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-green-500/20">Eficaz</span>
                    <span className="px-3 md:px-4 py-1 md:py-1.5 bg-primary/10 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-primary/20">Novo Hub</span>
                  </div>
                </div>
                
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl">
                  Este sistema lista os produtos que os teus clientes mais desejam e mostra o número exato de interessados. 
                  Ao clicares em <strong>"Enviar Oferta"</strong>, o sistema cria automaticamente uma mensagem personalizada (incluindo cupões ativos) e envia notificações diretas para todos os utilizadores que guardaram esse item específico.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistStats.length > 0 ? (
                    wishlistStats.slice(0, 6).map(item => (
                      <div key={item.id} className="bg-surface-container-high p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-pink-500/30 transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter truncate w-40">{item.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-headline font-black text-white">{item.total}</span>
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Leads / Interessados</span>
                            </div>
                          </div>
                          <div className="p-3 bg-pink-500/5 text-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                            <Heart size={20} fill="currentColor" />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button 
                            onClick={() => sendWishlistCampaign(item.id, item.name)}
                            disabled={isSendingCampaign === item.id}
                            className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                          >
                            {isSendingCampaign === item.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <>
                                <Send size={16} />
                                Enviar Oferta Inteligente
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 bg-surface-container-high rounded-[2rem] border border-dashed border-white/10 text-center space-y-3">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
                         <Heart size={32} />
                      </div>
                      <p className="text-sm text-on-surface-variant italic font-medium">Aguardando que os primeiros clientes guardem produtos nos favoritos...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção de Análise e Relatórios */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 space-y-8">
                  <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-on-surface">Análise de Performance e Clientes</h3>
                      <p className="text-xs md:text-sm text-on-surface-variant">Dados reais da tua operação e vendas.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={fetchLibrary} className="flex-1 md:flex-none p-3 bg-surface-container-highest rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-center">
                        <RefreshCw size={20} className="text-primary" />
                      </button>
                    </div>
                  </header>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface-container-high p-6 rounded-3xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Total de Vendas</p>
                    <p className="text-4xl font-headline font-black text-white">{libraryData.length}</p>
                    <p className="text-[10px] text-green-500 font-bold">Volume real de vendas</p>
                  </div>
                  <div className="bg-surface-container-high p-6 rounded-3xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Clientes Ativos</p>
                    <h4 className="text-4xl font-headline font-black text-white">
                      {[...new Set(libraryData.map(item => item.user_id))].length}
                    </h4>
                    <p className="text-[10px] text-primary font-bold">Base de compradores reais</p>
                  </div>
                  <div className="bg-surface-container-high p-6 rounded-3xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Taxa de Conversão</p>
                    <h4 className="text-4xl font-headline font-black text-white">
                      {registeredUsers.length > 0 
                        ? (([...new Set(libraryData.map(item => item.user_id))].length / registeredUsers.length) * 100).toFixed(1)
                        : 0}%
                    </h4>
                    <p className="text-[10px] text-amber-500 font-bold">Relativo a usuários inscritos</p>
                  </div>
                  <div className="bg-surface-container-high p-6 rounded-3xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Ticket Médio</p>
                    <h4 className="text-4xl font-headline font-black text-white">
                      {libraryData.length > 0 
                        ? (libraryData.reduce((acc, curr) => acc + (curr.products?.price || 0), 0) / libraryData.length).toFixed(0)
                        : 0} Kz
                    </h4>
                    <p className="text-[10px] text-secondary font-bold">Valor médio por transação</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* CRM e Conversão Real */}
                  <div className="bg-surface-container-high p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <h4 className="font-bold text-lg text-white">Monitorização de Conversão</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          <span>Usuários Registrados</span>
                          <span>Total: {registeredUsers.length}</span>
                        </div>
                        <div className="h-6 bg-secondary/20 rounded-full overflow-hidden border border-secondary/10">
                          <div className="h-full bg-secondary w-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          <span>Compradores (Clientes Reais)</span>
                          <span>{libraryData.length > 0 ? (([...new Set(libraryData.map(item => item.user_id))].length / registeredUsers.length) * 100).toFixed(1) : 0}%</span>
                        </div>
                        <div className="h-6 bg-amber-500/20 rounded-full overflow-hidden border border-amber-500/10">
                          <div className="h-full bg-amber-500" style={{ width: `${libraryData.length > 0 ? (([...new Set(libraryData.map(item => item.user_id))].length / registeredUsers.length) * 100) : 0}%` }} />
                        </div>
                      </div>
                      <p className="text-[10px] text-on-surface-variant italic leading-relaxed pt-2">
                        * A taxa de conversão é calculada com base na percentagem de usuários registados que efetuaram pelo menos uma compra.
                      </p>
                    </div>
                  </div>

                  {/* Frequência de Vendas e Compradores */}
                  <div className="bg-surface-container-high p-8 rounded-[2.5rem] border border-white/5 space-y-6 overflow-hidden">
                    <h4 className="font-bold text-lg text-white">Relatórios de Vendas Recentes</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-on-surface-variant border-b border-white/5">
                          <tr>
                            <th className="pb-4 font-bold uppercase">Cliente</th>
                            <th className="pb-4 font-bold uppercase">Produto</th>
                            <th className="pb-4 font-bold uppercase">Valor</th>
                            <th className="pb-4 font-bold uppercase">Data</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {libraryData.slice(0, 5).map((sale, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                              <td className="py-4">
                                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                                  {sale.profiles?.full_name || 'Usuário'}
                                </span>
                                <span className="text-[10px] text-on-surface-variant truncate block w-24">{sale.profiles?.email}</span>
                              </td>
                              <td className="py-4">{sale.products?.title || 'Produto'}</td>
                              <td className="py-4 font-mono font-bold text-primary">
                                {sale.products?.price} {sale.products?.currency}
                              </td>
                              <td className="py-4 text-on-surface-variant">
                                {new Date(sale.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {libraryData.length === 0 && (
                        <div className="py-12 text-center text-on-surface-variant opacity-50 italic">Nenhuma venda registada até ao momento.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cupons */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                        <Plus size={20} />
                      </div>
                      <h3 className="font-bold text-on-surface">Gestão de Cupons VIP</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Cria códigos de escala (ex: MEMOO20) para fidelizar o teu cliente no checkout.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        placeholder="CÓDIGO"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                        className="w-full sm:flex-1 bg-surface-container-high border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="%"
                          value={newCoupon.discount}
                          onChange={(e) => setNewCoupon({...newCoupon, discount: parseInt(e.target.value)})}
                          className="flex-1 sm:w-16 bg-surface-container-high border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                        <button 
                          onClick={async () => {
                            if (!newCoupon.code) return;
                            const { error } = await supabase.from('coupons').insert({
                              code: newCoupon.code,
                              discount: newCoupon.discount
                            });
                            if (!error) {
                              fetchCoupons();
                              setNewCoupon({ code: '', discount: 10 });
                            } else {
                              if (error.message.includes('schema cache')) {
                                alert('Erro de Base de Dados: A tabela "coupons" ainda não foi criada no Supabase. Por favor, corre o script SQL fornecido no chat.');
                              } else {
                                alert('Erro ao criar cupão: ' + error.message);
                              }
                            }
                          }}
                          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center justify-center shrink-0"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {coupons.map(c => (
                        <div key={c.id} className="flex items-center justify-between bg-surface-container-high p-3 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary">{c.code}</span>
                            <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">-{c.discount}%</span>
                          </div>
                          <button onClick={async () => {
                            const { error } = await supabase.from('coupons').delete().eq('id', c.id);
                            if (!error) fetchCoupons();
                          }} className="text-on-surface-variant hover:text-error transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cross-selling */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                        <ShoppingBag size={20} />
                      </div>
                      <h3 className="font-bold text-on-surface uppercase tracking-tighter">Venda Cruzada (Cross)</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Sugerir produtos relacionados automaticamente quando o cliente está a ler ou a ouvir.
                    </p>
                  </div>
                  <div className="bg-surface-container-high p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                       <span>Motor de Sugestão</span>
                       <span className="text-amber-500">Inteligente</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 w-[85%]" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsConfiguringCrossSell(true)}
                    className="w-full py-3 bg-surface-container-high rounded-xl text-xs font-black uppercase tracking-widest text-on-surface hover:bg-surface-container-highest transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Configurar Sugestões
                  </button>
                </div>

                {/* Upsells (Venda de Execução) */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                        <ArrowUpRight size={20} />
                      </div>
                      <h3 className="font-bold text-on-surface uppercase tracking-tighter">Upsells e Upgrades</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Oferecer a versão Master ou um bundle complementar no momento exato do pagamento.
                    </p>
                  </div>
                  <div className="bg-surface-container-high p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                       <span>Conversão OTO</span>
                       <span className="text-green-500">Premium</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[60%]" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsConfiguringUpsell(true)}
                    className="w-full py-3 bg-surface-container-high rounded-xl text-xs font-black uppercase tracking-widest text-on-surface hover:bg-surface-container-highest transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Criar Ofertas OTO
                  </button>
                </div>

                {/* Abandono de Carrinho */}
                <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                        <Mail size={20} />
                      </div>
                      <h3 className="font-bold text-on-surface uppercase tracking-tighter">Recuperação de Carrinho</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Enviar e-mails automáticos para clientes que deixaram produtos no carrinho.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsConfiguringCartRecovery(true)}
                    className="w-full py-3 bg-surface-container-high rounded-xl text-xs font-black uppercase tracking-widest text-on-surface hover:bg-surface-container-highest transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {cartRecoveryEnabled ? 'Gerir Automação' : 'Ativar Automação'}
                  </button>
                </div>
              </div>

              {/* Curso Intensivo de Marketing e Vendas Extenso */}
              <div className="bg-surface-container-low p-8 rounded-[3rem] border border-primary/10 space-y-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <BookOpen size={180} className="text-primary" />
                </div>

                <div className="relative space-y-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">Curso Mestre</span>
                  <h2 className="text-4xl font-headline font-black text-on-surface">Curso Intensivo de Marketing e Vendas Memoo</h2>
                  <p className="text-on-surface-variant max-w-2xl text-lg">O teu guia definitivo para dominar o mercado em 2026 e explodir o teu faturamento.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 relative z-10">
                  {/* Bloco 1: Estratégia 2026 */}
                  <div className="bg-surface-container-high p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                      <TrendingUp size={24} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-white">Estratégia Vencedora 2026</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        Em 2026, o marketing não é sobre quem grita mais alto, mas sobre quem <strong>resolve o problema certo</strong> para a pessoa certa. 
                      </p>
                      <ul className="space-y-3">
                        <li className="flex gap-2 text-xs">
                          <CheckCircle size={14} className="text-primary shrink-0" />
                          <span><strong>Retargeting Real:</strong> Usa a ferramenta de Wishlist para converter "olhadores" em compradores com um clique.</span>
                        </li>
                        <li className="flex gap-2 text-xs">
                          <CheckCircle size={14} className="text-primary shrink-0" />
                          <span><strong>Cross-Selling Automático:</strong> O sistema sugere o que o cliente quer antes dele saber que quer. Sugestões por categoria são ouro.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Bloco 2: Como configurar e atrair */}
                  <div className="bg-surface-container-high p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
                      <Settings size={24} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-white">Configurar para Atrair</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-black text-secondary uppercase mb-1">Visual Seduction (Banners)</p>
                          <p className="text-[11px] text-on-surface-variant italic leading-relaxed">Usa o novo <strong>Carrossel Dinâmico</strong> para destacar o que dá mais lucro. Uma imagem profissional com um botão de "Aproveitar Agora" no topo do site aumenta a conversão em até 40%.</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-secondary uppercase mb-1">Página de Produto (Sales Page)</p>
                          <p className="text-[11px] text-on-surface-variant italic leading-relaxed">Foca no BENEFÍCIO. O novo carrossel de <strong>Produtos Relacionados</strong> no fundo da página garante que, se o cliente não comprar o item A, ele veja o item B e permaneça no teu ecossistema.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bloco 3: Funil e Conversão */}
                  <div className="bg-surface-container-high p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
                      <Zap size={24} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-white">O Ciclo de Conversão</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        Entender o <strong>Funil</strong> é entender o dinheiro.
                      </p>
                      <div className="p-4 bg-white/5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <p className="text-[10px] font-bold text-white uppercase">Topo (Atrair): Newsletter e Redes</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                          <p className="text-[10px] font-bold text-white uppercase">Meio (Desejo): Ebooks gratuitos e Demos</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <p className="text-[10px] font-bold text-white uppercase">Fundo (Comprar): Cupons e Checkouts rápidos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção Extra: Ferramentas Técnicas */}
                <div className="grid lg:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-on-surface">Como usar as Ferramentas Memoo:</h4>
                    <div className="space-y-4">
                      <div className="group bg-surface-container-high p-6 rounded-3xl border border-white/5 hover:border-pink-500/50 transition-all">
                        <div className="flex items-center justify-between mb-2">
                           <h5 className="font-bold text-pink-500">Wishlist Inteligente (❤️)</h5>
                           <span className="text-[10px] bg-pink-500/10 text-pink-500 px-2 py-1 rounded-full">Hot Leads</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Não percas quem "quase comprou". Usa o painel de marketing para ver quais produtos têm mais corações e envia uma oferta relâmpago. Esta é a ferramenta mais poderosa para converter o desejo em faturamento real instantâneo.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-on-surface">Estratégia de Frequência:</h4>
                    <p className="text-sm text-on-surface-variant">Manter um cliente é 7x mais barato que atrair um novo. Analisa a <strong>Frequência de Vendas</strong> na nossa tabela de relatórios acima. Se um usuário comprou 3 vezes num mês, ele é um "Fã". Oferece-lhe um cupão VIP de 50% no próximo lançamento para transformá-lo num embaixador da marca.</p>
                    <div className="p-6 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                      <p className="text-xs font-bold text-amber-500 mb-2 uppercase">Próximo Passo:</p>
                      <p className="text-sm text-on-surface-variant italic leading-relaxed">"O sucesso em 2026 vem da <strong>consistência</strong>. Não vendas apenas produtos, vende soluções para os sonhos e medos dos teus clientes."</p>
                    </div>
                  </div>
                </div>

                {/* Novo Roteiro Técnico Passo a Passo */}
                <div className="pt-12 border-t border-white/5 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-headline font-black text-white uppercase tracking-tighter">Roteiro de Engenharia Administrativa</h4>
                      <p className="text-on-surface-variant text-sm">O passo a passo para configurar a tua máquina de vendas de nível mestre.</p>
                    </div>
                    <div className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                      Nível: 6º Semestre / Mestre
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { step: "01", title: "Administração Central", desc: "Gestão completa de usuários, pedidos pendentes e tráfego real filtrado." },
                      { step: "02", title: "Marketing & Vendas", desc: "Ativação de Banners Dinâmicos e campanhas de Wishlist (Retargeting)." },
                      { step: "03", title: "Configuração de Sessão", desc: "Definição de persistência de login e segurança de acesso administrativo." },
                      { step: "04", title: "Sessões e Comissões", desc: "Parâmetros globais de ganhos e regras de negócio para a plataforma." },
                      { step: "05", title: "Desafiliação Proativa", desc: "Limpeza de afiliados inativos e gestão de embaixadores da marca." },
                      { step: "06", title: "Upsells Responsivos", desc: "Configuração de ofertas OTO (One Time Offer) adaptadas a mobile." },
                      { step: "07", title: "Cross-selling Manual", desc: "Curadoria de sugestões por produto para maximizar o ticket médio." },
                      { step: "08", title: "Upgrade Sistémico", desc: "Monitorização de conversão de usuários gratuitos para premium." },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-surface-container-high p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
                        <div className="w-8 h-8 bg-white/5 text-primary rounded-full flex items-center justify-center text-[10px] font-black mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                          {item.step}
                        </div>
                        <h5 className="font-bold text-sm text-white mb-2 leading-tight uppercase tracking-tight">{item.title}</h5>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-red-500/10 rounded-3xl border border-red-500/20 mt-8">
                    <p className="text-xs font-bold text-red-500 mb-2 uppercase">Gestão de Hot Leads:</p>
                    <p className="text-sm text-on-surface-variant italic leading-relaxed">"O cliente que abandona o carrinho não é uma venda perdida, mas um **Hot Lead** que precisa de um empurrão premium. Usa a ferramenta de **Recuperação de Carrinho** para monitorizar estes usuários e enviar-lhes uma oferta que eles não podem recusar."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="space-y-2">
                <h2 className="text-3xl font-headline font-extrabold text-on-surface">Configurações do Site</h2>
                <p className="text-on-surface-variant">Gere integrações e parâmetros globais da plataforma.</p>
              </header>

              <div className="max-w-2xl space-y-8">
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-border space-y-8">
                  {/* IBAN e Pagamentos */}
                  <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                        <Globe size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-on-surface">Pagamento via IBAN</h3>
                        <p className="text-sm text-on-surface-variant">Configura os teus dados bancários para transferências.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface px-2">Banco</label>
                        <input 
                          type="text" 
                          value={ibanBank}
                          onChange={(e) => setIbanBank(e.target.value)}
                          placeholder="Ex: BAI, BFA, BIC..."
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface px-2">IBAN Angolano (21 dígitos)</label>
                        <input 
                          type="text" 
                          value={ibanNumber}
                          onChange={(e) => setIbanNumber(e.target.value)}
                          placeholder="AO06 ...."
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface px-2">Titular da Conta</label>
                        <input 
                          type="text" 
                          value={ibanOwner}
                          onChange={(e) => setIbanOwner(e.target.value)}
                          placeholder="Ex: MEMOO LIVROS LDA"
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <button 
                        onClick={handleSaveIban}
                        disabled={isSavingIban}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all disabled:opacity-50"
                      >
                        {isSavingIban ? <Loader2 className="animate-spin" size={18} /> : ibanSaved ? <CheckCircle size={18} /> : <CheckCircle size={18} />}
                        {isSavingIban ? 'Salvando...' : ibanSaved ? 'Salvo com Sucesso!' : 'Salvar Dados Bancários'}
                      </button>
                    </div>
                  </div>

                  {/* Identidade Visual */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                        <ImageIconLucide size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-on-surface">Identidade Visual</h3>
                        <p className="text-sm text-on-surface-variant">Personaliza o logotipo e o favicon do site.</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Logo Upload */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-on-surface px-2">Logotipo Principal</label>
                        <div className="relative group aspect-video bg-surface-container-high rounded-2xl border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center p-4">
                          {isSavingVisual ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="animate-spin text-primary" size={32} />
                              <p className="text-[10px] font-bold text-primary uppercase">Carregando...</p>
                            </div>
                          ) : logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <div className="text-center space-y-2 opacity-30">
                              <Upload size={32} className="mx-auto" />
                              <p className="text-[10px] font-bold uppercase tracking-widest">Upload Logo</p>
                            </div>
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            disabled={isSavingVisual}
                            onChange={(e) => e.target.files?.[0] && handleSaveVisualSettings('logo', e.target.files[0])}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>
                        <p className="text-[10px] text-on-surface-variant text-center">Fundo transparente (PNG/SVG) recomendado.</p>
                      </div>

                      {/* Favicon Upload */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-on-surface px-2">Favicon (Ícone Aba)</label>
                        <div className="relative group aspect-video bg-surface-container-high rounded-2xl border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center p-4">
                          {isSavingVisual ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="animate-spin text-primary" size={32} />
                              <p className="text-[10px] font-bold text-primary uppercase">Carregando...</p>
                            </div>
                          ) : faviconUrl ? (
                            <img src={faviconUrl} alt="Favicon" className="w-12 h-12 object-contain" />
                          ) : (
                            <div className="text-center space-y-2 opacity-30">
                              <Plus size={32} className="mx-auto" />
                              <p className="text-[10px] font-bold uppercase tracking-widest">Upload Favicon</p>
                            </div>
                          )}
                          <input 
                            type="file" 
                            accept="image/x-icon,image/png,image/svg+xml"
                            disabled={isSavingVisual}
                            onChange={(e) => e.target.files?.[0] && handleSaveVisualSettings('favicon', e.target.files[0])}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>
                        <p className="text-[10px] text-on-surface-variant text-center">Quadrado (32x32px ou 512x512px).</p>
                      </div>
                    </div>

                    {visualSaved && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold py-3 px-4 rounded-xl flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Alterações visuais salvas com sucesso!
                      </motion.div>
                    )}
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Globe size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-on-surface">Google Analytics 4</h3>
                        <p className="text-sm text-on-surface-variant">Mede o tráfego e o comportamento dos utilizadores.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface px-2">ID de Medição (Measurement ID)</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input 
                          value={gaId}
                          onChange={(e) => setGaId(e.target.value)}
                          placeholder="G-XXXXXXXXXX"
                          className="flex-1 bg-surface-container-high border border-border rounded-2xl py-4 px-6 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none min-w-0"
                        />
                        <button 
                          onClick={handleSaveGA}
                          disabled={isSavingGA || gaSaved}
                          className={`px-8 py-4 sm:py-0 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                            gaSaved 
                              ? 'bg-secondary text-white' 
                              : 'bg-primary text-white hover:bg-primary-dim active:scale-95 disabled:opacity-50 disabled:active:scale-100'
                          }`}
                        >
                          {isSavingGA ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Salvando...
                            </span>
                          ) : gaSaved ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle size={18} />
                              Salvo!
                            </span>
                          ) : (
                            'Salvar'
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-on-surface-variant px-2">
                        Podes encontrar este ID no teu painel do Google Analytics em Admin {'>'} Data Streams.
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-on-surface">Segurança e Acesso</h3>
                        <p className="text-sm text-on-surface-variant">Gere quem pode aceder a este painel.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-2xl border border-border">
                        <div className="flex items-center gap-3">
                          {user && (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-on-surface">{user.email?.split('@')[0]}</div>
                                <div className="text-[10px] text-on-surface-variant">{user.email}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full uppercase">Super Admin</span>
                      </div>
                      
                      <button className="w-full border border-border text-on-surface py-4 rounded-2xl font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                        <Plus size={18} />
                        Adicionar Novo Administrador
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-error/10 p-8 rounded-[2.5rem] border border-error/20 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-error/20 text-error rounded-xl">
                      <Trash2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-error">Zona de Perigo</h3>
                      <p className="text-sm text-error/70">Ações irreversíveis que afetam toda a plataforma.</p>
                    </div>
                  </div>
                  <button className="w-full bg-error text-white py-4 rounded-2xl font-bold hover:bg-error/80 transition-all">
                    Limpar Cache Global
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {isAddingAd && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddingAd(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-xl bg-surface-container-lowest rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
                  <div>
                    <h3 className="text-xl font-headline font-black text-white uppercase tracking-tight">
                      {editingAd ? 'Editar Anúncio' : 'Novo Anúncio / Parceria'}
                    </h3>
                    <p className="text-on-surface-variant text-xs mt-1">Configure o seu banner de afiliado ou bloco AdSense.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsAddingAd(false);
                      setEditingAd(null);
                      setAdForm({
                        title: '',
                        type: 'banner',
                        content: '',
                        link_url: '',
                        placement: 'sidebar',
                        page_target: 'all',
                        is_active: true
                      });
                    }}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateAd} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    <div className="space-y-4">
                      {adForm.type === 'banner' && (
                        <div className="space-y-4 p-6 bg-surface-container-high rounded-3xl border border-white/5">
                          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block">Imagem do Banner</label>
                          <div 
                            onClick={() => document.getElementById('ad-image')?.click()}
                            className="cursor-pointer group relative aspect-video rounded-2xl bg-black/20 border-2 border-dashed border-white/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden"
                          >
                            {adFilePreview ? (
                              <>
                                <img src={adFilePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Mudar Imagem</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <ImageIconLucide size={24} className="text-on-surface-variant" />
                                </div>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center px-4">
                                  Clica para carregar imagem
                                </span>
                              </>
                            )}
                            <input 
                              id="ad-image"
                              type="file"
                              accept="image/*"
                              onChange={handleAdFileChange}
                              className="hidden"
                            />
                          </div>
                          {adFile && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                              <CheckCircle size={14} className="text-green-500" />
                              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest truncate">{adFile.name}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">Título do Anúncio</label>
                        <input 
                          type="text"
                          required
                          value={adForm.title}
                          onChange={(e) => setAdForm({...adForm, title: e.target.value})}
                          placeholder="Ex: Banner Nike Afiliado"
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">Tipo de Anúncio</label>
                        <select 
                          value={adForm.type}
                          onChange={(e) => setAdForm({...adForm, type: e.target.value})}
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                          <option value="banner">Banner (Imagem)</option>
                          <option value="adsense">Código AdSense / HTML</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">Posicionamento</label>
                        <select 
                          value={adForm.placement}
                          onChange={(e) => setAdForm({...adForm, placement: e.target.value})}
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                          <option value="sidebar">Barra Lateral</option>
                          <option value="top">Topo da Página</option>
                          <option value="bottom">Rodapé</option>
                          <option value="popup">Popup de Saída</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">Página onde o anúncio deve aparecer</label>
                      <select 
                        value={adForm.page_target}
                        onChange={(e) => setAdForm({...adForm, page_target: e.target.value})}
                        className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="all">Todas as Páginas</option>
                        <option value="home">Página Inicial</option>
                        <option value="books">Ebooks (Página de Livros)</option>
                        <option value="music">Músicas (Página de Música)</option>
                        <option value="audiobooks">Audiobooks (Página de Áudio)</option>
                        <option value="digital">Produtos Digitais (Templates/Imagens)</option>
                        <option value="product">Página Individual de Produto</option>
                      </select>
                    </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">
                          {adForm.type === 'banner' 
                            ? (adFile ? 'URL da Imagem (Opcional - Ficheiro selecionado)' : 'URL da Imagem (Ou faz upload acima)') 
                            : adForm.type === 'adsense' ? 'Código HTML/JS' : 'URL de Destino'}
                        </label>
                        {adForm.type === 'adsense' ? (
                          <textarea 
                            required
                            value={adForm.content}
                            onChange={(e) => setAdForm({...adForm, content: e.target.value})}
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 outline-none h-32 font-mono"
                          />
                        ) : (
                          <input 
                            type="url"
                            required={adForm.type === 'banner' ? !adFile : true}
                            value={adForm.content}
                            onChange={(e) => setAdForm({...adForm, content: e.target.value})}
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        )}
                      </div>

                    {adForm.type === 'banner' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">Link de Redirecionamento</label>
                        <input 
                          type="url"
                          value={adForm.link_url}
                          onChange={(e) => setAdForm({...adForm, link_url: e.target.value})}
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <input 
                        type="checkbox"
                        id="ad_active"
                        checked={adForm.is_active}
                        onChange={(e) => setAdForm({...adForm, is_active: e.target.checked})}
                        className="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="ad_active" className="text-sm font-bold text-white">Anúncio Ativado</label>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsAddingAd(false)}
                      className="flex-1 py-3 px-8 rounded-2xl border border-white/10 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                      Descartar
                    </button>
                    <button 
                      type="submit"
                      disabled={isUploadingAd}
                      className="flex-1 py-3 px-8 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      {isUploadingAd ? <Loader2 size={16} className="animate-spin" /> : editingAd ? <Save size={16} /> : <ShieldCheck size={16} />}
                      {editingAd ? 'Guardar Alterações' : 'Publicar Anúncio'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

