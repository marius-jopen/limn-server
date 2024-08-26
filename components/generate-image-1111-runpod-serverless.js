import fetch from 'node-fetch';
import config from '../config.js';
import { saveImageData } from './imageHelper.js';

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
        const imageUrl = await saveImageData(jsonResponse, subfolder);

        return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        console.error('Error in generateImage1111RunPod:', error);
        throw error;
    }
}

export default generateImage1111RunPodServerless;
