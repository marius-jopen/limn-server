import express from 'express';
import ApiCall from './apicall.js';

const router = express.Router();

router.post('/generate-image-comfy-runpod-serverless', async (req, res) => {
  try {
    console.log('Endpoint: generate-image-comfy-runpod-serverless');

    const { info, data, request } = await ApiCall(req.body);
    
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