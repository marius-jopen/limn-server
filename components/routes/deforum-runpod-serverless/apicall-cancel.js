async function ApiCallCancel(jobId) {
  const cancelUrl = `https://api.runpod.ai/v2/${process.env.DEFORUM_SLS_ENDPOINT_ID}/cancel/${jobId}`;
  const cancelResponse = await fetch(cancelUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
    }
  });

  if (!cancelResponse.ok) {
    throw new Error(`Cancel request failed with status: ${cancelResponse.status}`);
  }

  const cancelData = await cancelResponse.json();
  console.log(`Cancel response for job ${jobId}:`, cancelData);
  
  return cancelData;
}

export default ApiCallCancel; 