import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Music, 
  Image as ImageIcon, 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Download,
  Star,
  CheckCircle2,
  Loader2,
  CreditCard,
  Plus,
  ArrowRight,
  ShoppingBag,
  Film,
  Headphones,
  Play,
  Globe,
  QrCode,
  MessageCircle,
  Heart,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import PayPalButton from '../components/PayPalButton';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import AdSpace from '../components/AdSpace';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [isRecordingWhatsApp, setIsRecordingWhatsApp] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<any>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showProtectionMsg, setShowProtectionMsg] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const handleTimeUpdate = () => {
    if (!audioRef.current || hasPurchased || product.price === 0) return;
    
    // Protection movement: If authenticated (🛡️), play only 20 seconds
    const isProtected = product.title.includes('🛡️');
    if (isProtected && audioRef.current.currentTime > 20) {
      audioRef.current.pause();
      audioRef.current.currentTime = 20;
      setShowProtectionMsg(true);
    }
  };

  const isInCart = cart.some(item => item.id === id);

  const getAllImages = () => {
    if (!product) return [];
    const images = [product.cover_url];
    if (product.additional_images && Array.isArray(product.additional_images)) {
      images.push(...product.additional_images);
    }
    return images.filter(img => !!img);
  };

  const productImages = getAllImages();

  useEffect(() => {
    if (productImages.length <= 1 || isCarouselPaused || isImageFullscreen) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [productImages.length, isCarouselPaused, isImageFullscreen]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (data && !error) {
          setProduct(data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchRelatedProducts();
  }, [id, navigate]);

  const fetchRelatedProducts = async () => {
    if (!id) return;
    try {
      // First get current product to know category
      const { data: curr } = await supabase.from('products').select('category').eq('id', id).single();
      if (!curr) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', curr.category)
        .neq('id', id)
        .limit(6);
      
      if (!error && data) {
        setRelatedProducts(data);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  useEffect(() => {
    const checkPurchase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      if (session.user.email === 'abraaomatondo118@gmail.com') {
        setIsAdmin(true);
      }

      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('library')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('product_id', id)
          .single();
        
        if (data && !error) {
          setHasPurchased(true);
        }

        // Check if in wishlist
        const { data: wishlistData } = await supabase
          .from('wishlist')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('product_id', id)
          .single();
        
        if (wishlistData) setIsWishlisted(true);
      } catch (error) {
        console.error("Error checking purchase:", error);
      }
    };
    checkPurchase();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*, profiles(display_name, photo_url)')
        .eq('product_id', id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setReviews(data);
        
        // Check if current user has already reviewed
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userReview = data.find(r => r.user_id === session.user.id);
          if (userReview) setUserReview(userReview);
        }
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    setIsSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: id,
          user_id: session.user.id,
          rating: newReview.rating,
          comment: newReview.comment
        });
      
      if (error) throw error;
      
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Erro ao enviar avaliação.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBuy = async () => {
    if (!product) return;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      alert('Por favor, inicie sessão para comprar este produto.');
      navigate('/perfil');
      return;
    }

    if (hasPurchased) {
      alert('Já possui este produto na sua biblioteca.');
      return;
    }

    setIsBuying(true);
    try {
      const { error } = await supabase
        .from('library')
        .insert({
          user_id: session.user.id,
          product_id: id
        });
      
      if (error) throw error;
      
      setHasPurchased(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error during purchase:", error);
      alert('Erro ao processar a compra. Tente novamente.');
    } finally {
      setIsBuying(false);
    }
  };

  const toggleWishlist = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert('Por favor, inicie sessão para guardar nos favoritos.');
      navigate('/perfil');
      return;
    }

    setIsWishlisting(true);
    try {
      if (isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', session.user.id)
          .eq('product_id', id);
        setIsWishlisted(false);
      } else {
        await supabase
          .from('wishlist')
          .insert({
            user_id: session.user.id,
            product_id: id
          });
        setIsWishlisted(true);

        // Notificar Admin
        const { data: adminProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', 'abraaomatondo118@gmail.com')
          .single();
        
        if (adminProfile) {
          await supabase.from('notifications').insert({
            user_id: adminProfile.id,
            title: "Interesse de Compra (Página)! ❤️",
            message: `O utilizador ${session.user.email} guardou "${product.title}" nos favoritos para pagar depois.`,
            is_read: false
          });
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setIsWishlisting(false);
    }
  };

  const handleWhatsAppClick = async () => {
    if (!product) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsRecordingWhatsApp(true);
      try {
        const refId = localStorage.getItem('memoo_referrer_id');
        // Enviar para a tabela de ordens pendentes
        await supabase.from('whatsapp_orders').insert({
          user_id: session.user.id,
          product_id: product.id,
          status: 'pending',
          referrer_id: refId || null
        });
      } catch (err) {
        console.error("Erro ao registar intenção de compra WhatsApp:", err);
      } finally {
        setIsRecordingWhatsApp(false);
      }
    }

    const message = `Olá! Gostaria de comprar o produto: ${product.title}. (User ID: ${session?.user?.id || 'Visitante'})`;
    const whatsappUrl = `https://wa.me/244953421700?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
      coverUrl: product.cover_url
    });
    // Optional: show a toast or automatic redirect
    // navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={product.cover_url} 
            alt={product.title} 
            className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/50 to-surface" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-8 h-full flex items-end pb-12">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-md border border-white/10"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Product Image & Info */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[3/4] bg-surface-container-low rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/50 group"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full relative"
                >
                  {/* Blurred Background */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={productImages[currentImageIndex]} 
                      alt=""
                      className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Main Image Contained */}
                  <img 
                    src={productImages[currentImageIndex]} 
                    alt={`${product.title} - Imagem ${currentImageIndex + 1}`}
                    className="relative w-full h-full object-contain cursor-zoom-in"
                    onDoubleClick={() => setIsImageFullscreen(true)}
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slide Controls Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {productImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      currentImageIndex === idx ? "w-8 bg-primary" : "w-2 bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>

              {/* Pause/Play & Zoom Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsImageFullscreen(true)}
                  className="p-3 bg-black/60 backdrop-blur-md text-white rounded-2xl hover:bg-primary transition-all shadow-xl"
                  title="Ampliar Imagem"
                >
                  <Plus size={20} />
                </button>
                {productImages.length > 1 && (
                  <button 
                    onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                    className="p-3 bg-black/60 backdrop-blur-md text-white rounded-2xl hover:bg-primary transition-all shadow-xl"
                  >
                    {isCarouselPaused ? <Play size={20} fill="currentColor" /> : <Clock size={20} />}
                  </button>
                )}
              </div>

              {productImages.length > 1 && !isCarouselPaused && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-30">
                  <motion.div 
                    key={currentImageIndex}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </motion.div>

            {/* Thumbnail Selection */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {productImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0",
                      currentImageIndex === idx ? "border-primary scale-105 shadow-lg shadow-primary/20" : "border-white/5 opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-secondary">
                <ShieldCheck size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">Compra Segura</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                O teu pagamento é processado de forma encriptada e segura. Acesso imediato após confirmação.
              </p>
            </div>
            <AdSpace placement="sidebar" page="product" />
          </div>

          {/* Right: Sales Copy & Checkout */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  {reviews.length > 0 ? (
                    <>
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold text-on-surface-variant ml-2">
                        ({(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}/5 de {reviews.length} avaliações)
                      </span>
                    </>
                  ) : (
                    <>
                      <Star size={14} className="text-on-surface-variant/30" />
                      <span className="text-xs font-bold text-on-surface-variant ml-2">(Ainda sem avaliações)</span>
                    </>
                  )}
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-headline font-black text-white leading-tight">
                {product.title}
              </h1>
              
              <p className="text-xl text-on-surface-variant leading-relaxed font-medium">
                Por <span className="text-white">{product.author}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap size={20} className="text-primary" />
                    O que vais receber:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Acesso vitalício ao conteúdo',
                      'Atualizações gratuitas incluídas',
                      'Suporte prioritário via email',
                      'Certificado de conclusão (se aplicável)',
                      'Material de apoio em PDF'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-on-surface-variant text-sm">
                        <CheckCircle2 size={18} className="text-secondary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Descrição do Produto</h3>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {product.description || 'Sem descrição disponível para este produto.'}
                  </p>
                </div>

                {product.demo_video_url && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Film size={20} className="text-primary" />
                      Vídeo de Demonstração
                    </h3>
                    <div className="aspect-video bg-black rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                      <video 
                        src={product.demo_video_url} 
                        controls 
                        className="w-full h-full object-contain"
                        poster={product.cover_url}
                      />
                    </div>
                  </div>
                )}

                {product.demo_ebook_url && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <BookOpen size={20} className="text-primary" />
                      Amostra Grátis (PDF)
                    </h3>
                    <div className="bg-surface-container-high p-8 rounded-[2rem] border border-white/10 shadow-xl group hover:border-primary/30 transition-all cursor-pointer" onClick={() => setShowPreviewModal(true)}>
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen size={32} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">Lê um trecho agora</span>
                            <span className="text-[10px] text-on-surface-variant font-medium">Acesso Instantâneo</span>
                          </div>
                          <p className="text-sm text-on-surface-variant line-clamp-1">Espreita as primeiras páginas sem custos.</p>
                          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-wider mt-2 group-hover:translate-x-1 transition-transform">
                            Abrir Pré-visualização <ArrowRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {product.demo_audio_url && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Headphones size={20} className="text-primary" />
                      Amostra de Áudio (Preview)
                    </h3>
                    <div className="bg-surface-container-high p-6 rounded-[2rem] border border-white/10 shadow-xl">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Music size={32} />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                              {product.title.includes('🛡️') ? 'Amostra Protegida' : 'Ouve um trecho'}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-medium">Qualidade Digital</span>
                          </div>
                          <audio 
                            ref={audioRef}
                            src={product.demo_audio_url} 
                            onTimeUpdate={handleTimeUpdate}
                            controls 
                            className="w-full h-10 accent-primary"
                          />
                          <AnimatePresence>
                            {showProtectionMsg && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-[10px] font-bold text-secondary flex items-center gap-2"
                              >
                                <ShieldCheck size={14} />
                                Autenticação Ativa: Compre para ouvir a música completa.
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-surface-container-highest p-8 rounded-[2.5rem] border border-primary/20 shadow-2xl shadow-primary/5 space-y-8 sticky top-32">
                  <div className="space-y-2">
                    {product.price > 0 && (
                      <div className="text-sm font-bold text-on-surface-variant line-through opacity-50">
                        {formatPrice(product.price * 1.5, product.currency)}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">
                        {product.price > 0 ? product.price : 'Grátis'}
                      </span>
                      {product.price > 0 && (
                        <span className="text-2xl font-bold text-primary">
                          {product.currency === 'EUR' ? '€' : product.currency === 'USD' ? '$' : ' Kz'}
                        </span>
                      )}
                    </div>
                    {product.price > 0 && (
                      <p className="text-xs text-secondary font-bold uppercase tracking-widest">Oferta por tempo limitado</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {hasPurchased ? (
                      <a 
                        href={product.file_url} 
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-6 bg-secondary text-white rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 hover:bg-secondary-dim active:scale-95"
                      >
                        <Download size={24} />
                        Fazer Download
                      </a>
                    ) : (
                      <div className="flex gap-4">
                        <button 
                          onClick={handleAddToCart}
                          disabled={isBuying}
                          className={`flex-1 py-6 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isInCart ? 'bg-secondary text-white' : 'bg-primary text-white shadow-xl shadow-primary/20'}`}
                        >
                          {isInCart ? (
                            <span className="flex items-center gap-3">
                              <ShoppingBag size={24} />
                              No Carrinho
                            </span>
                          ) : (
                            <span className="flex items-center gap-3">
                              <Plus size={24} />
                              Adicionar ao Carrinho
                            </span>
                          )}
                        </button>
                        
                        <button
                          onClick={toggleWishlist}
                          disabled={isWishlisting}
                          className={cn(
                            "w-20 rounded-2xl border flex items-center justify-center transition-all active:scale-95",
                            isWishlisted 
                              ? "bg-secondary/10 border-secondary text-secondary" 
                              : "bg-surface-container-high border-white/5 text-on-surface-variant hover:text-white hover:border-white/20"
                          )}
                        >
                          <Heart size={28} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                      </div>
                    )}

                    {!hasPurchased && isInCart && (
                      <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-surface-container-low text-white border border-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
                      >
                        <ArrowRight size={20} />
                        Finalizar Compra Agora
                      </button>
                    )}
                  </div>

                  {!hasPurchased && !isInCart && product.price > 0 && (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold"><span className="bg-surface-container-highest px-4 text-on-surface-variant">Ou Pagar com</span></div>
                      </div>
                      
                      {product.currency === 'AOA' && (
                        <p className="text-[10px] text-on-surface-variant text-center italic">
                          O PayPal não suporta Kwanza (AOA). <br />
                          O valor será convertido para <b>{(product.price / 850).toFixed(2)} EUR</b>.
                        </p>
                      )}

                      <PayPalButton 
                        amount={product.currency === 'AOA' ? (product.price / 850).toFixed(2) : product.price.toString()} 
                        currency={product.currency === 'AOA' ? 'EUR' : product.currency}
                        onSuccess={(details) => {
                          console.log("PayPal Success:", details);
                          handleBuy();
                        }}
                        onError={(err) => {
                          console.error("PayPal Error Details:", err);
                          alert("Erro no PayPal: Isso acontece geralmente se o 'Client ID' não estiver configurado corretamente nas variáveis de ambiente (.env) ou se a conta não suportar a moeda.");
                        }}
                      />

                      <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20 text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden">
                            <MessageCircle size={24} fill="currentColor" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-green-500 font-bold uppercase tracking-widest mb-1">Pagamento via Multicaixa</p>
                          <p className="text-[10px] text-on-surface-variant leading-relaxed">
                            Se estás em Angola e não tens PayPal, entra em contacto connosco pelo WhatsApp para pagar via IBAN/Transferência.
                          </p>
                        </div>
                        <button 
                          onClick={handleWhatsAppClick}
                          disabled={isRecordingWhatsApp}
                          className="w-full inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-green-600 transition-all uppercase tracking-wider disabled:opacity-50"
                        >
                          {isRecordingWhatsApp ? <Loader2 className="animate-spin" size={16} /> : <MessageCircle size={16} fill="currentColor" />}
                          Contactar via WhatsApp
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => {
                        if (hasPurchased && product.file_url) {
                          window.open(product.file_url, '_blank');
                        } else if (!hasPurchased) {
                          handleAddToCart();
                        }
                      }}
                      className="w-full flex items-center gap-4 text-on-surface-variant group hover:text-primary transition-colors text-left"
                    >
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors"><Download size={18} /></div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest block">Download Imediato</span>
                        {hasPurchased && <span className="text-[10px] text-primary font-bold">Clica para descarregar agora</span>}
                      </div>
                    </button>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="p-2 bg-white/5 rounded-lg"><ShieldCheck size={18} /></div>
                      <span className="text-xs font-bold uppercase tracking-widest">Garantia de 7 Dias</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-8 pt-12 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-headline font-black text-white uppercase tracking-tight">O que dizem os leitores</h2>
                  <p className="text-on-surface-variant">Vê o impacto que este conteúdo teve noutros utilizadores.</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-4xl font-black text-white">
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '—'}
                  </div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {[1,2,3,4,5].map(i => (
                      <Star 
                        key={i} 
                        size={12} 
                        fill={i <= Math.round(reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / (reviews.length || 1)) ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-black mt-1">
                    {reviews.length} {reviews.length === 1 ? 'Avaliação' : 'Avaliações'}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Submit Review Form (Only for purchasers who haven't reviewed) */}
                {hasPurchased && !userReview && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-surface-container-low p-8 rounded-[2rem] border border-primary/20 space-y-6"
                  >
                    <h3 className="text-lg font-bold text-white">Deixa a tua marca</h3>
                    <p className="text-xs text-on-surface-variant">A tua opinião é fundamental para ajudarmos mais pessoas.</p>
                    
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-on-surface-variant tracking-widest px-2">Nota</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(i => (
                            <button 
                              key={i}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: i }))}
                              className={`p-2 transition-all ${newReview.rating >= i ? 'text-yellow-500 scale-110' : 'text-on-surface-variant hover:text-yellow-500/50'}`}
                            >
                              <Star size={24} fill={newReview.rating >= i ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-on-surface-variant tracking-widest px-2">Comentário</label>
                        <textarea 
                          required
                          rows={3}
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Como foi a tua experiência?"
                          className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-4 py-3 text-sm text-on-surface-variant focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmittingReview ? <Loader2 className="animate-spin" size={16} /> : 'Publicar Avaliação'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Reviews List */}
                <div className={cn("space-y-6", (hasPurchased && !userReview) ? "lg:col-span-2" : "lg:col-span-3")}>
                  {reviews.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {reviews.map((review) => (
                        <div 
                          key={review.id} 
                          className={cn(
                            "p-6 rounded-[2rem] border transition-all",
                            review.user_id === userReview?.user_id ? "bg-primary/5 border-primary/20" : "bg-surface-container-low border-white/5"
                          )}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-black text-primary overflow-hidden">
                                {review.profiles?.photo_url ? (
                                  <img src={review.profiles.photo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (review.profiles?.display_name || '?')[0].toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white line-clamp-1">{review.profiles?.display_name || 'Utilizador'}</p>
                                <p className="text-[10px] text-on-surface-variant">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-yellow-500">
                              {[1,2,3,4,5].map(i => (
                                <Star 
                                  key={i} 
                                  size={10} 
                                  fill={i <= review.rating ? "currentColor" : "none"} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-on-surface-variant leading-relaxed italic">
                            "{review.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-4 bg-surface-container-low rounded-[2.5rem] border border-dashed border-white/10">
                      <div className="p-4 bg-white/5 rounded-full text-on-surface-variant">
                        <Star size={32} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-white">Sê o primeiro a avaliar!</p>
                        <p className="text-xs text-on-surface-variant max-w-[200px]">A tua opinião ajuda a construir uma comunidade mais forte.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="space-y-8 pt-16 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-headline font-black text-white uppercase tracking-tight">Podes também gostar disto</h2>
                    <p className="text-on-surface-variant">Produtos selecionados com base no teu interesse atual.</p>
                  </div>
                  <Link to="/marketplace" className="text-primary font-bold text-sm hover:underline flex items-center gap-2">
                    Ver tudo <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                  {relatedProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ y: -10 }}
                      onClick={() => {
                        navigate(`/produto/${p.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="min-w-[280px] bg-surface-container-low rounded-[2rem] border border-white/5 overflow-hidden snap-start cursor-pointer transition-all hover:border-primary/30"
                    >
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img 
                          src={p.cover_url} 
                          alt={p.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                            {p.category}
                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-3">
                        <h3 className="font-bold text-white line-clamp-1">{p.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-black">{p.price} {p.currency}</span>
                          <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold">
                            <Star size={10} fill="currentColor" /> 4.9
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-container-high w-full max-w-lg rounded-[3rem] p-8 sm:p-12 border border-white/10 shadow-2xl text-center overflow-hidden"
            >
              {/* Confetti-like elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  >
                    <CheckCircle2 size={48} className="text-primary" />
                  </motion.div>
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/30 rounded-full"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-headline font-extrabold text-white mb-4">
                Compra Concluída!
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Obrigado por confiar na MemooLivros. O teu ficheiro já está pronto para ser descarregado e também foi guardado na tua biblioteca.
              </p>

              <div className="space-y-4">
                <a 
                  href={product?.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Download size={24} />
                  Fazer Download Agora
                </a>
                
                <button 
                  onClick={() => navigate('/perfil')}
                  className="w-full py-4 text-on-surface-variant font-bold hover:text-white transition-colors"
                >
                  Ver na minha Biblioteca
                </button>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal (PDF Viewer) */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              className="absolute inset-0 bg-surface/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-container-high w-full h-full max-w-5xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-container-high/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">Amostra Grátis</h3>
                    <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-1">{product.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 bg-black/20 overflow-hidden relative">
                {/* Embed PDF with a viewer */}
                <iframe 
                  src={`${product.demo_ebook_url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
                
                {/* Visual overlay to simulate limitation if needed, or just let them read the truncated PDF */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-container-high to-transparent pointer-events-none flex items-end justify-center pb-8">
                  <p className="text-xs font-bold text-on-surface-variant bg-surface-container-highest/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    Amostra limitada. Compra o livro completo para ler tudo.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-surface-container-high/80 backdrop-blur-md border-t border-white/5 flex items-center justify-between">
                <p className="text-xs text-on-surface-variant font-medium hidden sm:block">
                  Gostaste do que leste? Garante o teu acesso total.
                </p>
                <button 
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleAddToCart();
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  {isInCart ? 'No Carrinho' : 'Comprar Agora'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-8 mt-24">
        <div className="bg-primary/5 border border-primary/20 p-12 rounded-[3.5rem] relative overflow-hidden text-center space-y-8">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Sparkles className="absolute top-10 left-10 text-primary w-20 h-20 blur-sm" />
            <Sparkles className="absolute bottom-10 right-10 text-primary w-32 h-32 blur-md" />
          </div>
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-4xl font-headline font-black text-white leading-tight">Gostas deste tipo de conteúdo?</h2>
            <p className="text-on-surface-variant font-medium">Subscreve para receberes novos lançamentos e ofertas exclusivas diretamente no teu email.</p>
            <div className="flex bg-surface-container-low p-2 rounded-2xl border border-white/5">
              <input 
                type="email" 
                placeholder="O teu melhor email..." 
                className="flex-1 bg-transparent px-6 border-none outline-none text-white font-bold placeholder:text-on-surface-variant/50"
              />
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-primary-dim transition-all">Subscrever</button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isImageFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 lg:p-12"
          >
            <button 
              onClick={() => setIsImageFullscreen(false)}
              className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all z-[1001]"
            >
              <X size={32} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.title}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Navigation in Fullscreen */}
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length); }}
                    className="absolute left-4 lg:left-12 p-6 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all border border-white/10 group"
                  >
                    <ArrowLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % productImages.length); }}
                    className="absolute right-4 lg:right-12 p-6 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all border border-white/10 group"
                  >
                    <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </>
              )}

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                <div className="flex flex-col text-center">
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest">{currentImageIndex + 1} / {productImages.length}</span>
                  <span className="text-white font-bold text-sm truncate max-w-[200px]">{product.title}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
