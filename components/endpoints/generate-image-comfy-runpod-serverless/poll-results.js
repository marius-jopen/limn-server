import fetch from 'node-fetch';

async function pollForResults(jobId, maxAttempts = 60, interval = 1000) {
  console.log('Starting job:', jobId);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${process.env.RUNPOD_COMFY_SERVERLESS}/status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
      }
    });
    
    const status = await response.json();
    const progress = Math.round((attempt / maxAttempts) * 100);
    
    console.log(`Status: ${status.status} (${progress}% of max time)`);
    
    if (status.status === 'COMPLETED') {
      console.log('Job completed successfully! ✅');
      return status.output;
    }
    
    if (status.status === 'FAILED') {
      console.log('Job failed! ❌');
      throw new Error('Job failed: ' + JSON.stringify(status));
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  console.log('Job timed out! ⏰');
  throw new Error('Timeout waiting for job completion');
}

export default pollForResults;