import express from 'express';
import ApiCallRun from './apicall-run.js';
import ApiCallStatus from './apicall-status.js';
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

router.get('/deforum-runpod-serverless-status/:jobId', async (req, res) => {
  try {
    const status = await ApiCallStatus(req.params.jobId);
    res.json(status);
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({ 
      error: 'Status check failed',
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

export default router;