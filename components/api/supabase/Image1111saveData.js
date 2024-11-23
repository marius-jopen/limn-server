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

export async function Image1111saveData(data) {
    // Extract the image name from the full URL
    const imageName = data.imageUrl.split('/').pop();

    const { error } = await supabase
        .from('Image1111')
        .insert([{
            user_id: data.userId,
            image_url: data.imageUrl,
            image_name: imageName,
            subfolder: data.subfolder,
            parameters: data.parameters,
            timestamp: new Date(data.timestamp).toISOString()
        }]);

    if (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
    }
} 