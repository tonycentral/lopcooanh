import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite environment variables or localStorage
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

  const url = (envUrl || localUrl).trim();
  const anonKey = (envKey || localKey).trim();

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

// Initialize Supabase client if configured, otherwise create a safe placeholder
export const supabase = config.isConfigured
  ? createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
