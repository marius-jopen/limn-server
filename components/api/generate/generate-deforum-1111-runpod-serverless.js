import fetch from 'node-fetch';
import config from '../../../config.js';

async function generateDeforum1111RunpodPod(request) { 
    const parameters = {
        deforum_settings: {
            ...request
        }
    }

    try {
        console.log(config.generateImage1111RunpodPod + "/deforum_api/batches")
        
        const response = await fetch(config.generateImage1111RunpodPod + "/deforum_api/batches", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parameters),
        });

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        console.log("Received response:", jsonResponse);

        return { message: "Batch generation initiated successfully." };
    } catch (error) {
        console.error('Error in generateDeforum1111RunpodPod:', error);
        throw new Error('Batch generation failed.');
    }
}

export default generateDeforum1111RunpodPod;