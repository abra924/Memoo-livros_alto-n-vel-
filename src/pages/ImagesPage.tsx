import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Search, Camera, Palette, Grid, Box, Sparkles, Film, Monitor, Layers, Shapes, Laptop, PenTool } from 'lucide-react';
import DiscoverySection from '../components/DiscoverySection';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { cn, formatPrice } from '../lib/utils';

const categories = [
  { id: 'all', label: 'Tudo', icon: <Grid size={14} /> },
  { id: 'imagens-3d', label: 'Imagens 3D', icon: <Box size={14} /> },
  { id: 'estilo-pixar', label: 'Estilo Pixar', icon: <Sparkles size={14} /> },
  { id: 'fotos-realistas', label: 'Fotos Realistas', icon: <Camera size={14} /> },
  { id: 'cinematografica', label: 'Cinematográfica', icon: <Film size={14} /> },
  { id: 'ultra-realista-4k', label: 'Ultra Realista 4K', icon: <Monitor size={14} /> },
  { id: 'ilustracoes-digitais', label: 'Ilustrações', icon: <Palette size={14} /> },
  { id: 'texturas-patterns', label: 'Texturas', icon: <Layers size={14} /> },
  { id: 'vetores', label: 'Vetores (SVG)', icon: <Shapes size={14} /> },
  { id: 'mockups', label: 'Mockups', icon: <Laptop size={14} /> },
  { id: 'design-grafico', label: 'Design Gráfico', icon: <PenTool size={14} /> },
];

export default function ImagesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('type.eq.image,category.eq.imagens')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const items = data.map(item => ({
          ...item,
          image: item.cover_url,
          price: formatPrice(item.price, item.currency),
          badge: 'Imagens',
          path: `/produto/${item.id}`
        }));
        setProducts(items);
      }
      setLoading(false);
    };

    fetchProducts();

    // Real-time listener
    const channel = supabase
      .channel('images-changes')
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
          <ImageIcon size={18} />
          Imagens & Assets
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-6xl font-headline font-extrabold text-white"
        >
          Impacto <span className="text-secondary">Visual</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-on-surface-variant text-lg max-w-2xl mx-auto"
        >
          Fotografias, ilustrações e recursos visuais de alta resolução para os seus projetos.
        </motion.p>
        
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
              placeholder="Procure por título ou criador..." 
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
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest animate-pulse">A carregar galeria...</p>
        </div>
      ) : (
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <DiscoverySection 
            title={activeCategory === 'all' ? "Galeria de Assets" : categories.find(c => c.id === activeCategory)?.label} 
            subtitle={activeCategory === 'all' ? "Recursos visuais prontos para usar" : `Explorando ${categories.find(c => c.id === activeCategory)?.label}`}
            icon={activeCategory === 'all' ? <Palette size={28} className="text-secondary" fill="currentColor" /> : categories.find(c => c.id === activeCategory)?.icon}
            products={filteredProducts}
          />

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <div className="text-6xl opacity-20">🖼️</div>
              <p className="text-on-surface-variant text-xl font-bold italic">
                Ainda não temos imagens nesta categoria.
              </p>
            </div>
          )}
        </div>
      )}

      <Newsletter />
    </div>
  );
}
