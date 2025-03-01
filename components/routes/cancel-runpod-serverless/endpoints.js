import express from 'express';

import ApiCallHealth from './apicall-health.js';
import ApiCallCancel from './api-call-cancel.js';

const router = express.Router();


router.get('/cancel-runpod-serverless-health', async (req, res) => {
  try {
    const healthStatus = await ApiCallHealth();
    res.json(healthStatus);
  } catch (error) {
    // console.error('Health check failed:', error);
    res.status(500).json({ error: 'Health check failed', message: error.message });   
  }
});

router.post('/cancel-runpod-serverless/:jobId', async (req, res) => {
    const jobId = req.params.jobId;
    // console.log('=== Cancel Request Received ===');
    // console.log('JobID:', jobId);
    
    try {
        // console.log('Calling ApiCallCancel...');
        const result = await ApiCallCancel(jobId);
        // console.log('Cancel API Response:', result);
        res.json(result);
    } catch (error) {
        // console.error('Cancel API Error:', error);
        res.status(500).json({ error: 'Job cancellation failed', message: error.message });
    }
});

// Add a test endpoint to verify the router is working
router.get('/cancel-runpod-serverless/test', (req, res) => {
    // console.log('Test endpoint hit');
    res.json({ status: 'Router is working' });
});

export default router;