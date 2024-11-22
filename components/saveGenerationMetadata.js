import { supabase } from '../utils/supabaseClient.js';

export async function saveGenerationMetadata(data) {
    const { error } = await supabase
        .from('image_generations')
        .insert([{
            user_id: data.userId,
            prompt: data.prompt,
            image_url: data.imageUrl,
            subfolder: data.subfolder,
            parameters: data.parameters,
            timestamp: new Date().toISOString()
        }]);

    if (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
    }
} 