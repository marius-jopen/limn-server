import { saveToResource } from '../../supabase/save.js';

async function ApiCallStream(jobId, res, onCompleted = null) {
  // Set streaming headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let isCompleted = false;
  
  while (!isCompleted) {
    const statusUrl = `https://api.runpod.ai/v2/${process.env.DEFORUM_SLS_ENDPOINT_ID}/status/${jobId}`;
    const statusResponse = await fetch(statusUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Status check failed with status: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    console.log(`Status check for job ${jobId}:`, statusData);

    // Send the status update
    res.write(`data: ${JSON.stringify(statusData)}\n\n`);

    // If we have a final status, end the stream
    if (statusData.status === 'COMPLETED' || statusData.status === 'FAILED' || statusData.status === 'CANCELLED') {
      isCompleted = true;
      // Call the completion callback if provided
      if (onCompleted && typeof onCompleted === 'function') {
        await onCompleted(statusData);
      }
      break;
    }

    // If the job is running, get the stream results
    if (statusData.status === 'IN_PROGRESS') {
      const streamUrl = `https://api.runpod.ai/v2/${process.env.DEFORUM_SLS_ENDPOINT_ID}/stream/${jobId}`;
      const streamResponse = await fetch(streamUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
        }
      });

      if (streamResponse.ok) {
        const streamData = await streamResponse.json();
        if (streamData.stream) {
          res.write(`data: ${JSON.stringify(streamData)}\n\n`);
        }
      }
    }

    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`Stream completed for job ${jobId}`);
  res.end();
}

export default ApiCallStream; 