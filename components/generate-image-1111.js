import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

async function generateImage1111(request) {
    // Validate request
    if (!request || typeof request !== 'object') {
        throw new Error('Invalid request parameter');
    }

    const parameters = {
        model_input: {
            ...request
        }
    };

    try {
        // Initial request
        const resp = await fetch(
            'https://model-4w5ojyvq.api.baseten.co/environments/production/async_predict', {
                method: "POST",
                headers: { 
                    'Authorization': `Api-Key ${process.env.BASETEN_API_KEY}`
                },
                body: JSON.stringify(parameters),
            }
        );

        // Debug the raw response
        const rawText = await resp.text();
        console.log('Raw API Response:', rawText);
        
        // Try to parse it manually
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error(`Invalid JSON response from API: ${rawText.substring(0, 100)}`);
        }

        const { request_id } = data;
        
        // Poll for results
        let attempts = 0;
        const maxAttempts = 30; // Adjust as needed
        
        while (attempts < maxAttempts) {
            // Use the correct status endpoint format
            const pollResp = await fetch(
                `https://model-4w5ojyvq.api.baseten.co/production/async_predict/status/${request_id}`, {
                    headers: {
                        'Authorization': `Api-Key ${process.env.BASETEN_API_KEY}`
                    }
                }
            );
            
            if (!pollResp.ok) {
                console.error(`Polling failed with status: ${pollResp.status}`);
                console.error('Attempted URL:', pollResp.url);
                throw new Error(`Polling request failed with status: ${pollResp.status}`);
            }
            
            const result = await pollResp.json();
            console.log('Poll Response:', result);
            
            if (result.status === 'COMPLETED') {  // Note: Status might be uppercase
                return result.output;  // Changed from response to output
            } else if (result.status === 'FAILED') {
                throw new Error('Image generation failed');
            }
            // Also handle IN_PROGRESS and QUEUED states
            
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        throw new Error('Timeout waiting for image generation');
    } catch (error) {
        console.error('Error in generateImage1111:', error.message);
        throw new Error(`Image generation failed: ${error.message}`);
    }
}

export default generateImage1111;
