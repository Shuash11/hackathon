import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabase: SupabaseClient = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { detectSessionInUrl: true, persistSession: true, flowType: 'pkce' },
  })
  return { provide: { supabase } }
})
