import express from 'express';
import generateImage1111Local from '../components/generate-image-1111-local.js';
import generateImage1111RunPodServerless from '../components/generate-image-1111-runpod-serverless.js';
import generateImage1111RunpodPod from '../components/generate-image-1111-runpod-pod.js';
import generateDeforum1111RunpodPod from '../components/generate-deforum-1111-runpod-pod.js'; // Import the new function
import { getAllFiles } from '../components/get-all-files.js';  // Add .js extension
import { serveImages, deleteImage } from '../components/serveImages.js';
import { supabase } from '../utils/supabaseClient.js';  // Add this import at the top

import path from 'path';  // Add this import at the top with other imports

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

router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

router.delete('/output/*', async (req, res) => {
  try {
    const { userId } = req.query;
    const imagePath = req.params[0];
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    console.log('Delete request received:', { userId, imagePath });
    await deleteImage(imagePath, userId);
    
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(404).json({ message: 'Error deleting image', error: error.message });
  }
});

// Add this new test route
router.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('image_generations')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    res.json({ 
      message: 'Supabase connection successful', 
      data 
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    res.status(500).json({ 
      message: 'Supabase connection failed', 
      error: error.message 
    });
  }
});

export default router;
