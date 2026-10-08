import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials for Lop Co Oanh IELTS app
const DEFAULT_SUPABASE_URL = 'https://ammqjvbdjmqggpzwusir.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_L-i8E4_2AK7_OrRTTjks9g_EtI6cihM';

// Get Supabase credentials from Vite environment variables or localStorage or defaults
export function getSupabaseConfig() {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

  let localUrl = '';
  let localKey = '';
  try {
    localUrl = localStorage.getItem('lopcooanh_supabase_url') || '';
    localKey = localStorage.getItem('lopcooanh_supabase_anon_key') || '';
  } catch (e) {
    console.debug(e);
  }

  const url = (envUrl || localUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (envKey || localKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http'))
  };
}

export function saveSupabaseConfig(url, anonKey) {
  try {
    localStorage.setItem('lopcooanh_supabase_url', (url || '').trim());
    localStorage.setItem('lopcooanh_supabase_anon_key', (anonKey || '').trim());
  } catch (e) {
    console.error(e);
  }
}

const config = getSupabaseConfig();

export const isSupabaseConfigured = config.isConfigured;

// Initialize Supabase client
export const supabase = config.isConfigured
  ? createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
