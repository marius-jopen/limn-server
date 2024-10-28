import express from 'express';
import generateImage1111 from '../components/generate-image-1111.js';

const router = express.Router();

// POST endpoint for generating images on Baseten
router.post('/generate-image-1111', async (req, res) => {
  try {
    const imageRequest = req.body;
    await generateImage1111(imageRequest);
    res.json({ message: 'Request sent successfully' }); 
  } catch (error) {
    console.error('Error in /generate-image-1111:', error);
    res.status(500).json({ message: 'Error sending the request.' });
  }
});

export default router;  // Add this line to export the router
