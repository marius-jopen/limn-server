import fetch from 'node-fetch';

async function ApiCallCancel(jobId) {
    try {
        const response = await fetch(
            `https://api.runpod.ai/v2/${process.env.UTILITY_SLS_ENDPOINT_ID}/run`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
                },
                body: JSON.stringify({
                    "input": {
                        "task": {
                            "command": "cancel",
                            "args": [
                                jobId
                            ]
                        }
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Cancel request failed: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('RunPod API response:', data);

        return {
            info: "Cancel request completed",
            status: data.status,
            data: data
        };

    } catch (error) {
        console.error('Error in ApiCallCancel:', error);
        throw error;
    }
}

export default ApiCallCancel;