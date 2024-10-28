import express from 'express';

const router = express.Router();

// POST endpoint for generating images on Baseten serverless
router.post('/generate-image-1111-baseten-serverless', async (req, res) => {
  try {
    const imageRequest = req.body;
    const { imageUrl, info } = await generateImage1111BasetenServerless(imageRequest);
    res.json({ imageUrl, info });
  } catch (error) {
    console.error('Error in /generate-image-1111-baseten-serverless:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

export default router;
