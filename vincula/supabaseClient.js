// supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do Supabase
const SUPABASE_URL = 'https://bystowxoxcdciubugjsc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c3Rvd3hveGNkY2l1YnVnanNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTkxOTcsImV4cCI6MjA0Njk5NTE5N30.Zi8-LDhZh9ItcdcbuwyX92Xwdaoo5d6smnwqvP1Et5g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);