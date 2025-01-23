async function ApiCallStatus(jobId) {
    const response = await fetch(`https://api.runpod.ai/v2/${process.env.COMFY_SLS_ENDPOINT_ID}/status/${jobId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error(`RunPod API error: ${response.statusText}`);
    }

    const status = await response.json();
    console.log('Raw RunPod Response:', JSON.stringify(status, null, 2));

    // Extract logs from the output if available
    let logs = [];
    
    // Check for logs in output.log format
    if (status.output && status.output.log) {
        logs.push({
            type: 'standard',
            message: status.output.log
        });
    }
    
    // Check for logs in output[0] format (when job is complete)
    if (status.output && Array.isArray(status.output) && status.output[0]) {
        const output = status.output[0];
        
        // Add status message
        if (output.status) {
            logs.push({
                type: 'worker',
                level: 'info',
                message: `Status: ${output.status}`,
                timestamp: new Date().toISOString()
            });
        }

        // Add any error messages
        if (output.error) {
            logs.push({
                type: 'error',
                message: output.error
            });
        }
    }

    // Add basic status information as logs
    logs.push({
        type: 'worker',
        level: 'info',
        message: `Status: ${status.status}`,
        timestamp: new Date().toISOString()
    });

    if (status.executionTime) {
        logs.push({
            type: 'worker',
            level: 'info',
            message: `Execution Time: ${status.executionTime}ms`,
            timestamp: new Date().toISOString()
        });
    }

    // Add logs to the status object
    status.logs = logs;
    status.endpointId = process.env.COMFY_SLS_ENDPOINT_ID;

    console.log('Extracted logs:', JSON.stringify(logs, null, 2));

    return status;
}

export default ApiCallStatus; 