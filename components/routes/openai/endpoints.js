import express from 'express';
import { ApiCallRun } from './apicall-run.js';

const router = express.Router();

router.post('/openai-runpod-serverless-run', async (req, res) => {
  try {
    const { info, data, request } = await ApiCallRun(req.body);    
    res.json({ info, request, data });
  } catch (error) {
    console.error('OpenAI endpoint error:', error);
    res.status(500).json({ error: 'Failed to process request', message: error.message });   
  }
});

export default router;