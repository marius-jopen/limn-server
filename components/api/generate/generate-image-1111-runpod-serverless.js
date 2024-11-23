import fetch from 'node-fetch';
import config from '../../../config.js';
import { saveImageData } from '../s3/saveImageData.js';
import { Image1111saveData } from '../supabase/Image1111saveData.js';

async function generateImage1111RunPodServerless(request) {
    const subfolder = 'image-1111-runpod-serverless';

    const parameters = {
        input: {
            ...request
        }
    };

    try {
        const response = await fetch(config.generateImage1111RunpodServerlessApi, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
            },
            body: JSON.stringify(parameters),
        });

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        const timestamp = Date.now();

        // Save image data to S3
        const imageUrl = await saveImageData(
            jsonResponse, 
            subfolder, 
            timestamp, 
            request.userId
        );

        // Save metadata to Supabase
        await Image1111saveData({
            userId: request.userId,
            imageUrl: imageUrl,
            subfolder: subfolder,
            parameters: parameters,
            timestamp: timestamp
        });

        return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        console.error('Error in generateImage1111RunPod:', error);
        throw error;
    }
}

export default generateImage1111RunPodServerless;
