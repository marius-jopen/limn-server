import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ApiCallLike(resourceId) {
    try {
        // First, get the current state of the liked column
        const { data: currentState, error: fetchError } = await supabase
            .from('resource')
            .select('liked')
            .eq('id', resourceId)
            .single();

        if (fetchError) {
            throw fetchError;
        }

        // Toggle the liked state
        const newLikedState = !currentState.liked;

        // Update with the new state
        const { data, error } = await supabase
            .from('resource')
            .update({ liked: newLikedState })
            .eq('id', resourceId)
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw new Error(`Failed to toggle like state: ${error.message}`);
    }
}

export default ApiCallLike;
