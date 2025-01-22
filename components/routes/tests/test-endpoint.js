import express from 'express';

const router = express.Router();

router.post('/test', async (req, res) => {
  try {
    console.log('Test endpoint hit:', req.body);
    res.json({ 
      message: 'Test endpoint successful',
      receivedData: req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });   
  }
});

export default router;