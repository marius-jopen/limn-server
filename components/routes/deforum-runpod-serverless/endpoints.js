import express from 'express';
import ApiCallRun from './apicall-run.js';
import ApiCallHealth from './apicall-health.js';

const router = express.Router();

router.post('/deforum-runpod-serverless-run', async (req, res) => {
  try {
    const { info, data, request } = await ApiCallRun(req.body);    
    
    res.json({ 
      info: info,
      request: request,
      data: data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });   
  }
});

router.get('/deforum-runpod-serverless-health', async (req, res) => {
  try {
    const healthStatus = await ApiCallHealth();
    
    res.json(healthStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Health check failed',
      message: error.message 
    });   
  }
});

router.get('/deforum-runpod-serverless-stream/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    console.log(`Getting stream for job ${jobId}`);
    
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

  } catch (error) {
    console.error('Stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Stream failed',
        message: error.message 
      });
    } else {
      res.write(`data: ${JSON.stringify({ status: 'ERROR', error: error.message })}\n\n`);
      res.end();
    }
  }
});

router.post('/deforum-runpod-serverless-cancel/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    console.log(`Cancelling job ${jobId}`);
    
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

    res.json(cancelData);
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ 
      error: 'Cancel request failed',
      message: error.message 
    });
  }
});

// Change back to ES modules export
export default router;