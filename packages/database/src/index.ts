import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Public Instance for Frontend Client App Consumption.
 * Uses the anon key which is subject to Row-Level Security (RLS).
 */
export const createPublicClient = (supabaseUrl: string, supabaseAnonKey: string): SupabaseClient => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
};

/**
 * Isolated Service Role Instance for Secure Server-Side Environments Only.
 * Bypasses RLS - MUST NEVER be exposed to the client-side.
 */
export const createServerServiceRoleClient = (supabaseUrl: string, supabaseServiceRoleKey: string): SupabaseClient => {
  // Runtime guard against client-side leakage
  if (typeof window !== 'undefined') {
    throw new Error('CRITICAL SECURITY VIOLATION: SERVICE_ROLE_KEY DETECTED ON CLIENT LAYER.');
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
};
