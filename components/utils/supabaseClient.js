/**
 * Supabase Client Configuration
 * 
 * This module initializes and exports a Supabase client instance using environment variables.
 * It creates a connection to the Supabase backend using the service role key for full administrative access.
 * The service role key provides unrestricted access and should only be used server-side.
 * 
 * Environment variables required:
 * - PUBLIC_SUPABASE_URL: The URL of your Supabase project
 * - SUPABASE_SERVICE_ROLE_KEY: The service role key for administrative access
 */

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