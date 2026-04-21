// Supabase client — falls back to stub mode if env vars are not set yet.
import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (url && anon) ? createClient(url, anon) : null
export const isLive   = Boolean(supabase)
