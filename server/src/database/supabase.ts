import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
}

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
