import fetch from 'node-fetch';

async function ApiCallHealth() {
    try {
        const response = await fetch(`${process.env.RUNPOD_COMFY_SERVERLESS}/health`, {
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