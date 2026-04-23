import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Camera, Save, Loader2, AlertCircle, CheckCircle2, BookOpen, Download, ShoppingBag, Heart, Trash2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'library' | 'wishlist' | 'affiliate'>('profile');
  const [library, setLibrary] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inviteLink = user ? `${window.location.origin}/?ref=${user.id}` : '';

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    const initProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user ?? null;
      setUser(u);

      if (u) {
        // Fetch profile
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', u.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            if (profileError.code === '42P01') {
              setMessage({ type: 'error', text: 'A tabela "profiles" não está configurada no Supabase. Consulta o ficheiro SUPABASE_SETUP.md.' });
            }
            console.error('Erro ao carregar perfil:', profileError);
          }

          if (profile) {
            setDisplayName(profile.display_name || '');
            setPhotoURL(profile.photo_url || '');
          } else if (!profileError || profileError.code === 'PGRST116') {
            // Create profile if it doesn't exist
            await supabase.from('profiles').insert({
              id: u.id,
              email: u.email,
              display_name: u.user_metadata?.full_name || '',
              photo_url: u.user_metadata?.avatar_url || ''
            });
          }
        } catch (err) {
          console.error('Falha crítica ao inicializar perfil:', err);
        }

        // Fetch library with product details
        const fetchLibrary = async () => {
          const { data, error } = await supabase
            .from('library')
            .select(`
              *,
              products (*)
            `)
            .eq('user_id', u.id)
            .order('purchased_at', { ascending: false });
          
          if (!error && data) {
            setLibrary(data.map(item => ({
              id: item.id,
              purchasedAt: item.purchased_at,
              productId: item.products.id,
              title: item.products.title,
              coverUrl: item.products.cover_url,
              fileUrl: item.products.file_url
            })));
          }
        };

        fetchLibrary();

        // Fetch wishlist
        const fetchWishlist = async () => {
          const { data, error } = await supabase
            .from('wishlist')
            .select(`
              *,
              products (*)
            `)
            .eq('user_id', u.id)
            .order('added_at', { ascending: false });
          
          if (!error && data) {
            setWishlist(data.map(item => ({
              id: item.id,
              addedAt: item.added_at,
              product: item.products
            })));
          }
        };

        fetchWishlist();

        // Fetch referrals
        const fetchReferrals = async () => {
          const { data, error } = await supabase
            .from('referrals')
            .select(`
              *,
              referred:referred_user_id (display_name, email, photo_url)
            `)
            .eq('referrer_id', u.id)
            .order('created_at', { ascending: false });
          
          if (!error && data) {
            setReferrals(data);
          }
        };

        fetchReferrals();

        // Real-time library listener
        const channel = supabase
          .channel(`library-${u.id}`)
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'library',
            filter: `user_id=eq.${u.id}`
          }, fetchLibrary)
          .subscribe();
        
        subscription = { unsubscribe: () => supabase.removeChannel(channel) };
      }
      setFetching(false);
    };

    initProfile();

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setLibrary([]);
      } else {
        initProfile();
      }
    });

    return () => {
      authSub.subscription.unsubscribe();
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter menos de 2MB.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);

      setPhotoURL(publicUrl);
      setMessage({ type: 'success', text: 'Foto carregada! A atualizar perfil...' });
      
      // Auto-save after upload
      const { error: saveError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          photo_url: publicUrl,
          updated_at: new Date().toISOString()
        });
      
      if (saveError) throw saveError;
      setMessage({ type: 'success', text: 'Foto de perfil atualizada com sucesso!' });
    } catch (error: any) {
      console.error('Erro Upload Avatar:', error);
      setMessage({ type: 'error', text: `Erro ao carregar imagem: ${error.message || 'Verifica as permissões do bucket "content".'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          photo_url: photoURL,
          updated_at: new Date().toISOString()
        });

      if (error) {
        if (error.code === '42P01') {
          throw new Error('A tabela "profiles" não existe. Contacta o suporte ou cria a tabela no Supabase.');
        }
        throw error;
      }
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error: any) {
      console.error('Erro Supabase Profile:', error);
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar perfil. Verifica se a tabela "profiles" tem RLS configurado.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="text-error mb-4" size={48} />
        <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">Acesso Negado</h1>
        <p className="text-on-surface-variant">Por favor, inicie sessão para ver o seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface">A Tua Conta</h1>
          
          <div className="flex items-center justify-center gap-2 p-1 bg-surface-container-high rounded-2xl w-fit mx-auto">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Perfil
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'wishlist' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Favoritos
            </button>
            <button 
              onClick={() => setActiveTab('library')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Minha Biblioteca
            </button>
            <button 
              onClick={() => setActiveTab('affiliate')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'affiliate' ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Afiliados 🤝
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <div className="bg-surface-container-low rounded-[2rem] p-8 border border-white/5 space-y-8 max-w-2xl mx-auto">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-surface-container-high flex items-center justify-center shadow-2xl">
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon size={48} className="text-on-surface-variant" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dim transition-colors group-hover:scale-110"
                >
                  <Camera size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file);
                  }} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <p className="text-xs text-on-surface-variant">JPG, PNG ou GIF. Máx 1MB.</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface ml-1">Nome de Exibição</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Como queres ser chamado?"
                  className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface ml-1">Email (Não editável)</label>
                <input 
                  type="email" 
                  value={user.email || ''} 
                  disabled
                  className="w-full bg-surface-container-high/50 border border-white/5 rounded-2xl px-6 py-4 text-on-surface-variant cursor-not-allowed"
                />
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`flex items-center gap-3 p-4 rounded-2xl ${message.type === 'success' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-error/10 text-error border border-error/20'}`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span className="text-sm font-medium">{message.text}</span>
                </motion.div>
              )}

              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Guardar Alterações
              </button>

              <button 
                onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
                className="w-full py-4 text-on-surface-variant hover:text-error transition-colors font-bold text-sm"
              >
                Terminar Sessão
              </button>
            </div>
          </div>
        ) : activeTab === 'affiliate' ? (
          <div className="space-y-8">
            <div className="bg-surface-container-low rounded-[2rem] p-8 border border-white/5 space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-2xl font-headline font-bold text-on-surface">O Teu Link de Convite</h2>
                  <p className="text-on-surface-variant text-sm max-w-sm">Partilha este link com os teus amigos. Se um deles comprar um produto, recebes um cupão de 10% de desconto!</p>
                </div>
                <div className="w-full md:w-auto p-4 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">🤝 10% Recompensa</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface-container-high rounded-2xl border border-white/10 items-center">
                <input 
                  type="text" 
                  readOnly
                  value={inviteLink}
                  className="flex-1 bg-transparent border-none text-on-surface-variant text-sm outline-none px-4 select-all font-mono"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    alert("Link copiado com sucesso!");
                  }}
                  className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm tracking-widest hover:bg-primary-dim transition-all"
                >
                  Copia Link
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'WhatsApp', icon: '📱', color: 'bg-green-500/10 text-green-500', link: `https://wa.me/?text=${encodeURIComponent(`Entra no MemooLivros e descobre os melhores conteúdos digitais! 😉 ${inviteLink}`)}` },
                  { name: 'Facebook', icon: '🔵', color: 'bg-blue-600/10 text-blue-600', link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}` },
                  { name: 'X (Twitter)', icon: '✖️', color: 'bg-white/5 text-white', link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('A aprender e a crescer no MemooLivros!')}` },
                  { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700/10 text-blue-700', link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}` }
                ].map((social) => (
                  <a 
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-105 transition-all text-xs font-bold", social.color)}
                  >
                    <span className="text-2xl">{social.icon}</span>
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                O Teu Exército ({referrals.length})
              </h3>

              {referrals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {referrals.map((ref) => (
                    <div key={ref.id} className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                          {ref.referred?.photo_url ? (
                            <img src={ref.referred.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (ref.referred?.display_name || ref.referred?.email || '?')[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{ref.referred?.display_name || 'Amigo'}</p>
                          <p className="text-[10px] text-on-surface-variant italic">Convidado em {new Date(ref.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        ref.status === 'completed' ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-white/5 text-on-surface-variant border border-white/10"
                      )}>
                        {ref.status === 'completed' ? 'Recompensado' : 'Aguardando Compra'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center bg-surface-container-low rounded-[2.5rem] border border-dashed border-white/10 space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
                    <UserIcon size={32} />
                  </div>
                  <p className="text-sm text-on-surface-variant italic px-12">Ainda não trouxeste ninguém para o exército. Começa a partilhar e ganha prémios!</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'wishlist' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl font-headline font-bold text-on-surface">Os Teus Favoritos</h2>
                <p className="text-on-surface-variant text-sm">Produtos que guardaste para ver mais tarde.</p>
              </div>
            </div>

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface-container-low rounded-[2rem] p-4 border border-white/5 group hover:border-secondary/30 transition-all flex flex-col gap-4 shadow-xl"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-high">
                      <img 
                        src={item.product?.cover_url} 
                        alt={item.product?.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        onClick={async () => {
                          const { error } = await supabase.from('wishlist').delete().eq('id', item.id);
                          if (!error) setWishlist(prev => prev.filter(i => i.id !== item.id));
                        }}
                        className="absolute top-2 right-2 p-2 rounded-xl bg-black/60 text-white hover:text-error transition-colors backdrop-blur-sm shadow-lg active:scale-95"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold text-on-surface line-clamp-1">{item.product?.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{item.product?.author}</p>
                    </div>

                    <Link 
                      to={`/produto/${item.product?.id}`}
                      className="w-full py-4 bg-surface-container-high text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-95"
                    >
                      Ver Detalhes
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface-container-low rounded-[2.5rem] border border-dashed border-white/10 space-y-4">
                <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto text-on-surface-variant/20">
                  <Heart size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-on-surface-variant font-bold">A tua lista está vazia.</p>
                  <p className="text-on-surface-variant/60 text-sm">Explora o marketplace e guarda o que mais gostares!</p>
                </div>
                <Link to="/" className="inline-flex items-center gap-2 text-primary font-black hover:underline mt-4">
                  Explorar Marketplace <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {library.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {library.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface-container-low p-6 rounded-[2rem] border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start group"
                  >
                    <div className="w-24 h-32 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-lg">
                      <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-on-surface-variant">Adquirido em {new Date(item.purchasedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a 
                          href={item.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-secondary text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-secondary-dim transition-all active:scale-95"
                        >
                          <Download size={14} />
                          Download
                        </a>
                        <button 
                          onClick={() => navigate(`/produto/${item.productId}`)}
                          className="p-3 bg-white/5 text-on-surface rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
                          title="Ver Página"
                        >
                          <BookOpen size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-surface-container-low rounded-[3rem] border border-dashed border-white/10 space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
                  <ShoppingBag size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-on-surface">A tua biblioteca está vazia</h3>
                  <p className="text-on-surface-variant max-w-xs mx-auto">Ainda não adquiriste nenhum conteúdo. Explora o nosso marketplace!</p>
                </div>
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dim transition-all shadow-lg shadow-primary/20"
                >
                  Ir para o Marketplace
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
