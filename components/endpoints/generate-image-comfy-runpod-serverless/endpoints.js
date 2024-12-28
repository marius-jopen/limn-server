import express from 'express';
import ApiCallRunsync from './apicall-runsync.js';
import ApiCallRun from './apicall-run.js';
import ApiCallHealth from './apicall-health.js';
import pollForResults from './poll-results.js';

const router = express.Router();

router.post('/generate-image-comfy-runpod-serverless-runsync', async (req, res) => {
  try {
    const { info, data, request } = await ApiCallRunsync(req.body);
    
    res.json({ 
      info: info,
      request: request,
      data: data
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ 
      error: 'Internal server error'
    });   
  }
});

router.post('/generate-image-comfy-runpod-serverless-run', async (req, res) => {
  try {
    const { info, data, request } = await ApiCallRun(req.body);    
    const jobId = data.id;
    const result = await pollForResults(jobId);
    
    delete data.status; // Stale status is not needed

    res.json({ 
      info: info,
      request: request,
      data: data,
      result: result  // This will contain the final image URLs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Internal server error'
    });   
  }
});

router.get('/generate-image-comfy-runpod-serverless-health', async (req, res) => {
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

export default router;