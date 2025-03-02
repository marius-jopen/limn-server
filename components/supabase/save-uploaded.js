import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase configuration')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function saveToResource(userId, imageUrl, imageName) {
    try {
        const { data, error } = await supabase
            .from('resource')
            .insert([{ 
                user_id: userId,
                image_url: imageUrl,
                image_name: imageName,
                type: 'uploaded'  // Changed to 'uploaded' for uploaded images
            }])
            .select()

        if (error) {
            throw error
        }

        return data
    } catch (error) {
        throw new Error(`Failed to save resource: ${error.message}`)
    }
}

export { saveToResource }
