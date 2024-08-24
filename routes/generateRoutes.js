import express from 'express';
import generateImage1111Local from '../components/generate-image-1111-local.js';
import generateImage1111RunPodServerless from '../components/generate-image-1111-runpod-serverless.js';
import path from 'path';

const router = express.Router();

// Define the base output directory
const outputDir = path.join('C:\\Users\\mail\\Github\\limn-output');

// POST endpoint for generating images locally
router.post('/generate-image-1111-local', async (req, res) => {
  try {
    const { prompt, steps, width, height } = req.body;
    const { imageUrl, info } = await generateImage1111Local(outputDir, { prompt, steps, width, height });

    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in /generate-image-1111-local:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

// POST endpoint for generating images on RunPod
router.post('/generate-image-1111-runpod-serverless', async (req, res) => {
  try {
    const { prompt, steps, width, height } = req.body;
    const { imageUrl, info } = await generateImage1111RunPodServerless(outputDir, { prompt, steps, width, height });

    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in /generate-image-1111-runpod:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

export default router;
