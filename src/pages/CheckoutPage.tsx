import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Tag, 
  AlertCircle,
  QrCode,
  Copy,
  ChevronLeft,
  Download,
  Plus,
  MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from '../supabase';

export default function CheckoutPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'whatsapp' | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const finalTotal = total - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .single();
      
    if (data && !error) {
      const discountVal = (total * data.discount) / 100;
      setDiscount(discountVal);
      setCouponStatus({ type: 'success', message: `Cupão de ${data.discount}% aplicado!` });
    } else {
      setCouponStatus({ type: 'error', message: 'Cupão inválido ou expirado.' });
      setDiscount(0);
    }
  };

  const copyIban = () => {
    // navigator.clipboard.writeText(ibanDetails.iban); // Removed
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-white mb-4">O teu carrinho está vazio</h1>
        <p className="text-on-surface-variant mb-8 max-w-sm">Parece que ainda não adicionaste nenhum tesouro digital ao teu carrinho.</p>
        <Link 
          to="/marketplace" 
          className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
        >
          Explorar Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate(-1)} className="p-3 bg-surface-container-high text-on-surface rounded-full hover:bg-surface-container-highest transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-4xl font-headline font-extrabold text-white tracking-tighter uppercase">Finalizar Compra</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-surface-container-low rounded-[2.5rem] border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-on-surface flex items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  Os Teus Itens ({cart.length})
                </h3>
              </div>
              
              <div className="divide-y divide-white/5">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6 items-center group">
                    <img src={item.coverUrl} alt={item.title} className="w-20 h-24 object-cover rounded-xl shadow-lg" />
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      <p className="text-primary font-black">{item.price > 0 ? `${item.price.toFixed(2)} ${item.currency}` : 'Grátis'}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Methods */}
            <section className="space-y-6">
              <h3 className="text-xl font-headline font-extrabold text-white px-2">Método de Pagamento</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 ${paymentMethod === 'paypal' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/5 hover:border-white/20'}`}
                >
                  <div className={`p-4 rounded-2xl ${paymentMethod === 'paypal' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <CreditCard size={32} />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-on-surface">PayPal / Cartão</span>
                    <span className="text-xs text-on-surface-variant">Acesso instantâneo</span>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 ${paymentMethod === 'whatsapp' ? 'bg-green-500/10 border-green-500 shadow-lg shadow-green-500/10' : 'bg-surface-container-low border-white/5 hover:border-white/20'}`}
                >
                  <div className={`p-4 rounded-2xl ${paymentMethod === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <MessageCircle size={32} />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-on-surface">WhatsApp / Multicaixa</span>
                    <span className="text-xs text-on-surface-variant">Pagamento em Angola</span>
                  </div>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === 'whatsapp' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-surface-container-low p-8 rounded-[2.5rem] border border-green-500/30 space-y-6 text-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl">
                        <MessageCircle size={32} fill="currentColor" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Pagamento via Express / IBAN</h4>
                        <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                          Se preferes pagar via transferência bancária ou Multicaixa Express, entra em contacto connosco agora.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-primary/10 rounded-[2rem] border border-primary/20">
                      <p className="text-sm text-on-surface leading-relaxed font-bold">
                        📞 Contacto WhatsApp: <span className="text-primary">+244 953 421 700</span>
                      </p>
                    </div>

                    <button 
                      onClick={async () => {
                        const { data: { session } } = await supabase.auth.getSession();
                        const refId = localStorage.getItem('memoo_referrer_id');
                        
                        // Record orders in DB for admin tracking
                        if (session?.user) {
                          for (const product of cart) {
                            await supabase.from('whatsapp_orders').insert({
                              user_id: session.user.id,
                              product_id: product.id,
                              status: 'pending',
                              referrer_id: refId || null
                            });
                          }
                        }

                        const message = `Olá! Gostaria de comprar os seguintes itens do meu carrinho: ${cart.map(i => i.title).join(', ')}. Total: ${finalTotal.toFixed(2)} AOA. (User ID: ${session?.user?.id || 'Visitante'})`;
                        const whatsappUrl = `https://wa.me/244953421700?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-3"
                    >
                      Abrir WhatsApp Agora
                    </button>
                    
                    <p className="text-[10px] text-on-surface-variant italic">
                      * O acesso será libertado manualmente após a confirmação do pagamento pelo WhatsApp.
                    </p>
                  </motion.div>
                )}

                {paymentMethod === 'paypal' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[2.5rem] p-8 space-y-4"
                  >
                    <div className="bg-primary/5 p-4 rounded-xl text-center">
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">Pagamento via PayPal</p>
                      <p className="text-[10px] text-on-surface-variant italic">
                        O PayPal não aceita Kwanza (AOA). <br />
                        O total de <b>{finalTotal.toFixed(2)} Kz</b> será processado como <b>{(finalTotal / 850).toFixed(2)} EUR</b>.
                      </p>
                    </div>

                    <PayPalButtons 
                      style={{ layout: "vertical", shape: "pill" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: (finalTotal / 850).toFixed(2),
                              currency_code: "EUR"
                            },
                          }],
                          intent: "CAPTURE"
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then(async (details) => {
                          // Logic to add all products to library
                          try {
                            const { data: { session } } = await supabase.auth.getSession();
                            const refId = localStorage.getItem('memoo_referrer_id');
                            
                            if (session?.user) {
                              const libraryItems = cart.map(item => ({
                                user_id: session.user.id,
                                product_id: item.id
                              }));
                              await supabase.from('library').insert(libraryItems);

                              // Reward referral if exists
                              if (refId) {
                                // Mark as completed
                                await supabase.from('referrals').update({ status: 'completed' }).eq('referrer_id', refId).eq('referred_user_id', session.user.id);
                                // Generate reward
                                const rewardCode = `RECOMPENSA-${Math.random().toString(36).substring(7).toUpperCase()}`;
                                await supabase.from('coupons').insert({ code: rewardCode, discount: 10 });
                                localStorage.removeItem('memoo_referrer_id');
                              }
                            }
                            clearCart();
                            setIsPending(false);
                            setShowSuccessModal(true);
                          } catch (err) {
                            console.error("Error saving purchase:", err);
                            alert("Pagamento recebido, mas houve um erro ao adicionar itens à biblioteca. Por favor contacte o suporte.");
                          }
                        });
                      }}
                      onError={(err) => {
                        console.error("PayPal Error:", err);
                        alert("Houve um problema ao iniciar o PayPal. Verifica se o 'Client ID' está configurado corretamente.");
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 sticky top-32">
              <h3 className="text-xl font-headline font-extrabold text-white mb-8">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-on-surface-variant font-bold">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} AOA</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 font-bold">
                    <span>Desconto</span>
                    <span>-{discount.toFixed(2)} AOA</span>
                  </div>
                )}
                <div className="h-px bg-white/5 my-4" />
                <div className="flex justify-between text-white text-2xl font-black">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} AOA</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tens um cupão?" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 outline-none uppercase font-bold"
                  />
                </div>
                <button 
                  onClick={handleApplyCoupon}
                  className="w-full bg-surface-container-highest text-on-surface py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
                >
                  Aplicar Cupão
                </button>
                {couponStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${couponStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                  >
                    {couponStatus.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {couponStatus.message}
                  </motion.div>
                )}
              </div>

              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <p className="text-[10px] text-on-surface-variant leading-relaxed text-center">
                  Ao finalizar a compra, concordas com os nossos <Link to="/termos" className="text-primary hover:underline">Termos de Serviço</Link> e <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-container-high w-full max-w-lg rounded-[3rem] p-8 sm:p-12 border border-white/10 shadow-2xl text-center overflow-hidden"
            >
              {/* Confetti-like elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  >
                    <CheckCircle size={48} className="text-primary" />
                  </motion.div>
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/30 rounded-full"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-headline font-extrabold text-white mb-4">
                {isPending ? 'Transferência Recebida!' : 'Pagamento efetuado!'}
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                {isPending 
                  ? 'Recebemos a tua notificação. O acesso será libertado assim que confirmarmos o depósito na nossa conta (geralmente em 24h).'
                  : 'Tudo pronto! As tuas escolhas foram adicionadas à tua biblioteca. Estás a um clique de começar a desfrutar do teu novo conteúdo.'
                }
              </p>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/perfil')}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <ShoppingBag size={24} />
                  Ir para a minha Biblioteca
                </button>
                
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 text-on-surface-variant font-bold hover:text-white transition-colors"
                >
                  Continuar a navegar
                </button>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
