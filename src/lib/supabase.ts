import { createClient } from "@supabase/supabase-js"

// Variáveis públicas do Next.js para conectar ao projeto Supabase.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Cliente único usado por todos os services para ler/escrever na BD e auth.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

