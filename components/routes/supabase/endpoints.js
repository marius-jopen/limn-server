import express from 'express';
import ApiCallDelete from './apicall-delete.js';

const router = express.Router();

// Add the delete endpoint
router.post('/resources/:id/delete', async (req, res) => {
  try {
    const resourceId = req.params.id;
    const result = await ApiCallDelete(resourceId);
    
    res.json({ 
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });   
  }
});

export default router;
