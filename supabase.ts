import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcuknmcbyiyjnsnuzeqk.supabase.co';
const supabaseKey = 'sb_publishable_FoXrx8FnQPGX2BAiALH3rQ_9-pFy8Nn';

export const supabase = createClient(supabaseUrl, supabaseKey);