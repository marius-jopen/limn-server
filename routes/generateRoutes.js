import express from 'express';
import generateImage1111RunPodServerless from '../components/generate-image-1111-runpod-serverless.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

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

router.get('/images-1111-runpod-serverless', async (req, res) => {
  try {
    const outputDir = path.join(process.env.OUTPUT_DIR, 'image-1111-runpod-serverless');
    const files = await fs.readdir(outputDir);
    const images = files
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
      .map(file => `/image-1111-runpod-serverless/${file}`);  // This path should match your static file structure
    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images.' });
  }
});

export default router;
