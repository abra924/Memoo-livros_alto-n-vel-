import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Film, Search, Flame, Play, Sparkles, Sword, Heart, Ghost, Compass, Stars, Clapperboard, Tv } from 'lucide-react';
import DiscoverySection from '../components/DiscoverySection';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { cn, formatPrice } from '../lib/utils';

const categories = [
  { id: 'all', label: 'Todos os Filmes', icon: <Film size={14} /> },
  { id: 'animacao-2d', label: 'Animação 2D', icon: <Stars size={14} /> },
  { id: 'animacao-3d', label: 'Animação 3D', icon: <Sparkles size={14} /> },
  { id: 'aventura', label: 'Aventura', icon: <Sword size={14} /> },
  { id: 'fantasia', label: 'Fantasia', icon: <Compass size={14} /> },
  { id: 'drama', label: 'Drama', icon: <Heart size={14} /> },
  { id: 'suspense', label: 'Suspense', icon: <Ghost size={14} /> },
  { id: 'curta-metragem', label: 'Curtas', icon: <Tv size={14} /> },
  { id: 'ficcao', label: 'Ficção', icon: <Clapperboard size={14} /> },
];

export default function VideosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'video')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const items = data.map(item => ({ 
          ...item,
          image: item.cover_url,
          price: formatPrice(item.price, item.currency),
          badge: item.category,
          path: `/produto/${item.id}`
        }));
        setProducts(items);
      }
      setLoading(false);
    };

    fetchProducts();

    const channel = supabase
      .channel('videos-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.author?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingVideos = filteredProducts.slice(0, 8);

  return (
    <div className="pb-24">
      {/* Page Header */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12 text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold uppercase tracking-widest"
        >
          <Play size={18} fill="currentColor" />
          Filmes Animados Memoo
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-headline font-black text-primary"
          >
            Histórias Ganham <span className="text-secondary">Vida</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg max-w-2xl mx-auto font-medium"
          >
            Assista aos nossos filmes animados originais baseados nos livros e histórias que você ama.
          </motion.p>
        </div>
        
        {/* Search & Categories Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Procure por um filme..." 
              className="w-full bg-surface-container-high px-14 py-5 rounded-3xl border border-border focus:outline-none focus:border-secondary transition-all text-on-surface text-lg shadow-2xl shadow-shadow"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={24} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto px-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  activeCategory === cat.id 
                    ? "bg-secondary text-surface border-secondary shadow-lg shadow-secondary/20" 
                    : "bg-surface-container-high text-on-surface-variant border-border hover:border-secondary/20 hover:bg-surface-container-highest"
                )}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest animate-pulse">A carregar cinema...</p>
        </div>
      ) : (
        <div className="space-y-24">
          {activeCategory === 'all' ? (
            <>
              {trendingVideos.length > 0 && (
                <DiscoverySection 
                  title="Estreias e Destaques" 
                  subtitle="Os filmes animados que estão a marcar esta temporada"
                  icon={<Film size={28} className="text-secondary" fill="currentColor" />}
                  products={trendingVideos}
                />
              )}
            </>
          ) : (
            <div className="px-6 lg:px-12 max-w-7xl mx-auto">
              <DiscoverySection 
                title={categories.find(c => c.id === activeCategory)?.label || 'Resultados'} 
                subtitle={`Explorando filmes de ${categories.find(c => c.id === activeCategory)?.label}`}
                icon={categories.find(c => c.id === activeCategory)?.icon}
                products={filteredProducts}
              />
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <div className="text-6xl opacity-20 text-on-surface-variant">🎬</div>
              <p className="text-on-surface-variant text-xl font-bold italic">
                {activeCategory === 'all' 
                  ? "Ainda não temos filmes carregados." 
                  : `Em breve teremos filmes na categoria ${categories.find(c => c.id === activeCategory)?.label}.`}
              </p>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-secondary font-bold hover:underline"
              >
                Ver todos os filmes
              </button>
            </div>
          )}
        </div>
      )}

      <Newsletter />
    </div>
  );
}
