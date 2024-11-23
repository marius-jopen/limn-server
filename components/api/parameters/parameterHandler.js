import { supabase } from '../../utils/supabaseClient.js';

export async function getImageParameters(imageName, userId) {
    console.log('Attempting to fetch parameters:', { imageName, userId });

    if (!userId || !imageName) {
        throw new Error('Both userId and imageName are required');
    }

    try {
        const { data, error } = await supabase
            .from('Image1111')
            .select('parameters')
            .eq('image_name', imageName)
            .eq('user_id', userId)
            .single();
            
        console.log('Supabase response:', { 
            data: data ? JSON.stringify(data.parameters, null, 2) : null, 
            error 
        });

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error(`No matching record was found in the database for this image and user.`);
            }
            throw error;
        }
        if (!data) {
            throw new Error('Parameters not found for this image');
        }
        
        return data.parameters;
    } catch (error) {
        console.error('Error in getImageParameters:', error);
        throw error;
    }
} 