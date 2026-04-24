import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabase';

export default function Hero() {
  const { t } = useLanguage();
  const [banners, setBanners] = useState<any[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Banners
      const { data: bannerData } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (bannerData) setBanners(bannerData);

      // 2. Fetch Latest Products for fallback
      const { data: productData } = await supabase
        .from('products')
        .select('cover_url')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (productData) setLatestProducts(productData.map(p => p.cover_url).filter(Boolean));
      
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Fallback to static hero if no banners
  if (banners.length === 0) {
    return (
      <section className="relative min-h-[85vh] lg:min-h-screen flex items-center px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden pt-24 lg:pt-20">
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 lg:w-96 lg:h-96 bg-primary/10 blur-[80px] lg:blur-[100px] rounded-full" />
        <div className="absolute bottom-24 -left-24 w-56 h-56 lg:w-80 lg:h-80 bg-secondary/5 blur-[60px] lg:blur-[80px] rounded-full" />
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-12 items-center w-full relative z-10">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] lg:text-xs font-bold tracking-widest uppercase mx-auto lg:mx-0" translate="no">
              <Zap size={14} fill="currentColor" />
              {t('hero.badge')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-headline font-extrabold tracking-tight leading-[1.1] text-on-surface-heading">
              {t('hero.title')}<span className="text-primary tracking-tighter">{t('hero.title_highlight')}</span>
            </h1>
            
            <p className="text-base lg:text-xl text-on-surface-variant font-body leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  to="/livros"
                  className="w-full bg-gradient-to-r from-primary-dim to-primary text-white px-8 py-4 rounded-full font-bold text-base lg:text-lg hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  {t('hero.btn_books')}
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/marketplace"
                  className="w-full px-8 py-4 rounded-full font-bold text-base lg:text-lg border border-border hover:bg-surface-container-high transition-all text-on-surface flex items-center justify-center shadow-sm"
                >
                  {t('hero.btn_marketplace')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
  
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:block"
          >
            <div className="lg:hidden relative">
              <div className="w-48 h-64 bg-surface-container-high rounded-xl relative z-10 overflow-hidden shadow-2xl border border-border rotate-3 transform">
                 {latestProducts[0] ? (
                   <img 
                    src={latestProducts[0]} 
                    alt="Latest Product" 
                    className="w-full h-full object-cover"
                  />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-6 text-center">
                     <Zap size={32} className="text-primary opacity-50" />
                   </div>
                 )}
              </div>
              <div className="absolute top-4 left-4 w-48 h-64 bg-primary/20 rounded-xl -rotate-6 transform blur-sm -z-10" />
            </div>
  
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden lg:block absolute top-10 right-0 w-64 h-80 book-tilt z-20"
            >
              {latestProducts[0] ? (
                <img 
                  src={latestProducts[0]} 
                  alt="Digital Book Cover" 
                  className="w-full h-full object-cover rounded-xl shadow-2xl border border-border"
                />
              ) : (
                <div className="w-full h-full bg-surface-container-highest rounded-xl shadow-2xl border border-border flex items-center justify-center">
                  <Zap size={48} className="text-primary opacity-20" />
                </div>
              )}
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-40 left-10 w-56 h-72 book-tilt z-10 opacity-80"
            >
              {latestProducts[1] ? (
                <img 
                  src={latestProducts[1]} 
                  alt="Digital Book Cover" 
                  className="w-full h-full object-cover rounded-xl shadow-2xl border border-border"
                />
              ) : (
                <div className="w-full h-full bg-surface-container-high rounded-xl shadow-2xl border border-border flex items-center justify-center">
                   <Zap size={40} className="text-secondary opacity-20" />
                </div>
              )}
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 right-20 w-48 h-64 book-tilt z-30"
            >
              {latestProducts[2] ? (
                <img 
                  src={latestProducts[2]} 
                  alt="Digital Book Cover" 
                  className="w-full h-full object-cover rounded-xl shadow-2xl border border-border"
                />
              ) : (
                 <div className="w-full h-full bg-surface-container-low rounded-xl shadow-2xl border border-border flex items-center justify-center">
                    <Zap size={32} className="text-primary opacity-10" />
                 </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[300px] lg:h-[450px] w-full overflow-hidden group bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Banner Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={banners[currentSlide].image_url} 
              alt={banners[currentSlide].title || "Banner"}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {(banners[currentSlide].title || banners[currentSlide].subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            )}
          </div>

          {/* Banner Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center items-start space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-3 max-w-2xl"
            >
              {banners[currentSlide].title && (
                <>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30 backdrop-blur-md">
                    Destaque Memoo
                  </span>
                  <h1 className="text-3xl lg:text-5xl font-headline font-black text-white leading-[1] tracking-tighter uppercase italic">
                    {banners[currentSlide].title}
                  </h1>
                </>
              )}
              {banners[currentSlide].subtitle && (
                <p className="text-sm lg:text-lg text-white/80 font-body max-w-xl leading-relaxed">
                  {banners[currentSlide].subtitle}
                </p>
              )}
              
              {(banners[currentSlide].button_text && banners[currentSlide].button_link) && (
                <div className="pt-2">
                  <Link 
                    to={banners[currentSlide].button_link}
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    {banners[currentSlide].button_text}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary"
          >
            <ArrowRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {banners.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-primary w-8' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
