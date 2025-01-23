import fetch from 'node-fetch';

async function pollForResults(jobId, maxAttempts = 360, interval = 500) {
  console.log('Starting job:', jobId);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`https://api.runpod.ai/v2/${process.env.COMFY_SLS_ENDPOINT_ID}/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text(); // Get raw response text first
      console.log(`Raw response for ${jobId}:`, text); // Log the raw response

      if (!text) {
        console.log(`Empty response received for ${jobId}`);
        await new Promise(resolve => setTimeout(resolve, interval));
        continue;
      }

      const status = JSON.parse(text);
      const progress = Math.round((attempt / maxAttempts) * 100);
      
      console.log(`${jobId} Status:`, JSON.stringify(status, null, 2)); // Log the full status object
      console.log(`${jobId} Progress: ${progress}% of max time`);
      
      if (status.status === 'COMPLETED') {
        console.log('Job completed successfully! ✅');
        console.log('Output:', JSON.stringify(status.output, null, 2)); // Log the output
        return status.output;
      }
      
      if (status.status === 'FAILED') {
        console.log(`${jobId} Job failed! ❌`);
        console.log('Failure details:', JSON.stringify(status, null, 2));
        throw new Error('Job failed: ' + JSON.stringify(status));
      }
    } catch (error) {
      console.error(`Error polling job ${jobId}:`, error);
      // If it's a JSON parsing error, wait and retry
      if (error instanceof SyntaxError) {
        await new Promise(resolve => setTimeout(resolve, interval));
        continue;
      }
      throw error; // Re-throw other errors
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  console.log(`${jobId} Job timed out! ⏰`);
  throw new Error('Timeout waiting for job completion');
}

export default pollForResults;