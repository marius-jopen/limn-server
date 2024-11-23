import express from 'express';
import generateImage1111Local from '../api/generate/generate-image-1111-local.js';
import generateImage1111RunPodServerless from '../api/generate/generate-image-1111-runpod-serverless.js';
import generateImage1111RunpodPod from '../api/generate/generate-image-1111-runpod-pod.js';
import generateDeforum1111RunpodPod from '../api/generate/generate-deforum-1111-runpod-pod.js';
import { getAllFiles } from '../api/s3/get-all-files.js';
import { serveImages } from '../api/s3/serveImages.js';
import { deleteImage } from '../api/s3/deleteImage.js';
import { getImageParameters } from '../api/parameters/parameterHandler.js';
import { deleteImageRecord } from '../api/supabase/deleteImageRecord.js';

const router = express.Router();

// POST endpoint for generating images locally
router.post('/generate-image-1111-local', async (req, res) => {
  try {
    const imageRequest = req.body;
    const { imageUrl, info } = await generateImage1111Local(imageRequest);
    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in /generate-image-1111-local:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

// POST endpoint for generating images on RunPod serverless
router.post('/generate-image-1111-runpod-serverless', async (req, res) => {
  try {
    const imageRequest = req.body;
    const { imageUrl, info } = await generateImage1111RunPodServerless(imageRequest);
    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in /generate-image-1111-runpod-serverless:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

// POST endpoint for generating images on RunPod real pod
router.post('/generate-image-1111-runpod-pod', async (req, res) => {
  try {
    const imageRequest = req.body;
    const { imageUrl, info } = await generateImage1111RunpodPod(imageRequest);
    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in /generate-image-1111-runpod-pod:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

// POST endpoint for generating images using Deforum on RunPod real pod
router.post('/generate-deforum-1111-runpod-pod', async (req, res) => {
  try {
    const result = await generateDeforum1111RunpodPod(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in /generate-deforum-1111-runpod-pod:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET endpoint for fetching all images for a user
router.get('/output', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const images = await getAllFiles(userId);
    res.json({ images });
  } catch (error) {
    console.error('Error in /output route:', error);
    res.status(500).json({ 
      message: 'Error fetching images',
      error: error.message 
    });
  }
});

// GET endpoint for serving images
router.get('/output/*', async (req, res) => {
  try {
    const { userId } = req.query;
    const imagePath = req.params[0];
    const response = await serveImages(imagePath, userId);
    res.setHeader('Content-Type', response.ContentType || 'image/jpeg');
    response.Body.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(404).send('Image not found');
  }
});

// DELETE endpoint for deleting images
router.delete('/output/*', async (req, res) => {
  try {
    const { userId } = req.query;
    const imagePath = req.params[0];
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    console.log('Delete request received:', { userId, imagePath });
    
    // Delete from S3
    await deleteImage(imagePath, userId);
    
    // Delete from Supabase
    const imageName = imagePath.split('/').pop();
    await deleteImageRecord(imageName, userId);
    
    res.status(200).json({ message: 'Image deleted successfully from S3 and database' });
  } catch (error) {
    console.error('Error during deletion:', error);
    res.status(404).json({ 
      message: 'Error during deletion process', 
      error: error.message 
    });
  }
});

// NEW: POST endpoint for fetching image parameters
router.post('/api/parameters', async (req, res) => {
    try {
        const { imageName, userId } = req.body;
        const parameters = await getImageParameters(imageName, userId);
        res.json(parameters);
    } catch (error) {
        console.error('Error fetching parameters:', error);
        res.status(error.message.includes('required') ? 400 : 500).json({ 
            error: error.message 
        });
    }
});

export default router;
