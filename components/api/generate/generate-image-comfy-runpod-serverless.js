import fetch from 'node-fetch';
import config from '../../../config.js';
import { saveImageDataComfy } from '../s3/saveImageDataComfy.js';
import { ImageComfysaveData } from '../supabase/ImageComfysaveData.js';

/**
 * Generates an image using the ComfyUI RunPod Serverless API.
 * Handles the API request, saves the generated image to S3, and stores metadata in Supabase.
 * 
 * @param {Object} request - The request object containing workflow parameters
 * @returns {Object} Object containing the image URL and success message
 * @throws {Error} If the API request fails or image processing encounters an error
 */
async function generateImageComfyRunPodServerless(request) {
    const subfolder = 'image-comfy-runpod-serverless';

    const parameters = {
        input: {
            workflow: {
                ...request
            }
        }
    };

    if (parameters.input.workflow.userId) {
        delete parameters.input.workflow.userId;
    }

    try {
        console.log('Sending parameters to RunPod:', JSON.stringify(parameters, null, 2));
        
        const response = await fetch(config.generateImageComfyRunpodServerlessApi, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
            },
            body: JSON.stringify(parameters),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('RunPod API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`External API error: ${response.statusText}. Details: ${errorText}`);
        }

        const jsonResponse = await response.json();
        console.log('RunPod API Response:', JSON.stringify(jsonResponse, null, 2));

        // Validate the response structure
        if (!jsonResponse || !jsonResponse.output || !jsonResponse.output.images) {
            console.error('Invalid response structure:', jsonResponse);
            throw new Error('Invalid API response structure: missing images data');
        }

        const timestamp = Date.now();

        // Save image data to S3
        const imageUrl = await saveImageDataComfy(
            jsonResponse,
            subfolder, 
            timestamp, 
            request.userId
        );

        // Save metadata to Supabase
        await ImageComfysaveData({
            userId: request.userId,
            imageUrl: imageUrl,
            subfolder: subfolder,
            parameters: parameters,
            timestamp: timestamp
        });

        return { 
            imageUrl, 
            info: "Image generated and saved successfully!" 
        };
    } catch (error) {
        console.error('Error in generateImageComfyRunPod:', error);
        throw error;
    }
}

export default generateImageComfyRunPodServerless;