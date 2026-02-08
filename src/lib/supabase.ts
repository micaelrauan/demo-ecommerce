import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error(`Supabase URL inválida: "${supabaseUrl}". Configure NEXT_PUBLIC_SUPABASE_URL no arquivo .env`);
}

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key não configurada. Configure NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
