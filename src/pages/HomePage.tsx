import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flame, Music, Package, Megaphone, X } from 'lucide-react';
import Hero from '../components/Hero';
import AdSpace from '../components/AdSpace';
import DiscoverySection from '../components/DiscoverySection';
import Benefits from '../components/Benefits';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { formatPrice } from '../lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [digitalProducts, setDigitalProducts] = useState<any[]>([]);
  const [physicalProducts, setPhysicalProducts] = useState<any[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitAd, setExitAd] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const items = data.map(item => ({
          ...item,
          image: item.cover_url,
          price: formatPrice(item.price, item.currency),
          badge: item.category,
          path: `/produto/${item.id}`
        }));

        setTrendingProducts(items.slice(0, 5));
        setDigitalProducts(items.filter(p => !['ebook', 'video'].includes(p.type)).slice(0, 4));
        
        // Pick a random product for the banner, preferably one with an image
        const withImage = items.filter(i => i.image);
        if (withImage.length > 0) {
          setFeaturedProduct(withImage[Math.floor(Math.random() * withImage.length)]);
        }
      }
      setLoading(false);
    };

    const fetchExitAd = async () => {
      try {
        const { data } = await supabase
          .from('ads')
          .select('*')
          .eq('placement', 'popup')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();
        if (data) setExitAd(data);
      } catch (err) {
        console.warn('Erro ao carregar anúncio de saída:', err);
      }
    };

    fetchProducts();
    fetchExitAd();

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exit-popup-shown')) {
        setShowExitPopup(true);
        sessionStorage.setItem('exit-popup-shown', 'true');
      }
    };

    window.addEventListener('mouseout', handleMouseOut);
    return () => window.removeEventListener('mouseout', handleMouseOut);
  }, []);

  return (
    <>
      <Hero />
      
      <div className="space-y-12">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto -mt-12 relative z-20">
          <AdSpace placement="top" page="home" />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {trendingProducts.length > 0 && (
              <DiscoverySection 
                title="Em alta" 
                subtitle="Os títulos e produtos que todos estão a devorar esta semana"
                icon={<Flame size={28} fill="currentColor" />}
                products={trendingProducts}
                viewAllPath="/livros"
              />
            )}
            
            {digitalProducts.length > 0 && (
              <DiscoverySection 
                title="Produtos Digitais" 
                subtitle="Música, templates e imagens para elevar o seu trabalho"
                icon={<Music size={28} fill="currentColor" />}
                products={digitalProducts}
                viewAllPath="/digital"
              />
            )}
          </>
        )}

        {/* Featured Banner */}
        <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden bg-surface-container-highest p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 group"
          >
            <div className="absolute inset-0 z-0">
              {featuredProduct?.image && (
                <img 
                  src={featuredProduct.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000 blur-sm"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-primary/5" />
            </div>
            
            <div className="relative z-10 lg:w-1/2 space-y-6">
              <span className="text-secondary font-bold tracking-widest text-xs uppercase" translate="no">Ecossistema Memoo</span>
              <h2 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-surface-heading">Descobre o Extraordinário</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Explore a nossa curadoria de produtos físicos e digitais desenhados para elevar o teu potencial criativo e profissional.
              </p>
              <button 
                onClick={() => navigate('/marketplace')}
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dim transition-colors shadow-xl shadow-primary/20"
              >
                Explorar Marketplace
              </button>
            </div>
            
            <div className="relative z-10 lg:w-1/2 flex justify-center">
              <div className="relative w-64 h-80 book-tilt">
                 {featuredProduct?.image ? (
                   <img 
                    src={featuredProduct.image} 
                    alt="Featured" 
                    className="w-full h-full object-cover rounded-2xl shadow-2xl border border-border"
                  />
                 ) : (
                   <div className="w-full h-full bg-surface-container-low rounded-2xl flex items-center justify-center border border-border">
                     <Package size={48} className="text-primary opacity-20" />
                   </div>
                 )}
              </div>
            </div>
          </motion.div>
        </section>

        <DiscoverySection 
          title="Produtos Físicos" 
          subtitle={<span translate="no">Leve a experiência Memoo para o seu mundo real</span>}
          icon={<Package size={28} fill="currentColor" />}
          products={physicalProducts}
          viewAllPath="/fisico"
        />
      </div>

      <Benefits />
      <div className="px-6 lg:px-12 max-w-7xl mx-auto py-12">
        <AdSpace placement="bottom" page="home" />
      </div>
      <Newsletter />

      <AnimatePresence>
        {showExitPopup && exitAd && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitPopup(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-[2.5rem] border border-white/10 shadow-2xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setShowExitPopup(false)}
                className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                  <Megaphone size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Espera! Temos algo para ti</h3>
                  <p className="text-on-surface-variant mt-2">Visita o nosso parceiro ou aproveita esta oferta exclusiva antes de ires.</p>
                </div>
                
                <div className="rounded-2xl overflow-hidden border border-white/5">
                  <AdSpace placement="popup" page="home" />
                </div>

                <button 
                  onClick={() => setShowExitPopup(false)}
                  className="w-full py-4 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  Continuar a navegar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
