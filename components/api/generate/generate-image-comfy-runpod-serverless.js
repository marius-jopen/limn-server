import fetch from 'node-fetch';
import config from '../../../config.js';
import { saveImageDataComfy } from '../s3/saveImageDataComfy.js';
import { ImageComfysaveData } from '../supabase/ImageComfysaveData.js';


async function generateImageComfyRunPodServerless(requestData) {
    const subfolder = 'image-comfy-runpod-serverless';

    const parameters = {
        input: {
            workflow: {
                ...requestData
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
            requestData.userId
        );

        // Save metadata to Supabase
        await ImageComfysaveData({
            userId: requestData.userId,
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
        console.error('Error in generateImageComfyRunPodServerless:', error);
        throw error;
    }
}

export default generateImageComfyRunPodServerless;