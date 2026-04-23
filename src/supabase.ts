import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL ou Anon Key ausentes. Verifica o teu ficheiro .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper para verificar a ligação
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
    if (error && error.code !== 'PGRST116') { // Ignora erro de tabela não existente, foca em ligação
      console.error('Erro ao ligar ao Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha na ligação ao Supabase:', err);
    return false;
  }
};
