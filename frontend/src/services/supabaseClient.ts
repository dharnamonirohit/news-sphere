import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('placeholder')
  );
};

// Singleton Supabase Client (initialized with valid dummy strings if not yet configured, avoiding client constructor crash)
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://demo-placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'demo-anon-key-placeholder-32-chars-long-abc'
);
