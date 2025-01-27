import express from 'express';
import ApiCallRun from './apicall-run.js';
import ApiCallHealth from './apicall-health.js';
import ApiCallStream from './apicall-stream.js';
import ApiCallCancel from './apicall-cancel.js';
import { saveToResource } from '../../supabase/save.js';

const router = express.Router();
const workflowStorage = new Map(); // Simple in-memory storage

router.post('/deforum-runpod-serverless-run', async (req, res) => {
  try {
    const { info, data, request } = await ApiCallRun(req.body);    
    workflowStorage.set(data.id, req.body.input.workflow);
    
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
    const userId = req.query.userId || req.headers['user-id'];
    const service = req.query.service || req.headers['service'];
    const workflowName = req.query.workflow || req.headers['workflow'];
    const batchName = req.query.batchName || req.headers['batch-name'] || extractBatchName(workflowStorage.get(jobId));
    
    console.log(`Getting stream for job ${jobId}`);
    
    let savedImages = new Set(); // Track which images we've already saved
    
    await ApiCallStream(jobId, res, async (status) => {
      if (status.status === 'COMPLETED') {
        const workflow = workflowStorage.get(jobId);
        
        // Handle final output images
        if (status.output?.images?.length > 0) {
          for (const image of status.output.images) {
            if (!savedImages.has(image.url)) {
              try {
                await saveToResource(
                  userId,
                  image.url,
                  image.name,
                  service,
                  workflowName,
                  workflow,
                  batchName
                );
                savedImages.add(image.url);
                console.log(`Saved final image to Supabase: ${image.url}, batch: ${batchName}`);
              } catch (saveError) {
                console.error('Failed to save final image:', saveError);
              }
            }
          }
        }
        
        // Handle streamed images from output array
        if (Array.isArray(status.output)) {
          for (const output of status.output) {
            if (output.images) {
              for (const image of output.images) {
                if (!savedImages.has(image.url)) {
                  try {
                    await saveToResource(
                      userId,
                      image.url,
                      image.name,
                      service,
                      workflowName,
                      workflow,
                      batchName
                    );
                    savedImages.add(image.url);
                    console.log(`Saved streamed image to Supabase: ${image.url}, batch: ${batchName}`);
                  } catch (saveError) {
                    console.error('Failed to save streamed image:', saveError);
                  }
                }
              }
            }
          }
        }
        
        workflowStorage.delete(jobId);
        console.log(`Total images saved for job ${jobId}: ${savedImages.size}`);
      }
    });

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

// Helper function to extract batch_name from workflow data (fallback)
function extractBatchName(workflow) {
  try {
    if (workflow && typeof workflow === 'object') {
      // Check for batch_name in deforum_settings
      if (workflow.deforum_settings?.batch_name) {
        return workflow.deforum_settings.batch_name;
      }
      return 'unknown-batch';
    }
    return 'unknown-batch';
  } catch (error) {
    console.error('Error extracting batch name:', error);
    return 'unknown-batch';
  }
}

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