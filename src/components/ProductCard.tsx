import { motion, AnimatePresence } from 'motion/react';
import { Plus, Eye, Heart } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  badge?: string;
  badgeType?: 'popular' | 'new' | 'recommended';
  path?: string;
}

export default function ProductCard({ id, title, price, image, badge, badgeType, path = "/livros" }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('product_id', id)
        .single();
      
      if (data) setIsWishlisted(true);
    };
    checkWishlist();
  }, [id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert("Inicie sessão para guardar nos favoritos.");
      return;
    }

    setIsWishlisting(true);
    try {
      if (isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', session.user.id)
          .eq('product_id', id);
        setIsWishlisted(false);
      } else {
        await supabase
          .from('wishlist')
          .insert({
            user_id: session.user.id,
            product_id: id
          });
        setIsWishlisted(true);

        // Notificar Admin
        const { data: adminProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', 'abraaomatondo118@gmail.com')
          .single();
        
        if (adminProfile) {
          await supabase.from('notifications').insert({
            user_id: adminProfile.id,
            title: "Interesse de Compra! ❤️",
            message: `O utilizador ${session.user.email} guardou "${title}" nos favoritos para pagar depois.`,
            is_read: false
          });
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setIsWishlisting(false);
    }
  };
  const badgeColors = {
    popular: "bg-secondary text-white",
    new: "bg-primary text-white",
    recommended: "bg-tertiary text-white"
  };

  return (
    <Link to={path}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="flex-none w-64 group snap-start cursor-pointer"
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-surface-container transition-all group-hover:shadow-[0_0_40px_rgba(149,170,255,0.15)]">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {badge && (
            <div className={cn(
              "absolute top-3 left-3 text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider shadow-lg",
              badgeType ? badgeColors[badgeType] : "bg-on-surface text-surface"
            )}>
              {badge}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleWishlist}
            disabled={isWishlisting}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md",
              isWishlisted 
                ? "bg-secondary text-white" 
                : "bg-surface/50 text-white hover:bg-white hover:text-secondary"
            )}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.button>
          
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
            <div className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Eye size={16} />
              Espreitar
            </div>
          </div>
        </div>
        
        <h3 className="font-bold text-on-surface-heading text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex justify-between items-center">
          <p className="text-primary font-bold">{price}</p>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-secondary hover:text-white transition-colors flex items-center justify-center text-on-surface"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}
