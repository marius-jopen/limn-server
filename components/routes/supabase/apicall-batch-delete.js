import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ApiCallBatchDelete(batchName) {
    try {
        const { data, error } = await supabase
            .from('resource')
            .update({ visibility: false })
            .eq('batch_name', batchName)
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw new Error(`Failed to delete batch: ${error.message}`);
    }
}

export default ApiCallBatchDelete; 