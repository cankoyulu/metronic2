import { LocalAdapter } from './local-adapter';
import { SupabaseAdapter } from './supabase-adapter';

/**
 * Selects the auth backend. Defaults to the local (localStorage) adapter so the
 * demo runs with no external services. Set VITE_AUTH_MODE=supabase (and provide
 * VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / VITE_SUPABASE_SERVICE_ROLE_KEY)
 * to use the real Supabase project instead.
 */
const useSupabase = import.meta.env.VITE_AUTH_MODE === 'supabase';

export const AuthAdapter = useSupabase ? SupabaseAdapter : LocalAdapter;
