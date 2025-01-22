import express from 'express';
import ApiCallRunSync from './apicall-runsync.js';
import ApiCallHealth from './apicall-health.js';

const router = express.Router();

router.post('/a1111-runpod-serverless-runsync', async (req, res) => {
  try {
    const { info, data, request } = await ApiCallRunSync(req.body);
    
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

router.get('/a1111-runpod-serverless-health', async (req, res) => {
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