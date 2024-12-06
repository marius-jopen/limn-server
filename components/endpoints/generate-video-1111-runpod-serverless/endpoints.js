import express from 'express';
import ApiCallRunsync from './apicall-runsync.js';

const router = express.Router();

router.post('/generate-video-1111-runpod-serverless-runsync', async (req, res) => {
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

export default router;