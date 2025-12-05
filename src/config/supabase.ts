import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://aieccfvrulclrqsizxyr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZWNjZnZydWxjbHJxc2l6eHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTcwNjgsImV4cCI6MjA4MDQ3MzA2OH0.7NLuTTjq1Bv8peL3xRSZXcPp9po2jbaz9J7eDRcV9_s';

// Supabase 클라이언트 초기화
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY',
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
