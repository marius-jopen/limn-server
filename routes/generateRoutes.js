import express from 'express';
import generateImage1111Local from '../components/generate-image-1111-local.js';
import generateImage1111RunPodServerless from '../components/generate-image-1111-runpod-serverless.js';
import generateImage1111RunpodPod from '../components/generate-image-1111-runpod-pod.js';
import generateDeforum1111RunpodPod from '../components/generate-deforum-1111-runpod-pod.js'; // Import the new function

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
    console.log(imageRequest)
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

export default router;
