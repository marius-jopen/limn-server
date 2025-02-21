import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ApiCallDelete(resourceId) {
    try {
        const { data, error } = await supabase
            .from('resource')
            .update({ visibility: false })
            .eq('id', resourceId)
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw new Error(`Failed to delete resource: ${error.message}`);
    }
}

export default ApiCallDelete;
