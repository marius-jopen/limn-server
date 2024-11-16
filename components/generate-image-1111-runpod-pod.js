import fetch from 'node-fetch';
import config from '../config.js';
import { saveImageData } from './saveImageData.js';

async function generateImage1111RunpodPod(request) {
    const subfolder = 'image-1111-runpod-pod';

    try {
        console.log(await fetch(config.generateImage1111RunpodPod + "/sdapi/v1/txt2img"))
        const response = await fetch(config.generateImage1111RunpodPod + "/sdapi/v1/txt2img", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        const imageUrl = await saveImageData(jsonResponse, subfolder);

        return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        console.error('Error in generateImage1111RunpodPod:', error);
        throw error;
    }
}

export default generateImage1111RunpodPod;