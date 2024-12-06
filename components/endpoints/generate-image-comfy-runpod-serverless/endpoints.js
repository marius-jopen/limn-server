import express from 'express';
import ApiCallRunsync from './apicall-runsync.js';
import ApiCallRun from './apicall-run.js';

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

export default router;