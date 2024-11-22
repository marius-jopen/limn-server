import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

// Load environment variables
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    throw result.error;
}

console.log('Environment loaded:', {
    supabaseUrl: process.env.PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing'
}); 