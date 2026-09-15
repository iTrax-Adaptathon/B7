const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Use service_role key for backend (bypasses RLS)

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Missing SUPABASE_URL or SUPABASE_KEY in backend/.env');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
  {
    auth: { persistSession: false },
    realtime: { transport: WebSocket },
  }
);

module.exports = supabase;
