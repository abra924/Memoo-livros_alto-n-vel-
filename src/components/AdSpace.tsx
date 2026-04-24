import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ExternalLink, Megaphone, Zap } from 'lucide-react';

interface AdSpaceProps {
  placement: 'sidebar' | 'top' | 'bottom' | 'popup';
  page?: 'home' | 'books' | 'music' | 'digital' | 'audiobooks' | 'product';
}

export default function AdSpace({ placement, page }: AdSpaceProps) {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        let query = supabase
          .from('ads')
          .select('*')
          .eq('placement', placement)
          .eq('is_active', true);

        if (page) {
          query = query.or(`page_target.eq.all,page_target.eq.${page}`);
        }

        const { data, error } = await query;
        if (!error && data) setAds(data);
      } catch (err) {
        console.warn('Erro ao carregar anúncios:', err);
      }
    };
    fetchAds();
  }, [placement, page]);

  if (ads.length === 0) return null;

  return (
    <div className={`space-y-4 ${placement === 'sidebar' ? 'my-8' : 'my-4'}`}>
      {ads.map((ad) => (
        <div key={ad.id} className="w-full">
          {ad.type === 'adsense' ? (
            <div 
              className="ads-container flex justify-center bg-white/5 rounded-2xl p-2 overflow-hidden" 
              dangerouslySetInnerHTML={{ __html: ad.content }} 
            />
          ) : ad.type === 'banner' ? (
            <a 
              href={ad.link_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group relative overflow-hidden rounded-2xl border border-white/5 shadow-xl shadow-black/20"
            >
              <img 
                src={ad.content} 
                alt={ad.title} 
                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                  <ExternalLink size={14} />
                  Visitar Site
                </div>
              </div>
            </a>
          ) : (
            <a 
              href={ad.content}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-gradient-to-br from-surface-container-high to-surface-container-low rounded-2xl border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Zap size={16} />
                </div>
                <span className="text-xs font-bold text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">{ad.title}</span>
              </div>
              <ExternalLink size={14} className="text-on-surface-variant group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
