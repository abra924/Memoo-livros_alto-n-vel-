import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Music, Search, Disc, Play, Volume2, Mic2, Guitar, Radio, Star, Heart, Flame, Headphones, Zap } from 'lucide-react';
import DiscoverySection from '../components/DiscoverySection';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { cn, formatPrice } from '../lib/utils';

const musicCategories = [
  { id: 'all', label: 'Tudo', icon: <Disc size={14} /> },
  { id: 'gospel', label: 'Gospel', icon: <Mic2 size={14} /> },
  { id: 'kizomba', label: 'Kizomba', icon: <Heart size={14} /> },
  { id: 'semba', label: 'Semba', icon: <Guitar size={14} /> },
  { id: 'afro-beat', label: 'Afro Beat', icon: <Zap size={14} /> },
  { id: 'kuduro', label: 'Kuduro', icon: <Flame size={14} /> },
  { id: 'amapiano', label: 'Amapiano', icon: <Radio size={14} /> },
  { id: 'hiphop', label: 'Hip Hop', icon: <Disc size={14} /> },
  { id: 'drill', label: 'Drill', icon: <Zap size={14} /> },
  { id: 'romantica', label: 'Romântica', icon: <Heart size={14} /> },
  { id: 'r-b', label: 'R&B', icon: <Star size={14} /> },
  { id: 'tchianda', label: 'Tchianda', icon: <Music size={14} /> },
  { id: 'zouk', label: 'Zouk', icon: <Headphones size={14} /> },
  { id: 'sertanejo', label: 'Sertanejo', icon: <Guitar size={14} /> },
  { id: 'afro-house', label: 'Afro House', icon: <Volume2 size={14} /> },
  { id: 'musica-tradicional-angolana', label: 'Tradic. Angolana', icon: <Music size={14} /> },
  { id: 'jazz', label: 'Jazz', icon: <Mic2 size={14} /> },
  { id: 'soul', label: 'Soul', icon: <Heart size={14} /> },
  { id: 'pop', label: 'Pop', icon: <Star size={14} /> },
  { id: 'k-pop', label: 'K-Pop', icon: <Zap size={14} /> },
];

export default function MusicPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      // Procurar tanto por categoria 'musica' quanto pelo tipo 'music' para garantir compatibilidade
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'music')
        .not('category', 'eq', 'audiobook')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const items = data.map(item => ({
          ...item,
          image: item.cover_url,
          price: formatPrice(item.price, item.currency),
          badge: item.category === 'musica' ? 'Música' : item.category,
          path: `/produto/${item.id}`
        }));
        setProducts(items);
      }
      setLoading(false);
    };

    fetchProducts();

    // Real-time listener
    const channel = supabase
      .channel('music-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24">
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12 text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest"
        >
          <Music size={18} />
          Música & Vibrações
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-headline font-black text-on-surface"
          >
            Sinta o <span className="text-primary">Ritmo</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg max-w-2xl mx-auto font-medium"
          >
            Explore batidas exclusivas, sucessos do momento e músicas tradicionais cuidadosamente selecionadas.
          </motion.p>
        </div>
        
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
              placeholder="Procure por música, artista ou gênero..." 
              className="w-full bg-surface-container-high px-14 py-5 rounded-3xl border border-border focus:outline-none focus:border-primary transition-all text-on-surface text-lg shadow-2xl shadow-shadow"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={24} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-6xl mx-auto px-4">
            {musicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                  activeCategory === cat.id 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-surface-container-high text-on-surface-variant border-border hover:border-primary/20 hover:bg-surface-container-highest"
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest animate-pulse">A sintonizar...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredProducts.length > 0 ? (
            <DiscoverySection 
              title={activeCategory === 'all' ? 'Destaques Musicais' : musicCategories.find(c => c.id === activeCategory)?.label || 'Resultados'} 
              subtitle={activeCategory === 'all' ? 'O som que você precisa está aqui' : `Explorando o melhor do ${activeCategory}`}
              icon={<Disc size={28} className="text-primary" fill="currentColor" />}
              products={filteredProducts}
              viewAllPath="/musica"
            />
          ) : (
            <div className="text-center py-24 space-y-4">
              <div className="text-6xl opacity-20 text-on-surface-variant">🎵</div>
              <p className="text-on-surface-variant text-xl font-bold italic">
                {activeCategory === 'all' 
                  ? "Nenhuma música disponível neste momento." 
                  : `Ainda não temos músicas na categoria ${musicCategories.find(c => c.id === activeCategory)?.label}.`}
              </p>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-primary font-bold hover:underline"
              >
                Ver todas as músicas
              </button>
            </div>
          )}
        </div>
      )}

      <Newsletter />
    </div>
  );
}
