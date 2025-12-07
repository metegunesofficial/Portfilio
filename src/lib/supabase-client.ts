// Tarayıcı tarafında Supabase istemcisi oluşturur
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let browserClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase ortam değişkenleri eksik')
  }
  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return browserClient
}

