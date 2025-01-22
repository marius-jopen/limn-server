import fetch from 'node-fetch';

async function ApiCallRunSync(request) {
    const parameters = {
        input: {
            workflow: {
                ...request
            }
        }
    };

    try {
        const response = await fetch(`${process.env.RUNPOD_DEFORUM_SERVERLESS}/runsync`, {
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
            info: "Image generated successfully!",
            request: request,
            data: data
        };

    } catch (error) {
        console.error('Error in ApiCallRunSync:', error);

        throw error;
    }
}

export default ApiCallRunSync;