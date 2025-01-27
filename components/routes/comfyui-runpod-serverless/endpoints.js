import express from 'express';
import ApiCallRun from './apicall-run.js';
import ApiCallStatus from './apicall-status.js';
import ApiCallHealth from './apicall-health.js';
import { saveToResource } from '../../supabase/save.js';

const router = express.Router();

router.post('/comfyui-runpod-serverless-run', async (req, res) => {
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

router.get('/comfyui-runpod-serverless-status/:jobId', async (req, res) => {
  try {
    const status = await ApiCallStatus(req.params.jobId);
    res.json(status);
    
    // Only process completed jobs with image output
    if (status.status === 'COMPLETED' && status.output?.[0]?.images?.[0]) {
      const { name: imageName, url: imageUrl } = status.output[0].images[0];
      
      const userId = req.query.userId || req.headers['user-id'];
      const service = req.query.service || req.headers['service'];
      const workflow = req.query.workflow || req.headers['workflow'];
      
      if (!userId) {
        console.error('No userId provided for saving image');
        return;
      }

      try {
        const saveResult = await saveToResource(userId, imageUrl, imageName, service, workflow);
        console.log('Image saved:', { imageName, imageUrl, service, workflow, saveResult });
      } catch (saveError) {
        console.error('Failed to save image:', saveError);
      }
    } 
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({ 
      error: 'Status check failed', 
      message: error.message 
    });   
  }
});

router.get('/comfyui-runpod-serverless-health', async (req, res) => {
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