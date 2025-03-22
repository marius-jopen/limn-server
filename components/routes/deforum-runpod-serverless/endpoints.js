import express from 'express';
import ApiCallRun from './apicall-run.js';
import ApiCallHealth from './apicall-health.js';
import ApiCallStream from './apicall-stream.js';
import ApiCallCancel from './apicall-cancel.js';
import { saveToResource } from '../../supabase/save-generated.js';

const router = express.Router();
const workflowStorage = new Map(); // Simple in-memory storage

router.post('/deforum-runpod-serverless-run', async (req, res) => {
  try {
    // Parse connected batches from header
    let connectedBatches = [];
    try {
      if (req.headers['connected-batches']) {
        connectedBatches = JSON.parse(req.headers['connected-batches']);
        console.log('Received connected batches:', connectedBatches);
      }
    } catch (error) {
      console.error('Error parsing connected batches:', error);
    }
    
    const { info, data, request } = await ApiCallRun(req.body);
    
    // Store both the workflow and the connected batches
    workflowStorage.set(data.id, {
      workflow: req.body.input.workflow,
      connectedBatches: connectedBatches
    });
    
    console.log(`Job ${data.id} created with connected batches:`, connectedBatches);
    
    res.json({ 
      info: info,
      request: request,
      data: data
    });
  } catch (error) {
    // Error handling
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
    // console.error(error);
    res.status(500).json({ 
      error: 'Health check failed',
      message: error.message 
    });   
  }
});

router.get('/deforum-runpod-serverless-stream/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Get the stored data for this job
    const storedData = workflowStorage.get(jobId) || {};
    const workflow = storedData.workflow || null;
    const connectedBatches = storedData.connectedBatches || [];
    
    console.log(`Retrieved connected batches for job ${jobId}:`, connectedBatches);
    
    const userId = req.query.userId || req.headers['user-id'];
    const service = req.query.service || req.headers['service'];
    const workflowName = req.query.workflow || req.headers['workflow'];
    const batchName = req.query.batchName || req.headers['batch-name'] || extractBatchName(workflow);
    
    let savedImages = new Set(); // Track which images we've already saved
    
    await ApiCallStream(jobId, res, async (statusData) => {
      // Handle streamed images
      if (statusData.status === 'IN_PROGRESS' && statusData.stream) {
        for (const streamItem of statusData.stream) {
          if (streamItem.output?.images) {
            for (const image of streamItem.output.images) {
              if (!savedImages.has(image.url)) {
                try {
                  await saveToResource(
                    userId,
                    image.url,
                    image.name,
                    service,
                    workflowName,
                    workflow,
                    batchName,
                    connectedBatches  // Pass the connected batches
                  );
                  savedImages.add(image.url);
                  console.log(`Saved streamed image to Supabase with ${connectedBatches.length} connected batches`);
                } catch (saveError) {
                  console.error('Failed to save streamed image:', saveError);
                }
              }
            }
          }
        }
      }

      // Handle final output when job completes
      if (statusData.status === 'COMPLETED') {
        // Save any remaining images from final output
        if (statusData.output?.images) {
          for (const image of statusData.output.images) {
            if (!savedImages.has(image.url)) {
              try {
                await saveToResource(
                  userId,
                  image.url,
                  image.name,
                  service,
                  workflowName,
                  workflow,
                  batchName,
                  connectedBatches  // Pass the connected batches
                );
                savedImages.add(image.url);
                console.log(`Saved final image to Supabase with ${connectedBatches.length} connected batches`);
              } catch (saveError) {
                console.error('Failed to save final image:', saveError);
              }
            }
          }
        }
        
        workflowStorage.delete(jobId);
      }
    });
  } catch (error) {
    // Error handling
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
    // console.log(`Cancelling job ${jobId}`);
    
    const cancelData = await ApiCallCancel(jobId);
    res.json(cancelData);
  } catch (error) {
    // console.error('Cancel error:', error);
    res.status(500).json({ 
      error: 'Cancel request failed',
      message: error.message 
    });
  }
});

// Change back to ES modules export
export default router;