import { createClient } from '@supabase/supabase-js';

// We don't have types/supabase generated yet, so we'll use a loose type for now or add one later.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);
