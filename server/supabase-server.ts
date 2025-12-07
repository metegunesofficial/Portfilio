// Sunucu tarafı işlemler için Supabase servis istemcisi
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/supabase'

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

let serverClient: SupabaseClient<Database> | null = null

export function getServiceClient(): SupabaseClient<Database> {
  if (serverClient) return serverClient
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase servis anahtarı veya URL eksik')
  }
  serverClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return serverClient
}

