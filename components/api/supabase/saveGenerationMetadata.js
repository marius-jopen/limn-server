/**
 * Saves metadata about an image generation to the Supabase database.
 * This includes the user ID, prompt used, generated image URL, storage subfolder,
 * generation parameters, and timestamp.
 * 
 * @param {Object} data - The metadata to save
 * @param {string} data.userId - The ID of the user who generated the image
 * @param {string} data.prompt - The prompt used to generate the image
 * @param {string} data.imageUrl - URL of the generated image
 * @param {string} data.subfolder - Storage subfolder path
 * @param {Object} data.parameters - Parameters used for generation
 * @throws {Error} If the database operation fails
 */

import { supabase } from '../../utils/supabaseClient.js';

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