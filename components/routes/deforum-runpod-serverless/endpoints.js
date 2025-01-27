import express from 'express';
import ApiCallRun from './apicall-run.js';
import ApiCallHealth from './apicall-health.js';
import ApiCallStream from './apicall-stream.js';
import ApiCallCancel from './apicall-cancel.js';

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
    
    await ApiCallStream(jobId, res);

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
    
    const cancelData = await ApiCallCancel(jobId);
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