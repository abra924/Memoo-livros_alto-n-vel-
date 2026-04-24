import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Music, Layout as LayoutIcon, Image as ImageIcon, BookOpen } from 'lucide-react';
import AdSpace from '../components/AdSpace';
import DiscoverySection from '../components/DiscoverySection';
import Newsletter from '../components/Newsletter';
import { supabase } from '../supabase';
import { useLocation } from 'react-router-dom';
import { formatPrice } from '../lib/utils';

export default function DigitalProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('cat');

  const fetchProducts = async () => {
    let query = supabase
      .from('products')
      .select('*')
      .neq('type', 'ebook'); // Get all digital products except ebooks

    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

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

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('digital-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categoryFilter]);

  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category === categoryFilter)
    : products;

  const musicItems = filteredProducts.filter(p => p.category === 'musica' || p.type === 'music');
  const audiobookItems = filteredProducts.filter(p => p.category === 'audiobook');
  const imageItems = filteredProducts.filter(p => p.category === 'imagens' || p.type === 'image');
  const otherItems = filteredProducts.filter(p => !['musica', 'audiobook', 'imagens'].includes(p.category) && p.type !== 'music' && p.type !== 'image');

  return (
    <div className="pb-24">
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12 text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold uppercase tracking-widest"
        >
          <LayoutIcon size={18} />
          {categoryFilter ? `Categoria: ${categoryFilter}` : 'Produtos Digitais'}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-6xl font-headline font-extrabold text-white"
        >
          Eleve a sua <span className="text-secondary">Criatividade</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-on-surface-variant text-lg max-w-2xl mx-auto"
        >
          Templates, músicas e imagens de alta qualidade para os seus projetos digitais.
        </motion.p>
        <AdSpace placement="top" page="digital" />
      </section>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          {musicItems.length > 0 && (
            <DiscoverySection 
              title="Música" 
              subtitle="Beats e texturas sonoras para os seus conteúdos"
              icon={<Music size={28} fill="currentColor" />}
              products={musicItems}
            />
          )}
          
          {audiobookItems.length > 0 && (
            <DiscoverySection 
              title="Audio Books" 
              subtitle="Conhecimento para ouvir em qualquer lugar"
              icon={<BookOpen size={28} fill="currentColor" />}
              products={audiobookItems}
            />
          )}

          {imageItems.length > 0 && (
            <DiscoverySection 
              title="Imagens & Texturas" 
              subtitle="Recursos visuais impressionantes para qualquer projeto"
              icon={<ImageIcon size={28} fill="currentColor" />}
              products={imageItems}
            />
          )}

          {otherItems.length > 0 && !categoryFilter && (
            <DiscoverySection 
              title="Outros Digitais" 
              subtitle="Templates e recursos variados"
              icon={<LayoutIcon size={28} fill="currentColor" />}
              products={otherItems}
            />
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 text-on-surface-variant italic">
              Nenhum produto encontrado nesta categoria.
            </div>
          )}
        </div>
      )}

      <Newsletter />
    </div>
  );
}
