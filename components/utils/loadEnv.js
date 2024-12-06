/**
 * Environment Variable Loader
 * 
 * This utility script is responsible for:
 * - Loading environment variables from a .env file located in the project root
 * - Validating that critical environment variables are present
 * - Providing path resolution for the .env file location using ES modules
 * 
 * The script will throw an error if the .env file cannot be loaded
 * and logs the presence/absence of critical Supabase configuration variables.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '..', '.env');

// Load environment variables with error handling
try {
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        throw result.error;
    }
    
    // console.log('Environment loaded:', {
    //     supabaseUrl: process.env.PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
    //     serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing'
    // });
} catch (error) {
    if (error.code === 'ENOENT') {
        console.warn(`Warning: .env file not found at ${envPath}\nPlease create a .env file with required environment variables.`);
    } else {
        console.error('Error loading .env file:', error);
        throw error;
    }
} 