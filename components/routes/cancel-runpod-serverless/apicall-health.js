// This is a health check for the A1111 RunPod Serverless endpoint
// It's working as expected

import fetch from 'node-fetch';

async function ApiCallHealth() {
    try {
        const response = await fetch(`https://api.runpod.ai/v2/${process.env.UTILITY_SLS_ENDPOINT_ID}/health`, {
            method: "GET",
            headers: { 
                'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Health check failed: ${response.statusText}`);
        }

        const data = await response.json();
  
        return {
            info: "Health check completed",
            status: data.status,
            data: data
        };

    } catch (error) {
        console.error('Error in ApiCallHealth:', error);
        throw error;
    }
}

export default ApiCallHealth;