import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Environment check:', {
        supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
        hasServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Yes' : 'No'
    });
    throw new Error('Missing Supabase credentials')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey) 