import fetch from 'node-fetch';
import config from '../config.js';

async function generateTextLLMARunpodServerless(request) {
    const parameters = {
        input: {
            ...request
        }
    };

    try {
        const response = await fetch(config.generateTextLLMARunpodServerlessApi, {
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
        return { text: jsonResponse.output, info: "Text generated successfully!" };
    } catch (error) {
        console.error('Error in generateTextLLMARunpodServerless:', error);
        throw error;
    }
}

export default generateTextLLMARunpodServerless;
