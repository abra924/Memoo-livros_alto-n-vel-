import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flame, Music, Package } from 'lucide-react';
import Hero from '../components/Hero';
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

    fetchProducts();
  }, []);

  return (
    <>
      <Hero />
      
      <div className="space-y-12">
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
      <Newsletter />
    </>
  );
}
