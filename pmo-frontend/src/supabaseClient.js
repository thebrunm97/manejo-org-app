// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de segurança
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não encontradas!');
}

// Cria e exporta o nosso cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);