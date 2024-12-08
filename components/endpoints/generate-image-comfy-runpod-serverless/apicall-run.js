import fetch from 'node-fetch';

async function ApiCallRun(request) {
    const parameters = {
        input: {
            workflow: {
                ...request
            }
        }
    };

    try {
        const response = await fetch(`${process.env.RUNPOD_COMFY_SERVERLESS}/run`, {
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

        const data = await response.json();
  
        return {
            info: "Job started successfully!",
            request: request,
            data: data
        };

    } catch (error) {
        console.error('Error in ApiCallRun:', error);
        
        throw error;
    }
}

export default ApiCallRun;