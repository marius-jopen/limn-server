import { supabase } from '../../utils/supabaseClient.js';

/**
 * Retrieves all images and their metadata for a specific user from Supabase
 * 
 * @param {Object} options - Query options
 * @param {string} options.userId - The ID of the user whose images to fetch
 * @param {string} [options.subfolder] - Optional subfolder to filter by
 * @param {number} [options.limit] - Optional limit of images to return
 * @param {number} [options.offset] - Optional offset for pagination
 * @param {string} [options.orderBy] - Field to order by (default: 'timestamp')
 * @param {boolean} [options.ascending] - Sort order (default: false)
 * @returns {Promise<Array>} Array of image objects with their metadata
 * @throws {Error} If the database operation fails
 */
export async function getImages({ 
    userId, 
    subfolder = null,
    limit = null,
    offset = null,
    orderBy = 'timestamp',
    ascending = false 
}) {
    try {
        console.log('Fetching images for user:', userId);

        let query = supabase
            .from('Image1111')
            .select('image_url, image_name, subfolder, parameters, timestamp')
            .eq('user_id', userId)
            .order(orderBy, { ascending });

        // Apply optional filters
        if (subfolder) {
            query = query.eq('subfolder', subfolder);
        }

        // Apply pagination if specified
        if (limit !== null) {
            query = query.range(
                offset || 0, 
                (offset || 0) + limit - 1
            );
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Database query error:', error);
            throw new Error('Failed to fetch images from database');
        }

        console.log(`Retrieved ${data.length} images for user`);
        return data;

    } catch (error) {
        console.error('Error in getImages:', error);
        throw error;
    }
} 