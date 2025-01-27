import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY  // Make sure this is the service_role key

console.log('Initializing Supabase with URL:', supabaseUrl ? 'URL exists' : 'URL missing')  // Debug env vars
console.log('API Key exists:', supabaseKey ? 'Yes' : 'No')  // Debug env vars

const supabase = createClient(supabaseUrl, supabaseKey)

async function saveToResource(userId, imageUrl, imageName, service, workflow) {
    console.log('Attempting to save with:', { userId, imageUrl, imageName, service, workflow });  // Debug log
    try {
        const { data, error } = await supabase
            .from('resource')
            .insert([{ 
                user_id: userId,
                image_url: imageUrl,
                image_name: imageName,
                service: service,
                workflow_name: workflow
            }])
            .select()

        if (error) {
            console.error('Supabase error:', error);  // Detailed error logging
            throw error;
        }
        console.log('Save successful, returned data:', data);  // Success log
        return data
    } catch (error) {
        console.error('Error in saveToResource:', error.message, error);  // More detailed error logging
        throw error
    }
}

export { saveToResource }
