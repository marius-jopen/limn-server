import express from 'express';
import ApiCallRun from './apicall-run.js';
import ApiCallStatus from './apicall-status.js';
import ApiCallHealth from './apicall-health.js';
import { saveToResource } from '../../supabase/save.js';

const router = express.Router();
const workflowStorage = new Map(); // Simple in-memory storage

router.post('/a1111-runpod-serverless-run', async (req, res) => {
  try {
    const { info, data, request } = await ApiCallRun(req.body);    
    workflowStorage.set(data.id, req.body.input.workflow);
    res.json({ info, request, data });
  } catch (error) {
    console.error('Run endpoint error:', error);
    res.status(500).json({ error: 'Failed to process workflow', message: error.message });   
  }
});

router.get('/a1111-runpod-serverless-status/:jobId', async (req, res) => {
  try {
    const status = await ApiCallStatus(req.params.jobId);
    
    if (status.status === 'COMPLETED' && status.output?.[1]?.images?.[0]) {
      const { url: imageUrl, name: imageName } = status.output[1].images[0];
      const workflow = workflowStorage.get(req.params.jobId);
      const userId = req.query.userId || req.headers['user-id'];
      const service = req.query.service || req.headers['service'];
      const workflowName = req.query.workflow || req.headers['workflow'];
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
      }

      try {
        await saveToResource(userId, imageUrl, imageName, service, workflowName, workflow);
        workflowStorage.delete(req.params.jobId);
      } catch (saveError) {
        return res.status(500).json({ error: 'Failed to save image', message: saveError.message });
      }
    }
    
    res.json(status);
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({ error: 'Status check failed', message: error.message });   
  }
});

router.get('/a1111-runpod-serverless-health', async (req, res) => {
  try {
    const healthStatus = await ApiCallHealth();
    res.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ error: 'Health check failed', message: error.message });   
  }
});

export default router;