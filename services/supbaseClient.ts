import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// --- DEBUGGING LOGS ---
console.log("--- SUPABASE CONFIG CHECK ---");
console.log("URL:", supabaseUrl ? "✅ Found" : "❌ MISSING (Undefined)");
console.log("KEY:", supabaseAnonKey ? "✅ Found" : "❌ MISSING (Undefined)");
// ----------------------

if (!supabaseUrl || !supabaseAnonKey) {
  // This will pop up a window alert if keys are missing
  alert("ERROR: Supabase URL or Key is missing! \n\n1. Check your .env file.\n2. Restart the terminal (npm run dev).");
  throw new Error('Supabase Url or Key missing');
}




export const supabase = createClient(supabaseUrl, supabaseAnonKey)
