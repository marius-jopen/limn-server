/**
 * Handles deletion of image records from the Supabase database
 * @module deleteImageRecord
 */

import { supabase } from '../../utils/supabaseClient.js';

/**
 * Deletes an image record from the Supabase database
 * 
 * @param {string} imageName - The name of the image file
 * @param {string} userId - The ID of the user who owns the image
 * @throws {Error} If the database operation fails
 */
export async function deleteImageRecord(imageName, userId) {
    console.log('Attempting to delete record:', { imageName, userId });
    
    const { error } = await supabase
        .from('Image1111')
        .delete()
        .eq('user_id', userId)
        .eq('image_name', imageName);

    if (error) {
        console.error('Error deleting from Supabase:', error);
        throw new Error('Failed to delete database record');
    }
    
    console.log('Successfully deleted record from database');
} 