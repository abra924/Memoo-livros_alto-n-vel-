import { useEffect } from 'react';
import { supabase } from '../supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      // O Supabase processa automaticamente o hash (#access_token=...) na URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (window.opener) {
        if (error) {
          window.opener.postMessage({ type: 'OAUTH_ERROR', error: error.message }, '*');
        } else if (session) {
          window.opener.postMessage({ type: 'OAUTH_SUCCESS' }, '*');
        }
        
        // Pequeno delay para garantir que a mensagem chega ao pai
        setTimeout(() => window.close(), 800);
      } else {
        window.location.href = '/';
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold">Autenticando...</h2>
        <p className="text-on-surface-variant text-sm mt-2">Podes fechar esta janela se ela não fechar sozinha.</p>
      </div>
    </div>
  );
}
