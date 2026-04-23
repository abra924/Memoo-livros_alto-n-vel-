import { useEffect } from 'react';
import { supabase } from '../supabase';

export default function LoginPopup() {
  useEffect(() => {
    const startLogin = async () => {
      // Aqui, como estamos numa janela real (não iFrame), o Google funciona!
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Popup login error:", error);
        // Se houver erro (ex: Auth provider não configurado), avisamos o utilizador
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'OAUTH_ERROR', 
            error: error.message + ' (Verifica se o Google Provider está ativo no Supabase)' 
          }, '*');
        }
        // Fechamos após um curto delay para não deixar a janela pendurada
        setTimeout(() => window.close(), 3000);
      }
    };

    startLogin();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center text-white px-6">
      <div className="text-center space-y-8 max-w-sm w-full">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto group"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-bold">A ligar ao Google</h2>
          <p className="text-on-surface-variant text-sm">
            Estamos a preparar a tua sessão segura. Se a janela não mudar automaticamente, clica no botão abaixo.
          </p>
        </div>

        <button 
          onClick={() => {
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth-callback`,
                queryParams: {
                  access_type: 'offline',
                  prompt: 'consent',
                }
              }
            });
          }}
          className="w-full bg-white text-black py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continuar com Google
        </button>

        <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">
          Segurança Memoo Livros
        </p>
      </div>
    </div>
  );
}
