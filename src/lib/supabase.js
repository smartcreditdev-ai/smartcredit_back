import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://muzjglimzoewwhysajmq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11empnbGltem9ld3doeXNham1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzU2NzMsImV4cCI6MjA3MTkxMTY3M30.mslntuUYTDjIFxg0xkID2wwShCQxmHDtdVmJU_m8Tx0'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11empnbGltem9ld3doeXNham1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMzNTY3MywiZXhwIjoyMDcxOTExNjczfQ.viTxCrU0vNj_o_ZNz_XDmzxRp0rVZY4ZmyLWDKH0ovM'

// Cliente para operaciones normales (con autenticación de usuario)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operaciones de administración (con service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Configuración para desarrollo
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  serviceRoleKey: supabaseServiceRoleKey
}
