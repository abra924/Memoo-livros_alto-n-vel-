import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, BookOpen, Headphones, Music, Image as ImageIcon, Layout as LayoutIcon, Search, Sword, History, Sparkles, BookMarked, Heart, Ghost, Activity, Compass, Users as UsersIcon, Briefcase, PenTool, Utensils, Plane, Microscope, Zap, DollarSign, Brain, Film, MapPin, Camera, Box, Monitor } from 'lucide-react';
import DiscoverySection from '../components/DiscoverySection';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { cn, formatPrice } from '../lib/utils';

const topFilters = [
  { id: 'all', label: 'Marketplace', icon: <ShoppingBag size={14} /> },
  { id: 'lugares', label: 'Lugares', icon: <MapPin size={14} /> },
  { id: 'livros', label: 'Livros', icon: <BookOpen size={14} /> },
  { id: 'videos', label: 'Vídeos', icon: <Film size={14} /> },
];

const categories = [
  { id: 'all', label: 'Todos', icon: <ShoppingBag size={14} /> },
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
  { id: 'imagens-3d', label: '3D Assets', icon: <Box size={14} /> },
  { id: 'fotos-realistas', label: 'Fotografia', icon: <Camera size={14} /> },
  { id: 'cinematografica', label: 'Cinema', icon: <Film size={14} /> },
  { id: 'ultra-realista-4k', label: '4K Images', icon: <Monitor size={14} /> },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

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
        setProducts(items);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'livros') matchesTab = p.type === 'ebook';
    else if (activeTab === 'videos') matchesTab = p.type === 'video';
    else if (activeTab === 'lugares') matchesTab = p.category === 'lugares';

    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    
    return matchesSearch && matchesTab && matchesCategory;
  });

  const ebookItems = filteredProducts.filter(p => p.type === 'ebook');
  const audiobookItems = filteredProducts.filter(p => p.category === 'audiobook');
  const musicItems = filteredProducts.filter(p => p.category === 'musica' || p.type === 'music');
  const imageItems = filteredProducts.filter(p => p.category === 'imagens' || p.type === 'image');
  const videoItems = filteredProducts.filter(p => p.type === 'video');
  const otherItems = filteredProducts.filter(p => 
    !['ebook', 'video'].includes(p.type) && 
    !['musica', 'audiobook', 'imagens'].includes(p.category) &&
    p.type !== 'music' && p.type !== 'image'
  );

  return (
    <div className="pb-24">
      {/* Page Header */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12 text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest"
        >
          <ShoppingBag size={18} />
          Marketplace Memoo
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-headline font-black text-on-surface"
          >
            Tudo o que precisas num <span className="text-primary">só lugar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg max-w-2xl mx-auto font-medium"
          >
            Explore a nossa coleção completa através de 21 categorias especializadas.
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
              placeholder="Procure em todo o marketplace..." 
              className="w-full bg-surface-container-high px-14 py-5 rounded-3xl border border-border focus:outline-none focus:border-primary transition-all text-on-surface text-lg shadow-2xl shadow-shadow"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={24} />
          </div>

          {/* Top Level Filters */}
          <div className="flex justify-center gap-4 max-w-sm mx-auto p-1 bg-surface-container-high rounded-full border border-border overflow-hidden">
            {topFilters.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
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
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest animate-pulse">A carregar marketplace...</p>
        </div>
      ) : (
        <div className="space-y-20">
          {activeCategory === 'all' ? (
            <>
              {ebookItems.length > 0 && (
                <DiscoverySection 
                  title="Livros & Ebooks" 
                  subtitle="Conhecimento profundo em formato digital"
                  icon={<BookOpen size={28} className="text-primary" fill="currentColor" />}
                  products={ebookItems}
                  viewAllPath="/livros"
                />
              )}
              
              {audiobookItems.length > 0 && (
                <DiscoverySection 
                  title="Audio Books" 
                  subtitle="Aprenda a ouvir em qualquer lugar"
                  icon={<Headphones size={28} className="text-secondary" fill="currentColor" />}
                  products={audiobookItems}
                  viewAllPath="/audiobooks"
                />
              )}

              {musicItems.length > 0 && (
                <DiscoverySection 
                  title="Música & Beats" 
                  subtitle="O som perfeito para os teus projetos"
                  icon={<Music size={28} className="text-primary" fill="currentColor" />}
                  products={musicItems}
                  viewAllPath="/musica"
                />
              )}

              {imageItems.length > 0 && (
                <DiscoverySection 
                  title="Imagens & Assets" 
                  subtitle="Recursos visuais de alta qualidade"
                  icon={<ImageIcon size={28} className="text-secondary" fill="currentColor" />}
                  products={imageItems}
                  viewAllPath="/imagens"
                />
              )}

              {videoItems.length > 0 && (
                <DiscoverySection 
                  title="Filmes Animados" 
                  subtitle="As tuas histórias em movimento"
                  icon={<Film size={28} className="text-primary" fill="currentColor" />}
                  products={videoItems}
                  viewAllPath="/videos"
                />
              )}

              {otherItems.length > 0 && (
                <DiscoverySection 
                  title="Outros Recursos" 
                  subtitle="Templates e ferramentas digitais"
                  icon={<LayoutIcon size={28} className="text-primary" fill="currentColor" />}
                  products={otherItems}
                  viewAllPath="/digital"
                />
              )}
            </>
          ) : (
            <div className="px-6 lg:px-12 max-w-7xl mx-auto">
              <DiscoverySection 
                title={categories.find(c => c.id === activeCategory)?.label || 'Resultados'} 
                subtitle={`Explorando a categoria ${categories.find(c => c.id === activeCategory)?.label}`}
                icon={categories.find(c => c.id === activeCategory)?.icon || <ShoppingBag />}
                products={filteredProducts}
              />
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <div className="text-6xl opacity-20 text-on-surface-variant">🛍️</div>
              <p className="text-on-surface-variant text-xl font-bold italic">
                {activeCategory === 'all' 
                  ? "Nenhum produto disponível no marketplace." 
                  : `Ainda não temos produtos na categoria ${categories.find(c => c.id === activeCategory)?.label}.`}
              </p>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-primary font-bold hover:underline"
              >
                Ver todo o marketplace
              </button>
            </div>
          )}
        </div>
      )}

      <Newsletter />
    </div>
  );
}
