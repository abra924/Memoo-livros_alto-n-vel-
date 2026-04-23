import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Flame, Zap, Brain, DollarSign, Filter, ChevronDown, BookMarked, History, Sparkles, Sword, Heart, Ghost, Activity, Compass, Users as UsersIcon, Briefcase, PenTool, Utensils, Plane, Microscope } from 'lucide-react';
import DiscoverySection from '../components/DiscoverySection';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { cn, formatPrice } from '../lib/utils';

const categories = [
  { id: 'all', label: 'Todos', icon: <BookOpen size={14} /> },
  { id: 'fantasia-epica', label: 'Fantasia', icon: <Sword size={14} /> },
  { id: 'ficcao-historica', label: 'História', icon: <History size={14} /> },
  { id: 'realismo-magico', label: 'Místico', icon: <Sparkles size={14} /> },
  { id: 'ficcao-resistencia', label: 'Resistência', icon: <BookMarked size={14} /> },
  { id: 'romance-drama', label: 'Romance', icon: <Heart size={14} /> },
  { id: 'misterio-suspense', label: 'Suspense', icon: <Ghost size={14} /> },
  { id: 'saude-bem-estar', label: 'Saúde', icon: <Activity size={14} /> },
  { id: 'autoajuda-espiritualidade', label: 'Espiritual', icon: <Compass size={14} /> },
  { id: 'biografia-memorias', label: 'Biografias', icon: <UsersIcon size={14} /> },
  { id: 'negocios-empreendedorismo', label: 'Negócios', icon: <Briefcase size={14} /> },
  { id: 'poesia-antologias', label: 'Poesia', icon: <PenTool size={14} /> },
  { id: 'culinaria-nutricao', label: 'Culinária', icon: <Utensils size={14} /> },
  { id: 'viagens-aventura', label: 'Viagens', icon: <Plane size={14} /> },
  { id: 'ciencia-filosofia', label: 'Ciência', icon: <Microscope size={14} /> },
  { id: 'produtividade', label: 'Foco', icon: <Zap size={14} /> },
  { id: 'financas', label: 'Finanças', icon: <DollarSign size={14} /> },
  { id: 'psicologia', label: 'Mente', icon: <Brain size={14} /> },
  { id: 'tecnologia', label: 'Tech', icon: <Sparkles size={14} /> },
];

export default function BooksPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'ebook')
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

    // Subscribe to changes
    const channel = supabase
      .channel('books-updates')
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
                         p.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingBooks = filteredProducts.slice(0, 8);
  const booksByCategory = (catId: string) => filteredProducts.filter(p => p.category === catId);

  return (
    <div className="pb-24">
      {/* Page Header */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12 text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest"
        >
          <BookOpen size={18} />
          Universo de Livros (Ebooks)
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-headline font-black text-primary"
          >
            Explore a nossa <span className="text-secondary">Curadoria</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg max-w-2xl mx-auto font-medium"
          >
            Milhares de ebooks de 21 categorias diferentes para transformar a sua mente.
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
              placeholder="Procure por título, autor ou tema..." 
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
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest animate-pulse">A carregar biblioteca...</p>
        </div>
      ) : (
        <div className="space-y-24">
          {activeCategory === 'all' ? (
            <>
              {trendingBooks.length > 0 && (
                <DiscoverySection 
                  title="Recentemente Adicionados" 
                  subtitle="As últimas novidades do nosso catálogo"
                  icon={<Flame size={28} className="text-primary" fill="currentColor" />}
                  products={trendingBooks}
                />
              )}
              
              {/* Show some specific categories even in "All" view */}
              {booksByCategory('fantasia-epica').length > 0 && (
                <DiscoverySection 
                  title="Épicos e Fantasia" 
                  subtitle="Histórias que transcendem o tempo"
                  icon={<Sparkles size={28} className="text-secondary" fill="currentColor" />}
                  products={booksByCategory('fantasia-epica').slice(0, 4)}
                />
              )}

              {booksByCategory('negocios-empreendedorismo').length > 0 && (
                <DiscoverySection 
                  title="Negócios" 
                  subtitle="Estratégias para o próximo nível"
                  icon={<Briefcase size={28} className="text-primary" fill="currentColor" />}
                  products={booksByCategory('negocios-empreendedorismo').slice(0, 4)}
                />
              )}
            </>
          ) : (
            <div className="px-6 lg:px-12 max-w-7xl mx-auto">
              <DiscoverySection 
                title={categories.find(c => c.id === activeCategory)?.label || 'Resultados'} 
                subtitle={`Explorando a categoria ${categories.find(c => c.id === activeCategory)?.label}`}
                icon={categories.find(c => c.id === activeCategory)?.icon}
                products={filteredProducts}
              />
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <div className="text-6xl opacity-20 text-on-surface-variant">📚</div>
              <p className="text-on-surface-variant text-xl font-bold italic">
                {activeCategory === 'all' 
                  ? "Nenhum livro disponível neste momento." 
                  : `Ainda não temos livros na categoria ${categories.find(c => c.id === activeCategory)?.label}.`}
              </p>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-primary font-bold hover:underline"
              >
                Ver todos os livros
              </button>
            </div>
          )}
        </div>
      )}

      <Newsletter />
    </div>
  );
}
