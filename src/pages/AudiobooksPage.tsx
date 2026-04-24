import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Headphones, Zap, Clock, Mic2, MessageSquare, Users, Ghost, History, Brain, Briefcase, GraduationCap, Star, Sparkles } from 'lucide-react';
import AdSpace from '../components/AdSpace';
import DiscoverySection from '../components/DiscoverySection';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { cn, formatPrice } from '../lib/utils';

const categories = [
  { id: 'all', label: 'Tudo', icon: <Headphones size={14} /> },
  { id: 'audiobook', label: 'Audiobooks', icon: <BookOpen size={14} /> },
  { id: 'podcast', label: 'Podcasts', icon: <Mic2 size={14} /> },
  { id: 'ficcao', label: 'Ficção', icon: <Ghost size={14} /> },
  { id: 'debate', label: 'Debates', icon: <MessageSquare size={14} /> },
  { id: 'entrevista', label: 'Entrevistas', icon: <Users size={14} /> },
  { id: 'historias-ficticias', label: 'Histórias Fictícias', icon: <Sparkles size={14} /> },
  { id: 'historias-reais', label: 'Histórias Reais', icon: <History size={14} /> },
  { id: 'psicologia', label: 'Psicologia', icon: <Brain size={14} /> },
  { id: 'negocios', label: 'Negócios', icon: <Briefcase size={14} /> },
  { id: 'educacao', label: 'Educação', icon: <GraduationCap size={14} /> },
  { id: 'autoajuda', label: 'Autoajuda', icon: <Star size={14} /> },
];

export default function AudiobooksPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('type.eq.audiobook,category.eq.audiobook')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const items = data.map(item => ({
          ...item,
          image: item.cover_url,
          price: formatPrice(item.price, item.currency),
          badge: 'Audiobook',
          path: `/produto/${item.id}`
        }));
        setProducts(items);
      }
      setLoading(false);
    };

    fetchProducts();

    // Real-time listener
    const channel = supabase
      .channel('audiobooks-changes')
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
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12 text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold uppercase tracking-widest"
        >
          <Headphones size={18} />
          Audio Books
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-6xl font-headline font-extrabold text-white"
        >
          Conhecimento para <span className="text-secondary">Ouvir</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-on-surface-variant text-lg max-w-2xl mx-auto"
        >
          Aprenda enquanto caminha, viaja ou relaxa com a nossa seleção de audiobooks.
        </motion.p>
        <AdSpace placement="top" page="audiobooks" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="max-w-xl mx-auto relative group">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Procure por título ou autor..." 
              className="w-full bg-surface-container-high px-12 py-4 rounded-2xl border border-white/5 focus:outline-none focus:border-secondary transition-all text-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors" size={20} />
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
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          {filteredProducts.length > 0 ? (
            <DiscoverySection 
              title="Todos os Audio Books" 
              subtitle="Explore a nossa biblioteca sonora"
              icon={<Zap size={28} className="text-secondary" fill="currentColor" />}
              products={filteredProducts}
            />
          ) : (
            <div className="text-center py-24 text-on-surface-variant italic">
              Nenhum audiobook encontrado.
            </div>
          )}
        </div>
      )}

      <Newsletter />
    </div>
  );
}
