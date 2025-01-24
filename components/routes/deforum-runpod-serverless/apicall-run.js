import fetch from 'node-fetch';

async function ApiCallRun(request) {
    console.log('Starting API call with request:', JSON.stringify(request, null, 2));
    
    const parameters = {
        input: {
            workflow: request.input.workflow,
            metadata: {
                user: request.input.user || 'default_user'
            }
        }
    };

    console.log('Sending parameters to RunPod:', JSON.stringify(parameters, null, 2));

    try {
        const response = await fetch(`https://api.runpod.ai/v2/${process.env.DEFORUM_SLS_ENDPOINT_ID}/run`, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
            },
            body: JSON.stringify(parameters),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('RunPod API error:', errorText);
            throw new Error(`External API error: ${response.statusText}\n${errorText}`);
        }

        const data = await response.json();
        console.log('RunPod API response:', JSON.stringify(data, null, 2));
  
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